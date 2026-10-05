import { expect, test } from '@playwright/test';
import { axe, openHydrated } from './helpers';

// functions/seo/staedte-landingpages.md
test('AK-1: erreichbar, in der Sitemap, mit hreflang', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const pairs = [
    ['/webdesign-augsburg', '/en/web-design-augsburg'],
    ['/webdesign-muenchen', '/en/web-design-munich'],
    ['/webdesign-stuttgart', '/en/web-design-stuttgart'],
    ['/webdesign-innsbruck', '/en/web-design-innsbruck'],
    ['/webdesign-kempten', '/en/web-design-kempten'],
  ] as const;
  for (const [path, other] of pairs.flatMap(([de, en]): [string, string][] => [
    [de, `https://erik-bergheimer.de${en}`],
    [en, `https://erik-bergheimer.de${de}`],
  ])) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    const html = await res.text();
    expect(html.match(/<title>([^<]*)<\/title>/)![1]).toMatch(/Augsburg|München|Munich|Stuttgart|Innsbruck|Kempten/);
    expect(html).toContain(`href="${other}"`);
    expect(sitemap).toContain(`https://erik-bergheimer.de${path}`);
  }
});

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`Farbschema ${scheme}`, () => {
    test.use({ colorScheme: scheme });
    for (const path of [
      '/webdesign-augsburg',
      '/en/web-design-munich',
      '/webdesign-innsbruck',
      '/en/web-design-kempten',
      '/webdesign-stuttgart',
    ]) {
      test(`AK-9: ${path} ohne axe-Verstöße und ohne horizontales Scrollen`, async ({ page }) => {
        await openHydrated(page, path);
        expect(await axe(page)).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      });
    }
  });
}
