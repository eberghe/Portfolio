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
- AK-21: Die Leistungen sind nummeriert (01 bis 08). Jede Karte zeigt Nummer, Kategorie, Titel (h3), Kurztext, bis zu vier Leistungsmerkmale als Liste und einen Link „Mehr erfahren“. Der Link heißt wie die Leistung; der Kurztext ist seine Beschreibung (AK-12 bleibt). Die Liste ist ein Sticky-Stapel (`sticky-stack`, siehe `infrastruktur/animationen.md`). Links daneben bleibt ab 768 px die Abschnittsüberschrift mit einem Satz und dem Erstgespräch-Button stehen.
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
