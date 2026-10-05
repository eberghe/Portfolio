# Über mich

Status: In Arbeit

## Zweck

Wer ist Erik, was kann er, wie kam er dahin. Für Interessenten Vertrauen, für KI-Suchen belastbare Personenfakten.

## Bestand (Lovable `AboutPage.tsx`, `LogoSlider.tsx`, `tlData`)

- Hero (halb Text, halb Foto): Badge „Innsbruck, Austria", h1 „Erik Bergheimer — UX/UI Designer & Webflow Expert", Zeile „Portfolio · Augsburg & Innsbruck", „Innsbruck · 25 Jahre · M.A. MCI", Vorstellungstext, Chips.
- Laufband „Tools, mit denen ich arbeite" (9 Logos, je dreimal als Link, läuft endlos, pausiert nur bei Mausberührung).
- Zeitleiste „Mein Weg" (13 Stationen 2018–2025, 9 mit Bild), Linie füllt sich beim Scrollen.
- Probleme im Bestand: Laufband ohne Pause-Knopf (WCAG 2.2.2) und mit 27 Tab-Stopps; Bilder mit Alt-Text = Überschrift; Badge englisch auf deutscher Seite; Altersangabe veraltet schnell.

## Verhalten

- `/about` (EN `/en/about`).
- Hero wie im Bestand; Badge „Augsburg" (siehe `standort.md`); Alter wird aus dem Geburtsjahr nicht berechnet, sondern weggelassen (Erik bestätigt). Chips mit den aktuellen Leistungen.
- Tools: Liste der Werkzeuge (einmal im Accessibility-Tree, keine Links). Das Laufband ist Dekoration (`aria-hidden`), läuft nur bei `prefers-reduced-motion: no-preference` und hat einen Pause-Knopf (`aria-pressed`).
- Zeitleiste als geordnete Liste (`ol`), Datum als `<time>`, Bilder mit beschreibendem Alt-Text oder dekorativ, wenn sie nur die Überschrift wiederholen. Die Füll-Linie beim Scrollen entfällt; Linie und Punkte bleiben statisch (Design).
- JSON-LD `ProfilePage` mit `mainEntity` = Person (gleiche `@id` wie überall).
- Abschluss: Link zur Kontaktseite.

## Akzeptanzkriterien

- AK-1: Seite in DE und EN, genau eine h1, eigene Title/Description, in Sitemap.
- AK-2: JSON-LD `ProfilePage` mit Person (`@id` `/#person`).
- AK-3: Werkzeuge stehen genau einmal als Liste im Accessibility-Tree; das bewegte Laufband ist `aria-hidden` und enthält keine fokussierbaren Elemente.
- AK-4: Laufband hat einen Pause-Knopf mit `aria-pressed`; bei reduzierter Bewegung läuft es nicht.
- AK-5: Zeitleiste ist ein `ol` mit 15 Einträgen, jedes mit `<time dateTime>` und Überschrift (h3).
- AK-6: Keine englischen Begriffe auf der deutschen Seite, die eine deutsche Entsprechung haben („Working Student" → „Werkstudent", „Bachelor Thesis" → „Bachelorarbeit").
- AK-8: Der Vorstellungstext sagt, dass Erik freiberuflich Projekte annimmt (Leistungen, Orte).
- AK-9: Zeitleiste durchgehend in der Vergangenheit; kein Bild doppelt.
- AK-10: Werkzeuge im Laufband und in der FAQ-Antwort stimmen überein; nur Werkzeuge, keine Plattformen (kein Dribbble).
- AK-11: Master abgeschlossen (Erik, 2026-10-04): letzter Eintrag der Zeitleiste ist „Masterabschluss am MCI“ (Monat 2026-09, von Erik zu bestätigen); kein Text sagt mehr, dass Erik am MCI studiert (Vorstellung, Innsbruck-Eintrag, `llms.txt`); Person-JSON-LD nennt in `alumniOf` TH Ingolstadt und MCI. Kein Umzugs-Eintrag zurück nach Deutschland (Erik).
- AK-12: Vorstellung und Zeitleiste stehen durchgehend in der Vergangenheit (auch HERO Software); die Vorstellung sagt in DE und EN dasselbe (Orte Augsburg, Bali, Innsbruck). Person-JSON-LD nennt den Arbeitsort-Staat in der Sprache der Seite (Deutschland/Germany).
- AK-7: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel).

## Daten

`lib/content/about.ts` (Zeitleiste, Werkzeuge).

## Tests

`tests/unit/ueber-mich.test.tsx` (AK-2 bis AK-6, AK-11, AK-12), `tests/e2e/statische-seiten.spec.ts` (AK-1, AK-7).

## Offene Fragen

- Altersangabe („25 Jahre") weglassen? Vorschlag: ja, weil sie veraltet.

## Befunde Blinder Kritiker (Runde 1)

Behoben (mit Test): Freelance-Tätigkeit fehlte (AK-8), Zeitform und doppeltes Foto (AK-9), Werkzeuge widersprachen der FAQ (AK-10), „Innsbruck · M.A. MCI" ausgeschrieben, TH Ingolstadt einheitlich benannt, Person-JSON-LD mit `image` (`knowsAbout` steht bereits am ProfessionalService der Startseite).

Bewusst so gelassen: Schriftgrößen 11 px gehören zum bestehenden Design (Änderung nur mit Eriks OK).

## Befunde Blinder Kritiker (Runde 2, Masterabschluss)

Behoben (mit Test, AK-12): HERO-Eintrag in Vergangenheit, Vorstellung DE/EN angeglichen, doppeltes „working“, Arbeitsort-Staat im EN-JSON-LD. Ohne Test mitbehoben: „Sie zeigte mir“ (Workation), „Bis zur Abreise“ statt „Davor“ (IKEA).
Als Issue angelegt: Ort im Kopfbereich doppelt, „Sept“ vs. „Sep“ im EN-Datum, einheitliche Hochschulnamen mit `sameAs`, About-Seite fehlt in `llms.txt`, „?.“ in `llms.txt`.

## Business Development Manager (Erik, 2026-10-05)

Erik: „bin aktuell business development manager nicht werkstudent“ und „seit september bin ich business development manager“.

- AK-13: Die Zeitleiste endet mit „Business Development Manager bei HERO Software“ (2026-09, nach dem Masterabschluss im selben Monat). Die Vorstellung nennt die aktuelle Rolle; der Werkstudent-Eintrag (2025-09) bleibt als Station.

## Umbau nach Vorlage matteofabbiani.webflow.io/about (Erik, 2026-10-05)

Erik: „bitte die about seite ähnlich zu diesem. die bilder kann ich dir dann auch geben verwende erstmal platzhalter und baue meine journey mal ähnlich dazu. finde das vertical scroll ganz nice.“

Vorlage: Hero mit großer Begrüßung links und Hochkant-Foto rechts; Abschnitt „A bit about me“, in dem vertikales Scrollen eine Reihe bildschirmfüllender Bild-Tafeln waagerecht durchschiebt (je Tafel: Foto mit dunkler Abdunklung, große Jahreszahl, Titel, kurzer Text); Interessen-Laufband; großer Abschluss „This page is named about, not about me … I would love to hear your story too“.

Übernommen, im Stil der Seite (Grün, Mona Sans fett):

- Hero: Überzeile „Über mich“, h1 „Erik Bergheimer“, Rolle, Vorstellungstext, Chips der Leistungen, Hochkant-Foto rechts (ab 768 px), darunter auf dem Handy.
- „Mein Weg“: Zeitleiste als waagerechte Tafel-Reihe, die ab 768 px beim vertikalen Scrollen durchläuft (Abschnitt bleibt kleben, Fortschritt = Scrollweg). Je Tafel: Bild (vorhandene Fotos, sonst grüner Platzhalter mit Verlauf, bis Erik Bilder schickt), dunkle Abdunklung, große Jahreszahl, Titel, Text, Datum als `<time>`. Fortschrittsbalken unten.
- Werkzeug-Laufband bleibt.
- Abschluss: „Genug über mich. Jetzt bist du dran“ (EN „Enough about me. Your turn“) mit Text, Button zum Erstgespräch und E-Mail.

Ersetzt den bisherigen Seitenaufbau (Hero halb/halb, senkrechte Zeitleiste mit Linie). AK-3 bis AK-13 gelten weiter.

- AK-14: Hero mit genau einer h1 „Erik Bergheimer“, Vorstellungstext (AK-8) und Foto mit beschreibendem Alt-Text.
- AK-15: Die Zeitleiste bleibt ein `ol` (AK-5) im Abschnitt mit h2 „Mein Weg“; jede Tafel hat `<time dateTime>`, h3 und Text. Tafeln ohne Foto zeigen einen dekorativen Platzhalter (kein `img`).
- AK-16: Ab 768 px, mit JavaScript und ohne reduzierte Bewegung bleibt die Tafel-Reihe beim Scrollen kleben und verschiebt sich waagerecht: am Anfang des Abschnitts ist die erste Tafel zu sehen, am Ende die letzte. Die Seite selbst scrollt nie waagerecht.
- AK-17: Ohne JavaScript, unter 768 px und bei reduzierter Bewegung stehen die Tafeln untereinander (normaler Fluss), alle Inhalte erreichbar.
- AK-18: Text auf den Tafeln erreicht mindestens 4,5:1: über Fotos liegt eine Abdunklung mit mindestens 55 % Schwarz, der grüne Platzhalter ist dunkel genug für weiße Schrift.
- AK-19: Abschluss-Abschnitt mit h2 „Genug über mich. Jetzt bist du dran“ (EN „Enough about me. Your turn“), Link zum Kontakt und E-Mail-Adresse.
- AK-20: Jede Tafel füllt den Bildschirm (Wunsch Erik, 2026-10-05): in der waagerechten Reihe ist jede Tafel so breit und so hoch wie das Fenster, Foto bzw. Platzhalter randlos. Untereinander (AK-17) reichen alle Tafeln randlos über die volle Breite, Tafeln mit Foto sind mindestens fensterhoch; Platzhalter-Tafeln bleiben kürzer, damit die Seite mobil nicht unnötig lang wird.
- AK-21: Wechselt die Darstellung durch Ändern der Fenstergröße zwischen untereinander und waagerecht, bleibt die Station im Blick, die vorher zu sehen war (Kritiker 2026-10-05: Sprung bis in den Footer).

Offen: Bilder für die Stationen ohne Foto liefert Erik; ein Interessen-Laufband wie in der Vorlage nur mit Eriks echten Interessen (Frage an Erik).

### Blinder Kritiker (Umbau, 2026-10-05)

Behoben: Scrollweg zu lang (20 Bildschirmhöhen; jetzt schmalere Tafeln und 0,6 px senkrecht je Pixel waagerecht), Position ging beim Ändern der Fenstergröße verloren, seitliches Wischen bewegte die Reihe nicht, Hinweispfeil zeigte in die falsche Richtung, Text der ersten Tafel lag unter dem Bildschirm (jetzt mittig), Zähler unter der Kopfzeile, Datum vor der Überschrift im DOM, Platzhalter-Karten mobil zu hoch, Ränder ungleich. Mobilmenü auf gescrollter Seite: Kopfzeile verschwand, Position ging verloren (navigation-und-footer.md AK-18). Ladeanimation: Seite scrollte darunter mit.
Offen: Fast die Hälfte der Stationen hat noch Platzhalter (Erik liefert Bilder); Fokussprung über die ganze Tafel-Reihe scrollt ohne Lenis per CSS weich und lang; Werkzeug-Logos blass (Bestand).

### Blinder Kritiker (bildschirmfüllende Tafeln, 2026-10-05)

Geprüft: alle 15 Tafeln genau fenstergroß bei 768, 1280 und 1440 px, randlos; erste und letzte Station erreichbar; kein waagerechter Überlauf; untereinander randlos. Behoben: Wechsel zwischen untereinander und waagerecht verlor die Station (AK-21).
Offen: Die beim Hochscrollen wieder einfahrende Kopfzeile liegt über den oberen 65 px der Tafel (wie bei jedem Inhalt unter der Kopfzeile, Text ist nie verdeckt solange sie ausgeblendet ist); Kontrast über Fotos prüft axe nicht automatisch (Abdunklung nach AK-18).
