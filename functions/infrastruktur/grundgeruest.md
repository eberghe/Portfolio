# Grundgerüst

Status: In Arbeit

## Zweck

Technische Basis für alle weiteren Funktionen: Next.js (App Router) + TypeScript strict, Tailwind mit den übernommenen Tokens, Test-Setup (Vitest, Playwright, axe).

## Verhalten

- Root-Layout mit `lang="de"`, Skip-Link „Zum Inhalt springen", `main#inhalt`.
- Schrift selbst gehostet über `@fontsource` (seit 2026-10-04 Mona Sans, siehe `design-tokens.md` AK-6) (keine Anfragen an Google, DSGVO).
- Tailwind 3.4, damit die Klassen aus dem Lovable-Code 1:1 funktionieren.
- Playwright testet in 360, 768 und 1280 px.

## Akzeptanzkriterien

- AK-1: Inhalt (h1 mit „Erik Bergheimer") steht ohne JavaScript im HTML, `<html lang="de">`.
- AK-2: Genau eine h1; erster Tab-Stopp ist der Skip-Link zu `main#inhalt`.
- AK-3: axe (WCAG 2.2 AA): 0 Verstöße.
- AK-4: Keine horizontale Scrollbar in allen Viewports.
- AK-5: Keine Anfragen an fremde Server; Body-Schrift ist Mona Sans.

## Tests

`tests/e2e/grundgeruest.spec.ts`, `tests/unit/design-tokens.test.ts`, `tests/unit/contrast.test.ts`.
