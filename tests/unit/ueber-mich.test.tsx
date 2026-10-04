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
    const ol = heading.parentElement!.querySelector('ol')!;
    const items = within(ol).getAllByRole('listitem');
    expect(items).toHaveLength(timeline.length);
    expect(timeline.length).toBe(14);
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
    expect(aboutContent[locale].intro).toMatch(locale === 'de' ? /Freelancer|freiberuflich/ : /freelance/i);
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
  it('Zeitleiste endet mit dem Abschluss', () => {
    const last = timeline.at(-1)!;
    expect(last.date).toBe('2026-09');
    expect(last.de.title).toBe('Masterabschluss am MCI');
    expect(last.en.title).toBe("Master's degree from MCI");
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
