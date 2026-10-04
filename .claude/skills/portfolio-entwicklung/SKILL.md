---
name: portfolio-entwicklung
description: Pflicht-Workflow für jede Änderung an Eriks Portfolio (erik-bergheimer.de): erst Funktion in functions/ dokumentieren, dann Test schreiben (rot), dann entwickeln bis grün, dann Blinder Kritiker. Gilt für Features, Bugfixes, Inhalte, SEO/GEO-Seiten.
---

# Portfolio-Entwicklung (erik-bergheimer.de)

Dieser Skill gilt für **jede** Änderung am Portfolio: neue Funktion, Bugfix, neue Landingpage, Textänderung mit Logik dahinter. Keine Ausnahme ohne Eriks ausdrückliches OK.

## Grundsätze

1. **Doku zuerst.** Keine Zeile Code, bevor die Funktion in `functions/` beschrieben ist.
2. **Test zuerst (TDD).** Rot → Grün → Refactor. Ein Test, der nie rot war, zählt nicht.
3. **Design bleibt.** Das bestehende Design (Farben, Typografie, Abstände, Komponenten) wird 1:1 übernommen. Design-Tokens liegen zentral; neue Komponenten verwenden nur vorhandene Tokens. Visuelle Abweichungen fallen im Screenshot-Test auf.
4. **Barrierefrei nach WCAG 2.2 AA** und BFSG-konform. Kein Merge mit axe-Verstößen.
5. **Mobile first.** Jede Seite wird bei 360 px, 768 px und 1280 px getestet.
6. **Zweisprachig (DE/EN).** Jede Seite und jeder Text existiert auf Deutsch und Englisch; Texte nie im Komponentencode, `hreflang` überall.
7. **Keine erfundenen Zahlen.** Kennzahlen nur mit Quelle.
8. **SEO & GEO by default.** Jede Seite ist serverseitig gerendert, hat Meta-Daten, strukturierte Daten (JSON-LD) und beantwortet echte Nutzerfragen.

## Tech-Stack

- **Next.js (App Router) + TypeScript (strict)**, statisch/serverseitig gerendert, Hosting auf **Vercel**
- **next-intl** für DE (Standard, ohne Präfix) und EN (`/en`)
- **Tailwind CSS** mit den Design-Tokens der bisherigen Seite
- **Supabase** (Postgres, Row Level Security) für Anfragen, Landingpage-Daten, FAQs
- Tests: **Vitest + Testing Library** (Unit/Komponenten), **Playwright** (E2E, Mobile-Viewports, Screenshots), **axe-core** (A11y), **Lighthouse CI** (Performance/SEO)
- Lint/Format: ESLint (inkl. `jsx-a11y`), Prettier, `tsc --noEmit`

## Ablauf für jede Änderung

### 1. Funktion beschreiben
- Passende Datei in `functions/<bereich>/<funktion>.md` anlegen oder erweitern (Vorlage: `functions/_vorlage.md`).
- Pflichtabschnitte: Zweck, Nutzer & Ziel, Verhalten, Akzeptanzkriterien (nummeriert, testbar), A11y, Mobile, SEO/GEO, Sprachen, Daten (Supabase-Tabellen), Offene Fragen.
- Neue Datei in `functions/README.md` verlinken.
- Eine Datei = eine Funktion. Wird eine Datei länger als ca. 150 Zeilen, aufteilen.

### 2. Tests schreiben (rot)
- Für **jedes** Akzeptanzkriterium mindestens ein Test, der Kriterium-Nummer im Namen trägt, z. B. `it('AK-3: zeigt Fehlermeldung bei leerer E-Mail')`.
- Seitenfunktionen: Playwright-Test inkl. `axe`-Check und Mobile-Viewport.
- Tests laufen lassen und **bestätigen, dass sie rot sind** (aus dem richtigen Grund).

### 3. Entwickeln bis grün
- Minimaler Code, bis alle Tests grün sind. Dann aufräumen, Tests bleiben grün.
- Vor dem Commit lokal: `npm run lint && npm run typecheck && npm test && npm run test:e2e`.

### 4. Blinder Kritiker
- Nach Grün startet ein separater Reviewer-Agent **ohne** Kenntnis der Implementierung oder der Doku-Absicht. Er bekommt nur die laufende Seite (bzw. Preview-URL) und die Checkliste aus `functions/qualitaet/blinder-kritiker.md`.
- Er prüft u. a.: Screenreader-Erlebnis (nur Accessibility-Tree, kein visuelles Bild), Tastaturbedienung, Mobile, SEO/GEO, Verständlichkeit der Texte, Konsistenz mit dem Design.
- Jeder Befund wird entweder behoben (neuer Test zuerst!) oder mit Begründung in der Funktionsdoku unter „Offene Fragen" festgehalten.

### 5. Abschluss
- Doku an den tatsächlichen Stand anpassen.
- Commit-Message: `<bereich>: <was>` und Verweis auf die Funktionsdatei.
- PR mit Vercel-Preview-Link; kein Merge auf `main` ohne Eriks OK.

## Definition of Done

- [ ] Funktionsdoku vorhanden und aktuell
- [ ] Alle Akzeptanzkriterien durch Tests abgedeckt, alle grün
- [ ] axe: 0 Verstöße; Tastatur- und Screenreader-Durchlauf ok
- [ ] Mobile (360/768/1280) ok, keine horizontale Scrollbar
- [ ] Lighthouse ≥ 95 in Performance, Accessibility, Best Practices, SEO
- [ ] Meta, Canonical, JSON-LD, Sitemap-Eintrag vorhanden
- [ ] DE und EN vorhanden, `hreflang` korrekt
- [ ] Blinder Kritiker: keine offenen Befunde ohne Begründung
- [ ] Design unverändert (Screenshot-Vergleich)

## Verbote

- Keine Secrets im Code oder in der Doku; Zugangsdaten nur über Umgebungsvariablen (Vercel/Supabase).
- Keine Tests überspringen, deaktivieren oder abschwächen, um grün zu werden.
- Keine Design-Änderung ohne ausdrücklichen Auftrag.
