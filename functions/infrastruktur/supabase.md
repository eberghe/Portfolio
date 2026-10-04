# Supabase

Status: Entwurf

## Tabellen (erster Entwurf)
- `anfragen`: Anfrage-Assistent (nur Server schreibt, nur Erik liest)
- `fragen`: FAQ/GEO-Inhalte (öffentlich lesbar wenn veröffentlicht)
- `staedte`, `stadt_leistung`: Städte-Landingpages
- `angebote`, `angebot_optionen`: Angebotsseiten für Kunden (nur per Token, serverseitig)

Texte mit Sprachfeld `sprache` (`de`/`en`) bzw. je Sprache eigene Spalten.

## Regeln
- RLS auf allen Tabellen aktiv, Tests für jede Policy
- Migrationen versioniert im Repo (`supabase/migrations`)
- Zugangsdaten nur als Umgebungsvariablen, nie im Code
