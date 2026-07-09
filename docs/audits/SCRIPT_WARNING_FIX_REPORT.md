# Script Warning Fix Report

## Error

```
Encountered a script tag while rendering React component.
Scripts inside React components are never executed when rendering on the client.
Consider using template tag instead.

src/components/admin/providers/ThemeProvider.tsx
```

Stack: `ThemeProvider` → `DashboardLayout` (`src/app/admin/(dashboard)/layout.tsx`)

## Root Cause

`ThemeProvider.tsx` itself renders nothing but `next-themes`' `<NextThemesProvider>`.
`next-themes` (v0.4.6, confirmed in `node_modules/next-themes/dist/index.mjs`)
internally renders a raw `<script>` element — a memoized component that emits an
inline no-FOUC theme-initializer script:

```js
t.createElement("script", { ...w, suppressHydrationWarning: true, nonce: ...,
  dangerouslySetInnerHTML: { __html: `(${M.toString()})(${p})` } })
```

This is normal, required behavior: the script must run once, before paint, to set
the `class`/`data-theme` attribute on `<html>` and avoid a light/dark flash. It only
works correctly when it is part of the **raw HTML the browser parses** on a hard
page load — browsers do not execute `<script>` tags that are inserted afterwards
via DOM APIs (which is what React's client renderer does for any content that
wasn't part of the initial document).

Before this fix, there were **two separate mount points** for the admin
`ThemeProvider`:

- `src/app/admin/login/layout.tsx`
- `src/app/admin/(dashboard)/layout.tsx`

`LoginScreen.tsx` (`src/components/admin/auth/LoginScreen.tsx:140`) redirects on
successful login with `router.push("/admin")` — a **client-side (soft) navigation**.
Because the login segment and the dashboard segment each had their own,
independent `ThemeProvider` instance, this navigation unmounted the login layout's
`ThemeProvider` (and its script) and mounted a brand-new one inside
`DashboardLayout` purely via React's client renderer/RSC payload — never as part
of a parsed HTML document. React 19 correctly flagged that newly-inserted
`<script>` node with this warning.

This is why it started "now": the two admin layouts were recently split to each
mount `ThemeProvider` independently (both carried comments explaining the
single-layout SSR-inlining trick), which fixed the hard-navigation/hydration case
but introduced this new client-side-remount case for the login → dashboard
transition.

**Not the cause:** the JSON-LD `<script>` in `src/app/layout.tsx` (root layout,
storefront) — that layout is not part of the reported stack trace and is never
remounted by admin-section navigation. CMS content, third-party scripts, and
`dangerouslySetInnerHTML` HTML injection were also ruled out — no such content
render path leads into `ThemeProvider`.

## Fix

Consolidated the admin section's `ThemeProvider` into a single shared ancestor
layout, `src/app/admin/layout.tsx`, which wraps both `/admin/login` and
`/admin/(dashboard)`:

```tsx
// src/app/admin/layout.tsx
import { ThemeProvider } from "@/components/admin/providers/ThemeProvider";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
```

`src/app/admin/login/layout.tsx` and `src/app/admin/(dashboard)/layout.tsx` no
longer mount their own `ThemeProvider` — they just pass `children` through
(metadata exports on both are untouched).

Because this shared layout is a **common ancestor** of both segments, Next.js
keeps it mounted across client-side navigation between `/admin/login` and
`/admin/(dashboard)` (including the `router.push("/admin")` post-login redirect).
The `next-themes` script node is therefore created exactly once — either as part
of the server-rendered HTML on whichever admin URL is hit first, or (if ever
needed) it is simply never re-created by a client-only commit, since the same
component instance persists.

## Files Inspected

- `src/components/admin/providers/ThemeProvider.tsx`
- `src/app/admin/(dashboard)/layout.tsx`
- `src/app/admin/login/layout.tsx`
- `src/app/admin/login/page.tsx`
- `src/components/admin/auth/LoginScreen.tsx`
- `src/components/admin/layout/AdminLayoutWrapper.tsx`
- `src/app/admin/(dashboard)/website/layout.tsx`
- `src/app/layout.tsx` (root layout — JSON-LD script, ruled out)
- `src/components/layout/ThemeProvider.tsx` (unrelated storefront CSS-var provider, not next-themes)
- `node_modules/next-themes/dist/index.mjs` (v0.4.6 source, confirmed internal `<script>` element)

## Files Modified

- `src/app/admin/layout.tsx` — **new**, shared `ThemeProvider` mount point
- `src/app/admin/(dashboard)/layout.tsx` — removed local `ThemeProvider` wrap
- `src/app/admin/login/layout.tsx` — removed local `ThemeProvider` wrap

No other files were touched.

## Why This Fix Is Safe

- `ThemeProvider` and `next-themes` are unchanged — same component, same props
  (`attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`,
  `disableTransitionOnChange`), just mounted one level higher.
- Only affects the `/admin/*` route subtree — the root layout, storefront, and
  `StorefrontLayoutWrapper` are untouched, so storefront appearance is unaffected.
- No routing, redirect, or auth logic was changed — `router.push("/admin")` in
  `LoginScreen.tsx` is untouched, and the `/admin` auth-guard redirect (307 to
  `/admin/login` when unauthenticated) still behaves identically (verified below).
- No business logic, `EventBus`, `HomepageService`, or `StoreService` code was
  touched.
- The warning is fixed at its structural source (why a new `<script>` node was
  being created via client render), not suppressed, hidden, or worked around.

## What Was Intentionally NOT Changed

- `next-themes` was not replaced, upgraded, or patched.
- The login redirect (`router.push`) was not changed to a hard navigation —
  doing so would have touched authentication/navigation behavior, which is
  out of scope and forbidden by the task constraints.
- The root `app/layout.tsx` JSON-LD script was left as-is (unrelated, confirmed
  not part of the reported stack).
- `AdminLayoutWrapper`, `Sidebar`, `Topbar`, `PermissionProvider`, and all other
  admin dashboard architecture were left untouched.
- No refactor, cleanup, or unrelated code changes were made.

## Build Status

```
npx tsc --noEmit   → 0 errors
npm run lint       → 0 errors/warnings
npm run build      → ✓ Compiled successfully, all 70 routes generated
```

## Validation Results

- **TypeScript**: clean, no errors.
- **ESLint**: clean, no errors or warnings.
- **Production build**: succeeds; all admin routes (`/admin`, `/admin/login`,
  `/admin/orders`, `/admin/products`, etc.) still statically/dynamically
  generated exactly as before — no route was added, removed, or changed.
- **SSR script inlining verified**: fetched `/admin/login` directly (`curl`) and
  confirmed the `next-themes` no-flash script (`documentElement`) is present
  inline in the raw server HTML, i.e. still executes before paint on a hard load
  — no flash of unstyled/wrong theme.
- **Auth guard verified**: fetching `/admin` unauthenticated still returns `307`
  redirecting to `/admin/login`, confirming routing/middleware behavior is
  unchanged.
- **No new hydration warnings**: build and dev server logs show no hydration
  mismatches introduced by the layout consolidation.
- Theme switching, dark mode, and appearance settings rely entirely on
  `next-themes`' React context/`useLayoutEffect` (not the script, which only
  runs once pre-hydration) — since the same `ThemeProvider` component and props
  are still in the tree, this behavior is unchanged.
