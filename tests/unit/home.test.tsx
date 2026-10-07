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
      // Neben dem Link zur Leistung trägt auch der Sprunglink links den Titel (AK-71)
      const links = screen.getAllByRole('link', {
        name: new RegExp(s[locale].title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      });
      expect(links.map((l) => l.getAttribute('href'))).toContain(`${prefix}/services/${s.slug}`);
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

  it('AK-75/AK-29: Firmenkacheln öffnen ein Fenster, HERO Software hervorgehoben', () => {
    render(<Home locale={locale} />);
    const h2 = screen.getByRole('heading', {
      level: 2,
      name: locale === 'de' ? 'Unternehmen, für die ich gearbeitet habe' : "Companies I've worked for",
    });
    const section = h2.closest('section')!;
    expect(within(section).queryAllByRole('link')).toHaveLength(0);
    const buttons = within(section).getAllByRole('button');
    expect(buttons).toHaveLength(4);
    for (const b of buttons) {
      expect(b).toHaveAttribute('aria-haspopup', 'dialog');
      expect(b.querySelector('[data-company-plus]')).toHaveAttribute('aria-hidden', 'true');
    }
    // AK-32: Teile des Namens mit Pausen, jeder Eintrag mit ehrlicher Rolle, kein Hinweis auf neuen Tab mehr
    expect(buttons[0]).toHaveAccessibleName(
      locale === 'de'
        ? 'HERO Software, Aktuell, Business Development Manager'
        : 'HERO Software, Current, Business Development Manager',
    );
    // AK-34: echte Logos als einfarbige SVG-Dateien, dekorativ
    const logos = buttons.map((b) => b.querySelector('img')!);
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

  it('AK-76/AK-77: Fenster mit Rolle, Zeitraum, Text und Website-Link, X schließt', () => {
    render(<Home locale={locale} />);
    const tc = homeContent[locale];
    tc.companies.forEach((c, i) => {
      const section = screen.getByRole('heading', { level: 2, name: tc.companiesTitle }).closest('section')!;
      fireEvent.click(within(section).getAllByRole('button')[i]!);
      const dialog = screen.getByRole('dialog', { name: c.name });
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveTextContent(c.role);
      expect(dialog).toHaveTextContent(c.period);
      expect(dialog).toHaveTextContent(c.summary);
      for (const d of c.duties) expect(dialog).toHaveTextContent(d);
      const site = within(dialog).getByRole('link', { name: new RegExp(tc.companyWebsite(c.name)) });
      expect(site).toHaveAttribute('href', c.url);
      expect(site).toHaveAttribute('target', '_blank');
      fireEvent.click(within(dialog).getByRole('button', { name: tc.close }));
      expect(screen.queryByRole('dialog')).toBeNull();
    });
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
    // Die Beschreibung steht direkt davor, sie wird nicht ein zweites Mal vorgelesen (Kritiker AK-72)
    const ux = screen.getByRole('link', { name: 'Mehr zu UX/UI Design' });
    expect(ux).toHaveAccessibleDescription('');
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
      offerNav: 'Leistungen auf dieser Seite',
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
      offerNav: 'Services on this page',
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

  it('AK-71: Kopf bleibt, links Sprungnavigation mit allen sieben Leistungen', () => {
    render(<Home locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.offer }).closest('section')!;
    expect(section).toHaveTextContent(t.offerEyebrow);
    expect(within(section).queryAllByRole('button')).toHaveLength(0);
    const nav = within(section).getByRole('navigation', { name: t.offerNav });
    const links = within(nav).getAllByRole('link');
    expect(links.map((l) => l.textContent)).toEqual(services.map((s) => s[locale].title));
    links.forEach((l, i) => {
      const id = `leistung-${services[i]!.slug}`;
      expect(l).toHaveAttribute('href', `#${id}`);
      expect(section.querySelector(`#${id}`)).not.toBeNull();
    });
    expect(nav.closest('[data-services-rail]')).toHaveClass('md:sticky');
  });

  it('AK-72: je Leistung h3, Beschreibung, alle Merkmale, Link und Platzhalterbild', () => {
    render(<Home locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.offer }).closest('section')!;
    expect(
      within(section)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent),
    ).toEqual(services.map((s) => s[locale].title));
    for (const s of services) {
      const item = section.querySelector(`#leistung-${s.slug}`)!;
      expect(item).toHaveTextContent(s[locale].description);
      expect(item.querySelectorAll('ul li')).toHaveLength(s[locale].features.length);
      // Platzhalter dekorativ, echtes Bild mit Alt-Text (leistungen.md AK-38)
      if (s.image) expect(item.querySelector('[data-service-media]')).not.toHaveAttribute('aria-hidden');
      else expect(item.querySelector('[data-service-media]')).toHaveAttribute('aria-hidden', 'true');
      expect(within(item as HTMLElement).getByRole('link', { name: t.serviceMore(s[locale].title) })).toHaveAttribute(
        'href',
        `${prefix}/services/${s.slug}`,
      );
    }
    // Kein zweiter Erstgespräch-Button direkt vor dem im Ablauf (Kritiker)
    expect(within(section).queryByRole('link', { name: t.contact })).toBeNull();
  });

  it('AK-73: ohne Scrollen ist die erste Leistung hervorgehoben', () => {
    render(<Home locale={locale} />);
    const nav = screen.getByRole('navigation', { name: t.offerNav });
    const links = within(nav).getAllByRole('link');
    expect(links[0]).toHaveAttribute('aria-current', 'location');
    links.slice(1).forEach((l) => expect(l).not.toHaveAttribute('aria-current'));
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

describe('AK-79: Inhalte der Firmen-Fenster', () => {
  it.each(['de', 'en'] as const)('%s', (locale) => {
    const companies = homeContent[locale].companies;
    for (const c of companies) {
      expect(c.duties.length, c.name).toBeGreaterThanOrEqual(3);
      expect(c.summary.split(/(?<=[.!?])\s+/).length, c.name).toBeLessThanOrEqual(3);
      expect([c.summary, ...c.duties].join(' '), c.name).not.toMatch(/[–—]/);
    }
    const all = (name: string) => {
      const c = companies.find((x) => x.name === name)!;
      return [c.summary, ...c.duties].join(' ');
    };
    expect(all('HERO Software')).toMatch(/Conkret/);
    expect(all('HERO Software')).toMatch(/CRM/);
    expect(all('TEAM23')).toMatch(/Figma/);
    expect(all('TEAM23')).toMatch(/Indonesi/);
    expect(companies.find((c) => c.name === 'Amazon')!.period).toMatch(
      locale === 'de' ? /April bis September 2019/ : /April to September 2019/,
    );
    expect(all('IKEA')).toMatch(/Småland/);
    expect(companies.find((c) => c.name === 'IKEA')!.period).toMatch(
      locale === 'de' ? /Juli bis September 2018/ : /July to September 2018/,
    );
    expect(homeContent[locale].companyDuties).toBe(locale === 'de' ? 'Aufgaben' : 'What I did');
  });
});

describe('AK-38 (leistungen.md): Bild Design Systeme auf der Startseite', () => {
  it.each(['de', 'en'] as const)('%s', (locale) => {
    render(<Home locale={locale} />);
    const ds = services.find((s) => s.slug === 'design-systems')!;
    const img = screen.getByRole('img', { name: ds.image![locale === 'de' ? 'alt' : 'altEn'] });
    expect(img.getAttribute('src')).toMatch(/design-systeme/);
  });
});

// leistungen.md AK-43: echte Leistungsbilder unbeschnitten in 16:9 und mit Qualität 90
describe('AK-43: Leistungsbilder unbeschnitten', () => {
  it('Rahmen 16:9, verlustfreies Original (Qualität 90 prüft die E2E)', () => {
    const { container } = render(<Home locale="de" />);
    const withImage = services.filter((s) => s.image);
    expect(withImage.length).toBeGreaterThanOrEqual(3);
    for (const s of withImage) {
      const img = screen.getByRole('img', { name: s.image!.alt });
      const frame = img.closest('[data-service-media]')!;
      expect(frame.className).toContain('aspect-[16/9]');
      expect(frame.className).not.toMatch(/aspect-\[2\/1\]|aspect-\[16\/10\]/);
      expect(s.image!.src).toMatch(/\.png$/);
    }
    expect(container).toBeTruthy();
  });
});
