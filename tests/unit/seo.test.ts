import { describe, expect, it } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { projects } from '@/lib/content/projects';
import { services } from '@/lib/content/services';
import { llmsTxt } from '@/lib/llms';
import { sitePaths } from '@/lib/routes';
import { homeJsonLd, pageMetadata } from '@/lib/seo';

// functions/seo/meta-und-schema.md, functions/seo/sitemap-und-redirects.md
const base = 'https://erik-bergheimer.de';

describe('meta-und-schema AK-1: pageMetadata', () => {
  const meta = pageMetadata({
    path: '/services/accessibility',
    locale: 'en',
    title: 'Accessibility consulting – Service | Erik Bergheimer',
    description: 'WCAG audits.',
  });

  it('Canonical und hreflang', () => {
    expect(meta.alternates?.canonical).toBe(`${base}/en/services/accessibility`);
    expect(meta.alternates?.languages).toEqual({
      de: `${base}/services/accessibility`,
      en: `${base}/en/services/accessibility`,
      'x-default': `${base}/services/accessibility`,
    });
  });

  it('Open Graph und Twitter', () => {
    expect(meta.openGraph).toMatchObject({
      title: 'Accessibility consulting – Service | Erik Bergheimer',
      description: 'WCAG audits.',
      url: `${base}/en/services/accessibility`,
      locale: 'en_US',
      alternateLocale: ['de_DE'],
      siteName: 'Erik Bergheimer',
    });
    const images = meta.openGraph?.images;
    expect(JSON.stringify(images)).toContain('/images/hero-erik.png');
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it('Startseite: Canonical ohne Schrägstrich am Ende der EN-URL', () => {
    expect(pageMetadata({ path: '/', locale: 'en', title: 't', description: 'd' }).alternates?.canonical).toBe(
      `${base}/en`,
    );
    expect(pageMetadata({ path: '/', locale: 'de', title: 't', description: 'd' }).alternates?.canonical).toBe(
      `${base}/`,
    );
  });

  it('eigenes Vorschaubild', () => {
    const m = pageMetadata({ path: '/projects/cpr', locale: 'de', title: 't', description: 'd', image: '/x.png' });
    expect(JSON.stringify(m.openGraph?.images)).toContain('/x.png');
  });
});

describe('meta-und-schema AK-2: Startseite JSON-LD', () => {
  it('Person und ProfessionalService mit Orten', () => {
    const graph = homeJsonLd('de')['@graph'];
    expect(graph.map((n) => n['@type'])).toEqual(['Person', 'ProfessionalService']);
    const names = JSON.stringify(graph[1]);
    for (const n of ['Augsburg', 'Innsbruck', 'Deutschland', 'Österreich']) expect(names).toContain(n);
  });
});

describe('sitemap AK-1', () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  it('jede Seite in DE und EN genau einmal', () => {
    expect(new Set(urls).size).toBe(urls.length);
    for (const s of services) {
      expect(urls).toContain(`${base}/services/${s.slug}`);
      expect(urls).toContain(`${base}/en/services/${s.slug}`);
    }
    for (const p of projects) expect(urls).toContain(`${base}/en/projects/${p.slug}`);
    expect(urls.length).toBe(sitePaths().length * 2);
  });

  it('mit hreflang-Alternativen', () => {
    const e = entries.find((x) => x.url === `${base}/projects/cpr`)!;
    expect(e.alternates?.languages).toEqual({ de: `${base}/projects/cpr`, en: `${base}/en/projects/cpr` });
  });
});

describe('sitemap AK-2: robots', () => {
  it('erlaubt Crawling, sperrt Angebotsseiten, nennt Sitemap', () => {
    const r = robots();
    expect(r.sitemap).toBe(`${base}/sitemap.xml`);
    expect(r.rules).toMatchObject({ userAgent: '*', allow: '/', disallow: '/projekt-' });
  });
});

describe('meta-und-schema AK-5: llms.txt', () => {
  it('alle Leistungen und Projekte mit absoluten Links in beiden Sprachen', () => {
    const txt = llmsTxt();
    expect(txt.startsWith('# Erik Bergheimer')).toBe(true);
    for (const s of services) {
      expect(txt).toContain(`(${base}/services/${s.slug})`);
      expect(txt).toContain(`(${base}/en/services/${s.slug})`);
    }
    for (const p of projects) expect(txt).toContain(`(${base}/projects/${p.slug})`);
    expect(txt).not.toContain('webflow-framer');
  });
});
