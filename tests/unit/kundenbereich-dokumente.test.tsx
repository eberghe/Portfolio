import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ProjektRow } from '@/lib/kundenbereich/projekte';

// functions/kundenbereich/dokumente.md

vi.mock('@/app/actions/kundenbereich', () => ({ requestLoginLink: vi.fn(), confirmLogin: vi.fn(), logout: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: vi.fn(), headers: vi.fn() }));

const { PROJEKT_SELECT } = await import('@/lib/kundenbereich/projekte');
const { dokumentGruppen, dateiInfo, dokumentAntwort } = await import('@/lib/kundenbereich/dokumente');
const { authApi } = await import('@/lib/kundenbereich/supabase');
const { default: Projektuebersicht } = await import('@/components/kundenbereich/Projektuebersicht');

type Dok = ProjektRow['dokumente'][number];
const dok = (id: string, art: Dok['art'], titel: string, version = 1, extra: Partial<Dok> = {}): Dok => ({
  id,
  created_at: '2026-10-08T09:00:00Z',
  art,
  titel,
  dateiname: `${id}.pdf`,
  groesse_bytes: 1_234_567,
  mime_typ: 'application/pdf',
  version,
  ...extra,
});

const DOKUMENTE: Dok[] = [
  dok('d-datei', 'datei', 'Moodboard', 1, {
    mime_typ: 'application/zip',
    dateiname: 'moodboard.zip',
    groesse_bytes: 800,
  }),
  dok('d-v1', 'vertrag', 'Vertrag Relaunch', 1),
  dok('d-logo', 'logo', 'Logo hell', 1, { mime_typ: 'image/svg+xml', dateiname: 'logo.svg', groesse_bytes: 4_300 }),
  dok('d-v2', 'vertrag', 'Vertrag Relaunch', 2),
  dok('d-r1', 'rechnung', 'Rechnung 2026-001', 1, { mime_typ: null, dateiname: 'rechnung.PDF' }),
  dok('d-agb', 'vertrag', 'AGB', 1),
];

const PROJEKT: ProjektRow = {
  id: 'p1',
  titel: 'Relaunch',
  status: 'in_arbeit',
  phase: null,
  beschreibung_de: null,
  beschreibung_en: null,
  website_url: null,
  staging_url: null,
  kunden: { name: 'Kunde A' },
  projektschritte: [],
  termine: [],
  dokumente: DOKUMENTE,
};
const ANNA = { art: 'kunde' as const, name: 'Anna', sprache: 'de' as const };

afterEach(() => vi.unstubAllGlobals());

describe('Dokumente aufbereiten', () => {
  it('AK-1: Projekte mit Dokumenten, ohne Speicherpfad', () => {
    expect(PROJEKT_SELECT).toMatch(/dokumente\(id,created_at,art,titel,dateiname,groesse_bytes,mime_typ,version\)/);
    expect(PROJEKT_SELECT).not.toMatch(/storage_pfad/);
  });

  it('AK-2: Gruppen in fester Reihenfolge, Titel, Version absteigend, aktuelle markiert', () => {
    const g = dokumentGruppen(DOKUMENTE);
    expect(g.map((x) => x.art)).toEqual(['vertrag', 'rechnung', 'logo', 'datei']);
    expect(g[0]!.dokumente.map((d) => [d.id, d.aktuell])).toEqual([
      ['d-agb', true],
      ['d-v2', true],
      ['d-v1', false],
    ]);
    expect(dokumentGruppen([])).toEqual([]);
  });

  it('AK-3/AK-6: Dateityp, Größe, Version, Datum', () => {
    expect(dateiInfo(DOKUMENTE[3]!, 'de')).toBe('PDF, 1,2 MB, Version 2, 8. Okt. 2026');
    expect(dateiInfo(DOKUMENTE[3]!, 'en')).toBe('PDF, 1.2 MB, version 2, 8 Oct 2026');
    expect(dateiInfo(DOKUMENTE[0]!, 'de')).toBe('ZIP, 800 B, Version 1, 8. Okt. 2026');
    expect(dateiInfo(DOKUMENTE[2]!, 'de')).toBe('SVG, 4,3 KB, Version 1, 8. Okt. 2026');
    expect(dateiInfo(DOKUMENTE[4]!, 'de')).toMatch(/^PDF, /);
    expect(dateiInfo({ ...DOKUMENTE[4]!, groesse_bytes: null }, 'de')).toBe('PDF, Version 1, 8. Okt. 2026');
  });
});

describe('Ansicht', () => {
  it('AK-3/AK-4: Abschnitt mit Gruppen, Linktext mit Angaben, Logo-Vorschau', () => {
    render(<Projektuebersicht locale="de" profil={ANNA} projekte={[PROJEKT]} />);
    const section = screen.getByRole('region', { name: 'Dokumente' });
    expect(
      within(section)
        .getAllByRole('heading', { level: 4 })
        .map((h) => h.textContent),
    ).toEqual(['Verträge', 'Rechnungen', 'Logos', 'Weitere Dateien']);
    const vertrag = within(section).getByRole('link', {
      name: 'Vertrag Relaunch, PDF, 1,2 MB, Version 2, 8. Okt. 2026, Aktuell',
    });
    expect(vertrag).toHaveAttribute('href', '/kunden/dokumente/d-v2');
    expect(within(section).getByRole('img', { name: 'Logo: Logo hell' })).toHaveAttribute(
      'src',
      '/kunden/dokumente/d-logo?vorschau=1',
    );
  });

  it('AK-6: englisch und ohne Dokumente', () => {
    const { unmount } = render(<Projektuebersicht locale="en" profil={ANNA} projekte={[PROJEKT]} />);
    const section = screen.getByRole('region', { name: 'Documents' });
    expect(
      within(section)
        .getAllByRole('heading', { level: 4 })
        .map((h) => h.textContent),
    ).toEqual(['Contracts', 'Invoices', 'Logos', 'Other files']);
    expect(within(section).getAllByText('Current').length).toBeGreaterThan(0);
    unmount();
    render(<Projektuebersicht locale="en" profil={ANNA} projekte={[{ ...PROJEKT, dokumente: [] }]} />);
    expect(screen.getByText('No documents yet.')).toBeInTheDocument();
  });
});

describe('Download', () => {
  const row = { id: 'd-v2', storage_pfad: 'k1/p1/vertrag v2.pdf', dateiname: 'Vertrag Relaunch.pdf' };

  it('AK-5: 401, 404, sonst 303 auf signierten Link mit dem Token des Nutzers', async () => {
    const api = {
      dokument: vi.fn(async (_a: string, id: string) => (id === 'd-v2' ? row : null)),
      signieren: vi.fn(async () => 'https://db.example/storage/v1/object/sign/kundendokumente/k1/p1/x?token=abc'),
    };
    expect((await dokumentAntwort('d-v2', false, undefined, api)).status).toBe(401);
    expect((await dokumentAntwort('d-v2', false, 'tok', null)).status).toBe(401);
    expect((await dokumentAntwort('fremd', false, 'tok', api)).status).toBe(404);

    const res = await dokumentAntwort('d-v2', false, 'tok', api);
    expect(res.status).toBe(303);
    expect(res.headers.get('cache-control')).toBe('private, no-store');
    expect(api.signieren).toHaveBeenLastCalledWith('tok', 'k1/p1/vertrag v2.pdf', 60);
    const location = new URL(res.headers.get('location')!);
    expect(location.searchParams.get('token')).toBe('abc');
    expect(location.searchParams.get('download')).toBe('Vertrag Relaunch.pdf');

    const vorschau = await dokumentAntwort('d-v2', true, 'tok', api);
    expect(new URL(vorschau.headers.get('location')!).searchParams.has('download')).toBe(false);

    api.signieren.mockResolvedValueOnce(null as unknown as string);
    expect((await dokumentAntwort('d-v2', false, 'tok', api)).status).toBe(502);
  });

  it('AK-5: Signieren bei Supabase Storage mit dem Token des Nutzers, Pfad kodiert', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ signedURL: '/object/sign/kundendokumente/k1/p1/vertrag%20v2.pdf?token=abc' })),
    );
    vi.stubGlobal('fetch', fetchMock);
    const api = authApi({
      SUPABASE_URL: 'https://db.example',
      SUPABASE_ANON_KEY: 'anon',
      SUPABASE_SERVICE_ROLE_KEY: 'geheim',
    })!;
    expect(await api.signieren('tok', 'k1/p1/vertrag v2.pdf', 60)).toBe(
      'https://db.example/storage/v1/object/sign/kundendokumente/k1/p1/vertrag%20v2.pdf?token=abc',
    );
    const [url, init] = fetchMock.mock.calls[0]! as unknown as [string, RequestInit];
    expect(url).toBe('https://db.example/storage/v1/object/sign/kundendokumente/k1/p1/vertrag%20v2.pdf');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({ expiresIn: 60 });
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer tok');
    expect(JSON.stringify(init)).not.toContain('geheim');
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 400 }));
    expect(await api.signieren('tok', 'x', 60)).toBeNull();
  });
});
