import { cookies } from 'next/headers';
import { adminApi } from '@/lib/kundenbereich/admin/api';
import { istId } from '@/lib/kundenbereich/admin/pruefen';
import { ACCESS } from '@/lib/kundenbereich/session';
import { authApi } from '@/lib/kundenbereich/supabase';

// Vorschau des Kundenlogos in der Verwaltung über einen kurz gültigen Link (functions/kundenbereich/admin.md)

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const headers = { 'Cache-Control': 'private, no-store' };
  const { id } = await params;
  const access = (await cookies()).get(ACCESS)?.value;
  const profil = access
    ? await authApi(process.env)
        ?.profil(access)
        .catch(() => null)
    : null;
  const api = access && profil?.art === 'admin' ? adminApi(process.env, access) : null;
  if (!api || !istId(id)) return new Response('Not found', { status: 404, headers });
  try {
    const [k] = await api.get<{ logo_pfad: string | null }>('kunden', { select: 'logo_pfad', id: `eq.${id}` });
    if (!k?.logo_pfad) return new Response('Not found', { status: 404, headers });
    return new Response(null, {
      status: 303,
      headers: { ...headers, Location: await api.sign('kundenlogos', k.logo_pfad, 60) },
    });
  } catch {
    return new Response('Bad gateway', { status: 502, headers });
  }
}
