import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProjectDetail from '@/components/projects/ProjectDetail';
import ProjectsOverview from '@/components/projects/ProjectsOverview';
import { comingSoon, projects, type Project } from '@/lib/content/projects';
import { services } from '@/lib/content/services';
import { projectBreadcrumbJsonLd, projectJsonLd, projectsItemListJsonLd } from '@/lib/structured-data';

// functions/seiten/projekte.md
const find = (slug: string) => projects.find((p) => p.slug === slug)!;
const locales = ['de', 'en'] as const;

describe('AK-10: Inhalte vollständig', () => {
  it.each(projects.flatMap((p) => locales.map((l) => [p.slug, l, p] as const)))('%s (%s)', (_s, l, p) => {
    const t = p[l];
    for (const v of [t.title, t.tagline, t.body, t.type, t.role, t.metaTitle, t.metaDescription])
      expect(v.trim()).not.toBe('');
  });

  it('bestehende Projekte in der Reihenfolge des Bestands', () => {
    expect(projects.map((p) => p.slug)).toEqual(['cpr', 'sightkick', 'indonesia', 'webflow', 'morocco']);
  });
});

describe('AK-3: Bilder', () => {
  const images = projects.flatMap((p) => [...p.gallery, ...Object.values(p.inlineImages).flat()]);

  it('beschreibende Alt-Texte je Sprache, feste Maße', () => {
    expect(images.length).toBeGreaterThanOrEqual(17);
    for (const img of images) {
      for (const l of locales) {
        expect(img.alt[l].length, img.src).toBeGreaterThan(15);
        expect(img.alt[l]).not.toMatch(/^\S+ \d+$/);
      }
      expect(img.alt.de).not.toBe(img.alt.en);
      expect(img.width).toBeGreaterThan(0);
      expect(img.height).toBeGreaterThan(0);
    }
  });

  it('Galerie-Bilder auf der Seite tragen den Alt-Text der Sprache', () => {
    const p = find('indonesia');
    render(<ProjectDetail project={p} locale="en" />);
    for (const img of p.gallery) expect(screen.getByRole('img', { name: img.alt.en })).toBeInTheDocument();
  });

  it('Vorschaubilder in Kacheln sind dekorativ', () => {
    const { container } = render(<ProjectsOverview locale="de" />);
    const imgs = container.querySelectorAll('ul img');
    expect(imgs.length).toBe(projects.length);
    for (const img of imgs) expect(img).toHaveAttribute('alt', '');
  });
});

describe('AK-2: Kennzahlen nur mit Quelle', () => {
  it('kein Kennzahlen-Block ohne Werte', () => {
    render(<ProjectDetail project={find('cpr')} locale="de" />);
    expect(screen.queryByRole('region', { name: 'Kennzahlen' })).toBeNull();
  });

  it('Block mit Quelle, wenn Werte hinterlegt sind', () => {
    const p: Project = {
      ...find('cpr'),
      metrics: [{ value: '+40 %', label: { de: 'Anfragen', en: 'Enquiries' }, source: 'Google Analytics, 2025' }],
    };
    render(<ProjectDetail project={p} locale="de" />);
    const region = screen.getByRole('region', { name: 'Kennzahlen' });
    expect(region).toHaveTextContent('+40 %');
    expect(region).toHaveTextContent('Google Analytics, 2025');
  });
});

describe('AK-4: strukturierte Daten', () => {
  it('CreativeWork mit Autor und Jahr', () => {
    const data = projectJsonLd(find('webflow'), 'de');
    expect(data['@type']).toBe('CreativeWork');
    expect(data.name).toBe('Webflow vs. Shopify');
    expect(data.author).toMatchObject({ '@type': 'Person', name: 'Erik Bergheimer' });
    expect(data.dateCreated).toBe('2023');
    expect(data.inLanguage).toBe('de');
    expect(data.url).toBe('https://erik-bergheimer.de/projects/webflow');
  });

  it('Breadcrumbs Start › Projekte › Projekt', () => {
    const data = projectBreadcrumbJsonLd(find('cpr'), 'en');
    expect(data.itemListElement.map((i) => i.name)).toEqual(['Home', 'Projects', 'CPR Training AR App']);
  });
});

describe('AK-6: Aufbau der Detailseite', () => {
  it.each(locales)('Überschriften und Meta-Leiste (%s)', (locale) => {
    const p = find('cpr');
    const { container } = render(<ProjectDetail project={p} locale={locale} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(p[locale].title);
    for (const s of p[locale].sections) expect(screen.getByRole('heading', { level: 2, name: s.title })).toBeTruthy();
    const subs = p[locale].sections.flatMap((s) => s.subsections ?? []);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(subs.length);
    const dl = container.querySelector('dl')!;
    expect(dl).toHaveTextContent(locale === 'de' ? 'Rolle' : 'Role');
    expect(dl).toHaveTextContent(p[locale].role);
  });
});

describe('AK-7: Inhaltsverzeichnis', () => {
  it('benannte Navigation mit Links auf alle Abschnitte', () => {
    const p = find('webflow');
    render(<ProjectDetail project={p} locale="de" />);
    const navs = screen.getAllByRole('navigation', { name: 'Inhaltsverzeichnis' });
    const links = within(navs[0]!).getAllByRole('link');
    expect(links.map((l) => l.getAttribute('href'))).toEqual(p.de.sections.map((s) => `#${s.id}`));
  });
});

describe('AK-8: Übersicht', () => {
  it('Kachel-Links heißen wie das Projekt, Kommt-bald ohne Link', () => {
    render(<ProjectsOverview locale="de" />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    for (const p of projects) {
      const link = screen.getByRole('link', { name: p.de.title });
      expect(link).toHaveAttribute('href', `/projects/${p.slug}`);
      expect(link).toHaveAccessibleDescription(/\S/);
    }
    for (const c of comingSoon) {
      expect(screen.getByText(c.de.title)).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: c.de.title })).toBeNull();
    }
  });
});

describe('AK-10: Meta-Daten', () => {
  it.each(projects.flatMap((p) => locales.map((l) => [p.slug, l, p] as const)))('%s (%s)', (_s, l, p) => {
    expect(p[l].metaTitle).toMatch(/\| Erik Bergheimer$/);
    expect(p[l].metaTitle.length).toBeLessThanOrEqual(70);
    expect(p[l].metaDescription.length).toBeLessThanOrEqual(160);
  });
});

describe('AK-11: ItemList', () => {
  it('alle Projekte', () => {
    const data = projectsItemListJsonLd('de', projects);
    expect(data.itemListElement).toHaveLength(projects.length);
    expect(data.itemListElement[0]).toMatchObject({ url: 'https://erik-bergheimer.de/projects/cpr' });
  });
});

describe('AK-12: Kommt bald', () => {
  it('Titel vor Status, Bildfläche dekorativ', () => {
    render(<ProjectsOverview locale="de" />);
    const heading = screen.getByRole('heading', { name: 'PreMatch' });
    const item = heading.closest('li')!;
    const text = item.textContent!;
    expect(text.indexOf('PreMatch')).toBeLessThan(text.lastIndexOf('Kommt bald'));
    for (const el of item.querySelectorAll('[aria-hidden="true"]')) expect(el.textContent).not.toContain('PreMatch');
    expect(item.querySelector('[aria-hidden="true"]')).toHaveTextContent('Kommt bald');
  });
});

describe('AK-13: mobiles Inhaltsverzeichnis', () => {
  it('schließt, wenn der Fokus es verlässt', () => {
    render(<ProjectDetail project={find('webflow')} locale="de" />);
    const button = screen.getByRole('button', { name: 'Inhaltsverzeichnis' });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const panel = document.getElementById(button.getAttribute('aria-controls')!)!;
    fireEvent.focusOut(within(panel).getAllByRole('link').at(-1)!, { relatedTarget: document.body });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('AK-14: Namen der Galerie-Buttons', () => {
  it('DE und EN', () => {
    const p = find('indonesia');
    const { unmount } = render(<ProjectDetail project={p} locale="de" />);
    expect(screen.getByRole('button', { name: `Bild 1 von 7 vergrößern: ${p.gallery[0]!.alt.de}` })).toBeTruthy();
    unmount();
    render(<ProjectDetail project={p} locale="en" />);
    expect(screen.getByRole('button', { name: `Enlarge image 1 of 7: ${p.gallery[0]!.alt.en}` })).toBeTruthy();
  });
});

describe('AK-15: Phasen als Liste', () => {
  it('„Unser Prozess" ist eine Liste', () => {
    render(<ProjectDetail project={find('cpr')} locale="de" />);
    const heading = screen.getByRole('heading', { level: 3, name: 'Unser Prozess' });
    const list = within(heading.parentElement!).getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  });
});

describe('AK-16: Titelbild', () => {
  it.each(locales)('beschreibender Alt-Text (%s)', (l) => {
    for (const p of projects) expect(p.thumbnail.alt[l].length, p.slug).toBeGreaterThan(15);
    const p = find('cpr');
    render(<ProjectDetail project={p} locale={l} />);
    expect(screen.getByRole('img', { name: p.thumbnail.alt[l] })).toBeInTheDocument();
  });
});

describe('AK-17: passende Leistung', () => {
  it('Webflow vs. Shopify verlinkt Webflow-Entwicklung', () => {
    render(<ProjectDetail project={find('webflow')} locale="de" />);
    expect(screen.getByRole('link', { name: /Webflow-Entwicklung/ })).toHaveAttribute(
      'href',
      '/services/webflow-development',
    );
  });

  it('jede Leistung existiert', () => {
    for (const p of projects)
      expect(
        services.some((s) => s.slug === p.service),
        p.slug,
      ).toBe(true);
  });
});
