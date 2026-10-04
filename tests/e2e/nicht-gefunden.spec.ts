import { expect, test } from '@playwright/test';
import { axe } from './helpers';

// functions/seiten/nicht-gefunden.md
const cases = [
  ['/gibt-es-nicht', 'de', 'Seite nicht gefunden | Erik Bergheimer'],
  ['/services/gibt-es-nicht', 'de', 'Seite nicht gefunden | Erik Bergheimer'],
  ['/en/services/does-not-exist', 'en', 'Page not found | Erik Bergheimer'],
  ['/en/projects/does-not-exist', 'en', 'Page not found | Erik Bergheimer'],
] as const;

test('AK-1/AK-3: Status 404, Title, noindex, Sprache', async ({ request }) => {
  for (const [path, lang, title] of cases) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(404);
    const html = await res.text();
    expect(html, path).toContain(`<html lang="${lang}"`);
    expect(html, path).toContain(`<title>${title.replace('&', '&amp;')}</title>`);
    expect(html.match(/<meta name="robots" content="noindex/g), path).toHaveLength(1);
  }
});

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`Farbschema ${scheme}`, () => {
    test.use({ colorScheme: scheme });
    for (const path of ['/gibt-es-nicht', '/en/services/does-not-exist']) {
      test(`AK-5: ${path} ohne axe-Verstöße und ohne horizontales Scrollen`, async ({ page }) => {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        expect(await axe(page)).toEqual([]);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
}
