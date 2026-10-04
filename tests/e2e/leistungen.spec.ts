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
  ['/services/webflow-framer', '/services/webflow-development'],
  ['/services/business-development', '/services/website-process-optimization'],
  ['/en/services/webflow-framer', '/en/services/webflow-development'],
  ['/en/services/business-development', '/en/services/website-process-optimization'],
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
