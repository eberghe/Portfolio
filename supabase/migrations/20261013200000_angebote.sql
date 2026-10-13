-- Angebote als PDF und unterschriebene Fassung vom Kunden
-- (functions/kundenbereich/angebote.md, angebot-unterschrift.md)

alter table public.dokumente drop constraint dokumente_art_check;
alter table public.dokumente add constraint dokumente_art_check
  check (art in ('vertrag', 'rechnung', 'logo', 'datei', 'angebot', 'unterschrift'));
-- Unterschriebene Fassung gehört zu einem Angebots-Dokument
alter table public.dokumente add column zu_dokument uuid references public.dokumente (id) on delete cascade;
create index dokumente_zu_dokument on public.dokumente (zu_dokument);

create table public.angebote (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  projekt_id uuid not null references public.kundenprojekte (id) on delete cascade,
  nummer text not null unique check (nummer ~ '^[0-9]{4}-[0-9]{3,}$'),
  titel text not null check (char_length(titel) between 1 and 200),
  sprache text not null default 'de' check (sprache in ('de', 'en')),
  datum date not null,
  gueltig_bis date not null,
  empfaenger text not null default '' check (char_length(empfaenger) <= 1000),
  einleitung text not null default '' check (char_length(einleitung) <= 4000),
  positionen jsonb not null
    check (jsonb_typeof(positionen) = 'array' and jsonb_array_length(positionen) between 1 and 100),
  ust_satz integer not null default 19 check (ust_satz in (0, 19)),
  gesamt_cent bigint not null default 0,
  pdf_pfad text not null unique,
  status text not null default 'entwurf' check (status in ('entwurf', 'freigegeben', 'unterschrieben')),
  dokument_id uuid references public.dokumente (id) on delete set null,
  unterschrift_id uuid references public.dokumente (id) on delete set null,
  unterschrieben_am timestamptz,
  check (gueltig_bis >= datum)
);
create index angebote_projekt on public.angebote (projekt_id, created_at desc);

alter table public.angebote enable row level security;
revoke all on public.angebote from anon, authenticated;
grant select, insert, update, delete on public.angebote to authenticated;
create policy admin_alles on public.angebote for all to authenticated
  using (public.ist_admin()) with check (public.ist_admin());

-- Kunden laden die unterschriebene Fassung nur in ihr eigenes Projekt hoch
create policy kundenbereich_unterschrift_hochladen on storage.objects for insert to authenticated
  with check (
    bucket_id = 'kundendokumente'
    and array_length(storage.foldername(name), 1) = 2
    and split_part(name, '/', 3) like 'unterschrift-%'
    and exists (
      select 1 from public.kundenprojekte p
      where p.id::text = (storage.foldername(name))[2]
        and p.kunde_id::text = (storage.foldername(name))[1]
        and p.id in (select public.meine_projekte())
    )
  );

-- Hochgeladene Unterschrift eintragen: prüft Angebot, Pfad und Datei, legt das Dokument an
create function public.unterschrift_eintragen(p_dokument uuid, p_pfad text, p_dateiname text)
returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  d public.dokumente;
  a public.angebote;
  k uuid;
  meta jsonb;
  mime text;
  groesse bigint;
  neu uuid;
begin
  select * into d from public.dokumente where id = p_dokument and art = 'angebot';
  if d.id is null or d.projekt_id not in (select public.meine_projekte()) then
    raise exception 'Angebot nicht gefunden' using errcode = 'P0002';
  end if;
  select * into a from public.angebote where dokument_id = d.id;
  if a.id is null or a.status <> 'freigegeben'
     or exists (select 1 from public.dokumente u where u.zu_dokument = d.id) then
    raise exception 'Angebot schon unterschrieben' using errcode = '23505';
  end if;
  select kunde_id into k from public.kundenprojekte where id = d.projekt_id;
  if p_pfad !~ ('^' || k::text || '/' || d.projekt_id::text || '/unterschrift-[A-Za-z0-9-]+\.(pdf|jpg|jpeg|png)$') then
    raise exception 'Pfad ungültig' using errcode = '22023';
  end if;
  select o.metadata into meta from storage.objects o where o.bucket_id = 'kundendokumente' and o.name = p_pfad;
  if not found then
    raise exception 'Datei fehlt' using errcode = 'P0002';
  end if;
  mime := meta ->> 'mimetype';
  groesse := (meta ->> 'size')::bigint;
  if mime is null or mime not in ('application/pdf', 'image/jpeg', 'image/png') or groesse is null
     or groesse > 10485760 then
    raise exception 'Datei ungültig' using errcode = '22023';
  end if;
  insert into public.dokumente (projekt_id, art, titel, storage_pfad, dateiname, groesse_bytes, mime_typ, version, zu_dokument)
  values (
    d.projekt_id, 'unterschrift',
    left(d.titel || case when d.titel like 'Quote %' then ', signed' else ', unterschrieben' end, 200), p_pfad,
    left(coalesce(nullif(trim(p_dateiname), ''), split_part(p_pfad, '/', 3)), 200), groesse, mime, 1, d.id
  )
  returning id into neu;
  update public.angebote set status = 'unterschrieben', unterschrift_id = neu, unterschrieben_am = now()
  where id = a.id;
  return neu;
end $$;

revoke all on function public.unterschrift_eintragen(uuid, text, text) from public, anon;
grant execute on function public.unterschrift_eintragen(uuid, text, text) to authenticated;
