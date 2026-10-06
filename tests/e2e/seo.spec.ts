import { expect, test } from '@playwright/test';

// functions/seo/meta-und-schema.md, functions/seo/sitemap-und-redirects.md
const base = 'https://erik-bergheimer.de';

const attr = (html: string, re: RegExp) => html.match(re)?.[1];

test('meta AK-1: Canonical, hreflang und Open Graph im HTML', async ({ request }) => {
  for (const path of ['/', '/en', '/services', '/en/services/accessibility', '/projects/cpr', '/en/projects']) {
    const html = await (await request.get(path)).text();
    // Next.js schreibt die Startseite ohne Schrägstrich (gleiche URL)
    const self = path === '/' ? base : `${base}${path}`;
    expect(attr(html, /<link rel="canonical" href="([^"]+)"/), path).toBe(self);
    expect(html, path).toMatch(/<link rel="alternate" hrefLang="de" href="[^"]+"/);
    expect(html, path).toMatch(/<link rel="alternate" hrefLang="en" href="[^"]+"/);
    expect(html, path).toMatch(/<link rel="alternate" hrefLang="x-default" href="[^"]+"/);
    for (const prop of ['og:title', 'og:description', 'og:url', 'og:image', 'og:locale'])
      expect(html, `${path} ${prop}`).toContain(`property="${prop}"`);
    expect(html, path).toContain('name="twitter:card"');
  }
});

test('sitemap AK-1: jede URL der Sitemap liefert 200 mit eindeutigem Title', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
  expect(locs.length).toBeGreaterThan(20);
  const titles = new Set<string>();
  for (const loc of locs) {
    const res = await request.get(loc.replace(base, ''));
    expect(res.status(), loc).toBe(200);
    titles.add((await res.text()).match(/<title>([^<]*)<\/title>/)![1]!);
  }
  expect(titles.size).toBe(locs.length);
});

test('sitemap AK-2 und meta AK-5: robots.txt und llms.txt', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain(`Sitemap: ${base}/sitemap.xml`);
  expect(robots).toContain('Disallow: /projekt-');
  const llms = await request.get('/llms.txt');
  expect(llms.status()).toBe(200);
  expect(llms.headers()['content-type']).toContain('text/plain');
  expect(await llms.text()).toContain(`${base}/services/accessibility`);
});

test('meta-und-schema AK-12: Favicon und Apple-Touch-Icon', async ({ page, request }) => {
  for (const path of ['/', '/en/about']) {
    await page.goto(path);
    const icon = await page.locator('head link[rel="icon"][type="image/png"]').first().getAttribute('href');
    const apple = await page.locator('head link[rel="apple-touch-icon"]').first().getAttribute('href');
    expect(icon).toBeTruthy();
    expect(apple).toBeTruthy();
    for (const href of [icon!, apple!]) {
      const res = await request.get(href);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('image/png');
    }
  }
  const ico = await request.get('/favicon.ico');
  expect(ico.status()).toBe(200);
});
