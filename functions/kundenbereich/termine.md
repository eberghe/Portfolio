# Kundenbereich: Nächster Termin mit Google-Meet-Link

Status: In Arbeit

## Zweck

Der Ansprechpartner sieht in der Projektübersicht das nächste Meeting mit Datum, Uhrzeit und Thema, tritt mit einem Klick dem Google Meet bei und übernimmt den Termin in den eigenen Kalender (Issue #52).

## Nutzer & Ziel

- **Ansprechpartner:** will wissen, wann das nächste Meeting ist, und es nicht verpassen.
- **Erik:** trägt Termine mit Meet-Link selbst ein (Tabelle `termine`, bis zur Admin-Ansicht #53 in Supabase Studio).

## Verhalten

1. Die Projekte werden mit ihren Terminen geladen (eingebettet, Zugriffsregeln wie in `datenmodell.md`).
2. Vergangene Termine (Ende vor jetzt) werden ausgeblendet. Der früheste kommende ist der „Nächste Termin“, bis zu drei weitere stehen darunter als „Danach“.
3. Abschnitt **Nächster Termin** (h3) in der rechten Spalte über „Nächste Schritte“:
   - Thema (Titel in der Sprache der Seite, Rückfall Deutsch, sonst „Projekttermin“ / „Project meeting“).
   - Datum und Uhrzeit als `<time datetime="…">` immer in deutscher Zeit (Europe/Berlin) mit Zeitzonenkürzel, z. B. „Do., 15. Okt. 2026, 10:00–11:00 MESZ“. Weicht die Zeitzone des Browsers ab, steht die Ortszeit dahinter: „(bei dir 09:00–10:00 GMT+1)“.
   - Button „Google Meet beitreten“ (primär, neuer Tab, angesagter Hinweis), nur wenn ein Meet-Link hinterlegt ist.
   - Button „In Kalender übernehmen“ lädt eine `.ics`-Datei.
4. Kein kommender Termin: „Gerade ist kein Termin geplant.“ Der Abschnitt bleibt stehen, damit man weiß, wo Termine erscheinen.
5. Kalenderdatei: `/kunden/termine/<id>?sprache=de|en`. Der Server prüft die Sitzung und lädt den Termin mit dem Token des Nutzers (fremde oder unbekannte Termine: 404, ohne Sitzung: 401). Inhalt: `VEVENT` mit `UID`, `DTSTART`/`DTEND` in UTC, `SUMMARY` (Thema und Projekt), `URL` und `LOCATION` = Meet-Link, `DESCRIPTION` mit Meet-Link. `Content-Type: text/calendar`, als Anhang, `Cache-Control: private, no-store`.

## Akzeptanzkriterien

- AK-1: Die Abfrage der Projekte bettet `termine(id,beginn,ende,titel_de,titel_en,meet_url)` ein.
- AK-2: Die Aufbereitung blendet Termine mit Ende vor jetzt aus, sortiert nach Beginn und liefert den nächsten und bis zu drei weitere; Titel mit Sprachrückfall.
- AK-3: Die Ansicht zeigt h3 „Nächster Termin“, Thema, `<time>` mit ISO-Beginn, Uhrzeit mit Zeitzonenkürzel, „Google Meet beitreten“ (neuer Tab, `rel="noopener noreferrer"`, Hinweis) und „In Kalender übernehmen“ mit Link auf die Kalenderdatei.
- AK-4: Ohne Meet-Link kein Meet-Button; ohne kommenden Termin „Gerade ist kein Termin geplant.“
- AK-5: Die Kalenderdatei ist gültiges iCalendar (CRLF, Escape von `,` `;` `\` und Zeilenumbrüchen, UTC-Zeiten) mit den Feldern aus Verhalten 5.
- AK-6: Die Kalenderroute antwortet ohne Sitzung 401, für einen nicht sichtbaren Termin 404, sonst 200 mit `text/calendar` und Anhang.
- AK-7: Englisch: „Next meeting“, „Join Google Meet“, „Add to calendar“, Datumsformat englisch.
- AK-8: Keine axe-Verstöße, kein horizontales Scrollen bei 360/768/1280, hell und dunkel.

## Barrierefreiheit

Datum als `<time>`; Buttons 44 px, externer Link angesagt; Zeitzonenkürzel sichtbar, damit klar ist, welche Zeit gemeint ist.

## Mobile

Buttons umbrechen untereinander bei 360 px.

## Sprachen (DE/EN)

Texte in `lib/kundenbereich/text.ts`, Datumsformat `de-DE` / `en-GB`.

## Daten

Tabelle `termine` aus `datenmodell.md`, keine neue Migration. Später optional: Abgleich mit Google Kalender.

## Tests

- `tests/unit/kundenbereich-termine.test.tsx`: Aufbereitung, Ansicht, Kalenderdatei, Route (AK-1 bis AK-7)
- `tests/e2e/kundenbereich-projekte.spec.ts`: Termin in der angemeldeten Ansicht, Kalenderdatei, axe (AK-3, AK-6, AK-8)

## Befunde Blinder Kritiker (2026-10-08, zusammen mit Dokumente)

Geprüft: Anna DE/EN bei 360/768/1280 px, hell und dunkel; axe 0 Verstöße in 12 Kombinationen, kein horizontales Scrollen, `.ics` lädt als Download, Fokus sichtbar.

Behoben (mit Test):

- Uhrzeit stand nur in der Zeitzone des Browsers (im Test UTC); jetzt immer deutsche Zeit, abweichende Ortszeit dahinter.
- Auf dem Handy stand der nächste Termin unter allen Dokumenten, auf dem Desktop kam er in der Tab-Reihenfolge erst nach ihnen; jetzt folgen im DOM auf das Projekt Termin, nächste Schritte und Links, dann Ablauf und Dokumente (Desktop-Layout unverändert).
- Dateiname der Kalenderdatei enthält das Datum (`termin-2026-10-15.ics`).
- Logo-Vorschau hatte einen doppelten Alternativtext (siehe `dokumente.md`).

Bewusst offen (niedrig):

- Fehlende englische Termintitel und Dokumenttitel sind Daten; Termintitel bekommen beim Rückfall `lang="de"`, Dokumenttitel sind einsprachig.
- „In Kalender übernehmen“ nennt das Format nicht; Kalender-Apps öffnen die Datei direkt.
