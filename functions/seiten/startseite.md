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

## Befunde Blinder Kritiker (2026-10-04) und Umsetzung
Behoben, jeweils mit Test:
- AK-11: h1 „Hi, ich bin Erik" (klein „ich"), Rolle wird mit Pause vorgelesen.
- AK-12: Kachel-Links heißen wie ihre Überschrift; Kategorie und Text sind Beschreibung (`aria-describedby`). Vorher wurde jede Kachel als langer Satz vorgelesen.
- AK-13: „Featured Projekte: 5" widersprach den 4 gezeigten Projekten → „Projekte im Portfolio". Deutsche Projekttypen auf Deutsch (Masterarbeit, Bachelorarbeit, Indonesien).
- AK-14: Hero-Foto wurde bei Tablet/Desktop zu klein geladen und unscharf hochskaliert → passende `sizes`.
- AK-15: `scroll-padding-top`, damit der Sticky-Header fokussierte Elemente nicht verdeckt.
- Navigation AK-16: Menüpunkte brechen bei 768 px nicht mehr um.
- EN-Ablauf „Getting to know" → „Intro call".

Von Erik am 2026-10-04 entschieden und umgesetzt (AK-17):
- h1 mit vollem Namen „Hi, ich bin Erik Bergheimer".
- Hauptbutton „Kostenloses Erstgespräch" / „Free intro call".
- Hero-Text nennt „freiberuflich" und Einsatzgebiet (Augsburg & Innsbruck, Kunden in DE, AT und remote).
- Faktenleiste: „3 Länder & Remote" ersetzt durch „DE · AT – Vor Ort & remote".
- Barrierefreiheit: „Umsetzung der BFSG-Anforderungen" statt „Beratung zum BFSG".

Noch offen:
- Belege je Leistung (Kundenprojekte, Referenzen).
- Englische Begriffe auf der deutschen Seite („Webflow Expert", „Kernservice", „Travel & Editorial", „Design Systems").
- Schriftgrößen (10–13 px) und unauffällige h2 sind Bestandsdesign; Anhebung nur mit Freigabe.

Später: JSON-LD (Person/ProfessionalService) mit der SEO-Funktion.
