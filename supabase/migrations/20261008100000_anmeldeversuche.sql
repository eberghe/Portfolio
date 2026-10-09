-- Kundenbereich: Login per Magic Link (functions/kundenbereich/login.md, Issue #56)

-- Anmeldeversuche für das Limit; nur HMAC-Hashes von Adresse und IP, nur der Server greift zu
create table public.anmeldeversuche (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  email_hash text not null,
  ip_hash text
);
create index anmeldeversuche_email on public.anmeldeversuche (email_hash, created_at);
create index anmeldeversuche_ip on public.anmeldeversuche (ip_hash, created_at);
alter table public.anmeldeversuche enable row level security;
revoke all on table public.anmeldeversuche from anon, authenticated;
comment on table public.anmeldeversuche is 'Nur für das Anmelde-Limit; Einträge älter als ein Tag dürfen gelöscht werden.';

-- Wer darf sich anmelden? Ansprechpartner per E-Mail oder Admins per Supabase-Konto. Nur für den Server.
create function public.kundenbereich_konto(p_email text)
returns table (art text, ansprechpartner_id uuid, user_id uuid, name text, sprache text)
language sql stable security definer set search_path = '' as $$
  select 'kunde', a.id, a.user_id, a.name, a.sprache
  from public.ansprechpartner a where a.email = lower(trim(p_email))
  union all
  select 'admin', null, u.id, coalesce(u.raw_user_meta_data->>'name', 'Erik'), 'de'
  from auth.users u join public.admins ad on ad.user_id = u.id
  where lower(u.email) = lower(trim(p_email))
    and not exists (select 1 from public.ansprechpartner a where a.email = lower(trim(p_email)))
$$;
revoke all on function public.kundenbereich_konto(text) from public, anon, authenticated;
grant execute on function public.kundenbereich_konto(text) to service_role;

-- Wer bin ich? Für die Begrüßung nach dem Login, mit dem Token des Nutzers
create function public.kundenbereich_profil()
returns table (art text, name text, sprache text)
language sql stable security definer set search_path = '' as $$
  select 'admin', coalesce(u.raw_user_meta_data->>'name', 'Erik'), 'de'
  from auth.users u join public.admins ad on ad.user_id = u.id where u.id = auth.uid()
  union all
  select 'kunde', a.name, a.sprache from public.ansprechpartner a
  where a.user_id = auth.uid() and not exists (select 1 from public.admins where user_id = auth.uid())
$$;
revoke all on function public.kundenbereich_profil() from public, anon;
grant execute on function public.kundenbereich_profil() to authenticated;
