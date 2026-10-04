import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from '@/components/home/Home';
import { services } from '@/lib/content/services';

// functions/seiten/startseite.md

describe.each([
  [
    'de',
    '',
    {
      h1: /Hi, Ich bin Erik/,
      offer: 'Was ich anbiete',
      process: 'So arbeiten wir zusammen',
      projects: 'Ausgewählte Projekte',
      contact: 'Kontakt',
    },
  ],
  [
    'en',
    '/en',
    {
      h1: /Hi, I'm Erik/,
      offer: 'What I offer',
      process: 'How we work together',
      projects: 'Selected projects',
      contact: 'Get in touch',
    },
  ],
] as const)('Startseite (%s)', (locale, prefix, t) => {
  it('AK-2: genau eine h1 und je Abschnitt eine h2', () => {
    render(<Home locale={locale} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(t.h1);
    for (const name of [t.offer, t.process, t.projects]) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
  });

  it('AK-3: Ablauf ist eine geordnete Liste mit 4 Schritten', () => {
    render(<Home locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.process }).closest('section')!;
    const list = within(section).getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(4);
  });

  it('AK-4: Kontakt- und Projekt-Button', () => {
    render(<Home locale={locale} />);
    expect(screen.getByRole('link', { name: t.contact })).toHaveAttribute('href', `${prefix}/contact`);
  });

  it('AK-5: alle acht Leistungen verlinkt', () => {
    render(<Home locale={locale} />);
    expect(services).toHaveLength(8);
    for (const s of services) {
      const link = screen.getByRole('link', {
        name: new RegExp(s[locale].title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      });
      expect(link).toHaveAttribute('href', `${prefix}/services/${s.slug}`);
    }
  });

  it('AK-6: Projektkarten mit dekorativem Bild und Titel als Linkname', () => {
    render(<Home locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.projects }).closest('section')!;
    const link = within(section).getByRole('link', { name: /SIGHT'KICK/ });
    expect(link).toHaveAttribute('href', `${prefix}/projects/sightkick`);
    for (const img of within(section).getAllByRole('presentation')) expect(img).toHaveAttribute('alt', '');
  });

  it('AK-7: Hero-Foto mit beschreibendem Alt-Text', () => {
    render(<Home locale={locale} />);
    expect(screen.getByRole('img', { name: /Erik Bergheimer/ })).toBeInTheDocument();
  });

  it('AK-8: Faktenleiste als Beschreibungsliste', () => {
    const { container } = render(<Home locale={locale} />);
    const dl = container.querySelector('dl');
    expect(dl).not.toBeNull();
    expect(dl!.querySelectorAll('dt')).toHaveLength(4);
    expect(dl!.querySelectorAll('dd')).toHaveLength(4);
  });
});

describe('AK-10: Leistungstexte', () => {
  it('jede Leistung hat Titel und Beschreibung in beiden Sprachen', () => {
    for (const s of services) {
      for (const l of ['de', 'en'] as const) {
        expect(s[l].title.trim(), `${s.slug} ${l}`).not.toBe('');
        expect(s[l].short.trim(), `${s.slug} ${l}`).not.toBe('');
      }
    }
  });
});
