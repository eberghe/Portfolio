import { NextResponse, type NextRequest } from 'next/server';
import { ACCESS, REFRESH, refreshCookies } from '@/lib/kundenbereich/session';
import { authApi } from '@/lib/kundenbereich/supabase';

const isKundenbereich = (p: string) => /^\/(kunden|en\/clients)(\/|$)/.test(p);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const headers = new Headers(request.headers);
  // Gibt der globalen 404-Seite die Sprache der angefragten Adresse mit (functions/seiten/nicht-gefunden.md AK-3)
  headers.set('x-sprache', pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'de');
  if (!isKundenbereich(pathname)) return NextResponse.next({ request: { headers } });

  // Kundenbereich: abgelaufenen Zugang mit dem Refresh Token erneuern (functions/kundenbereich/login.md AK-9)
  const api = authApi(process.env);
  const secure = request.nextUrl.protocol === 'https:';
  const result = api
    ? await refreshCookies(request.cookies.get(ACCESS)?.value, request.cookies.get(REFRESH)?.value, api.refresh, secure)
    : null;
  if (result && 'set' in result) {
    for (const c of result.set) request.cookies.set(c.name, c.value);
  } else if (result) {
    request.cookies.delete(ACCESS);
    request.cookies.delete(REFRESH);
  }
  headers.set('cookie', request.cookies.toString());
  const response = NextResponse.next({ request: { headers } });
  response.headers.set('Cache-Control', 'private, no-store');
  if (result && 'set' in result) for (const c of result.set) response.cookies.set(c.name, c.value, c.options);
  else if (result) {
    response.cookies.delete(ACCESS);
    response.cookies.delete(REFRESH);
  }
  return response;
}

export const config = {
  // Nur Seiten, keine Dateien und keine Next-internen Pfade
  matcher: ['/((?!_next/|images/|.*\\.[a-z0-9]+$).*)'],
};
