// @vitest-environment node
import { AdminFehler } from '@/lib/kundenbereich/admin/api';
import type { AdminApi, AdminCtx } from '@/lib/kundenbereich/admin/aktionen';
import {
  angebotFreigeben,
  angebotLoeschen,
  angebotPdfAntwort,
  angebotSpeichern,
} from '@/lib/kundenbereich/admin/angebote';
import { angebotDaten } from '@/lib/kundenbereich/angebot/pruefen';
import { euro, naechsteNummer, summen } from '@/lib/kundenbereich/angebot/rechnen';

// functions/kundenbereich/angebote.md AK-1 bis AK-6, AK-8, AK-10

const PID = '20000000-0000-4000-8000-0000000000a1';
const KID = '10000000-0000-4000-8000-00000000000a';
const AID = '60000000-0000-4000-8000-000000000001';
const DID = '50000000-0000-4000-8000-000000000001';
const UID = '50000000-0000-4000-8000-000000000002';

function formular(extra: Record<string, string> = {}, positionen?: Record<string, string>[]) {
  const fd = new FormData();
  const werte: Record<string, string> = {
    projekt_id: PID,
    nummer: '2026-002',
    titel: 'Relaunch',
    sprache: 'de',
    datum: '2026-10-13',
    gueltig_bis: '2026-11-12',
    empfaenger: 'Kunde A\nAnna',
    einleitung: '',
    ust_satz: '19',
    ...extra,
  };
  for (const [k, v] of Object.entries(werte)) fd.set(k, v);
  (
    positionen ?? [{ bezeichnung: 'Design', beschreibung: 'Figma', menge: '2', einheit: 'Tage', preis: '760,00' }]
  ).forEach((p, i) => Object.entries(p).forEach(([k, v]) => fd.set(`pos.${i}.${k}`, v)));
  return fd;
}

function fakeApi(tabellen: Record<string, Record<string, unknown>[]> = {}) {
  const api = {
    get: vi.fn(async (table: string) => tabellen[table] ?? []),
    insert: vi.fn(async (table: string, row: Record<string, unknown>) => ({
      id: table === 'dokumente' ? DID : AID,
      ...row,
    })),
    update: vi.fn(async (_t: string, id: string, patch: Record<string, unknown>) => ({ id, ...patch })),
    remove: vi.fn(async (table: string) => tabellen[`${table}:entfernt`] ?? []),
    removeFiles: vi.fn(async () => []),
    upload: vi.fn(async () => undefined),
    info: vi.fn(async () => ({ size: 31_000, type: 'application/pdf' })),
    sign: vi.fn(async (_b: string, pfad: string) => `https://sb.example/sign/${pfad}?token=x`),
  };
  return api;
}
const ctx = (api: ReturnType<typeof fakeApi>, admin = true): AdminCtx => ({
  api: api as unknown as AdminApi,
  admin,
  zufall: () => 'zz11',
});

describe('Angebot: Prüfung und Beträge', () => {
  it('AK-1: Pflichtfelder, Format der Nummer, Datum und Positionen', () => {
    const r = angebotDaten(
      formular({ nummer: '26-1', titel: '', gueltig_bis: '2026-10-01' }, [
        { bezeichnung: '', menge: '0', preis: '-5', einheit: '', beschreibung: '' },
        { bezeichnung: 'Ok', menge: '1,5', preis: '100', einheit: 'Std.', beschreibung: '' },
      ]),
    );
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(Object.keys(r.errors)).toEqual(
      expect.arrayContaining(['nummer', 'titel', 'gueltig_bis', 'pos.0.bezeichnung', 'pos.0.menge', 'pos.0.preis']),
    );
    expect(r.errors['pos.1.bezeichnung']).toBeUndefined();
    const leer = angebotDaten(formular({}, []));
    expect(leer.ok).toBe(false);
    if (!leer.ok) expect(leer.errors.positionen).toBeTruthy();
  });

  it('AK-1: Beträge und Mengen in deutscher und englischer Schreibweise', () => {
    const r = angebotDaten(
      formular({}, [
        { bezeichnung: 'A', beschreibung: '', menge: '24,5', einheit: 'Std.', preis: '1.234,56' },
        { bezeichnung: 'B', beschreibung: '', menge: '2', einheit: '', preis: '99.5' },
        { bezeichnung: 'C', beschreibung: '', menge: '1', einheit: 'pauschal', preis: '1200' },
      ]),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.positionen.map((p) => [p.menge, p.einzelpreis_cent])).toEqual([
      [24.5, 123456],
      [2, 9950],
      [1, 120000],
    ]);
    expect(r.data).toMatchObject({ nummer: '2026-002', sprache: 'de', ust_satz: 19, empfaenger: 'Kunde A\nAnna' });
  });

  it('AK-2: Beträge in Cent, Steuer gerundet', () => {
    const s = summen(
      [
        { bezeichnung: 'A', beschreibung: '', menge: 1, einheit: '', einzelpreis_cent: 240000 },
        { bezeichnung: 'B', beschreibung: '', menge: 24.5, einheit: '', einzelpreis_cent: 9500 },
      ],
      19,
    );
    expect(s).toEqual({ zeilen: [240000, 232750], netto: 472750, ust: 89823, gesamt: 562573 });
    expect(summen([{ bezeichnung: 'A', beschreibung: '', menge: 3, einheit: '', einzelpreis_cent: 333 }], 0)).toEqual({
      zeilen: [999],
      netto: 999,
      ust: 0,
      gesamt: 999,
    });
    expect(euro(562573, 'de')).toBe('5.625,73 €');
    expect(euro(562573, 'en')).toBe('€5,625.73');
  });

  it('AK-3: nächste Nummer im Jahr', () => {
    expect(naechsteNummer([], 2026)).toBe('2026-001');
    expect(naechsteNummer(['2026-001', '2026-007', '2025-012', 'x'], 2026)).toBe('2026-008');
    expect(naechsteNummer(['2025-012'], 2026)).toBe('2026-001');
  });
});

describe('Angebot: Aktionen der Verwaltung', () => {
  const projekt = { kundenprojekte: [{ kunde_id: KID, titel: 'Website A' }] };

  it('AK-4: Entwurf speichern erzeugt das PDF, legt es ab und speichert ohne Dokument', async () => {
    const api = fakeApi(projekt);
    const r = await angebotSpeichern(formular(), ctx(api));
    expect(r).toMatchObject({ status: 'ok', message: 'Entwurf gespeichert.' });
    const pfad = `${KID}/${PID}/angebot-2026-002-zz11.pdf`;
    expect(api.upload).toHaveBeenCalledWith('kundendokumente', pfad, expect.any(Uint8Array), 'application/pdf');
    const bytes = (api.upload.mock.calls[0] as unknown[])[2] as Uint8Array;
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe('%PDF-');
    expect(api.insert).toHaveBeenCalledTimes(1);
    expect(api.insert).toHaveBeenCalledWith(
      'angebote',
      expect.objectContaining({
        projekt_id: PID,
        nummer: '2026-002',
        status: 'entwurf',
        pdf_pfad: pfad,
        gesamt_cent: 180880,
        positionen: [
          { bezeichnung: 'Design', beschreibung: 'Figma', menge: 2, einheit: 'Tage', einzelpreis_cent: 76000 },
        ],
      }),
    );
  });

  it('AK-3: vergebene Nummer meldet den Fehler am Feld und räumt das PDF weg', async () => {
    const api = fakeApi(projekt);
    api.insert.mockRejectedValueOnce(new AdminFehler(409, '23505', 'dup'));
    const r = await angebotSpeichern(formular(), ctx(api));
    expect(r).toMatchObject({ status: 'error', errors: { nummer: 'Diese Nummer ist schon vergeben.' } });
    expect(api.removeFiles).toHaveBeenCalledWith('kundendokumente', [`${KID}/${PID}/angebot-2026-002-zz11.pdf`]);
  });

  it('AK-1: ohne Admin oder mit Fehlern wird nichts erzeugt', async () => {
    const api = fakeApi(projekt);
    expect((await angebotSpeichern(formular(), ctx(api, false))).status).toBe('error');
    expect((await angebotSpeichern(formular({ titel: '' }), ctx(api))).status).toBe('error');
    expect(api.upload).not.toHaveBeenCalled();
  });

  it('AK-5: Bearbeiten ersetzt PDF und Daten eines Entwurfs, nicht eines freigegebenen', async () => {
    const alt = { id: AID, projekt_id: PID, status: 'entwurf', pdf_pfad: `${KID}/${PID}/angebot-2026-002-alt.pdf` };
    const api = fakeApi({ ...projekt, angebote: [alt] });
    const r = await angebotSpeichern(formular({ id: AID }), ctx(api));
    expect(r.status).toBe('ok');
    expect(api.update).toHaveBeenCalledWith(
      'angebote',
      AID,
      expect.objectContaining({ pdf_pfad: `${KID}/${PID}/angebot-2026-002-zz11.pdf` }),
    );
    expect(api.insert).not.toHaveBeenCalled();
    expect(api.removeFiles).toHaveBeenCalledWith('kundendokumente', [alt.pdf_pfad]);

    const frei = fakeApi({ ...projekt, angebote: [{ ...alt, status: 'freigegeben' }] });
    expect((await angebotSpeichern(formular({ id: AID }), ctx(frei))).status).toBe('error');
    expect(frei.upload).not.toHaveBeenCalled();
  });

  it('AK-6: Freigeben legt das Dokument an und setzt den Status', async () => {
    const a = { id: AID, projekt_id: PID, nummer: '2026-002', sprache: 'de', status: 'entwurf', pdf_pfad: 'k/p/a.pdf' };
    const api = fakeApi({ angebote: [a] });
    const fd = new FormData();
    fd.set('id', AID);
    expect(await angebotFreigeben(fd, ctx(api))).toMatchObject({ status: 'ok' });
    expect(api.insert).toHaveBeenCalledWith('dokumente', {
      projekt_id: PID,
      art: 'angebot',
      titel: 'Angebot 2026-002',
      storage_pfad: 'k/p/a.pdf',
      dateiname: 'Angebot-2026-002.pdf',
      groesse_bytes: 31_000,
      mime_typ: 'application/pdf',
      version: 1,
    });
    expect(api.update).toHaveBeenCalledWith('angebote', AID, { status: 'freigegeben', dokument_id: DID });

    const en = fakeApi({ angebote: [{ ...a, sprache: 'en' }] });
    await angebotFreigeben(fd, ctx(en));
    expect(en.insert).toHaveBeenCalledWith(
      'dokumente',
      expect.objectContaining({ titel: 'Quote 2026-002', dateiname: 'Quote-2026-002.pdf' }),
    );

    const schon = fakeApi({ angebote: [{ ...a, status: 'freigegeben' }] });
    expect((await angebotFreigeben(fd, ctx(schon))).status).toBe('error');
    expect(schon.insert).not.toHaveBeenCalled();
  });

  it('AK-8: Löschen entfernt Angebot, Dokumente und Dateien', async () => {
    const api = fakeApi({
      angebote: [{ id: AID, nummer: '2026-002', pdf_pfad: 'k/p/a.pdf', dokument_id: DID, unterschrift_id: UID }],
      dokumente: [{ storage_pfad: 'k/p/a.pdf' }, { storage_pfad: 'k/p/unterschrift-x.pdf' }],
      'angebote:entfernt': [{ id: AID }],
    });
    const fd = new FormData();
    fd.set('id', AID);
    expect(await angebotLoeschen(fd, ctx(api))).toMatchObject({ status: 'ok', message: 'Angebot 2026-002 gelöscht.' });
    expect(api.remove).toHaveBeenCalledWith('angebote', { id: `eq.${AID}` });
    expect(api.remove).toHaveBeenCalledWith('dokumente', { id: `in.(${DID},${UID})` });
    expect(api.removeFiles).toHaveBeenCalledWith('kundendokumente', ['k/p/a.pdf', 'k/p/unterschrift-x.pdf']);
  });

  it('AK-10: PDF ansehen nur für Admins, mit kurzem Link', async () => {
    const api = fakeApi({ angebote: [{ pdf_pfad: 'k/p/a.pdf' }] });
    const res = await angebotPdfAntwort(AID, api as unknown as AdminApi);
    expect(res.status).toBe(303);
    expect(res.headers.get('Location')).toBe('https://sb.example/sign/k/p/a.pdf?token=x');
    expect(res.headers.get('Cache-Control')).toBe('private, no-store');
    expect(api.sign).toHaveBeenCalledWith('kundendokumente', 'k/p/a.pdf', 60);
    expect((await angebotPdfAntwort(AID, null)).status).toBe(404);
    expect((await angebotPdfAntwort('x', api as unknown as AdminApi)).status).toBe(404);
    expect((await angebotPdfAntwort(AID, fakeApi() as unknown as AdminApi)).status).toBe(404);
  });
});
