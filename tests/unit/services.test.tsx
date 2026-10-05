import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ServiceDetail from '@/components/services/ServiceDetail';
import ServicesOverview from '@/components/services/ServicesOverview';
import { breadcrumbJsonLd, serviceJsonLd, servicesItemListJsonLd } from '@/lib/structured-data';
import { overviewText } from '@/components/services/ServicesOverview';
import { services } from '@/lib/content/services';
import { serviceDetails } from '@/lib/content/service-details';

const detailOf = (slug: string) => serviceDetails.find((d) => d.slug === slug)!;

// functions/seiten/leistungen.md

describe('AK-8: Inhalte vollständig', () => {
  it.each(services.flatMap((s) => (['de', 'en'] as const).map((l) => [s.slug, l, s] as const)))(
    '%s (%s)',
    (_slug, l, s) => {
      const t = s[l];
      for (const v of [t.title, t.short, t.description]) expect(v.trim()).not.toBe('');
      expect(t.features.length).toBeGreaterThanOrEqual(3);
      expect(t.short.length).toBeGreaterThanOrEqual(60);
      expect(t.tags.length).toBeGreaterThanOrEqual(3);
    },
  );
});

describe('AK-2: Detailseite', () => {
  it.each(['de', 'en'] as const)('Aufbau (%s)', (locale) => {
    const service = services.find((s) => s.slug === 'accessibility')!;
    render(<ServiceDetail service={service} locale={locale} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    // Umbau AK-18: h1 ist die Überschrift mit Suchbegriff
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(detailOf(service.slug)[locale].headline);
    const included = screen.getByRole('heading', {
      level: 2,
      name: locale === 'de' ? 'Das ist enthalten' : "What's included",
    });
    const list = within(included.closest('section')!).getByRole('list');
    expect(within(list).getAllByRole('listitem').length).toBe(service[locale].features.length);
    expect(screen.getByRole('list', { name: locale === 'de' ? 'Schlagworte' : 'Keywords' })).toBeInTheDocument();
    for (const link of screen.getAllByRole('link', {
      name: locale === 'de' ? 'Kostenloses Erstgespräch' : 'Free intro call',
    }))
      expect(link).toHaveAttribute(
        'href',
        locale === 'de' ? '/contact?leistung=accessibility' : '/en/contact?leistung=accessibility',
      );
  });
});

describe('AK-3: strukturierte Daten', () => {
  it('Service mit Anbieter und Einsatzgebiet', () => {
    const service = services.find((s) => s.slug === 'ux-ui-design')!;
    const data = serviceJsonLd(service, 'de');
    expect(data['@type']).toBe('Service');
    expect(data.name).toBe('UX/UI Design');
    expect(data.provider).toMatchObject({ '@type': 'Person', name: 'Erik Bergheimer' });
    expect(data.areaServed).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'Deutschland' })]));
    expect(data.url).toBe('https://erik-bergheimer.de/services/ux-ui-design');
  });

  it('englische URL auf englischen Seiten', () => {
    const service = services.find((s) => s.slug === 'ux-ui-design')!;
    expect(serviceJsonLd(service, 'en').url).toBe('https://erik-bergheimer.de/en/services/ux-ui-design');
  });
});

describe('AK-6: Übersicht', () => {
  it('alle Leistungen mit kurzem Linknamen', () => {
    render(<ServicesOverview locale="de" />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    for (const s of services) {
      const link = screen.getByRole('link', { name: s.de.title });
      expect(link).toHaveAttribute('href', `/services/${s.slug}`);
      expect(link).toHaveAccessibleDescription(/\S/);
    }
  });
});

describe('AK-8: Suchwort im Titel', () => {
  it('Design Systems und Fotografie', () => {
    const find = (slug: string) => services.find((s) => s.slug === slug)!;
    expect(find('design-systems').de.title).toMatch(/Design System/);
    expect(find('design-systems').en.title).toMatch(/Design system/i);
    expect(find('photography').de.title).toMatch(/Fotografie/);
    expect(find('photography').en.title).toMatch(/photography/i);
  });
});

describe('AK-9: Passende Leistungen', () => {
  it.each(['de', 'en'] as const)('2 bis 3 andere Leistungen verlinkt (%s)', (locale) => {
    for (const service of services) {
      const { unmount } = render(<ServiceDetail service={service} locale={locale} />);
      const heading = screen.getByRole('heading', {
        level: 2,
        name: locale === 'de' ? 'Passende Leistungen' : 'Related services',
      });
      const links = within(heading.closest('section')!).getAllByRole('link');
      expect(links.length).toBeGreaterThanOrEqual(2);
      expect(links.length).toBeLessThanOrEqual(3);
      for (const link of links) expect(link.getAttribute('href')).not.toContain(service.slug);
      unmount();
    }
  });
});

describe('AK-10: Abschluss nennt die Leistung', () => {
  it('DE', () => {
    const service = services.find((s) => s.slug === 'accessibility')!;
    render(<ServiceDetail service={service} locale="de" />);
    const heading = screen.getByRole('heading', { level: 2, name: /Interesse an Barrierefreiheit-Beratung\?/ });
    expect(heading.closest('section')).toHaveTextContent(/Erstgespräch/);
  });
});

describe('AK-11: Sprache', () => {
  it('deutsche Übersicht heißt Leistungen, englische Services', () => {
    render(<ServicesOverview locale="de" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Leistungen');
  });

  it('Zurück-Link auf Deutsch', () => {
    render(<ServiceDetail service={services[0]!} locale="de" />);
    expect(screen.getByRole('link', { name: 'Alle Leistungen' })).toHaveAttribute('href', '/services');
  });

  it('englische Schlagworte für Barrierefreiheit', () => {
    const tags = services.find((s) => s.slug === 'accessibility')!.en.tags;
    expect(tags).toContain('EAA');
    expect(tags).toContain('Screen reader');
    expect(tags).not.toContain('BFSG');
  });
});

describe('AK-12: Übersicht', () => {
  it.each(['de', 'en'] as const)('Description nennt alle Leistungen (%s)', (locale) => {
    const d = overviewText[locale].metaDescription.toLowerCase();
    const words = {
      de: ['ux/ui', 'webflow', 'barrierefreiheit', 'ki', 'optimierung', 'brand', 'design systems', 'fotografie'],
      en: ['ux/ui', 'webflow', 'accessibility', 'ai', 'optimisation', 'brand', 'design systems', 'photography'],
    }[locale];
    for (const w of words) expect(d).toContain(w);
    expect(d.length).toBeLessThanOrEqual(160);
  });

  it('ItemList mit allen Detailseiten', () => {
    const data = servicesItemListJsonLd('en');
    expect(data['@type']).toBe('ItemList');
    expect(data.itemListElement).toHaveLength(services.length);
    expect(data.itemListElement[0]).toMatchObject({
      '@type': 'ListItem',
      position: 1,
      url: 'https://erik-bergheimer.de/en/services/ux-ui-design',
    });
  });

  it('kein doppeltes Kern-Abzeichen', () => {
    render(<ServicesOverview locale="de" />);
    expect(screen.queryByText('Kern')).toBeNull();
  });
});

describe('AK-13: Breadcrumbs', () => {
  it('BreadcrumbList Start › Leistungen › Leistung', () => {
    const service = services.find((s) => s.slug === 'accessibility')!;
    const data = breadcrumbJsonLd(service, 'de');
    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement.map((i) => i.name)).toEqual(['Start', 'Leistungen', 'Barrierefreiheit-Beratung']);
    expect(data.itemListElement[1]!.item).toBe('https://erik-bergheimer.de/services');
  });
});

describe('AK-14: Orte und Sprache im JSON-LD', () => {
  it('Augsburg und Deutschland, deutscher jobTitle', () => {
    const data = serviceJsonLd(services[0]!, 'de');
    const names = data.areaServed.map((a) => a.name);
    expect(names).toEqual(expect.arrayContaining(['Augsburg', 'Deutschland']));
    expect(data.provider.jobTitle).toMatch(/Designer/);
    expect(data.provider.jobTitle).not.toBe(serviceJsonLd(services[0]!, 'en').provider.jobTitle);
  });
});

describe('AK-16: Einsatzort im Text', () => {
  it.each(['de', 'en'] as const)('%s', (locale) => {
    render(<ServiceDetail service={services[1]!} locale={locale} />);
    // Der Satz zum Einsatzort (Überschrift und FAQ nennen Augsburg zusätzlich)
    const place = screen.getAllByText(/Augsburg/).find((el) => /remote/.test(el.textContent!))!;
    expect(place).toHaveTextContent(locale === 'de' ? /Deutschland/ : /Germany/);
  });
});

describe('AK-17: englische Abschluss-Überschrift (Issue #4)', () => {
  it.each([
    ['ux-ui-design', 'Interested in UX/UI design?'],
    ['ai-consulting', 'Interested in AI consulting?'],
    ['webflow-development', 'Interested in Webflow development?'],
    ['accessibility', 'Interested in accessibility consulting?'],
  ])('%s', (slug, name) => {
    const service = services.find((s) => s.slug === slug)!;
    render(<ServiceDetail service={service} locale="en" />);
    expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
  });
});

// Umbau nach Vorlage designme.agency (Issue #16)
describe('Umbau AK-25: Inhalte je Leistung vollständig und in DE/EN gleich aufgebaut', () => {
  it('alle acht Leistungen haben Detailinhalte', () => {
    expect(serviceDetails.map((d) => d.slug).sort()).toEqual(services.map((s) => s.slug).sort());
  });
  it.each(serviceDetails.map((d) => [d.slug, d] as const))('%s', (_slug, d) => {
    for (const l of ['de', 'en'] as const) {
      const t = d[l];
      expect(t.steps.length).toBeGreaterThanOrEqual(4);
      expect(t.steps.length).toBeLessThanOrEqual(5);
      for (const step of t.steps) expect(step.outputs.length).toBeGreaterThanOrEqual(2);
      expect(t.included).toHaveLength(6);
      expect(t.packages).toHaveLength(2);
      expect(t.faqs.length).toBeGreaterThanOrEqual(4);
      expect(t.lead.trim()).not.toBe('');
      expect(`${t.headline} ${t.lead}`).not.toMatch(/—/);
    }
    expect(d.en.steps.length).toBe(d.de.steps.length);
    expect(d.en.faqs.length).toBe(d.de.faqs.length);
    expect(d.en.packages.map((p) => p.items.length)).toEqual(d.de.packages.map((p) => p.items.length));
  });
});

describe.each(['de', 'en'] as const)('Umbau Detailseite (%s)', (locale) => {
  const service = services.find((s) => s.slug === 'webflow-development')!;
  const d = detailOf(service.slug)[locale];
  const t = {
    de: { process: d.processTitle, faq: 'Häufige Fragen', tools: 'Werkzeuge', packages: 'Pakete' },
    en: { process: d.processTitle, faq: 'Frequently asked questions', tools: 'Tools', packages: 'Packages' },
  }[locale];

  it('AK-19: Ablauf mit Schritten, Dauer und Ergebnissen', () => {
    render(<ServiceDetail service={service} locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.process }).closest('section')!;
    const steps = section.querySelector('ol')!;
    expect(steps.querySelectorAll(':scope > li')).toHaveLength(d.steps.length);
    expect(within(section).getAllByRole('heading', { level: 3 })).toHaveLength(d.steps.length);
    expect(section).toHaveTextContent(d.steps[0]!.duration);
    expect(section).toHaveTextContent(d.steps[0]!.outputs[0]!);
  });

  it('AK-20: sechs Karten „Was enthalten ist“', () => {
    render(<ServiceDetail service={service} locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: d.includedTitle }).closest('section')!;
    expect(within(section).getAllByRole('heading', { level: 3 })).toHaveLength(6);
  });

  it('AK-21: zwei Pakete ohne Preise mit Anfrage-Link', () => {
    render(<ServiceDetail service={service} locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.packages }).closest('section')!;
    const names = within(section).getAllByRole('heading', { level: 3 });
    expect(names.map((h) => h.textContent)).toEqual(d.packages.map((p) => p.name));
    expect(section.textContent).not.toMatch(/€|EUR/);
    expect(within(section).getAllByRole('link')).toHaveLength(2);
  });

  it('AK-22: FAQ als details mit FAQPage-JSON-LD', () => {
    const { container } = render(<ServiceDetail service={service} locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.faq }).closest('section')!;
    expect(section.querySelectorAll('details')).toHaveLength(d.faqs.length);
    expect(section.querySelectorAll('summary h3')).toHaveLength(d.faqs.length);
    const ld = [...container.querySelectorAll('script[type="application/ld+json"]')]
      .map((el) => JSON.parse(el.textContent!))
      .find((j) => j['@type'] === 'FAQPage');
    expect(ld.mainEntity).toHaveLength(d.faqs.length);
    expect(ld.mainEntity[0].name).toBe(d.faqs[0]!.q);
  });

  it('AK-23: passendes Projekt verlinkt', () => {
    render(<ServiceDetail service={service} locale={locale} />);
    const slug = detailOf(service.slug).project!;
    const links = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(links).toContain(`${locale === 'en' ? '/en' : ''}/projects/${slug}`);
  });

  it('AK-24: Werkzeuge als Liste', () => {
    render(<ServiceDetail service={service} locale={locale} />);
    const list = screen.getByRole('list', { name: t.tools });
    expect(within(list).getAllByRole('listitem').length).toBe(detailOf(service.slug).tools.length);
  });

  it('AK-26: Abschnitte blenden ein', () => {
    const { container } = render(<ServiceDetail service={service} locale={locale} />);
    expect(container.querySelectorAll('[data-reveal]').length).toBeGreaterThan(5);
  });
});

describe('AK-27: Warum mit mir', () => {
  it.each(services.flatMap((s) => (['de', 'en'] as const).map((l) => [s.slug, l, s] as const)))(
    '%s (%s)',
    (_slug, locale, service) => {
      render(<ServiceDetail service={service} locale={locale} />);
      const heading = screen.getByRole('heading', {
        level: 2,
        name: locale === 'de' ? 'Warum mit mir' : 'Why work with me',
      });
      const list = heading.closest('section')!.querySelector('ol')!;
      expect(list).toHaveClass('sticky-stack');
      expect(within(list).getAllByRole('heading', { level: 3 })).toHaveLength(4);
    },
  );

  it('erste Karte ist je Leistung verschieden', () => {
    for (const locale of ['de', 'en'] as const) {
      const firsts = services.map((service) => {
        const { unmount } = render(<ServiceDetail service={service} locale={locale} />);
        const heading = screen.getByRole('heading', {
          level: 2,
          name: locale === 'de' ? 'Warum mit mir' : 'Why work with me',
        });
        const title = within(heading.closest('section')!.querySelector('ol')!).getAllByRole('heading', { level: 3 })[0]!
          .textContent;
        unmount();
        return title;
      });
      expect(new Set(firsts).size).toBe(services.length);
    }
  });
});
