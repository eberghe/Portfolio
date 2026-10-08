# Kundenbereich: Projektübersicht

Status: In Arbeit

## Zweck

Startseite des Kundenbereichs nach dem Login (Issue #51): Ansprechpartner sehen auf einen Blick, wo ihr Projekt steht, wie es abläuft, was als Nächstes passiert und was sie selbst liefern sollen.

## Nutzer & Ziel

- **Ansprechpartner:** will ohne Nachfragen wissen, in welcher Phase das Projekt ist, was als Nächstes kommt und wo die Website (live, Staging) liegt.
- **Erik (Admin):** sieht dieselbe Ansicht für alle Projekte, mit dem Kundennamen dazu, und prüft so, was seine Kunden sehen.

## Verhalten

1. Angemeldet zeigt `/kunden` (EN `/en/clients`) die h1 „Kundenbereich“, darunter „Hallo, <Name>“ (Admins mit Hinweis „Admin“) und „Abmelden“.
2. Der Server lädt die Projekte mit dem Access Token des Nutzers über die Supabase-REST-Schnittstelle, sodass die Zugriffsregeln aus `datenmodell.md` entscheiden, was sichtbar ist. Geladen werden Projekt, Kundenname und Schritte in einer Abfrage, neueste Projekte zuerst.
3. Mehrere Projekte: eine Navigation „Deine Projekte“ mit einem Link je Projekt (`?projekt=<id>`); das gezeigte hat `aria-current="page"`. Ohne oder mit unbekannter `projekt`-Angabe wird das neueste gezeigt. Bei einem Projekt gibt es keine Navigation.
4. Ein Projekt zeigt:
   - Kundenname (klein über dem Titel), Titel als h2, Status als Text-Plakette („Angebot“, „In Arbeit“, „In Abstimmung“, „Abgeschlossen“, „Pausiert“), „Aktuelle Phase: …“ und die Beschreibung.
   - **Ablauf** (h3): alle Schritte in ihrer Reihenfolge als geordnete Liste im Stil des Projektablaufs der Startseite (Kreis-Symbol, Verbindungslinie). Jeder Schritt zeigt seinen Stand als Symbol und Text („Erledigt“, „Läuft gerade“, „Offen“), also nicht nur über Farbe. Der aktuelle Schritt hat `aria-current="step"`: der erste mit Stand „aktiv“, sonst der erste offene. Fälligkeit als Datum („bis 15. Okt. 2026“).
   - **Nächste Schritte** (h3): bis zu drei noch nicht erledigte Schritte in Reihenfolge, je mit „Von dir“ (verantwortlich: Kunde) oder „Von mir“ (Erik) und Fälligkeit. Sind alle erledigt: „Alles erledigt.“
   - **Links** (h3), nur wenn hinterlegt: „Website“ und „Testversion (Staging)“. Sie öffnen in einem neuen Tab, erkennbar am Symbol und am für Screenreader angesagten Zusatz „(öffnet in neuem Tab)“, mit `rel="noopener noreferrer"`.
5. Texte von Projekt und Schritten kommen in der Sprache der Seite; fehlt der englische Text, steht der deutsche.
6. Keine Projekte: „Hier ist noch kein Projekt hinterlegt. Sobald es losgeht, siehst du hier den Stand.“ Laden fehlgeschlagen: „Deine Projekte konnten gerade nicht geladen werden. Lade die Seite bitte neu.“

## Akzeptanzkriterien

- AK-1: Projekte werden mit `Authorization: Bearer <Access Token>` und dem öffentlichen Schlüssel geladen (nie mit dem Service-Role-Schlüssel), mit eingebetteten Schritten und Kundennamen, sortiert nach `created_at` absteigend. Ein Fehler liefert `null` statt einer Ausnahme.
- AK-2: Die Aufbereitung sortiert Schritte nach `reihenfolge`, wählt Texte der Sprache mit Rückfall auf Deutsch, bestimmt den aktuellen Schritt (erster aktiver, sonst erster offener, sonst keiner) und die bis zu drei nächsten Schritte.
- AK-3: Die Ansicht zeigt h2 mit Titel, Status als Text, Phase, Beschreibung und den Ablauf als `ol`; jeder Schritt hat seinen Stand als sichtbaren Text, genau der aktuelle hat `aria-current="step"`.
- AK-4: „Nächste Schritte“ zeigt höchstens drei offene Schritte mit Zuständigkeit und Fälligkeit, sonst „Alles erledigt.“
- AK-5: Links zur Website und Staging erscheinen nur, wenn hinterlegt, öffnen im neuen Tab mit `rel="noopener noreferrer"` und angesagtem Hinweis.
- AK-6: Bei mehreren Projekten gibt es die Navigation mit `aria-current="page"` am gezeigten Projekt; `?projekt=` wählt es aus, eine unbekannte Angabe zeigt das neueste. Bei einem Projekt keine Navigation.
- AK-7: Ohne Projekte erscheint der Leer-Hinweis, bei einem Ladefehler der Fehler-Hinweis.
- AK-8: Englisch: alle Texte, Status und Datumsformat auf Englisch, Projekttexte englisch mit Rückfall auf Deutsch.
- AK-9: Keine axe-Verstöße, kein horizontales Scrollen bei 360/768/1280, hell und dunkel (E2E mit nachgebildetem Supabase).

## Barrierefreiheit

Überschriften h1 → h2 (Projekt) → h3 (Abschnitte). Ablauf als `ol` mit `aria-current="step"`; Stand als Text, Symbole `aria-hidden`. Projektwahl als `nav` mit Namen. Externe Links mit angesagtem Hinweis. Ziele mindestens 44 px hoch.

## Mobile

Einspaltig bis 768 px; Projektnavigation bricht um statt seitlich zu scrollen. Ab 1024 px stehen Ablauf und die Spalte mit nächsten Schritten und Links nebeneinander.

## Sprachen (DE/EN)

Alle festen Texte in `lib/kundenbereich/text.ts`. Datumsformat `de-DE` bzw. `en-GB`, als reines Datum (ohne Zeitzonenverschiebung).

## SEO / GEO

Keine Indexierung (siehe `login.md`).

## Daten

Liest `kundenprojekte` mit `kunden(name)` und `projektschritte` aus `datenmodell.md`; keine neue Migration. Pflege bis zur Admin-Ansicht (#53) in Supabase Studio.

## Tests

- `tests/unit/kundenbereich-projekte.test.ts(x)`: Laden und Aufbereitung (AK-1, AK-2), Ansicht (AK-3 bis AK-8)
- `tests/e2e/kundenbereich-projekte.spec.ts` mit `tests/e2e/fake-supabase.mjs`: angemeldete Ansicht, axe, Mobile (AK-6, AK-9)

## Offene Fragen

- Erik pflegt Schritte zunächst in Supabase Studio; Vorlagen für typische Abläufe kommen mit der Admin-Ansicht (#53).

## Befunde Blinder Kritiker (2026-10-08)

Geprüft: Anna (DE/EN), Erik mit zwei Projekten, Nutzer ohne Projekt, je 360/768/1280 px, hell und dunkel. axe 0 Verstöße in 30 Läufen, kein horizontales Scrollen (auch 320 px), Überschriften h1 → h2 → h3, Tab-Reihenfolge und Fokus in Ordnung.

Behoben (mit Test):
- Projekt ohne Schritte zeigte „Alles erledigt.“; jetzt „Die Schritte plane ich gerade …“.
- Deutscher Ersatztext auf der englischen Seite hatte kein `lang="de"` (WCAG 3.1.2); Beschreibung, Schritt- und Termintitel tragen es jetzt, wenn der deutsche Text einspringt. Titel und Phase des Projekts gibt es nur einsprachig, sie bleiben ohne `lang`.
- Leer-Zustand ohne nächsten Schritt; jetzt in einer Karte mit „Fragen? Schreib mir“ (Mail).
- Gewähltes Projekt in der Projektwahl nur über Farbe erkennbar; jetzt zusätzlich mit Haken.
- Social-Links im Footer öffneten einen neuen Tab ohne Hinweis; jetzt per `aria-describedby` angesagt (seitenweit).

Bewusst offen (niedrig):
- `aria-current="step"` sei nicht vorhanden: ist gesetzt (Unit- und E2E-Test), der Accessibility-Snapshot von Playwright zeigt es bei Listenpunkten nur nicht an.
- Der laufende Schritt steht auch unter „Nächste Schritte“: gewollt, er ist das, woran gerade gearbeitet wird.
- „Abmelden“ sitzt unten bündig mit der Begrüßung; „Nach oben“ im Footer ist 20 px hoch, mit Abstand zulässig (2.5.8) und seitenweit.
