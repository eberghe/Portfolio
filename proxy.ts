import { NextResponse, type NextRequest } from 'next/server';

// Gibt der globalen 404-Seite die Sprache der angefragten Adresse mit (functions/seiten/nicht-gefunden.md AK-3)
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const headers = new Headers(request.headers);
  headers.set('x-sprache', pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'de');
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Nur Seiten, keine Dateien und keine Next-internen Pfade
  matcher: ['/((?!_next/|images/|.*\\.[a-z0-9]+$).*)'],
};
