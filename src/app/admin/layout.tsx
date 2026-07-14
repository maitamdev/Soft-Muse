import React from "react";
import { ThemeProvider } from "@/components/admin/providers/ThemeProvider";

// ThemeProvider is mounted ONCE here, as the shared ancestor of both
// /admin/login and /admin/(dashboard). next-themes' no-flash inline <script>
// is then emitted only in the server HTML of whichever admin route is first
// hard-loaded, and — because this layout stays mounted across client-side
// navigation between those two segments (e.g. the post-login redirect) —
// it is never torn down and re-created purely on the client, which is what
// previously triggered React's "script tag" warning.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
 return <ThemeProvider>{children}</ThemeProvider>;
}
