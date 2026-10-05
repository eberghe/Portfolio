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
- Hero wie im Bestand; Badge „Augsburg" (siehe `standort.md`); Alter wird aus dem Geburtsjahr nicht berechnet, sondern weggelassen (Erik bestätigt). Chips mit den aktuellen Leistungen.
- Tools: Liste der Werkzeuge (einmal im Accessibility-Tree, keine Links). Das Laufband ist Dekoration (`aria-hidden`), läuft nur bei `prefers-reduced-motion: no-preference` und hat einen Pause-Knopf (`aria-pressed`).
- Zeitleiste als geordnete Liste (`ol`), Datum als `<time>`, Bilder mit beschreibendem Alt-Text oder dekorativ, wenn sie nur die Überschrift wiederholen. Die Füll-Linie beim Scrollen entfällt; Linie und Punkte bleiben statisch (Design).
- JSON-LD `ProfilePage` mit `mainEntity` = Person (gleiche `@id` wie überall).
- Abschluss: Link zur Kontaktseite.

## Akzeptanzkriterien

- AK-1: Seite in DE und EN, genau eine h1, eigene Title/Description, in Sitemap.
- AK-2: JSON-LD `ProfilePage` mit Person (`@id` `/#person`).
- AK-3: Werkzeuge stehen genau einmal als Liste im Accessibility-Tree; das bewegte Laufband ist `aria-hidden` und enthält keine fokussierbaren Elemente.
- AK-4: Laufband hat einen Pause-Knopf mit `aria-pressed`; bei reduzierter Bewegung läuft es nicht.
- AK-5: Zeitleiste ist ein `ol` mit 15 Einträgen, jedes mit `<time dateTime>` und Überschrift (h3).
- AK-6: Keine englischen Begriffe auf der deutschen Seite, die eine deutsche Entsprechung haben („Working Student" → „Werkstudent", „Bachelor Thesis" → „Bachelorarbeit").
- AK-8: Der Vorstellungstext sagt, dass Erik freiberuflich Projekte annimmt (Leistungen, Orte).
- AK-9: Zeitleiste durchgehend in der Vergangenheit; kein Bild doppelt.
- AK-10: Werkzeuge im Laufband und in der FAQ-Antwort stimmen überein; nur Werkzeuge, keine Plattformen (kein Dribbble).
- AK-11: Master abgeschlossen (Erik, 2026-10-04): letzter Eintrag der Zeitleiste ist „Masterabschluss am MCI“ (Monat 2026-09, von Erik zu bestätigen); kein Text sagt mehr, dass Erik am MCI studiert (Vorstellung, Innsbruck-Eintrag, `llms.txt`); Person-JSON-LD nennt in `alumniOf` TH Ingolstadt und MCI. Kein Umzugs-Eintrag zurück nach Deutschland (Erik).
- AK-12: Vorstellung und Zeitleiste stehen durchgehend in der Vergangenheit (auch HERO Software); die Vorstellung sagt in DE und EN dasselbe (Orte Augsburg, Bali, Innsbruck). Person-JSON-LD nennt den Arbeitsort-Staat in der Sprache der Seite (Deutschland/Germany).
- AK-7: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel).

## Daten

`lib/content/about.ts` (Zeitleiste, Werkzeuge).

## Tests

`tests/unit/ueber-mich.test.tsx` (AK-2 bis AK-6, AK-11, AK-12), `tests/e2e/statische-seiten.spec.ts` (AK-1, AK-7).

## Offene Fragen

- Altersangabe („25 Jahre") weglassen? Vorschlag: ja, weil sie veraltet.

## Befunde Blinder Kritiker (Runde 1)

Behoben (mit Test): Freelance-Tätigkeit fehlte (AK-8), Zeitform und doppeltes Foto (AK-9), Werkzeuge widersprachen der FAQ (AK-10), „Innsbruck · M.A. MCI" ausgeschrieben, TH Ingolstadt einheitlich benannt, Person-JSON-LD mit `image` (`knowsAbout` steht bereits am ProfessionalService der Startseite).

Bewusst so gelassen: Schriftgrößen 11 px gehören zum bestehenden Design (Änderung nur mit Eriks OK).

## Befunde Blinder Kritiker (Runde 2, Masterabschluss)

Behoben (mit Test, AK-12): HERO-Eintrag in Vergangenheit, Vorstellung DE/EN angeglichen, doppeltes „working“, Arbeitsort-Staat im EN-JSON-LD. Ohne Test mitbehoben: „Sie zeigte mir“ (Workation), „Bis zur Abreise“ statt „Davor“ (IKEA).
Als Issue angelegt: Ort im Kopfbereich doppelt, „Sept“ vs. „Sep“ im EN-Datum, einheitliche Hochschulnamen mit `sameAs`, About-Seite fehlt in `llms.txt`, „?.“ in `llms.txt`.

## Business Development Manager (Erik, 2026-10-05)

Erik: „bin aktuell business development manager nicht werkstudent“ und „seit september bin ich business development manager“.

- AK-13: Die Zeitleiste endet mit „Business Development Manager bei HERO Software“ (2026-09, nach dem Masterabschluss im selben Monat). Die Vorstellung nennt die aktuelle Rolle; der Werkstudent-Eintrag (2025-09) bleibt als Station.
