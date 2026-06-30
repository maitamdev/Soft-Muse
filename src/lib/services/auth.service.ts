import { setAdminSession, clearAdminSession, getAdminSession } from '@/utils/admin-auth';
import { UsersService } from '@/lib/services/users.service';
import { eventBus } from '@/lib/events/EventBus';

/**
 * Authentication service — the single seam between the admin UI and the auth backend.
 *
 * Today this authenticates against the mock user/credential store in UsersService
 * (username OR email + hashed password) and persists the session to localStorage
 * with an expiry. Migrating to Supabase Auth should require changing ONLY this file:
 * keep the exported shapes (AuthSession, AuthenticatedUser, AuthService) stable.
 */

export type AuthErrorCode =
  | 'invalid_credentials'
  | 'account_inactive'
  | 'network'
  | 'session_expired'
  | 'unknown';

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'AuthError';
    this.code = code;
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
  /** Epoch ms when the session expires. */
  expiresAt: number;
}

export interface SignInCredentials {
  /** Username or email. */
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

const SESSION_STORAGE_KEY = 'aura_admin_session_data';
const DAY_MS = 24 * 60 * 60 * 1000;

function persistSession(session: AuthSession, rememberMe: boolean) {
  // Cookie drives the middleware route guard; localStorage holds the full session.
  setAdminSession(session.token, rememberMe);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }
}

function readSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export const AuthService = {
  /** Authenticate with username/email + password. Throws {@link AuthError}. */
  async signInWithPassword({ identifier, password, rememberMe = false }: SignInCredentials): Promise<AuthSession> {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw new AuthError('network');
    }
    if (!identifier?.trim() || !password) {
      throw new AuthError('invalid_credentials');
    }

    let member;
    try {
      member = await UsersService.authenticate(identifier, password);
    } catch (err) {
      const code = err instanceof Error ? err.message : 'unknown';
      if (code === 'inactive') throw new AuthError('account_inactive');
      if (code === 'invalid_credentials') throw new AuthError('invalid_credentials');
      throw new AuthError('unknown');
    }

    await UsersService.recordLogin(member.id);

    const session: AuthSession = {
      token: `sess_${member.id}_${Date.now()}`,
      expiresAt: Date.now() + (rememberMe ? 30 * DAY_MS : DAY_MS),
      user: {
        id: member.id,
        username: member.username,
        email: member.email,
        name: member.nameAr,
        roleId: member.roleId,
        roleNameAr: member.roleNameAr,
        isSuperAdmin: member.isSuperAdmin,
        avatarUrl: member.avatarUrl,
      },
    };
    persistSession(session, rememberMe);
    return session;
  },

  updateCurrentUser(userData: Partial<AuthenticatedUser>): AuthenticatedUser | null {
    const session = readSession();
    if (!session) return null;
    session.user = { ...session.user, ...userData };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
    eventBus.emit('user.updated', session.user);
    return session.user;
  },

  async signOut(): Promise<void> {
    clearAdminSession();
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      window.localStorage.removeItem('aura_admin_view_as_role');
      window.sessionStorage.removeItem('aura_admin_view_as_role');
      window.sessionStorage.removeItem('viewAsRole');
      window.sessionStorage.removeItem('impersonate');
      document.cookie = 'aura_admin_view_as_role=; Max-Age=-99999999; path=/';
      document.cookie = 'viewAsRole=; Max-Age=-99999999; path=/';
      document.cookie = 'impersonate=; Max-Age=-99999999; path=/';
    }
  },

  /** The current session if present and unexpired; clears + returns null when expired. */
  getSession(): AuthSession | null {
    const session = readSession();
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      clearAdminSession();
      if (typeof window !== 'undefined') window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return session;
  },

  getCurrentUser(): AuthenticatedUser | null {
    return this.getSession()?.user ?? null;
  },

  /** Returns the current session token, or null when signed out. */
  getCurrentToken(): string | null {
    return getAdminSession();
  },
};
