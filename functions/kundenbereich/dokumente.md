# Kundenbereich: Dokumente und Dateien

Status: In Arbeit

## Zweck

Vertrag, Rechnungen, aktuelle Logos und weitere Dateien eines Projekts zum Herunterladen, jeweils mit Version und Datum (Issue #57). Die Dateien liegen im privaten Bucket `kundendokumente` (`datenmodell.md`).

## Nutzer & Ziel

- **Ansprechpartner:** findet den Vertrag, die letzte Rechnung und das aktuelle Logo, ohne in Mails zu suchen.
- **Erik:** lädt Dateien hoch (bis zur Admin-Ansicht #53 in Supabase Studio: Datei nach `<kunde_id>/<projekt_id>/<datei>` und Eintrag in `dokumente`).

## Verhalten

1. Die Projekte werden mit ihren Dokumenten geladen (ohne Speicherpfad; Zugriffsregeln wie in `datenmodell.md`).
2. Abschnitt **Dokumente** (h3) in der linken Spalte unter dem Ablauf, gruppiert nach Art in dieser Reihenfolge, je mit h4: „Verträge“, „Rechnungen“, „Logos“, „Weitere Dateien“. Leere Gruppen entfallen; ohne Dokumente: „Noch keine Dokumente.“
3. In einer Gruppe stehen Dokumente nach Titel, je Titel die höchste Version zuerst mit Hinweis „Aktuell“; ältere Versionen darunter.
4. Jedes Dokument ist ein Link mit Titel und, ebenfalls im Linktext, Dateityp, Größe, Version und Datum, z. B. „Vertrag Relaunch, PDF, 1,2 MB, Version 2, 8. Okt. 2026, Aktuell“ (als `aria-label`, beginnt mit dem sichtbaren Titel).
5. Logos zeigen eine kleine Vorschau; sie hat `alt=""`, weil der Link sie schon benennt.
6. Download: `/kunden/dokumente/<id>` (Vorschau: `?vorschau=1`). Der Server prüft die Sitzung, liest den Eintrag mit dem Token des Nutzers und lässt sich von Supabase Storage, ebenfalls mit dem Token des Nutzers, einen 60 Sekunden gültigen signierten Link erzeugen. Darauf leitet er weiter (303), beim Download mit dem Original-Dateinamen. Ohne Sitzung 401, unbekannt oder fremd 404, Fehler beim Signieren 502. Signierte Links stehen nie im HTML.

## Akzeptanzkriterien

- AK-1: Die Abfrage der Projekte bettet `dokumente(id,created_at,art,titel,dateiname,groesse_bytes,mime_typ,version)` ein, nicht `storage_pfad`.
- AK-2: Die Aufbereitung gruppiert nach Art in fester Reihenfolge, sortiert nach Titel und Version absteigend und markiert je Titel die höchste Version als aktuell.
- AK-3: Linktext enthält Titel, Dateityp (aus MIME-Typ, sonst Dateiendung), Größe (B/KB/MB, deutsch mit Komma), Version und Datum; Link auf `/kunden/dokumente/<id>`.
- AK-4: Logos haben eine Vorschau (`alt=""`, Name am Link) mit Quelle `/kunden/dokumente/<id>?vorschau=1`.
- AK-5: Die Route antwortet ohne Sitzung 401, für fremde oder unbekannte Dokumente 404, sonst 303 auf einen signierten Link mit 60 Sekunden Laufzeit, erzeugt mit dem Token des Nutzers; beim Download mit `download=<Dateiname>`; `Cache-Control: private, no-store`.
- AK-6: Englisch: „Documents“, „Contracts“, „Invoices“, „Logos“, „Other files“, „Current“, „No documents yet.“, Zahlen und Datum englisch.
- AK-7: Keine axe-Verstöße, kein horizontales Scrollen bei 360/768/1280, hell und dunkel.

## Barrierefreiheit

Alle Angaben zur Datei im Linktext, damit Screenreader sie mit dem Link ansagen; Vorschau ohne doppelten Alternativtext; Ziele 44 px.

## Mobile

Liste einspaltig, lange Titel brechen um.

## Sprachen (DE/EN)

Texte in `lib/kundenbereich/text.ts`.

## Daten

Tabelle `dokumente` und Bucket `kundendokumente` aus `datenmodell.md`, keine neue Migration.

## Tests

- `tests/unit/kundenbereich-dokumente.test.tsx`: Aufbereitung, Ansicht, Route (AK-1 bis AK-6)
- `tests/e2e/kundenbereich-projekte.spec.ts`: Dokumente in der angemeldeten Ansicht, Weiterleitung, axe (AK-5, AK-7)

## Offene Fragen

- Vertrag im Bereich bestätigen: später.
