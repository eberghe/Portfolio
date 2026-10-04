import { expect, test } from '@playwright/test';
import { projects } from '../../lib/content/projects';
import { axe, openHydrated } from './helpers';

// functions/seiten/projekte.md

test('AK-1: alle Projektseiten statisch erreichbar mit eigenem Title', async ({ request }) => {
  const titles = new Set<string>();
  for (const prefix of ['', '/en']) {
    expect((await request.get(`${prefix}/projects`)).status()).toBe(200);
    for (const p of projects) {
      const res = await request.get(`${prefix}/projects/${p.slug}`);
      expect(res.status(), p.slug).toBe(200);
      titles.add((await res.text()).match(/<title>([^<]*)<\/title>/)![1]!);
    }
  }
  expect(titles.size).toBe(projects.length * 2);
  expect((await request.get('/projects/gibt-es-nicht')).status()).toBe(404);
});

test('AK-5: Lightbox ist ein modaler Dialog mit Tastaturbedienung', async ({ page }) => {
  await openHydrated(page, '/projects/indonesia');
  const trigger = page.getByRole('button', { name: /Bild 2 von 7/ });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Bild 2 von 7' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('dialog', { name: 'Bild 3 von 7' })).toBeVisible();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`Farbschema ${scheme}`, () => {
    test.use({ colorScheme: scheme });
    for (const path of ['/projects', '/projects/cpr', '/en/projects/indonesia', '/projects/webflow']) {
      test(`AK-9: ${path} ohne axe-Verstöße und ohne horizontales Scrollen`, async ({ page }) => {
        await openHydrated(page, path);
        expect(await axe(page)).toEqual([]);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }

    test('AK-9: geöffnete Lightbox ohne axe-Verstöße', async ({ page }) => {
      await openHydrated(page, '/en/projects/morocco');
      await page.getByRole('button', { name: /image 1 of 6/i }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      expect(await axe(page)).toEqual([]);
    });
  });
}
