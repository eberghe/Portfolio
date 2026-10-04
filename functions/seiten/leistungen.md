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
- AK-17 (Issue #4): Die englische Abschluss-Überschrift „Interested in …?“ schreibt die Wörter des Leistungsnamens klein, außer Akronyme und Marken: „Interested in UX/UI design?“, „Interested in AI consulting?“, „Interested in Webflow development?“, „Interested in accessibility consulting?“.
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

## Umbau nach Vorlage designme.agency (Issue #16, Erik 2026-10-04)

Vorlage: designme.agency/services/brand-identity. Inhalte je Leistung in `lib/content/service-details.ts` (Entwürfe, Platzhalter mit `TODO(Erik)`, offene Fragen in Issue #14).

Aufbau der Detailseite: Zurück-Link → Hero → Beleg-Projekt → Ablauf → Was enthalten ist → Pakete → Werkzeuge → FAQ → Passende Leistungen („Was danach kommt“) → Abschluss-CTA.

- AK-18: Hero: Überline, h1 mit Suchbegriff (z. B. „Webflow-Entwicklung in Augsburg“), ein Satz, Beschreibung mit Einsatzort (AK-16), Schlagworte (AK-2), Button „Kostenloses Erstgespräch“ mit Vorauswahl der Leistung (`/contact?leistung=<slug>`).
- AK-19: Ablauf als geordnete Liste mit 4 bis 5 Schritten; jeder Schritt hat Titel (h3), Dauer, Text und „Typische Ergebnisse“ als Liste.
- AK-20: „Was enthalten ist“: Überschrift als Satz, genau 6 Karten (h3 + Text). Die bisherige Liste „Das ist enthalten“ (AK-2) bleibt als Leistungsumfang im Hero-Kasten.
- AK-21: Zwei Pakete als Karten (h3, für wen, Liste der Inhalte), ohne Preise, jeweils mit Link zum Erstgespräch.
- AK-22: FAQ je Leistung (4 bis 5 Fragen) als `details`/`summary` mit Frage als Überschrift; JSON-LD `FAQPage` aus denselben Daten.
- AK-23: Hat die Leistung ein passendes Projekt, steht es als Fallstudien-Karte unter dem Hero (Link auf `/projects/<slug>`).
- AK-24: Werkzeuge als Liste.
- AK-25: Inhalte in DE und EN mit gleicher Struktur (gleiche Zahl an Schritten, Karten, Paketen und Fragen).
- AK-26: Abschnitte blenden beim Scrollen ein (`data-reveal`); keine axe-Verstöße, kein horizontales Scrollen (AK-7).

### Blinder Kritiker (Umbau, 2026-10-04)

Behoben: Kleinstunternehmen-Ausnahme im BFSG-FAQ, „Informationen zur Barrierefreiheit (§ 14 BFSG)“ statt „Erklärung“, keine Versprechen voller Barrierefreiheit oder fester Rankings, Nutzungsrechte am Logo, Einwilligung bei Fotos, DSGVO-Hinweis bei KI, Einsatzort „Augsburg und Umgebung“, Leads ohne Doppelung zur Beschreibung, geschlechtergerechte Formulierungen, Paket-Links mit Paketnamen, Beschreibung in den Hero-Kasten, Kasten nicht mehr sticky, FAQ-Antworten mit Abstand zum Plus-Symbol, Fokusrahmen mit Abstand.
Geprüft, kein Fehler: Überschriften in `summary` erscheinen in Chromium im Accessibility-Tree (group > heading).
Offen: Hero-Containerbreiten der Seitentypen vereinheitlichen.
