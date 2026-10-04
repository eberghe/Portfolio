# Städte-Landingpages

Status: In Arbeit (Issue #20, Umbau 6). Erste Seite: Augsburg. Weitere Städte nach Eriks Auswahl (Issue #14).

## Zweck

Ranking für Suchen wie „Webdesign Augsburg“, „Webflow Agentur Augsburg“ oder „Barrierefreie Website Augsburg“, und klare Antworten für KI-Suchen (GEO): wer, wo, was, vor Ort oder remote.

## Entscheidung (2026-10-04)

Inhalte liegen vorerst im Code (`lib/content/local.ts`), nicht in Supabase: eine Seite pro Stadt mit eigenem Text, ohne generierte Kombinationen aus Stadt × Leistung (kein Duplicate Content). Eine neue Stadt = ein Eintrag in `localPages` plus eine Route je Sprache.

## Verhalten

- Route `/webdesign-augsburg`, EN `/en/web-design-augsburg`.
- Aufbau nach Vorlage der Leistungsseiten: Hero (Überline, h1 mit Leistung und Ort, Text, Button „Kostenloses Erstgespräch“, Link „Projekte ansehen“) → „Vor Ort und remote“ (Standort, Einsatzgebiet, Arbeitsweise als `dl`, ohne Straße und ohne eingebettete Karte, damit keine Daten an Dritte gehen) → Leistungen für die Stadt (Karten mit Link auf die Leistungsseite) → Gründe (3 Karten) → ortsbezogene FAQ → Abschluss-CTA.
- Querverlinkung: Footer-Link „Webdesign Augsburg“, Leistungsseiten der Stadt-Leistungen verlinken die Landingpage im Ortssatz.

## Akzeptanzkriterien

- AK-1: `/webdesign-augsburg` und `/en/web-design-augsburg` liefern 200, stehen in der Sitemap, haben eigenen Title (endet auf „| Erik Bergheimer“, höchstens 70 Zeichen) und Description (höchstens 160 Zeichen), beide nennen Augsburg; hreflang verweist wechselseitig.
- AK-2: JSON-LD `ProfessionalService` mit `areaServed` (Augsburg als `City`) und `provider` Person, dazu `BreadcrumbList` Start › Seite.
- AK-3: Genau eine h1, sie nennt Leistung und Ort („Webdesign & Webflow in Augsburg“).
- AK-4: Block „Vor Ort und remote“ als Beschreibungsliste mit Standort, Einsatzgebiet und Arbeitsweise; keine Straße.
- AK-5: Leistungs-Karten verlinken auf `/services/<slug>` (Linkname = Leistung).
- AK-6: Ortsbezogene FAQ (mindestens 4 Fragen, jede nennt Augsburg oder die Umgebung) als Akkordeon, JSON-LD `FAQPage` aus denselben Daten.
- AK-7: Footer verlinkt die Landingpage; Leistungsseiten der Stadt-Leistungen verlinken sie im Ortssatz.
- AK-8: DE und EN haben die gleiche Struktur (gleiche Zahl an Leistungen, Gründen, Fragen).
- AK-9: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel).

## Barrierefreiheit

Abschnitte mit h2, Karten mit h3, FAQ über `FaqList` (Frage als Überschrift in `summary`).

## Tests

`tests/unit/lokal.test.tsx` (AK-2 bis AK-8), `tests/e2e/lokal.spec.ts` (AK-1, AK-9).
