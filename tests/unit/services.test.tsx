import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ServiceDetail from '@/components/services/ServiceDetail';
import ServicesOverview from '@/components/services/ServicesOverview';
import { breadcrumbJsonLd, serviceJsonLd, servicesItemListJsonLd } from '@/lib/structured-data';
import { overviewText } from '@/components/services/ServicesOverview';
import { services } from '@/lib/content/services';

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
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(service[locale].title);
    const included = screen.getByRole('heading', {
      level: 2,
      name: locale === 'de' ? 'Das ist enthalten' : "What's included",
    });
    const list = within(included.closest('section')!).getByRole('list');
    expect(within(list).getAllByRole('listitem').length).toBe(service[locale].features.length);
    expect(screen.getByRole('list', { name: locale === 'de' ? 'Schlagworte' : 'Keywords' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: locale === 'de' ? 'Kostenloses Erstgespräch' : 'Free intro call' }),
    ).toHaveAttribute('href', locale === 'de' ? '/contact' : '/en/contact');
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
  it('Augsburg und Innsbruck, deutscher jobTitle', () => {
    const data = serviceJsonLd(services[0]!, 'de');
    const names = data.areaServed.map((a) => a.name);
    expect(names).toEqual(expect.arrayContaining(['Augsburg', 'Innsbruck']));
    expect(data.provider.jobTitle).toMatch(/Designer/);
    expect(data.provider.jobTitle).not.toBe(serviceJsonLd(services[0]!, 'en').provider.jobTitle);
  });
});
