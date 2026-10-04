# Barrierefreiheit

Status: Entwurf

## Ziel

WCAG 2.2 AA, BFSG-konform. Die Seite ist Referenz für Eriks Beratungsleistung.

## Regeln

- Semantisches HTML zuerst, ARIA nur wo nötig
- Skip-Link, sichtbarer Fokus, Fokusreihenfolge = visuelle Reihenfolge
- Kontrast ≥ 4.5:1 (Text), ≥ 3:1 (UI-Elemente)
- `prefers-reduced-motion` respektiert
- Zielgrößen ≥ 24×24 px
- Erklärung zur Barrierefreiheit als eigene Seite

## Akzeptanzkriterien

- AK-1: axe-core: 0 Verstöße auf jeder Seite (Playwright, alle Viewports).
- AK-2: Gesamte Seite per Tastatur bedienbar (E2E-Test).
- AK-3: Lighthouse Accessibility = 100.
