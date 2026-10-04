# Projekte / Case Studies

Status: In Arbeit

## Zweck

Bestehende Case Studies übernehmen. Jede Case Study zeigt Ausgangslage, Vorgehen und Ergebnis in Worten. Zahlen nur, wenn belegt; sonst keine.

## Bestand (Lovable `ProjectsPage.tsx`, `ProjectDetailPage.tsx`, `Lightbox.tsx`, `lib/data.ts`)

- Übersicht `/projects`: h1, Einleitung, Kacheln (Vorschaubild, Typ, Titel, Untertitel) für cpr, sightkick, indonesia, webflow, morocco; danach drei „Kommt bald"-Kacheln (PreMatch, ROSE Bikes App, Axium) ohne Link.
- Detailseite `/projects/<id>`: Zurück-Link, h1, Untertitel, Einleitung, großes Vorschaubild, Meta-Leiste (Typ, Rolle, Zeitraum, Tools, Team), Inhaltsverzeichnis (Desktop links mitlaufend, mobil runder Button unten rechts), Abschnitte (h2) mit Unterabschnitten (h3), Persona-Bilder (cpr), Bildergalerie (indonesia, morocco) mit Lightbox, PDF-Download (webflow), Buttons „Ähnliches Projekt anfragen" und „Zurück".
- Probleme im Bestand: Inhalt nur per JavaScript; Alt-Texte „Indonesia 1" usw.; Inhaltsverzeichnis aus Buttons statt Links; Lightbox ohne Dialog-Rolle und ohne Fokusführung; Typ und Rolle nur einsprachig; „Kommt bald"-Kacheln mit 60 % Deckkraft (zu wenig Kontrast).

## Verhalten

- Übersicht `/projects` (EN `/en/projects`) wie im Bestand. „Kommt bald"-Kacheln sind Listeneinträge ohne Link; das Abblenden betrifft nur die Bildfläche, der Text behält vollen Kontrast.
- Detailseite `/projects/<id>` (EN `/en/projects/<id>`), statisch erzeugt.
- Meta-Leiste als Beschreibungsliste (`dl`); Typ und Rolle je Sprache.
- Inhaltsverzeichnis: echte Sprunglinks (funktionieren ohne JavaScript), im Desktop mitlaufend; der sichtbare Abschnitt ist mit `aria-current="location"` markiert. Mobil öffnet ein Button (`aria-expanded`) die Liste, Escape schließt sie.
- Galerie- und Persona-Bilder öffnen die Lightbox: natives `<dialog>` (modal), Name „Bild 2 von 7", Pfeiltasten und Buttons blättern, Escape und Schließen-Button beenden, Fokus kehrt zum auslösenden Bild zurück.
- Abschluss: „Ähnliches Projekt anfragen" zur Kontaktseite, PDF-Download falls vorhanden.

## Akzeptanzkriterien

- AK-1: Bestehende Projekt-URLs bleiben erreichbar (`/projects/cpr`, `sightkick`, `indonesia`, `webflow`, `morocco`; EN unter `/en`), statisch erzeugt mit eigenem Title und Description; unbekannte Projekte liefern 404.
- AK-2: Optionaler Kennzahlen-Block erscheint nur, wenn Werte mit Quelle hinterlegt sind (derzeit keine).
- AK-3: Galerie- und Persona-Bilder haben beschreibende Alt-Texte in der Sprache der Seite (nicht „Titel 1"); Bilder haben feste Maße (`width`/`height`), werden über `next/image` in modernen Formaten ausgeliefert. Vorschaubilder in Kacheln sind dekorativ (`alt=""`).
- AK-4: JSON-LD `CreativeWork` je Projekt (Name, Beschreibung, Autor, Jahr, Sprache) und `BreadcrumbList`.
- AK-5: Lightbox ist ein modaler Dialog mit Namen, per Tastatur bedienbar (Pfeiltasten, Escape), Fokus bleibt im Dialog und kehrt danach zum auslösenden Bild zurück.
- AK-6: Detailseite: genau eine h1 (Projekttitel), Abschnitte als h2, Unterabschnitte als h3; Meta-Leiste als `dl`.
- AK-7: Inhaltsverzeichnis ist eine benannte Navigation mit Links auf alle h2-Abschnitte.
- AK-8: Übersicht: Kachel-Links heißen wie das Projekt, Typ und Untertitel sind Beschreibung; „Kommt bald"-Projekte ohne Link.
- AK-9: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel), auch bei geöffneter Lightbox.
- AK-10: Jedes Projekt hat in DE und EN Titel, Untertitel, Einleitung, Typ und Rolle. Meta-Title endet auf „| Erik Bergheimer" und ist höchstens 70 Zeichen lang, Description höchstens 160 Zeichen.
- AK-11: Übersicht hat JSON-LD `ItemList` mit allen Projekten.
- AK-12: „Kommt bald"-Kacheln: Screenreader hören zuerst den Titel, dann den Status („Kommt bald"); die Bildfläche ist dekorativ.
- AK-13: Mobiles Inhaltsverzeichnis schließt, sobald der Fokus es verlässt; der runde Button verdeckt keinen Inhalt am Seitenende (Abstand unten).
- AK-14: Galerie-Buttons heißen „Bild 1 von 4 vergrößern: <Alt-Text>" (EN „Enlarge image 1 of 4: <alt>").
- AK-15: Absätze, deren Zeilen alle die Form „Phase: Inhalt" haben, werden als Liste ausgezeichnet.
- AK-16: Titelbild der Detailseite hat einen beschreibenden Alt-Text je Sprache.
- AK-17: Jede Detailseite verlinkt die passende Leistung („Passende Leistung: Webflow-Entwicklung").

## A11y

Siehe AK-3, AK-5 bis AK-7. Untertitel in Grün nutzt `text-primary-text` (Kontrast).

## Mobile

Meta-Leiste untereinander; Galerie zweispaltig; Lightbox-Buttons mindestens 44 × 44 px.

## SEO/GEO

Eigene Meta-Daten je Projekt (aus Bestand übernommen), CreativeWork, Breadcrumbs. Später: Verlinkung Projekt ↔ passende Leistung.

## Sprachen

Alle Texte DE und EN in `lib/content/projects.ts`.

## Daten

Statisch im Code (keine Supabase-Tabelle nötig).

## Tests

`tests/unit/projects.test.tsx` (AK-2 bis AK-4, AK-6 bis AK-8, AK-10 bis AK-17), `tests/e2e/projekte.spec.ts` (AK-1, AK-5, AK-9, AK-19, AK-23). Umbau: AK-18 bis AK-22 in `tests/unit/projects.test.tsx`.

## Befunde Blinder Kritiker (Runde 1)

Behoben (mit Test): englische Titles zu lang und ohne Marke (AK-10), kein ItemList auf der Übersicht (AK-11), „Kommt bald" vor dem Titel vorgelesen (AK-12), mobiles Inhaltsverzeichnis bleibt offen und verdeckt Inhalt (AK-13), holprige Button-Namen der Galerie (AK-14), „Unser Prozess" als ein Absatz (AK-15), Titelbild ohne Alt-Text (AK-16), kein Weg zu den Leistungen (AK-17).
Behoben (Text): „Cardiopulmonary Reanimation" → „Resuscitation"; englische Überschriften auf deutschen Seiten; Tippfehler „evokatativer"; Master-Begriffe vereinheitlicht.

Offen, Entscheidung bei Erik: fehlende Bilder zur CPR-Case-Study (Text verweist auf Skizzen, Moodboard, Wireframes, Film); Texte der Fotoserien passen nicht zu den gezeigten Bildern (Souks, sakrale Orte); „GAMP5-Framework" bei SIGHT'KICK prüfen; Vergleichstabelle und Kurzfazit für Webflow vs. Shopify.

Verschoben: canonical, hreflang, Open Graph seitenweit (`seo/meta-und-schema.md`).

## Offene Fragen

- „Kommt bald"-Projekte (PreMatch, ROSE Bikes App, Axium): bleiben sie, oder gibt es dazu schon Inhalte?

## Umbau Übersicht nach Vorlage designme.agency/projects (Issue #18, Erik 2026-10-04)

Aufbau `/projects`: Kopf (Überline, h1, Untertitel) → Filter → große Projektkarten im Wechsel → „Bald hier“ → Abschluss-CTA.

- AK-18: Kopf mit Überline „Projekte“/„Projects“, genau einer h1 und einem Untertitel.
- AK-19: Filter „Alle“, „UX/UI“, „Web“, „Fotografie“ (EN „All“, „UX/UI“, „Web“, „Photography“) als Buttons mit `aria-pressed` in einer benannten Gruppe; die Kategorie kommt aus der passenden Leistung des Projekts (`service`). Ein Klick blendet die übrigen Projekte aus (`hidden`), ein Status (`role="status"`) nennt die Anzahl („2 Projekte“). Der Filter erscheint nur mit JavaScript; ohne JavaScript sind alle Projekte sichtbar.
- AK-20: Jedes Projekt ist eine große Karte: Bild (Zoom beim Hover nur ohne reduzierte Bewegung), Titel als h2 (Link auf die Detailseite, die ganze Karte ist klickbar; Typ und Untertitel als Beschreibung), Typ als sichtbare Chips (für Screenreader ausgeblendet, sonst doppelt), Jahr, Untertitel und „Fallstudie lesen“ (Fotoprojekte: „Fotoserie ansehen“). Ab 768 px steht das Bild abwechselnd links und rechts.
- AK-21: „Kommt bald“-Projekte stehen in einem eigenen Abschnitt mit h2 „In Arbeit“/„In the pipeline“ und Titeln als h3 (AK-12 gilt weiter). Die Bildfläche ist im Dunkelmodus gedämpft.
- AK-22: Abschluss-CTA mit h2 und Link „Kostenloses Erstgespräch“ zur Kontaktseite.
- AK-24: Meta-Description nennt Augsburg (GEO).
- AK-23: Karten blenden beim Scrollen ein (`data-reveal`); keine axe-Verstöße, kein horizontales Scrollen (AK-9), auch mit aktivem Filter.

### Blinder Kritiker (Umbau Übersicht, 2026-10-04)

Behoben: Typ doppelt vorgelesen (Chips jetzt `aria-hidden`, AK-20), grelle Pastellflächen im Dunkelmodus (AK-21), „Fallstudie lesen“ bei Fotoserien (AK-20), „No-Code-Tools“ und CPR-Untertitel, „Bald hier“ doppelt zum Status („In Arbeit“, AK-21), E-Mail bricht mitten im Wort, Filter-Umbruch bei 360 px, Pfeil ↗ bei internem Link, Augsburg in der Meta-Description (AK-24).
Offen mit Begründung: Reihenfolge der Projekte ist bewusst „stärkstes zuerst“, nicht chronologisch. Ein Ergebnis-Satz je Projekt und eine Domain-E-Mail sind Inhaltsfragen (Issue #14). Filter in der URL wäre schön, ist aber nicht nötig.
