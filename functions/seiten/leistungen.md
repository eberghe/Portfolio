# Leistungen

Status: In Arbeit

## Zweck

Je Leistung eine eigene, rankingfähige Unterseite plus Übersicht. Grundlage für spätere Städte-Landingpages (`seo/staedte-landingpages.md`).

## Bestand (Lovable `ServicesPage.tsx`, `ServiceDetailPage.tsx`, `services-data.ts`)

Übersicht mit Kacheln (Kategorie, Titel, erster Satz, Tags; UX/UI hervorgehoben über volle Breite). Detailseite: Zurück-Link, Kategorie, h1, Beschreibung, Tags, Kasten „Leistungen" mit Häkchen-Liste, Abschluss „Interesse?" mit Button. Inhalt nur per JavaScript, keine eigenen Meta-Daten im HTML.

## Leistungen

1. Webdesign & Webentwicklung (`web-design-development`, bis 2026-10-07 Webflow-Entwicklung `webflow-development`, ersetzt `webflow-framer`)
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

## Warum ich (Issue #16, 2026-10-05)

Aus dem Aufbau in #16 fehlte Punkt 6 „Warum ich (Wertekarten, Sticky-Stapel)“.

- AK-27: Jede Leistungsseite (DE und EN) hat nach den Paketen den Abschnitt „Warum mit mir“ (EN „Why work with me“, h2) mit vier nummerierten Wertekarten (h3 und ein Satz). Die erste Karte ist leistungsspezifisch (`whyFocus` in `lib/content/service-details.ts`, auf jeder Seite ein anderer Titel), danach drei gemeinsame: ein Ansprechpartner von der Idee bis zum Livegang, ehrliche Einschätzung statt Verkaufsgespräch, vor Ort in Augsburg und remote. Keine Karte widerspricht der Leistung (Kritiker 2026-10-05: „Barrierefrei“ doppelt auf der Barrierefreiheitsseite, „Design und Umsetzung“ unpassend bei Fotografie und KI). Keine erfundenen Zahlen. Die Nummernspalte hat eine feste Breite, damit alle Titel bündig stehen. Ab 768 px stapeln sich die Karten beim Scrollen (`.sticky-stack`, animationen.md AK-5).

## Fotografie keine Leistung mehr (Erik 2026-10-05)

- AK-28: Es gibt sieben Leistungen; Fotografie entfällt als Leistung. `/services/photography` (EN `/en/services/photography`) leitet dauerhaft auf die Projekte um, wo die Fotoserien bleiben. Übersicht, Meta-Description, Startseite, FAQ, Footer, Kontaktformular und llms.txt nennen Fotografie nicht mehr als Leistung. Fotoserien zeigen keine „Passende Leistung“.

## Übersicht neu nach designme.agency/services (Erik, 2026-10-06)

Erik (mit zwei Screenshots: „Our services“ mit großer zentrierter Überschrift und einer zweispaltigen, nummerierten Liste mit Pfeilen; darunter je Leistung ein Abschnitt „Brand identity“ mit Linie, links „When you need this“ + Link + „Related work“, rechts „What we deliver“ als nummerierte Liste): „please rework the services page … also green gradient again at the top, spring to sections, this direction for the sections below and then fullscreen image below“.

Ersetzt die Kachelübersicht (AK-6 gilt sinngemäß weiter: Links heißen wie die Leistung).

- AK-29: Kopf der Übersicht: grüner Verlauf oben (weiche Flächen in Akzentfarbe hinter dem Kopf, dekorativ), Kennzeichen „Was ich mache“ (EN „What I do“), große zentrierte h1 „Leistungen für Websites und digitale Produkte“ (EN „Services for websites and digital products“, AK-11 bleibt) und ein Satz darunter.
- AK-30: Darunter alle sieben Leistungen als zweispaltige Liste (unter 768 px einspaltig), je Zeile Nummer („01“ bis „07“, für Screenreader verborgen), Titel und Pfeil, Zeilen durch Linien getrennt. Jede Zeile ist ein Sprunglink zum Abschnitt der Leistung auf derselben Seite (`#<slug>`); der Linkname ist der Titel. Der Sprung scrollt weich (bei reduzierter Bewegung sofort) und der Abschnitt landet nicht unter der Navigation.
- AK-31: Je Leistung ein Abschnitt mit `id="<slug>"`: große h2 (Titel), darunter eine Linie, dann zwei Spalten (ab 768 px): links „Wann du das brauchst:“ (EN „When you need this:“) mit einem Satz aus Sicht des Kunden, der Link „Mehr zu <Leistung> →“ zur Detailseite und, falls vorhanden, „Passende Arbeit:“ (EN „Related work:“) mit bis zu drei Projektkacheln (Vorschaubild dekorativ, Linkname = Projekttitel); rechts „Das bekommst du:“ (EN „What you get:“) mit allen Leistungsmerkmalen als nummerierte Liste mit Linien.
- AK-32: Nach jedem Leistungsabschnitt folgt ein Bild über die volle Bildschirmbreite (rund 70 % der Bildschirmhöhe, höchstens 720 px). Bis Erik Bilder schickt, ist es ein dekorativer Platzhalter mit grünem Verlauf und dem Icon der Leistung.
- AK-33: Die Sätze „Wann du das brauchst“ stehen in `lib/content/services.ts` (`need`) in DE und EN, je mindestens 60 Zeichen. Entwürfe; Erik prüft sie.
- AK-34: Keine axe-Verstöße, kein horizontales Scrollen (AK-7), JSON-LD `ItemList` bleibt (AK-12).
- AK-35: Die Übersicht endet mit einem Abschluss: h2 „Nicht sicher, was passt?“ (EN „Not sure what fits?“), ein Satz und der Button „Kostenloses Erstgespräch“ zu `/contact`.

### Blinder Kritiker (Übersicht neu, 2026-10-06)

Behoben (mit Test): Seite endete ohne Aufforderung zum Kontakt (AK-35); englischer Bedarfssatz klang übersetzt. Offen für Erik: „Barrierefreiheit-Beratung“ korrekt wäre „Barrierefreiheitsberatung“ (betrifft Titel auf allen Seiten); Groß- und Kleinschreibung der englischen Leistungsnamen ist uneinheitlich („UX/UI Design“ gegenüber „Design systems“); der Footer sagt auch auf Deutsch „made with love in augsburg“. Bewusst so: Die Bildbänder stehen nach jeder Leistung, wie Erik es wollte.

- AK-36 (Erik: „nav hat wieder weißen hintergrund und verlauf sieht nicht so gut aus“): Auf der Leistungsübersicht ist die Navigation oben transparent wie auf der Startseite (startseite.md AK-36), der Verlauf reicht bis an den oberen Rand. Der Verlauf ist ein einziger, ruhiger grüner Schein von oben mittig (wie früher im Home-Hero), ohne seitliche Flecken.

## Design Systeme: Name und Bild (Erik, 2026-10-07)

Erik: „design systems in Design Systeme umändern und auf den seiten wo das bild vorkommt das hier verwenden, mit alt text ausstatten“ (Bild: Ausschnitt eines Design-Systems mit Farben, Typografie, Buttons, Formular, Projektkarte, Dunkelmodus, Leistungskarte und FAQ).

- AK-37: Auf deutschen Seiten heißt die Leistung „Design Systeme“ (Titel, Label, Fließtexte, Meta-Description, Detailseite, FAQ). „Design Systems“ kommt in deutschen Texten nicht mehr vor. Englisch bleibt „Design systems“. Ersetzt das Suchwort aus AK-8 für Deutsch.
- AK-38: Die Leistung Design Systeme hat ein echtes Bild (`public/images/services/design-systeme.png`, 1600 × 900) statt des Platzhalters. Es erscheint überall, wo bisher der Platzhalter der Leistung stand: im Vollbild unter der Leistung auf der Übersicht (AK-32) und in der Leistungsliste der Startseite (startseite.md AK-74). Es hat einen beschreibenden Alt-Text in DE und EN, der die gezeigten Bausteine nennt. Leistungen ohne Bild behalten ihren dekorativen Platzhalter. Auf der Übersicht steht das Bild ganz und unbeschnitten (16:9, höchstens Seitenbreite) auf einem hellen Band, damit alle im Alt-Text genannten Bausteine sichtbar bleiben (Kritiker: Vollbild mit 70svh schnitt mobil zwei Drittel ab).

### Blinder Kritiker (Design Systeme, 2026-10-07)

Behoben: Das Vollbild mit `object-cover` und 70svh schnitt auf dem Handy etwa zwei Drittel der Breite ab und auf breiten Bildschirmen die Überschriften. Das Bild steht jetzt ganz im Format 16:9. Ohne Einwände: Kein deutsches „Design Systems“ bleibt, und der Alt-Text ist sachlich und doppelt nicht die Überschrift. Hinweis: `local.ts` schreibt „Design-Systeme“ (Duden). Das bleibt so, weil Erik nur „Design Systems“ ersetzt haben wollte.

## Webdesign & Webentwicklung statt Webflow-Entwicklung (Erik, 2026-10-07)

Erik: „Webflow Entwicklung abändern in Webdesign und Webentwicklung … weil ich das nicht nur mit Webflow mache“. Je nach Bedarf setzt er Webflow, Framer (No-Code) oder eine eigene Entwicklung mit TypeScript, Supabase, Vercel und Claude Code ein. Fotos und Thumbnail liefert Erik später, bis dahin bleibt der Platzhalter.

- AK-39: Die Leistung heißt „Webdesign & Webentwicklung“ (EN „Web design & development“) und hat den Slug `web-design-development`. `/services/webflow-development` und `/services/webflow-framer` leiten dauerhaft dorthin weiter (auch unter `/en`, ersetzt das Ziel aus AK-4).
- AK-40: Beschreibung und Detailseite nennen die drei Wege: Webflow, Framer als No-Code-Werkzeug und eigene Entwicklung mit TypeScript, Supabase, Vercel und Claude Code, je nach Bedarf. Die Werkzeugliste der Detailseite enthält Webflow, Framer, TypeScript, Supabase, Vercel und Claude Code. Kein Leistungs- oder Städtetext stellt Webflow als einziges Werkzeug dar: „Webflow-Entwicklung“ und „Webflow development“ kommen auf keiner Leistungs-, Städte- oder Startseite mehr vor. Die Projekt-Seite zur Bachelorarbeit „Webflow vs. Shopify“ bleibt unverändert.
