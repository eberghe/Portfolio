import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';

// Lokale Postgres-Instanz mit den Teilen von Supabase, auf die sich Migrationen stützen
// (Rollen, auth.uid(), storage). Siehe functions/kundenbereich/datenmodell.md, Abschnitt Tests.

const supabaseStub = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  grant usage on schema public to anon, authenticated, service_role;

  create schema auth;
  grant usage on schema auth to anon, authenticated;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(coalesce(current_setting('request.jwt.claim.sub', true), current_setting('request.jwt.claims', true)::json->>'sub'), '')::uuid
  $$;

  create schema storage;
  grant usage on schema storage to anon, authenticated;
  create table storage.buckets (
    id text primary key, name text not null, public boolean default false,
    file_size_limit bigint, allowed_mime_types text[]
  );
  create table storage.objects (
    id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets (id),
    name text not null, owner uuid, created_at timestamptz default now()
  );
  alter table storage.objects enable row level security;
  grant select, insert, update, delete on storage.objects to anon, authenticated;
  create function storage.foldername(name text) returns text[] language sql immutable as $$
    select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1]
  $$;
`;

export type Db = PGlite & {
  /** Führt fn als Rolle aus: null = anon, sonst authenticated mit dieser Nutzer-ID */
  as<T>(userId: string | null, fn: () => Promise<T>): Promise<T>;
};

export async function supabaseDb(...migrations: string[]): Promise<Db> {
  const db = new PGlite() as Db;
  await db.exec(supabaseStub);
  for (const file of migrations) await db.exec(readFileSync(file, 'utf8'));
  db.as = async (userId, fn) => {
    await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [userId ?? '']);
    await db.exec(`set role ${userId ? 'authenticated' : 'anon'}`);
    try {
      return await fn();
    } finally {
      await db.exec('reset role');
      await db.query(`select set_config('request.jwt.claim.sub', '', false)`);
    }
  };
  return db;
}
