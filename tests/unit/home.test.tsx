import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from '@/components/home/Home';
import { homeContent } from '@/lib/content/home';
import { projects } from '@/lib/content/projects';
import { services } from '@/lib/content/services';

// functions/seiten/startseite.md

describe.each([
  [
    'de',
    '',
    {
      h1: /^Hi, ich bin Erik Bergheimer, UX\/UI Designer & Webflow Expert$/,
      offer: 'Was ich anbiete',
      process: 'So arbeiten wir zusammen',
      projects: 'Ausgewählte Projekte',
      contact: 'Kostenloses Erstgespräch',
    },
  ],
  [
    'en',
    '/en',
    {
      h1: /^Hi, I'm Erik Bergheimer, UX\/UI Designer & Webflow Expert$/,
      offer: 'What I offer',
      process: 'How we work together',
      projects: 'Selected projects',
      contact: 'Free intro call',
    },
  ],
] as const)('Startseite (%s)', (locale, prefix, t) => {
  it('AK-2: genau eine h1 und je Abschnitt eine h2', () => {
    render(<Home locale={locale} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    // AK-11: Rolle wird mit Pause vorgelesen, "ich" kleingeschrieben
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(t.h1);
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
    // Hero, Leistungen und Abschluss führen alle zum Kontakt
    for (const link of screen.getAllByRole('link', { name: t.contact }))
      expect(link).toHaveAttribute('href', `${prefix}/contact`);
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
    expect(screen.getByRole('img', { name: homeContent[locale].heroAlt })).toBeInTheDocument();
  });

  it('AK-8: Faktenleiste als Beschreibungsliste', () => {
    const { container } = render(<Home locale={locale} />);
    const dl = container.querySelector('dl');
    expect(dl).not.toBeNull();
    expect(dl!.querySelectorAll('dt')).toHaveLength(4);
    expect(dl!.querySelectorAll('dd')).toHaveLength(4);
  });
});

describe('AK-12: kurze Linknamen mit Beschreibung', () => {
  it('Leistungs- und Projektlinks heißen wie ihre Überschrift, der Rest ist Beschreibung', () => {
    render(<Home locale="de" />);
    const ux = screen.getByRole('link', { name: 'UX/UI Design' });
    expect(ux).toHaveAccessibleDescription(/Von der ersten Idee/);
    const project = screen.getByRole('link', { name: "SIGHT'KICK" });
    expect(project).toHaveAccessibleDescription(/Masterarbeit/);
  });
});

describe('AK-13: Fakten stimmen mit dem Inhalt überein', () => {
  it('keine "Featured"-Zahl, die den gezeigten Projekten widerspricht', () => {
    render(<Home locale="de" />);
    expect(screen.queryByText('Featured Projekte')).toBeNull();
    expect(screen.getByText('Projekte im Portfolio')).toBeInTheDocument();
  });

  it('deutsche Projekttypen auf Deutsch', () => {
    render(<Home locale="de" />);
    expect(screen.getAllByText(/Bachelorarbeit/).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'Indonesien' })).toBeInTheDocument();
  });
});

describe('AK-17: Entscheidungen von Erik (2026-10-04)', () => {
  it('Hero nennt freiberuflich und Einsatzgebiet', () => {
    render(<Home locale="de" />);
    expect(screen.getAllByText(/freiberuflich/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Remote/i).length).toBeGreaterThan(0);
  });

  it('keine unklare Angabe "Länder & Remote" mehr', () => {
    render(<Home locale="de" />);
    expect(screen.queryByText('Länder & Remote')).toBeNull();
  });

  it('Barrierefreiheit klingt nicht nach Rechtsberatung', () => {
    const a11y = services.find((s) => s.slug === 'accessibility')!;
    expect(a11y.de.short).not.toMatch(/Beratung zum BFSG/);
    expect(a11y.de.short).toMatch(/Umsetzung der BFSG-Anforderungen/);
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

describe('AK-19: Projektzahl aus den Daten (Issue #5)', () => {
  it.each(['de', 'en'] as const)('%s', (locale) => {
    const stat = homeContent[locale].stats.find((s) => /Projekt|Project/.test(s.label))!;
    expect(stat.value).toBe(String(projects.length));
  });
});

// Umbau nach Vorlage designme.agency (Issue #17)
describe.each(['de', 'en'] as const)('Umbau Startseite (%s)', (locale) => {
  const t = {
    de: {
      tools: 'Werkzeuge, mit denen ich arbeite',
      about: 'Über mich',
      more: 'Mehr über mich',
      cta: 'Erzähl mir, was du vorhast',
      read: 'Fallstudie lesen',
    },
    en: {
      tools: 'Tools I work with',
      about: 'About me',
      more: 'More about me',
      cta: "Tell me what you're planning",
      read: 'Read case study',
    },
  }[locale];
  const prefix = locale === 'en' ? '/en' : '';

  it('AK-20: Werkzeuge mit h2, Liste für Screenreader und Pause-Knopf', () => {
    render(<Home locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.tools }).closest('section')!;
    expect(within(section).getByRole('list')).toHaveTextContent('Figma');
    expect(within(section).getByRole('button', { pressed: false })).toBeInTheDocument();
  });

  it('AK-21: Leistungen nummeriert, mit Merkmalen, als Sticky-Stapel', () => {
    const { container } = render(<Home locale={locale} />);
    const stack = container.querySelector('.sticky-stack')!;
    expect(stack).not.toBeNull();
    const cards = stack.querySelectorAll(':scope > li');
    expect(cards).toHaveLength(8);
    expect(cards[0]).toHaveTextContent('01');
    expect(cards[7]).toHaveTextContent('08');
    for (const card of cards) {
      expect(card.querySelector('h3')).not.toBeNull();
      const features = card.querySelectorAll('ul li');
      expect(features.length).toBeGreaterThan(0);
      expect(features.length).toBeLessThanOrEqual(4);
    }
    expect(within(stack as HTMLElement).getByRole('link', { name: services[0]![locale].title })).toHaveAttribute(
      'href',
      `${prefix}/services/${services[0]!.slug}`,
    );
  });

  it('AK-22: Fallstudien-Karten mit Schlagworten und Hinweis', () => {
    render(<Home locale={locale} />);
    const link = screen.getByRole('link', { name: "SIGHT'KICK" });
    expect(link).toHaveTextContent(t.read);
    expect(within(link).getAllByRole('listitem').length).toBeGreaterThan(1);
  });

  it('AK-23: Über-mich-Abschnitt mit Link', () => {
    render(<Home locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.about }).closest('section')!;
    expect(within(section).getByRole('link', { name: t.more })).toHaveAttribute('href', `${prefix}/about`);
    expect(within(section).getByRole('img')).toBeInTheDocument();
  });

  it('AK-24: Abschluss-CTA', () => {
    render(<Home locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.cta }).closest('section')!;
    expect(
      within(section)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(expect.arrayContaining([`${prefix}/contact`, 'mailto:erb1209@outlook.de']));
  });

  it('AK-25: Abschnitte blenden ein', () => {
    const { container } = render(<Home locale={locale} />);
    expect(container.querySelectorAll('[data-reveal]').length).toBeGreaterThan(10);
  });
});
