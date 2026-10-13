import { supabaseDb, type Db } from './helpers/supabase-pglite';

// functions/kundenbereich/angebote.md AK-9, angebot-unterschrift.md AK-4 und AK-5

const ERIK = '00000000-0000-4000-8000-000000000001';
const ANNA = '00000000-0000-4000-8000-000000000002';
const BEN = '00000000-0000-4000-8000-000000000003';
const KA = '10000000-0000-4000-8000-00000000000a';
const KB = '10000000-0000-4000-8000-00000000000b';
const PA = '20000000-0000-4000-8000-0000000000a1';
const PB = '20000000-0000-4000-8000-0000000000b1';
const DOK = '50000000-0000-4000-8000-000000000001';
const DOK_ENTWURF = '50000000-0000-4000-8000-000000000002';
const DOK_B = '50000000-0000-4000-8000-000000000003';

let db: Db;
const rows = async (sql: string, params: unknown[] = []) => (await db.query<Record<string, unknown>>(sql, params)).rows;
async function fails(sql: string, params: unknown[] = []) {
  try {
    await db.query(sql, params);
  } catch (error) {
    return String(error);
  }
  return null;
}
const pfad = (k: string, p: string, name: string) => `${k}/${p}/${name}`;
const datei = (name: string, mimetype = 'application/pdf', size = 120_000) =>
  db.query(`insert into storage.objects (bucket_id, name, metadata) values ('kundendokumente', $1, $2)`, [
    name,
    JSON.stringify({ mimetype, size }),
  ]);
const eintragen = (dok: string, p: string) =>
  rows('select public.unterschrift_eintragen($1, $2, $3) as id', [dok, p, 'Angebot unterschrieben.pdf']);

beforeAll(async () => {
  db = await supabaseDb(
    'supabase/migrations/20261008000000_kundenbereich.sql',
    'supabase/migrations/20261013200000_angebote.sql',
  );
  await db.exec(`
    insert into auth.users (id, email) values ('${ERIK}', 'erik@example.org'), ('${ANNA}', 'anna@a.example'), ('${BEN}', 'ben@b.example');
    insert into public.admins (user_id) values ('${ERIK}');
    insert into public.kunden (id, name) values ('${KA}', 'Kunde A'), ('${KB}', 'Kunde B');
    insert into public.ansprechpartner (id, kunde_id, user_id, name, email) values
      ('30000000-0000-4000-8000-000000000002', '${KA}', '${ANNA}', 'Anna', 'anna@a.example'),
      ('30000000-0000-4000-8000-000000000003', '${KB}', '${BEN}', 'Ben', 'ben@b.example');
    insert into public.kundenprojekte (id, kunde_id, titel) values ('${PA}', '${KA}', 'Website A'), ('${PB}', '${KB}', 'Website B');
    insert into public.projekt_ansprechpartner values ('${PA}', '30000000-0000-4000-8000-000000000002'), ('${PB}', '30000000-0000-4000-8000-000000000003');
    insert into public.dokumente (id, projekt_id, art, titel, storage_pfad, dateiname) values
      ('${DOK}', '${PA}', 'angebot', 'Angebot 2026-001', '${KA}/${PA}/angebot-2026-001-a.pdf', 'Angebot-2026-001.pdf'),
      ('${DOK_ENTWURF}', '${PA}', 'angebot', 'Angebot 2026-002', '${KA}/${PA}/angebot-2026-002-a.pdf', 'Angebot-2026-002.pdf'),
      ('${DOK_B}', '${PB}', 'angebot', 'Angebot 2026-003', '${KB}/${PB}/angebot-2026-003-a.pdf', 'Angebot-2026-003.pdf');
    insert into public.angebote (projekt_id, nummer, titel, datum, gueltig_bis, positionen, pdf_pfad, status, dokument_id) values
      ('${PA}', '2026-001', 'Website A', '2026-10-13', '2026-11-12', '[{"bezeichnung":"Design"}]', '${KA}/${PA}/angebot-2026-001-a.pdf', 'freigegeben', '${DOK}'),
      ('${PA}', '2026-002', 'Website A', '2026-10-13', '2026-11-12', '[{"bezeichnung":"Design"}]', '${KA}/${PA}/angebot-2026-002-a.pdf', 'entwurf', '${DOK_ENTWURF}'),
      ('${PB}', '2026-003', 'Website B', '2026-10-13', '2026-11-12', '[{"bezeichnung":"Design"}]', '${KB}/${PB}/angebot-2026-003-a.pdf', 'freigegeben', '${DOK_B}');
  `);
}, 30_000);

describe('Angebote: Daten und Regeln', () => {
  it('AK-9: nur der Admin liest und schreibt Angebote', async () => {
    await db.as(ERIK, async () => {
      expect(await rows('select nummer from public.angebote')).toHaveLength(3);
    });
    for (const user of [null, ANNA]) {
      await db.as(user, async () => {
        const error = await fails('select * from public.angebote');
        if (!error) expect(await rows('select * from public.angebote')).toHaveLength(0);
        expect(
          await fails(
            `insert into public.angebote (projekt_id, nummer, titel, datum, gueltig_bis, positionen, pdf_pfad) values ('${PA}', '2026-009', 'x', '2026-10-13', '2026-10-14', '[{}]', 'x')`,
          ),
        ).not.toBeNull();
      });
    }
  });

  it('AK-9: Nummer im Format und Gültig bis nicht vor dem Datum', async () => {
    const neu = (nummer: string, bis: string) =>
      fails(
        `insert into public.angebote (projekt_id, nummer, titel, datum, gueltig_bis, positionen, pdf_pfad) values ('${PA}', $1, 'x', '2026-10-13', $2, '[{}]', $1 || '.pdf')`,
        [nummer, bis],
      );
    expect(await neu('26-1', '2026-10-14')).not.toBeNull();
    expect(await neu('2026-010', '2026-10-12')).not.toBeNull();
    expect(await neu('2026-001', '2026-10-14')).not.toBeNull();
    expect(await neu('2026-010', '2026-10-13')).toBeNull();
  });
});

describe('Unterschrift hochladen: Regeln', () => {
  it('AK-4: Upload nur unter unterschrift-* im eigenen Projekt', async () => {
    const versuch = (name: string) =>
      db.as(ANNA, () => fails(`insert into storage.objects (bucket_id, name) values ('kundendokumente', $1)`, [name]));
    expect(await versuch(pfad(KA, PA, 'unterschrift-probe.pdf'))).toBeNull();
    expect(await versuch(pfad(KA, PA, 'vertrag.pdf'))).not.toBeNull();
    expect(await versuch(pfad(KB, PB, 'unterschrift-x.pdf'))).not.toBeNull();
    expect(await versuch(pfad(KB, PA, 'unterschrift-x.pdf'))).not.toBeNull();
    expect(await versuch(`${KA}/${PA}/tief/unterschrift-x.pdf`)).not.toBeNull();
    expect(
      await db.as(ANNA, () =>
        fails(`insert into storage.objects (bucket_id, name) values ('kundenlogos', $1)`, [
          pfad(KA, PA, 'unterschrift-x.pdf'),
        ]),
      ),
    ).not.toBeNull();
    expect(
      await db.as(null, () =>
        fails(`insert into storage.objects (bucket_id, name) values ('kundendokumente', $1)`, [
          pfad(KA, PA, 'unterschrift-y.pdf'),
        ]),
      ),
    ).not.toBeNull();
  });

  it('AK-4: fremde Angebote, Entwürfe, falsche Pfade und fehlende Dateien werden abgelehnt', async () => {
    const ok = pfad(KA, PA, 'unterschrift-aaa111.pdf');
    await datei(ok);
    await datei(pfad(KA, PA, 'unterschrift-gross.pdf'), 'application/pdf', 20_000_000);
    await datei(pfad(KA, PA, 'unterschrift-zip.pdf'), 'application/zip');
    await db.as(ANNA, async () => {
      expect(await fails('select public.unterschrift_eintragen($1, $2, $3)', [DOK_B, ok, 'x.pdf'])).toMatch(
        /nicht gefunden/,
      );
      expect(await fails('select public.unterschrift_eintragen($1, $2, $3)', [DOK_ENTWURF, ok, 'x.pdf'])).toMatch(
        /schon/,
      );
      expect(
        await fails('select public.unterschrift_eintragen($1, $2, $3)', [DOK, pfad(KA, PA, 'vertrag.pdf'), 'x.pdf']),
      ).toMatch(/Pfad/);
      expect(
        await fails('select public.unterschrift_eintragen($1, $2, $3)', [
          DOK,
          pfad(KA, PA, 'unterschrift-fehlt.pdf'),
          'x',
        ]),
      ).toMatch(/fehlt/);
      expect(
        await fails('select public.unterschrift_eintragen($1, $2, $3)', [
          DOK,
          pfad(KA, PA, 'unterschrift-gross.pdf'),
          'x',
        ]),
      ).toMatch(/ungültig/);
      expect(
        await fails('select public.unterschrift_eintragen($1, $2, $3)', [
          DOK,
          pfad(KA, PA, 'unterschrift-zip.pdf'),
          'x',
        ]),
      ).toMatch(/ungültig/);
    });
    await db.as(null, async () => {
      expect(await fails('select public.unterschrift_eintragen($1, $2, $3)', [DOK, ok, 'x'])).not.toBeNull();
    });
  });

  it('AK-5: Eintragen legt das Dokument an und setzt das Angebot auf unterschrieben', async () => {
    const ok = pfad(KA, PA, 'unterschrift-aaa111.pdf');
    const [r] = await db.as(ANNA, () => eintragen(DOK, ok));
    const [d] = await rows('select * from public.dokumente where id = $1', [r!.id]);
    expect(d).toMatchObject({
      art: 'unterschrift',
      titel: 'Angebot 2026-001, unterschrieben',
      zu_dokument: DOK,
      projekt_id: PA,
      mime_typ: 'application/pdf',
      dateiname: 'Angebot unterschrieben.pdf',
    });
    const [a] = await rows(
      `select status, unterschrift_id, unterschrieben_am from public.angebote where nummer = '2026-001'`,
    );
    expect(a).toMatchObject({ status: 'unterschrieben', unterschrift_id: r!.id });
    expect(a!.unterschrieben_am).not.toBeNull();
    // Anna sieht die Datei, ein zweites Mal geht nicht
    await db.as(ANNA, async () => {
      expect(await rows('select id from public.dokumente where zu_dokument = $1', [DOK])).toHaveLength(1);
      expect(await fails('select public.unterschrift_eintragen($1, $2, $3)', [DOK, ok, 'x'])).toMatch(/schon/);
    });
  });

  it('Löschen des Angebots-Dokuments nimmt die Unterschrift mit', async () => {
    await db.query('delete from public.dokumente where id = $1', [DOK]);
    expect(await rows('select id from public.dokumente where zu_dokument = $1', [DOK])).toHaveLength(0);
  });
});
