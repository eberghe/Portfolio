# Kundenbereich: Kundensicht als Dashboard

Status: In Arbeit

## Zweck

Die Projektübersicht für Kundinnen und Kunden wird ein Dashboard. Oben stehen Kennzahl-Kacheln, darunter Karten (Issue #64, Wunsch Erik 2026-10-08). Inhalte und Daten bleiben wie in `projektuebersicht.md`, `termine.md`, `dokumente.md` und `logo-freigabe.md`; nur die Anordnung ändert sich.

## Nutzer & Ziel

- **Ansprechpartner:** sieht in drei Sekunden, wie weit das Projekt ist, wann der nächste Termin ist und ob gerade etwas von ihm gebraucht wird.

## Verhalten

1. Kopf, Projektwahl, leerer Zustand und Fehlertext bleiben wie bisher.
2. Unter Kunde, Projekttitel, Status, Phase und Beschreibung stehen vier **Kacheln** (Liste mit Bezeichnung und Wert):
   - **Fortschritt:** „3 von 7“ mit dem Zusatz „Schritte erledigt“ und einem Balken. Ohne Schritte steht dort „Noch kein Ablauf“.
   - **Nächster Termin:** das kurze Datum und die Uhrzeit (deutsche Zeit), verlinkt auf die Termin-Karte, sonst „Keiner geplant“.
   - **Du bist dran:** die Zahl der offenen Schritte, für die der Kunde verantwortlich ist, und „Alles bei Erik“ bei 0. Die Kachel ist hervorgehoben, wenn die Zahl größer als 0 ist, und verlinkt dann auf „Nächste Schritte“.
   - **Dokumente:** die Anzahl aktueller Dokumente und das neueste mit Datum, verlinkt auf die Dokumente-Karte.
3. Darunter die **Karten**, alle mit Rahmen, gerundet und mit gleichem Innenabstand:
   - in der rechten Spalte Termin, Nächste Schritte, Links und Logo-Freigabe
   - in der linken Spalte Ablauf und Dokumente
   Die Reihenfolge im DOM bleibt: Kacheln, Termin, Nächste Schritte, Links, Logo, Ablauf, Dokumente (`termine.md`, Kritiker 2).
4. EN: alle neuen Texte englisch („Progress“, „3 of 7“, „steps done“, „Next meeting“, „Your turn“, „All with Erik“, „Documents“).

## Akzeptanzkriterien

- AK-1: `kennzahlen(ansicht)` liefert erledigt und gesamt, den nächsten Termin, die Zahl offener Kundenschritte, die Zahl aktueller Dokumente und das neueste Dokument.
- AK-2: Vier Kacheln mit Bezeichnung und Wert. Die Links springen zu den Karten; „Du bist dran“ ist bei 0 nicht hervorgehoben und nicht verlinkt.
- AK-3: Fortschrittsbalken als `role="progressbar"` mit `aria-valuenow`, `aria-valuemax` und Namen. Ohne Schritte gibt es keinen Balken.
- AK-4: Englisch: alle Kacheltexte englisch.
- AK-5: Bestehende Inhalte (Termin, Schritte, Ablauf, Dokumente, Links, Logo) und ihre Reihenfolge im DOM bleiben, die Tests in `projektuebersicht.md` und `termine.md` bleiben grün.
- AK-6: Keine axe-Verstöße und kein horizontales Scrollen bei 360, 768 und 1280 px, hell und dunkel.

## Barrierefreiheit

- Die Kacheln stehen als `ul` mit Karten, jede mit Bezeichnung (`p`) und Wert.
- Der Balken ist ein `progressbar` mit Text daneben.
- Die Hervorhebung von „Du bist dran“ läuft nicht nur über Farbe, sondern auch über das Icon und den Text.

## Mobile

- Kacheln 2 × 2, ab 1024 px vier nebeneinander.
- Die Karten stehen einspaltig untereinander, ab 1024 px in zwei Spalten.

## Sprachen (DE/EN)

Texte in `lib/kundenbereich/text.ts`.

## SEO / GEO

`noindex`.

## Daten

Keine neuen Daten.

## Tests

- `tests/unit/kundenbereich-projekte.test.tsx`: Kennzahlen und Kacheln (AK-1 bis AK-5)
- `tests/e2e/kundenbereich-projekte.spec.ts`: axe, Layout (AK-6)
