import sharp from 'sharp';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProjectDetail from '@/components/projects/ProjectDetail';
import ProjectsOverview, { projectsOverviewText } from '@/components/projects/ProjectsOverview';
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
    expect(projects.map((p) => p.slug)).toEqual(['prematch', 'cpr', 'sightkick', 'indonesia', 'webflow', 'morocco']);
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
    expect(data.itemListElement[0]).toMatchObject({ url: 'https://erik-bergheimer.de/projects/prematch' });
  });
});

describe('AK-12: Kommt bald', () => {
  it('Titel vor Status, Bildfläche dekorativ', () => {
    render(<ProjectsOverview locale="de" />);
    const heading = screen.getByRole('heading', { name: 'ROSE Bikes App', level: 3 });
    const item = heading.closest('li')!;
    const text = item.textContent!;
    expect(text.indexOf('ROSE Bikes App')).toBeLessThan(text.lastIndexOf('Kommt bald'));
    for (const el of item.querySelectorAll('[aria-hidden="true"]'))
      expect(el.textContent).not.toContain('ROSE Bikes App');
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

describe('Umbau Übersicht (Issue #18)', () => {
  it('AK-24: Meta-Description nennt Augsburg', () => {
    for (const l of locales) expect(projectsOverviewText[l].metaDescription).toContain('Augsburg');
    for (const l of locales) expect(projectsOverviewText[l].metaDescription.length).toBeLessThanOrEqual(160);
  });

  it('AK-18: Überline, eine h1, Untertitel', () => {
    const { container } = render(<ProjectsOverview locale="de" />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(container.querySelector('header')).toHaveTextContent(/^Projekte/);
    expect(container.querySelector('header p:last-child')!.textContent!.length).toBeGreaterThan(20);
  });

  it('AK-19: Filter mit aria-pressed blendet Projekte aus und nennt die Anzahl', () => {
    render(<ProjectsOverview locale="de" />);
    const group = screen.getByRole('group', { name: 'Projekte filtern' });
    const all = within(group).getByRole('button', { name: 'Alle' });
    expect(all).toHaveAttribute('aria-pressed', 'true');
    const foto = within(group).getByRole('button', { name: 'Fotografie' });
    expect(foto).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(foto);
    expect(foto).toHaveAttribute('aria-pressed', 'true');
    expect(all).toHaveAttribute('aria-pressed', 'false');
    const photo = projects.filter((p) => p.service === 'photography');
    for (const p of projects) {
      const visible = photo.includes(p);
      expect(screen.queryByRole('link', { name: p.de.title }) !== null, p.slug).toBe(visible);
    }
    expect(screen.getByRole('status')).toHaveTextContent(`${photo.length} Projekte`);
    fireEvent.click(all);
    for (const p of projects) expect(screen.getByRole('link', { name: p.de.title })).toBeInTheDocument();
  });

  it('AK-19: englische Filter', () => {
    render(<ProjectsOverview locale="en" />);
    const group = screen.getByRole('group', { name: 'Filter projects' });
    for (const name of ['All', 'UX/UI', 'Web', 'Photography'])
      expect(within(group).getByRole('button', { name })).toBeInTheDocument();
  });

  it('AK-20: große Karten mit h2, Chips, Jahr, Untertitel und „Fallstudie lesen“', () => {
    render(<ProjectsOverview locale="de" />);
    for (const p of projects) {
      const h2 = screen.getByRole('heading', { level: 2, name: p.de.title });
      const card = h2.closest('li')!;
      // Chips sind sichtbar, für Screenreader steht der Typ schon in der Beschreibung des Links
      const chips = card.querySelector('ul')!;
      expect(chips).toHaveAttribute('aria-hidden', 'true');
      expect([...chips.querySelectorAll('li')].map((li) => li.textContent)).toEqual(p.de.type.split(' · '));
      expect(card).toHaveTextContent(p.year);
      expect(card).toHaveTextContent(p.de.tagline);
      expect(card).toHaveTextContent(p.service === 'photography' ? 'Fotoserie ansehen' : 'Fallstudie lesen');
      expect(card).toHaveAttribute('data-reveal');
    }
  });

  it('AK-21: Kommt bald als eigener Abschnitt mit h3', () => {
    render(<ProjectsOverview locale="de" />);
    const section = screen.getByRole('region', { name: 'In Arbeit' });
    for (const c of comingSoon)
      expect(within(section).getByRole('heading', { level: 3, name: c.de.title })).toBeInTheDocument();
  });

  it('AK-22: Abschluss-CTA zur Kontaktseite', () => {
    render(<ProjectsOverview locale="en" />);
    const h2s = screen.getAllByRole('heading', { level: 2 });
    const cta = h2s[h2s.length - 1]!.closest('section')!;
    expect(within(cta).getByRole('link', { name: 'Free intro call' })).toHaveAttribute('href', '/en/contact');
  });
});

describe('PreMatch (Masterarbeit)', () => {
  const p = find('prematch');

  it('AK-25: Projekt aus 2026, UX/UI, nicht mehr in Arbeit', () => {
    expect(p.year).toBe('2026');
    expect(p.service).toBe('ux-ui-design');
    expect(comingSoon.map((c) => c.slug)).not.toContain('prematch');
  });

  it('AK-26: drei Phasen, Bilder an der passenden Stelle', () => {
    for (const l of locales)
      expect(p[l].sections.map((s) => s.id)).toEqual(['problem', 'benchmarking', 'design', 'study', 'limits']);
    expect(p.inlineImages.sketches).toHaveLength(2);
    expect(p.inlineImages.friction).toHaveLength(2);
    render(<ProjectDetail project={p} locale="de" />);
    const friction = screen.getByRole('heading', { level: 3, name: 'Positive Friction' }).parentElement!;
    for (const img of p.inlineImages.friction!)
      expect(within(friction).getByRole('img', { name: img.alt.de })).toBeInTheDocument();
  });

  it('AK-29: Diagramme direkt unter dem Abschnitt, einspaltig', () => {
    expect(p.inlineImages.benchmarking).toHaveLength(1);
    expect(p.inlineImages.study).toHaveLength(4);
    render(<ProjectDetail project={p} locale="de" />);
    const study = screen.getByRole('region', { name: 'Phase III: Nutzerstudie' });
    for (const img of p.inlineImages.study!)
      expect(within(study).getByRole('img', { name: img.alt.de })).toBeInTheDocument();
    expect(within(study).getAllByRole('list')[0]).toHaveClass('grid-cols-1');
    for (const img of p.inlineImages.study!) expect(img.alt.de).toMatch(/\d/);
  });

  it.each(locales)('AK-27: Kennzahlen mit Quelle in der Sprache (%s)', (locale) => {
    render(<ProjectDetail project={p} locale={locale} />);
    const region = screen.getByRole('region', { name: locale === 'de' ? 'Kennzahlen' : 'Key figures' });
    expect(region).toHaveTextContent(locale === 'de' ? '90,0' : '90.0');
    expect(region).toHaveTextContent('70');
    expect(region).toHaveTextContent(locale === 'de' ? 'Nutzerstudie' : 'User study');
  });

  it.each([p.thumbnail, ...p.gallery, ...Object.values(p.inlineImages).flat()].map((i) => [i.src, i] as const))(
    'AK-28: %s',
    async (src, img) => {
      const meta = await sharp(`public${src}`).metadata();
      expect([meta.width, meta.height]).toEqual([img.width, img.height]);
      expect(img.width).toBeGreaterThanOrEqual(1000);
      if (src.includes('screen')) expect(meta.hasAlpha).toBe(true);
    },
  );
});
