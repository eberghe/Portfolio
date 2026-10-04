import { expect, test } from '@playwright/test';
import { axe } from './helpers';

// functions/seiten/startseite.md

test('AK-1: Hero-Überschrift steht ohne JavaScript im HTML', async ({ request }) => {
  expect(await (await request.get('/')).text()).toMatch(/<h1[^>]*>Hi, ich bin <span[^>]*>Erik/);
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

test('AK-14: Hero-Foto wird scharf geladen (Quelle mindestens so groß wie die Fläche)', async ({ page }) => {
  await page.goto('/');
  const img = page.getByRole('img', { name: /Erik Bergheimer/ });
  await expect(img).toBeVisible();
  await expect
    .poll(() =>
      img.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth >= Math.max(el.clientWidth, el.clientHeight) * 0.95,
      ),
    )
    .toBe(true);
});

test('AK-15: fokussierte Elemente verschwinden nicht unter dem Header', async ({ page }) => {
  await page.goto('/');
  const padding = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop));
  expect(padding).toBeGreaterThanOrEqual(64);
});
