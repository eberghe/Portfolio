import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import type { AdminApi } from '@/lib/kundenbereich/admin/aktionen';
import { adminApi } from '@/lib/kundenbereich/admin/api';
import { ACCESS } from '@/lib/kundenbereich/session';
import { authApi } from '@/lib/kundenbereich/supabase';

/** Seiten der Verwaltung nur für Admins, sonst 404 (functions/kundenbereich/admin.md AK-1) */
export async function adminKontext(): Promise<AdminApi> {
  const access = (await cookies()).get(ACCESS)?.value;
  const profil = access
    ? await authApi(process.env)
        ?.profil(access)
        .catch(() => null)
    : null;
  const api = access && profil?.art === 'admin' ? adminApi(process.env, access) : null;
  if (!api) notFound();
  return api;
}
