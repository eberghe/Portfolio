import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProjektRow } from '@/lib/kundenbereich/projekte';

// functions/kundenbereich/angebot-unterschrift.md

const aktionen = vi.hoisted(() => ({
  requestLoginLink: vi.fn(),
  confirmLogin: vi.fn(),
  logout: vi.fn(),
  logoFreigabe: vi.fn(),
  unterschriftVorbereiten: vi.fn(async () => ({
    status: 'ok' as const,
    upload: { url: 'https://sb.example/upload?token=x', pfad: 'k/p/unterschrift-abc.pdf' },
  })),
  unterschriftEintragen: vi.fn(async () => ({
    status: 'ok' as const,
    message: 'Danke! Das unterschriebene Angebot ist da.',
  })),
}));
vi.mock('@/app/actions/kundenbereich', () => aktionen);
vi.mock('next/headers', () => ({ cookies: vi.fn(), headers: vi.fn() }));
const router = vi.hoisted(() => ({ refresh: vi.fn() }));
vi.mock('next/navigation', () => ({ usePathname: () => '/kunden', useRouter: () => router, redirect: vi.fn() }));

const { default: Projektuebersicht } = await import('@/components/kundenbereich/Projektuebersicht');
const { dokumentGruppen } = await import('@/lib/kundenbereich/dokumente');
const { kennzahlen, projektAnsicht } = await import('@/lib/kundenbereich/projekte');
const U = await import('@/lib/kundenbereich/unterschrift');

type Dok = ProjektRow['dokumente'][number];
const dok = (id: string, art: Dok['art'], titel: string, extra: Partial<Dok> = {}): Dok => ({
  id,
  created_at: '2026-10-13T09:00:00Z',
  art,
  titel,
  dateiname: `${id}.pdf`,
  groesse_bytes: 30_000,
  mime_typ: 'application/pdf',
  version: 1,
  zu_dokument: null,
  ...extra,
});
const OFFEN = dok('a1', 'angebot', 'Angebot 2026-002');
const ALT = dok('a0', 'angebot', 'Angebot 2026-001');
const SIGNIERT = dok('u0', 'unterschrift', 'Angebot 2026-001, unterschrieben', {
  zu_dokument: 'a0',
  created_at: '2026-10-14T09:00:00Z',
});
const projekt = (dokumente: Dok[]): ProjektRow => ({
  id: 'p1',
  titel: 'Relaunch',
  status: 'angebot',
  phase: null,
  beschreibung_de: null,
  beschreibung_en: null,
  website_url: null,
  staging_url: null,
  kunden: { name: 'Kunde A' },
  termine: [],
  projektschritte: [],
  dokumente,
});
const ANNA = { art: 'kunde' as const, name: 'Anna', sprache: 'de' as const };
const ERIK = { art: 'admin' as const, name: 'Erik', sprache: 'de' as const };

describe('Angebote im Kundenbereich', () => {
  it('AK-1: Angebote und Unterschriften als erste Gruppe, Unterschrift ist keine neue Version', () => {
    const g = dokumentGruppen([dok('v', 'vertrag', 'Vertrag'), OFFEN, SIGNIERT, ALT]);
    expect(g.map((x) => x.art)).toEqual(['angebot', 'vertrag']);
    expect(g[0]!.dokumente.map((d) => [d.id, d.aktuell])).toEqual([
      ['a0', true],
      ['u0', true],
      ['a1', true],
    ]);
  });

  it('AK-2: Button nur bei offenen Angeboten und nur für Kunden', () => {
    const { unmount } = render(
      <Projektuebersicht locale="de" profil={ANNA} projekte={[projekt([OFFEN, ALT, SIGNIERT])]} bereich="dokumente" />,
    );
    const knoepfe = screen.getAllByRole('button', { name: /^Unterschriebenes Angebot hochladen/ });
    expect(knoepfe).toHaveLength(1);
    expect(knoepfe[0]).toHaveAccessibleName('Unterschriebenes Angebot hochladen: Angebot 2026-002');
    expect(screen.getByText('Unterschrieben hochgeladen am 14. Okt. 2026')).toBeInTheDocument();
    unmount();
    render(<Projektuebersicht locale="de" profil={ERIK} projekte={[projekt([OFFEN])]} bereich="dokumente" />);
    expect(screen.queryByRole('button', { name: /Unterschriebenes Angebot hochladen/ })).toBeNull();
  });

  it('AK-2, AK-5: Hochladen in drei Schritten, Meldung danach', async () => {
    const put = vi.fn(async () => new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', put);
    render(<Projektuebersicht locale="de" profil={ANNA} projekte={[projekt([OFFEN])]} bereich="dokumente" />);
    const knopf = screen.getByRole('button', { name: /Unterschriebenes Angebot hochladen/ });
    expect(knopf).toHaveAttribute('aria-expanded', 'false');
    await act(async () => fireEvent.click(knopf));
    expect(knopf).toHaveAttribute('aria-expanded', 'true');
    const datei = new File(['%PDF-1.7'], 'Angebot unterschrieben.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/Datei/);
    expect(input).toHaveAttribute('accept', 'application/pdf,image/jpeg,image/png');
    fireEvent.change(input, { target: { files: [datei] } });
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Hochladen' })));
    await waitFor(() => expect(aktionen.unterschriftEintragen).toHaveBeenCalled());
    const vor = (aktionen.unterschriftVorbereiten.mock.calls[0] as unknown[])[1] as FormData;
    expect(Object.fromEntries(vor)).toMatchObject({
      dokument: 'a1',
      type: 'application/pdf',
      size: '8',
      sprache: 'de',
    });
    expect(put).toHaveBeenCalledWith('https://sb.example/upload?token=x', expect.objectContaining({ method: 'PUT' }));
    const ein = (aktionen.unterschriftEintragen.mock.calls[0] as unknown[])[1] as FormData;
    expect(Object.fromEntries(ein)).toMatchObject({
      dokument: 'a1',
      pfad: 'k/p/unterschrift-abc.pdf',
      dateiname: 'Angebot unterschrieben.pdf',
    });
    expect(await screen.findByRole('status')).toHaveTextContent('Danke! Das unterschriebene Angebot ist da.');
    expect(router.refresh).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('AK-6: Übersicht zeigt offene Angebote, „Du bist dran“ zählt sie mit', () => {
    const p = projekt([OFFEN, ALT, SIGNIERT]);
    expect(kennzahlen(projektAnsicht(p, 'de')).angeboteOffen).toBe(1);
    render(<Projektuebersicht locale="de" profil={ANNA} projekte={[p]} />);
    const karte = screen.getByRole('region', { name: 'Angebot wartet auf dich' });
    expect(within(karte).getByRole('link', { name: /^Angebot 2026-002/ })).toHaveAttribute(
      'href',
      '/kunden/dokumente/a1',
    );
    expect(within(karte).getByRole('button', { name: /Unterschriebenes Angebot hochladen/ })).toBeInTheDocument();
    const kachel = screen.getByText('Du bist dran').closest('li')!;
    expect(kachel).toHaveTextContent('1 Angebot');
    expect(within(kachel).getByRole('link', { name: /Angebot ansehen/ })).toHaveAttribute('href', '#angebot-titel');
  });

  it('AK-6: ohne offenes Angebot keine Karte', () => {
    render(<Projektuebersicht locale="de" profil={ANNA} projekte={[projekt([ALT, SIGNIERT])]} />);
    expect(screen.queryByRole('region', { name: 'Angebot wartet auf dich' })).toBeNull();
  });

  it('AK-7: Englisch', () => {
    render(
      <Projektuebersicht
        locale="en"
        profil={{ ...ANNA, sprache: 'en' }}
        projekte={[projekt([OFFEN, ALT, SIGNIERT])]}
        bereich="dokumente"
      />,
    );
    expect(screen.getByRole('heading', { name: 'Quotes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload signed quote: Angebot 2026-002' })).toBeInTheDocument();
    expect(screen.getByText('Signed, uploaded on 14 Oct 2026')).toBeInTheDocument();
  });
});

describe('Unterschrift hochladen: Server', () => {
  const api = () => ({
    angebotDokument: vi.fn(async () => ({ id: 'a1', projekt_id: 'p1', kunde_id: 'k1', unterschrieben: false })),
    signUpload: vi.fn(async (_a: string, pfad: string) => `https://sb.example/upload/${pfad}?token=x`),
    unterschriftEintragen: vi.fn(async () => 'ok' as const),
  });
  const fd = (werte: Record<string, string>) => {
    const f = new FormData();
    for (const [k, v] of Object.entries({ sprache: 'de', dokument: 'a1', ...werte })) f.set(k, v);
    return f;
  };

  it('AK-3: ohne Sitzung, falscher Typ oder zu groß wird abgelehnt', async () => {
    const a = api();
    expect(
      await U.unterschriftVorbereiten(fd({ name: 'x.pdf', type: 'application/pdf', size: '100' }), {
        access: undefined,
        api: a,
      }),
    ).toMatchObject({ status: 'error' });
    expect(
      await U.unterschriftVorbereiten(fd({ name: 'x.zip', type: 'application/zip', size: '100' }), {
        access: 't',
        api: a,
      }),
    ).toMatchObject({ status: 'error', feld: true, message: 'Bitte wähle eine PDF-, JPG- oder PNG-Datei.' });
    expect(
      await U.unterschriftVorbereiten(fd({ name: 'x.pdf', type: 'application/pdf', size: String(11 * 1024 * 1024) }), {
        access: 't',
        api: a,
      }),
    ).toMatchObject({ status: 'error', feld: true, message: 'Die Datei ist größer als 10 MB.' });
    expect(a.signUpload).not.toHaveBeenCalled();
  });

  it('AK-3: gibt einen Upload-Link für den Pfad im Projekt zurück', async () => {
    const a = api();
    const r = await U.unterschriftVorbereiten(fd({ name: 'Scan.JPG', type: 'image/jpeg', size: '5000' }), {
      access: 't',
      api: a,
      zufall: () => 'abc123',
    });
    expect(r).toEqual({
      status: 'ok',
      upload: {
        url: 'https://sb.example/upload/k1/p1/unterschrift-abc123.jpg?token=x',
        pfad: 'k1/p1/unterschrift-abc123.jpg',
      },
    });
    expect(a.angebotDokument).toHaveBeenCalledWith('t', 'a1');
  });

  it('AK-3: schon unterschrieben oder fremd', async () => {
    const a = api();
    a.angebotDokument.mockResolvedValueOnce({ id: 'a1', projekt_id: 'p1', kunde_id: 'k1', unterschrieben: true });
    expect(
      await U.unterschriftVorbereiten(fd({ name: 'x.pdf', type: 'application/pdf', size: '100' }), {
        access: 't',
        api: a,
      }),
    ).toMatchObject({ status: 'error', message: 'Für dieses Angebot gibt es schon eine Unterschrift.' });
    a.angebotDokument.mockResolvedValueOnce(null as never);
    expect(
      await U.unterschriftVorbereiten(fd({ name: 'x.pdf', type: 'application/pdf', size: '100' }), {
        access: 't',
        api: a,
      }),
    ).toMatchObject({ status: 'error' });
  });

  it('AK-5: Eintragen ruft die Datenbankfunktion und meldet das Ergebnis', async () => {
    const a = api();
    const ok = await U.unterschriftEintragen(fd({ pfad: 'k1/p1/unterschrift-abc123.pdf', dateiname: 'Scan.pdf' }), {
      access: 't',
      api: a,
    });
    expect(ok).toEqual({ status: 'ok', message: 'Danke! Das unterschriebene Angebot ist da.' });
    expect(a.unterschriftEintragen).toHaveBeenCalledWith('t', 'a1', 'k1/p1/unterschrift-abc123.pdf', 'Scan.pdf');
    a.unterschriftEintragen.mockResolvedValueOnce('schon' as never);
    expect(await U.unterschriftEintragen(fd({ pfad: 'x', dateiname: 'y' }), { access: 't', api: a })).toMatchObject({
      status: 'error',
      message: 'Für dieses Angebot gibt es schon eine Unterschrift.',
    });
    a.unterschriftEintragen.mockResolvedValueOnce('fehler' as never);
    expect(await U.unterschriftEintragen(fd({ pfad: 'x', dateiname: 'y' }), { access: 't', api: a })).toMatchObject({
      status: 'error',
      message: 'Das hat nicht geklappt. Bitte versuch es noch einmal.',
    });
  });
});
