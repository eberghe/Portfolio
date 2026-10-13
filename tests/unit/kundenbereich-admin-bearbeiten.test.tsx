import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AdminApi, AdminState } from '@/lib/kundenbereich/admin/aktionen';
import type { Anfrage, DashboardProjekt } from '@/lib/kundenbereich/admin/dashboard';
import type { KundeDetail, KundeZeile, ProjektDetail } from '@/lib/kundenbereich/admin/laden';

// functions/kundenbereich/admin-bearbeiten.md

const aktionen = vi.hoisted(() =>
  Object.fromEntries(
    [
      'kundeAnlegen',
      'kundeSpeichern',
      'kundeStatus',
      'kundeLoeschen',
      'logoVorbereiten',
      'logoUebernehmen',
      'ansprechpartnerHinzufuegen',
      'ansprechpartnerEntfernen',
      'ansprechpartnerEinladen',
      'projektSpeichern',
      'projektStatus',
      'projektLoeschen',
      'projektAnsprechpartner',
      'schrittHinzufuegen',
      'schrittSpeichern',
      'schrittEntfernen',
      'schrittStatus',
      'schritteSortieren',
      'terminHinzufuegen',
      'terminEntfernen',
      'dokumentVorbereiten',
      'dokumentUebernehmen',
      'dokumentEntfernen',
      'umsatzSpeichern',
      'anfrageStatus',
      'anfrageLoeschen',
      'projektMitAssistent',
    ].map((n) => [n, vi.fn(async (): Promise<AdminState> => ({ status: 'ok', message: 'Gespeichert.' }))]),
  ),
);
vi.mock('@/app/actions/kundenbereich-admin', () => aktionen);
vi.mock('@/app/actions/kundenbereich', () => ({ logout: vi.fn() }));
const router = vi.hoisted(() => ({ refresh: vi.fn(), push: vi.fn() }));
const adresse = vi.hoisted(() => ({ pfad: '/kunden/admin' }));
vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => adresse.pfad,
  notFound: vi.fn(),
}));

const { default: AdminProjekte } = await import('@/components/kundenbereich/admin/AdminProjekte');
const { default: AdminKunden } = await import('@/components/kundenbereich/admin/AdminKunden');
const { default: AdminAnfragen } = await import('@/components/kundenbereich/admin/AdminAnfragen');
const { default: AdminAnfrage } = await import('@/components/kundenbereich/admin/AdminAnfrage');
const { default: AdminProjekt } = await import('@/components/kundenbereich/admin/AdminProjekt');
const { default: AdminKunde } = await import('@/components/kundenbereich/admin/AdminKunde');
const { default: AdminNavigation } = await import('@/components/kundenbereich/admin/AdminNavigation');
const { default: AdminSettings } = await import('@/components/kundenbereich/admin/AdminSettings');
const A = await vi.importActual<typeof import('@/lib/kundenbereich/admin/aktionen')>(
  '@/lib/kundenbereich/admin/aktionen',
);

const K = '10000000-0000-4000-8000-00000000000a';
const P = '20000000-0000-4000-8000-00000000000b';
const S1 = '40000000-0000-4000-8000-000000000001';
const S2 = '40000000-0000-4000-8000-000000000002';
const S3 = '40000000-0000-4000-8000-000000000003';
const NOW = new Date('2026-10-08T10:00:00Z');

afterEach(() => {
  vi.clearAllMocks();
});

const projekt: DashboardProjekt = {
  id: P,
  titel: 'Relaunch',
  status: 'in_arbeit',
  kunden: { id: K, name: 'Bäckerei' },
  projekt_umsatz: null,
  projektschritte: [],
};
const kunde: KundeZeile = {
  id: K,
  name: 'Bäckerei',
  status: 'aktiv',
  logo_freigabe: 'offen',
  logo_freigabe_am: null,
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
  leistungen: [],
  zeitrahmen: null,
  budget: null,
  beschreibung: 'Neue Website.',
  status: 'neu',
  sprache: 'de',
} as unknown as Anfrage;
const schritt = (id: string, n: number, titel: string, status = 'offen') => ({
  id,
  reihenfolge: n,
  titel_de: titel,
  titel_en: null,
  beschreibung_de: null,
  beschreibung_en: null,
  status,
  faellig_am: null,
  verantwortlich: 'erik',
});
const DETAIL = {
  id: P,
  kunde_id: K,
  titel: 'Relaunch',
  status: 'in_arbeit',
  phase: null,
  beschreibung_de: null,
  beschreibung_en: null,
  website_url: null,
  staging_url: null,
  kunden: { id: K, name: 'Bäckerei', ansprechpartner: [{ id: 'a1', name: 'Anna', email: 'anna@b.example' }] },
  projekt_ansprechpartner: [{ ansprechpartner_id: 'a1' }],
  projekt_umsatz: null,
  projektschritte: [schritt(S1, 1, 'Analyse', 'erledigt'), schritt(S2, 2, 'Design', 'aktiv'), schritt(S3, 3, 'Launch')],
  termine: [
    {
      id: 't1',
      beginn: '2026-10-15T08:00:00Z',
      ende: '2026-10-15T09:00:00Z',
      titel_de: 'Review',
      titel_en: null,
      meet_url: null,
    },
  ],
  dokumente: [],
} as unknown as ProjektDetail;
const KUNDE: KundeDetail = {
  id: K,
  name: 'Bäckerei',
  website_url: null,
  logo_pfad: null,
  status: 'aktiv',
  logo_freigabe: 'offen',
  logo_freigabe_am: null,
  ansprechpartner: [
    { id: 'a1', name: 'Anna', email: 'anna@b.example', rolle: null, telefon: null, sprache: 'de', user_id: null },
  ],
  kundenprojekte: [
    { id: P, titel: 'Relaunch', status: 'in_arbeit', created_at: '2026-10-01T00:00:00Z' },
    { id: 'p2', titel: 'Logo', status: 'angebot', created_at: '2026-10-02T00:00:00Z' },
  ],
  logo_freigaben: [],
};

const menue = (ziel: string) => {
  const knopf = screen.getByRole('button', { name: `Aktionen: ${ziel}` });
  fireEvent.click(knopf);
  return { knopf, menue: screen.getByRole('menu', { name: `Aktionen: ${ziel}` }) };
};
const eintraege = (m: HTMLElement) =>
  within(m)
    .getAllByRole('menuitem')
    .map((e) => e.textContent);

describe('Löschen', () => {
  it('AK-1: Zeilen und Köpfe enden mit „Löschen“ in Fehlerfarbe', () => {
    for (const [ui, ziel] of [
      [<AdminProjekte key="p" projekte={[projekt]} />, 'Relaunch'],
      [<AdminKunden key="k" kunden={[kunde]} />, 'Bäckerei'],
      [<AdminAnfragen key="a" anfragen={[anfrage]} />, 'Clara Muster'],
      [<AdminProjekt key="pd" projekt={DETAIL} now={NOW} />, 'Relaunch'],
      [<AdminKunde key="kd" kunde={KUNDE} />, 'Bäckerei'],
      [<AdminAnfrage key="ad" anfrage={anfrage} />, 'Clara Muster'],
    ] as const) {
      const { unmount } = render(ui);
      const m = menue(ziel).menue;
      const letzter = within(m).getAllByRole('menuitem').at(-1)!;
      expect(letzter).toHaveTextContent('Löschen');
      expect(letzter).toHaveClass('text-error');
      unmount();
    }
  });

  it('AK-2/AK-3: eigene Rückfrage, Abbrechen löscht nichts, Bestätigen löscht und führt zur Liste', async () => {
    const confirm = vi.spyOn(window, 'confirm');
    render(
      <>
        <p id="admin-meldung" />
        <AdminProjekt projekt={DETAIL} now={NOW} />
      </>,
    );
    let m = menue('Relaunch');
    fireEvent.click(within(m.menue).getByRole('menuitem', { name: 'Löschen' }));
    let dialog = screen.getByRole('dialog', { name: 'Projekt löschen?' });
    expect(dialog).toHaveTextContent('„Relaunch“ wird mit Ablauf, Terminen, Dokumenten und Umsatz gelöscht.');
    const fuss = dialog.querySelector<HTMLElement>('[data-dialog-fuss]')!;
    expect(
      within(fuss)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['Abbrechen', 'Projekt löschen']);
    expect(within(fuss).getByRole('button', { name: 'Projekt löschen' })).toHaveClass('text-error');
    await waitFor(() => expect(within(fuss).getByRole('button', { name: 'Abbrechen' })).toHaveFocus());
    fireEvent.click(within(fuss).getByRole('button', { name: 'Abbrechen' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(aktionen.projektLoeschen).not.toHaveBeenCalled();
    await waitFor(() => expect(m.knopf).toHaveFocus());

    aktionen.projektLoeschen!.mockResolvedValueOnce({ status: 'ok', message: 'Relaunch gelöscht.' });
    m = menue('Relaunch');
    fireEvent.click(within(m.menue).getByRole('menuitem', { name: 'Löschen' }));
    dialog = screen.getByRole('dialog', { name: 'Projekt löschen?' });
    await act(async () => fireEvent.click(within(dialog).getByRole('button', { name: 'Projekt löschen' })));
    const fd = (aktionen.projektLoeschen!.mock.calls.at(-1) as unknown[])[1] as FormData;
    expect(fd.get('id')).toBe(P);
    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/kunden/admin/projekte'));
    await waitFor(() => expect(document.getElementById('admin-meldung')).toHaveTextContent('Relaunch gelöscht.'));
    expect(confirm).not.toHaveBeenCalled();
  });

  it('AK-4: Rückfrage zum Kunden nennt Projekte und Ansprechpartner', () => {
    render(<AdminKunden kunden={[kunde]} />);
    fireEvent.click(within(menue('Bäckerei').menue).getByRole('menuitem', { name: 'Löschen' }));
    expect(screen.getByRole('dialog', { name: 'Kunde löschen?' })).toHaveTextContent(
      'Bäckerei wird mit 2 Projekten und 1 Ansprechpartner gelöscht',
    );
  });

  it('AK-6: Entfernen von Termin und Ansprechpartner fragt im eigenen Dialog', async () => {
    const confirm = vi.spyOn(window, 'confirm');
    const { unmount } = render(<AdminProjekt projekt={DETAIL} now={NOW} />);
    fireEvent.click(within(menue('Termin Review').menue).getByRole('menuitem', { name: 'Entfernen' }));
    const dialog = screen.getByRole('dialog', { name: 'Termin entfernen?' });
    await act(async () => fireEvent.click(within(dialog).getByRole('button', { name: 'Termin entfernen' })));
    expect((aktionen.terminEntfernen!.mock.calls.at(-1) as unknown[])[1]).toBeInstanceOf(FormData);
    unmount();
    render(<AdminKunde kunde={KUNDE} />);
    fireEvent.click(within(menue('Anna').menue).getByRole('menuitem', { name: 'Entfernen' }));
    expect(screen.getByRole('dialog', { name: 'Ansprechpartner entfernen?' })).toBeInTheDocument();
    expect(confirm).not.toHaveBeenCalled();
  });
});

describe('Löschen auf dem Server (AK-5)', () => {
  const api = (daten: Record<string, unknown[]>) => {
    const geloeschteDateien: [string, string[]][] = [];
    const a = {
      get: vi.fn(async (t: string) => daten[`get:${t}`] ?? []),
      remove: vi.fn(async (t: string) => daten[`remove:${t}`] ?? []),
      removeFiles: vi.fn(async (b: string, p: string[]) => {
        geloeschteDateien.push([b, p]);
        return [];
      }),
      update: vi.fn(async () => ({})),
    } as unknown as AdminApi;
    return { a, geloeschteDateien };
  };
  const fd = (o: Record<string, string>) => {
    const f = new FormData();
    for (const [k, v] of Object.entries(o)) f.set(k, v);
    return f;
  };

  it('Projekt löschen entfernt die Dokumente aus dem Speicher', async () => {
    const { a, geloeschteDateien } = api({
      'get:dokumente': [{ storage_pfad: `${K}/${P}/v.pdf` }],
      'remove:kundenprojekte': [{ titel: 'Relaunch' }],
    });
    expect(await A.projektLoeschen(fd({ id: P }), { api: a, admin: true })).toEqual({
      status: 'ok',
      message: 'Relaunch gelöscht.',
    });
    expect(a.remove).toHaveBeenCalledWith('kundenprojekte', { id: `eq.${P}` });
    expect(geloeschteDateien).toEqual([['kundendokumente', [`${K}/${P}/v.pdf`]]]);
  });

  it('Kunde löschen entfernt Dokumente aller Projekte und das Logo', async () => {
    const { a, geloeschteDateien } = api({
      'get:kundenprojekte': [{ id: P }],
      'get:dokumente': [{ storage_pfad: `${K}/${P}/v.pdf` }],
      'remove:kunden': [{ name: 'Bäckerei', logo_pfad: `${K}/logo.svg` }],
    });
    expect(await A.kundeLoeschen(fd({ id: K }), { api: a, admin: true })).toMatchObject({
      status: 'ok',
      message: 'Bäckerei gelöscht.',
    });
    expect(geloeschteDateien).toEqual([
      ['kundendokumente', [`${K}/${P}/v.pdf`]],
      ['kundenlogos', [`${K}/logo.svg`]],
    ]);
  });

  it('Anfrage löschen; ungültige ID und fehlende Rechte löschen nichts', async () => {
    const { a } = api({ 'remove:anfragen': [{ name: 'Clara' }] });
    expect(await A.anfrageLoeschen(fd({ id: anfrage.id }), { api: a, admin: true })).toMatchObject({
      message: 'Anfrage von Clara gelöscht.',
    });
    expect(await A.anfrageLoeschen(fd({ id: 'x' }), { api: a, admin: true })).toMatchObject({ status: 'error' });
    expect(await A.kundeLoeschen(fd({ id: K }), { api: a, admin: false })).toMatchObject({ status: 'error' });
    expect(a.remove).toHaveBeenCalledTimes(1);
  });

  it('AK-9: Reihenfolge nur mit genau den Schritten des Projekts, Status nur mit gültigem Wert', async () => {
    const { a } = api({ 'get:projektschritte': [{ id: S1 }, { id: S2 }] });
    expect(
      await A.schritteSortieren(fd({ projekt_id: P, ids: JSON.stringify([S2]) }), { api: a, admin: true }),
    ).toMatchObject({ status: 'error' });
    expect(
      await A.schritteSortieren(fd({ projekt_id: P, ids: JSON.stringify([S2, S3]) }), { api: a, admin: true }),
    ).toMatchObject({ status: 'error' });
    expect(a.update).not.toHaveBeenCalled();
    expect(
      await A.schritteSortieren(fd({ projekt_id: P, ids: JSON.stringify([S2, S1]) }), { api: a, admin: true }),
    ).toEqual({ status: 'ok', message: 'Reihenfolge gespeichert.' });
    expect(a.update).toHaveBeenNthCalledWith(1, 'projektschritte', S2, { reihenfolge: 1 });
    expect(a.update).toHaveBeenNthCalledWith(2, 'projektschritte', S1, { reihenfolge: 2 });
    expect(await A.schrittStatus(fd({ id: S1, status: 'kaputt' }), { api: a, admin: true })).toMatchObject({
      status: 'error',
    });
    expect(await A.schrittStatus(fd({ id: S1, status: 'erledigt' }), { api: a, admin: true })).toMatchObject({
      status: 'ok',
    });
  });
});

describe('Ablauf sortieren', () => {
  const zeilenHoehe = () => {
    // Jede Zeile 60 px hoch, untereinander
    const zeilen = screen.getByRole('region', { name: 'Ablauf' }).querySelectorAll('ol > li');
    zeilen.forEach((li, i) => {
      li.getBoundingClientRect = () => ({ top: i * 60, height: 60, bottom: i * 60 + 60 }) as DOMRect;
    });
  };
  const ids = () =>
    JSON.parse(((aktionen.schritteSortieren!.mock.calls.at(-1) as unknown[])[1] as FormData).get('ids') as string);

  it('AK-7: Griff mit Namen, Ziehen ordnet neu und speichert beim Loslassen', async () => {
    render(<AdminProjekt projekt={DETAIL} now={NOW} />);
    zeilenHoehe();
    const griff = screen.getByRole('button', { name: 'Ziehen zum Sortieren: Analyse' });
    fireEvent.pointerDown(griff, { button: 0, pointerId: 1, clientY: 30 });
    fireEvent.pointerMove(griff, { pointerId: 1, clientY: 170 });
    const titel = () =>
      [...screen.getByRole('region', { name: 'Ablauf' }).querySelectorAll('ol > li p.font-bold')].map(
        (p) => p.textContent,
      );
    expect(titel()).toEqual(['1. Design', '2. Launch', '3. Analyse']);
    expect(aktionen.schritteSortieren).not.toHaveBeenCalled();
    await act(async () => fireEvent.pointerUp(griff, { pointerId: 1, clientY: 170 }));
    expect(ids()).toEqual([S2, S3, S1]);
  });

  it('AK-8: ⋯-Menü mit Status, Bearbeiten, Nach oben/unten, Entfernen', async () => {
    render(<AdminProjekt projekt={DETAIL} now={NOW} />);
    let m = menue('Schritt Analyse').menue;
    expect(eintraege(m)).toEqual(['Bearbeiten', 'Nach unten', 'Entfernen']);
    expect(within(m).getByRole('menuitemradio', { name: 'Erledigt' })).toHaveAttribute('aria-checked', 'true');
    fireEvent.keyDown(m, { key: 'Escape' });
    m = menue('Schritt Design').menue;
    expect(eintraege(m)).toEqual(['Bearbeiten', 'Nach oben', 'Nach unten', 'Entfernen']);
    await act(async () => fireEvent.click(within(m).getByRole('menuitem', { name: 'Nach oben' })));
    expect(ids()).toEqual([S2, S1, S3]);
    m = menue('Schritt Launch').menue;
    expect(eintraege(m)).toEqual(['Bearbeiten', 'Nach oben', 'Entfernen']);
    await act(async () => fireEvent.click(within(m).getByRole('menuitemradio', { name: 'Läuft gerade' })));
    const fd = (aktionen.schrittStatus!.mock.calls.at(-1) as unknown[])[1] as FormData;
    expect([fd.get('id'), fd.get('status')]).toEqual([S3, 'aktiv']);
  });

  it('AK-8: Pfeiltasten am Griff verschieben', async () => {
    render(<AdminProjekt projekt={DETAIL} now={NOW} />);
    await act(async () =>
      fireEvent.keyDown(screen.getByRole('button', { name: 'Ziehen zum Sortieren: Launch' }), { key: 'ArrowUp' }),
    );
    expect(ids()).toEqual([S1, S3, S2]);
  });
});

describe('Aktionen in den Karten und deutsche Namen', () => {
  it('AK-10: Kunde mit Menüs in Stammdaten und Logo, nicht im Kopf', () => {
    render(<AdminKunde kunde={KUNDE} />);
    const kopf = menue('Bäckerei').menue;
    expect(eintraege(kopf)).toEqual(['Neues Projekt', 'Löschen']);
    fireEvent.keyDown(kopf, { key: 'Escape' });
    const stamm = within(screen.getByRole('region', { name: 'Stammdaten' }));
    fireEvent.click(stamm.getByRole('button', { name: 'Aktionen: Stammdaten' }));
    expect(eintraege(screen.getByRole('menu'))).toEqual(['Stammdaten bearbeiten']);
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(
      within(screen.getByRole('region', { name: 'Logo' })).getByRole('button', { name: 'Aktionen: Logo' }),
    ).toBeInTheDocument();
  });

  it('AK-10: Projekt mit Menüs in Projekt, Umsatz und Ansprechpartner', () => {
    render(<AdminProjekt projekt={DETAIL} now={NOW} />);
    const kopf = menue('Relaunch').menue;
    expect(eintraege(kopf)).toEqual(['So sieht es der Kunde', 'Löschen']);
    fireEvent.keyDown(kopf, { key: 'Escape' });
    for (const [karte, eintrag] of [
      ['Projekt', 'Projekt bearbeiten'],
      ['Umsatz', 'Umsatz bearbeiten'],
      ['Ansprechpartner', 'Zuordnung ändern'],
    ]) {
      const m = within(screen.getByRole('region', { name: karte }));
      fireEvent.click(m.getByRole('button', { name: `Aktionen: ${karte}` }));
      expect(eintraege(screen.getByRole('menu'))).toEqual([eintrag]);
      fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    }
  });

  it('AK-11: Übersicht und Einstellungen auf Deutsch', () => {
    const { unmount } = render(<AdminNavigation neueAnfragen={0} eingeklappt={false} />);
    expect(
      within(screen.getByRole('navigation', { name: 'Verwaltung' }))
        .getAllByRole('link')
        .map((l) => l.textContent),
    ).toEqual(['Übersicht', 'Projekte', 'Kunden', 'Anfragen', 'Einstellungen']);
    expect(screen.getByRole('link', { name: 'Einstellungen' })).toHaveAttribute('href', '/kunden/admin/einstellungen');
    unmount();
    render(<AdminSettings email={null} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Einstellungen' })).toBeInTheDocument();
  });
});
