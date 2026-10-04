-- Anfragen aus dem Anfrage-Assistenten (functions/kontakt/anfrage-assistent.md)
-- Nur der Server schreibt (Service-Role-Schlüssel, umgeht RLS); öffentlich weder les- noch schreibbar.

create table public.anfragen (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sprache text not null check (sprache in ('de', 'en')),
  leistungen text[] not null check (cardinality(leistungen) > 0),
  beschreibung text not null check (char_length(beschreibung) between 20 and 3000),
  website text check (char_length(website) <= 300),
  zeitrahmen text not null default 'offen',
  budget text not null default 'offen',
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 200),
  telefon text check (char_length(telefon) <= 40),
  einwilligung_am timestamptz not null,
  ip_hash text,
  status text not null default 'neu' check (status in ('neu', 'beantwortet', 'erledigt'))
);

comment on table public.anfragen is 'Projektanfragen von erik-bergheimer.de; löschen, sobald erledigt und keine Aufbewahrungspflicht besteht.';

-- Rate-Limit: Anfragen je Absender in der letzten Stunde
create index anfragen_ip_hash_created_at on public.anfragen (ip_hash, created_at);

alter table public.anfragen enable row level security;
-- Bewusst keine Policies: anon und authenticated haben keinen Zugriff.
revoke all on table public.anfragen from anon, authenticated;
