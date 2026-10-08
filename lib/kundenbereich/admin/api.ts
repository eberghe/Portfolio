import type { Bucket } from './pruefen';

// REST- und Storage-Zugriff der Verwaltung, immer mit dem Access Token des Admins, damit die Regel
// `admin_alles` greift; nie mit dem Service-Role-Schlüssel (functions/kundenbereich/admin.md AK-2)

type Env = Record<string, string | undefined>;

export class AdminFehler extends Error {
  constructor(
    readonly status: number,
    readonly code: string | null,
    message: string,
  ) {
    super(message);
  }
}

export function adminApi(env: Env, access: string) {
  const url = (env.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/$/, '');
  const anon = env.SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  const headers = (extra: Record<string, string> = {}) => ({
    apikey: anon,
    Authorization: `Bearer ${access}`,
    'Content-Type': 'application/json',
    ...extra,
  });
  const call = async <T>(path: string, init: RequestInit = {}, prefer?: string): Promise<T> => {
    const res = await fetch(url + path, {
      ...init,
      headers: headers(prefer ? { Prefer: prefer } : {}),
      cache: 'no-store',
    });
    const text = await res.text();
    if (!res.ok) {
      let code: string | null = null;
      try {
        code = (JSON.parse(text) as { code?: string }).code ?? null;
      } catch {}
      throw new AdminFehler(res.status, code, `Supabase ${res.status}: ${text.slice(0, 200)}`);
    }
    return (text ? JSON.parse(text) : null) as T;
  };
  const query = (params: Record<string, string>) => new URLSearchParams(params).toString();
  const objekt = (bucket: Bucket, pfad: string) => `${bucket}/${pfad.split('/').map(encodeURIComponent).join('/')}`;

  return {
    get: <T>(table: string, params: Record<string, string>) => call<T[]>(`/rest/v1/${table}?${query(params)}`),
    insert: async <T>(table: string, row: Record<string, unknown> | Record<string, unknown>[]) =>
      (
        await call<T[]>(`/rest/v1/${table}`, { method: 'POST', body: JSON.stringify(row) }, 'return=representation')
      )[0]!,
    update: async <T>(table: string, id: string, patch: Record<string, unknown>) => {
      const rows = await call<T[]>(
        `/rest/v1/${table}?${query({ id: `eq.${id}` })}`,
        { method: 'PATCH', body: JSON.stringify(patch) },
        'return=representation',
      );
      if (!rows[0]) throw new AdminFehler(404, null, `${table} ${id} nicht gefunden`);
      return rows[0];
    },
    remove: <T>(table: string, filter: Record<string, string>) =>
      call<T[]>(`/rest/v1/${table}?${query(filter)}`, { method: 'DELETE' }, 'return=representation'),
    /** Signierter Upload-Link für genau einen Pfad (AK-5, AK-9) */
    signUpload: async (bucket: Bucket, pfad: string) => {
      const { url: signed } = await call<{ url: string }>(`/storage/v1/object/upload/sign/${objekt(bucket, pfad)}`, {
        method: 'POST',
        body: '{}',
      });
      return `${url}/storage/v1${signed}`;
    },
    /** Größe und Typ einer hochgeladenen Datei; null, wenn sie fehlt */
    info: async (bucket: Bucket, pfad: string) => {
      try {
        const i = await call<{ size: number; content_type: string }>(`/storage/v1/object/info/${objekt(bucket, pfad)}`);
        return { size: i.size, type: i.content_type };
      } catch (e) {
        if (e instanceof AdminFehler && (e.status === 400 || e.status === 404)) return null;
        throw e;
      }
    },
    removeFiles: (bucket: Bucket, pfade: string[]) =>
      call<unknown[]>(`/storage/v1/object/${bucket}`, { method: 'DELETE', body: JSON.stringify({ prefixes: pfade }) }),
    /** Kurz gültiger Link zum Ansehen (Logo-Vorschau in der Verwaltung) */
    sign: async (bucket: Bucket, pfad: string, sekunden: number) => {
      const { signedURL } = await call<{ signedURL: string }>(`/storage/v1/object/sign/${objekt(bucket, pfad)}`, {
        method: 'POST',
        body: JSON.stringify({ expiresIn: sekunden }),
      });
      return `${url}/storage/v1${signedURL}`;
    },
  };
}
