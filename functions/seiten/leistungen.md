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
- AK-3: JSON-LD `Service` mit `provider` (Person Erik Bergheimer) und `areaServed` (Augsburg, Deutschland).
- AK-4: Zusammengelegte Leistungen leiten dauerhaft (308/301) weiter: `/services/webflow-framer` → `/services/webflow-development`, `/services/business-development` → `/services/website-process-optimization` (auch unter `/en`).
- AK-5: Unbekannte Leistung liefert Status 404.
- AK-6: Übersicht: Kachel-Links heißen wie die Leistung, der Rest ist Beschreibung (wie Startseite AK-12).
- AK-7: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel).
- AK-8: Jede Leistung hat in DE und EN Titel, Kurztext (mindestens 60 Zeichen), Beschreibung und mindestens 3 Leistungspunkte. Der Titel enthält das Suchwort der Leistung (z. B. „Design Systems", „Fotografie").
- AK-9: Detailseite verlinkt unter „Passende Leistungen" (EN „Related services") 2 bis 3 andere Leistungen.
- AK-10: Abschluss nennt die Leistung („Interesse an Barrierefreiheit-Beratung?") und erklärt das Erstgespräch in einem Satz.
- AK-11: Deutsche Seiten sprechen Deutsch: Übersicht und Menüpunkt heißen „Leistungen", Zurück-Link „Alle Leistungen", Schlagworte je Sprache (EN: „EAA" statt „BFSG", „Screen reader").
- AK-12: Übersicht: Meta-Description nennt alle acht Leistungen; JSON-LD `ItemList` mit allen Detailseiten. Kein doppeltes „Kern"-Abzeichen neben „Kernservice".
- AK-13: Auf Detailseiten ist „Leistungen" in der Navigation markiert (`aria-current="true"`, nicht `page`); JSON-LD `BreadcrumbList` (Start › Leistungen › Leistung).
- AK-14: JSON-LD `Service` nennt Augsburg und Deutschland als Orte; `jobTitle` der Person in der Sprache der Seite.
- AK-16: Detailseite nennt im Text den Einsatzort: Augsburg, vor Ort in Deutschland oder remote.
- AK-15: Jeder fokussierbare Link und Button zeigt beim Tab sofort einen 2 px Fokusrahmen (keine Übergangsanimation auf `outline`).

## Später

- FAQ je Leistung mit `FAQPage`-Schema (`seo/fragen-antworten.md`, Daten aus Supabase).
- Beispiel-Projektablauf je Leistung (`seiten/projektablauf.md`).

## Tests

`tests/unit/services.test.tsx` (AK-2, AK-3, AK-6, AK-8 bis AK-14), `tests/unit/navigation.test.tsx` (AK-13), `tests/e2e/leistungen.spec.ts` (AK-1, AK-4, AK-5, AK-7, AK-15).

## Hinweise zur Umsetzung

- Auf der hervorgehobenen Kachel hatten die Schlagwort-Chips und das „Kern"-Label im Bestand zu wenig Kontrast (weiß auf aufgehelltem Grün, 3,6:1 bzw. 4,3:1). Jetzt ohne getönten Hintergrund, nur mit Rahmen.

## Befunde Blinder Kritiker (Runde 1)

Behoben (mit Test): Fokusrahmen war wegen `transition-all` beim Tab kurz 0 px breit (AK-15); englische Begriffe auf deutschen Seiten (AK-11); Übersicht-Description unvollständig, kein ItemList (AK-12); doppeltes „Kern" (AK-12); keine Querverlinkung (AK-9); generischer Abschluss (AK-10); „Leistungen" auf Detailseiten nicht markiert, keine Breadcrumbs (AK-13); Titel ohne Suchwort und sehr kurze Texte bei Design Systems und Fotografie (AK-8); JSON-LD ohne Städte, englischer jobTitle (AK-14).

Offen, Entscheidung bei Erik:

- GEO-Abschnitte je Leistung (Für wen, Ablauf, Dauer, Kosten, Beispielprojekt): braucht Eriks Angaben zu Dauer und Preisrahmen.
- Fotografie: was genau buchbar ist und welche Bilder gezeigt werden.

Verschoben: eigene zweisprachige 404-Seite (`seo/sitemap-und-redirects.md`); Schriftgrößen gehören zum bestehenden Design.
