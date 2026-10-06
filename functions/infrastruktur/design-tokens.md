# Design-Tokens

Status: Entwurf

## Zweck

Das bestehende Design 1:1 übernehmen. Quelle: Lovable-Repo `eberghe/erik-bergheimer` (`src/index.css`, `tailwind.config.ts`, shadcn/ui).

## Bestand (aus `src/index.css`)

- Schrift: Inter (300/400/500/600, 300 kursiv), Fallback `system-ui`
- Primärfarbe: `hsl(161 36% 34%)` (Grün), Hintergrund weiß, Text `hsl(207 30% 13%)`
- Zusatztokens: `--text2`, `--text3`, `--bg2`, `--bg3`, `--primary-light`, `--primary-mid`, `--primary-border`
- Radius `0.5rem`, Container max. 1400 px, Padding 2rem
- Dunkelmodus über Klasse `.dark` mit eigenem Token-Satz (Umschalter in der Navigation)
- Animationen: `fade-in`, `pulse-dot`, Logo-Laufband (60 s)

## Übernahme

- Tokens unverändert als CSS-Variablen übernehmen, Tailwind-Konfiguration übernehmen.
- Selbst-gehostete Schrift über `next/font` statt Google-Fonts-Link (Datenschutz, Performance), gleiche Schnitte.
- Ungenutzte shadcn-Komponenten nicht übernehmen.

## Kontrast-Befund (WCAG AA verlangt 4,5:1 für Text)

| Token                    | auf Weiß | auf `bg2` | Status                                  |
| ------------------------ | -------- | --------- | --------------------------------------- |
| foreground               | 16,1     | 15,1      | ok                                      |
| primary                  | 5,3      | 5,0       | ok                                      |
| text2                    | 4,7      | 4,4       | auf `bg2` knapp zu wenig                |
| text3                    | 2,9      | 2,7       | **nicht ausreichend** (32 Verwendungen) |
| Dunkel: primary als Text | 3,5      |           | **nicht ausreichend**                   |
| Dunkel: text3            | 4,0      |           | **nicht ausreichend**                   |

Entschieden (Erik, 2026-10-04): minimal anpassen, nur Helligkeit, Farbton und Sättigung bleiben. Zielwerte erfüllen 4,5:1 auf `background`, `bg2` und `bg3`:

| Token                              | alt           | neu                                              |
| ---------------------------------- | ------------- | ------------------------------------------------ |
| `--text2` (hell)                   | `215 15% 47%` | `215 15% 44.5%`                                  |
| `--text3` (hell)                   | `214 20% 61%` | `214 20% 44.5%` (deutlich dunkler, nahe `text2`) |
| `--text3` (dunkel)                 | `205 20% 45%` | `205 20% 53%`                                    |
| `--primary-text` (neu, nur dunkel) | –             | `161 36% 43.5%`; `--primary` für Buttons bleibt  |

Grün als Text im Dunkelmodus nutzt `--primary-text`; im hellen Modus ist `--primary-text` = `--primary`.

## Akzeptanzkriterien

- AK-1: Screenshot-Vergleich alt vs. neu je Seite, Abweichung unter Schwellwert (bis auf freigegebene Kontrast-Korrekturen).
- AK-2: Komponenten verwenden ausschließlich Tokens, keine freien Farbwerte.
- AK-3: Hell- und Dunkelmodus funktionieren, Wahl bleibt gespeichert, `prefers-color-scheme` wird beim ersten Besuch berücksichtigt.
- AK-4: Alle Text-Token-Kombinationen erfüllen 4,5:1 (automatischer Test über alle Text/Hintergrund-Paare, hell und dunkel).
- AK-6 (Erik, 2026-10-04): Schrift ist **Mona Sans** (variable, Gewicht 200 bis 900) statt Inter, selbst gehostet (Datei aus `@fontsource-variable/mona-sans`, seit Issue #28 über `next/font/local`, siehe AK-10), Fallback größenangepasstes Arial, dann `system-ui`. Keine Anfrage an fremde Server.
- AK-7 (Erik, 2026-10-04): Alle Überschriften (`h1` bis `h4`) sind fett (`font-weight: 700`). Ausnahme: die kursiven Serifen-Zeilen der Startseiten-h1 („Erik Bergheimer“, „Designer“, startseite.md AK-43) stehen im einzigen Schnitt der Instrument Serif (400); die h1 selbst ist fett.
- AK-8: Datenschutzerklärung nennt die tatsächlich genutzte Schrift (Mona Sans).
- AK-9 (Blinder Kritiker): Keine Überschrift ist breiter als ihre Spalte (360/768/1280). Die Startseiten-h1 ist bei 768 px kleiner (40 px), weil die Hero-Spalte dort schmal ist; die Rechtstexte-h1 („Datenschutzerklärung“) ist auf dem Handy 26 px und trennt per `hyphens: auto`. Die Rollen-Zeile bricht ausgewogen um (`text-wrap: balance`), die Laufweite großer Überschriften ist −0,03 em statt −2 px.
- AK-5: Auch im Hover-Zustand erreicht Button-Text 4,5:1. Der Bestand hellt grüne Buttons per `opacity-90` auf (weiß auf Grün nur 4,35:1); stattdessen dunkelt `--primary-hover` leicht ab. Fehlermeldungen nutzen `--error-text` (4,5:1 auf allen Hintergründen).

## Befunde Blinder Kritiker (Mona Sans, 2026-10-04)

Bestätigt: Mona Sans wird selbst gehostet geladen, echtes Gewicht 700 (kein künstliches Fett), alle h1–h4 fett, kein horizontales Scrollen. Behoben mit Test (AK-9): Startseiten-h1 ragte bei 768 px aus der Spalte, „Datenschutzerklärung“ bei 360 px; dazu ausgewogener Umbruch der Rollen-Zeile und etwas weitere Laufweite der großen h1.

## Kein Layout-Sprung beim Laden der Schrift (Issue #28, 2026-10-05)

Befund Blinder Kritiker: Auf `/` springt der Hero beim Nachladen von Mona Sans (h1 bricht um eine Zeile anders um, CLS 0,24). Lösung: Mona Sans wird über `next/font/local` geladen (Datei aus `@fontsource-variable/mona-sans`, Latin, Gewicht 200 bis 900, vorgeladen). `next/font` erzeugt eine größenangepasste Ersatzschrift (Arial mit `size-adjust`), die so breit läuft wie Mona Sans; der Wechsel verschiebt kaum etwas. Weiterhin keine Anfrage an fremde Server (AK-6).

- AK-10: Cumulative Layout Shift unter 0,1 auf `/`, `/en` und `/about` bei 360 und 1280 px, mit und ohne reduzierte Bewegung, gemessen ab dem Laden bis 2 s danach.
