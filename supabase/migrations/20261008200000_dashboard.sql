-- Dashboard der Verwaltung und Projekt-Assistent (functions/kundenbereich/admin-dashboard.md, projekt-assistent.md)
-- Rein additiv: Umsatzwerte je Projekt (nur Admins), Admin-Zugriff auf Anfragen, atomares Anlegen eines Projekts.

-- Umsatz je Projekt, getrennt von kundenprojekte, damit Ansprechpartner die Werte nie lesen ------------

create table public.projekt_umsatz (
  projekt_id uuid primary key references public.kundenprojekte (id) on delete cascade,
  auftragswert_netto numeric(12, 2) check (auftragswert_netto >= 0 and auftragswert_netto <= 10000000),
  wahrscheinlichkeit integer not null default 50 check (wahrscheinlichkeit between 0 and 100),
  abrechnung_am date
);

alter table public.projekt_umsatz enable row level security;
revoke all on public.projekt_umsatz from anon, authenticated;
grant select, insert, update, delete on public.projekt_umsatz to authenticated;
create policy admin_alles on public.projekt_umsatz for all to authenticated
  using (public.ist_admin()) with check (public.ist_admin());

-- Anfragen: Admins lesen und ändern nur den Status --------------------------------------------------

grant select, update (status) on public.anfragen to authenticated;
create policy admin_liest on public.anfragen for select to authenticated using (public.ist_admin());
create policy admin_status on public.anfragen for update to authenticated
  using (public.ist_admin()) with check (public.ist_admin());

-- Projekt in einer Transaktion anlegen; läuft mit den Rechten des Aufrufers, die Regeln gelten --------

create function public.projekt_anlegen(daten jsonb) returns uuid
language plpgsql security invoker set search_path = '' as $$
declare
  kid uuid := nullif(daten ->> 'kunde_id', '')::uuid;
  pid uuid;
  aids uuid[] := array(select jsonb_array_elements_text(coalesce(daten -> 'ansprechpartner_ids', '[]'))::uuid);
  neu jsonb;
  aid uuid;
  t jsonb := daten -> 'termin';
  u jsonb := daten -> 'umsatz';
begin
  if not public.ist_admin() then
    raise exception 'Nur Admins dürfen Projekte anlegen' using errcode = '42501';
  end if;

  if kid is null then
    insert into public.kunden (name, website_url)
      values (daten -> 'kunde' ->> 'name', nullif(daten -> 'kunde' ->> 'website_url', ''))
      returning id into kid;
  elsif not exists (select 1 from public.kunden where id = kid) then
    raise exception 'Kunde nicht gefunden' using errcode = '22023';
  end if;

  if exists (
    select 1 from unnest(aids) a
    where a not in (select id from public.ansprechpartner where kunde_id = kid)
  ) then
    raise exception 'Ansprechpartner gehört nicht zum Kunden' using errcode = '22023';
  end if;

  insert into public.kundenprojekte (kunde_id, titel, status, phase, beschreibung_de, beschreibung_en, website_url, staging_url)
    values (
      kid,
      daten -> 'projekt' ->> 'titel',
      coalesce(daten -> 'projekt' ->> 'status', 'angebot'),
      nullif(daten -> 'projekt' ->> 'phase', ''),
      nullif(daten -> 'projekt' ->> 'beschreibung_de', ''),
      nullif(daten -> 'projekt' ->> 'beschreibung_en', ''),
      nullif(daten -> 'projekt' ->> 'website_url', ''),
      nullif(daten -> 'projekt' ->> 'staging_url', '')
    )
    returning id into pid;

  if u is not null and jsonb_typeof(u) = 'object' then
    insert into public.projekt_umsatz (projekt_id, auftragswert_netto, wahrscheinlichkeit, abrechnung_am)
      values (
        pid,
        (u ->> 'auftragswert_netto')::numeric,
        coalesce((u ->> 'wahrscheinlichkeit')::integer, 50),
        nullif(u ->> 'abrechnung_am', '')::date
      );
  end if;

  for neu in select * from jsonb_array_elements(coalesce(daten -> 'ansprechpartner_neu', '[]')) loop
    insert into public.ansprechpartner (kunde_id, name, email, rolle, telefon, sprache)
      values (
        kid,
        neu ->> 'name',
        neu ->> 'email',
        nullif(neu ->> 'rolle', ''),
        nullif(neu ->> 'telefon', ''),
        coalesce(neu ->> 'sprache', 'de')
      )
      returning id into aid;
    aids := aids || aid;
  end loop;

  insert into public.projekt_ansprechpartner (projekt_id, ansprechpartner_id)
    select distinct pid, a from unnest(aids) a;

  insert into public.projektschritte (projekt_id, reihenfolge, titel_de, titel_en, verantwortlich, status)
    select pid, s.n, s.v ->> 'titel_de', nullif(s.v ->> 'titel_en', ''),
      coalesce(s.v ->> 'verantwortlich', 'erik'), case when s.n = 1 then 'aktiv' else 'offen' end
    from jsonb_array_elements(coalesce(daten -> 'schritte', '[]')) with ordinality as s (v, n);

  if t is not null and jsonb_typeof(t) = 'object' then
    insert into public.termine (projekt_id, beginn, ende, titel_de, titel_en, meet_url)
      values (
        pid,
        (t ->> 'beginn')::timestamptz,
        (t ->> 'ende')::timestamptz,
        nullif(t ->> 'titel_de', ''),
        nullif(t ->> 'titel_en', ''),
        nullif(t ->> 'meet_url', '')
      );
  end if;

  return pid;
end $$;

revoke all on function public.projekt_anlegen(jsonb) from public, anon;
grant execute on function public.projekt_anlegen(jsonb) to authenticated;
