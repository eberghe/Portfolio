# Kundenbereich: Datenmodell und Zugriffsregeln

Status: In Arbeit

## Zweck

Grundlage für den Kundenbereich (Epic #49, Issue #55): Tabellen und private Dateiablagen in Supabase, in denen Erik als Admin alles pflegt und Ansprechpartner eines Kunden nur ihre eigenen Projekte sehen.

## Nutzer & Ziel

- **Erik (Admin):** legt Kunden mit Logo an, hinterlegt Ansprechpartner je Kunde und Projekt, pflegt Projekte, Schritte, Termine und lädt Verträge, Rechnungen und Dateien hoch.
- **Ansprechpartner eines Kunden:** meldet sich an (Magic Link, Issue #56), sieht nur die Projekte, denen er zugeordnet ist, und kann die Nutzung des Kundenlogos auf Eriks Website freigeben oder widerrufen (Issue #59).
- **Alle anderen** (nicht angemeldet, andere Kunden): sehen nichts.

## Tabellen (Schema `public`)

| Tabelle                   | Inhalt                                                                                                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `admins`                  | `user_id` (Supabase-Auth-Nutzer mit Admin-Rechten, also Erik)                                                                                                         |
| `kunden`                  | Name, Website, `logo_pfad` (Bucket `kundenlogos`), `logo_freigabe` (`offen` / `erteilt` / `widerrufen`), `logo_freigabe_am`                                           |
| `ansprechpartner`         | gehört zu einem Kunden; Name, E-Mail (eindeutig, klein geschrieben), Rolle, Telefon, Sprache (`de`/`en`), `user_id` (Login, wird beim ersten Anmelden verknüpft, #56) |
| `kundenprojekte`          | gehört zu einem Kunden; Titel, Status (`angebot`, `in_arbeit`, `abstimmung`, `abgeschlossen`, `pausiert`), Phase, Beschreibung DE/EN, Website- und Staging-URL        |
| `projekt_ansprechpartner` | welcher Ansprechpartner welches Projekt sieht                                                                                                                         |
| `projektschritte`         | Reihenfolge, Titel und Beschreibung DE/EN, Status (`offen`, `aktiv`, `erledigt`), fällig am, verantwortlich (`erik` oder `kunde`)                                     |
| `termine`                 | Beginn, Ende (nach Beginn), Titel DE/EN, Meet-Link (nur `https://`)                                                                                                   |
| `dokumente`               | Art (`vertrag`, `rechnung`, `logo`, `datei`), Titel, `storage_pfad` (Bucket `kundendokumente`, eindeutig), Dateiname, Größe, MIME-Typ, Version                        |
| `logo_freigaben`          | Protokoll: welcher Ansprechpartner wann `erteilt` oder `widerrufen` hat; der letzte Eintrag setzt `kunden.logo_freigabe`                                              |

Löschen eines Kunden löscht seine Ansprechpartner, Projekte und alles darunter (`on delete cascade`). Dateien im Storage löscht die Admin-Ansicht mit (#53).

## Dateiablage (Supabase Storage)

- `kundenlogos` (privat, max. 5 MB, PNG/JPEG/SVG/WebP): Pfad `<kunde_id>/<datei>`
- `kundendokumente` (privat, max. 25 MB, PDF/PNG/JPEG/SVG/WebP/ZIP): Pfad `<kunde_id>/<projekt_id>/<datei>`
- Downloads später nur über kurz gültige signierte Links, die der Server nach Login-Prüfung erzeugt (#57).

## Zugriffsregeln (Row Level Security)

- RLS ist auf allen Tabellen an. `anon` hat keinerlei Rechte.
- Admins (Eintrag in `admins`) dürfen alles lesen und schreiben, auch in beiden Buckets.
- Ansprechpartner (angemeldet, `ansprechpartner.user_id = auth.uid()`) dürfen **lesen**: ihren Kunden, die Ansprechpartner ihres Kunden, ihre zugeordneten Projekte und deren Schritte, Termine und Dokumente, die Freigaben ihres Kunden; im Storage das Logo ihres Kunden und die Dateien, die als Dokument eines ihrer Projekte eingetragen sind.
- Ansprechpartner dürfen **schreiben**: nur einen Eintrag in `logo_freigaben` für ihren eigenen Kunden, in eigenem Namen. Zeitpunkt setzt die Datenbank.
- Hilfsfunktionen `ist_admin()`, `meine_kunden()`, `meine_projekte()` laufen als `security definer` mit leerem `search_path`, damit Regeln sich nicht gegenseitig rekursiv prüfen.

## Akzeptanzkriterien

- AK-1: Nicht angemeldet (`anon`) liefert jede Tabelle des Kundenbereichs null Zeilen bzw. „keine Berechtigung“; Storage-Dateien sind nicht lesbar.
- AK-2: Ein Ansprechpartner sieht genau seinen Kunden, dessen Ansprechpartner, seine zugeordneten Projekte und deren Schritte, Termine und Dokumente, aber nichts von einem anderen Kunden und kein Projekt seines Kunden, dem er nicht zugeordnet ist.
- AK-3: Ein Ansprechpartner kann Kunden, Projekte, Schritte, Termine, Dokumente und Ansprechpartner weder anlegen noch ändern noch löschen.
- AK-4: Ein Ansprechpartner kann die Logo-Freigabe für seinen Kunden erteilen und widerrufen; `kunden.logo_freigabe` und `logo_freigabe_am` folgen dem letzten Eintrag. Für einen fremden Kunden oder im Namen eines anderen Ansprechpartners wird der Eintrag abgelehnt. Ein mitgeschickter Zeitpunkt wird durch die Datenbankzeit ersetzt.
- AK-5: Ein Admin kann in allen Tabellen anlegen, lesen, ändern und löschen.
- AK-6: Storage: Ein Ansprechpartner liest das Logo seines Kunden und Dateien seiner Projekte, aber keine fremden und keine nicht eingetragenen Dateien; er kann nichts hochladen. Ein Admin kann in beiden Buckets hochladen und lesen.
- AK-7: Datenprüfungen: E-Mail wird klein gespeichert und ist eindeutig, Termin-Ende liegt nach dem Beginn, Meet-Link beginnt mit `https://`, Status-Werte sind auf die Listen oben beschränkt.
- AK-8: Beide Buckets sind privat (`public = false`) mit Größen- und Typbegrenzung.

## Barrierefreiheit, Mobile, SEO

Keine Oberfläche in diesem Schritt.

## Sprachen (DE/EN)

Texte, die Kunden sehen (Projektbeschreibung, Schritte, Termin-Titel), haben je eine Spalte `_de` und `_en`; leer in EN zeigt später die deutsche Fassung.

## Daten

Migration `supabase/migrations/20261008000000_kundenbereich.sql`, am 2026-10-08 über die Supabase-API ausgeführt und in `supabase_migrations.schema_migrations` eingetragen (Projekt in `eu-central-1`, Frankfurt).

## Tests

`tests/unit/kundenbereich-datenmodell.test.ts` spielt die Migration in einer lokalen Postgres-Instanz (PGlite) ein, mit nachgebauten Supabase-Teilen (`auth.uid()`, `storage.objects`, Rollen `anon`/`authenticated`), und prüft AK-1 bis AK-8 als die jeweilige Rolle.

## Offene Fragen

- Darf jeder Ansprechpartner die Logo-Freigabe erteilen? Annahme (2026-10-08): ja, protokolliert mit Name und Zeit.
- Rechnungen werden als PDF hochgeladen, nicht auf der Website erzeugt (Annahme 2026-10-08).
