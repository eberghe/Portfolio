import { beforeAll, describe, expect, it } from 'vitest';
import { supabaseDb, type Db } from './helpers/supabase-pglite';

// functions/kundenbereich/admin-dashboard.md AK-8, projekt-assistent.md AK-1 und AK-7

const ERIK = '00000000-0000-4000-8000-000000000001';
const ANNA = '00000000-0000-4000-8000-000000000002';
const KUNDE_A = '10000000-0000-4000-8000-00000000000a';
const KUNDE_B = '10000000-0000-4000-8000-00000000000b';
const A1 = '20000000-0000-4000-8000-0000000000a1';
const AP_ANNA = '30000000-0000-4000-8000-000000000002';
const AP_CORA = '30000000-0000-4000-8000-000000000004';
const ANFRAGE = '40000000-0000-4000-8000-000000000001';

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
const anlegen = (daten: unknown) => rows('select public.projekt_anlegen($1::jsonb) as id', [JSON.stringify(daten)]);
const count = async (table: string) => Number((await rows(`select count(*) as n from public.${table}`))[0]!.n);

beforeAll(async () => {
  db = await supabaseDb(
    'supabase/migrations/20261004000000_anfragen.sql',
    'supabase/migrations/20261008000000_kundenbereich.sql',
    'supabase/migrations/20261008200000_dashboard.sql',
  );
  await db.exec(`
    insert into auth.users (id, email) values ('${ERIK}', 'erik@example.org'), ('${ANNA}', 'anna@a.example');
    insert into public.admins (user_id) values ('${ERIK}');
    insert into public.kunden (id, name) values ('${KUNDE_A}', 'Kunde A'), ('${KUNDE_B}', 'Kunde B');
    insert into public.ansprechpartner (id, kunde_id, user_id, name, email) values
      ('${AP_ANNA}', '${KUNDE_A}', '${ANNA}', 'Anna', 'anna@a.example'),
      ('${AP_CORA}', '${KUNDE_B}', null, 'Cora', 'cora@b.example');
    insert into public.kundenprojekte (id, kunde_id, titel) values ('${A1}', '${KUNDE_A}', 'Website A');
    insert into public.projekt_ansprechpartner values ('${A1}', '${AP_ANNA}');
    insert into public.projekt_umsatz (projekt_id, auftragswert_netto, abrechnung_am) values ('${A1}', 8000, '2026-12-01');
    insert into public.anfragen (id, sprache, leistungen, beschreibung, name, email, einwilligung_am)
      values ('${ANFRAGE}', 'de', '{webdesign}', 'Wir brauchen eine neue Website für die Bäckerei.', 'Max', 'max@example.org', now());
  `);
}, 30_000);

describe('Dashboard: Daten und Regeln', () => {
  it('AK-8: Umsatz und Anfragen sieht nur der Admin', async () => {
    for (const user of [null, ANNA])
      await db.as(user, async () => {
        for (const t of ['projekt_umsatz', 'anfragen']) {
          const error = await fails(`select * from public.${t}`);
          if (!error) expect(await rows(`select * from public.${t}`), `${t} als ${user}`).toHaveLength(0);
        }
        await fails(`update public.anfragen set status = 'erledigt'`);
      });
    expect((await rows(`select status from public.anfragen`))[0]!.status).toBe('neu');
    await db.as(ERIK, async () => {
      expect(await rows('select auftragswert_netto, wahrscheinlichkeit from public.projekt_umsatz')).toEqual([
        { auftragswert_netto: '8000.00', wahrscheinlichkeit: 50 },
      ]);
      expect((await rows('select name from public.anfragen')).map((r) => r.name)).toEqual(['Max']);
      await db.query(`update public.anfragen set status = 'beantwortet' where id = $1`, [ANFRAGE]);
      // nur der Status ist änderbar
      expect(await fails(`update public.anfragen set email = 'x@y.de'`)).toMatch(/permission/);
      expect(await fails(`delete from public.anfragen`)).toMatch(/permission/);
      expect(await fails(`update public.projekt_umsatz set wahrscheinlichkeit = 101`)).toMatch(/check/);
    });
    expect((await rows(`select status from public.anfragen`))[0]!.status).toBe('beantwortet');
  });

  it('AK-8: Ansprechpartner dürfen keinen Umsatz schreiben', async () => {
    await db.as(ANNA, async () => {
      expect(
        await fails(`insert into public.projekt_umsatz (projekt_id, auftragswert_netto) values ('${A1}', 1)`),
      ).toMatch(/row-level security|permission|duplicate/);
    });
  });
});

describe('projekt_anlegen', () => {
  const basis = {
    kunde: { name: 'Neue GmbH', website_url: 'https://neu.example' },
    projekt: { titel: 'Relaunch', status: 'angebot' },
    umsatz: { auftragswert_netto: 12500.5, wahrscheinlichkeit: 40, abrechnung_am: '2027-03-01' },
    ansprechpartner_neu: [{ name: 'Nina', email: 'Nina@Neu.example', sprache: 'en' }],
    schritte: [
      { titel_de: 'Kennenlernen', titel_en: 'Getting to know', verantwortlich: 'erik' },
      { titel_de: 'Inhalte liefern', verantwortlich: 'kunde' },
    ],
    termin: {
      beginn: '2026-11-02T09:00:00Z',
      ende: '2026-11-02T10:00:00Z',
      titel_de: 'Kick-off',
      meet_url: 'https://meet.google.com/abc',
    },
  };

  it('AK-1: nur Admins, anon darf die Funktion nicht aufrufen', async () => {
    await db.as(null, async () => {
      expect(await fails(`select public.projekt_anlegen('{}'::jsonb)`)).toMatch(/permission/);
    });
    await db.as(ANNA, async () => {
      expect(await fails(`select public.projekt_anlegen($1::jsonb)`, [JSON.stringify(basis)])).toMatch(/Nur Admins/);
    });
  });

  it('AK-7: legt Kunde, Projekt, Umsatz, Ansprechpartner, Schritte und Termin an', async () => {
    await db.as(ERIK, async () => {
      const [{ id }] = (await anlegen(basis)) as [{ id: string }];
      const [p] = await rows(
        `select p.titel, p.status, k.name, k.website_url from public.kundenprojekte p join public.kunden k on k.id = p.kunde_id where p.id = $1`,
        [id],
      );
      expect(p).toEqual({
        titel: 'Relaunch',
        status: 'angebot',
        name: 'Neue GmbH',
        website_url: 'https://neu.example',
      });
      expect(
        await rows(
          `select auftragswert_netto, wahrscheinlichkeit, abrechnung_am::text as d from public.projekt_umsatz where projekt_id = $1`,
          [id],
        ),
      ).toEqual([{ auftragswert_netto: '12500.50', wahrscheinlichkeit: 40, d: '2027-03-01' }]);
      expect(
        await rows(
          `select a.name, a.email, a.sprache from public.projekt_ansprechpartner pa join public.ansprechpartner a on a.id = pa.ansprechpartner_id where pa.projekt_id = $1`,
          [id],
        ),
      ).toEqual([{ name: 'Nina', email: 'nina@neu.example', sprache: 'en' }]);
      expect(
        await rows(
          `select reihenfolge, titel_de, titel_en, verantwortlich, status from public.projektschritte where projekt_id = $1 order by reihenfolge`,
          [id],
        ),
      ).toEqual([
        {
          reihenfolge: 1,
          titel_de: 'Kennenlernen',
          titel_en: 'Getting to know',
          verantwortlich: 'erik',
          status: 'aktiv',
        },
        { reihenfolge: 2, titel_de: 'Inhalte liefern', titel_en: null, verantwortlich: 'kunde', status: 'offen' },
      ]);
      expect(await rows(`select titel_de, meet_url from public.termine where projekt_id = $1`, [id])).toEqual([
        { titel_de: 'Kick-off', meet_url: 'https://meet.google.com/abc' },
      ]);
    });
  });

  it('AK-7: bestehender Kunde mit vorhandenem Ansprechpartner, ohne Umsatz und Termin', async () => {
    await db.as(ERIK, async () => {
      const [{ id }] = (await anlegen({
        kunde_id: KUNDE_A,
        projekt: { titel: 'Logo' },
        ansprechpartner_ids: [AP_ANNA],
        schritte: [],
        umsatz: null,
        termin: null,
      })) as [{ id: string }];
      expect(await rows(`select kunde_id, status from public.kundenprojekte where id = $1`, [id])).toEqual([
        { kunde_id: KUNDE_A, status: 'angebot' },
      ]);
      expect(
        await rows(`select ansprechpartner_id from public.projekt_ansprechpartner where projekt_id = $1`, [id]),
      ).toEqual([{ ansprechpartner_id: AP_ANNA }]);
    });
  });

  it('AK-7: Fehler hinterlassen keine Daten', async () => {
    await db.as(ERIK, async () => {
      const vorher = await Promise.all(['kunden', 'kundenprojekte', 'ansprechpartner', 'projektschritte'].map(count));
      // fremder Ansprechpartner
      expect(
        await fails(`select public.projekt_anlegen($1::jsonb)`, [
          JSON.stringify({ kunde_id: KUNDE_A, projekt: { titel: 'X' }, ansprechpartner_ids: [AP_CORA] }),
        ]),
      ).toMatch(/gehört nicht zum Kunden/);
      // doppelte E-Mail nach Kunde und Projekt
      expect(
        await fails(`select public.projekt_anlegen($1::jsonb)`, [
          JSON.stringify({ ...basis, ansprechpartner_neu: [{ name: 'Anna', email: 'anna@a.example' }] }),
        ]),
      ).toMatch(/duplicate|unique/);
      // ungültiger Titel
      expect(
        await fails(`select public.projekt_anlegen($1::jsonb)`, [JSON.stringify({ ...basis, projekt: { titel: '' } })]),
      ).toMatch(/check/);
      const nachher = await Promise.all(['kunden', 'kundenprojekte', 'ansprechpartner', 'projektschritte'].map(count));
      expect(nachher).toEqual(vorher);
    });
  });
});
