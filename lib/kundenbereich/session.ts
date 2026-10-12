// Sitzungs-Cookies des Kundenbereichs, siehe functions/kundenbereich/login.md (Sitzung, AK-7, AK-9)

export const ACCESS = 'kb_zugang';
export const REFRESH = 'kb_erneuern';
const REFRESH_MAX_AGE = 30 * 24 * 3600;

export interface Tokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface SessionCookie {
  name: string;
  value: string;
  options: { httpOnly: true; secure: boolean; sameSite: 'lax'; path: '/'; maxAge: number };
}

export function sessionCookies(t: Tokens, secure: boolean): SessionCookie[] {
  const options = (maxAge: number) => ({
    httpOnly: true as const,
    secure,
    sameSite: 'lax' as const,
    path: '/' as const,
    maxAge,
  });
  return [
    { name: ACCESS, value: t.access_token, options: options(t.expires_in) },
    { name: REFRESH, value: t.refresh_token, options: options(REFRESH_MAX_AGE) },
  ];
}

/** Läuft der Token in weniger als `skew` Sekunden ab? Unlesbare Tokens gelten als abgelaufen. */
export function tokenExpired(jwt: string, nowSec: number, skew = 30): boolean {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp !== 'number' || payload.exp - skew <= nowSec;
  } catch {
    return true;
  }
}

/** Was der Proxy mit den Cookies tun soll: nichts (null), neu setzen oder löschen */
export async function refreshCookies(
  access: string | undefined,
  refresh: string | undefined,
  refreshFn: (refreshToken: string) => Promise<Tokens | null>,
  secure: boolean,
  nowSec = Math.floor(Date.now() / 1000),
): Promise<null | { set: SessionCookie[] } | { clear: true }> {
  if (!refresh) return null;
  if (access && !tokenExpired(access, nowSec)) return null;
  const tokens = await refreshFn(refresh).catch(() => null);
  return tokens ? { set: sessionCookies(tokens, secure) } : { clear: true };
}
