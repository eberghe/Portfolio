import { beforeAll, describe, expect, it } from 'vitest';
import { supabaseDb, type Db } from './helpers/supabase-pglite';

// functions/kundenbereich/datenmodell.md

const MIGRATION = 'supabase/migrations/20261008000000_kundenbereich.sql';

const ERIK = '00000000-0000-4000-8000-000000000001'; // Admin
const ANNA = '00000000-0000-4000-8000-000000000002'; // Kunde A, Projekt A1
const BEN = '00000000-0000-4000-8000-000000000003'; // Kunde A, nur Projekt A2
const CORA = '00000000-0000-4000-8000-000000000004'; // Kunde B
const KUNDE_A = '10000000-0000-4000-8000-00000000000a';
const KUNDE_B = '10000000-0000-4000-8000-00000000000b';
const A1 = '20000000-0000-4000-8000-0000000000a1';
const A2 = '20000000-0000-4000-8000-0000000000a2';
const B1 = '20000000-0000-4000-8000-0000000000b1';
const AP_ANNA = '30000000-0000-4000-8000-000000000002';
const AP_BEN = '30000000-0000-4000-8000-000000000003';
const AP_CORA = '30000000-0000-4000-8000-000000000004';

const tables = [
  'admins',
  'kunden',
  'ansprechpartner',
  'kundenprojekte',
  'projekt_ansprechpartner',
  'projektschritte',
  'termine',
  'dokumente',
  'logo_freigaben',
] as const;
const projectTables = ['projektschritte', 'termine', 'dokumente'] as const;

let db: Db;

async function rows(sql: string, params: unknown[] = []) {
  return (await db.query<Record<string, unknown>>(sql, params)).rows;
}
async function one(sql: string, params: unknown[] = []) {
  const [row] = await rows(sql, params);
  if (!row) throw new Error(`keine Zeile: ${sql}`);
  return row;
}
async function fails(sql: string, params: unknown[] = []) {
  try {
    await db.query(sql, params);
  } catch (error) {
    return String(error);
  }
  return null;
}
/** Anzahl betroffener Zeilen; 0, wenn RLS die Zeilen verbirgt */
async function affected(sql: string, params: unknown[] = []) {
  return (await db.query(sql, params)).affectedRows ?? 0;
}

beforeAll(async () => {
  db = await supabaseDb(MIGRATION);
  await db.exec(`
    insert into auth.users (id, email) values
      ('${ERIK}', 'erik@example.org'), ('${ANNA}', 'anna@a.example'), ('${BEN}', 'ben@a.example'), ('${CORA}', 'cora@b.example');
    insert into public.admins (user_id) values ('${ERIK}');
    insert into public.kunden (id, name, logo_pfad) values
      ('${KUNDE_A}', 'Kunde A', '${KUNDE_A}/logo.svg'), ('${KUNDE_B}', 'Kunde B', '${KUNDE_B}/logo.svg');
    insert into public.ansprechpartner (id, kunde_id, user_id, name, email) values
      ('${AP_ANNA}', '${KUNDE_A}', '${ANNA}', 'Anna', 'Anna@A.example'),
      ('${AP_BEN}', '${KUNDE_A}', '${BEN}', 'Ben', 'ben@a.example'),
      ('${AP_CORA}', '${KUNDE_B}', '${CORA}', 'Cora', 'cora@b.example');
    insert into public.kundenprojekte (id, kunde_id, titel) values
      ('${A1}', '${KUNDE_A}', 'Website A'), ('${A2}', '${KUNDE_A}', 'Logo A'), ('${B1}', '${KUNDE_B}', 'Website B');
    insert into public.projekt_ansprechpartner (projekt_id, ansprechpartner_id) values
      ('${A1}', '${AP_ANNA}'), ('${A2}', '${AP_BEN}'), ('${B1}', '${AP_CORA}');
  `);
  for (const p of [A1, A2, B1]) {
    const kunde = p === B1 ? KUNDE_B : KUNDE_A;
    await db.exec(`
      insert into public.projektschritte (projekt_id, reihenfolge, titel_de) values ('${p}', 1, 'Kick-off');
      insert into public.termine (projekt_id, beginn, ende, titel_de, meet_url)
        values ('${p}', '2026-11-01 10:00+01', '2026-11-01 11:00+01', 'Abstimmung', 'https://meet.google.com/abc-defg-hij');
      insert into public.dokumente (projekt_id, art, titel, storage_pfad, dateiname)
        values ('${p}', 'vertrag', 'Vertrag', '${kunde}/${p}/vertrag.pdf', 'vertrag.pdf');
      insert into storage.objects (bucket_id, name) values ('kundendokumente', '${kunde}/${p}/vertrag.pdf');
    `);
  }
  await db.exec(`
    insert into storage.objects (bucket_id, name) values
      ('kundenlogos', '${KUNDE_A}/logo.svg'), ('kundenlogos', '${KUNDE_B}/logo.svg'),
      ('kundendokumente', '${KUNDE_A}/${A1}/nicht-eingetragen.pdf');
  `);
});

describe('Kundenbereich Datenmodell', () => {
  it('AK-1: anon sieht nichts, weder Tabellen noch Dateien', async () => {
    await db.as(null, async () => {
      for (const t of tables) {
        const error = await fails(`select * from public.${t}`);
        if (!error) expect(await rows(`select * from public.${t}`), t).toHaveLength(0);
      }
      expect(await rows('select * from storage.objects')).toHaveLength(0);
    });
  });

  it('AK-2: Ansprechpartner sieht nur eigenen Kunden und zugeordnete Projekte', async () => {
    await db.as(ANNA, async () => {
      expect((await rows('select id from public.kunden')).map((r) => r.id)).toEqual([KUNDE_A]);
      expect((await rows('select name from public.ansprechpartner order by name')).map((r) => r.name)).toEqual([
        'Anna',
        'Ben',
      ]);
      expect((await rows('select id from public.kundenprojekte')).map((r) => r.id)).toEqual([A1]);
      for (const t of projectTables)
        expect(
          (await rows(`select projekt_id from public.${t}`)).map((r) => r.projekt_id),
          t,
        ).toEqual([A1]);
      expect(await rows('select * from public.admins')).toHaveLength(0);
    });
    await db.as(BEN, async () => {
      expect((await rows('select id from public.kundenprojekte')).map((r) => r.id)).toEqual([A2]);
    });
    await db.as(CORA, async () => {
      expect((await rows('select id from public.kunden')).map((r) => r.id)).toEqual([KUNDE_B]);
      expect((await rows('select id from public.kundenprojekte')).map((r) => r.id)).toEqual([B1]);
    });
  });

  it('AK-3: Ansprechpartner kann nichts anlegen, ändern oder löschen', async () => {
    await db.as(ANNA, async () => {
      expect(await fails(`insert into public.kunden (name) values ('X')`)).toMatch(/row-level security|permission/);
      expect(await fails(`insert into public.kundenprojekte (kunde_id, titel) values ('${KUNDE_A}', 'X')`)).toMatch(
        /row-level security|permission/,
      );
      expect(
        await fails(
          `insert into public.ansprechpartner (kunde_id, name, email) values ('${KUNDE_A}', 'X', 'x@a.example')`,
        ),
      ).toMatch(/row-level security|permission/);
      expect(await fails(`insert into public.admins (user_id) values ('${ANNA}')`)).toMatch(
        /row-level security|permission/,
      );
      for (const sql of [
        `update public.kunden set name = 'Gehackt'`,
        `update public.kundenprojekte set status = 'abgeschlossen'`,
        `update public.projektschritte set status = 'erledigt'`,
        `update public.termine set meet_url = 'https://evil.example'`,
        `update public.dokumente set titel = 'X'`,
        `update public.ansprechpartner set name = 'X'`,
        `delete from public.dokumente`,
        `delete from public.kundenprojekte`,
      ]) {
        const error = await fails(sql);
        if (!error) expect(await affected(sql), sql).toBe(0);
      }
    });
    expect((await one(`select name from public.kunden where id = '${KUNDE_A}'`)).name).toBe('Kunde A');
    expect(await rows('select * from public.dokumente')).toHaveLength(3);
  });

  it('AK-4: Logo-Freigabe nur für eigenen Kunden, im eigenen Namen, mit Datenbankzeit', async () => {
    await db.as(ANNA, async () => {
      await db.query(
        `insert into public.logo_freigaben (kunde_id, ansprechpartner_id, entscheidung, am) values ($1, $2, 'erteilt', '2000-01-01')`,
        [KUNDE_A, AP_ANNA],
      );
    });
    let kunde = await one(`select logo_freigabe, logo_freigabe_am from public.kunden where id = '${KUNDE_A}'`);
    expect(kunde.logo_freigabe).toBe('erteilt');
    expect(new Date(kunde.logo_freigabe_am as string).getFullYear()).toBeGreaterThan(2000);
    const eintrag = await one(`select am from public.logo_freigaben where kunde_id = '${KUNDE_A}'`);
    expect(new Date(eintrag.am as string).getFullYear()).toBeGreaterThan(2000);

    await db.as(BEN, async () => {
      await db.query(
        `insert into public.logo_freigaben (kunde_id, ansprechpartner_id, entscheidung) values ($1, $2, 'widerrufen')`,
        [KUNDE_A, AP_BEN],
      );
    });
    kunde = await one(`select logo_freigabe from public.kunden where id = '${KUNDE_A}'`);
    expect(kunde.logo_freigabe).toBe('widerrufen');

    await db.as(ANNA, async () => {
      expect(
        await fails(
          `insert into public.logo_freigaben (kunde_id, ansprechpartner_id, entscheidung) values ($1, $2, 'erteilt')`,
          [KUNDE_B, AP_CORA],
        ),
      ).toMatch(/row-level security/);
      expect(
        await fails(
          `insert into public.logo_freigaben (kunde_id, ansprechpartner_id, entscheidung) values ($1, $2, 'erteilt')`,
          [KUNDE_A, AP_BEN],
        ),
      ).toMatch(/row-level security/);
      expect(
        await fails(
          `insert into public.logo_freigaben (kunde_id, ansprechpartner_id, entscheidung) values ($1, $2, 'erteilt')`,
          [KUNDE_B, AP_ANNA],
        ),
      ).toMatch(/row-level security|violates/);
      expect((await rows('select kunde_id from public.logo_freigaben')).every((r) => r.kunde_id === KUNDE_A)).toBe(
        true,
      );
    });
    kunde = await one(`select logo_freigabe from public.kunden where id = '${KUNDE_B}'`);
    expect(kunde.logo_freigabe).toBe('offen');
  });

  it('AK-5: Admin darf alles', async () => {
    await db.as(ERIK, async () => {
      for (const t of tables) expect((await rows(`select * from public.${t}`)).length, t).toBeGreaterThan(0);
      const neu = await one(`insert into public.kunden (name) values ('Kunde C') returning id`);
      const projekt = await one(`insert into public.kundenprojekte (kunde_id, titel) values ($1, 'P') returning id`, [
        neu.id,
      ]);
      await db.query(
        `insert into public.ansprechpartner (kunde_id, name, email) values ($1, 'Dora', 'dora@c.example')`,
        [neu.id],
      );
      await db.query(
        `insert into public.dokumente (projekt_id, art, titel, storage_pfad, dateiname) values ($1, 'rechnung', 'R1', $2, 'r1.pdf')`,
        [projekt.id, `${neu.id}/${projekt.id}/r1.pdf`],
      );
      expect(await affected(`update public.kundenprojekte set status = 'in_arbeit' where id = $1`, [projekt.id])).toBe(
        1,
      );
      expect(await affected(`delete from public.kunden where id = $1`, [neu.id])).toBe(1);
    });
    expect(await rows(`select * from public.ansprechpartner where email = 'dora@c.example'`)).toHaveLength(0);
  });

  it('AK-6: Storage nur eigene, eingetragene Dateien; Hochladen nur Admin', async () => {
    await db.as(ANNA, async () => {
      expect((await rows('select bucket_id, name from storage.objects order by name')).map((r) => r.name)).toEqual([
        `${KUNDE_A}/${A1}/vertrag.pdf`,
        `${KUNDE_A}/logo.svg`,
      ]);
      expect(
        await fails(
          `insert into storage.objects (bucket_id, name) values ('kundendokumente', '${KUNDE_A}/${A1}/x.pdf')`,
        ),
      ).toMatch(/row-level security/);
      expect(
        await fails(`insert into storage.objects (bucket_id, name) values ('kundenlogos', '${KUNDE_A}/neu.svg')`),
      ).toMatch(/row-level security/);
    });
    await db.as(ERIK, async () => {
      await db.query(
        `insert into storage.objects (bucket_id, name) values ('kundendokumente', '${KUNDE_B}/${B1}/rechnung.pdf')`,
      );
      await db.query(`insert into storage.objects (bucket_id, name) values ('kundenlogos', '${KUNDE_B}/neu.svg')`);
      expect((await rows(`select * from storage.objects`)).length).toBeGreaterThanOrEqual(8);
    });
  });

  it('AK-7: Datenprüfungen', async () => {
    expect((await one(`select email from public.ansprechpartner where id = '${AP_ANNA}'`)).email).toBe(
      'anna@a.example',
    );
    expect(
      await fails(
        `insert into public.ansprechpartner (kunde_id, name, email) values ('${KUNDE_B}', 'Doppelt', 'ANNA@a.example')`,
      ),
    ).toMatch(/unique|duplicate/);
    expect(
      await fails(
        `insert into public.termine (projekt_id, beginn, ende) values ('${A1}', '2026-11-01 11:00+01', '2026-11-01 10:00+01')`,
      ),
    ).toMatch(/check/);
    expect(
      await fails(
        `insert into public.termine (projekt_id, beginn, ende, meet_url) values ('${A1}', '2026-11-01 10:00+01', '2026-11-01 11:00+01', 'javascript:alert(1)')`,
      ),
    ).toMatch(/check/);
    expect(await fails(`update public.kundenprojekte set status = 'irgendwas' where id = '${A1}'`)).toMatch(/check/);
    expect(await fails(`update public.projektschritte set status = 'irgendwas'`)).toMatch(/check/);
    expect(await fails(`update public.dokumente set art = 'irgendwas'`)).toMatch(/check/);
  });

  it('AK-8: Buckets privat mit Größen- und Typbegrenzung', async () => {
    const buckets = await rows(
      `select * from storage.buckets where id in ('kundenlogos', 'kundendokumente') order by id`,
    );
    expect(buckets.map((b) => b.id)).toEqual(['kundendokumente', 'kundenlogos']);
    for (const b of buckets) {
      expect(b.public).toBe(false);
      expect(Number(b.file_size_limit)).toBeGreaterThan(0);
      expect((b.allowed_mime_types as string[]).length).toBeGreaterThan(0);
    }
  });
});
