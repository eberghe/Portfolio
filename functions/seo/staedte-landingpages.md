# Städte-Landingpages

Status: In Arbeit (Issue #20, Umbau 6). Augsburg fertig (PR #21). Erik (2026-10-05): „webdesign und entwicklung münchen, stuttgart, innsbruck, kempten etc. das alles auch im footer verlinken“.

## Zweck

Ranking für Suchen wie „Webdesign Augsburg“, „Webflow Agentur Augsburg“ oder „Barrierefreie Website Augsburg“, und klare Antworten für KI-Suchen (GEO): wer, wo, was, vor Ort oder remote.

## Entscheidung (2026-10-04)

Inhalte liegen vorerst im Code (`lib/content/local.ts`), nicht in Supabase: eine Seite pro Stadt mit eigenem Text, ohne generierte Kombinationen aus Stadt × Leistung (kein Duplicate Content). Eine neue Stadt = ein Eintrag in `localPages` plus eine Route je Sprache.

## Verhalten

- Routen:
  - `/webdesign-augsburg`, EN `/en/web-design-augsburg`
  - `/webdesign-muenchen`, EN `/en/web-design-munich`
  - `/webdesign-stuttgart`, EN `/en/web-design-stuttgart`
  - `/webdesign-innsbruck`, EN `/en/web-design-innsbruck`
  - `/webdesign-kempten`, EN `/en/web-design-kempten`
- Ehrlicher Ortsbezug: Erik sitzt in Königsbrunn bei Augsburg. Vor Ort heißt nur dort „Augsburg und Umgebung“; in München, Stuttgart, Innsbruck und Kempten sind Termine vor Ort „nach Absprache“, die Arbeit läuft remote. Innsbruck hat echten Bezug (Master am MCI, SIGHT'KICK); die Seite nennt Österreich als Land im JSON-LD. Das gilt nur für diese Landingpage; Standort bleibt Deutschland (functions/seiten/standort.md).
- Jede Stadt hat eigene Texte (Einleitung, Gründe, FAQ), damit keine Doorway-Seiten entstehen.
- Aufbau nach Vorlage der Leistungsseiten: Hero (Überline, h1 mit Leistung und Ort, Text, Button „Kostenloses Erstgespräch“, Link „Projekte ansehen“) → „Vor Ort und remote“ (Standort, Einsatzgebiet, Arbeitsweise als `dl`, ohne Straße und ohne eingebettete Karte, damit keine Daten an Dritte gehen) → Leistungen für die Stadt (Karten mit Link auf die Leistungsseite) → Gründe (3 Karten) → ortsbezogene FAQ → Abschluss-CTA.
- Querverlinkung: Footer-Navigation „Webdesign in der Region“ mit allen Städten; Leistungsseiten verlinken im Ortssatz nur die Heimatseite Augsburg (kein Linkblock aus fünf Städten).

## Akzeptanzkriterien

- AK-1: Alle Städte-Routen (DE und EN) liefern 200, stehen in der Sitemap, haben eigenen Title (endet auf „| Erik Bergheimer“, höchstens 70 Zeichen) und Description (höchstens 160 Zeichen), beide nennen die Stadt; hreflang verweist wechselseitig.
- AK-2: JSON-LD `ProfessionalService` mit Namen „Erik Bergheimer – …“ (kein Seitentitel), eigener `address` (Königsbrunn), `areaServed` (Stadt als `City`, dazu das Land: Deutschland bzw. für Innsbruck Österreich) und `provider` Person, dazu `BreadcrumbList` Start › Seite.
- AK-3: Genau eine h1, sie nennt Leistung und Ort (z. B. „Webdesign & Webentwicklung in München“).
- AK-4: Block „Vor Ort und remote“ als Beschreibungsliste mit Standort, Einsatzgebiet und Arbeitsweise; keine Straße.
- AK-5: Leistungs-Karten verlinken auf `/services/<slug>` (Linkname = Leistung).
- AK-6: Ortsbezogene FAQ (mindestens 4 Fragen, jede nennt die Stadt oder ihre Umgebung) als Akkordeon, JSON-LD `FAQPage` aus denselben Daten.
- AK-7: Footer hat eine benannte Navigation „Webdesign in der Region“ (EN „Web design by region“) mit allen Landingpages; Leistungsseiten der Stadt-Leistungen verlinken sie im Ortssatz mit eigenem Linktext („Mehr zu Webdesign in Augsburg“), kein nacktes Stichwort.
- AK-8: DE und EN haben die gleiche Struktur (gleiche Zahl an Leistungen, Gründen, Fragen).
- AK-11: `llms.txt` listet alle Landingpages unter „Regions“.
- AK-10: Keine zwei Städte teilen sich Einleitung, Ortstext, Gründe oder FAQ-Fragen (kein Doorway-Inhalt); nur Augsburg verspricht „vor Ort in … und Umgebung“.
- AK-9: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel).

## Barrierefreiheit

Abschnitte mit h2, Karten mit h3, FAQ über `FaqList` (Frage als Überschrift in `summary`).

## Tests

`tests/unit/lokal.test.tsx` (AK-2 bis AK-8, AK-10, AK-11), `tests/e2e/lokal.spec.ts` (AK-1, AK-9).

## Blinder Kritiker (2026-10-04)

Behoben: nacktes Stichwort als Link im Ortssatz (AK-7), Seitentitel als Name und fehlende Adresse im JSON-LD (AK-2), „wenige Minuten südlich“ (jetzt „direkt südlich“), „ohne Plugins und Updates“ überzogen, Anfahrt ungeklärt („besprechen wir im Angebot“), erzwungenes „in Augsburg“ in zwei Überschriften, englische Übersetzungsfloskeln.
Offen: Lokale Belege (Kundschaft oder Projekte aus der Region) fehlen, Frage an Erik in Issue #14. Überschriften in `summary` betreffen die FAQ seitenweit (in Chromium korrekt). Footer-Link bleibt in der Rechtszeile, bis es mehrere Städte gibt.
