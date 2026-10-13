# Kundenbereich: Angebot als PDF und AGB-Entwurf

Status: In Arbeit

## Zweck

Das PDF zu einem Angebot (`angebote.md`) entsteht automatisch auf dem Server, in Eriks Design: Mona Sans, seine Farben, sein Schriftzug und seine Adresse. Wunsch von Erik am 2026-10-13: „erstelle gerne mal ein beispiel pdf mit meinem design, meiner schrift, meiner Adresse und erstelle auch mal AGBs etc.“

## Nutzer & Ziel

- **Kunde:** bekommt ein klares, ruhiges Angebot, das aussieht wie die Website: was es kostet, was drin ist, bis wann es gilt, wo er unterschreibt.
- **Erik:** muss nichts gestalten; jedes Angebot sieht gleich gut aus.

## Verhalten

1. Format A4 hochkant, Ränder 56 pt, nur Mona Sans (Regular, Bold, Italic), eingebettet und auf die genutzten Zeichen reduziert.
2. Farben aus `app/globals.css`: Text `--foreground` (#17222B), Akzent `--primary` (#377662), Linien und Flächen in hellem Grün (`--primary-light`) und Grau.
3. **Kopf** jeder ersten Seite: links der Schriftzug „ERIK BERGHEIMER“ (derselbe Pfad wie `components/Logo.tsx`), rechts Absender: Erik Bergheimer, Weißdornstraße 5, 86343 Königsbrunn, E-Mail, Website. Darunter eine dünne grüne Linie.
4. **Empfänger** links, rechts ein Block mit Angebotsnummer, Datum, Gültig bis und Projekt.
5. **Titel** groß und fett: „Angebot 2026-002“, darunter der Titel des Angebots. Dann die Einleitung (oder ein Standardsatz).
6. **Positionen** als Tabelle: Nr., Leistung (Bezeichnung fett, Beschreibung darunter in Grau, umbrochen), Menge mit Einheit, Einzelpreis, Betrag. Kopfzeile in hellem Grün. Lange Tabellen gehen auf die nächste Seite, die Kopfzeile wiederholt sich.
7. **Summen** rechtsbündig: Netto, Umsatzsteuer 19 % (oder der Hinweis „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“), Gesamt fett in einem grünen Feld.
8. **Bedingungen:** Gültigkeit, Zahlungsziel 14 Tage nach Rechnung, Hinweis auf die AGB (nur wenn sie freigegeben sind, siehe 11).
9. **Unterschrift:** „Angebot angenommen“ mit zwei Linien „Ort, Datum“ und „Unterschrift Auftraggeber“, darunter der Hinweis, das unterschriebene Angebot im Kundenbereich hochzuladen (mit Adresse).
10. **Fuß** jeder Seite: Name, Adresse, E-Mail, Website links, „Seite 1 von 2“ rechts. Metadaten des PDFs: Titel, Autor „Erik Bergheimer“, Sprache.
11. **AGB:** Der Entwurf steht in `lib/kundenbereich/angebot/agb.ts` (Deutsch). Solange `AGB_FREIGEGEBEN` `false` ist, hängen Angebote keine AGB an und verweisen nicht darauf. Das Beispiel-PDF hängt sie zur Ansicht an, jede Seite mit „Entwurf, nicht rechtlich geprüft“.
12. Englische Angebote: alle festen Texte englisch, Beträge und Datum im englischen Format, keine AGB (der Entwurf ist nur deutsch).
13. Ein Skript `scripts/beispiel-angebot.ts` erzeugt ein Beispiel mit erfundenen Positionen und dem AGB-Entwurf.

## Akzeptanzkriterien

- AK-1: `angebotPdf(daten)` liefert ein gültiges PDF (beginnt mit `%PDF-`), Titel „Angebot <Nummer>“, Autor „Erik Bergheimer“, Sprache `de-DE` bzw. `en-GB`.
- AK-2: Der Text des PDFs enthält Absender mit „Weißdornstraße 5“ und „86343 Königsbrunn“, Nummer, Datum, Gültig bis, alle Positionen, Netto, Umsatzsteuer und Gesamt im Format der Sprache (`1.234,50 €` bzw. `€1,234.50`).
- AK-3: Ohne Umsatzsteuer steht der Hinweis auf § 19 UStG statt der Zeile Umsatzsteuer.
- AK-4: Als Schrift ist nur Mona Sans eingebettet (keine Standardschrift).
- AK-5: Bei 30 Positionen hat das PDF mehr als eine Seite, jede mit „Seite n von m“.
- AK-6: Ohne freigegebene AGB enthält das PDF weder „Allgemeine Geschäftsbedingungen“ noch „AGB“; das Beispiel enthält die AGB und „Entwurf, nicht rechtlich geprüft“.
- AK-7: Das Wort „freiberuflich“ kommt weder im PDF noch in den AGB vor.

## Barrierefreiheit

pdf-lib erzeugt kein getaggtes PDF. Text bleibt echter Text (kopier- und durchsuchbar), Sprache und Titel sind gesetzt, Kontraste wie auf der Website. Ein getaggtes PDF (PDF/UA) ist eine offene Frage.

## Mobile

Nicht betroffen.

## Sprachen (DE/EN)

Feste Texte in `lib/kundenbereich/angebot/texte.ts`.

## SEO / GEO

Nicht betroffen.

## Daten

Keine eigene Tabelle; Daten aus `angebote`. Schrift aus `@fontsource/mona-sans` (OFL), als Base64 in `lib/kundenbereich/angebot/schrift.ts`, damit sie im Server-Bundle sicher mitkommt.

## Tests

- `tests/unit/kundenbereich-angebot-pdf.test.ts`: AK-1 bis AK-7 (Text über die Inhaltsströme des PDFs)

## Offene Fragen

- AGB müssen rechtlich geprüft werden, bevor `AGB_FREIGEGEBEN` auf `true` geht.
- Du oder Sie im Angebot: vorerst „du“ wie im Kundenbereich.
- Getaggtes PDF für Screenreader.
