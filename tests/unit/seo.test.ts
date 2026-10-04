import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { projects } from '@/lib/content/projects';
import { services } from '@/lib/content/services';
import { llmsTxt } from '@/lib/llms';
import { sitePaths } from '@/lib/routes';
import { homeJsonLd, pageMetadata } from '@/lib/seo';
import { homeContent } from '@/lib/content/home';
import { serviceMetadata } from '@/lib/pages/services';
import { projectJsonLd, serviceJsonLd } from '@/lib/structured-data';

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
      locale: 'en_GB',
      alternateLocale: ['de_DE'],
      siteName: 'Erik Bergheimer',
    });
    const images = meta.openGraph?.images;
    expect(JSON.stringify(images)).toContain('/images/og-erik.jpg');
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it('Startseite: Canonical ohne Schrägstrich am Ende der EN-URL', () => {
    expect(pageMetadata({ path: '/', locale: 'en', title: 't', description: 'd' }).alternates?.canonical).toBe(
      `${base}/en`,
    );
    expect(pageMetadata({ path: '/', locale: 'de', title: 't', description: 'd' }).alternates?.canonical).toBe(base);
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
    for (const n of ['Augsburg', 'Deutschland']) expect(names).toContain(n);
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
    expect(e.alternates?.languages).toEqual({
      de: `${base}/projects/cpr`,
      en: `${base}/en/projects/cpr`,
      'x-default': `${base}/projects/cpr`,
    });
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

describe('meta-und-schema AK-6: eine Form je URL', () => {
  it('Startseite ohne Schrägstrich in Sitemap und JSON-LD', () => {
    expect(sitemap().map((e) => e.url)).toContain(base);
    expect(sitemap().map((e) => e.url)).not.toContain(`${base}/`);
    expect(JSON.stringify(homeJsonLd('de'))).not.toContain(`"${base}/"`);
  });
});

describe('meta-und-schema AK-7: verknüpfte Entitäten', () => {
  it('Person mit @id, E-Mail, Ausbildung, Sprachen, Orten', () => {
    const p = homeJsonLd('de')['@graph'][0] as Record<string, unknown>;
    expect(p['@id']).toBe(`${base}/#person`);
    expect(p.email).toMatch(/@/);
    expect(JSON.stringify(p.alumniOf)).toContain('Ingolstadt');
    expect(p.knowsLanguage).toEqual(['de', 'en']);
    expect(JSON.stringify(p.workLocation)).toContain('Augsburg');
    expect((homeJsonLd('de')['@graph'][1] as Record<string, unknown>).email).toMatch(/@/);
  });

  it('Service und CreativeWork verweisen auf dieselbe Person', () => {
    expect(serviceJsonLd(services[0]!, 'en').provider['@id']).toBe(`${base}/#person`);
    expect(projectJsonLd(projects[0]!, 'de').author['@id']).toBe(`${base}/#person`);
  });
});

describe('meta-und-schema AK-8: Vorschaubild und Typ', () => {
  it('og-Bild 1200 × 630, höchstens 300 KB', () => {
    const buf = readFileSync(resolve(process.cwd(), 'public/images/og-erik.jpg'));
    expect(buf.length).toBeLessThanOrEqual(300 * 1024);
    // JPEG SOF0/SOF2: Höhe und Breite nach dem Marker
    let i = 2;
    while (i < buf.length && !(buf[i] === 0xff && (buf[i + 1] === 0xc0 || buf[i + 1] === 0xc2))) i++;
    expect([buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)]).toEqual([1200, 630]);
  });

  it('Projekte sind Artikel', () => {
    const m = pageMetadata({ path: '/projects/cpr', locale: 'de', title: 't', description: 'd', type: 'article' });
    expect(m.openGraph).toMatchObject({ type: 'article' });
  });
});

describe('meta-und-schema AK-9: Startseite und Leistungen', () => {
  it.each(['de', 'en'] as const)('Startseite (%s)', (l) => {
    expect(homeContent[l].metaTitle.length).toBeLessThanOrEqual(60);
    const d = homeContent[l].metaDescription;
    expect(d.length).toBeGreaterThanOrEqual(120);
    expect(d.length).toBeLessThanOrEqual(160);
    expect(d).toMatch(l === 'de' ? /Erstgespräch/ : /intro call/);
  });

  it.each(services.flatMap((s) => (['de', 'en'] as const).map((l) => [s.slug, l] as const)))(
    'Leistung %s (%s) nennt Ort',
    (slug, l) => {
      const d = serviceMetadata(slug, l).description!;
      expect(d).toMatch(/Augsburg/);
      expect(d.length).toBeLessThanOrEqual(160);
    },
  );
});

describe('meta-und-schema AK-5: llms.txt nennt Kontakt und Arbeitsweise', () => {
  it('E-Mail, remote, Sprachen, BFSG', () => {
    const txt = llmsTxt();
    expect(txt).toContain('erb1209@outlook.de');
    expect(txt).toMatch(/remote/);
    expect(txt).toMatch(/German and English/);
    expect(txt).toContain('BFSG');
    // Kontaktseite mit Anfrage-Assistent (functions/seiten/kontakt.md)
    expect(txt).toContain('[Contact](https://erik-bergheimer.de/en/contact)');
  });
});

describe('sitemap AK-1: x-default', () => {
  it('zeigt auf die deutsche Seite', () => {
    const e = sitemap().find((x) => x.url === `${base}/en/services`)!;
    expect(e.alternates?.languages).toMatchObject({ 'x-default': `${base}/services` });
  });
});
