-- Status eines Kunden für die Verwaltung (functions/kundenbereich/admin-sidebar.md Verhalten 8)
-- Rein ergänzend: bestehende Kunden bekommen „aktiv“.

alter table public.kunden
  add column if not exists status text not null default 'aktiv'
  check (status in ('interessent', 'aktiv', 'pausiert', 'ehemalig'));
