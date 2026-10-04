import { expect, test, type Page } from '@playwright/test';
import { axe } from './helpers';

// functions/seiten/navigation-und-footer.md
async function ready(page: Page) {
  await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
}

test('AK-3: Sprachlink wechselt auf die englische Seite mit lang="en"', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  await page.getByRole('link', { name: 'English' }).first().click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('AK-4: geschlossenes mobiles Menü ist per Tab nicht erreichbar', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-360', 'nur mobil');
  await page.goto('/');
  await ready(page);
  const burger = page.getByRole('button', { name: 'Menü' });
  await expect(burger).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    const inMenu = await page.evaluate(() => !!document.activeElement?.closest('#mobile-menu'));
    expect(inMenu).toBe(false);
  }
  await burger.click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(burger).toBeFocused();
});

test('AK-5: Dunkelmodus bleibt nach dem Neuladen erhalten, ohne Aufblitzen', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  await page.getByRole('button', { name: 'Dunkelmodus' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
});

test.describe('Systemeinstellung dunkel', () => {
  test.use({ colorScheme: 'dark' });

  test('AK-5: beim ersten Besuch gilt die Systemeinstellung', async ({ page }) => {
    await page.goto('/');
    await ready(page);
    await ready(page);
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`Farbschema ${scheme}`, () => {
    test.use({ colorScheme: scheme });

    test('AK-7: keine axe-Verstöße in Navigation und Footer', async ({ page }) => {
      await page.goto('/');
      await ready(page);
      await ready(page);
      expect(await axe(page, ['header', 'footer'])).toEqual([]);
    });
  });
}

// Befunde des Blinden Kritikers (functions/seiten/navigation-und-footer.md, AK-9 bis AK-14)
test.describe('mobil', () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== 'mobile-360', 'nur mobil');
  });

  test('AK-9: offenes Menü füllt den Bildschirm, Links sind antippbar', async ({ page }) => {
    await page.goto('/');
    await ready(page);
    await ready(page);
    await page.getByRole('button', { name: 'Menü' }).click();
    const box = await page.locator('#mobile-menu').boundingBox();
    const viewport = page.viewportSize()!;
    expect(box!.height).toBeGreaterThanOrEqual(viewport.height - 64 - 1);
    const link = page.locator('#mobile-menu').getByRole('link', { name: 'Projekte' });
    const b = (await link.boundingBox())!;
    await expect
      .poll(() =>
        page.evaluate(
          ([x, y]) => document.elementFromPoint(x!, y!)?.closest('#mobile-menu') !== null,
          [b.x + b.width / 2, b.y + b.height / 2],
        ),
      )
      .toBe(true);
  });

  test('AK-10: Fokus bleibt im offenen Menü', async ({ page }) => {
    await page.goto('/');
    await ready(page);
    await ready(page);
    await page.getByRole('button', { name: 'Menü' }).click();
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => !!document.activeElement?.closest('header, #mobile-menu'));
      expect(inside).toBe(true);
    }
  });

  test('AK-11: Wechsel auf Desktop-Breite schließt das Menü und hebt die Scroll-Sperre auf', async ({ page }) => {
    await page.goto('/');
    await ready(page);
    await ready(page);
    await page.getByRole('button', { name: 'Menü' }).click();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
    await page.setViewportSize({ width: 360, height: 780 });
    await expect(page.getByRole('button', { name: 'Menü' })).toHaveAttribute('aria-expanded', 'false');
  });

  for (const [path, width] of [
    ['/', 320],
    ['/en', 320],
    ['/en', 360],
  ] as const) {
    test(`AK-12: kein horizontales Scrollen auf ${path} bei ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.goto(path);
      await ready(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('AK-13: Icon-Links im Footer sind mobil mindestens 44×44 px groß', async ({ page }) => {
    await page.goto('/');
    await ready(page);
    await ready(page);
    for (const name of ['Instagram', 'E-Mail', 'Nach oben']) {
      const box = (await page.locator('footer').getByRole('link', { name, exact: true }).first().boundingBox())!;
      expect(box.width, name).toBeGreaterThanOrEqual(44);
      expect(box.height, name).toBeGreaterThanOrEqual(44);
    }
  });
});

test('AK-14: „Nach oben" führt ganz nach oben, die Navigation ist sichtbar', async ({ page }) => {
  await page.goto('/');
  await ready(page);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.locator('footer').getByRole('link', { name: 'Nach oben' }).filter({ visible: true }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toBeInViewport();
});

test.describe('dunkel', () => {
  test.use({ colorScheme: 'dark' });

  test('AK-5: color-scheme folgt dem Dunkelmodus', async ({ page }) => {
    await page.goto('/');
    await ready(page);
    await ready(page);
    const scheme = await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
    expect(scheme).toBe('dark');
  });
});

test('AK-16: Menüpunkte brechen nicht um', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile-360', 'Desktop-Navigation');
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
  for (const name of ['Projekte', 'Services', 'Über mich', 'FAQs']) {
    const box = (await nav.getByRole('link', { name, exact: true }).boundingBox())!;
    expect(box.height, name).toBeLessThan(40);
  }
});
