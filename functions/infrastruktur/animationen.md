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
- AK-6: Keine axe-Verstöße und kein horizontales Scrollen auf Seiten mit Animationen.

## Barrierefreiheit

Reduzierte Bewegung wird überall respektiert; animierte Inhalte bleiben im Accessibility-Tree (nur visuell versteckt, nie `display: none`). Laufband mit Pause.

## Mobile

Sticky-Stapel erst ab 768 px; Einblenden auch auf dem Handy.

## Tests

`tests/e2e/animationen.spec.ts` (AK-1 bis AK-6).
