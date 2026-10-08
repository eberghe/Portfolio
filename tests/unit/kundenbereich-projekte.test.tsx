import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ProjektRow } from '@/lib/kundenbereich/projekte';

// functions/kundenbereich/projektuebersicht.md

vi.mock('@/app/actions/kundenbereich', () => ({ requestLoginLink: vi.fn(), confirmLogin: vi.fn(), logout: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: vi.fn(), headers: vi.fn() }));

const { projektAnsicht, waehleProjekt } = await import('@/lib/kundenbereich/projekte');
const { authApi } = await import('@/lib/kundenbereich/supabase');
const { default: Projektuebersicht } = await import('@/components/kundenbereich/Projektuebersicht');

const schritt = (
  n: number,
  status: 'offen' | 'aktiv' | 'erledigt',
  extra: Partial<ProjektRow['projektschritte'][number]> = {},
) => ({
  id: `s${n}`,
  reihenfolge: n,
  titel_de: `Schritt ${n}`,
  titel_en: `Step ${n}`,
  beschreibung_de: null,
  beschreibung_en: null,
  status,
  faellig_am: null,
  verantwortlich: 'erik' as const,
  ...extra,
});

const PROJEKT: ProjektRow = {
  id: 'p1',
  titel: 'Relaunch Website',
  status: 'in_arbeit',
  phase: 'Design',
  beschreibung_de: 'Neue Website mit Webflow.',
  beschreibung_en: null,
  website_url: 'https://kunde.example',
  staging_url: null,
  kunden: { name: 'Kunde A' },
  // absichtlich unsortiert
  projektschritte: [
    schritt(3, 'offen', { verantwortlich: 'kunde', faellig_am: '2026-10-15', titel_en: null }),
    schritt(1, 'erledigt'),
    schritt(2, 'aktiv'),
    schritt(4, 'offen'),
    schritt(5, 'offen'),
  ],
};
const ZWEITES: ProjektRow = { ...PROJEKT, id: 'p2', titel: 'Logo', status: 'angebot', projektschritte: [] };

const ANNA = { art: 'kunde' as const, name: 'Anna', sprache: 'de' as const };
const ERIK = { art: 'admin' as const, name: 'Erik', sprache: 'de' as const };

afterEach(() => vi.unstubAllGlobals());

describe('Projekte laden und aufbereiten', () => {
  it('AK-1: lädt mit dem Token des Nutzers, eingebettete Schritte, neueste zuerst; Fehler gibt null', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify([PROJEKT]), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const api = authApi({
      SUPABASE_URL: 'https://db.example/',
      SUPABASE_ANON_KEY: 'anon',
      SUPABASE_SERVICE_ROLE_KEY: 'geheim',
    })!;
    expect(await api.projekte('nutzer-token')).toEqual([PROJEKT]);
    const [url, init] = fetchMock.mock.calls[0]! as unknown as [string, RequestInit];
    const u = new URL(url);
    expect(u.origin + u.pathname).toBe('https://db.example/rest/v1/kundenprojekte');
    expect(u.searchParams.get('select')).toMatch(/kunden\(name\)/);
    expect(u.searchParams.get('select')).toMatch(/projektschritte\(/);
    expect(u.searchParams.get('order')).toBe('created_at.desc');
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer nutzer-token');
    expect(headers.apikey).toBe('anon');
    expect(JSON.stringify(init)).not.toContain('geheim');

    fetchMock.mockResolvedValueOnce(new Response('kaputt', { status: 500 }));
    expect(await api.projekte('nutzer-token')).toBeNull();
    fetchMock.mockRejectedValueOnce(new Error('offline'));
    expect(await api.projekte('nutzer-token')).toBeNull();
  });

  it('AK-2: sortiert, Sprache mit Rückfall, aktueller und nächste Schritte', () => {
    const de = projektAnsicht(PROJEKT, 'de');
    expect(de.schritte.map((s) => s.titel)).toEqual(['Schritt 1', 'Schritt 2', 'Schritt 3', 'Schritt 4', 'Schritt 5']);
    expect(de.aktuell).toBe('s2');
    expect(de.naechste.map((s) => s.id)).toEqual(['s2', 's3', 's4']);
    expect(de.beschreibung).toBe('Neue Website mit Webflow.');

    const en = projektAnsicht(PROJEKT, 'en');
    expect(en.schritte.map((s) => s.titel)).toEqual(['Step 1', 'Step 2', 'Schritt 3', 'Step 4', 'Step 5']);
    expect(en.beschreibung).toBe('Neue Website mit Webflow.');

    const ohneAktiv = { ...PROJEKT, projektschritte: [schritt(1, 'erledigt'), schritt(2, 'offen')] };
    expect(projektAnsicht(ohneAktiv, 'de').aktuell).toBe('s2');
    const fertig = { ...PROJEKT, projektschritte: [schritt(1, 'erledigt')] };
    expect(projektAnsicht(fertig, 'de').aktuell).toBeNull();
    expect(projektAnsicht(fertig, 'de').naechste).toEqual([]);

    expect(waehleProjekt([ZWEITES, PROJEKT], 'p1')).toBe(PROJEKT);
    expect(waehleProjekt([ZWEITES, PROJEKT], 'unbekannt')).toBe(ZWEITES);
    expect(waehleProjekt([ZWEITES, PROJEKT], undefined)).toBe(ZWEITES);
    expect(waehleProjekt([], 'p1')).toBeNull();
  });
});

describe('Projektübersicht', () => {
  it('AK-3: Titel, Status als Text, Phase, Beschreibung, Ablauf als Liste mit aktuellem Schritt', () => {
    render(<Projektuebersicht locale="de" profil={ANNA} projekte={[PROJEKT]} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Kundenbereich' })).toBeInTheDocument();
    expect(screen.getByText('Hallo, Anna')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abmelden' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Relaunch Website' })).toBeInTheDocument();
    expect(screen.getByText('In Arbeit')).toBeInTheDocument();
    expect(screen.getByText(/Aktuelle Phase: Design/)).toBeInTheDocument();
    expect(screen.getByText('Neue Website mit Webflow.')).toBeInTheDocument();

    const ablauf = screen.getByRole('list', { name: 'Ablauf' });
    expect(ablauf.tagName).toBe('OL');
    const items = within(ablauf).getAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(items[0]).toHaveTextContent('Erledigt');
    expect(items[1]).toHaveTextContent('Läuft gerade');
    expect(items[2]).toHaveTextContent('Offen');
    expect(items[2]).toHaveTextContent('bis 15. Okt. 2026');
    expect(items.filter((li) => li.getAttribute('aria-current') === 'step')).toEqual([items[1]]);
  });

  it('AK-4: nächste Schritte mit Zuständigkeit, sonst „Alles erledigt.“', () => {
    const { unmount } = render(<Projektuebersicht locale="de" profil={ANNA} projekte={[PROJEKT]} />);
    const naechste = within(screen.getByRole('list', { name: 'Nächste Schritte' })).getAllByRole('listitem');
    expect(naechste).toHaveLength(3);
    expect(naechste[0]).toHaveTextContent('Schritt 2');
    expect(naechste[0]).toHaveTextContent('Von mir');
    expect(naechste[1]).toHaveTextContent('Von dir');
    expect(naechste[1]).toHaveTextContent('bis 15. Okt. 2026');
    unmount();
    render(
      <Projektuebersicht
        locale="de"
        profil={ANNA}
        projekte={[{ ...PROJEKT, projektschritte: [schritt(1, 'erledigt')] }]}
      />,
    );
    expect(screen.getByText('Alles erledigt.')).toBeInTheDocument();
  });

  it('AK-5: Links nur wenn hinterlegt, neuer Tab mit Hinweis', () => {
    const { unmount } = render(<Projektuebersicht locale="de" profil={ANNA} projekte={[PROJEKT]} />);
    const website = screen.getByRole('link', { name: /Website.*\(öffnet in neuem Tab\)/ });
    expect(website).toHaveAttribute('href', 'https://kunde.example');
    expect(website).toHaveAttribute('target', '_blank');
    expect(website).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.queryByRole('link', { name: /Staging/ })).toBeNull();
    unmount();
    render(<Projektuebersicht locale="de" profil={ANNA} projekte={[{ ...PROJEKT, website_url: null }]} />);
    expect(screen.queryByRole('heading', { name: 'Links' })).toBeNull();
  });

  it('AK-6: Projektwahl bei mehreren Projekten', () => {
    const { unmount } = render(
      <Projektuebersicht locale="de" profil={ANNA} projekte={[ZWEITES, PROJEKT]} auswahl="p1" />,
    );
    const nav = screen.getByRole('navigation', { name: 'Deine Projekte' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['/kunden?projekt=p2', '/kunden?projekt=p1']);
    expect(links[1]).toHaveAttribute('aria-current', 'page');
    expect(links[0]).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('heading', { level: 2, name: 'Relaunch Website' })).toBeInTheDocument();
    unmount();
    render(<Projektuebersicht locale="de" profil={ANNA} projekte={[PROJEKT]} />);
    expect(screen.queryByRole('navigation', { name: 'Deine Projekte' })).toBeNull();
  });

  it('AK-7: Leer- und Fehler-Hinweis', () => {
    const { unmount } = render(<Projektuebersicht locale="de" profil={ANNA} projekte={[]} />);
    expect(screen.getByText(/Hier ist noch kein Projekt hinterlegt/)).toBeInTheDocument();
    unmount();
    render(<Projektuebersicht locale="de" profil={ANNA} projekte={null} />);
    expect(screen.getByText(/konnten gerade nicht geladen werden/)).toBeInTheDocument();
  });

  it('AK-8: Englisch, Admin sieht den Kundennamen', () => {
    render(<Projektuebersicht locale="en" profil={ERIK} projekte={[ZWEITES, PROJEKT]} auswahl="p1" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Client area' })).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Kunde A')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(screen.getByText(/Current phase: Design/)).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Your projects' })).toBeInTheDocument();
    expect(within(screen.getByRole('navigation', { name: 'Your projects' })).getAllByRole('link')[0]).toHaveAttribute(
      'href',
      '/en/clients?projekt=p2',
    );
    const items = within(screen.getByRole('list', { name: 'Process' })).getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Done');
    expect(items[1]).toHaveTextContent('Current');
    expect(items[2]).toHaveTextContent('Upcoming');
    expect(items[2]).toHaveTextContent('due 15 Oct 2026');
    expect(within(screen.getByRole('list', { name: 'Next steps' })).getAllByRole('listitem')[1]).toHaveTextContent(
      'From you',
    );
    expect(screen.getByRole('link', { name: /Website.*\(opens in a new tab\)/ })).toBeInTheDocument();
  });
});
