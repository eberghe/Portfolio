-- Kundenbereich: Datenmodell, Zugriffsregeln, Dateiablage (functions/kundenbereich/datenmodell.md, Issue #55)
-- Admins (Erik) pflegen alles; Ansprechpartner eines Kunden lesen nur ihre Projekte und dürfen die Logo-Freigabe setzen.

-- Tabellen ---------------------------------------------------------------------------------------

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create table public.kunden (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  website_url text check (website_url ~ '^https?://'),
  logo_pfad text,
  logo_freigabe text not null default 'offen' check (logo_freigabe in ('offen', 'erteilt', 'widerrufen')),
  logo_freigabe_am timestamptz
);

create table public.ansprechpartner (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kunde_id uuid not null references public.kunden (id) on delete cascade,
  user_id uuid unique references auth.users (id) on delete set null,
  name text not null check (char_length(name) between 1 and 200),
  email text not null unique check (email = lower(email) and char_length(email) <= 200 and email like '%@%'),
  rolle text check (char_length(rolle) <= 100),
  telefon text check (char_length(telefon) <= 40),
  sprache text not null default 'de' check (sprache in ('de', 'en'))
);

create table public.kundenprojekte (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kunde_id uuid not null references public.kunden (id) on delete cascade,
  titel text not null check (char_length(titel) between 1 and 200),
  status text not null default 'angebot'
    check (status in ('angebot', 'in_arbeit', 'abstimmung', 'abgeschlossen', 'pausiert')),
  phase text check (char_length(phase) <= 200),
  beschreibung_de text,
  beschreibung_en text,
  website_url text check (website_url ~ '^https?://'),
  staging_url text check (staging_url ~ '^https?://')
);

create table public.projekt_ansprechpartner (
  projekt_id uuid not null references public.kundenprojekte (id) on delete cascade,
  ansprechpartner_id uuid not null references public.ansprechpartner (id) on delete cascade,
  primary key (projekt_id, ansprechpartner_id)
);

create table public.projektschritte (
  id uuid primary key default gen_random_uuid(),
  projekt_id uuid not null references public.kundenprojekte (id) on delete cascade,
  reihenfolge integer not null default 0,
  titel_de text not null check (char_length(titel_de) between 1 and 200),
  titel_en text,
  beschreibung_de text,
  beschreibung_en text,
  status text not null default 'offen' check (status in ('offen', 'aktiv', 'erledigt')),
  faellig_am date,
  verantwortlich text not null default 'erik' check (verantwortlich in ('erik', 'kunde'))
);

create table public.termine (
  id uuid primary key default gen_random_uuid(),
  projekt_id uuid not null references public.kundenprojekte (id) on delete cascade,
  beginn timestamptz not null,
  ende timestamptz not null,
  titel_de text,
  titel_en text,
  meet_url text check (meet_url ~ '^https://'),
  check (ende > beginn)
);

create table public.dokumente (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  projekt_id uuid not null references public.kundenprojekte (id) on delete cascade,
  art text not null check (art in ('vertrag', 'rechnung', 'logo', 'datei')),
  titel text not null check (char_length(titel) between 1 and 200),
  storage_pfad text not null unique,
  dateiname text not null,
  groesse_bytes bigint,
  mime_typ text,
  version integer not null default 1
);

create table public.logo_freigaben (
  id uuid primary key default gen_random_uuid(),
  kunde_id uuid not null references public.kunden (id) on delete cascade,
  ansprechpartner_id uuid not null references public.ansprechpartner (id) on delete cascade,
  entscheidung text not null check (entscheidung in ('erteilt', 'widerrufen')),
  am timestamptz not null default now()
);

create index ansprechpartner_kunde on public.ansprechpartner (kunde_id);
create index kundenprojekte_kunde on public.kundenprojekte (kunde_id);
create index projekt_ansprechpartner_ap on public.projekt_ansprechpartner (ansprechpartner_id);
create index projektschritte_projekt on public.projektschritte (projekt_id, reihenfolge);
create index termine_projekt on public.termine (projekt_id, beginn);
create index dokumente_projekt on public.dokumente (projekt_id);
create index logo_freigaben_kunde on public.logo_freigaben (kunde_id, am);

-- E-Mail immer klein speichern
create function public.ansprechpartner_email_klein() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.email := lower(trim(new.email));
  return new;
end $$;
create trigger ansprechpartner_email_klein before insert or update of email on public.ansprechpartner
  for each row execute function public.ansprechpartner_email_klein();

-- Logo-Freigabe: Zeitpunkt setzt die Datenbank, der Kunde übernimmt den letzten Stand
create function public.logo_freigabe_zeit() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.am := now();
  return new;
end $$;
create trigger logo_freigabe_zeit before insert on public.logo_freigaben
  for each row execute function public.logo_freigabe_zeit();

create function public.logo_freigabe_uebernehmen() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.kunden set logo_freigabe = new.entscheidung, logo_freigabe_am = new.am where id = new.kunde_id;
  return new;
end $$;
create trigger logo_freigabe_uebernehmen after insert on public.logo_freigaben
  for each row execute function public.logo_freigabe_uebernehmen();

-- Hilfsfunktionen für die Regeln (security definer, damit sich Regeln nicht rekursiv prüfen) ------

create function public.ist_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;

create function public.meine_kunden() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select kunde_id from public.ansprechpartner where user_id = auth.uid()
$$;

create function public.meine_projekte() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select pa.projekt_id from public.projekt_ansprechpartner pa
  join public.ansprechpartner a on a.id = pa.ansprechpartner_id
  where a.user_id = auth.uid()
$$;

revoke all on function public.ist_admin(), public.meine_kunden(), public.meine_projekte() from public, anon;
grant execute on function public.ist_admin(), public.meine_kunden(), public.meine_projekte() to authenticated;

-- Rechte und Regeln ------------------------------------------------------------------------------

alter table public.admins enable row level security;
alter table public.kunden enable row level security;
alter table public.ansprechpartner enable row level security;
alter table public.kundenprojekte enable row level security;
alter table public.projekt_ansprechpartner enable row level security;
alter table public.projektschritte enable row level security;
alter table public.termine enable row level security;
alter table public.dokumente enable row level security;
alter table public.logo_freigaben enable row level security;

revoke all on public.admins, public.kunden, public.ansprechpartner, public.kundenprojekte,
  public.projekt_ansprechpartner, public.projektschritte, public.termine, public.dokumente,
  public.logo_freigaben from anon, authenticated;
grant select, insert, update, delete on public.admins, public.kunden, public.ansprechpartner,
  public.kundenprojekte, public.projekt_ansprechpartner, public.projektschritte, public.termine,
  public.dokumente, public.logo_freigaben to authenticated;

-- Admins: alles
create policy admin_alles on public.admins for all to authenticated using (public.ist_admin()) with check (public.ist_admin());
create policy admin_alles on public.kunden for all to authenticated using (public.ist_admin()) with check (public.ist_admin());
create policy admin_alles on public.ansprechpartner for all to authenticated using (public.ist_admin()) with check (public.ist_admin());
create policy admin_alles on public.kundenprojekte for all to authenticated using (public.ist_admin()) with check (public.ist_admin());
create policy admin_alles on public.projekt_ansprechpartner for all to authenticated using (public.ist_admin()) with check (public.ist_admin());
create policy admin_alles on public.projektschritte for all to authenticated using (public.ist_admin()) with check (public.ist_admin());
create policy admin_alles on public.termine for all to authenticated using (public.ist_admin()) with check (public.ist_admin());
create policy admin_alles on public.dokumente for all to authenticated using (public.ist_admin()) with check (public.ist_admin());
create policy admin_alles on public.logo_freigaben for all to authenticated using (public.ist_admin()) with check (public.ist_admin());

-- Ansprechpartner: lesen, was zu ihrem Kunden bzw. ihren Projekten gehört
create policy kunde_liest on public.kunden for select to authenticated
  using (id in (select public.meine_kunden()));
create policy kunde_liest on public.ansprechpartner for select to authenticated
  using (kunde_id in (select public.meine_kunden()));
create policy kunde_liest on public.kundenprojekte for select to authenticated
  using (id in (select public.meine_projekte()));
create policy kunde_liest on public.projekt_ansprechpartner for select to authenticated
  using (projekt_id in (select public.meine_projekte()));
create policy kunde_liest on public.projektschritte for select to authenticated
  using (projekt_id in (select public.meine_projekte()));
create policy kunde_liest on public.termine for select to authenticated
  using (projekt_id in (select public.meine_projekte()));
create policy kunde_liest on public.dokumente for select to authenticated
  using (projekt_id in (select public.meine_projekte()));
create policy kunde_liest on public.logo_freigaben for select to authenticated
  using (kunde_id in (select public.meine_kunden()));

-- Logo-Freigabe: nur für den eigenen Kunden, im eigenen Namen
create policy kunde_gibt_frei on public.logo_freigaben for insert to authenticated
  with check (
    exists (
      select 1 from public.ansprechpartner a
      where a.id = ansprechpartner_id and a.kunde_id = logo_freigaben.kunde_id and a.user_id = auth.uid()
    )
  );

-- Dateiablage --------------------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('kundenlogos', 'kundenlogos', false, 5242880, array['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']),
  ('kundendokumente', 'kundendokumente', false, 26214400,
    array['application/pdf', 'image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'application/zip'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy kundenbereich_admin on storage.objects for all to authenticated
  using (bucket_id in ('kundenlogos', 'kundendokumente') and public.ist_admin())
  with check (bucket_id in ('kundenlogos', 'kundendokumente') and public.ist_admin());

create policy kundenbereich_logo_lesen on storage.objects for select to authenticated
  using (
    bucket_id = 'kundenlogos'
    and (storage.foldername(name))[1] in (select k::text from public.meine_kunden() k)
  );

create policy kundenbereich_dokument_lesen on storage.objects for select to authenticated
  using (
    bucket_id = 'kundendokumente'
    and exists (
      select 1 from public.dokumente d
      where d.storage_pfad = name and d.projekt_id in (select public.meine_projekte())
    )
  );
