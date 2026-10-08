'use server';

import { createHmac } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { localizedPath, type Locale } from '@/lib/i18n';
import { logoFreigabe as freigabe, type FreigabeState } from '@/lib/kundenbereich/freigabe';
import { confirmPath, requestLink, type LoginState } from '@/lib/kundenbereich/login';
import { ACCESS, REFRESH, sessionCookies } from '@/lib/kundenbereich/session';
import { authApi, loginDeps } from '@/lib/kundenbereich/supabase';

// Server Actions des Kundenbereichs (functions/kundenbereich/login.md)

const sprache = (fd: FormData): Locale => (fd.get('sprache') === 'en' ? 'en' : 'de');

async function host() {
  const h = await headers();
  return h.get('x-forwarded-host') ?? h.get('host');
}
const secure = (h: string | null) => !/^localhost(:\d+)?$/.test(h ?? '');

export async function requestLoginLink(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const env = process.env;
  const secret = env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  return requestLink(fd, {
    deps: loginDeps(env),
    host: await host(),
    ip,
    hash: (v) => createHmac('sha256', secret).update(v).digest('hex'),
  });
}

/** Code aus der Mail per POST einlösen (AK-7) */
export async function confirmLogin(fd: FormData) {
  const locale = sprache(fd);
  const code = String(fd.get('code') ?? '');
  const api = authApi(process.env);
  const tokens = api && code ? await api.verify(code).catch(() => null) : null;
  if (!tokens) redirect(`${confirmPath(locale)}?ungueltig=1`);
  const store = await cookies();
  for (const c of sessionCookies(tokens, secure(await host()))) store.set(c.name, c.value, c.options);
  redirect(localizedPath('/kunden', locale));
}

export async function logout(fd: FormData) {
  const locale = sprache(fd);
  const store = await cookies();
  const access = store.get(ACCESS)?.value;
  if (access) await authApi(process.env)?.logout(access);
  store.delete(ACCESS);
  store.delete(REFRESH);
  redirect(localizedPath('/kunden', locale));
}

/** Logo-Freigabe im eigenen Namen (functions/kundenbereich/logo-freigabe.md) */
export async function logoFreigabe(_prev: FreigabeState, fd: FormData): Promise<FreigabeState> {
  const state = await freigabe(fd, { access: (await cookies()).get(ACCESS)?.value, api: authApi(process.env) });
  if (state.status === 'ok') revalidatePath('/kunden', 'layout');
  return state;
}
