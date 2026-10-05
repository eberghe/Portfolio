import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import About from '@/components/about/About';
import { aboutContent, timeline, tools } from '@/lib/content/about';
import { faqs } from '@/lib/content/faq';
import { sitePaths } from '@/lib/routes';
import { llmsTxt } from '@/lib/llms';
import { person } from '@/lib/site';
import { profilePageJsonLd } from '@/lib/structured-data';

// functions/seiten/ueber-mich.md

describe('AK-1/AK-2', () => {
  it('eine h1, in der Sitemap, ProfilePage mit Person', () => {
    render(<About locale="de" />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(sitePaths()).toContain('/about');
    const data = profilePageJsonLd('de');
    expect(data['@type']).toBe('ProfilePage');
    expect(data.mainEntity['@id']).toBe('https://erik-bergheimer.de/#person');
  });
});

describe('AK-3/AK-4: Werkzeuge', () => {
  it('Liste genau einmal, Laufband dekorativ ohne Fokusziele', () => {
    const { container } = render(<About locale="de" />);
    const list = screen.getByRole('list', { name: 'Tools, mit denen ich arbeite' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(tools.length);
    const marquee = container.querySelector('[data-marquee]')!;
    expect(marquee).toHaveAttribute('aria-hidden', 'true');
    expect(marquee.querySelectorAll('a, button, [tabindex]')).toHaveLength(0);
  });

  it('Pause-Knopf mit aria-pressed', () => {
    render(<About locale="en" />);
    const button = screen.getByRole('button', { name: 'Pause animation' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('AK-5: Zeitleiste', () => {
  it('ol mit time und h3', () => {
    render(<About locale="de" />);
    const heading = screen.getByRole('heading', { level: 2, name: 'Mein Weg' });
    const ol = heading.closest('section')!.querySelector('ol')!;
    const items = within(ol).getAllByRole('listitem');
    expect(items).toHaveLength(timeline.length);
    expect(timeline.length).toBe(15);
    for (const li of items) {
      expect(li.querySelector('time[datetime]')).not.toBeNull();
      expect(within(li).getByRole('heading', { level: 3 })).toBeTruthy();
    }
  });
});

describe('AK-6: Deutsch auf der deutschen Seite', () => {
  it('keine vermeidbaren englischen Begriffe', () => {
    const text = timeline.map((t) => `${t.de.title} ${t.de.text}`).join(' ');
    expect(text).not.toMatch(/Working Student|Bachelor Thesis|High School/);
  });
});

describe('AK-8: Freelance', () => {
  it.each(['de', 'en'] as const)('%s', (locale) => {
    expect(aboutContent[locale].intro).toMatch(locale === 'de' ? /Freelancer|freiberuflich/i : /freelance/i);
    expect(aboutContent[locale].intro).toMatch(/Augsburg/);
  });
});

describe('AK-9: Zeitleiste', () => {
  it('Vergangenheit, kein Bild doppelt', () => {
    expect(timeline[0]!.de.text).not.toMatch(/ ist mein größter Traum|arbeite ich/);
    expect(timeline[0]!.en.text).not.toMatch(/my biggest dream is|I'm working/);
    const srcs = timeline.flatMap((t) => (t.image ? [t.image.src] : []));
    expect(new Set(srcs).size).toBe(srcs.length);
  });
});

describe('AK-10: Werkzeuge einheitlich', () => {
  it('jedes Werkzeug im Laufband steht in der FAQ-Antwort, kein Dribbble', () => {
    const answer = faqs.find((f) => f.id === 'tools')!.de.a;
    for (const t of tools) expect(answer).toContain(t.name);
    expect(tools.map((t) => t.name)).not.toContain('Dribbble');
  });
});

describe('AK-11: Master abgeschlossen', () => {
  it('Abschluss im September 2026, danach nur noch die neue Rolle (AK-13)', () => {
    const master = timeline.at(-2)!;
    expect(master.date).toBe('2026-09');
    expect(master.de.title).toBe('Masterabschluss am MCI');
    expect(master.en.title).toBe("Master's degree from MCI");
    const last = timeline.at(-1)!;
    expect(last.date).toBe('2026-09');
    expect(last.de.title).toBe('Business Development Manager bei HERO Software');
    expect(last.en.title).toBe('Business Development Manager at HERO Software');
  });

  it.each(['de', 'en'] as const)('kein laufendes Studium mehr (%s)', (locale) => {
    const all = [aboutContent[locale].intro, ...timeline.map((t) => t[locale].text)].join(' ');
    expect(all).not.toMatch(/studiere (ich )?jetzt|Aktuell studiere|pursuing|currently .*study|and study /i);
  });

  it('llms.txt und JSON-LD', () => {
    expect(llmsTxt()).not.toMatch(/studies Management/);
    expect(llmsTxt()).toMatch(/Master's .*MCI Innsbruck/);
    const alumni = JSON.stringify(person('de').alumniOf);
    expect(alumni).toContain('Ingolstadt');
    expect(alumni).toContain('MCI');
  });
});

describe('AK-12: Vergangenheit und Parität', () => {
  it.each(['de', 'en'] as const)('%s', (locale) => {
    const all = [aboutContent[locale].intro, ...timeline.map((t) => t[locale].text)].join(' ');
    expect(all).not.toMatch(/arbeite (ich )?jetzt|I'm now working|I am currently/);
    expect(JSON.stringify(person(locale).workLocation)).toContain(locale === 'de' ? 'Deutschland' : 'Germany');
  });
});

// Umbau nach Vorlage matteofabbiani.webflow.io/about (AK-14 bis AK-19)
describe.each(['de', 'en'] as const)('Umbau Über mich (%s)', (locale) => {
  const t = {
    de: { journey: 'Mein Weg', cta: 'Genug über mich. Jetzt bist du dran', contact: '/contact' },
    en: { journey: 'My journey', cta: 'Enough about me. Your turn', contact: '/en/contact' },
  }[locale];

  it('AK-14/AK-26: schlichter Hero mit Begrüßung, kurzer Vorstellung, Links und Foto', () => {
    render(<About locale={locale} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName(
      locale === 'de' ? 'Servus, ich bin Erik' : "Hi, I'm Erik",
    );
    expect(aboutContent[locale].intro.length).toBeLessThanOrEqual(160);
    const hero = screen.getByRole('heading', { level: 1 }).closest('section')!;
    const links = within(hero).getAllByRole('link');
    expect(links.map((l) => l.getAttribute('aria-label'))).toEqual([
      'Instagram',
      'LinkedIn',
      locale === 'de' ? 'E-Mail' : 'Email',
    ]);
    expect(hero.querySelectorAll('li.rounded-full')).toHaveLength(0);
    expect(hero.querySelectorAll('p')).toHaveLength(1);
    expect(screen.getByText(aboutContent[locale].intro)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: aboutContent[locale].photoAlt })).toBeInTheDocument();
  });

  it('AK-15: Tafeln mit time, h3 und Text; Platzhalter ohne img', () => {
    render(<About locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.journey }).closest('section')!;
    expect(section).toHaveAttribute('data-journey');
    const items = section.querySelectorAll('ol > li');
    expect(items).toHaveLength(timeline.length);
    timeline.forEach((entry, i) => {
      const li = items[i] as HTMLElement;
      expect(li.querySelector(`time[datetime="${entry.date}"]`)).not.toBeNull();
      expect(within(li).getByRole('heading', { level: 3 })).toHaveTextContent(entry[locale].title);
      expect(li).toHaveTextContent(entry[locale].text);
      expect(li.querySelectorAll('img')).toHaveLength(entry.image ? 1 : 0);
      if (!entry.image) expect(li.querySelector('[data-placeholder][aria-hidden="true"]')).not.toBeNull();
    });
  });

  it('AK-19: Abschluss mit Kontakt und E-Mail', () => {
    render(<About locale={locale} />);
    const section = screen.getByRole('heading', { level: 2, name: t.cta }).closest('section')!;
    expect(
      within(section)
        .getAllByRole('link')
        .map((l) => l.getAttribute('href')),
    ).toEqual(expect.arrayContaining([t.contact, expect.stringMatching(/^mailto:/)]));
  });
});

describe('AK-27: echte Stationsfotos', () => {
  it('Bachelorabschluss, Werkstudent und Vollzeit bei TEAM23 haben Fotos mit Bildausschnitt', () => {
    for (const title of ['Bachelorabschluss', 'Werkstudent bei TEAM23', 'UX/UI-Designer bei TEAM23 (Vollzeit)']) {
      const entry = timeline.find((t) => t.de.title === title)!;
      expect(entry, title).toBeDefined();
      expect(entry.image?.position, title).toMatch(/%/);
    }
    expect(timeline.find((t) => t.de.title === 'Bachelorabschluss')!.en.title).toBe("Bachelor's degree");
  });

  it('Bildausschnitt landet als object-position am Bild', () => {
    render(<About locale="de" />);
    const entry = timeline.find((t) => t.de.title === 'Werkstudent bei TEAM23')!;
    const img = screen.getByRole('img', { name: entry.image!.alt.de });
    expect(img.style.objectPosition).toBe(entry.image!.position);
  });
});
