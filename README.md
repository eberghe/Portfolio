# erik-bergheimer.de

Portfolio von Erik Bergheimer. Next.js + TypeScript, Supabase, Vercel.

**Vor jeder Entwicklung:** [`.claude/skills/portfolio-entwicklung/SKILL.md`](.claude/skills/portfolio-entwicklung/SKILL.md) lesen.
Funktionsbeschreibungen: [`functions/README.md`](functions/README.md).

## Befehle

```bash
npm install
npm run dev         # Entwicklungsserver
npm run lint
npm run typecheck
npm test            # Unit-Tests (Vitest)
npm run test:e2e    # E2E + axe in 360/768/1280 px (Playwright)
```

Ohne Browser-Download (z. B. Cloud-Session): `PLAYWRIGHT_CHROMIUM_PATH=/pfad/zu/chrome npm run test:e2e`.

`portfolio-erikbergheimer.zip` ist die ältere Astro-Version und dient nur als Archiv.
