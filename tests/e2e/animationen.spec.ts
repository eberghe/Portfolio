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

  test('AK-13: Stapel behält am Ende seinen Versatz', async ({ page }, info) => {
    test.skip(info.project.name === 'mobile-360', 'Stapel erst ab 768 px');
    for (const path of ['/', '/services/accessibility']) {
      await page.goto(path);
      const lists = page.locator('ol.sticky-stack');
      for (let n = 0; n < (await lists.count()); n++) {
        const list = lists.nth(n);
        // Liste so weit scrollen, dass ihr Ende die gestapelte letzte Karte schon 100 px nach oben schiebt
        await list.evaluate((el) => {
          const last = el.lastElementChild as HTMLElement;
          const stuckBottom = 96 + (el.children.length - 1) * 16 + last.offsetHeight;
          window.scrollTo({
            top: window.scrollY + el.getBoundingClientRect().bottom - (stuckBottom - 100),
            behavior: 'instant',
          });
        });
        const tops = await list.evaluate((el) => [...el.children].map((c) => c.getBoundingClientRect().top));
        for (let i = 1; i < tops.length; i++)
          expect(tops[i]! - tops[i - 1]!, `${path} Liste ${n} Karte ${i}`).toBeGreaterThanOrEqual(12);
      }
    }
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

// Ladeanimation und weiches Scrollen (AK-7 bis AK-9). Unter Testautomatisierung sind beide nur mit
// ?animationstest aktiv, damit die übrigen Tests nicht auf die Ladefläche warten müssen.
test('AK-7: Ladefläche beim ersten Aufruf, danach weg und in derselben Sitzung nicht wieder', async ({ page }) => {
  await page.goto('/?animationstest');
  await expect(page.locator('html')).toHaveClass(/\bpreload\b/);
  const loader = page.locator('[data-preloader]');
  await expect(loader).toBeVisible();
  await page.waitForTimeout(2000);
  await expect(loader).toBeHidden();
  expect(await loader.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe('none');
  await page.goto('/about?animationstest');
  await expect(page.locator('html')).not.toHaveClass(/\bpreload\b/);
  await expect(page.locator('[data-preloader]')).toBeHidden();
});

test.describe('AK-8: reduzierte Bewegung', () => {
  test.use({ reducedMotion: 'reduce' });
  test('keine Ladefläche, kein weiches Scrollen', async ({ page }) => {
    await page.goto('/?animationstest');
    await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
    await expect(page.locator('html')).not.toHaveClass(/\bpreload\b/);
    await expect(page.locator('[data-preloader]')).toBeHidden();
    await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
  });
});

test.describe('AK-8: ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('keine Ladefläche', async ({ page }) => {
    await page.goto('/?animationstest');
    await expect(page.locator('[data-preloader]')).toBeHidden();
  });
});

test('AK-9: weiches Scrollen aktiv, Skip-Link funktioniert', async ({ page }) => {
  await page.goto('/about?animationstest');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  await expect(page.locator('html')).toHaveClass(/\blenis\b/);
  await page.waitForTimeout(1700);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('#inhalt')).toBeFocused();
});

test.describe('Alles blendet ein', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('AK-10/AK-11: Absätze und Bausteine blenden ein, nicht verschachtelt', async ({ page }) => {
    await page.goto('/about?animationstest');
    await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
    await page.waitForTimeout(1800);
    const below = page.locator('main p').filter({ hasNotText: /^$/ }).last();
    const reveal = (await below.evaluate((el) => el.closest('[data-reveal]') !== null)) as boolean;
    expect(reveal).toBe(true);
    const host = below.locator('xpath=ancestor-or-self::*[@data-reveal][1]');
    await expect.poll(() => host.evaluate((el) => getComputedStyle(el).opacity)).toBe('0');
    await below.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await expect.poll(() => host.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');

    const intro = page.locator('main p').first();
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await expect.poll(() => intro.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');

    for (const path of ['/about?animationstest', '/leistungen?animationstest', '/?animationstest']) {
      await page.goto(path);
      await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
      const missing = await page.$$eval('main :is(p, h2, h3, li, img)', (els) =>
        els
          .filter(
            (el) => !el.closest('[aria-hidden="true"], [data-no-reveal], .hero-word, .hero-rise, [data-journey] ol'),
          )
          .filter((el) => !el.closest('[data-reveal]'))
          .map((el) => el.outerHTML.slice(0, 80)),
      );
      expect(missing, path).toEqual([]);
    }
    const nested = await page.$$eval('[data-reveal] [data-reveal]', (els) => els.length);
    expect(nested).toBe(0);
    const chrome = await page.$$eval('header [data-reveal], footer [data-reveal]', (els) => els.length);
    expect(chrome).toBe(0);
  });
});

test.describe('Hero-Einstieg', () => {
  for (const motion of ['no-preference', 'reduce'] as const) {
    test.describe(motion, () => {
      test.use({ reducedMotion: motion });
      for (const path of ['/', '/about']) {
        test(`AK-12: ${path} Bausteine unter der h1 steigen gestaffelt ein`, async ({ page }) => {
          await page.goto(`${path}?animationstest`);
          const rise = page.locator('main .hero-rise');
          // Startseite: Randnotiz und Absatz (Medien-Plätze haben eine eigene Animation, startseite.md AK-47)
          expect(await rise.count()).toBeGreaterThanOrEqual(2);
          const names = await rise.evaluateAll((els) => els.map((el) => getComputedStyle(el).animationName));
          if (motion === 'reduce') {
            expect(names.every((n) => n === 'none')).toBe(true);
            return;
          }
          expect(names.every((n) => n === 'hero-rise-in')).toBe(true);
          const delays = await rise.evaluateAll((els) => els.map((el) => getComputedStyle(el).animationDelay));
          expect(new Set(delays).size).toBeGreaterThanOrEqual(Math.min(3, delays.length));
          await expect
            .poll(() => rise.evaluateAll((els) => els.every((el) => getComputedStyle(el).opacity === '1')), {
              timeout: 5000,
            })
            .toBe(true);
        });
      }
    });
  }
});
