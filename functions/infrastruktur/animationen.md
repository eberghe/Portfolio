# Animationen

Status: In Arbeit (Issue #15, Umbau 1)

## Zweck

Erik wünscht sich (2026-10-04) eine „smoothe Website mit nicen Animationen“ nach dem Vorbild von designme.agency. Diese Funktion liefert die Bausteine, die Startseite, Leistungs-, Projekt-, FAQ- und Stadtseiten gemeinsam nutzen.

## Verhalten

- **Einblenden beim Scrollen** (`data-reveal`): Elemente unterhalb des ersten Bildschirms gleiten beim Erreichen weich ein (Deckkraft und 16 px nach oben, 600 ms). Geschwister lassen sich mit `--reveal-i` staffeln (je 80 ms). Gesteuert über einen einzigen `IntersectionObserver` (`RevealObserver`), der nach jedem Seitenwechsel neu sucht.
- Versteckt wird nur, wenn JavaScript läuft (`html.js`, gesetzt im Kopf-Skript) **und** keine reduzierte Bewegung gewünscht ist. Ohne JavaScript, bei `prefers-reduced-motion: reduce` und ohne `IntersectionObserver` ist alles sofort sichtbar.
- Elemente, die beim Laden schon im Bild sind, werden ohne Verzögerung gezeigt; nichts flackert.
- Nur `opacity` und `transform` werden animiert, damit sich kein Layout verschiebt.
- **Laufband**: das bestehende Werkzeug-Laufband (`ToolsMarquee`) ist wiederverwendbar und hat einen Pause-Knopf (WCAG 2.2.2).
- **Sticky-Stapel** (`.sticky-stack > *`): Karten bleiben ab 768 px beim Scrollen versetzt oben kleben und stapeln sich, nur ohne reduzierte Bewegung.
- **Hover**: Karten heben sich leicht, Pfeile in Links gleiten nach rechts (`group-hover`), nur ohne reduzierte Bewegung.

## Akzeptanzkriterien

- AK-1: Ohne JavaScript sind alle `[data-reveal]`-Elemente sichtbar (Deckkraft 1).
- AK-2: Mit `prefers-reduced-motion: reduce` sind alle `[data-reveal]`-Elemente sofort sichtbar, ohne Transition.
- AK-3: Mit JavaScript und erlaubter Bewegung ist ein `[data-reveal]`-Element unterhalb des ersten Bildschirms zunächst unsichtbar und nach dem Hinscrollen sichtbar, auch nach einem Seitenwechsel per Client-Navigation.
- AK-4: Ein `[data-reveal]`-Element im ersten Bildschirm ist kurz nach dem Laden sichtbar.
- AK-5: `.sticky-stack`-Kinder sind ab 768 px `position: sticky`, darunter und bei reduzierter Bewegung nicht sticky (normaler Fluss).
- AK-13: Am Ende des Sticky-Stapels bleiben die 16-px-Kanten sichtbar: Wenn die Liste nach oben wegscrollt, behalten die Karten ihren Versatz (jede Karte mindestens 12 px unter der vorigen), statt auf einer Linie zusammenzufallen. Dafür sind die Karten einer Liste gleich hoch und die Liste setzt `--stack-n` (Anzahl Karten); ohne `--stack-n` verhält sich der Stapel wie bisher. (Kritiker 2026-10-05)
- AK-6: Keine axe-Verstöße und kein horizontales Scrollen auf Seiten mit Animationen.

## Barrierefreiheit

Reduzierte Bewegung wird überall respektiert; animierte Inhalte bleiben im Accessibility-Tree (nur visuell versteckt, nie `display: none`). Laufband mit Pause.

## Mobile

Sticky-Stapel erst ab 768 px; Einblenden auch auf dem Handy.

## Tests

`tests/e2e/animationen.spec.ts` (AK-1 bis AK-6).

## Ladeanimation und weiches Scrollen (Erik, 2026-10-05)

Erik: „auch bitte die lade animation bauen mit meinem style. bitte auch das scrolling ein bisschen smoothen“.

- **Ladeanimation**: Beim ersten Seitenaufruf einer Sitzung liegt kurz eine grüne Fläche (Primärfarbe) über der Seite, darauf baut sich der Schriftzug „Erik Bergheimer“ auf; danach gleitet die Fläche nach oben weg. Gesamtdauer höchstens 1,6 s. Läuft rein per CSS (Klasse `preload` am `<html>`, gesetzt im Kopf-Skript), damit sie auch ohne Hydration endet. Nicht bei reduzierter Bewegung, nicht ohne JavaScript, nicht bei weiteren Seitenwechseln in derselben Sitzung (`sessionStorage`). Die Fläche ist `aria-hidden` und blockiert keine Eingaben, nachdem sie weg ist.
- **Weiches Scrollen**: Mausrad- und Tastatur-Scrollen werden mit Lenis leicht geglättet (Desktop). Touch bleibt nativ. Bei reduzierter Bewegung aus. Anker-Links springen weich, Fokus und Skip-Link funktionieren weiter. Ist das Mobilmenü offen (`<html>` mit `overflow: hidden`), steht das Scrollen still.

- AK-7: Beim ersten Aufruf mit erlaubter Bewegung ist die Ladefläche sichtbar und nach spätestens 2 s weg (nicht sichtbar, keine Klicks abgefangen); beim zweiten Aufruf in derselben Sitzung erscheint sie nicht.
- AK-8: Bei reduzierter Bewegung und ohne JavaScript erscheint keine Ladefläche.
- AK-9: Mit erlaubter Bewegung ist weiches Scrollen aktiv (`html.lenis`), bei reduzierter Bewegung nicht; der Skip-Link führt weiter zum Hauptinhalt.

## Alles blendet ein (Erik, 2026-10-05)

Erik: „bitte nicht nur das heading animieren sondern alles! auch die paragraphen etc. sonst sieht es lieblos aus.“

- Neben den von Hand markierten `[data-reveal]`-Elementen bekommt der `RevealObserver` automatisch alle Inhaltsbausteine im Hauptbereich: Überschriften, Absätze, Listeneinträge, Bilder und Abbildungen, Zitate, Definitionslisten, aufklappbare Fragen und Formulare. Pro Verschachtelung wird nur das äußerste Element animiert (eine Karte gleitet als Ganzes ein, nicht ihre Teile einzeln). Geschwister werden gestaffelt (je 80 ms, höchstens fünf Stufen).
- Ausgenommen: Kopf- und Fußzeile, dekorative Laufbänder (`aria-hidden`), die Wort-für-Wort-Begrüßung, die Tafeln der Zeitleiste (sie bewegen sich schon beim Scrollen) und Elemente mit `data-no-reveal`.
- Was beim Markieren schon im Bild ist, wird sofort als sichtbar markiert (kein Flackern nach dem Laden). Nur bei erlaubter Bewegung (`html.smooth`); ohne JavaScript und bei reduzierter Bewegung ändert sich nichts.

- AK-10: Mit erlaubter Bewegung ist ein Absatz unterhalb des ersten Bildschirms zunächst unsichtbar und nach dem Hinscrollen sichtbar; ein Absatz im ersten Bildschirm ist nach dem Laden sichtbar.
- AK-11: Kein animiertes Element liegt in einem anderen animierten Element; Kopf- und Fußzeile enthalten keine automatisch animierten Elemente.

Prüfung 2026-10-05: Alle Seiten (DE/EN, 360 und 1280 px) bis zum Ende durchgescrollt; danach ist kein animiertes Element mehr unsichtbar.

## Hero-Einstieg (Erik, 2026-10-05)

Erik: „auch auf home bitte die paragraphen unter der h1 etc auch animieren das wirkt grad noch so statisch“.

- Im Hero der Startseite und von „Über mich“ steigen alle Bausteine (Hinweis, Rolle, Text, Knöpfe, Foto, Chips) beim Laden nacheinander ein: aus 24 px unten, unscharf zu scharf, Deckkraft 0 zu 1, je 120 ms versetzt, nach den Wörtern der Begrüßung. Rein per CSS (Klasse `hero-rise`, Stufe `--r`), damit nichts flackert und es ohne Hydration endet; mit Ladeanimation entsprechend später. Bei reduzierter Bewegung steht alles sofort da.

- AK-12: Mit erlaubter Bewegung laufen die Hero-Bausteine unter der h1 auf Start- und Über-mich-Seite mit der Animation `hero-rise` gestaffelt ein und sind danach voll sichtbar; bei reduzierter Bewegung haben sie keine Animation.
