import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Footer from '@/components/Footer';
import LocalLanding from '@/components/local/LocalLanding';
import ServiceDetail from '@/components/services/ServiceDetail';
import { localPages } from '@/lib/content/local';
import { services } from '@/lib/content/services';
import { localizedPath } from '@/lib/i18n';
import { llmsTxt } from '@/lib/llms';
import { localBreadcrumbJsonLd, localJsonLd } from '@/lib/structured-data';

// functions/seo/staedte-landingpages.md
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

const page = localPages[0]!;
const locales = ['de', 'en'] as const;

describe('AK-2: strukturierte Daten', () => {
  it('ProfessionalService mit Augsburg als City', () => {
    const data = localJsonLd(page, 'de');
    expect(data['@type']).toBe('ProfessionalService');
    expect(data.areaServed).toContainEqual({ '@type': 'City', name: 'Augsburg' });
    expect(data.provider['@type']).toBe('Person');
    expect(data.name).toMatch(/^Erik Bergheimer/);
    expect(data.address).toMatchObject({
      '@type': 'PostalAddress',
      addressLocality: 'Königsbrunn',
      addressCountry: 'DE',
    });
    expect(data.url).toBe('https://erik-bergheimer.de/webdesign-augsburg');
    expect(localJsonLd(page, 'en').url).toBe('https://erik-bergheimer.de/en/web-design-augsburg');
  });

  it('BreadcrumbList Start › Seite', () => {
    const items = localBreadcrumbJsonLd(page, 'en').itemListElement;
    expect(items).toHaveLength(2);
    expect(items[1]!.item).toBe('https://erik-bergheimer.de/en/web-design-augsburg');
  });
});

const cases = localPages.flatMap((page) => locales.map((locale) => ({ page, locale, name: `${page.city} ${locale}` })));

describe.each(cases)('Landingpage $name', ({ page, locale }) => {
  it('AK-3: eine h1 mit Leistung und Ort', () => {
    render(<LocalLanding page={page} locale={locale} />);
    const h1 = screen.getAllByRole('heading', { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent(/Web ?design/i);
    expect(h1[0]).toHaveTextContent(locale === 'en' && page.city === 'München' ? 'Munich' : page.city);
  });

  it('AK-4: Vor Ort und remote als dl, ohne Straße', () => {
    const { container } = render(<LocalLanding page={page} locale={locale} />);
    const dl = container.querySelector('dl')!;
    expect(dl.querySelectorAll('dt')).toHaveLength(3);
    expect(dl).toHaveTextContent(/Augsburg|Königsbrunn/);
    const visible = container.cloneNode(true) as HTMLElement;
    for (const script of visible.querySelectorAll('script')) script.remove();
    expect(visible).not.toHaveTextContent('Weißdornstraße');
  });

  it('AK-5: Leistungs-Karten verlinken die Leistungsseiten', () => {
    render(<LocalLanding page={page} locale={locale} />);
    for (const slug of page.services) {
      const s = services.find((x) => x.slug === slug)!;
      expect(screen.getByRole('link', { name: s[locale].title })).toHaveAttribute(
        'href',
        `${locale === 'en' ? '/en' : ''}/services/${slug}`,
      );
    }
  });

  it('AK-6: ortsbezogene FAQ mit JSON-LD', () => {
    const { container } = render(<LocalLanding page={page} locale={locale} />);
    const faqs = page[locale].faqs;
    expect(faqs.length).toBeGreaterThanOrEqual(4);
    for (const f of faqs) {
      expect(`${f.q} ${f.a}`).toMatch(new RegExp(`${page.city}|Munich|Königsbrunn`));
      expect(screen.getByRole('heading', { name: f.q })).toBeInTheDocument();
    }
    const ld = [...container.querySelectorAll('script[type="application/ld+json"]')].map((s) =>
      JSON.parse(s.textContent!),
    );
    expect(ld.some((d) => d['@type'] === 'FAQPage' && d.mainEntity.length === faqs.length)).toBe(true);
  });
});

describe('AK-7: Querverlinkung', () => {
  it.each(locales)('Footer-Navigation verlinkt alle Landingpages (%s)', (locale) => {
    render(<Footer locale={locale} />);
    const nav = screen.getByRole('navigation', {
      name: locale === 'de' ? 'Webdesign nach Stadt' : 'Web design by city',
    });
    for (const p of localPages)
      expect(within(nav).getByRole('link', { name: p[locale].footerLink })).toHaveAttribute(
        'href',
        localizedPath(p.path, locale),
      );
  });

  it('Leistungsseiten der Stadt verlinken sie im Ortssatz', () => {
    for (const slug of page.services) {
      const { unmount } = render(<ServiceDetail service={services.find((s) => s.slug === slug)!} locale="de" />);
      expect(screen.getByRole('link', { name: page.de.serviceLink })).toHaveAttribute('href', '/webdesign-augsburg');
      unmount();
    }
    render(<ServiceDetail service={services.find((s) => s.slug === 'photography')!} locale="de" />);
    expect(screen.queryByRole('link', { name: page.de.serviceLink })).toBeNull();
  });
});

describe.each(localPages.map((p) => ({ page: p, city: p.city })))('AK-8: $city', ({ page }) => {
  it('gleiche Zahl an Gründen und Fragen, Meta-Längen', () => {
    expect(page.de.reasons).toHaveLength(page.en.reasons.length);
    expect(page.de.faqs).toHaveLength(page.en.faqs.length);
    for (const l of locales) {
      expect(page[l].metaTitle).toMatch(/\| Erik Bergheimer$/);
      expect(page[l].metaTitle.length).toBeLessThanOrEqual(70);
      expect(page[l].metaDescription.length).toBeLessThanOrEqual(160);
      expect(page[l].metaDescription).toContain(page.city);
    }
  });
});

describe('AK-10: kein Doorway-Inhalt', () => {
  it('fünf Städte mit eigenen Routen', () => {
    expect(localPages.map((p) => p.city)).toEqual(['Augsburg', 'München', 'Stuttgart', 'Innsbruck', 'Kempten']);
    expect(new Set(localPages.map((p) => localizedPath(p.path, 'en'))).size).toBe(localPages.length);
    for (const p of localPages) expect(localizedPath(p.path, 'en')).not.toBe(`/en${p.path}`);
  });

  it.each(locales)('keine geteilten Texte zwischen Städten (%s)', (locale) => {
    const seen = new Map<string, string>();
    for (const p of localPages) {
      const t = p[locale];
      for (const text of [
        t.lead,
        t.localText,
        ...t.reasons.flatMap((r) => [r.title, r.text]),
        ...t.faqs.map((f) => f.q),
      ]) {
        expect(seen.get(text), `${p.city}: ${text}`).toBeUndefined();
        seen.set(text, p.city);
      }
    }
  });

  it('nur Augsburg verspricht „vor Ort in … und Umgebung“', () => {
    for (const p of localPages.slice(1))
      for (const l of locales)
        expect(JSON.stringify(p[l])).not.toMatch(/vor Ort in \w+ und Umgebung|on site in and around/i);
  });

  it('Innsbruck nennt Österreich als Land', () => {
    const innsbruck = localPages.find((p) => p.city === 'Innsbruck')!;
    expect(localJsonLd(innsbruck, 'de').areaServed).toContainEqual({ '@type': 'Country', name: 'Österreich' });
  });
});

describe('AK-11: llms.txt', () => {
  it('listet alle Städte-Landingpages', () => {
    const txt = llmsTxt();
    expect(txt).toContain('## Regions');
    for (const p of localPages) expect(txt).toContain(`https://erik-bergheimer.de${localizedPath(p.path, 'en')}`);
  });
});

describe('AK-12: eigene Kartentexte je Stadt', () => {
  it.each(locales)('Städte außer Augsburg beschreiben ihre Leistungen selbst (%s)', (locale) => {
    for (const p of localPages.slice(1)) {
      for (const slug of p.services) {
        const text = p[locale].serviceTexts?.[slug];
        expect(text, `${p.city} ${slug}`).toBeTruthy();
        expect(text).not.toBe(services.find((s) => s.slug === slug)![locale].short);
      }
    }
  });

  it('Innsbruck nennt kein deutsches BFSG', () => {
    const innsbruck = localPages.find((p) => p.city === 'Innsbruck')!;
    for (const l of locales) expect(JSON.stringify(innsbruck[l])).not.toContain('BFSG');
  });

  it('Karten zeigen den Stadttext', () => {
    const p = localPages[1]!;
    render(<LocalLanding page={p} locale="de" />);
    expect(screen.getByText(p.de.serviceTexts![p.services[0]!]!)).toBeInTheDocument();
  });
});
