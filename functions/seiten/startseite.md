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

Issues vom 2026-10-04 (umgesetzt mit Test):

- AK-18 (Issue #6): Der Name der h1 lautet „Hi, ich bin Erik Bergheimer, UX/UI Designer & Webflow Expert“ ohne Leerzeichen vor dem Komma. Das Komma ist nur für Screenreader da (Schriftgröße 0 statt `sr-only`, weil die absolute Positionierung von `sr-only` im Accessibility-Tree ein Leerzeichen erzeugt).
- AK-19 (Issue #5): „Projekte im Portfolio“ wird aus der Zahl der Projekte berechnet (heute 5, wie auf /projects); die Startseite zeigt davon bewusst 4 ausgewählte.

Von Erik am 2026-10-04 entschieden und umgesetzt (AK-17):

- h1 mit vollem Namen „Hi, ich bin Erik Bergheimer".
- Hauptbutton „Kostenloses Erstgespräch" / „Free intro call".
- Hero-Text nennt „freiberuflich" und Einsatzgebiet (Augsburg, Kunden in Deutschland und remote; siehe `standort.md`).
- Faktenleiste: „3 Länder & Remote" ersetzt durch „Deutschland – Vor Ort & remote".
- Barrierefreiheit: „Umsetzung der BFSG-Anforderungen" statt „Beratung zum BFSG".

Noch offen:

- Belege je Leistung (Kundenprojekte, Referenzen).
- Englische Begriffe auf der deutschen Seite („Webflow Expert", „Kernservice", „Travel & Editorial", „Design Systems").
- Schriftgrößen (10–13 px) und unauffällige h2 sind Bestandsdesign; Anhebung nur mit Freigabe.

Später: JSON-LD (Person/ProfessionalService) mit der SEO-Funktion.

## Umbau nach Vorlage designme.agency (Issue #17, Erik 2026-10-04)

Erik wünscht sich die Startseite inhaltlich und in den Animationen nach dem Vorbild von designme.agency. Übernommen wird, was zu einem Freelancer passt. Kundenlogos, Kundenstimmen, Team und Kennzahlen gibt es (noch) nicht; offene Inhalte stehen in Issue #14.

Reihenfolge: Hero → Werkzeug-Laufband → Faktenleiste → Leistungen als nummerierter Sticky-Stapel → Ablauf → Fallstudien → Persönliche Notiz → Abschluss-CTA.

- AK-20: Unter dem Hero steht ein Abschnitt mit der h2 „Werkzeuge, mit denen ich arbeite“. Das Laufband ist dekorativ und hat einen Pause-Knopf; die Werkzeuge stehen zusätzlich als Liste für Screenreader.
- AK-21 (ersetzt durch AK-64 bis AK-66): Die Leistungen sind nummeriert (01 bis 08). Jede Karte zeigt Nummer, Kategorie, Titel (h3), Kurztext, bis zu vier Leistungsmerkmale als Liste und einen Link „Mehr erfahren“. Der Link heißt wie die Leistung; der Kurztext ist seine Beschreibung (AK-12 bleibt). Die Liste ist ein Sticky-Stapel (`sticky-stack`, siehe `infrastruktur/animationen.md`). Links daneben bleibt ab 768 px die Abschnittsüberschrift mit einem Satz und dem Erstgespräch-Button stehen.
- AK-22: Projektkarten sind Fallstudien-Karten: großes Bild, Schlagworte als Liste (aus dem Projekttyp), Titel (h3), Kurztext und der sichtbare Hinweis „Fallstudie lesen“. Linkname bleibt der Titel (AK-12).
- AK-23: Abschnitt „Über mich“ (h2) in Ich-Form mit Foto, kurzem Text und Link „Mehr über mich“ auf `/about`.
- AK-24: Abschluss-CTA (h2 „Erzähl mir, was du vorhast“ / „Tell me what you're planning“) mit Link zum Kontakt und E-Mail-Adresse.
- AK-25: Abschnitte und Karten blenden beim Scrollen ein (`data-reveal`, gestaffelt); im ersten Bildschirm sofort.

### Befunde Blinder Kritiker (Umbau, Runde 1)

Behoben: Faktenleiste überlappte bei 768 px („Deutschland“ in einer Zeile), einheitliche Größe; CTA-Button im Dunkelmodus 3,5:1 (jetzt Hintergrund/Vordergrund-Tokens); Schlagwort-Chips im Dunkelmodus 4,1:1 (dunkles `--primary-text` auf 50 % Helligkeit angehoben, siehe `design-tokens.md`); Abschnittsüberschriften einheitlich groß; Leistungs-Sticky-Spalte erst ab 1024 px; nach Sprüngen (Anker, Ende-Taste) blendet alles Übersprungene ein; Ablauf-Nummern im gleichen Gewicht wie die Leistungs-Nummern. Die axe-Tests blenden jetzt alle `data-reveal`-Elemente ein, damit auch spätere Abschnitte geprüft werden.
Offen: „Barrierefreiheit-Beratung“ vs. „Barrierefreiheits-Beratung“ und „Webflow Expert“ auf Deutsch (Erik entscheidet, Issue #14); Hero nutzt eine andere Seitenbreite als die Abschnitte.

## Umbau Hero und Firmen (Erik, 2026-10-05)

Vorlage: Screenshot designme.agency (zentrierter Hero mit Pill, großer Überschrift, Untertitel, zwei Buttons; darunter „Trusted by“-Logoleiste und Uhrzeiten). Erik: „ohne hintergrund bild und nicht meinen ganzen namen sondern nur Hey ich bin Erik und das schön animiert“, darunter Firmen, für die er gearbeitet hat, HERO Software als aktuelles Unternehmen hervorgehoben, Uhrzeit in Königsbrunn, Logos in Schwarz und verlinkt.

Ersetzt AK-1, AK-7, AK-14 und AK-18 (Hero-Foto und h1 mit vollem Namen entfallen).

- AK-26: Hero zentriert, ohne Hintergrundbild und ohne Foto: Pill „Verfügbar für Projekte“, h1 „Hey, ich bin Erik“ (EN „Hey, I'm Erik“), darunter Rolle und Einleitung als Absätze, Buttons „Kostenloses Erstgespräch“ (Kontakt) und „Projekte ansehen“. Die h1 steht ohne JavaScript im HTML.
- AK-27: Die Überschrift baut sich Wort für Wort weich auf (Deckkraft, Unschärfe, leichtes Aufsteigen), gestaffelt; ein winkendes 👋 ist dekorativ (`aria-hidden`). Bei reduzierter Bewegung steht alles sofort da. Der Name der h1 bleibt „Hey, ich bin Erik“.
- AK-28: Abschnitt „Unternehmen, für die ich gearbeitet habe“ (h2, EN „Companies I've worked for“) als Liste: HERO Software, TEAM23, Amazon, IKEA (aus dem Lebenslauf). Jeder Eintrag ist ein Link auf die Website des Unternehmens (neuer Tab, für Screenreader angekündigt), Logos einfarbig in Schwarz (im Dunkelmodus Weiß).
- AK-29: HERO Software ist als aktuelles Unternehmen hervorgehoben: Kennzeichen „Aktuell“ (EN „Current“) und Rolle, im Linknamen enthalten.
- AK-30: Uhrzeit in Königsbrunn (Zeitzone Europe/Berlin) als `time`-Element mit Zeitzonenkürzel; sie aktualisiert sich jede Minute und erzeugt keinen Hydration-Fehler (ohne JavaScript steht nur der Ort).
- AK-32: Jede Kachel nennt eine ehrliche Rolle (Business Development Manager, UX/UI-Designer, Job vor dem Studium); Inhalt zentriert; der Linkname hat Pausen („HERO Software, Aktuell, Business Development Manager (öffnet in neuem Tab)“).
- AK-33: Die Firmenleiste beginnt bei 1280 × 800 im ersten Bildschirm; ohne JavaScript erscheint die Uhrzeile gar nicht.
- AK-31: Keine axe-Verstöße, kein horizontales Scrollen (AK-9 gilt weiter).

Offen: Offizielle Logo-Dateien (SVG) der Unternehmen fehlen; bis dahin Wortmarken in Schrift. Frage an Erik (Issue #14), ob Amazon und IKEA (Nebenjobs vor dem Studium) dort stehen sollen.

### Blinder Kritiker (Hero, 2026-10-05)

Behoben: Amazon und IKEA ohne Rolle wirkten wie Designarbeit (jetzt „Job vor dem Studium“, AK-32), HERO-Kachel uneinheitlich ausgerichtet (AK-32), Firmenleiste unter dem ersten Bildschirm (AK-33), Linkname ohne Pausen (AK-32), halbe Uhrzeile ohne JavaScript (AK-33), aktuelle Rolle als Werkstudent benannt.
Offen: Wortmarken statt offizieller Logos; ob Amazon und IKEA bleiben, entscheidet Erik.

## Logos, Rolle und Navigation (Erik, 2026-10-05)

Erik hat die Logos von HERO, TEAM23, Amazon und IKEA geschickt (PNG) und schreibt: „werkzeuge mit denen ich arbeite kann auf home raus. bin aktuell business development manager nicht werkstudent. außerdem oben die nav beim start nicht weiß erst on scroll damit der verlauf in grün bis ganz nach oben führt.“

Ersetzt AK-20 (Werkzeug-Laufband auf der Startseite entfällt; auf „Über mich“ bleibt es).

- AK-34: Die Kacheln zeigen die echten Logos als einfarbige SVG-Dateien (`public/logos/<firma>.svg`, aus Eriks Dateien nachgezeichnet): schwarz, im Dunkelmodus weiß. Das Bild ist dekorativ (`alt=""`), der Linkname kommt aus AK-32. Alle Logos haben dieselbe optische Höhe.
- AK-35: Die Startseite hat keinen Abschnitt „Werkzeuge, mit denen ich arbeite“ mehr.
- AK-36: Auf der Startseite ist die Navigation oben transparent (kein Hintergrund, keine Linie), der grüne Verlauf des Heros reicht bis an den oberen Rand. Ab dem ersten Scrollen bekommt sie wie auf allen anderen Seiten den weißen (im Dunkelmodus dunklen) Hintergrund und die Linie. Ohne JavaScript und bei offenem Mobilmenü bleibt sie deckend. Andere Seiten sind unverändert.
- AK-32 nennt HERO jetzt mit der aktuellen Rolle „Business Development Manager“ (vorher Werkstudent).

### Blinder Kritiker (Logos und Navigation, 2026-10-05)

Behoben: Navigationslinks oben auf dem Verlauf nur 3,96:1 (oben jetzt in Vordergrundfarbe, AK-36); offenes Mobilmenü ließ die Seite dahinter weiterscrollen, Header und Schließen-Knopf verschwanden (jetzt ist auch `<html>` gesperrt); HERO im Dunkelmodus ohne Hervorhebung; Logos und Rollen standen wegen „Aktuell“ auf unterschiedlichen Höhen (Kennzeichen jetzt oben links, feste Logo-Höhe); IKEA-Oval zu schwer, TEAM23 zu leicht.
Offen: Uhrzeit „Königsbrunn“ direkt über der Kennzahl „Augsburg – Aktueller Standort“ und drei Bänder mit Linien hintereinander (Faktenleiste bei Gelegenheit überarbeiten); Pfeil für externe Links nur bei Hover/Fokus sichtbar (Hinweis steht im Linknamen).

## Zahlenleiste weiter unten (Erik, 2026-10-05)

Erik: „den numbers bereich bitte weiter unten einbauen der passt da dann irgendwie nicht mehr finde ich“.

- AK-37: Die Faktenleiste (AK-8, Beschreibungsliste) steht nicht mehr unter der Firmenleiste, sondern im Abschnitt „Über mich“ unter Foto und Text. Damit liegt sie in einem benannten Abschnitt, und unter dem Hero folgen nicht mehr drei Bänder hintereinander.

## Restpunkte Umbau (Issues #15 und #17, 2026-10-05)

Erik: „danach bitte die prio hoch issues angehen!“. Aus #15 fehlten die Zähler, aus #17 die FAQ-Auswahl (Footer-Links siehe navigation-und-footer.md AK-19).

- AK-38: In der Faktenleiste (AK-37) zählen Zahlen-Werte („6+“, Zahl der Projekte) beim Hinscrollen von 0 auf ihren Wert hoch (rund 1,2 s), Text-Werte („Deutschland“, „Augsburg“) bleiben stehen. Nur bei erlaubter Bewegung; ohne JavaScript und bei reduzierter Bewegung steht sofort der Endwert da. Screenreader hören nur den Endwert (hochzählende Ziffern `aria-hidden`, Endwert als versteckter Text). Werte, die keine Zahl sind (z. B. „Deutschland“), stehen kleiner, damit sie in ihrer Spalte ohne Trennung mitten im Wort passen (Kritiker 2026-10-05).
- AK-39: Vor dem Abschluss-Abschnitt steht „Häufige Fragen“ (EN „Frequently asked questions“, h2) mit vier Fragen aus der FAQ im selben Akkordeon wie auf der FAQ-Seite (Fragen als h3) und einem Link „Alle FAQs“ zur FAQ-Seite (mindestens 44 px hoch). Kein zusätzliches FAQ-JSON-LD auf der Startseite (das steht auf der FAQ-Seite).
- AK-40 (PreMatch, 2026-10-05): Unter „Ausgewählte Projekte“ steht PreMatch (Masterarbeit, 2026) an erster Stelle und ersetzt das älteste Projekt CPR; es bleiben vier Karten. SIGHT'KICK heißt wie auf der Projektseite „Masterprojekt“, nicht „Masterarbeit“.
- AK-41 (Erik 2026-10-05): Bis die Freiberuflichkeit angemeldet ist (Steuer-ID), steht nirgends „freiberuflich“, „Freelancer“ oder „freelance“ als Selbstbeschreibung (Startseite, Über mich, Städteseiten, llms.txt). Ersetzt den Teil „freiberuflich“ aus AK-17 und ueber-mich.md AK-8.

## Hero im Product-Designer-Stil (Erik, 2026-10-06)

Erik (mit Screenshot eines typografischen Heros als Richtung, nicht als Vorlage): „können wir meinen hero bereich vlt in die richtung umbauen? das finde ich nicht so generisch 🙂 ich bin auch product designer. passionate about fußball, technologie, sport. mag gutes mensch zentriertes design. based in königsbrunn bei augsburg. element bitte 100vh hoch. diese kleinen images/gifs kann ich dir im nachhinein geben. da bitte platzhalter einbauen“.

Ersetzt AK-26, AK-27 (Winken entfällt) und AK-33 (die Firmenleiste beginnt jetzt unter dem ersten Bildschirm).

- AK-42: Der Hero ist mindestens so hoch wie der Bildschirm (`100svh`, inklusive der darüberliegenden Navigation) und hat keinen Hintergrundverlauf mehr; die Navigation bleibt oben transparent (AK-36).
- AK-43: Die h1 ist eine große typografische Komposition in drei Zeilen, ganz in Mona Sans (fett, groß geschrieben): „Hey, ich bin [Bild] _Erik_“ / „Product [Bild]“ / „[Bild] _Designer_“ (EN „Hey, I'm …“). „Erik“ und „Designer“ stehen in Mona Sans kursiv, „Erik“ in der Akzentfarbe; keine zweite Schriftfamilie und kein Nachname (Erik, 2026-10-06). Der Name der h1 lautet „Hey, ich bin Erik, Product Designer“ (EN „Hey, I'm Erik, Product Designer“). Höchstens 80 px groß (Erik: „noch ein bisschen kleiner“).
- AK-44: Zwischen den Zeilen stehen drei Medien-Plätze (Bilder oder GIFs, kommen von Erik). Solange ein Platz leer ist, zeigt er eine ruhige Fläche in Akzentfarbe ohne Text. Die Plätze sind dekorativ (`aria-hidden`), ein Bild darin hat `alt=""`. Sie skalieren mit der Schrift und bleiben auch unter 640 px sichtbar.
- AK-45: Neben „Designer“ steht klein „Mit Herz für Fußball, Technologie & Sport“ (EN „Passionate about football, tech & sport“), dekorativ, weil der Absatz darunter dasselbe sagt; unter 640 px ausgeblendet.
- AK-46: Rechts unter der h1 steht ein Absatz: Wohnort Königsbrunn bei Augsburg, menschzentriertes Design, Fußball, Technologie und Sport; ein Satzteil ist in Akzentfarbe hervorgehoben (aktuelle Rolle bei HERO Software). Schrift höchstens 18 px. Keine Buttons im Hero (Erik: „die buttons stehen sehr random. nimm die gerne weg“); das Erstgespräch bleibt in Navigation, Leistungen und Abschluss erreichbar.
- AK-47: Animation (Erik: „gerne animiert“): Die vier Wörter der h1 kippen nacheinander von unten herein (Animation `hero-line-in`: Deckkraft, Unschärfe, leichte Drehung), die Medien-Plätze öffnen sich danach von links wie ein Vorhang (`hero-media-in`), Randnotiz und Absatz steigen ein (`hero-rise`). Mit Ladeanimation startet alles nach ihr. Bei reduzierter Bewegung und ohne JavaScript steht alles sofort da. Kein horizontales Scrollen bei 320 px, keine axe-Verstöße in hell und dunkel.

Nachtrag Erik (2026-10-06): „nicht meinen ganzen namen bitte. also nachname raus. das ist außerdem zu viel unterschiedliche schrift! immer mona sans wenn dann mona sans in italic verwenden. kann auch bisschen kleiner und gerne animiert“. Instrument Serif ist wieder entfernt.

### Blinder Kritiker (Hero, 2026-10-06)

Behoben: Randnotiz erbte die Großschreibung der h1 („FUSSBALL“, jetzt normal geschrieben, 12 px statt 11 px); Platzhalter im Dunkelmodus kaum sichtbar (jetzt kräftigere Fläche). Bewusst so: das Komma im h1-Namen bleibt mit Schriftgröße 0 (siehe AK-18, `sr-only` erzeugt ein Leerzeichen; per Test im Accessibility-Tree geprüft).

## Hero: Text und Magnet-Effekt (Erik, 2026-10-06)

Erik: „diesen text bitte menschlicher schreiben! gerade business development manager bei hero software und gestalte das Handwerker Event des Jahres "HEROCON". offen für weitere private projekte. kannst du über die bilder noch so eine nice animation reinbauen? so magnetic das das bild ein bisschen am cursor mit hängt?“

- AK-48: Der Absatz im Hero ist in Ich-Form und erzählend geschrieben: Wohnort Königsbrunn bei Augsburg, menschzentriertes Design, aktuelle Rolle als Business Development Manager bei HERO Software (hervorgehoben) mit der HEROCON als Handwerker-Event des Jahres, offen für private Projekte, Fußball, Technik und Sport. Kein „freiberuflich“ (AK-41).
- AK-49: Die Medien-Plätze im Hero sind magnetisch: Kommt der Mauszeiger in ihre Nähe, folgen sie ihm ein Stück (höchstens rund ein Drittel des Abstands) und federn beim Weggehen weich zurück; das Bild darin verschiebt sich leicht gegenläufig. Nur mit feinem Zeiger (Maus, Trackpad) und erlaubter Bewegung; auf Touch-Geräten, bei reduzierter Bewegung und ohne JavaScript bleiben sie still. Der Effekt ändert nur `transform`, kein Layout.

Nachtrag Erik (2026-10-06): „der paragraph bitte kürzer. nur augsburg. handwerker event des jahres raus. wenn ich nicht arbeite dann dreht sich viel um fußball, bergsport und kochen.“

- AK-50: Der Hero-Absatz hat höchstens vier kurze Sätze und nennt als Ort nur Augsburg (nicht Königsbrunn), die HEROCON ohne Zusatz „Handwerker-Event des Jahres“ und als Hobbys Fußball, Bergsport und Kochen; die Randnotiz neben „Designer“ nennt dieselben drei. Ersetzt die Inhaltsangaben in AK-45, AK-46 und AK-48.

## Unternehmen-Abschnitt aufgeräumt (Erik, 2026-10-06)

Erik: „die unternehmen für die ich gearbeitet hab: beide lines oben und unten weg; die uhrzeit und ort in den footer bitte. statt königsbrunn augsburg; auf mobile bitte alle cards gleich groß“.

- AK-51: Zwischen Hero und Abschnitt „Unternehmen, für die ich gearbeitet habe“ und unter diesem Abschnitt steht keine durchgehende Linie mehr (die gestrichelten Kachelränder bleiben). Die Uhrzeile steht nicht mehr auf der Startseite, sondern im Footer (navigation-und-footer.md AK-23); ersetzt den Ort in AK-30 und AK-33.
- AK-52: Auf dem Handy (zwei Spalten) sind alle vier Kacheln gleich hoch und gleich breit, auch wenn eine Rolle zweizeilig umbricht.

## Referenzen als Querband, Über-mich-Linien, Hero-Fotos (Erik, 2026-10-06)

Erik (mit Screenshot eines dunklen Referenz-Bands): „bitte als nächstes die referenzen section auf home so umbauen wie im screenshot. das ist dann auch mit vertical scroll. hover mit kreis mit zum projekt statt fallstudie lesen. bei über mich section bitte die linien bis ganz nach außen und bei den äußeren (6+ jahre und augsburg) auch vertikale linien. […] bilder für hero hab ich dir auch angehängt für die kleinen elemente.“

Ersetzt AK-22 (Fallstudien-Karten). AK-12 (Linkname = Titel) und AK-40 (PreMatch zuerst, vier Projekte) gelten weiter.

- AK-53: Der Projekt-Abschnitt ist ein dunkles Band über die volle Breite (in hell und dunkel gleich). Links oben steht klein ein Punkt in Akzentfarbe mit „Referenzen“ (EN „References“), daneben die h2 „Ein Auszug meiner Projekte.“ (EN „A selection of my projects.“) und darunter ein unterstrichener Link „Alle Projekte ansehen“ auf `/projects`.
- AK-54: Darunter stehen die vier Projekte nebeneinander als große Karten: Bild, Titel (h3, groß), darunter „Jahr — Art“ (z. B. „2026 — Masterarbeit“, Jahr aus der Projektseite, Art = letztes Schlagwort) und rechts neben dem Titel die Kategorie (erstes Schlagwort). Kein Kurztext und kein „Fallstudie lesen“ mehr. Der Linkname ist der Titel, Jahr, Art und Kategorie sind seine Beschreibung.
- AK-55: Querband beim senkrechten Scrollen (Erik: „mit vertical scroll“): Mit JavaScript und erlaubter Bewegung bleibt der Abschnitt stehen (sticky, so hoch wie der Bildschirm), und das Weiterscrollen nach unten schiebt die Karten nach links, bis die letzte Karte ganz zu sehen ist; danach geht die Seite normal weiter. Der Abschnitt ist dafür genau so viel höher, wie die Karten breiter als der Bildschirm sind. Bekommt eine Karte per Tastatur den Fokus, scrollt die Seite so, dass sie ganz im Bild ist. Ohne JavaScript, bei reduzierter Bewegung und bei Bildschirmen unter 560 px Höhe (Handy quer) ist die Kartenreihe einfach seitlich wischbar (`overflow-x: auto`, Einrasten), ohne Kleben. In keinem Fall scrollt die Seite selbst seitlich (AK-9).
- AK-56: Hover (Erik: „hover mit kreis mit zum projekt“): Mit feinem Zeiger erscheint über dem Bild ein dunkler Kreis mit „Zum Projekt“ (EN „View project“), der dem Mauszeiger folgt; das Bild zoomt leicht. Bei Tastaturfokus steht der Kreis in der Bildmitte. Der Kreis ist dekorativ (`aria-hidden`), der Linkname bleibt der Titel. Bei reduzierter Bewegung erscheint er ohne Animation.
- AK-57: Im Abschnitt „Über mich“ reichen die waagerechten Linien der Faktenleiste über die volle Breite, und ab 768 px haben auch die äußeren Felder („6+ Jahre UX Erfahrung“ links, „Augsburg“ rechts) eine senkrechte Linie nach außen. Unter 768 px (zwei Spalten) gibt es keine Linie am Bildschirmrand.
- AK-58: Die drei Medien-Plätze im Hero (AK-44) zeigen Fotos von Erik (Mütze vor Holztür, beim Wandern mit Handy, auf dem Berg im Schnee) mit `alt=""`, ohne Metadaten (kein GPS) und höchstens 800 px breit; der Bildausschnitt zeigt das Gesicht.

### Blinder Kritiker (Referenzen, 2026-10-06)

Behoben: Fokusrahmen auf dem dunklen Band im hellen Modus dunkel auf dunkel (jetzt weiß); auf niedrigen Bildschirmen rutschte die Überschrift beim Kleben unter die Navigation (Kleben erst ab 560 px Höhe); Fokusrahmen in der wischbaren Reihe oben abgeschnitten; Kreis erschien beim Antippen auf Touch (jetzt nur mit Hover-fähigem Zeiger). Bewusst so: Der Wechsel zum Kleben passiert nach dem Laden, der Abschnitt liegt unter dem ersten Bildschirm, daher kein sichtbarer Sprung.

## Ablauf als Timeline (Erik, 2026-10-06)

Erik (mit Screenshot einer „How it works“-Timeline als Vorlage): „das als vorlage für den prozess auf home. das links muss sticky mit laufen. bitte in meinen farben. icons bitte passend raussuchen und in der heading dann halt 1. und 2. etc reinpacken. dann ist klar ersichtlich das es ein prozess is. bg color der section bitte auch wie bei der über mich section“

Ersetzt die Kartenreihe für den Ablauf (AK-3 bleibt: geordnete Liste mit vier Schritten).

- AK-59: Der Abschnitt „So arbeiten wir zusammen“ hat denselben Hintergrund wie „Über mich“ (`bg-bg2`, Linien oben und unten über die volle Breite). Ab 768 px steht links eine Spalte mit dem Kennzeichen „Ablauf“ (EN „Process“) in Akzentfarbe, der h2 und zwei Links: „Kostenloses Erstgespräch“ (gefüllt, `/contact`) und „Projekte ansehen“ (Rahmen, `/projects`). Diese Spalte bleibt beim Scrollen kleben (`sticky`), solange die Schritte daneben durchlaufen; unter 768 px steht sie einfach darüber.
- AK-60: Rechts stehen die vier Schritte als senkrechte Timeline: je ein runder Icon-Kreis in Akzentfarbe (Lucide-Icons: Gespräch, Lupe/Analyse, Stift/Umsetzung, Rakete/Launch; dekorativ, `aria-hidden`), daneben die h3 mit Nummer („1. Kennenlernen“, „2. Analyse & Angebot“ …) und der Text. Zwischen den Kreisen verbindet eine senkrechte Linie die Schritte (nicht nach dem letzten).
- AK-61: Die Verbindungslinien füllen sich beim Scrollen in Akzentfarbe (wie im Screenshot: erledigt farbig, kommend grau), per CSS-Scroll-Animation (`animation-timeline: view()`), nur bei erlaubter Bewegung. Ohne Unterstützung dafür und bei reduzierter Bewegung sind die Linien gleich ganz farbig. Kein JavaScript nötig.

### Blinder Kritiker (Ablauf, 2026-10-06)

Behoben: Safari/VoiceOver verlor die Listen-Semantik der `ol` ohne Aufzählungszeichen (jetzt `role="list"`); Icon-Kreise im Dunkelmodus kaum sichtbar (kräftigere Fläche); graue, noch nicht gefüllte Linie kaum sichtbar (jetzt Vordergrund 15 %). Bewusst so: Die linke Spalte ist rund 300 px hoch und klebt auch auf niedrigen Bildschirmen, erst unter rund 420 px Höhe würde sie abgeschnitten.

## Unternehmen mit durchgehenden Linien (Erik, 2026-10-06)

Erik: „bitte auch bei den unternehmen für die ich gearbeitet hab die linien nicht gestrichelt sondern durchgängig und bis zum rand rechts und links. dann ist es schön durchgehend.“

- AK-62: Die Kacheln der Firmenleiste haben durchgezogene statt gestrichelte Linien. Die waagerechten Linien über und unter der Leiste (unter 768 px auch die zwischen den zwei Reihen) reichen über die volle Bildschirmbreite, wie bei der Faktenleiste in „Über mich“ (AK-57); ab 768 px haben die äußeren Kacheln auch außen eine senkrechte Linie. Ersetzt „die gestrichelten Kachelränder bleiben“ aus AK-51 (der Abschnitt selbst hat weiterhin keinen eigenen Rand oben und unten).

## Hero auf dem Handy größer (Erik, 2026-10-06)

Erik: „auf mobile gefällt mir die hero section auf home nicht. da ist das element viel zu klein im verhältnis zum paragraph. kannst du das anpassen?“

- AK-63: Unter 640 px ist die h1 im Hero mindestens 2,25-mal so groß wie der Absatz darunter (vorher rund 1,7-mal: 28 px zu 16 px). Dafür darf die erste Zeile umbrechen („Hey, ich bin“ / „[Bild] Erik“), so entstehen vier zentrierte Zeilen. Medien-Plätze wachsen mit der Schrift. Kein horizontales Scrollen ab 320 px (AK-9), keine Silbentrennung mitten im Wort. Ab 640 px bleibt alles wie bisher.

## Leistungen als Akkordeon (Erik, 2026-10-06)

Erik (mit Screenshot „Support for every stage“: zentrierte Überschrift, darunter nummerierte Zeilen „01 Brand Identity“ … mit Plus rechts; die offene Zeile hat einen Rahmen in Akzentfarbe, links ein großes Bild, rechts Text, Merkmalliste und Link): „jetzt bitte die leistungen auf der home seite so umbauen. bei bildern gerne erstmal placeholder drin.“

Ersetzt AK-21 (Sticky-Stapel) auf der Startseite; AK-5 und AK-12 gelten weiter.

- AK-64: Der Abschnitt „Was ich anbiete“ beginnt zentriert mit Kennzeichen „Leistungen“ (EN „Services“), h2 und Einleitungssatz. Darunter stehen alle sieben Leistungen als Akkordeon: je Zeile Nummer („01“ bis „07“, für Screenreader verborgen, die Liste gibt die Reihenfolge an) und Titel als Schalter in einer h3, rechts ein Plus (offen: Minus, dekorativ). Der Schalter hat `aria-expanded` und `aria-controls` auf sein Feld. Beim Laden ist die erste Leistung offen.
- AK-65: Es ist immer höchstens eine Leistung offen: Öffnen einer anderen schließt die bisherige, erneutes Klicken schließt die offene. Geschlossene Felder sind unsichtbar und für Screenreader verborgen; das Auf- und Zuklappen ist animiert, bei reduzierter Bewegung sofort. Ohne JavaScript sind alle Felder offen, damit nichts verloren geht.
- AK-66: Ein offenes Feld zeigt ab 768 px links ein großes Bild (vorerst ein dunkler Platzhalter mit dem Icon der Leistung, dekorativ, bis Erik Bilder schickt; im Dunkelmodus etwas heller als der Hintergrund) und rechts die Beschreibung, alle Leistungsmerkmale als Liste und den Link „Mehr zu <Leistung> →“ zur Leistungsseite; unter 768 px steht das Bild über dem Text. Die offene Zeile hat einen Rahmen in Akzentfarbe, die geschlossenen sind durch Linien getrennt. Kein eigener Erstgespräch-Button: Der Ablauf direkt darunter hat ihn (AK-59), so bleibt AK-46 erfüllt.

### Blinder Kritiker (Leistungen, 2026-10-06)

Behoben (mit Test): Nummer wurde siebenmal vorgelesen („null eins …“), jetzt nur sichtbar; Platzhalterbild im Dunkelmodus unsichtbar (gleiche Farbe wie der Hintergrund); zwei Erstgespräch-Buttons direkt hintereinander. Offen für Erik: Der englische Text zu UX/UI Design ist länger als der deutsche und sagt „pixel-perfect“; beide Fassungen angleichen.

## Leistungen breit, Rahmen nur beim Tastaturfokus (Erik, 2026-10-06)

Erik (Screenshot: große Überschrift „Support for every stage“, Zeilen über die volle Breite mit Linien oben und unten): „bitte das schön breit und die grüne outline nur bei keyboard focus.“

- AK-67: Der Leistungsabschnitt ist so breit wie der Seitencontainer (design-tokens.md AK-11; vorher volle Breite); Überschrift ab 768 px mindestens 56 px groß, Nummer und Titel der Zeilen ab 768 px mindestens 40 px. Die Zeilen sind oben und unten durch Linien über die ganze Breite getrennt, auch die offene.
- AK-68: Die offene Zeile hat keinen grünen Rahmen mehr (ersetzt den Rahmen aus AK-66). Grün umrandet wird ein Schalter nur beim Tastaturfokus (`:focus-visible`), nicht nach einem Mausklick.
