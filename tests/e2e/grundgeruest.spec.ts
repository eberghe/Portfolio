import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// functions/infrastruktur/grundgeruest.md
test.describe('Grundgerüst', () => {
  test('AK-1: Inhalt steht ohne JavaScript im HTML', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).toContain('<html lang="de"');
    expect(html).toMatch(/<h1[^>]*>[^<]*Erik Bergheimer/);
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
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('AK-4: keine horizontale Scrollbar', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('AK-5: Schrift Inter wird selbst gehostet', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (r) => {
      if (!r.url().startsWith('http://localhost')) external.push(r.url());
    });
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.evaluate(() => document.fonts.ready);
    expect(external).toEqual([]);
    const font = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(font).toMatch(/Inter/);
  });
});
