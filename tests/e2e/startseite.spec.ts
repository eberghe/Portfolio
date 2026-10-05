import { expect, test } from '@playwright/test';
import { axe } from './helpers';

// functions/seiten/startseite.md

test.describe('ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('AK-26: Hero-Überschrift sichtbar ohne JavaScript', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Hey, ich bin Erik' })).toBeVisible();
    await page.goto('/en');
    await expect(page.getByRole('heading', { level: 1, name: "Hey, I'm Erik" })).toBeVisible();
  });
});

test('AK-27/AK-30: Animation endet sichtbar, Uhrzeit ohne Hydration-Fehler', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  await expect
    .poll(() => page.$$eval('h1 [data-word]', (els) => els.every((el) => getComputedStyle(el).opacity === '1')))
    .toBe(true);
  await expect(page.locator('time')).toHaveText(/^\d{2}:\d{2}/);
  expect(errors.filter((e) => /hydrat/i.test(e))).toEqual([]);
});

test('AK-10: Seitentitel je Sprache', async ({ page }) => {
  await page.goto('/');
  const de = await page.title();
  await page.goto('/en');
  expect(await page.title()).not.toBe('');
  expect(de).not.toBe('');
});

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`Farbschema ${scheme}`, () => {
    test.use({ colorScheme: scheme });

    for (const path of ['/', '/en']) {
      test(`AK-9: ${path} ohne axe-Verstöße und ohne horizontales Scrollen`, async ({ page }) => {
        await page.goto(path);
        expect(await axe(page)).toEqual([]);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
}

test('AK-15: fokussierte Elemente verschwinden nicht unter dem Header', async ({ page }) => {
  await page.goto('/');
  const padding = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop));
  expect(padding).toBeGreaterThanOrEqual(64);
});

test('AK-26: h1-Name je Sprache', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Hey, ich bin Erik');
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName("Hey, I'm Erik");
});
