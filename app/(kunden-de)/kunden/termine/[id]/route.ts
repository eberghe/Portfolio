import { cookies } from 'next/headers';
import { ACCESS } from '@/lib/kundenbereich/session';
import { authApi } from '@/lib/kundenbereich/supabase';
import { kalenderAntwort } from '@/lib/kundenbereich/termine';

// Kalenderdatei für einen Termin, nur mit Sitzung (functions/kundenbereich/termine.md AK-6)

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sprache = new URL(request.url).searchParams.get('sprache') === 'en' ? 'en' : 'de';
  return kalenderAntwort(id, sprache, (await cookies()).get(ACCESS)?.value, authApi(process.env));
}
