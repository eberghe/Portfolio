import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ServiceDetail from '@/components/services/ServiceDetail';
import ServicesOverview from '@/components/services/ServicesOverview';
import { serviceJsonLd } from '@/lib/structured-data';
import { services } from '@/lib/content/services';

// functions/seiten/leistungen.md

describe('AK-8: Inhalte vollständig', () => {
  it.each(services.flatMap((s) => (['de', 'en'] as const).map((l) => [s.slug, l, s] as const)))(
    '%s (%s)',
    (_slug, l, s) => {
      const t = s[l];
      for (const v of [t.title, t.short, t.description]) expect(v.trim()).not.toBe('');
      expect(t.features.length).toBeGreaterThanOrEqual(3);
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
