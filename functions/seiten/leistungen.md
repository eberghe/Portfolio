# Leistungen

Status: In Arbeit

## Zweck
Je Leistung eine eigene, rankingfähige Unterseite plus Übersicht. Grundlage für spätere Städte-Landingpages (`seo/staedte-landingpages.md`).

## Bestand (Lovable `ServicesPage.tsx`, `ServiceDetailPage.tsx`, `services-data.ts`)
Übersicht mit Kacheln (Kategorie, Titel, erster Satz, Tags; UX/UI hervorgehoben über volle Breite). Detailseite: Zurück-Link, Kategorie, h1, Beschreibung, Tags, Kasten „Leistungen" mit Häkchen-Liste, Abschluss „Interesse?" mit Button. Inhalt nur per JavaScript, keine eigenen Meta-Daten im HTML.

## Leistungen
1. Webflow-Entwicklung (`webflow-development`, ersetzt `webflow-framer`)
2. Barrierefreiheit-Beratung (`accessibility`)
3. KI-Beratung (`ai-consulting`, neu)
4. Website- & Prozessoptimierung (`website-process-optimization`, ersetzt `business-development`)
5. Brand- & Logo-Design (`brand-logo-design`, neu)
6. UX/UI-Design (`ux-ui-design`)
7. Design-Systeme (`design-systems`)
8. Fotografie (`photography`)

Texte der bestehenden Leistungen aus Lovable; neue Leistungen sind Entwürfe, Erik prüft sie.

## Verhalten
- Übersicht `/services` (EN `/en/services`) wie im Bestand, mit allen acht Leistungen.
- Detailseite `/services/<slug>` (EN `/en/services/<slug>`), statisch erzeugt.
- Abschluss jeder Detailseite: Button „Kostenloses Erstgespräch" zur Kontaktseite.

## Akzeptanzkriterien
- AK-1: Übersicht und alle acht Detailseiten existieren in DE und EN, statisch erzeugt, mit eigenem Title und Description.
- AK-2: Detailseite: genau eine h1 (Leistungstitel), Beschreibung, „Das ist enthalten" als Liste mit mindestens 3 Punkten, Schlagworte als Liste.
- AK-3: JSON-LD `Service` mit `provider` (Person Erik Bergheimer) und `areaServed` (DE, AT).
- AK-4: Zusammengelegte Leistungen leiten dauerhaft (308/301) weiter: `/services/webflow-framer` → `/services/webflow-development`, `/services/business-development` → `/services/website-process-optimization` (auch unter `/en`).
- AK-5: Unbekannte Leistung liefert Status 404.
- AK-6: Übersicht: Kachel-Links heißen wie die Leistung, der Rest ist Beschreibung (wie Startseite AK-12).
- AK-7: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel).
- AK-8: Jede Leistung hat in DE und EN Titel, Kurztext, Beschreibung und mindestens 3 Leistungspunkte.

## Später
- FAQ je Leistung mit `FAQPage`-Schema (`seo/fragen-antworten.md`, Daten aus Supabase).
- Beispiel-Projektablauf je Leistung (`seiten/projektablauf.md`).

## Tests
`tests/unit/services.test.tsx` (AK-2, AK-3, AK-6, AK-8), `tests/e2e/leistungen.spec.ts` (AK-1, AK-4, AK-5, AK-7).

## Hinweise zur Umsetzung
- Auf der hervorgehobenen Kachel hatten die Schlagwort-Chips und das „Kern"-Label im Bestand zu wenig Kontrast (weiß auf aufgehelltem Grün, 3,6:1 bzw. 4,3:1). Jetzt ohne getönten Hintergrund, nur mit Rahmen.
