import { cookies } from 'next/headers';
import { dokumentAntwort } from '@/lib/kundenbereich/dokumente';
import { ACCESS } from '@/lib/kundenbereich/session';
import { authApi } from '@/lib/kundenbereich/supabase';

// Download oder Vorschau eines Dokuments, nur mit Sitzung (functions/kundenbereich/dokumente.md AK-5)

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vorschau = new URL(request.url).searchParams.has('vorschau');
  return dokumentAntwort(id, vorschau, (await cookies()).get(ACCESS)?.value, authApi(process.env));
}
