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

- AK-14: Hero mit genau einer h1, Vorstellungstext (AK-8) und Foto mit beschreibendem Alt-Text. (h1 seit AK-26: „Servus, ich bin Erik“.)
- AK-15: Die Zeitleiste bleibt ein `ol` (AK-5) im Abschnitt mit h2 „Mein Weg“; jede Tafel hat `<time dateTime>`, h3 und Text. Tafeln ohne Foto zeigen einen dekorativen Platzhalter (kein `img`).
- AK-16: Mit JavaScript und ohne reduzierte Bewegung bleiben die Stationen auf allen Bildschirmgrößen (auch mobil, Erik 2026-10-05: „mobile muss natürlich auch alles passen“) bildschirmfüllend kleben und wechseln beim Scrollen nacheinander: am Anfang des Abschnitts ist die erste Station aktiv, am Ende die letzte. Die Seite selbst scrollt nie waagerecht. (Bis 2026-10-05 lief ab 768 px eine waagerechte Reihe durch, mobil standen die Tafeln untereinander.)
- AK-17: Ohne JavaScript und bei reduzierter Bewegung stehen die Tafeln untereinander (normaler Fluss), alle Inhalte erreichbar.
- AK-18: Text auf den Tafeln erreicht mindestens 4,5:1: über Fotos liegt eine Abdunklung mit mindestens 55 % Schwarz, der grüne Platzhalter ist dunkel genug für weiße Schrift.
- AK-19: Abschluss-Abschnitt mit h2 „Genug über mich. Jetzt bist du dran“ (EN „Enough about me. Your turn“), Link zum Kontakt und E-Mail-Adresse.
- AK-20: Jede Tafel füllt den Bildschirm (Wunsch Erik, 2026-10-05): in der waagerechten Reihe ist jede Tafel so breit und so hoch wie das Fenster, Foto bzw. Platzhalter randlos. Untereinander (AK-17) reichen alle Tafeln randlos über die volle Breite, Tafeln mit Foto sind mindestens fensterhoch; Platzhalter-Tafeln bleiben kürzer, damit die Seite mobil nicht unnötig lang wird.
- AK-21: Wechselt die Darstellung (z. B. reduzierte Bewegung wird eingeschaltet) zwischen untereinander und kleben, bleibt die Station im Blick, die vorher zu sehen war (Kritiker 2026-10-05: Sprung bis in den Footer).
- AK-22: Solange die Stationen kleben (AK-16), wechseln nur die Hintergründe (Foto bzw. Platzhalter, AK-23) (Wunsch Erik, 2026-10-05: „nur den hintergrund … sonst wirkt das nicht so smooth“). Jahreszahl, Zähler und Text stehen fest an derselben Stelle im Bildschirm. Die große Jahreszahl und der Zähler rollen Ziffer für Ziffer zur aktiven Station; der Text der aktiven Station blendet ein, die anderen sind ausgeblendet (Deckkraft 0, bleiben im Accessibility-Tree). Aktiv ist die Station, deren Hintergrund den größeren Teil des Bildschirms füllt. Untereinander (AK-17) ändert sich nichts.
- AK-23: Die Hintergründe gleiten nicht seitlich, sondern wechseln animiert (Erik, 2026-10-05: „kann das bild sich auch animieren statt zu scrollen?“): Alle Stationen liegen deckungsgleich übereinander; die nächste deckt die aktive von unten nach oben auf (Wisch-Maske, 0,9 s) und zoomt dabei von 115 % auf 100 %. Rückwärts schließt sich die Maske wieder nach unten. Je Station etwa 0,9 Fensterhöhen Scrollweg.
- AK-24: Solange die Stationen kleben, gibt es zwei Pfeil-Knöpfe „Vorherige Station“ / „Nächste Station“ (EN „Previous stop“ / „Next stop“), unten rechts über dem Fortschrittsbalken, mindestens 44 × 44 px, mit sichtbarem Fokus. Ein Klick springt zur vorherigen bzw. nächsten Station (die Bildanimation läuft wie beim Scrollen). An der ersten Station ist „Vorherige“, an der letzten „Nächste“ deaktiviert.
- AK-25: Mobil (360 × 780) passen Jahreszahl, Datum, Überschrift, Text, Zähler und Pfeile jeder Station ohne Abschneiden und ohne Überlappung in den Bildschirm.

Offen: Bilder für die Stationen ohne Foto liefert Erik; ein Interessen-Laufband wie in der Vorlage nur mit Eriks echten Interessen (Frage an Erik).

### Blinder Kritiker (Umbau, 2026-10-05)

Behoben: Scrollweg zu lang (20 Bildschirmhöhen; jetzt schmalere Tafeln und 0,6 px senkrecht je Pixel waagerecht), Position ging beim Ändern der Fenstergröße verloren, seitliches Wischen bewegte die Reihe nicht, Hinweispfeil zeigte in die falsche Richtung, Text der ersten Tafel lag unter dem Bildschirm (jetzt mittig), Zähler unter der Kopfzeile, Datum vor der Überschrift im DOM, Platzhalter-Karten mobil zu hoch, Ränder ungleich. Mobilmenü auf gescrollter Seite: Kopfzeile verschwand, Position ging verloren (navigation-und-footer.md AK-18). Ladeanimation: Seite scrollte darunter mit.
Offen: Fast die Hälfte der Stationen hat noch Platzhalter (Erik liefert Bilder); Fokussprung über die ganze Tafel-Reihe scrollt ohne Lenis per CSS weich und lang; Werkzeug-Logos blass (Bestand).

### Blinder Kritiker (bildschirmfüllende Tafeln, 2026-10-05)

Geprüft: alle 15 Tafeln genau fenstergroß bei 768, 1280 und 1440 px, randlos; erste und letzte Station erreichbar; kein waagerechter Überlauf; untereinander randlos. Behoben: Wechsel zwischen untereinander und waagerecht verlor die Station (AK-21).
Offen: Die beim Hochscrollen wieder einfahrende Kopfzeile liegt über den oberen 65 px der Tafel (wie bei jedem Inhalt unter der Kopfzeile, Text ist nie verdeckt solange sie ausgeblendet ist); Kontrast über Fotos prüft axe nicht automatisch (Abdunklung nach AK-18).

### Blinder Kritiker (feste Jahreszahl und Text, 2026-10-05)

Geprüft bei 768, 1280, 1440 px und 1280×600: Jahreszahl und Zähler stimmen an jeder Station, Text überlappt nie, nichts abgeschnitten oder unter der Kopfzeile, schnelles Scrollen landet richtig, Accessibility-Tree vollständig, keine fokussierbaren Elemente in ausgeblendeten Stationen. Behoben: kurze Lücke ohne Text beim Wechsel (neuer Text startet jetzt nach 100 ms).
Offen: 13-px-Datum und Zähler sind auf hellen Fotos die schwächsten Stellen (Abdunklung nach AK-18 hält sie lesbar; mit Eriks echten Fotos erneut prüfen).

### Blinder Kritiker (animierter Bildwechsel, 2026-10-05)

Behoben: Wisch-Maske und Zoom liefen in 150 ms statt 0,9 s (Tailwind erzeugte `duration-[…]`/`ease-[…]` neben tailwindcss-animate nicht; jetzt Inline-Stil, Test prüft die Dauer). Foto im Hero kommt zuletzt. Hero-Bausteine behalten nach dem Einstieg keinen Filter.
Geprüft: richtige Station am Anfang, Ende und nach schnellem Scrollen in beide Richtungen, kein waagerechter Überlauf, Zähler frei von der Kopfzeile, Fortschrittsbalken läuft, unter 768 px und bei reduzierter Bewegung untereinander.

### Blinder Kritiker (Pfeile und Mobil, 2026-10-05)

Geprüft bei 360×780, 390×844, 360×640, 768, 1280 und mit Touch: alle 15 Stationen passen ohne Abschneiden, nichts überlappt Pfeile oder Kopfzeile, Klick, Tippen, Enter, Leertaste und schnelles Klicken funktionieren, DE/EN-Namen stimmen, reduzierte Bewegung und ohne JS untereinander ohne Pfeile. Behoben: Fokus ging an den Enden verloren (jetzt `aria-disabled`), Wechsel per Pfeil wird für Screenreader angesagt, Hover blieb auf Touch-Geräten hängen, Fokusring jetzt rund, Tooltip mit Namen.

## Schlichter Hero (Erik, 2026-10-05)

Wunsch Erik mit Screenshot von matteofabbiani.webflow.io/about: „ganz einfach und dezent. nicht so viel text das liest sich eh keiner durch.“ Ersetzt in AK-12 die Pflicht, dass die Vorstellung Bali nennt, und in AK-13, dass sie die aktuelle Rolle nennt; beides erzählt jetzt die Zeitleiste.

- AK-26: Der Hero zeigt nur vier Dinge: h1 „Servus, ich bin Erik“ (EN „Hi, I'm Erik“), einen kurzen Vorstellungstext (höchstens 160 Zeichen, freiberuflich und Augsburg nach AK-8), eine Reihe Links zu Instagram, LinkedIn und E-Mail (je mit zugänglichem Namen, mindestens 44 × 44 px) und das Hochkant-Foto. Keine Überzeile, keine Rollenzeile, keine Schlagwort-Chips. Ab 768 px Text links, Foto rechts; darunter Text über dem Foto.

### Blinder Kritiker (schlichter Hero, 2026-10-05)

Geprüft bei 360, 768, 1280 und 1440 px, hell und dunkel, DE und EN: keine axe-Verstöße, kein waagerechter Überlauf, eine h1, Icon-Links 44 × 44 px mit Namen und sichtbarem Fokus, Alt-Text passt zum Foto. Behoben: bei 768 × 1024 wirkte der Hero halb leer (volle Bildschirmhöhe jetzt erst ab 1024 px), Foto bei 2x-Bildschirmen leicht unscharf (`sizes` berücksichtigt den Hochkant-Zuschnitt), Werkzeug-Überschrift stand 34 px neben der gemeinsamen linken Kante. Mitbehoben: Alt-Text beschrieb ein anderes Foto (Sonnenbrille, schwarzes Hemd). Offen: Das Foto zeigt Erik von hinten; ein echtes Porträt wäre stärker, wenn Erik eins hat.

## Echte Stationsfotos (Erik, 2026-10-05)

- AK-27: Fotos von Erik: „Bachelorabschluss“ (2023-08, EN „Bachelor's degree“; Urkundenübergabe an der TH Ingolstadt, ersetzt das alte Flur-Porträt) „Werkstudent bei TEAM23“ (2022-02, Workshop auf einer Terrasse) und „UX/UI-Designer bei TEAM23 (Vollzeit)“ (2023-09, im Crew-Shirt mit Peace-Zeichen). Jedes Stationsfoto kann einen Bildausschnitt (`position`, CSS `object-position`) mitbringen, damit Erik im Querformat-Zuschnitt sichtbar bleibt. Fotos werden als JPEG höchstens 2000 px lang abgelegt.
