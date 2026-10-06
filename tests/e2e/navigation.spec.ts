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
    await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe('');
    await page.setViewportSize({ width: 360, height: 780 });
    await expect(page.getByRole('button', { name: 'Menü' })).toHaveAttribute('aria-expanded', 'false');
  });

  test('AK-18: Menü auf gescrollter Seite: Kopfzeile sichtbar, Position bleibt', async ({ page }) => {
    await page.goto('/about');
    await ready(page);
    await page.evaluate(() => scrollTo({ top: 2000, behavior: 'instant' }));
    const burger = page.getByRole('button', { name: 'Menü' });
    const before = await page.evaluate(() => scrollY);
    // dispatchEvent statt click: Playwright würde sonst selbst zum Knopf scrollen
    await burger.dispatchEvent('click');
    await expect.poll(async () => (await page.locator('header').boundingBox())!.y).toBeGreaterThanOrEqual(-1);
    await expect(burger).toBeInViewport();
    await page.mouse.wheel(0, 600);
    await page.keyboard.press('Escape');
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
    expect(Math.abs((await page.evaluate(() => scrollY)) - before)).toBeLessThan(10);
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
  for (const name of ['Projekte', 'Leistungen', 'Über mich', 'FAQs']) {
    const box = (await nav.getByRole('link', { name, exact: true }).boundingBox())!;
    expect(box.height, name).toBeLessThan(40);
  }
});

for (const path of [
  '/',
  '/projects',
  '/services',
  '/about',
  '/faqs',
  '/en',
  '/en/projects',
  '/en/services',
  '/en/about',
  '/en/faqs',
]) {
  test(`AK-17: Kopfzeile passt ins Fenster auf ${path}`, async ({ page }, info) => {
    test.skip(info.project.name === 'mobile-360', 'Desktop-Navigation');
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.$eval('header nav', (el) => el.scrollWidth - el.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

for (const from of ['/about', '/services', '/en/about']) {
  test(`AK-18: Logo öffnet die Startseite oben (von ${from})`, async ({ page }) => {
    await page.goto(from);
    await page.locator('html[data-hydrated]').waitFor();
    await page.locator('header nav a').first().click();
    await page.waitForURL(from.startsWith('/en') ? '**/en' : (url) => url.pathname === '/');
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  });
}

test('AK-19/AK-20: Footer-Leistungen antippbar, aktuelle Seite markiert', async ({ page }, info) => {
  await page.goto('/services/accessibility');
  const nav = page.getByRole('navigation', { name: 'Leistungen' });
  const heights = await nav.getByRole('link').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
  for (const h of heights) expect(h).toBeGreaterThanOrEqual(info.project.name === 'mobile-360' ? 44 : 24);
  const current = nav.locator('a[aria-current="page"]');
  await expect(current).toHaveCount(1);
  const style = await current.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { color: cs.color, line: cs.textDecorationLine };
  });
  expect(style.color).toBe('rgb(255, 255, 255)');
  expect(style.line).toContain('underline');
});

test.describe('ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('AK-21: Dunkelmodus-Button nur mit JavaScript', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Dunkelmodus' })).toHaveCount(0);
  });
});

test('AK-21: Dunkelmodus-Button mit JavaScript sichtbar', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Dunkelmodus' })).toBeVisible();
});

test.describe('Mobilmenü ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('AK-22: Link „Menü“ springt zur Footer-Navigation', async ({ page }, info) => {
    await page.goto('/about');
    const header = page.locator('header');
    await expect(header.getByRole('button', { name: 'Menü' })).toHaveCount(0);
    const link = header.getByRole('link', { name: 'Menü' });
    if (info.project.name !== 'mobile-360') {
      await expect(link).toBeHidden();
      return;
    }
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '#footer-nav');
    await expect(page.locator('#footer-nav')).toBeVisible();
  });
});

test('AK-22: mit JavaScript Burger statt Link', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile-360', 'nur mobil');
  await page.goto('/about');
  const header = page.locator('header');
  await expect(header.getByRole('button', { name: 'Menü' })).toBeVisible();
  await expect(header.getByRole('link', { name: 'Menü' })).toBeHidden();
});

for (const [path, label] of [
  ['/about', 'Ortszeit in Augsburg'],
  ['/en', 'Local time in Augsburg'],
] as const) {
  test(`AK-23: Ortszeit Augsburg im Footer (${path})`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(path);
    const footer = page.locator('footer');
    await expect(footer.locator('time')).toHaveText(/^\d{2}:\d{2}/);
    await expect(footer).toContainText('Augsburg');
    await expect(footer).toContainText(label);
    await expect(page.getByText('Königsbrunn', { exact: true })).toHaveCount(0);
    expect(errors.filter((e) => /hydrat/i.test(e))).toEqual([]);
  });
}
