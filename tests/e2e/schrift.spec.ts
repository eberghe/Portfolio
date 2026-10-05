import { expect, test } from '@playwright/test';

// functions/infrastruktur/design-tokens.md AK-10 (Issue #28)
for (const motion of ['no-preference', 'reduce'] as const) {
  test.describe(`Bewegung ${motion}`, () => {
    test.use({ reducedMotion: motion });
    for (const path of ['/', '/en', '/about']) {
      test(`AK-10: kein Layout-Sprung beim Laden der Schrift auf ${path}`, async ({ page }, info) => {
        test.skip(info.project.name === 'tablet-768');
        await page.addInitScript(() => {
          (window as unknown as { cls: number }).cls = 0;
          new PerformanceObserver((list) => {
            for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
              if (!e.hadRecentInput) (window as unknown as { cls: number }).cls += e.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
        });
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(2000);
        const cls = await page.evaluate(() => (window as unknown as { cls: number }).cls);
        expect(cls).toBeLessThan(0.1);
      });
    }
  });
}
