import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Footer from '@/components/Footer';
import LocalLanding from '@/components/local/LocalLanding';
import ServiceDetail from '@/components/services/ServiceDetail';
import { localPages } from '@/lib/content/local';
import { services } from '@/lib/content/services';
import { localizedPath } from '@/lib/i18n';
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

describe.each(locales)('Landingpage %s', (locale) => {
  it('AK-3: eine h1 mit Leistung und Ort', () => {
    render(<LocalLanding page={page} locale={locale} />);
    const h1 = screen.getAllByRole('heading', { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent(/Web ?design/i);
    expect(h1[0]).toHaveTextContent('Augsburg');
  });

  it('AK-4: Vor Ort und remote als dl, ohne Straße', () => {
    const { container } = render(<LocalLanding page={page} locale={locale} />);
    const dl = container.querySelector('dl')!;
    expect(dl.querySelectorAll('dt')).toHaveLength(3);
    expect(dl).toHaveTextContent('Augsburg');
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
      expect(`${f.q} ${f.a}`).toMatch(/Augsburg|Königsbrunn/);
      expect(screen.getByRole('heading', { name: f.q })).toBeInTheDocument();
    }
    const ld = [...container.querySelectorAll('script[type="application/ld+json"]')].map((s) =>
      JSON.parse(s.textContent!),
    );
    expect(ld.some((d) => d['@type'] === 'FAQPage' && d.mainEntity.length === faqs.length)).toBe(true);
  });
});

describe('AK-7: Querverlinkung', () => {
  it.each(locales)('Footer verlinkt die Landingpage (%s)', (locale) => {
    render(<Footer locale={locale} />);
    const footer = screen.getByRole('contentinfo');
    // Desktop- und Mobilzeile
    for (const link of within(footer).getAllByRole('link', { name: page[locale].footerLink }))
      expect(link).toHaveAttribute('href', localizedPath(page.path, locale));
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

describe('AK-8: gleiche Struktur DE/EN', () => {
  it('gleiche Zahl an Gründen und Fragen, Meta-Längen', () => {
    expect(page.de.reasons).toHaveLength(page.en.reasons.length);
    expect(page.de.faqs).toHaveLength(page.en.faqs.length);
    for (const l of locales) {
      expect(page[l].metaTitle).toMatch(/\| Erik Bergheimer$/);
      expect(page[l].metaTitle.length).toBeLessThanOrEqual(70);
      expect(page[l].metaDescription.length).toBeLessThanOrEqual(160);
      expect(page[l].metaDescription).toContain('Augsburg');
    }
  });
});
