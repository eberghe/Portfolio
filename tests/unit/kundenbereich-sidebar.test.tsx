import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProjektRow } from '@/lib/kundenbereich/projekte';

// functions/kundenbereich/kunden-sidebar.md

vi.mock('@/app/actions/kundenbereich', () => ({ requestLoginLink: vi.fn(), confirmLogin: vi.fn(), logout: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: vi.fn(), headers: vi.fn() }));
const adresse = vi.hoisted(() => ({ pfad: '/kunden' }));
vi.mock('next/navigation', () => ({
  usePathname: () => adresse.pfad,
  useRouter: () => ({ refresh: vi.fn() }),
  redirect: vi.fn(),
}));

const { default: KundenNavigation } = await import('@/components/kundenbereich/KundenNavigation');
const { default: AdminNavigation } = await import('@/components/kundenbereich/admin/AdminNavigation');
const { default: Projektuebersicht } = await import('@/components/kundenbereich/Projektuebersicht');
const { default: KundenEinstellungen } = await import('@/components/kundenbereich/KundenEinstellungen');

const schritt = (n: number, status: 'offen' | 'aktiv' | 'erledigt', beschreibung_de: string | null = null) => ({
  id: `s${n}`,
  reihenfolge: n,
  titel_de: `Schritt ${n}`,
  titel_en: `Step ${n}`,
  beschreibung_de,
  beschreibung_en: null,
  status,
  faellig_am: null,
  verantwortlich: 'erik' as const,
});
type Dok = ProjektRow['dokumente'][number];
const dok = (id: string, titel: string, tag: number, version = 1): Dok => ({
  id,
  created_at: `2026-10-0${tag}T09:00:00Z`,
  art: 'datei',
  titel,
  dateiname: `${id}.pdf`,
  groesse_bytes: 1000,
  mime_typ: 'application/pdf',
  version,
});
const PROJEKT: ProjektRow = {
  id: 'p1',
  titel: 'Relaunch Website',
  status: 'in_arbeit',
  phase: 'Design',
  beschreibung_de: null,
  beschreibung_en: null,
  website_url: null,
  staging_url: null,
  kunden: { name: 'Kunde A' },
  termine: [],
  projektschritte: [schritt(1, 'erledigt'), schritt(2, 'aktiv', 'Zwei Entwürfe zur Auswahl.'), schritt(3, 'offen')],
  dokumente: [dok('d1', 'Briefing', 1), dok('d2', 'Moodboard', 2), dok('d3', 'Sitemap', 3), dok('d4', 'Angebot', 4)],
};
const ANNA = { art: 'kunde' as const, name: 'Anna', sprache: 'de' as const };
const ERIK = { art: 'admin' as const, name: 'Erik', sprache: 'de' as const };

const links = (name: string) =>
  within(screen.getByRole('navigation', { name }))
    .getAllByRole('link')
    .map((l) => [l.textContent, l.getAttribute('href')]);

describe('Sidebar des Kundenbereichs', () => {
  it('AK-1: fünf Bereiche in der Sprache der Seite, aktuelle Seite markiert', () => {
    adresse.pfad = '/kunden/ablauf';
    const { unmount } = render(<KundenNavigation locale="de" eingeklappt={false} />);
    expect(links('Kundenbereich')).toEqual([
      ['Übersicht', '/kunden'],
      ['Ablauf', '/kunden/ablauf'],
      ['Termine', '/kunden/termine'],
      ['Dokumente', '/kunden/dokumente'],
      ['Einstellungen', '/kunden/einstellungen'],
    ]);
    expect(screen.getByRole('link', { name: 'Ablauf' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Übersicht' })).not.toHaveAttribute('aria-current');
    unmount();
    adresse.pfad = '/en/clients';
    render(<KundenNavigation locale="en" eingeklappt={false} />);
    expect(links('Client area')).toEqual([
      ['Overview', '/en/clients'],
      ['Process', '/en/clients/process'],
      ['Meetings', '/en/clients/meetings'],
      ['Documents', '/en/clients/documents'],
      ['Settings', '/en/clients/settings'],
    ]);
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Back to website' })).toHaveAttribute('href', '/en');
  });

  it('AK-2: gewähltes Projekt wandert in alle Links mit', () => {
    adresse.pfad = '/kunden';
    render(<KundenNavigation locale="de" projekt="p 2" eingeklappt={false} />);
    for (const [, href] of links('Kundenbereich')) expect(href).toMatch(/\?projekt=p%202$/);
  });

  it('AK-3/AK-7: dieselbe Seitenleiste wie die Verwaltung, Abmelden unten', () => {
    adresse.pfad = '/kunden';
    const { container, unmount } = render(<KundenNavigation locale="de" eingeklappt={false} />);
    const kunde = container.querySelector('[data-sidebar]');
    expect(kunde).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Seitenleiste' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Abmelden' })).toHaveAttribute('type', 'submit');
    const klassen = kunde!.className;
    unmount();
    adresse.pfad = '/kunden/admin';
    const admin = render(<AdminNavigation neueAnfragen={0} eingeklappt={false} />);
    expect(admin.container.querySelector('[data-sidebar]')!.className).toBe(klassen);
  });
});

describe('Seiten des Kundenbereichs', () => {
  it('AK-4: Übersicht mit Kacheln, kurzem Ablauf und höchstens drei Dokumenten', () => {
    render(<Projektuebersicht locale="de" profil={ANNA} projekte={[PROJEKT]} bereich="uebersicht" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Übersicht' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Relaunch Website' })).toBeInTheDocument();
    const kacheln = within(screen.getByRole('list', { name: 'Auf einen Blick' })).getAllByRole('listitem');
    expect(kacheln).toHaveLength(4);
    for (const k of kacheln) expect(k.querySelector('svg')).not.toBeNull();
    const ablauf = screen.getByRole('region', { name: 'Ablauf' });
    expect(within(ablauf).getAllByRole('listitem')).toHaveLength(3);
    expect(ablauf).not.toHaveTextContent('Zwei Entwürfe zur Auswahl.');
    expect(within(ablauf).getByRole('link', { name: 'Ganzer Ablauf' })).toHaveAttribute('href', '/kunden/ablauf');
    const doks = screen.getByRole('region', { name: 'Neueste Dokumente' });
    expect(
      within(doks)
        .getAllByRole('listitem')
        .map((l) => l.textContent),
    ).toEqual([
      expect.stringContaining('Angebot'),
      expect.stringContaining('Sitemap'),
      expect.stringContaining('Moodboard'),
    ]);
    expect(within(doks).getByRole('link', { name: 'Alle Dokumente' })).toHaveAttribute('href', '/kunden/dokumente');
  });

  it('AK-4: ohne Dokumente Hinweis', () => {
    render(<Projektuebersicht locale="de" profil={ANNA} projekte={[{ ...PROJEKT, dokumente: [] }]} />);
    expect(screen.getByRole('region', { name: 'Neueste Dokumente' })).toHaveTextContent('Noch keine Dokumente.');
  });

  it('AK-5: Ablauf, Termine und Dokumente zeigen den ganzen Inhalt', () => {
    const { unmount } = render(<Projektuebersicht locale="de" profil={ANNA} projekte={[PROJEKT]} bereich="ablauf" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Ablauf' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Ablauf' })).toHaveTextContent('Zwei Entwürfe zur Auswahl.');
    expect(screen.getByRole('region', { name: 'Nächste Schritte' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Dokumente' })).toBeNull();
    unmount();
    const t = render(<Projektuebersicht locale="de" profil={ANNA} projekte={[PROJEKT]} bereich="termine" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Termine' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Nächster Termin' })).toHaveTextContent(
      'Gerade ist kein Termin geplant.',
    );
    t.unmount();
    render(<Projektuebersicht locale="en" profil={ANNA} projekte={[PROJEKT]} bereich="dokumente" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Documents' })).toBeInTheDocument();
    expect(within(screen.getByRole('region', { name: 'Documents' })).getAllByRole('link')).toHaveLength(4);
  });

  it('AK-6: Einstellungen mit Konto, Sprache, Darstellung', () => {
    adresse.pfad = '/kunden/einstellungen';
    const { unmount } = render(<KundenEinstellungen locale="de" profil={ANNA} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Einstellungen' })).toBeInTheDocument();
    const konto = screen.getByRole('region', { name: 'Konto' });
    expect(konto).toHaveTextContent('Anna');
    expect(konto).toHaveTextContent('Ansprechpartner');
    expect(screen.getByRole('link', { name: 'English version' })).toHaveAttribute('href', '/en/clients/settings');
    expect(screen.getByRole('radiogroup', { name: 'Darstellung' })).toBeInTheDocument();
    unmount();
    render(<KundenEinstellungen locale="en" profil={ANNA} />);
    expect(screen.getByRole('link', { name: 'Deutsche Version' })).toHaveAttribute('href', '/kunden/einstellungen');
    expect(screen.getByRole('radio', { name: 'Dark' })).toBeInTheDocument();
  });

  it('AK-9: Admin in der Kundenansicht hat einen Link zur Verwaltung', () => {
    render(<Projektuebersicht locale="de" profil={ERIK} projekte={[PROJEKT]} auswahl="p1" bereich="ablauf" />);
    expect(screen.getByRole('link', { name: 'Verwaltung' })).toHaveAttribute('href', '/kunden/admin');
  });
});
