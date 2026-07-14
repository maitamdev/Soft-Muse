export const ADMIN_AUTH_COOKIE = 'aura_admin_session';

export function getAdminSession() {
 if (typeof document === 'undefined') return null;
 const match = document.cookie.match(new RegExp('(^| )' + ADMIN_AUTH_COOKIE + '=([^;]+)'));
 return match ? match[2] : null;
}

export function setAdminSession(token: string, rememberMe: boolean = false) {
 if (typeof document === 'undefined') return;
 let expires = '';
 if (rememberMe) {
 const date = new Date();
 date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
 expires = `; expires=${date.toUTCString()}`;
 }
 // Use path=/ so it's accessible everywhere if needed, or path=/admin
 document.cookie = `${ADMIN_AUTH_COOKIE}=${token}${expires}; path=/`;
}

export function clearAdminSession() {
 if (typeof document === 'undefined') return;
 document.cookie = `${ADMIN_AUTH_COOKIE}=; Max-Age=-99999999; path=/`;
}
