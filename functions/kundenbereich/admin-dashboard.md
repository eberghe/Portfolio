# Kundenbereich: Dashboard der Verwaltung

Status: In Arbeit

## Zweck

Die Startseite der Verwaltung zeigt Erik auf einen Blick, was gerade läuft: Kennzahlen, Umsatzprognose pro Jahr, nächste Termine, Projekte, neue Anfragen (Leads) und Kunden (Issue #62, Wunsch Erik 2026-10-08). Sie ersetzt die bisherige Kundenliste (`admin.md` Verhalten 2).

## Nutzer & Ziel

- **Erik:** sieht morgens, welche Termine anstehen, welche Anfragen offen sind und was das Jahr voraussichtlich bringt, und springt von dort in Projekt, Kunde oder den Assistenten „Neues Projekt“ (`projekt-assistent.md`).

## Verhalten

1. `/kunden/admin`, h1 „Verwaltung“. Rechts neben dem Titel der Button „Neues Projekt“, der zum Assistenten führt. Die Seite ist breit (bis 1280 px), die Abschnitte stehen im Raster.
2. **Kennzahlen** (Liste aus Kacheln, jede mit Bezeichnung und Wert):
   - „Aktive Projekte“: Anzahl im Status „in Arbeit“ oder „Abstimmung“.
   - „Termine in 7 Tagen“: Termine aller Projekte von jetzt bis in sieben Tagen.
   - „Neue Anfragen“: Anfragen im Status „neu“.
   - „Umsatz <Jahr>“: Prognose für das laufende Jahr (sicher + gewichtet), darunter „davon sicher <Betrag>“.
3. **Umsatzprognose** (h2):
   - Säulen je Jahr, gestapelt aus „Sicher“ und „Gewichtet“. Dazu eine Legende, der Gesamtbetrag über jeder Säule und ein Tooltip je Segment.
   - Darunter eine Tabelle mit Jahr, Sicher, Gewichtet und Summe. Sie ist die Textalternative, das Diagramm selbst ist für Screenreader ausgeblendet.
   - Ohne Beträge steht dort: „Noch keine Beträge. Trag beim Projekt einen Auftragswert ein.“ Projekte ohne Wert oder ohne Abrechnungsdatum werden als Hinweis gezählt („2 Projekte ohne Auftragswert oder Abrechnungsdatum“).
4. **Regeln der Prognose:**
   - Zum Jahr zählt das Jahr des voraussichtlichen Abrechnungsdatums.
   - Sicher sind Projekte im Status „in Arbeit“, „Abstimmung“ und „abgeschlossen“, mit vollem Auftragswert.
   - Gewichtet sind Angebote, mit Auftragswert × Wahrscheinlichkeit.
   - Pausierte Projekte zählen nicht.
   - Gezeigt werden alle Jahre mit Beträgen und das laufende Jahr, lückenlos aufsteigend.
5. **Nächste Termine** (h2): die nächsten fünf Termine aller Projekte, jeweils mit Datum und Uhrzeit (deutsche Zeit), Thema, Projekt (verlinkt) und Kunde, und mit Meet-Link, falls vorhanden. Ohne Termine steht dort: „Keine Termine geplant.“
6. **Projekte** (h2):
   - Alle Projekte, sortiert nach Status: in Arbeit, Abstimmung, Angebot, pausiert, abgeschlossen. Innerhalb eines Status nach Titel.
   - Je Projekt: Titel (verlinkt), Kunde, Status, nächster offener Schritt mit Verantwortlichem und Auftragswert.
   - Abgeschlossene Projekte stehen eingeklappt unter „Abgeschlossen (<Anzahl>)“.
7. **Anfragen** (h2):
   - Anfragen aus dem Kontaktformular (Tabelle `anfragen`), neueste zuerst, im Status „neu“ oder „beantwortet“.
   - Je Anfrage: Name, Datum, Leistungen, Zeitrahmen, Budget, E-Mail (`mailto:`) und Telefon. Die Beschreibung ist aufklappbar.
   - Dazu eine Auswahl für den Status mit „Status speichern: <Name>“ und der Link „Projekt anlegen“ (`/kunden/admin/projekte/neu?anfrage=<id>`).
   - Erledigte Anfragen stehen eingeklappt unter „Erledigt (<Anzahl>)“.
8. **Kunden** (h2): wie bisher die Liste (Name, Anzahl Projekte und Ansprechpartner, Logo-Freigabe) und das Formular „Kunde anlegen“.
9. **Umsatz am Projekt:** Die Projektseite bekommt den Abschnitt „Umsatz“ mit Auftragswert netto (€), Wahrscheinlichkeit (%) und voraussichtlicher Abrechnung (Datum). Diese Werte sind nur für Admins lesbar; Ansprechpartner sehen sie nie.

## Prüfungen (serverseitig)

- Auftragswert: leer oder Zahl ≥ 0 mit höchstens zwei Nachkommastellen, deutsch oder englisch geschrieben („12.500,50“, „12500.5“), höchstens 10 Millionen.
- Wahrscheinlichkeit: ganze Zahl von 0 bis 100, Standard 50.
- Abrechnung: leer oder gültiges Datum.
- Anfrage-Status nur „neu“, „beantwortet“, „erledigt“.

## Akzeptanzkriterien

- AK-1: Die Kennzahlen zählen richtig: aktive Projekte, Termine der nächsten 7 Tage, neue Anfragen, Umsatz im laufenden Jahr (sicher + gewichtet, „davon sicher“).
- AK-2: `umsatzPrognose` rechnet nach den Regeln in Verhalten 4: pausiert zählt nicht, Angebot gewichtet, Jahre lückenlos mit laufendem Jahr. Projekte ohne Wert oder Datum werden gezählt.
- AK-3: Das Diagramm hat eine Legende, Säulen und Beschriftung über jeder Säule. Die Tabelle enthält dieselben Beträge. Das SVG ist `aria-hidden`, die Tabelle hat eine Beschriftung.
- AK-4: Nächste Termine: höchstens fünf, nur künftige, aufsteigend, mit Projekt-Link und Meet-Link.
- AK-5: Projekte nach Status sortiert, mit nächstem offenem Schritt und Wert. Abgeschlossene sind eingeklappt.
- AK-6: Anfragen: offen sichtbar, erledigte eingeklappt. Der Status lässt sich speichern. „Projekt anlegen“ verlinkt den Assistenten mit `anfrage=<id>`.
- AK-7: Die Umsatzwerte lassen sich am Projekt speichern (Upsert in `projekt_umsatz`), mit Prüfung und Fehlern am Feld.
- AK-8: Datenbank: `projekt_umsatz` und `anfragen` sind nur für Admins lesbar; Admins dürfen bei `anfragen` nur den Status ändern; anon und Ansprechpartner sehen nichts.
- AK-9: Keine axe-Verstöße und kein horizontales Scrollen bei 360, 768 und 1280 px, hell und dunkel.

## Barrierefreiheit

- Kennzahlen stehen als `dl`.
- Das Diagramm hat eine Tabelle als Textalternative, das Diagramm selbst ist dekorativ und `aria-hidden`.
- „Gewichtet“ ist zusätzlich schraffiert, damit die Unterscheidung nicht nur über die Farbe läuft.
- Die Status-Buttons nennen die Anfrage im Namen.
- Eingeklappte Bereiche sind `details` und `summary`.

## Mobile

- Kennzahlen 2 × 2, ab 1024 px vier nebeneinander.
- Die Abschnitte stehen einspaltig untereinander, ab 1024 px in zwei Spalten.
- Projekte und Anfragen sind Listen, keine breiten Tabellen.
- Die Umsatztabelle hat nur vier Spalten und passt auch bei 360 px.

## Sprachen (DE/EN)

Nur Deutsch (Verwaltung).

## SEO / GEO

`noindex`, wie die übrige Verwaltung.

## Daten

Migration `20261008200000_dashboard.sql` (rein additiv):

- `projekt_umsatz`: `projekt_id` (Primärschlüssel, verweist auf `kundenprojekte`, löscht mit), `auftragswert_netto numeric(12,2)` ≥ 0, `wahrscheinlichkeit` 0–100 (Standard 50), `abrechnung_am date`. Für diese Tabelle gilt nur die Regel `admin_alles`.
- `anfragen`: Admins dürfen lesen und die Spalte `status` ändern (Regeln `admin_liest`, `admin_status`); sonst bleibt alles wie in `anfrage-assistent.md`.

## Tests

- `tests/unit/kundenbereich-dashboard.test.tsx`: Prognose, Kennzahlen, Prüfungen, Aktionen, Ansicht (AK-1 bis AK-7)
- `tests/unit/kundenbereich-datenmodell.test.ts`: Regeln für `projekt_umsatz` und `anfragen` (AK-8)
- `tests/e2e/kundenbereich-admin.spec.ts`: Dashboard im Browser, axe (AK-9)
