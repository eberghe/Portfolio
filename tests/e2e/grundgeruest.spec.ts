import { expect, test } from '@playwright/test';
import { axe } from './helpers';

// functions/infrastruktur/grundgeruest.md
test.describe('Grundgerüst', () => {
  test('AK-1: Inhalt steht ohne JavaScript im HTML', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).toContain('<html lang="de"');
    expect(html).toMatch(/<h1[^>]*>/);
  });

  test('AK-2: genau eine h1 und ein Skip-Link zum Hauptinhalt', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Zum Inhalt springen' });
    await expect(skip).toBeFocused();
    await expect(page.locator('main#inhalt')).toHaveCount(1);
  });

  test('AK-3: keine axe-Verstöße', async ({ page }) => {
    await page.goto('/');
    expect(await axe(page)).toEqual([]);
  });

  test('AK-4: keine horizontale Scrollbar', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('AK-5: Schrift Mona Sans wird selbst gehostet', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (r) => {
      if (!r.url().startsWith('http://localhost')) external.push(r.url());
    });
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.evaluate(() => document.fonts.ready);
    expect(external).toEqual([]);
    const font = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(font).toMatch(/mona/i);
    expect(font).not.toMatch(/Inter/);
  });
});

// functions/infrastruktur/design-tokens.md AK-7
for (const path of [
  '/',
  '/en',
  '/services',
  '/services/accessibility',
  '/projects',
  '/about',
  '/faqs',
  '/contact',
  '/impressum',
  '/datenschutz',
]) {
  test(`design-tokens AK-7: Überschriften fett auf ${path}`, async ({ page }) => {
    await page.goto(path);
    const weights = await page.$$eval('h1, h2, h3, h4', (els) =>
      els.map((el) => ({ text: el.textContent?.slice(0, 40), weight: getComputedStyle(el).fontWeight })),
    );
    expect(weights.length).toBeGreaterThan(0);
    for (const w of weights) expect(w, w.text).toMatchObject({ weight: '700' });
  });

  test(`design-tokens AK-9: Überschriften passen in ihre Spalte auf ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.$$eval('h1, h2, h3, h4', (els) =>
      els.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.textContent?.slice(0, 40)),
    );
    expect(overflow).toEqual([]);
  });
}

// functions/infrastruktur/design-tokens.md AK-11
test.describe('design-tokens AK-11: einheitliche Containerbreite', () => {
  test.use({ viewport: { width: 1600, height: 900 } });
  for (const path of ['/', '/about', '/services', '/services/accessibility', '/projects', '/faqs', '/contact']) {
    test(`Logo, Überschriften und Footer bündig bei 208 px auf ${path}`, async ({ page }, info) => {
      test.skip(info.project.name !== 'desktop-1280', 'nur einmal, bei 1600 px');
      await page.goto(path);
      const left = 208;
      const logo = await page.locator('header nav > a').first().boundingBox();
      expect(Math.round(logo!.x)).toBe(left);
      const footer = await page
        .locator('footer > div')
        .first()
        .evaluate((el) => {
          const cs = getComputedStyle(el);
          return el.getBoundingClientRect().left + parseFloat(cs.paddingLeft);
        });
      expect(Math.round(footer)).toBe(left);
      const lefts = await page.$$eval('main h1, main h2', (els) =>
        els
          .filter((el) => getComputedStyle(el).textAlign !== 'center' && el.getBoundingClientRect().width > 0)
          .map((el) => Math.round(el.getBoundingClientRect().left)),
      );
      expect(lefts.length).toBeGreaterThan(0);
      expect(Math.min(...lefts)).toBe(left);
    });
  }
});
