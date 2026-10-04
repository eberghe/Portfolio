# Startseite

Status: In Arbeit

## Zweck
Erster Eindruck: wer Erik ist, was er anbietet, wie die Zusammenarbeit abläuft, und ein klarer Weg zur Anfrage.

## Bestand (Lovable `src/pages/HomePage.tsx`)
Hero (Badge „Verfügbar für Projekte", „Hi, Ich bin Erik", Untertitel, Text, zwei Buttons, Foto rechts), Faktenleiste (6+ Jahre UX-Erfahrung, 5 Projekte, 3 Länder, Standort), Leistungen als Kacheln, ausgewählte Projekte mit Bild. Einblend-Animationen per framer-motion.

## Verhalten
- Aufbau und Optik wie im Bestand.
- Leistungen: die acht Leistungen aus `seiten/leistungen.md`; UX/UI bleibt die hervorgehobene Kachel. Texte der neuen Leistungen sind Entwürfe, Erik passt sie an.
- Neu zwischen Leistungen und Projekten: Kurzfassung „So arbeiten wir zusammen" (4 Schritte, siehe `seiten/projektablauf.md`). Inhalt ist ein Vorschlag.
- Animationen nur per CSS und nur bei `prefers-reduced-motion: no-preference`; kein framer-motion (weniger JavaScript, Inhalt sofort sichtbar).
- Bilder über `next/image` (moderne Formate, feste Maße, Hero mit Priorität).

## Akzeptanzkriterien
- AK-1: Hero-Überschrift steht ohne JavaScript im HTML („Hi, Ich bin Erik" / „Hi, I'm Erik").
- AK-2: Genau eine h1; jeder weitere Abschnitt hat eine h2 („Was ich anbiete", „So arbeiten wir zusammen", „Ausgewählte Projekte").
- AK-3: Der Ablauf ist eine geordnete Liste (`ol`) mit 4 Schritten.
- AK-4: Primärer Button „Kontakt" führt zu `/contact` (EN `/en/contact`), zweiter Button zu den Projekten.
- AK-5: Alle acht Leistungen verlinken auf `/services/<slug>` der jeweiligen Sprache; der Linkname enthält den Titel.
- AK-6: Projektkarten verlinken auf `/projects/<id>`; Vorschaubilder sind dekorativ (`alt=""`), der Linkname ist der Projekttitel.
- AK-7: Hero-Foto hat einen beschreibenden Alt-Text und wird mit Priorität geladen.
- AK-8: Faktenleiste ist eine Beschreibungsliste (`dl`): Bezeichnung und Wert gehören für Screenreader zusammen.
- AK-9: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel).
- AK-10: Alle Texte auf Deutsch und Englisch; Seitentitel und Description je Sprache.

## Sprachen (DE/EN)
Texte in `lib/content/home.ts`, Leistungen in `lib/content/services.ts` (werden von den Leistungsseiten wiederverwendet).

## Tests
`tests/unit/home.test.tsx` (AK-2 bis AK-8, AK-10), `tests/e2e/startseite.spec.ts` (AK-1, AK-7, AK-9).

## Offene Fragen
- Texte für KI-Beratung, Website- & Prozessoptimierung, Brand- & Logo-Design und Webflow-Entwicklung sowie die vier Ablauf-Schritte: Erik prüft die Entwürfe.
