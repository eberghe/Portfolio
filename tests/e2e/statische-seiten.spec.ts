import { expect, test } from '@playwright/test';
import { axe } from './helpers';

// functions/seiten/rechtliches.md, faq.md, ueber-mich.md
const pages = ['/impressum', '/datenschutz', '/faqs', '/about'];

test('AK-1: Seiten erreichbar mit eigenem Title, Rechtliches noindex', async ({ request }) => {
  const titles = new Set<string>();
  for (const prefix of ['', '/en'])
    for (const p of pages) {
      const res = await request.get(prefix + p);
      expect(res.status(), prefix + p).toBe(200);
      const html = await res.text();
      titles.add(html.match(/<title>([^<]*)<\/title>/)![1]!);
      const noindex = /<meta name="robots" content="noindex/.test(html);
      expect(noindex, prefix + p).toBe(p === '/impressum' || p === '/datenschutz');
    }
  expect(titles.size).toBe(pages.length * 2);
});

test('faq AK-2/AK-5: Fragen per Tastatur aufklappbar', async ({ page }) => {
  await page.goto('/faqs');
  const first = page.locator('summary').first();
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).not.toHaveAttribute('open', '');
});

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`Farbschema ${scheme}`, () => {
    test.use({ colorScheme: scheme });
    for (const path of [...pages, '/en/about', '/en/faqs']) {
      test(`AK-5/AK-7: ${path} ohne axe-Verstöße und ohne horizontales Scrollen`, async ({ page }) => {
        await page.goto(path);
        expect(await axe(page)).toEqual([]);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
}

test('faq AK-6: Fokusrahmen der Fragen 2 px', async ({ page }) => {
  await page.goto('/faqs');
  await page.locator('summary').first().focus();
  // Tastaturfokus erzwingen, damit :focus-visible greift
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  const width = await page.evaluate(() => parseFloat(getComputedStyle(document.activeElement!).outlineWidth));
  expect(width).toBeGreaterThanOrEqual(2);
});
