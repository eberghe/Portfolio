# UI-Bausteine (Button, Textfeld)

Status: In Arbeit

## Zweck

Ein Button und ein Textfeld als gemeinsame Komponenten, damit jede Seite, auch der Kundenbereich (Epic #49), dieselben Patterns nutzt statt kopierter Klassen-Strings (Issue #50).

## Nutzer & Ziel

Entwicklung: neue Formulare (Login, Admin) bauen aus denselben Teilen. Besucher: Felder und Buttons sehen überall gleich aus und verhalten sich gleich.

## Verhalten

- `components/ui/Button.tsx`: Varianten `primary` (grün) und `secondary` (Rahmen). Ohne `href` ein `<button>` (Standard `type="button"`), mit `href` ein Link (`next/link`). Weitere Klassen über `className` (z. B. `max-sm:flex-1` im Anfrage-Assistenten).
- `components/ui/TextField.tsx`: Label, optionaler Zusatz („Pflichtfeld“ / „optional“), Hinweistext, Eingabe (`input` oder mit `multiline` ein `textarea`), Fehlermeldung. Hinweis hat die ID `<id>-hinweis`, Fehler `<id>-fehler`.
- Optik entspricht 1:1 dem bisherigen Anfrage-Assistenten (Kontaktseite), der als Erster auf die Bausteine umgestellt wird.
- Einzige sichtbare Änderung: Die beiden Buttons im Ausweichweg der Kontaktseite (Mail öffnen, Text kopieren) hatten eigene Abstände; sie nutzen jetzt `primary` bzw. `secondary`, der Mail-Button ist dadurch auch 44 px hoch.

## Akzeptanzkriterien

- AK-1: Das Label des Textfelds ist mit der Eingabe verknüpft (`getByLabelText` findet sie), der Zusatz steht im Label.
- AK-2: Hinweis und Fehler sind per `aria-describedby` an der Eingabe angehängt (Hinweis zuerst); ohne beides fehlt das Attribut.
- AK-3: Bei Fehler ist `aria-invalid="true"` gesetzt und der Rahmen nutzt `border-error`, sonst `border-border`; ohne Fehler kein `aria-invalid`.
- AK-4: `multiline` rendert ein `textarea`, sonst ein `input`; weitere Attribute (`type`, `autoComplete`, `defaultValue`, `ref` …) werden durchgereicht.
- AK-5: Der Button ist ohne `href` ein `<button type="button">` (überschreibbar mit `type="submit"`), mit `href` ein Link; beide mindestens 44 px hoch (`min-h-11`).
- AK-6: Variante `primary` nutzt `bg-primary text-primary-foreground hover:bg-primary-hover` (Hover-Kontrast, design-tokens.md AK-5), `secondary` einen Rahmen; `aria-disabled` dimmt den Button (`aria-disabled:opacity-60`).
- AK-7: Der Anfrage-Assistent nutzt `Button` und `TextField`; die Datei enthält keine eigenen Klassen-Strings für Eingaben und Buttons mehr. Alle bisherigen Tests der Kontaktseite bleiben grün.

## Barrierefreiheit

Sichtbares Label statt Platzhalter, Fehler als Text (nicht nur Farbe), Fokusrahmen aus `globals.css`, Zielgröße 44 px.

## Mobile

Felder `w-full`; Buttons wachsen nur, wenn der Aufrufer es per `className` will.

## Sprachen (DE/EN)

Keine Texte in den Bausteinen; Label, Zusatz, Hinweis und Fehler kommen vom Aufrufer.

## SEO / GEO

Keine Auswirkung.

## Daten

Keine.

## Tests

`tests/unit/ui-bausteine.test.tsx` (AK-1 bis AK-7), weiterhin `tests/unit/anfrage.test.tsx` und `tests/e2e/kontakt.spec.ts`.

## Offene Fragen

- Die übrigen Komponenten mit eigenem grünen Button-Stil (Navigation, Startseite, Leistungen, Projekte, FAQ, Über mich, Städteseiten) haben teils andere Größen und Formen (z. B. runde Pillen). Sie werden schrittweise umgestellt, sobald sie ohnehin angefasst werden, damit sich die Optik nicht unbemerkt ändert.

## Befunde Blinder Kritiker (2026-10-08)

Kontaktseite DE/EN bei 360 und 1280 px: keine Befunde hoch oder mittel, axe 0 Verstöße in allen 7 Zuständen, alle Buttons inkl. Ausweichweg 44 px hoch. Niedrig, bewusst offen gelassen (vorher schon so, nicht Teil der Bausteine):

- Links in der Fehlerliste sind Fließtext-Links unter 24 px Höhe (nach WCAG 2.5.8 als Inline-Links erlaubt).
- Im Ausweichweg stehen Mail- und Kopieren-Button auf dem Handy untereinander in unterschiedlicher Breite.
- Die Gruppe „Schritt 1 von 4: Leistung“ nennt kein „(Pflicht)“, der Hinweis darunter sagt aber, dass mindestens eine Leistung nötig ist.
