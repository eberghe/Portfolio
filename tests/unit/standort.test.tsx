import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { overviewText } from '@/components/services/ServicesOverview';
import FaqPage, { faqText } from '@/components/faq/FaqPage';
import LegalPage from '@/components/legal/LegalPage';
import { aboutContent } from '@/lib/content/about';
import { contactText } from '@/lib/content/contact';
import { homeContent } from '@/lib/content/home';
import { services } from '@/lib/content/services';
import { messages } from '@/lib/i18n';
import { llmsTxt } from '@/lib/llms';
import { serviceMetadata } from '@/lib/pages/services';
import { homeJsonLd } from '@/lib/seo';
import { serviceJsonLd } from '@/lib/structured-data';

// functions/seiten/standort.md
const locales = ['de', 'en'] as const;

describe('standort AK-1: Impressum mit Anschrift', () => {
  it.each(locales)('%s', (locale) => {
    render(<LegalPage kind="impressum" locale={locale} />);
    const text = document.body.textContent!;
    expect(text).toContain('Weißdornstraße 5');
    expect(text).toContain('86343 Königsbrunn');
    expect(text).toContain(locale === 'de' ? 'Deutschland' : 'Germany');
    if (locale === 'de') expect(text).toContain('§ 5 DDG');
  });
});

describe('standort AK-2: Datenschutz mit Anschrift und Aufsichtsbehörde', () => {
  it.each(locales)('%s', (locale) => {
    render(<LegalPage kind="datenschutz" locale={locale} />);
    const text = document.body.textContent!;
    expect(text).toContain('Weißdornstraße 5');
    expect(text).toContain('86343 Königsbrunn');
    expect(text).toContain('BayLDA');
  });
});

describe('standort AK-3: kein Österreich in den Rechtstexten', () => {
  it.each(locales.flatMap((l) => (['impressum', 'datenschutz'] as const).map((k) => [k, l] as const)))(
    '%s (%s)',
    (kind, locale) => {
      render(<LegalPage kind={kind} locale={locale} />);
      expect(document.body.textContent).not.toMatch(/Innsbruck|Österreich|Austria/);
    },
  );
});

describe('standort AK-4: JSON-LD nur Deutschland', () => {
  it.each(locales)('%s', (locale) => {
    const home = JSON.stringify(homeJsonLd(locale));
    const service = JSON.stringify(serviceJsonLd(services[0]!, locale));
    for (const json of [home, service]) {
      expect(json).toContain('Augsburg');
      expect(json).toContain(locale === 'de' ? 'Deutschland' : 'Germany');
      expect(json).not.toMatch(/Innsbruck|Österreich|Austria/);
    }
  });
});

describe('standort AK-5: Descriptions und llms.txt nennen Augsburg', () => {
  it.each(locales)('%s', (locale) => {
    const descriptions = [
      homeContent[locale].metaDescription,
      overviewText[locale].metaDescription,
      contactText[locale].metaDescription,
      faqText[locale].metaDescription,
      ...services.map((s) => serviceMetadata(s.slug, locale).description!),
    ];
    for (const d of descriptions) {
      expect(d).toContain('Augsburg');
      expect(d).not.toContain('Innsbruck');
    }
    expect(aboutContent[locale].metaDescription).toContain('Augsburg');
    expect(aboutContent[locale].metaDescription).not.toMatch(/Augsburg (&|and|und) Innsbruck/);
  });

  it('llms.txt', () => {
    const txt = llmsTxt();
    expect(txt).toContain('Augsburg (Germany)');
    expect(txt).not.toMatch(/Innsbruck \(Austria\)|Germany and Austria|Germany, Austria/);
  });
});

describe('standort AK-6: Footer-Satz', () => {
  it.each(locales)('%s', (locale) => {
    expect(messages[locale].footer.madeWith).toBe('made with 🤍 in augsburg');
  });
});

describe('standort AK-7: City und Country im Startseiten-JSON-LD', () => {
  it.each(locales)('%s', (locale) => {
    const service = homeJsonLd(locale)['@graph'][1] as { areaServed: { '@type': string; name: string }[] };
    expect(service.areaServed).toEqual([
      { '@type': 'City', name: 'Augsburg' },
      { '@type': 'Country', name: locale === 'de' ? 'Deutschland' : 'Germany' },
    ]);
  });
});

describe('standort AK-8: Anschrift im Person-JSON-LD', () => {
  it('PostalAddress', () => {
    const p = homeJsonLd('de')['@graph'][0] as { address?: Record<string, string> };
    expect(p.address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: 'Weißdornstraße 5',
      postalCode: '86343',
      addressLocality: 'Königsbrunn',
      addressRegion: 'Bayern',
      addressCountry: 'DE',
    });
  });
});

describe('standort AK-9: Zeilenumbrüche der Anschrift', () => {
  it.each(locales)('%s', (locale) => {
    const { container } = render(<LegalPage kind="impressum" locale={locale} />);
    const p = [...container.querySelectorAll('p')].find((el) => el.textContent!.includes('Weißdornstraße 5'))!;
    expect(p.querySelectorAll('br').length).toBeGreaterThanOrEqual(3);
    if (locale === 'en') expect(container).toHaveTextContent('Information pursuant to Section 5 DDG');
  });
});

describe('standort AK-10: FAQ ohne Österreich', () => {
  it.each(locales)('%s', (locale) => {
    render(<FaqPage locale={locale} />);
    expect(document.body.textContent).not.toMatch(/österreich|Austria|BaFG/i);
    expect(document.body.textContent).toContain('European Accessibility Act');
  });
});
