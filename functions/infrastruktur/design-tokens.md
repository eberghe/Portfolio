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
| Token | auf Weiß | auf `bg2` | Status |
|---|---|---|---|
| foreground | 16,1 | 15,1 | ok |
| primary | 5,3 | 5,0 | ok |
| text2 | 4,7 | 4,4 | auf `bg2` knapp zu wenig |
| text3 | 2,9 | 2,7 | **nicht ausreichend** (32 Verwendungen) |
| Dunkel: primary als Text | 3,5 | | **nicht ausreichend** |
| Dunkel: text3 | 4,0 | | **nicht ausreichend** |

Entschieden (Erik, 2026-10-04): minimal anpassen, nur Helligkeit, Farbton und Sättigung bleiben. Zielwerte erfüllen 4,5:1 auf `background`, `bg2` und `bg3`:

| Token | alt | neu |
|---|---|---|
| `--text2` (hell) | `215 15% 47%` | `215 15% 44.5%` |
| `--text3` (hell) | `214 20% 61%` | `214 20% 44.5%` (deutlich dunkler, nahe `text2`) |
| `--text3` (dunkel) | `205 20% 45%` | `205 20% 53%` |
| `--primary-text` (neu, nur dunkel) | – | `161 36% 43.5%`; `--primary` für Buttons bleibt |

Grün als Text im Dunkelmodus nutzt `--primary-text`; im hellen Modus ist `--primary-text` = `--primary`.

## Akzeptanzkriterien
- AK-1: Screenshot-Vergleich alt vs. neu je Seite, Abweichung unter Schwellwert (bis auf freigegebene Kontrast-Korrekturen).
- AK-2: Komponenten verwenden ausschließlich Tokens, keine freien Farbwerte.
- AK-3: Hell- und Dunkelmodus funktionieren, Wahl bleibt gespeichert, `prefers-color-scheme` wird beim ersten Besuch berücksichtigt.
- AK-4: Alle Text-Token-Kombinationen erfüllen 4,5:1 (automatischer Test über alle Text/Hintergrund-Paare, hell und dunkel).
