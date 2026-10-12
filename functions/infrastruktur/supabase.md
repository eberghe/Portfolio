# Supabase

Status: Entwurf

## Tabellen (erster Entwurf)

- `anfragen`: Anfrage-Assistent (nur Server schreibt, nur Erik liest)
- `fragen`: FAQ/GEO-Inhalte (öffentlich lesbar wenn veröffentlicht)
- `staedte`, `stadt_leistung`: Städte-Landingpages
- `angebote`, `angebot_optionen`: Angebotsseiten für Kunden (nur per Token, serverseitig)
- Kundenbereich (seit 2026-10-08): `admins`, `kunden`, `ansprechpartner`, `kundenprojekte`, `projekt_ansprechpartner`, `projektschritte`, `termine`, `dokumente`, `logo_freigaben` und die privaten Buckets `kundenlogos`, `kundendokumente`; Regeln in [`kundenbereich/datenmodell.md`](../kundenbereich/datenmodell.md)

Texte mit Sprachfeld `sprache` (`de`/`en`) bzw. je Sprache eigene Spalten.

## Regeln

- RLS auf allen Tabellen aktiv, Tests für jede Policy (lokal mit PGlite und nachgebautem `auth`/`storage`, `tests/unit/helpers/supabase-pglite.ts`)
- Migrationen versioniert im Repo (`supabase/migrations`)
- Zugangsdaten nur als Umgebungsvariablen, nie im Code
