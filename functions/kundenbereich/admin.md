# Kundenbereich: Verwaltung durch Erik (Admin-Ansicht)

Status: In Arbeit

## Zweck

Erik pflegt den Kundenbereich direkt auf der Website statt in Supabase Studio: Kunden mit Logo, Ansprechpartner, Projekte mit Status, Schritten und Terminen sowie Verträge, Rechnungen und Dateien (Issue #53, Wunsch Erik 2026-10-08).

## Nutzer & Ziel

- **Erik (Konto in `admins`):** legt einen neuen Kunden in wenigen Minuten an, lädt das Logo hoch, trägt Ansprechpartner ein, schickt ihnen den Anmeldelink und hält Projekte aktuell.
- **Alle anderen:** sehen die Verwaltung nicht; die Seiten antworten mit 404, auch angemeldeten Ansprechpartnern.

## Grundsätze

- Nur Deutsch (Eriks Werkzeug), Pfade unter `/kunden/admin`, `noindex`.
- Jede Seite prüft serverseitig, dass das Profil `admin` ist; jede Aktion prüft es erneut. Geschrieben wird immer mit dem Access Token von Erik, sodass zusätzlich die Regel `admin_alles` aus `datenmodell.md` greift. Den Service-Role-Schlüssel braucht nur das Verschicken des Anmeldelinks (wie in `login.md`).
- Formulare aus `TextField`, `SelectField` (neu, `ui-bausteine.md`) und `Button`; Fehler stehen am Feld, Erfolg als Meldung mit `aria-live`.
- Dateien lädt der Browser direkt in Supabase Storage hoch, über einen signierten Upload-Link, den der Server nach der Prüfung für genau einen Pfad erzeugt. So gilt nicht die Größenbegrenzung von Vercel-Funktionen (4,5 MB). Erst danach trägt der Server die Datei ein.
- Löschen von Kunden und Projekten bleibt vorerst in Supabase Studio (seltener Fall, löscht alles darunter); in der Verwaltung lassen sich Ansprechpartner, Schritte, Termine und Dokumente entfernen.

## Verhalten

1. `/kunden` zeigt Admins im Kopf zusätzlich den Button „Verwaltung“.
2. **`/kunden/admin`** (h1 „Verwaltung“): Liste aller Kunden mit Name, Anzahl Projekte und Ansprechpartner und Stand der Logo-Freigabe als Text („offen“, „erteilt am …“, „widerrufen am …“); jeder Name verlinkt auf den Kunden. Formular „Kunde anlegen“: Name (Pflicht), Website (optional, `https://`). Danach weiter zum neuen Kunden.
3. **`/kunden/admin/kunden/<id>`** (h1 Kundenname):
   - „Stammdaten“: Name, Website, speichern.
   - „Logo“: Vorschau des aktuellen Logos, Datei wählen (PNG, JPEG, SVG, WebP, max. 5 MB) und hochladen; das neue Logo ersetzt das alte (`kunden.logo_pfad`), die alte Datei wird gelöscht. Darunter der Stand der Logo-Freigabe und das Protokoll (wer, was, wann).
   - „Ansprechpartner“: Liste mit Name, E-Mail, Rolle, Telefon, Sprache, ob schon angemeldet; je Eintrag „Anmeldelink schicken“ und „Entfernen“. Formular „Ansprechpartner hinzufügen“: Name und E-Mail (Pflicht), Rolle, Telefon, Sprache (Deutsch/Englisch).
   - „Projekte“: Liste mit Titel und Status, verlinkt; Formular „Projekt anlegen“: Titel (Pflicht), danach weiter zum Projekt.
4. **`/kunden/admin/projekte/<id>`** (h1 Projekttitel, darüber Link zurück zum Kunden, Link „So sieht es der Kunde“ auf `/kunden?projekt=<id>`):
   - „Projekt“: Titel, Status (Auswahl), Phase, Beschreibung Deutsch und Englisch, Website, Staging.
   - „Ansprechpartner im Projekt“: Kontrollkästchen für jeden Ansprechpartner des Kunden.
   - „Ablauf“: je Schritt ein Formular mit Reihenfolge, Titel DE/EN, Beschreibung DE/EN, Stand, fällig am, verantwortlich (Erik/Kunde), speichern und entfernen; Formular „Schritt hinzufügen“ (Reihenfolge vorbelegt mit der nächsten Nummer).
   - „Termine“: Liste kommender und vergangener Termine mit „Entfernen“; Formular „Termin hinzufügen“: Datum, Beginn, Ende (deutsche Zeit), Thema DE/EN, Meet-Link (`https://`).
   - „Dokumente“: Liste mit Art, Titel, Version, Größe, Datum, Download und „Entfernen“ (löscht auch die Datei); Formular „Dokument hochladen“: Art, Titel (Pflicht), Datei (PDF, PNG, JPEG, SVG, WebP, ZIP, max. 25 MB). Gleiche Art und gleicher Titel ergeben automatisch die nächste Version.
5. „Anmeldelink schicken“ nutzt denselben Ablauf wie die Anmeldung (`login.md`): Nutzer anlegen und verknüpfen, Mail in der Sprache des Ansprechpartners. Die Meldung sagt „Anmeldelink an <E-Mail> geschickt“ oder nennt den Fehler. Das Limit pro Adresse gilt auch hier.

## Prüfungen (serverseitig)

- Name und Titel 1 bis 200 Zeichen; E-Mail gültig, klein geschrieben, noch nicht vergeben („Diese E-Mail ist schon bei einem Ansprechpartner hinterlegt.“); Website, Staging `http(s)://`; Meet-Link `https://`.
- Termin: Datum und Uhrzeiten gültig, Ende nach Beginn; Umrechnung aus Europe/Berlin nach UTC, auch an Tagen der Zeitumstellung.
- Status, Stand, Art, Verantwortlich, Sprache nur aus den Listen in `datenmodell.md`.
- Upload: Dateityp aus der Liste und Größe innerhalb der Grenze des Buckets; Pfad baut der Server (`<kunde_id>/logo-<zeit>.<endung>` bzw. `<kunde_id>/<projekt_id>/<zufall>-<bereinigter Dateiname>`), nie der Browser. Das Eintragen nach dem Upload akzeptiert nur einen Pfad, den der Server vorher für dieses Projekt erzeugt hat.

## Akzeptanzkriterien

- AK-1: Nicht angemeldet, als Ansprechpartner oder ohne Supabase antworten alle Seiten unter `/kunden/admin` mit 404; Aktionen lehnen ohne Admin-Profil ab, ohne zu schreiben.
- AK-2: Schreibzugriffe gehen mit Eriks Access Token an die REST-Schnittstelle (`Authorization: Bearer`, öffentlicher Schlüssel), nie mit dem Service-Role-Schlüssel.
- AK-3: Kunde anlegen und bearbeiten mit Prüfungen; danach Weiterleitung bzw. Meldung.
- AK-4: Ansprechpartner hinzufügen, entfernen und einladen; doppelte E-Mail ergibt eine Feld-Fehlermeldung.
- AK-5: Logo-Upload: Server prüft Typ und Größe, erzeugt einen signierten Upload-Link für einen eigenen Pfad, setzt nach dem Upload `logo_pfad` und löscht die alte Datei.
- AK-6: Projekt anlegen und bearbeiten, Ansprechpartner zuordnen.
- AK-7: Schritte hinzufügen, ändern, entfernen.
- AK-8: Termine hinzufügen (Berliner Zeit nach UTC, Ende nach Beginn) und entfernen.
- AK-9: Dokument hochladen mit automatischer Version, entfernen löscht Eintrag und Datei.
- AK-10: Die Kundenübersicht zeigt den Stand der Logo-Freigabe als Text; die Kundenseite das Protokoll.
- AK-11: Keine axe-Verstöße, kein horizontales Scrollen bei 360/768/1280, hell und dunkel.

## Barrierefreiheit

Überschriften h1 → h2 je Abschnitt → h3 je Eintrag; jedes Formular hat eine Überschrift und sichtbare Labels; Fehler am Feld mit `aria-invalid`, Meldungen mit `aria-live`; „Entfernen“-Buttons nennen im Namen, was entfernt wird; Datei-Auswahl mit Label und Hinweis zu Typ und Größe.

## Mobile

Einspaltig, Formulare volle Breite; Listen brechen um, keine Tabellen mit seitlichem Scrollen.

## Sprachen (DE/EN)

Verwaltung nur Deutsch. Inhalte, die Kunden sehen, haben Felder für Deutsch und Englisch.

## SEO / GEO

`noindex, nofollow`, nicht in Sitemap.

## Daten

Tabellen und Buckets aus `datenmodell.md`, keine neue Migration.

## Tests

- `tests/unit/kundenbereich-admin.test.ts(x)`: Prüfungen, Zeitumrechnung, Pfade, REST- und Storage-Aufrufe, Schutz der Aktionen, Ansichten
- `tests/e2e/kundenbereich-admin.spec.ts`: 404 für Nicht-Admins, Seiten, Anlegen eines Kunden, axe, Mobile
