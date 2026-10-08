import type { Locale } from '@/lib/i18n';
import type { Konto, LoginDeps } from './login';
import type { Tokens } from './session';

// Zugriff auf Supabase (Auth, REST) und Resend für den Kundenbereich. Nur auf dem Server verwenden.
// Siehe functions/kundenbereich/login.md

type Env = Record<string, string | undefined>;

function config(env: Env) {
  const url = (env.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/$/, '');
  const anon = env.SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && anon ? { url, anon, service: env.SUPABASE_SERVICE_ROLE_KEY } : null;
}

async function json<T>(res: Response, what: string): Promise<T> {
  if (!res.ok) throw new Error(`${what}: Supabase ${res.status} ${(await res.text()).slice(0, 200)}`);
  return (await res.json()) as T;
}

/** Abhängigkeiten des Anmeldeablaufs; null, wenn Supabase (Service-Role) oder Resend fehlen (AK-10) */
export function loginDeps(env: Env): LoginDeps | null {
  const c = config(env);
  const resend = env.RESEND_API_KEY;
  if (!c?.service || !resend) return null;
  const { url, service } = c;
  const admin = { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json' };
  const post = (path: string, body: unknown, extra: Record<string, string> = {}) =>
    fetch(url + path, {
      method: 'POST',
      headers: { ...admin, ...extra },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
  const count = async (column: string, value: string, since: string) => {
    const q = `?select=id&${column}=eq.${encodeURIComponent(value)}&created_at=gte.${encodeURIComponent(since)}`;
    const res = await fetch(`${url}/rest/v1/anmeldeversuche${q}`, {
      method: 'HEAD',
      headers: { ...admin, Prefer: 'count=exact' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Anmeldeversuche: Supabase ${res.status}`);
    return Number(res.headers.get('content-range')?.split('/')[1] ?? 0);
  };

  return {
    async konto(email) {
      const rows = await json<
        {
          art: Konto['art'];
          ansprechpartner_id: string | null;
          user_id: string | null;
          name: string;
          sprache: Locale;
        }[]
      >(await post('/rest/v1/rpc/kundenbereich_konto', { p_email: email }), 'Konto');
      const r = rows[0];
      return r
        ? { art: r.art, ansprechpartnerId: r.ansprechpartner_id, userId: r.user_id, name: r.name, sprache: r.sprache }
        : null;
    },
    async recent(emailHash, ipHash, sinceEmail, sinceIp) {
      return {
        email: await count('email_hash', emailHash, sinceEmail),
        ip: ipHash ? await count('ip_hash', ipHash, sinceIp) : 0,
      };
    },
    async logAttempt(emailHash, ipHash) {
      const res = await post(
        '/rest/v1/anmeldeversuche',
        { email_hash: emailHash, ip_hash: ipHash },
        { Prefer: 'return=minimal' },
      );
      if (!res.ok) throw new Error(`Anmeldeversuch: Supabase ${res.status}`);
    },
    async createUser(email) {
      return (await json<{ id: string }>(await post('/auth/v1/admin/users', { email, email_confirm: true }), 'Nutzer'))
        .id;
    },
    async linkUser(ansprechpartnerId, userId) {
      const res = await fetch(`${url}/rest/v1/ansprechpartner?id=eq.${encodeURIComponent(ansprechpartnerId)}`, {
        method: 'PATCH',
        headers: { ...admin, Prefer: 'return=minimal' },
        body: JSON.stringify({ user_id: userId }),
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`Verknüpfen: Supabase ${res.status}`);
    },
    async generateCode(email) {
      return (
        await json<{ hashed_token: string }>(
          await post('/auth/v1/admin/generate_link', { type: 'magiclink', email }),
          'Code',
        )
      ).hashed_token;
    },
    async sendMail(mail) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resend}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: env.ANFRAGE_ABSENDER ?? 'onboarding@resend.dev',
          to: [mail.to],
          subject: mail.subject,
          text: mail.text,
        }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
    },
  };
}

export interface Profil {
  art: 'kunde' | 'admin';
  name: string;
  sprache: Locale;
}

/** Sitzungsfunktionen mit dem öffentlichen Schlüssel und dem Token des Nutzers; null ohne Supabase */
export function authApi(env: Env) {
  const c = config(env);
  if (!c) return null;
  const { url, anon } = c;
  const headers = (token?: string) => ({
    apikey: anon,
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });
  const tokens = async (res: Response) => (res.ok ? ((await res.json()) as Tokens) : null);

  return {
    /** Code aus der Mail einlösen (AK-7) */
    verify: async (code: string) =>
      tokens(
        await fetch(`${url}/auth/v1/verify`, {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify({ type: 'magiclink', token_hash: code }),
          cache: 'no-store',
        }),
      ),
    refresh: async (refreshToken: string) =>
      tokens(
        await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify({ refresh_token: refreshToken }),
          cache: 'no-store',
        }),
      ),
    logout: async (access: string) => {
      await fetch(`${url}/auth/v1/logout`, { method: 'POST', headers: headers(access), cache: 'no-store' }).catch(
        () => {},
      );
    },
    /** Angemeldeter Nutzer mit Profil, geprüft bei Supabase; null ohne gültige Sitzung */
    profil: async (access: string): Promise<Profil | null> => {
      const user = await fetch(`${url}/auth/v1/user`, { headers: headers(access), cache: 'no-store' });
      if (!user.ok) return null;
      const res = await fetch(`${url}/rest/v1/rpc/kundenbereich_profil`, {
        method: 'POST',
        headers: headers(access),
        body: '{}',
        cache: 'no-store',
      });
      if (!res.ok) return null;
      const [p] = (await res.json()) as Profil[];
      return p ?? null;
    },
  };
}
