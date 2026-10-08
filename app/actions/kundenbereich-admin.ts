'use server';

import { createHmac } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import * as A from '@/lib/kundenbereich/admin/aktionen';
import { adminApi } from '@/lib/kundenbereich/admin/api';
import { inviteLink } from '@/lib/kundenbereich/login';
import { ACCESS } from '@/lib/kundenbereich/session';
import { authApi, loginDeps } from '@/lib/kundenbereich/supabase';

// Server Actions der Verwaltung: Sitzung und Admin-Profil serverseitig prüfen, dann die Aktion
// mit Eriks Token ausführen (functions/kundenbereich/admin.md)

type Core = (fd: FormData, ctx: A.AdminCtx) => Promise<A.AdminState>;

async function go(core: Core, fd: FormData): Promise<A.AdminState> {
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

type S = A.AdminState;
export async function kundeAnlegen(_: S, fd: FormData) {
  return go(A.kundeAnlegen, fd);
}
export async function kundeSpeichern(_: S, fd: FormData) {
  return go(A.kundeSpeichern, fd);
}
export async function logoVorbereiten(_: S, fd: FormData) {
  return go(A.logoVorbereiten, fd);
}
export async function logoUebernehmen(_: S, fd: FormData) {
  return go(A.logoUebernehmen, fd);
}
export async function ansprechpartnerHinzufuegen(_: S, fd: FormData) {
  return go(A.ansprechpartnerHinzufuegen, fd);
}
export async function ansprechpartnerEntfernen(_: S, fd: FormData) {
  return go(A.ansprechpartnerEntfernen, fd);
}
export async function ansprechpartnerEinladen(_: S, fd: FormData) {
  return go(A.ansprechpartnerEinladen, fd);
}
export async function projektAnlegen(_: S, fd: FormData) {
  return go(A.projektAnlegen, fd);
}
export async function projektSpeichern(_: S, fd: FormData) {
  return go(A.projektSpeichern, fd);
}
export async function projektAnsprechpartner(_: S, fd: FormData) {
  return go(A.projektAnsprechpartner, fd);
}
export async function schrittHinzufuegen(_: S, fd: FormData) {
  return go(A.schrittHinzufuegen, fd);
}
export async function schrittSpeichern(_: S, fd: FormData) {
  return go(A.schrittSpeichern, fd);
}
export async function schrittEntfernen(_: S, fd: FormData) {
  return go(A.schrittEntfernen, fd);
}
export async function terminHinzufuegen(_: S, fd: FormData) {
  return go(A.terminHinzufuegen, fd);
}
export async function terminEntfernen(_: S, fd: FormData) {
  return go(A.terminEntfernen, fd);
}
export async function dokumentVorbereiten(_: S, fd: FormData) {
  return go(A.dokumentVorbereiten, fd);
}
export async function dokumentUebernehmen(_: S, fd: FormData) {
  return go(A.dokumentUebernehmen, fd);
}
export async function dokumentEntfernen(_: S, fd: FormData) {
  return go(A.dokumentEntfernen, fd);
}
export async function umsatzSpeichern(_: S, fd: FormData) {
  return go(A.umsatzSpeichern, fd);
}
export async function anfrageStatus(_: S, fd: FormData) {
  return go(A.anfrageStatus, fd);
}
