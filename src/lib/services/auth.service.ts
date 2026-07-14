import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { eventBus } from "@/lib/events/EventBus";

export type AuthErrorCode = "invalid_credentials" | "account_inactive" | "network" | "session_expired" | "unknown";

export class AuthError extends Error {
  constructor(public code: AuthErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AuthError";
  }
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  name: string;
  roleId: string;
  roleNameAr: string;
  isSuperAdmin: boolean;
  avatarUrl: string | null;
}

export interface AuthSession {
  token: string;
  user: AuthenticatedUser;
  expiresAt: number;
}

export interface SignInCredentials {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

const CACHE_KEY = "soft_muse_admin_profile";

function roleDetails(role: string) {
  if (role === "admin") return { roleId: "role_1", roleNameAr: "Quản trị viên", isSuperAdmin: true };
  if (role === "manager") return { roleId: "role_2", roleNameAr: "Quản lý", isSuperAdmin: false };
  return { roleId: "role_3", roleNameAr: "Biên tập viên", isSuperAdmin: false };
}

function cacheSession(session: Session, profile: Record<string, unknown>): AuthSession {
  const role = String(profile.role ?? "customer");
  const details = roleDetails(role);
  const value: AuthSession = {
    token: session.access_token,
    expiresAt: (session.expires_at ?? Math.floor(Date.now() / 1000) + 3600) * 1000,
    user: {
      id: session.user.id,
      username: session.user.email?.split("@")[0] ?? "admin",
      email: session.user.email ?? "",
      name: String(profile.full_name ?? session.user.user_metadata.full_name ?? "Quản trị Soft Muse"),
      avatarUrl: profile.avatar_url ? String(profile.avatar_url) : null,
      ...details,
    },
  };
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(value));
  return value;
}

function readCachedSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export const AuthService = {
  async signInWithPassword({ identifier, password }: SignInCredentials): Promise<AuthSession> {
    if (typeof navigator !== "undefined" && !navigator.onLine) throw new AuthError("network");
    if (!identifier.trim() || !password) throw new AuthError("invalid_credentials");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email: identifier.trim(), password });
    if (error || !data.session) throw new AuthError("invalid_credentials", error?.message);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, role, avatar_url, is_active, login_count")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile?.is_active || !["admin", "manager", "editor"].includes(profile.role)) {
      await supabase.auth.signOut();
      throw new AuthError("account_inactive", "Tài khoản không có quyền truy cập quản trị.");
    }

    const { error: loginAuditError } = await supabase.rpc("record_admin_login");
    if (loginAuditError) {
      await supabase.auth.signOut();
      throw new AuthError("unknown", loginAuditError.message);
    }
    return cacheSession(data.session, profile);
  },

  updateCurrentUser(userData: Partial<AuthenticatedUser>): AuthenticatedUser | null {
    const current = readCachedSession();
    if (!current) return null;
    current.user = { ...current.user, ...userData };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(current));
    eventBus.emit("user.updated", current.user);
    return current.user;
  },

  async signOut(): Promise<void> {
    await createClient().auth.signOut();
    if (typeof window !== "undefined") window.localStorage.removeItem(CACHE_KEY);
  },

  getSession(): AuthSession | null {
    return readCachedSession();
  },

  getCurrentUser(): AuthenticatedUser | null {
    return readCachedSession()?.user ?? null;
  },

  getCurrentToken(): string | null {
    return readCachedSession()?.token ?? null;
  },
};
