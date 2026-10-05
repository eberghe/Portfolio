import { expect, test } from '@playwright/test';
import { axe } from './helpers';

// functions/seiten/startseite.md

test.describe('ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('AK-26: Hero-Überschrift sichtbar ohne JavaScript, keine halbe Uhrzeile', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Königsbrunn', { exact: true })).toHaveCount(0);
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

test('AK-33: Firmenleiste beginnt im ersten Bildschirm (1280 × 800)', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1280');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const list = page.getByRole('heading', { level: 2, name: 'Unternehmen, für die ich gearbeitet habe' });
  const box = await list.locator('xpath=..').locator('ul').boundingBox();
  expect(box!.y + 60).toBeLessThan(800);
});

test('AK-32/AK-34: Kacheln zentriert, Logos geladen', async ({ page }) => {
  await page.goto('/');
  const aligns = await page.$$eval('#unternehmen ~ ul a', (els) => els.map((el) => getComputedStyle(el).textAlign));
  expect(aligns.every((a) => a === 'center')).toBe(true);
  const logos = page.locator('#unternehmen ~ ul img');
  await expect(logos).toHaveCount(4);
  await expect
    .poll(() => logos.evaluateAll((imgs) => imgs.every((i) => (i as HTMLImageElement).naturalWidth > 0)))
    .toBe(true);
});

test.describe('AK-34: Logos im Dunkelmodus weiß', () => {
  test.use({ colorScheme: 'dark' });
  test('Filter invertiert', async ({ page }) => {
    await page.goto('/');
    const filters = await page.$$eval('#unternehmen ~ ul img', (els) => els.map((el) => getComputedStyle(el).filter));
    expect(filters.every((f) => f.includes('invert(1)'))).toBe(true);
  });
});

test('AK-36: Navigation oben transparent, nach dem Scrollen deckend', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  const bg = () => page.locator('header').evaluate((el) => getComputedStyle(el).backgroundColor);
  await expect.poll(bg).toBe('rgba(0, 0, 0, 0)');
  // Der Hero (mit Verlauf) beginnt ganz oben, unter der Navigation
  const heroTop = await page
    .locator('main section')
    .first()
    .evaluate((el) => el.getBoundingClientRect().top);
  expect(heroTop).toBe(0);
  await page.mouse.wheel(0, 400);
  await page.mouse.wheel(0, -200);
  await expect.poll(bg).not.toBe('rgba(0, 0, 0, 0)');
  await page.goto('/about');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  expect(await bg()).not.toBe('rgba(0, 0, 0, 0)');
});
