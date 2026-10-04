# Teststrategie

| Ebene | Werkzeug | Was |
|---|---|---|
| Unit/Komponente | Vitest + Testing Library | Logik, Komponenten, Validierung |
| E2E | Playwright (360/768/1280) | Seitenabläufe, Formulare, Redirects |
| A11y | @axe-core/playwright | jede Seite, jeder Viewport |
| Visuell | Playwright Screenshots | Design bleibt unverändert |
| SEO/Performance | Lighthouse CI | Scores ≥ 95 |
| Daten | Supabase lokal + Tests | RLS-Regeln |

Testnamen tragen die AK-Nummer der Funktionsdoku. CI (GitHub Actions) führt alles bei jedem PR aus.
