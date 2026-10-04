# Über mich

Status: In Arbeit

## Zweck

Wer ist Erik, was kann er, wie kam er dahin. Für Interessenten Vertrauen, für KI-Suchen belastbare Personenfakten.

## Bestand (Lovable `AboutPage.tsx`, `LogoSlider.tsx`, `tlData`)

- Hero (halb Text, halb Foto): Badge „Innsbruck, Austria", h1 „Erik Bergheimer — UX/UI Designer & Webflow Expert", Zeile „Portfolio · Augsburg & Innsbruck", „Innsbruck · 25 Jahre · M.A. MCI", Vorstellungstext, Chips.
- Laufband „Tools, mit denen ich arbeite" (9 Logos, je dreimal als Link, läuft endlos, pausiert nur bei Mausberührung).
- Zeitleiste „Mein Weg" (13 Stationen 2018–2025, 9 mit Bild), Linie füllt sich beim Scrollen.
- Probleme im Bestand: Laufband ohne Pause-Knopf (WCAG 2.2.2) und mit 27 Tab-Stopps; Bilder mit Alt-Text = Überschrift; Badge englisch auf deutscher Seite; Altersangabe veraltet schnell.

## Verhalten

- `/about` (EN `/en/about`).
- Hero wie im Bestand; Badge je Sprache („Augsburg & Innsbruck"); Alter wird aus dem Geburtsjahr nicht berechnet, sondern weggelassen (Erik bestätigt). Chips mit den aktuellen Leistungen.
- Tools: Liste der Werkzeuge (einmal im Accessibility-Tree, keine Links). Das Laufband ist Dekoration (`aria-hidden`), läuft nur bei `prefers-reduced-motion: no-preference` und hat einen Pause-Knopf (`aria-pressed`).
- Zeitleiste als geordnete Liste (`ol`), Datum als `<time>`, Bilder mit beschreibendem Alt-Text oder dekorativ, wenn sie nur die Überschrift wiederholen. Die Füll-Linie beim Scrollen entfällt; Linie und Punkte bleiben statisch (Design).
- JSON-LD `ProfilePage` mit `mainEntity` = Person (gleiche `@id` wie überall).
- Abschluss: Link zur Kontaktseite.

## Akzeptanzkriterien

- AK-1: Seite in DE und EN, genau eine h1, eigene Title/Description, in Sitemap.
- AK-2: JSON-LD `ProfilePage` mit Person (`@id` `/#person`).
- AK-3: Werkzeuge stehen genau einmal als Liste im Accessibility-Tree; das bewegte Laufband ist `aria-hidden` und enthält keine fokussierbaren Elemente.
- AK-4: Laufband hat einen Pause-Knopf mit `aria-pressed`; bei reduzierter Bewegung läuft es nicht.
- AK-5: Zeitleiste ist ein `ol` mit 13 Einträgen, jedes mit `<time dateTime>` und Überschrift (h3).
- AK-6: Keine englischen Begriffe auf der deutschen Seite, die eine deutsche Entsprechung haben („Working Student" → „Werkstudent", „Bachelor Thesis" → „Bachelorarbeit").
- AK-7: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel).

## Daten

`lib/content/about.ts` (Zeitleiste, Werkzeuge).

## Tests

`tests/unit/ueber-mich.test.tsx` (AK-2 bis AK-6), `tests/e2e/statische-seiten.spec.ts` (AK-1, AK-7).

## Offene Fragen

- Altersangabe („25 Jahre") weglassen? Vorschlag: ja, weil sie veraltet.
