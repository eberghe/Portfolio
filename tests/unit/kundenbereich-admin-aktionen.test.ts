import { afterEach, describe, expect, it, vi } from 'vitest';
import { AdminFehler, adminApi } from '@/lib/kundenbereich/admin/api';
import * as A from '@/lib/kundenbereich/admin/aktionen';

// functions/kundenbereich/admin.md

const K = '10000000-0000-4000-8000-00000000000a';
const P = '20000000-0000-4000-8000-00000000000b';
const X = '30000000-0000-4000-8000-00000000000c';
const Y = '40000000-0000-4000-8000-00000000000d';

const fd = (o: Record<string, string | string[]>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) for (const x of [v].flat()) f.append(k, x);
  return f;
};

function fakeApi(data: Record<string, unknown[]> = {}) {
  return {
    get: vi.fn(async (table: string) => (data[table] ?? []) as never[]),
    insert: vi.fn(async () => ({ id: 'neu-id' }) as never),
    update: vi.fn(async () => ({}) as never),
    remove: vi.fn(async (table: string) => (data[`remove:${table}`] ?? []) as never[]),
    signUpload: vi.fn(
      async (_b: string, pfad: string) => `https://db.example/storage/v1/object/upload/sign/${pfad}?token=t`,
    ),
    info: vi.fn(async () => ({ size: 1000, type: 'application/pdf' }) as { size: number; type: string } | null),
    removeFiles: vi.fn(async () => []),
    sign: vi.fn(async () => 'https://db.example/signed'),
  };
}
const ctx = (api: ReturnType<typeof fakeApi> | null, extra: Partial<A.AdminCtx> = {}): A.AdminCtx => ({
  api: api as unknown as A.AdminApi,
  admin: true,
  zufall: () => 'zz11',
  now: () => new Date('2026-10-08T11:00:00Z'),
  ...extra,
});

afterEach(() => vi.unstubAllGlobals());

describe('Schutz', () => {
  it('AK-1: ohne Admin-Profil oder Supabase wird nichts geschrieben', async () => {
    const api = fakeApi();
    for (const action of Object.values(A).filter((v): v is typeof A.kundeAnlegen => typeof v === 'function')) {
      expect(await action(fd({ name: 'X', id: K, kunde_id: K, projekt_id: P }), ctx(api, { admin: false }))).toEqual({
        status: 'error',
        message: A.ADMIN_TEXT.keinZugriff,
      });
    }
    expect(await A.kundeAnlegen(fd({ name: 'X' }), ctx(null))).toMatchObject({ status: 'error' });
    for (const fn of Object.values(api)) expect(fn).not.toHaveBeenCalled();
  });

  it('AK-1: ungültige IDs werden abgelehnt', async () => {
    const api = fakeApi();
    expect(await A.ansprechpartnerEntfernen(fd({ id: '1 or 1=1' }), ctx(api))).toEqual({
      status: 'error',
      message: A.ADMIN_TEXT.ungueltig,
    });
    expect(api.remove).not.toHaveBeenCalled();
  });

  it('Fehler von Supabase werden zur Meldung', async () => {
    const api = fakeApi();
    api.insert.mockRejectedValueOnce(new AdminFehler(500, null, 'kaputt'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await A.kundeAnlegen(fd({ name: 'X' }), ctx(api))).toEqual({
      status: 'error',
      message: A.ADMIN_TEXT.fehler,
    });
  });
});

describe('Kunden und Ansprechpartner', () => {
  it('AK-3: Kunde anlegen leitet weiter, Prüffehler am Feld', async () => {
    const api = fakeApi();
    expect(await A.kundeAnlegen(fd({ name: 'Bäckerei', website_url: '' }), ctx(api))).toEqual({
      status: 'ok',
      message: 'Kunde angelegt.',
      redirect: '/kunden/admin/kunden/neu-id',
    });
    expect(api.insert).toHaveBeenCalledWith('kunden', { name: 'Bäckerei', website_url: null });
    expect(await A.kundeAnlegen(fd({ name: '' }), ctx(api))).toMatchObject({
      status: 'error',
      errors: { name: expect.any(String) },
    });
    await A.kundeSpeichern(fd({ id: K, name: 'Neu', website_url: 'https://n.example' }), ctx(api));
    expect(api.update).toHaveBeenCalledWith('kunden', K, { name: 'Neu', website_url: 'https://n.example' });
  });

  it('AK-4: Ansprechpartner hinzufügen, doppelte E-Mail am Feld, entfernen, einladen', async () => {
    const api = fakeApi({ ansprechpartner: [{ email: 'anna@a.example' }] });
    const neu = { kunde_id: K, name: 'Anna', email: 'Anna@A.example', rolle: 'GF', telefon: '', sprache: 'de' };
    expect(await A.ansprechpartnerHinzufuegen(fd(neu), ctx(api))).toMatchObject({ status: 'ok' });
    expect(api.insert).toHaveBeenCalledWith('ansprechpartner', {
      kunde_id: K,
      name: 'Anna',
      email: 'anna@a.example',
      rolle: 'GF',
      telefon: null,
      sprache: 'de',
    });
    api.insert.mockRejectedValueOnce(new AdminFehler(409, '23505', 'duplicate'));
    expect(await A.ansprechpartnerHinzufuegen(fd(neu), ctx(api))).toMatchObject({
      status: 'error',
      errors: { email: A.ADMIN_TEXT.emailVergeben },
    });

    await A.ansprechpartnerEntfernen(fd({ id: X }), ctx(api));
    expect(api.remove).toHaveBeenCalledWith('ansprechpartner', { id: `eq.${X}` });

    const einladen = vi.fn(async () => 'sent' as const);
    expect(await A.ansprechpartnerEinladen(fd({ id: X }), ctx(api, { einladen }))).toEqual({
      status: 'ok',
      message: 'Anmeldelink an anna@a.example geschickt.',
    });
    expect(einladen).toHaveBeenCalledWith('anna@a.example');
    expect(await A.ansprechpartnerEinladen(fd({ id: X }), ctx(api, { einladen: async () => 'limit' }))).toEqual({
      status: 'error',
      message: A.ADMIN_TEXT.einladung.limit,
    });
  });

  it('AK-5: Logo: Prüfung, signierter Upload für eigenen Pfad, Übernahme ersetzt und löscht das alte', async () => {
    const api = fakeApi({ kunden: [{ logo_pfad: `${K}/logo-alt.png` }] });
    expect(
      await A.logoVorbereiten(fd({ kunde_id: K, name: 'logo.pdf', type: 'application/pdf', size: '100' }), ctx(api)),
    ).toMatchObject({ status: 'error', errors: { datei: expect.any(String) } });
    expect(api.signUpload).not.toHaveBeenCalled();

    const r = await A.logoVorbereiten(
      fd({ kunde_id: K, name: 'Logo.svg', type: 'image/svg+xml', size: '100' }),
      ctx(api),
    );
    const pfad = `${K}/logo-20261008110000.svg`;
    expect(api.signUpload).toHaveBeenCalledWith('kundenlogos', pfad);
    expect(r).toMatchObject({ status: 'ok', upload: { pfad, url: expect.stringContaining('token=') } });

    for (const bad of [`${Y}/logo-x.png`, `${K}/../x/logo-x.png`, `${K}/datei.png`])
      expect(await A.logoUebernehmen(fd({ kunde_id: K, pfad: bad }), ctx(api))).toMatchObject({ status: 'error' });
    api.info.mockResolvedValueOnce(null);
    expect(await A.logoUebernehmen(fd({ kunde_id: K, pfad }), ctx(api))).toMatchObject({
      errors: { datei: A.ADMIN_TEXT.uploadFehlt },
    });
    expect(api.update).not.toHaveBeenCalled();

    api.info.mockResolvedValueOnce({ size: 3000, type: 'image/svg+xml' });
    expect(await A.logoUebernehmen(fd({ kunde_id: K, pfad }), ctx(api))).toMatchObject({ status: 'ok' });
    expect(api.update).toHaveBeenCalledWith('kunden', K, { logo_pfad: pfad });
    expect(api.removeFiles).toHaveBeenCalledWith('kundenlogos', [`${K}/logo-alt.png`]);
  });
});

describe('Projekte, Schritte, Termine, Dokumente', () => {
  it('AK-6: Projekt anlegen, speichern, Ansprechpartner nur des eigenen Kunden zuordnen', async () => {
    const api = fakeApi({ kundenprojekte: [{ kunde_id: K }], ansprechpartner: [{ id: X }] });
    expect(await A.projektAnlegen(fd({ kunde_id: K, titel: 'Relaunch' }), ctx(api))).toMatchObject({
      redirect: '/kunden/admin/projekte/neu-id',
    });
    expect(api.insert).toHaveBeenCalledWith('kundenprojekte', { titel: 'Relaunch', kunde_id: K });
    await A.projektSpeichern(fd({ id: P, titel: 'R', status: 'in_arbeit' }), ctx(api));
    expect(api.update).toHaveBeenCalledWith('kundenprojekte', P, expect.objectContaining({ status: 'in_arbeit' }));

    api.insert.mockClear();
    await A.projektAnsprechpartner(fd({ projekt_id: P, ansprechpartner: [X, Y, X] }), ctx(api));
    expect(api.get).toHaveBeenCalledWith('ansprechpartner', { select: 'id', kunde_id: `eq.${K}` });
    expect(api.remove).toHaveBeenCalledWith('projekt_ansprechpartner', { projekt_id: `eq.${P}` });
    expect(api.insert).toHaveBeenCalledWith('projekt_ansprechpartner', [{ projekt_id: P, ansprechpartner_id: X }]);
  });

  it('AK-7/AK-8: Schritte und Termine', async () => {
    const api = fakeApi();
    const schritt = {
      reihenfolge: '1',
      titel_de: 'Design',
      status: 'offen',
      verantwortlich: 'erik',
    };
    await A.schrittHinzufuegen(fd({ projekt_id: P, ...schritt }), ctx(api));
    expect(api.insert).toHaveBeenCalledWith(
      'projektschritte',
      expect.objectContaining({ projekt_id: P, titel_de: 'Design' }),
    );
    await A.schrittSpeichern(fd({ id: X, ...schritt, status: 'erledigt' }), ctx(api));
    expect(api.update).toHaveBeenCalledWith('projektschritte', X, expect.objectContaining({ status: 'erledigt' }));
    await A.schrittEntfernen(fd({ id: X }), ctx(api));
    expect(api.remove).toHaveBeenCalledWith('projektschritte', { id: `eq.${X}` });

    await A.terminHinzufuegen(fd({ projekt_id: P, datum: '2026-10-15', beginn: '10:00', ende: '11:00' }), ctx(api));
    expect(api.insert).toHaveBeenCalledWith('termine', {
      projekt_id: P,
      beginn: '2026-10-15T08:00:00.000Z',
      ende: '2026-10-15T09:00:00.000Z',
      titel_de: null,
      titel_en: null,
      meet_url: null,
    });
    await A.terminEntfernen(fd({ id: Y }), ctx(api));
    expect(api.remove).toHaveBeenCalledWith('termine', { id: `eq.${Y}` });
  });

  it('AK-9: Dokument hochladen mit Version, Pfad vom Server, Größe aus dem Storage; entfernen löscht Datei', async () => {
    const api = fakeApi({
      kundenprojekte: [{ kunde_id: K }],
      dokumente: [{ art: 'vertrag', titel: 'Vertrag', version: 2 }],
      'remove:dokumente': [{ storage_pfad: `${K}/${P}/a-vertrag.pdf` }],
    });
    const meta = { projekt_id: P, art: 'vertrag', titel: 'Vertrag' };
    const r = await A.dokumentVorbereiten(
      fd({ ...meta, name: 'Vertrag final.pdf', type: 'application/pdf', size: '5000' }),
      ctx(api),
    );
    const pfad = `${K}/${P}/zz11-vertrag-final.pdf`;
    expect(r).toMatchObject({ status: 'ok', upload: { pfad } });
    expect(api.signUpload).toHaveBeenCalledWith('kundendokumente', pfad);
    expect(
      await A.dokumentVorbereiten(fd({ ...meta, titel: '', name: 'a.exe', type: 'x', size: '1' }), ctx(api)),
    ).toMatchObject({ status: 'error', errors: { titel: expect.any(String), datei: expect.any(String) } });

    expect(
      await A.dokumentUebernehmen(fd({ ...meta, pfad: `${Y}/${P}/x.pdf`, dateiname: 'x.pdf' }), ctx(api)),
    ).toMatchObject({ status: 'error' });
    api.info.mockResolvedValueOnce({ size: 4321, type: 'application/pdf' });
    expect(
      await A.dokumentUebernehmen(fd({ ...meta, pfad, dateiname: 'C:\\fakepath\\Vertrag final.pdf' }), ctx(api)),
    ).toMatchObject({ status: 'ok' });
    expect(api.insert).toHaveBeenCalledWith('dokumente', {
      projekt_id: P,
      art: 'vertrag',
      titel: 'Vertrag',
      storage_pfad: pfad,
      dateiname: 'Vertrag final.pdf',
      groesse_bytes: 4321,
      mime_typ: 'application/pdf',
      version: 3,
    });

    await A.dokumentEntfernen(fd({ id: X }), ctx(api));
    expect(api.remove).toHaveBeenCalledWith('dokumente', { id: `eq.${X}` });
    expect(api.removeFiles).toHaveBeenCalledWith('kundendokumente', [`${K}/${P}/a-vertrag.pdf`]);
  });
});

describe('REST und Storage mit dem Token des Admins', () => {
  it('AK-2: Header, Prefer, Pfade', async () => {
    const fetchMock = vi.fn<(u: string, i?: RequestInit) => Promise<Response>>(
      async () => new Response(JSON.stringify([{ id: 'k1' }])),
    );
    vi.stubGlobal('fetch', fetchMock);
    const api = adminApi(
      { SUPABASE_URL: 'https://db.example', SUPABASE_ANON_KEY: 'anon', SUPABASE_SERVICE_ROLE_KEY: 'geheim' },
      'erik-token',
    )!;
    await api.insert('kunden', { name: 'B' });
    let [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://db.example/rest/v1/kunden');
    expect(init!.method).toBe('POST');
    const h = init!.headers as Record<string, string>;
    expect(h.Authorization).toBe('Bearer erik-token');
    expect(h.apikey).toBe('anon');
    expect(h.Prefer).toBe('return=representation');
    expect(JSON.stringify(fetchMock.mock.calls)).not.toContain('geheim');

    await api.update('kunden', K, { name: 'C' });
    [url, init] = fetchMock.mock.calls[1]!;
    expect(url).toBe(`https://db.example/rest/v1/kunden?id=eq.${K}`);
    expect(init!.method).toBe('PATCH');

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ url: '/object/upload/sign/kundendokumente/a/b%20c.pdf?token=t' })),
    );
    expect(await api.signUpload('kundendokumente', 'a/b c.pdf')).toBe(
      'https://db.example/storage/v1/object/upload/sign/kundendokumente/a/b%20c.pdf?token=t',
    );
    expect(fetchMock.mock.calls[2]![0]).toBe(
      'https://db.example/storage/v1/object/upload/sign/kundendokumente/a/b%20c.pdf',
    );

    fetchMock.mockResolvedValueOnce(new Response('{"code":"23505","message":"dup"}', { status: 409 }));
    await expect(api.insert('ansprechpartner', {})).rejects.toMatchObject({ status: 409, code: '23505' });

    fetchMock.mockResolvedValueOnce(new Response('{"statusCode":"404"}', { status: 400 }));
    expect(await api.info('kundendokumente', 'a/b.pdf')).toBeNull();

    fetchMock.mockResolvedValueOnce(new Response('[]'));
    await api.removeFiles('kundenlogos', ['k/logo.png']);
    [url, init] = fetchMock.mock.calls.at(-1)!;
    expect(url).toBe('https://db.example/storage/v1/object/kundenlogos');
    expect(init!.method).toBe('DELETE');
    expect(JSON.parse(init!.body as string)).toEqual({ prefixes: ['k/logo.png'] });
  });
});
