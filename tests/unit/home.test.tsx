import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from '@/components/home/Home';
import { heroMedia, homeContent } from '@/lib/content/home';
import { projects } from '@/lib/content/projects';
import { services } from '@/lib/content/services';

// functions/seiten/startseite.md

describe.each([
  [
    'de',
    '',
    {
      h1: /^Hey, ich bin Erik, Design Engineer$/,
      offer: 'Was ich anbiete',
      process: 'So arbeiten wir zusammen',
      projects: 'Ein Auszug meiner Projekte.',
      contact: 'Kostenloses Erstgespräch',
    },
  ],
  [
    'en',
    '/en',
    {
      h1: /^Hey, I'm Erik, Design Engineer$/,
      offer: 'What I offer',
      process: 'How we work together',
      projects: 'A selection of my projects.',
      contact: 'Free intro call',
    },
  ],
] as const)('Startseite (%s)', (locale, prefix, t) => {
  it('AK-2: genau eine h1 und je Abschnitt eine h2', () => {
    render(<Home locale={locale} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    // AK-43: Medien-Plätze und Randnotiz sind dekorativ
    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName(t.h1);
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

  it('AK-5: alle sieben Leistungen verlinkt', () => {
    render(<Home locale={locale} />);
    expect(services).toHaveLength(7);
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

  it('AK-43/AK-44/AK-45: typografische h1, Medien-Plätze und Randnotiz dekorativ', () => {
    render(<Home locale={locale} />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.querySelectorAll('[data-word]').length).toBe(4);
    expect(h1.querySelectorAll('.italic').length).toBe(2);
    expect(h1.textContent).not.toContain('Bergheimer');
    const media = h1.querySelectorAll('[data-hero-media]');
    expect(media).toHaveLength(3);
    for (const m of media) expect(m).toHaveAttribute('aria-hidden', 'true');
    expect(h1.querySelector('[data-hero-note]')).toHaveAttribute('aria-hidden', 'true');
    expect(h1.textContent).not.toContain('👋');
  });

  it('AK-46: Absatz mit Wohnort und Leidenschaften, ohne Buttons', () => {
    render(<Home locale={locale} />);
    const hero = screen.getByRole('heading', { level: 1 }).closest('section')!;
    // AK-50: nur Augsburg, kurze Sätze, Fußball, Bergsport, Kochen
    expect(hero).toHaveTextContent('Augsburg');
    expect(hero.textContent).not.toMatch(/Königsbrunn|Handwerker-Event|trade event/);
    expect(hero).toHaveTextContent(locale === 'de' ? /Bergsport/ : /mountain sports/);
    expect(
      hero
        .querySelector('p')!
        .textContent!.split(/[.!?](\s|$)/)
        .filter((x) => x && x.trim()).length,
    ).toBeLessThanOrEqual(4);
    expect(hero).toHaveTextContent(locale === 'de' ? /Fußball/ : /football/);
    expect(hero.querySelector('p .text-primary-text')).toHaveTextContent('HERO Software');
    expect(hero).toHaveTextContent('HEROCON');
    expect(hero.textContent).not.toMatch(/freiberuflich|freelanc/i);
    // AK-46: keine Buttons im Hero
    expect(within(hero).queryAllByRole('link')).toHaveLength(0);
  });

  it('AK-28/AK-29: Unternehmen als Links, HERO Software hervorgehoben', () => {
    render(<Home locale={locale} />);
    const h2 = screen.getByRole('heading', {
      level: 2,
      name: locale === 'de' ? 'Unternehmen, für die ich gearbeitet habe' : "Companies I've worked for",
    });
    const section = h2.closest('section')!;
    const links = within(section).getAllByRole('link');
    expect(links.map((l) => l.getAttribute('href'))).toEqual(homeContent[locale].companies.map((c) => c.url));
    for (const l of links) {
      expect(l).toHaveAttribute('target', '_blank');
      expect(l).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }
    const hero = within(section).getByRole('link', { name: /HERO Software/ });
    // AK-32: Teile des Linknamens mit Pausen, jeder Eintrag mit ehrlicher Rolle
    expect(hero).toHaveAccessibleName(
      locale === 'de'
        ? 'HERO Software, Aktuell, Business Development Manager (öffnet in neuem Tab)'
        : 'HERO Software, Current, Business Development Manager (opens in a new tab)',
    );
    // AK-34: echte Logos als einfarbige SVG-Dateien, dekorativ
    const logos = links.map((l) => l.querySelector('img')!);
    expect(logos.map((img) => img.getAttribute('src'))).toEqual([
      '/logos/hero.svg',
      '/logos/team23.svg',
      '/logos/amazon.svg',
      '/logos/ikea.svg',
    ]);
    for (const img of logos) {
      expect(img).toHaveAttribute('alt', '');
      expect(img.className).toContain('dark:invert');
    }
    for (const c of homeContent[locale].companies) expect(c.role).toBeTruthy();
    expect(homeContent[locale].companies.map((c) => c.name)).toEqual(['HERO Software', 'TEAM23', 'Amazon', 'IKEA']);
  });

  it('AK-51: keine Uhrzeile mehr auf der Startseite (jetzt im Footer)', () => {
    render(<Home locale={locale} />);
    expect(document.querySelector('time')).toBeNull();
    expect(screen.queryByText('Königsbrunn')).toBeNull();
  });

  it('AK-37: Faktenleiste steht im Abschnitt „Über mich“', () => {
    render(<Home locale={locale} />);
    const about = screen.getByRole('heading', { level: 2, name: homeContent[locale].aboutTitle }).closest('section')!;
    expect(about.querySelector('dl')).not.toBeNull();
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
    const ux = screen.getByRole('link', { name: 'Mehr zu UX/UI Design' });
    expect(ux).toHaveAccessibleDescription(/Von der ersten Idee/);
    const project = screen.getByRole('link', { name: "SIGHT'KICK" });
    expect(project).toHaveAccessibleDescription(/Masterprojekt/);
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
  it('Hero nennt Einsatzgebiet, aber nicht freiberuflich (AK-41)', () => {
    render(<Home locale="de" />);
    expect(screen.queryAllByText(/freiberuflich|freelance/i)).toHaveLength(0);
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
      refs: 'Referenzen',
      refsTitle: 'Ein Auszug meiner Projekte.',
      all: 'Alle Projekte ansehen',
      toProject: 'Zum Projekt',
      skType: 'Masterprojekt',
      offer: 'Was ich anbiete',
      offerEyebrow: 'Leistungen',
      contact: 'Kostenloses Erstgespräch',
      serviceMore: (title: string) => `Mehr zu ${title}`,
    },
    en: {
      tools: 'Tools I work with',
      about: 'About me',
      more: 'More about me',
      cta: "Tell me what you're planning",
      read: 'Read case study',
      refs: 'References',
      refsTitle: 'A selection of my projects.',
      all: 'View all projects',
      toProject: 'View project',
      skType: "Master's project",
      offer: 'What I offer',
      offerEyebrow: 'Services',
      contact: 'Free intro call',
      serviceMore: (title: string) => `More on ${title}`,
    },
  }[locale];
  const prefix = locale === 'en' ? '/en' : '';

  it('AK-35: kein Werkzeug-Abschnitt mehr auf der Startseite (ersetzt AK-20)', () => {
    render(<Home locale={locale} />);
    expect(screen.queryByRole('heading', { level: 2, name: t.tools })).toBeNull();
    expect(screen.queryByRole('button', { pressed: false })).toBeNull();
  });

  it('AK-64: zentrierter Kopf und Akkordeon mit sieben nummerierten Schaltern, erste offen', () => {
    render(<Home locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.offer }).closest('section')!;
    expect(section).toHaveTextContent(t.offerEyebrow);
    expect(section.querySelector('.sticky-stack')).toBeNull();
    const buttons = within(section).getAllByRole('button');
    expect(buttons).toHaveLength(7);
    buttons.forEach((b, i) => {
      expect(b.closest('h3')).not.toBeNull();
      expect(b).toHaveAccessibleName(services[i]![locale].title);
      expect(b).toHaveTextContent(String(i + 1).padStart(2, '0'));
      expect(b).toHaveAttribute('aria-expanded', i === 0 ? 'true' : 'false');
      const panel = document.getElementById(b.getAttribute('aria-controls')!)!;
      expect(panel).not.toBeNull();
      expect(panel.hasAttribute('data-open')).toBe(i === 0);
    });
  });

  it('AK-65: höchstens eine Leistung offen', () => {
    render(<Home locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.offer }).closest('section')!;
    const buttons = within(section).getAllByRole('button');
    const open = () => buttons.map((b) => b.getAttribute('aria-expanded'));
    const panelOpen = (i: number) =>
      document.getElementById(buttons[i]!.getAttribute('aria-controls')!)!.hasAttribute('data-open');
    fireEvent.click(buttons[2]!);
    expect(open()).toEqual(['false', 'false', 'true', 'false', 'false', 'false', 'false']);
    expect(panelOpen(2)).toBe(true);
    expect(panelOpen(0)).toBe(false);
    fireEvent.click(buttons[2]!);
    expect(open().every((v) => v === 'false')).toBe(true);
    expect(panelOpen(2)).toBe(false);
  });

  it('AK-66: Feld mit Platzhalterbild, allen Merkmalen und Link zur Leistung', () => {
    render(<Home locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.offer }).closest('section')!;
    for (const [i, s] of services.entries()) {
      const button = within(section).getAllByRole('button')[i]!;
      const panel = document.getElementById(button.getAttribute('aria-controls')!)!;
      const media = panel.querySelector('[data-service-media]')!;
      expect(media).toHaveAttribute('aria-hidden', 'true');
      expect(panel.querySelectorAll('ul li')).toHaveLength(s[locale].features.length);
      expect(within(panel).getByRole('link', { name: t.serviceMore(s[locale].title) })).toHaveAttribute(
        'href',
        `${prefix}/services/${s.slug}`,
      );
    }
    // Kein zweiter Erstgespräch-Button direkt vor dem im Ablauf (Kritiker)
    expect(within(section).queryByRole('link', { name: t.contact })).toBeNull();
  });

  it('AK-53/AK-54: dunkles Referenz-Band mit großen Karten, ohne „Fallstudie lesen“', () => {
    const { container } = render(<Home locale={locale} />);
    const h2 = screen.getByRole('heading', { level: 2, name: t.refsTitle });
    const section = h2.closest('section')!;
    expect(section).toHaveTextContent(t.refs);
    expect(within(section).getByRole('link', { name: t.all })).toHaveAttribute('href', `${prefix}/projects`);
    expect(container).not.toHaveTextContent(t.read);
    const link = within(section).getByRole('link', { name: "SIGHT'KICK" });
    expect(within(link).getByRole('heading', { level: 3 })).toHaveTextContent("SIGHT'KICK");
    const sk = projects.find((p) => p.slug === 'sightkick')!;
    expect(link).toHaveAccessibleDescription(new RegExp(`${sk.year}.*${t.skType}.*UX/UI`));
    expect(within(link).queryByRole('list')).toBeNull();
    // AK-56: Kreis „Zum Projekt“ ist dekorativ
    const circle = link.querySelector('[data-cursor]')!;
    expect(circle).toHaveTextContent(t.toProject);
    expect(circle).toHaveAttribute('aria-hidden', 'true');
    expect(section.querySelectorAll('[data-rail-track] > li')).toHaveLength(4);
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

// Restpunkte Umbau (#15, #17)
describe.each(['de', 'en'] as const)('Restpunkte Startseite (%s)', (locale) => {
  it('AK-38: Zahlen der Faktenleiste: Endwert für Screenreader, Ziffern dekorativ', () => {
    const { container } = render(<Home locale={locale} />);
    const counters = container.querySelectorAll('dd [data-count]');
    expect(counters.length).toBe(2);
    for (const c of counters) {
      expect(c).toHaveAttribute('aria-hidden', 'true');
      const sr = c.parentElement!.querySelector('.sr-only')!;
      expect(sr.textContent).toBe(c.getAttribute('data-count'));
    }
  });

  it('AK-39: FAQ-Auswahl mit vier Fragen und Link zu allen FAQs', () => {
    render(<Home locale={locale} />);
    const heading = screen.getByRole('heading', {
      level: 2,
      name: locale === 'de' ? 'Häufige Fragen' : 'Frequently asked questions',
    });
    const section = heading.closest('section')!;
    expect(within(section).getAllByRole('heading', { level: 3 })).toHaveLength(4);
    expect(within(section).getByRole('link', { name: locale === 'de' ? /Alle FAQs/ : /All FAQs/ })).toHaveAttribute(
      'href',
      locale === 'de' ? '/faqs' : '/en/faqs',
    );
  });
});

describe('AK-40: PreMatch auf der Startseite', () => {
  it('PreMatch zuerst, vier Karten, CPR nicht mehr dabei', () => {
    render(<Home locale="de" />);
    const links = screen.getAllByRole('link').filter((a) => /^\/projects\/[a-z]/.test(a.getAttribute('href') ?? ''));
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/projects/prematch',
      '/projects/sightkick',
      '/projects/indonesia',
      '/projects/webflow',
    ]);
    expect(screen.getByRole('link', { name: 'PreMatch' })).toHaveAccessibleDescription(/Masterarbeit/);
  });
});

describe('AK-41: nicht als freiberuflich bezeichnen', () => {
  it('keine Selbstbeschreibung als Freelancer in den Inhalten', async () => {
    const mods = await Promise.all([
      import('@/lib/content/home'),
      import('@/lib/content/about'),
      import('@/lib/content/local'),
      import('@/lib/llms'),
    ]);
    const text = JSON.stringify(mods.slice(0, 3)) + mods[3].llmsTxt();
    expect(text).not.toMatch(/freiberuflich|freelancer\b|freelance (ux|for)|a freelance/i);
  });
});

describe('AK-57/AK-58: Über-mich-Linien und Hero-Fotos', () => {
  it('Faktenleiste: volle Breite, äußere senkrechte Linien ab 768 px', () => {
    const { container } = render(<Home locale="de" />);
    const dl = container.querySelector('dl')!;
    expect(dl.parentElement!.className).toMatch(/border-t/);
    expect(dl.className).toMatch(/md:border-l/);
    for (const cell of dl.children) expect(cell.className).toMatch(/md:border-r(\s|$)/);
  });

  it('AK-54: jedes Referenz-Projekt hat ein Jahr', async () => {
    const { featuredProjects } = await import('@/lib/content/home');
    for (const p of featuredProjects) expect(projects.find((q) => q.slug === p.id)?.year).toBeTruthy();
  });

  it('drei Hero-Fotos, dekorativ', () => {
    expect(heroMedia.every((m) => m.src && m.width && m.height && m.width <= 800)).toBe(true);
    const { container } = render(<Home locale="de" />);
    const imgs = container.querySelectorAll('h1 [data-hero-media] img');
    expect(imgs).toHaveLength(3);
    for (const img of imgs) expect(img).toHaveAttribute('alt', '');
  });
});

describe.each([
  ['de', '', 'Ablauf', 'Projekte ansehen', '1. Kennenlernen'],
  ['en', '/en', 'Process', 'View projects', '1. '],
] as const)('AK-59/AK-60: Ablauf als Timeline (%s)', (locale, prefix, eyebrow, projectsLink, first) => {
  it('Kennzeichen, zwei Links, nummerierte h3 mit dekorativen Icons', () => {
    render(<Home locale={locale} />);
    const h2 = screen.getByRole('heading', { level: 2, name: homeContent[locale].process });
    const section = h2.closest('section')!;
    expect(section.className).toMatch(/bg-bg2/);
    expect(section).toHaveTextContent(eyebrow);
    expect(within(section).getByRole('link', { name: homeContent[locale].contact })).toHaveAttribute(
      'href',
      `${prefix}/contact`,
    );
    expect(within(section).getByRole('link', { name: projectsLink })).toHaveAttribute('href', `${prefix}/projects`);
    const steps = section.querySelectorAll('ol > li');
    expect(steps).toHaveLength(4);
    steps.forEach((li, i) => {
      const h3 = within(li as HTMLElement).getByRole('heading', { level: 3 });
      expect(h3.textContent).toMatch(new RegExp(`^${i + 1}\\. `));
      expect(li.querySelector('[data-step-icon]')).toHaveAttribute('aria-hidden', 'true');
      expect(li.querySelector('[data-step-icon] svg')).not.toBeNull();
    });
    expect(steps[0]!.querySelector('h3')!.textContent).toContain(first);
    expect(steps[3]!.querySelector('[data-step-line]')).toBeNull();
    expect(steps[0]!.querySelector('[data-step-line]')).not.toBeNull();
  });
});
