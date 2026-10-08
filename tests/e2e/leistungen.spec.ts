import { expect, test } from '@playwright/test';
import { services } from '../../lib/content/services';
import { axe } from './helpers';

// functions/seiten/leistungen.md

test('AK-1: alle Seiten statisch erreichbar mit eigenem Title', async ({ request }) => {
  const titles = new Set<string>();
  for (const prefix of ['', '/en']) {
    const overview = await request.get(`${prefix}/services`);
    expect(overview.status()).toBe(200);
    for (const s of services) {
      const res = await request.get(`${prefix}/services/${s.slug}`);
      expect(res.status(), s.slug).toBe(200);
      const title = (await res.text()).match(/<title>([^<]*)<\/title>/)?.[1];
      expect(title).toBeTruthy();
      titles.add(title!);
    }
  }
  expect(titles.size).toBe(services.length * 2);
});

test('AK-3: JSON-LD Service im HTML', async ({ request }) => {
  const html = await (await request.get('/services/accessibility')).text();
  const json = html.match(/<script type="application\/ld\+json">([^<]*)<\/script>/)?.[1];
  expect(JSON.parse(json!)['@type']).toBe('Service');
});

for (const [from, to] of [
  // AK-39: Webflow-Entwicklung heißt jetzt Webdesign & Webentwicklung
  ['/services/webflow-framer', '/services/web-design-development'],
  ['/services/webflow-development', '/services/web-design-development'],
  ['/en/services/webflow-development', '/en/services/web-design-development'],
  ['/services/business-development', '/services/website-process-optimization'],
  ['/en/services/webflow-framer', '/en/services/web-design-development'],
  ['/en/services/business-development', '/en/services/website-process-optimization'],
  // AK-28: Fotografie ist keine Leistung mehr, die Fotoserien stehen bei den Projekten
  ['/services/photography', '/projects'],
  ['/en/services/photography', '/en/projects'],
] as const) {
  test(`AK-4: ${from} leitet dauerhaft weiter`, async ({ request }) => {
    const res = await request.get(from, { maxRedirects: 0 });
    expect([301, 308]).toContain(res.status());
    expect(res.headers()['location']).toBe(to);
  });
}

test('AK-5: unbekannte Leistung liefert 404', async ({ request }) => {
  expect((await request.get('/services/gibt-es-nicht')).status()).toBe(404);
});

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`Farbschema ${scheme}`, () => {
    test.use({ colorScheme: scheme });
    for (const path of ['/services', '/services/accessibility', '/en/services/ux-ui-design']) {
      test(`AK-7: ${path} ohne axe-Verstöße und ohne horizontales Scrollen`, async ({ page }) => {
        await page.goto(path);
        expect(await axe(page)).toEqual([]);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
}

test('AK-15: Fokusrahmen beim Tab sofort 2 px breit', async ({ page }) => {
  await page.goto('/services');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  const narrow: string[] = [];
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const s = getComputedStyle(el);
      const visible = el.getBoundingClientRect().width > 0;
      return { name: el.textContent?.trim().slice(0, 30) ?? '', width: parseFloat(s.outlineWidth), visible };
    });
    if (r.visible && r.width < 2) narrow.push(r.name);
  }
  expect(narrow).toEqual([]);
});

test('AK-30: Sprunglink scrollt zum Abschnitt, nicht unter die Navigation', async ({ page }) => {
  await page.goto('/services');
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  await page.getByRole('navigation', { name: 'Leistungen auf dieser Seite' }).getByRole('link').nth(3).click();
  await expect(page).toHaveURL(/#ai-consulting$/);
  const heading = page.locator('section#ai-consulting h2');
  await expect.poll(async () => Math.round((await heading.boundingBox())!.y)).toBeGreaterThanOrEqual(64);
  await expect.poll(async () => (await heading.boundingBox())!.y).toBeLessThan(400);
});

test('AK-32: Vollbild über die ganze Breite', async ({ page }) => {
  await page.goto('/services');
  const img = page.locator('[data-fullbleed]').first();
  const box = (await img.boundingBox())!;
  const vw = page.viewportSize()!.width;
  expect(Math.round(box.width)).toBe(vw);
  expect(box.height).toBeGreaterThanOrEqual(240);
});

// AK-43: echte Leistungsbilder in Qualität 90, auf Übersicht und Startseite
for (const path of ['/services', '/']) {
  test(`AK-43: Leistungsbilder auf ${path} mit Qualität 90`, async ({ page }) => {
    await page.goto(path);
    const imgs = page.locator('img[src*="%2Fimages%2Fservices%2F"]');
    await expect(imgs.first()).toBeAttached();
    const srcs = await imgs.evaluateAll((els) =>
      els.map((el) => (el as HTMLImageElement).currentSrc || el.getAttribute('src')!),
    );
    expect(srcs.length).toBeGreaterThanOrEqual(3);
    for (const src of srcs) expect(src).toContain('q=90');
  });
}

// AK-43: auch Projekt-Thumbnails und Fotos in Qualität 90
for (const path of ['/projects', '/about', '/faqs']) {
  test(`AK-43: Fotos auf ${path} mit Qualität 90`, async ({ page }) => {
    await page.goto(path);
    const srcs = await page
      .locator('img[src*="/_next/image"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('src')!));
    // Werkzeug-Logos sind kleine Marken in 128 px, die bleiben bei der Standardqualität
    const photos = srcs.filter((src) => !src.includes('%2Fimages%2Flogos%2F'));
    expect(photos.length).toBeGreaterThan(0);
    for (const src of photos) expect(src).toContain('q=90');
  });
}

// AK-43: In der Leistungsliste der Startseite hat der Rahmen echter Bilder das Seitenverhältnis des Bilds (nichts beschnitten)
test('AK-43: Leistungsbilder auf der Startseite unbeschnitten', async ({ page }) => {
  await page.goto('/');
  const frames = page.locator('[data-service-media]:not([aria-hidden="true"])');
  expect(await frames.count()).toBeGreaterThanOrEqual(3);
  for (const box of await frames.evaluateAll((els) => els.map((el) => el.getBoundingClientRect())))
    expect(Math.abs(box.width / box.height - 16 / 9)).toBeLessThan(0.02);
});
