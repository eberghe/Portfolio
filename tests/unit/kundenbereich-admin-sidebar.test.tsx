import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AdminState } from '@/lib/kundenbereich/admin/aktionen';
import type { Anfrage, DashboardProjekt } from '@/lib/kundenbereich/admin/dashboard';
import type { KundeZeile, ProjektDetail } from '@/lib/kundenbereich/admin/laden';

// functions/kundenbereich/admin-sidebar.md

const aktionen = vi.hoisted(() =>
  Object.fromEntries(
    [
      'kundeAnlegen',
      'kundeSpeichern',
      'kundeStatus',
      'logoVorbereiten',
      'logoUebernehmen',
      'ansprechpartnerHinzufuegen',
      'ansprechpartnerEntfernen',
      'ansprechpartnerEinladen',
      'projektSpeichern',
      'projektStatus',
      'projektAnsprechpartner',
      'schrittHinzufuegen',
      'schrittSpeichern',
      'schrittEntfernen',
      'terminHinzufuegen',
      'terminEntfernen',
      'dokumentVorbereiten',
      'dokumentUebernehmen',
      'dokumentEntfernen',
      'umsatzSpeichern',
      'anfrageStatus',
      'projektMitAssistent',
    ].map((n) => [n, vi.fn(async (): Promise<AdminState> => ({ status: 'ok', message: 'Gespeichert.' }))]),
  ),
);
vi.mock('@/app/actions/kundenbereich-admin', () => aktionen);
vi.mock('@/app/actions/kundenbereich', () => ({ logout: vi.fn() }));
const adresse = vi.hoisted(() => ({ pfad: '/kunden/admin' }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  usePathname: () => adresse.pfad,
  notFound: vi.fn(),
}));

const { default: AdminNavigation } = await import('@/components/kundenbereich/admin/AdminNavigation');
const { default: AdminProjekte } = await import('@/components/kundenbereich/admin/AdminProjekte');
const { default: AdminKunden } = await import('@/components/kundenbereich/admin/AdminKunden');
const { default: AdminAnfragen } = await import('@/components/kundenbereich/admin/AdminAnfragen');
const { default: AdminProjekt } = await import('@/components/kundenbereich/admin/AdminProjekt');
const { default: AdminSettings } = await import('@/components/kundenbereich/admin/AdminSettings');

const K = '10000000-0000-4000-8000-00000000000a';
const P = '20000000-0000-4000-8000-00000000000b';
const NOW = new Date('2026-10-08T10:00:00Z');

afterEach(() => {
  adresse.pfad = '/kunden/admin';
  document.cookie = 'kb_sidebar=; max-age=0; path=/';
});

const projekt: DashboardProjekt = {
  id: P,
  titel: 'Relaunch',
  status: 'in_arbeit',
  kunden: { id: K, name: 'Bäckerei' },
  projekt_umsatz: { auftragswert_netto: '12000', wahrscheinlichkeit: 100, abrechnung_am: '2026-11-30' },
  projektschritte: [{ titel_de: 'Design', status: 'aktiv', reihenfolge: 1, verantwortlich: 'erik' }],
};

const kunde: KundeZeile = {
  id: K,
  name: 'Bäckerei',
  status: 'aktiv',
  logo_freigabe: 'erteilt',
  logo_freigabe_am: '2026-10-08T09:00:00Z',
  kundenprojekte: [{ count: 2 }],
  ansprechpartner: [{ count: 1 }],
};

const anfrage: Anfrage = {
  id: '30000000-0000-4000-8000-00000000000c',
  created_at: '2026-10-07T10:00:00Z',
  name: 'Clara Muster',
  email: 'clara@example.org',
  telefon: null,
  website: null,
  leistungen: ['web-design-development'],
  zeitrahmen: 'bald',
  budget: '2000-5000',
  beschreibung: 'Neue Website.',
  status: 'neu',
  sprache: 'de',
};

const DETAIL: ProjektDetail = {
  id: P,
  kunde_id: K,
  titel: 'Relaunch',
  status: 'in_arbeit',
  phase: 'Design',
  beschreibung_de: null,
  beschreibung_en: null,
  website_url: null,
  staging_url: null,
  kunden: { id: K, name: 'Bäckerei', ansprechpartner: [{ id: 'a1', name: 'Anna', email: 'anna@b.example' }] },
  projekt_ansprechpartner: [{ ansprechpartner_id: 'a1' }],
  projekt_umsatz: null,
  projektschritte: [],
  termine: [],
  dokumente: [],
};

/** Öffnet das ⋯-Menü und liefert das Menü */
function oeffne(name: string) {
  const knopf = screen.getByRole('button', { name });
  fireEvent.click(knopf);
  return { knopf, menue: screen.getByRole('menu') };
}

describe('Sidebar', () => {
  it('AK-1: fünf Bereiche in fester Reihenfolge, aktueller markiert', () => {
    adresse.pfad = '/kunden/admin/projekte/' + P;
    render(<AdminNavigation neueAnfragen={0} eingeklappt={false} />);
    const nav = screen.getByRole('navigation', { name: 'Verwaltung' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((l) => l.getAttribute('aria-label') ?? l.textContent?.trim())).toEqual([
      'Home',
      'Projekte',
      'Kunden',
      'Anfragen',
      'Settings',
    ]);
    expect(links[1]).toHaveAttribute('aria-current', 'true');
    expect(links[0]).not.toHaveAttribute('aria-current');
    expect(within(nav).getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/kunden/admin/settings');
  });

  it('AK-1: Home ist auf der Übersicht aktuelle Seite', () => {
    render(<AdminNavigation neueAnfragen={0} eingeklappt={false} />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it('AK-2: Zur Website in der Sidebar', () => {
    render(<AdminNavigation neueAnfragen={0} eingeklappt={false} />);
    expect(screen.getByRole('link', { name: 'Zur Website' })).toHaveAttribute('href', '/');
  });

  it('AK-3: Einklappen mit aria-expanded, Wahl im Cookie, Namen bleiben', () => {
    render(<AdminNavigation neueAnfragen={0} eingeklappt={false} />);
    const knopf = screen.getByRole('button', { name: 'Seitenleiste' });
    expect(knopf).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(knopf);
    expect(knopf).toHaveAttribute('aria-expanded', 'false');
    expect(document.cookie).toContain('kb_sidebar=zu');
    expect(screen.getByRole('link', { name: 'Projekte' })).toHaveAttribute('title', 'Projekte');
  });

  it('AK-5: Zahl der neuen Anfragen am Link', () => {
    render(<AdminNavigation neueAnfragen={2} eingeklappt={false} />);
    expect(screen.getByRole('link', { name: 'Anfragen, 2 neu' })).toHaveTextContent('2');
  });
});

describe('Tabellen und ⋯-Menüs', () => {
  it('AK-6: Projekte als Tabelle mit Spaltenköpfen und Aktionen je Zeile', () => {
    render(<AdminProjekte projekte={[projekt]} />);
    const tabelle = screen.getByRole('table', { name: 'Projekte' });
    expect(
      within(tabelle)
        .getAllByRole('columnheader')
        .map((c) => c.textContent?.trim()),
    ).toEqual(['Projekt', 'Kunde', 'Status', 'Auftragswert', 'Nächster Schritt', 'Aktionen']);
    expect(within(tabelle).getByRole('link', { name: 'Relaunch' })).toHaveAttribute(
      'href',
      `/kunden/admin/projekte/${P}`,
    );
    expect(within(tabelle).getByRole('button', { name: 'Aktionen: Relaunch' })).toHaveAttribute(
      'aria-haspopup',
      'menu',
    );
  });

  it('AK-7: Menü per Tastatur, Status als Auswahl, Auswahl speichert und wird angesagt', async () => {
    render(
      <>
        <p id="admin-meldung" aria-live="polite" />
        <AdminProjekte projekte={[projekt]} />
      </>,
    );
    const { knopf, menue } = oeffne('Aktionen: Relaunch');
    expect(knopf).toHaveAttribute('aria-expanded', 'true');
    const eintraege = Array.from(menue.querySelectorAll<HTMLElement>('[role^="menuitem"]'));
    // AK-12: Fokus startet auf dem gewählten Status „In Arbeit“
    await waitFor(() => expect(eintraege[1]).toHaveFocus());
    fireEvent.keyDown(menue, { key: 'ArrowDown' });
    expect(eintraege[2]).toHaveFocus();
    fireEvent.keyDown(menue, { key: 'End' });
    expect(eintraege.at(-1)).toHaveFocus();
    expect(within(menue).getByRole('menuitemradio', { name: 'In Arbeit' })).toHaveAttribute('aria-checked', 'true');
    expect(within(menue).getByRole('menuitemradio', { name: 'Pausiert' })).toHaveAttribute('aria-checked', 'false');
    fireEvent.keyDown(menue, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    await waitFor(() => expect(knopf).toHaveFocus());

    aktionen.projektStatus!.mockResolvedValueOnce({ status: 'ok', message: 'Status geändert.' });
    const zweit = oeffne('Aktionen: Relaunch').menue;
    await act(async () => fireEvent.click(within(zweit).getByRole('menuitemradio', { name: 'Pausiert' })));
    const fd = (aktionen.projektStatus!.mock.calls.at(-1) as unknown[])[1] as FormData;
    expect(fd.get('id')).toBe(P);
    expect(fd.get('status')).toBe('pausiert');
    await waitFor(() =>
      expect(document.getElementById('admin-meldung')).toHaveTextContent('Relaunch: Status ist jetzt „Pausiert“.'),
    );
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('AK-6/AK-8: Kunden als Tabelle mit Status, Status im Menü änderbar', async () => {
    render(<AdminKunden kunden={[kunde]} />);
    const tabelle = screen.getByRole('table', { name: 'Kunden' });
    expect(
      within(tabelle)
        .getAllByRole('columnheader')
        .map((c) => c.textContent?.trim()),
    ).toEqual(['Kunde', 'Status', 'Projekte', 'Ansprechpartner', 'Logo-Freigabe', 'Aktionen']);
    expect(within(tabelle).getByRole('row', { name: /Bäckerei/ })).toHaveTextContent('Aktiv');
    const { menue } = oeffne('Aktionen: Bäckerei');
    expect(
      within(menue)
        .getAllByRole('menuitemradio')
        .map((r) => r.textContent?.trim()),
    ).toEqual(['Interessent', 'Aktiv', 'Pausiert', 'Ehemalig']);
    await act(async () => fireEvent.click(within(menue).getByRole('menuitemradio', { name: 'Ehemalig' })));
    const fd = (aktionen.kundeStatus!.mock.calls.at(-1) as unknown[])[1] as FormData;
    expect(fd.get('id')).toBe(K);
    expect(fd.get('status')).toBe('ehemalig');
  });

  it('AK-6: Anfragen als Tabelle, Status im Menü', async () => {
    render(<AdminAnfragen anfragen={[anfrage]} />);
    const tabelle = screen.getByRole('table', { name: 'Anfragen' });
    expect(
      within(tabelle)
        .getAllByRole('columnheader')
        .map((c) => c.textContent?.trim()),
    ).toEqual(['Name', 'Eingang', 'Leistungen', 'Status', 'Aktionen']);
    const { menue } = oeffne('Aktionen: Clara Muster');
    await act(async () => fireEvent.click(within(menue).getByRole('menuitemradio', { name: 'Beantwortet' })));
    const fd = (aktionen.anfrageStatus!.mock.calls.at(-1) as unknown[])[1] as FormData;
    expect(fd.get('status')).toBe('beantwortet');
  });

  it('AK-9: Projektkopf mit ⋯-Menü, Dialog daraus, Fokus zurück auf den ⋯-Button', async () => {
    render(<AdminProjekt projekt={DETAIL} now={NOW} />);
    expect(screen.queryByRole('button', { name: 'Projekt bearbeiten' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Umsatz bearbeiten' })).toBeNull();
    const { knopf, menue } = oeffne('Aktionen: Relaunch');
    for (const name of ['Projekt bearbeiten', 'Umsatz bearbeiten', 'Zuordnung ändern'])
      expect(within(menue).getByRole('menuitem', { name })).toBeInTheDocument();
    fireEvent.click(within(menue).getByRole('menuitem', { name: 'Projekt bearbeiten' }));
    const dialog = screen.getByRole('dialog', { name: 'Projekt bearbeiten' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Abbrechen' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    await waitFor(() => expect(knopf).toHaveFocus());
  });

  it('AK-9: Karten fügen mit „+“ hinzu', () => {
    render(<AdminProjekt projekt={DETAIL} now={NOW} />);
    for (const name of ['Ablaufschritt hinzufügen', 'Termin hinzufügen', 'Dokument hochladen']) {
      const knopf = screen.getByRole('button', { name });
      expect(knopf).toHaveAttribute('title', name);
      expect(knopf.textContent?.trim()).toBe('');
    }
  });
});

describe('Settings', () => {
  it('AK-10: Konto, Darstellung und Abmelden', () => {
    render(<AdminSettings email="erik@example.org" />);
    expect(screen.getByText('erik@example.org')).toBeInTheDocument();
    const gruppe = screen.getByRole('radiogroup', { name: 'Darstellung' });
    expect(
      within(gruppe)
        .getAllByRole('radio')
        .map((r) => r.getAttribute('value')),
    ).toEqual(['hell', 'dunkel', 'system']);
    fireEvent.click(within(gruppe).getByRole('radio', { name: 'Dunkel' }));
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    fireEvent.click(within(gruppe).getByRole('radio', { name: 'Hell' }));
    expect(document.documentElement).not.toHaveClass('dark');
    expect(screen.getByRole('button', { name: 'Abmelden' })).toBeInTheDocument();
  });
});

describe('Status-Aktionen', async () => {
  const A = await vi.importActual<typeof import('@/lib/kundenbereich/admin/aktionen')>(
    '@/lib/kundenbereich/admin/aktionen',
  );
  const fd = (o: Record<string, string>) => {
    const f = new FormData();
    for (const [k, v] of Object.entries(o)) f.append(k, v);
    return f;
  };
  const api = () => ({ update: vi.fn(async () => undefined) });
  const ctx = (a: ReturnType<typeof api>) => ({
    api: a as unknown as import('@/lib/kundenbereich/admin/aktionen').AdminApi,
    admin: true,
  });

  it('AK-7/AK-8: nur gültige Werte, nur der Status', async () => {
    const a = api();
    expect(await A.projektStatus(fd({ id: P, status: 'pausiert' }), ctx(a))).toMatchObject({
      status: 'ok',
      message: 'Status geändert.',
    });
    expect(a.update).toHaveBeenCalledWith('kundenprojekte', P, { status: 'pausiert' });
    expect(await A.kundeStatus(fd({ id: K, status: 'interessent' }), ctx(a))).toMatchObject({ status: 'ok' });
    expect(a.update).toHaveBeenCalledWith('kunden', K, { status: 'interessent' });
    expect(await A.kundeStatus(fd({ id: K, status: 'geheim' }), ctx(a))).toMatchObject({ status: 'error' });
    expect(await A.projektStatus(fd({ id: 'x', status: 'pausiert' }), ctx(a))).toMatchObject({ status: 'error' });
    expect(a.update).toHaveBeenCalledTimes(2);
  });
});

describe('Befunde Blinder Kritiker Sidebar (2026-10-13)', () => {
  const meldungen = () => (
    <>
      <p id="admin-meldung" aria-live="polite" />
      <p id="admin-fehler" role="alert" />
    </>
  );

  it('AK-12: Status-Menü öffnet auf dem gewählten Status, Reihenfolge wie im Dashboard', async () => {
    render(<AdminProjekte projekte={[projekt]} />);
    const { menue } = oeffne('Aktionen: Relaunch');
    const radios = within(menue).getAllByRole('menuitemradio');
    expect(radios.map((r) => r.textContent?.trim())).toEqual([
      'Angebot',
      'In Arbeit',
      'In Abstimmung',
      'Pausiert',
      'Abgeschlossen',
    ]);
    await waitFor(() => expect(within(menue).getByRole('menuitemradio', { name: 'In Arbeit' })).toHaveFocus());
  });

  it('AK-13: Hinweis mit Name und neuem Status, Fehler als eigene Meldung', async () => {
    render(
      <>
        {meldungen()}
        <AdminProjekte projekte={[projekt]} />
      </>,
    );
    aktionen.projektStatus!.mockResolvedValueOnce({ status: 'ok', message: 'Status geändert.' });
    const menuePausiert = oeffne('Aktionen: Relaunch').menue;
    await act(async () => fireEvent.click(within(menuePausiert).getByRole('menuitemradio', { name: 'Pausiert' })));
    await waitFor(() =>
      expect(document.getElementById('admin-meldung')).toHaveTextContent('Relaunch: Status ist jetzt „Pausiert“.'),
    );
    aktionen.projektStatus!.mockResolvedValueOnce({ status: 'error', message: 'Dieser Eintrag ist ungültig.' });
    const menueAngebot = oeffne('Aktionen: Relaunch').menue;
    await act(async () => fireEvent.click(within(menueAngebot).getByRole('menuitemradio', { name: 'Angebot' })));
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Status konnte nicht geändert werden. Dieser Eintrag ist ungültig.',
      ),
    );
  });

  it('AK-14: Button „Seitenleiste“ mit Zustand, eingeklappt bleibt die Zahl sichtbar', () => {
    render(<AdminNavigation neueAnfragen={3} eingeklappt />);
    const knopf = screen.getByRole('button', { name: 'Seitenleiste' });
    expect(knopf).toHaveAttribute('aria-expanded', 'false');
    expect(knopf).toHaveAttribute('title', 'Seitenleiste ausklappen');
    const zahl = within(screen.getByRole('link', { name: 'Anfragen, 3 neu' })).getAllByText('3');
    expect(zahl.some((z) => !/(^|\s)lg:hidden(\s|$)/.test(z.className))).toBe(true);
    fireEvent.click(knopf);
    expect(screen.getByRole('button', { name: 'Seitenleiste' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('AK-15: „Zur Website“ vor der Navigation in der Tab-Reihenfolge', () => {
    render(<AdminNavigation neueAnfragen={0} eingeklappt={false} />);
    const website = screen.getByRole('link', { name: 'Zur Website' });
    const nav = screen.getByRole('navigation', { name: 'Verwaltung' });
    expect(website.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('AK-16: unbekannte ID zeigt „Nicht gefunden“ der Verwaltung', async () => {
    const { default: NichtGefunden } = await import('@/app/(kunden-de)/kunden/admin/not-found');
    render(<NichtGefunden />);
    expect(screen.getByRole('heading', { level: 1, name: 'Nicht gefunden' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Zur Übersicht' })).toHaveAttribute('href', '/kunden/admin');
  });

  it('AK-17: Website der Anfrage als Link, Schritte des Assistenten benannt', async () => {
    const { default: AdminAnfrage } = await import('@/components/kundenbereich/admin/AdminAnfrage');
    const { unmount } = render(<AdminAnfrage anfrage={{ ...anfrage, website: 'https://muster.example' }} />);
    expect(screen.getByRole('link', { name: /muster\.example/ })).toHaveAttribute('href', 'https://muster.example');
    unmount();
    const { default: ProjektAssistent } = await import('@/components/kundenbereich/admin/ProjektAssistent');
    const { leererAssistent } = await import('@/lib/kundenbereich/admin/assistent');
    render(<ProjektAssistent kunden={[]} start={leererAssistent()} />);
    const fortschritt = screen.getByRole('list', { name: 'Fortschritt' });
    for (const li of within(fortschritt).getAllByRole('listitem')) {
      const namen = [...li.querySelectorAll('span')].filter((s) => s.getAttribute('aria-hidden') !== 'true');
      expect(namen.some((s) => s.textContent && !/(^|\s)hidden(\s|$)/.test(s.className))).toBe(true);
    }
  });
});
