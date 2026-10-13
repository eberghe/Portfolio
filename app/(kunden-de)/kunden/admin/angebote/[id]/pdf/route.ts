import { cookies } from 'next/headers';
import { adminApi } from '@/lib/kundenbereich/admin/api';
import { angebotPdfAntwort } from '@/lib/kundenbereich/admin/angebote';
import { ACCESS } from '@/lib/kundenbereich/session';
import { authApi } from '@/lib/kundenbereich/supabase';

// PDF eines Angebots für Erik, auch als Entwurf (functions/kundenbereich/angebote.md AK-10)

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const access = (await cookies()).get(ACCESS)?.value;
  const profil = access
    ? await authApi(process.env)
        ?.profil(access)
        .catch(() => null)
    : null;
  return angebotPdfAntwort(id, access && profil?.art === 'admin' ? adminApi(process.env, access) : null);
}
