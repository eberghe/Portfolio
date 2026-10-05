import { expect, test, type Page } from '@playwright/test';
import { axe } from './helpers';

// functions/infrastruktur/animationen.md
const opacity = (page: Page, i: number) =>
  page
    .locator('[data-reveal]')
    .nth(i)
    .evaluate((el) => getComputedStyle(el).opacity);

/** Index des ersten [data-reveal]-Elements unterhalb des ersten Bildschirms */
const firstBelowFold = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('[data-reveal]')].findIndex(
      (el) => el.getBoundingClientRect().top > innerHeight + 50,
    ),
  );

test.describe('ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('AK-1: alles sichtbar', async ({ page }) => {
    await page.goto('/');
    const all = await page.$$eval('[data-reveal]', (els) => els.map((el) => getComputedStyle(el).opacity));
    expect(all.length).toBeGreaterThan(2);
    expect(all.every((o) => o === '1')).toBe(true);
  });
});

test.describe('reduzierte Bewegung', () => {
  test.use({ reducedMotion: 'reduce' });
  test('AK-2: alles sofort sichtbar', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
    const all = await page.$$eval('[data-reveal]', (els) =>
      els.map((el) => [getComputedStyle(el).opacity, getComputedStyle(el).transitionDuration]),
    );
    expect(all.every(([o]) => o === '1')).toBe(true);
    expect(all.every(([, d]) => d === '0s')).toBe(true);
  });

  test('AK-5: Sticky-Stapel statisch', async ({ page }) => {
    await page.goto('/');
    const positions = await page.$$eval('.sticky-stack > *', (els) => els.map((el) => getComputedStyle(el).position));
    expect(positions.length).toBeGreaterThan(0);
    expect(positions.some((p) => p === 'sticky')).toBe(false);
  });
});

test.describe('mit Bewegung', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('AK-3/AK-4: Einblenden beim Scrollen', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
    // AK-4: was beim Laden schon im Bild ist, erscheint sofort
    const inView = await page.evaluate(() =>
      [...document.querySelectorAll('[data-reveal]')].findIndex((el) => el.getBoundingClientRect().top < innerHeight),
    );
    if (inView >= 0) await expect.poll(() => opacity(page, inView)).toBe('1');
    const i = await firstBelowFold(page);
    expect(i).toBeGreaterThanOrEqual(0);
    expect(await opacity(page, i)).toBe('0');
    await page.locator('[data-reveal]').nth(i).scrollIntoViewIfNeeded();
    await expect.poll(() => opacity(page, i)).toBe('1');
  });

  test('AK-3: auch nach Client-Navigation', async ({ page }) => {
    await page.goto('/about');
    await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
    await page.locator('header nav a').first().click();
    await page.waitForURL((url) => url.pathname === '/');
    const i = await firstBelowFold(page);
    await page.locator('[data-reveal]').nth(i).scrollIntoViewIfNeeded();
    await expect.poll(() => opacity(page, i)).toBe('1');
  });

  test('AK-5: Sticky-Stapel ab 768 px', async ({ page }, info) => {
    await page.goto('/');
    const positions = await page.$$eval('.sticky-stack > *', (els) => els.map((el) => getComputedStyle(el).position));
    expect(positions.length).toBeGreaterThan(0);
    if (info.project.name === 'mobile-360') expect(positions.some((p) => p === 'sticky')).toBe(false);
    else expect(positions.every((p) => p === 'sticky')).toBe(true);
  });

  test('AK-6: keine axe-Verstöße, kein horizontales Scrollen', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
    // Alles einblenden, damit axe die Endzustände prüft
    for (let y = 0; y < (await page.evaluate(() => document.body.scrollHeight)); y += 500) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
      await page.waitForTimeout(50);
    }
    await page.waitForTimeout(700);
    expect(await axe(page)).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });
});
