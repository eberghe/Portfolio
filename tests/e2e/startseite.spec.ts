import { expect, test } from '@playwright/test';
import { axe } from './helpers';

// functions/seiten/startseite.md

test('AK-1: Hero-Überschrift steht ohne JavaScript im HTML', async ({ request }) => {
  expect(await (await request.get('/')).text()).toMatch(/<h1[^>]*>Hi, Ich bin <span[^>]*>Erik/);
  expect(await (await request.get('/en')).text()).toMatch(/<h1[^>]*>Hi, I(&#x27;|')m <span[^>]*>Erik/);
});

test('AK-7: Hero-Foto wird mit Priorität geladen (Preload im <head>)', async ({ request }) => {
  const html = await (await request.get('/')).text();
  expect(html).toMatch(/<link rel="preload" as="image" imageSrcSet="[^"]*hero-erik/);
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
