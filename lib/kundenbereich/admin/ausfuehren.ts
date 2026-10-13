import { createHmac } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type * as A from './aktionen';
import { adminApi } from './api';
import { inviteLink } from '../login';
import { ACCESS } from '../session';
import { authApi, loginDeps } from '../supabase';

// Rahmen der Server Actions der Verwaltung: Sitzung und Admin-Profil serverseitig prüfen, dann die Aktion
// mit Eriks Token ausführen (functions/kundenbereich/admin.md). Nur auf dem Server verwenden.

type Core = (fd: FormData, ctx: A.AdminCtx) => Promise<A.AdminState>;

export async function go(core: Core, fd: FormData): Promise<A.AdminState> {
  const env = process.env;
  const access = (await cookies()).get(ACCESS)?.value;
  const profil = access
    ? await authApi(env)
        ?.profil(access)
        .catch(() => null)
    : null;
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const secret = env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  const state = await core(fd, {
    api: access ? adminApi(env, access) : null,
    admin: profil?.art === 'admin',
    einladen: (email) =>
      inviteLink(email, {
        deps: loginDeps(env),
        host,
        hash: (v) => createHmac('sha256', secret).update(v).digest('hex'),
      }),
  });
  if (state.status === 'ok') {
    revalidatePath('/kunden', 'layout');
    if (state.redirect) redirect(state.redirect);
  }
  return state;
}
