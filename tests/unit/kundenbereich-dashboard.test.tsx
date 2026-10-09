import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import * as A from '@/lib/kundenbereich/admin/aktionen';
import {
  dashboardKennzahlen,
  euro,
  projekteNachStatus,
  umsatzPrognose,
  type DashboardDaten,
  type DashboardProjekt,
} from '@/lib/kundenbereich/admin/dashboard';
import { umsatzDaten } from '@/lib/kundenbereich/admin/pruefen';

// functions/kundenbereich/admin-dashboard.md

vi.mock('@/app/actions/kundenbereich-admin', () =>
  Object.fromEntries(['kundeAnlegen', 'anfrageStatus'].map((n) => [n, vi.fn(async () => ({ status: 'idle' }))])),
);
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }), notFound: vi.fn() }));
const { default: AdminDashboard } = await import('@/components/kundenbereich/admin/AdminDashboard');

const NOW = new Date('2026-10-08T10:00:00Z');
const fd = (o: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.append(k, v);
  return f;
};

const projekt = (
  id: string,
  status: DashboardProjekt['status'],
  umsatz: DashboardProjekt['projekt_umsatz'],
  extra: Partial<DashboardProjekt> = {},
): DashboardProjekt => ({
  id,
  titel: `Projekt ${id}`,
  status,
  kunden: { id: 'k1', name: 'Bäckerei' },
  projekt_umsatz: umsatz,
  projektschritte: [],
  ...extra,
});
const u = (wert: number | null, datum: string | null, w = 50) => ({
  auftragswert_netto: wert === null ? null : String(wert),
  wahrscheinlichkeit: w,
  abrechnung_am: datum,
});

const PROJEKTE: DashboardProjekt[] = [
  projekt('a', 'in_arbeit', u(10000, '2026-11-15')),
  projekt('b', 'angebot', u(8000, '2026-12-01', 25)),
  projekt('c', 'abgeschlossen', u(4000, '2026-03-01')),
  projekt('d', 'angebot', u(20000, '2028-02-01', 50)),
  projekt('e', 'pausiert', u(9000, '2026-06-01')),
  projekt('f', 'abstimmung', u(null, '2026-06-01')),
  projekt('g', 'in_arbeit', null, {
    titel: 'Alpha',
    projektschritte: [
      { titel_de: 'Konzept', status: 'erledigt', reihenfolge: 1, verantwortlich: 'erik' },
      { titel_de: 'Texte liefern', status: 'aktiv', reihenfolge: 2, verantwortlich: 'kunde' },
      { titel_de: 'Design', status: 'offen', reihenfolge: 3, verantwortlich: 'erik' },
    ],
  }),
];

describe('Umsatzprognose', () => {
  it('AK-2: sicher, gewichtet, pausiert zählt nicht, Jahre lückenlos', () => {
    const p = umsatzPrognose(PROJEKTE, NOW);
    expect(p.jahre).toEqual([
      { jahr: 2026, sicher: 14000, gewichtet: 2000 },
      { jahr: 2027, sicher: 0, gewichtet: 0 },
      { jahr: 2028, sicher: 0, gewichtet: 10000 },
    ]);
    // f ohne Wert, g ohne Umsatz; e pausiert zählt nicht als fehlend
    expect(p.ohneAngaben).toBe(2);
  });

  it('AK-2: ohne Beträge nur das laufende Jahr', () => {
    expect(umsatzPrognose([], NOW).jahre).toEqual([{ jahr: 2026, sicher: 0, gewichtet: 0 }]);
    expect(umsatzPrognose([projekt('x', 'in_arbeit', u(1000, '2024-05-01'))], NOW).jahre.map((j) => j.jahr)).toEqual([
      2024, 2025, 2026,
    ]);
  });

  it('formatiert Euro ohne Nachkommastellen', () => {
    expect(euro(12500.5)).toBe('12.501\u00a0€');
    expect(euro(0)).toBe('0\u00a0€');
  });
});

const DATEN: DashboardDaten = {
  projekte: PROJEKTE,
  termine: [
    {
      id: 't1',
      beginn: '2026-10-09T08:00:00Z',
      ende: '2026-10-09T09:00:00Z',
      titel_de: 'Abstimmung Design',
      meet_url: 'https://meet.google.com/abc',
      kundenprojekte: { id: 'a', titel: 'Projekt a', kunden: { name: 'Bäckerei' } },
    },
    {
      id: 't2',
      beginn: '2026-10-20T08:00:00Z',
      ende: '2026-10-20T09:00:00Z',
      titel_de: null,
      meet_url: null,
      kundenprojekte: { id: 'b', titel: 'Projekt b', kunden: { name: 'Café' } },
    },
  ],
  anfragen: [
    {
      id: '40000000-0000-4000-8000-000000000001',
      created_at: '2026-10-07T10:00:00Z',
      name: 'Max Muster',
      email: 'max@example.org',
      telefon: '0821 123',
      website: 'max.example',
      leistungen: ['web-design-development', 'sonstiges'],
      zeitrahmen: 'bald',
      budget: '2000-5000',
      beschreibung: 'Wir brauchen eine neue Website.',
      status: 'neu',
      sprache: 'de',
    },
    {
      id: '40000000-0000-4000-8000-000000000002',
      created_at: '2026-10-01T10:00:00Z',
      name: 'Erledigt Person',
      email: 'e@example.org',
      telefon: null,
      website: null,
      leistungen: ['sonstiges'],
      zeitrahmen: 'offen',
      budget: 'offen',
      beschreibung: 'Alte Anfrage, schon erledigt.',
      status: 'erledigt',
      sprache: 'de',
    },
  ],
  kunden: [
    {
      id: 'k1',
      name: 'Bäckerei',
      logo_freigabe: 'offen',
      logo_freigabe_am: null,
      kundenprojekte: [{ count: 2 }],
      ansprechpartner: [{ count: 1 }],
    },
  ],
};

describe('Kennzahlen', () => {
  it('AK-1: aktive Projekte, Termine in 7 Tagen, neue Anfragen, Umsatz im Jahr', () => {
    expect(dashboardKennzahlen(DATEN, NOW)).toEqual({
      aktiveProjekte: 3,
      termine7: 1,
      neueAnfragen: 1,
      jahr: 2026,
      umsatzJahr: 16000,
      sicherJahr: 14000,
    });
  });
});

describe('Projekte nach Status', () => {
  it('AK-5: Reihenfolge und nächster offener Schritt', () => {
    const l = projekteNachStatus(PROJEKTE);
    expect(l.map((p) => p.id)).toEqual(['g', 'a', 'f', 'b', 'd', 'e', 'c']);
    expect(l[0]!.naechsterSchritt).toEqual({ titel: 'Texte liefern', verantwortlich: 'kunde' });
    expect(l[1]!.naechsterSchritt).toBeNull();
  });
});

describe('Prüfungen Umsatz', () => {
  it('AK-7: Beträge deutsch und englisch, Grenzen', () => {
    expect(
      umsatzDaten(fd({ auftragswert_netto: '12.500,50', wahrscheinlichkeit: '40', abrechnung_am: '2027-03-01' })),
    ).toEqual({ ok: true, data: { auftragswert_netto: 12500.5, wahrscheinlichkeit: 40, abrechnung_am: '2027-03-01' } });
    expect(umsatzDaten(fd({ auftragswert_netto: '12500.5', wahrscheinlichkeit: '', abrechnung_am: '' }))).toEqual({
      ok: true,
      data: { auftragswert_netto: 12500.5, wahrscheinlichkeit: 50, abrechnung_am: null },
    });
    expect(umsatzDaten(fd({ auftragswert_netto: '', wahrscheinlichkeit: '50', abrechnung_am: '' }))).toMatchObject({
      ok: true,
      data: { auftragswert_netto: null },
    });
    const r = umsatzDaten(fd({ auftragswert_netto: '-5', wahrscheinlichkeit: '101', abrechnung_am: '2027-02-30' }));
    expect(r.ok).toBe(false);
    if (!r.ok)
      expect(Object.keys(r.errors).sort()).toEqual(['abrechnung_am', 'auftragswert_netto', 'wahrscheinlichkeit']);
    expect(umsatzDaten(fd({ auftragswert_netto: '20000000', wahrscheinlichkeit: '1', abrechnung_am: '' })).ok).toBe(
      false,
    );
    expect(umsatzDaten(fd({ auftragswert_netto: '1,234', wahrscheinlichkeit: '1', abrechnung_am: '' })).ok).toBe(false);
  });
});

function fakeApi() {
  return {
    get: vi.fn(async () => [] as never[]),
    insert: vi.fn(async () => ({ id: 'neu' }) as never),
    update: vi.fn(async () => ({}) as never),
    upsert: vi.fn(async () => ({}) as never),
  };
}
const ctx = (api: ReturnType<typeof fakeApi>) => ({ api: api as unknown as A.AdminApi, admin: true });
const P = '20000000-0000-4000-8000-00000000000b';

describe('Aktionen', () => {
  it('AK-7: Umsatz speichern als Upsert', async () => {
    const api = fakeApi();
    expect(
      await A.umsatzSpeichern(
        fd({ projekt_id: P, auftragswert_netto: '8000', wahrscheinlichkeit: '30', abrechnung_am: '' }),
        ctx(api),
      ),
    ).toMatchObject({ status: 'ok' });
    expect(api.upsert).toHaveBeenCalledWith('projekt_umsatz', {
      projekt_id: P,
      auftragswert_netto: 8000,
      wahrscheinlichkeit: 30,
      abrechnung_am: null,
    });
    const bad = await A.umsatzSpeichern(
      fd({ projekt_id: P, auftragswert_netto: 'x', wahrscheinlichkeit: '30' }),
      ctx(api),
    );
    expect(bad).toMatchObject({ status: 'error', errors: { auftragswert_netto: expect.any(String) } });
  });

  it('AK-6: Anfrage-Status nur aus der Liste', async () => {
    const api = fakeApi();
    const id = '40000000-0000-4000-8000-000000000001';
    expect(await A.anfrageStatus(fd({ id, status: 'beantwortet' }), ctx(api))).toMatchObject({ status: 'ok' });
    expect(api.update).toHaveBeenCalledWith('anfragen', id, { status: 'beantwortet' });
    expect(await A.anfrageStatus(fd({ id, status: 'gelöscht' }), ctx(api))).toMatchObject({ status: 'error' });
    expect(api.update).toHaveBeenCalledTimes(1);
  });
});

describe('Ansicht', () => {
  it('AK-1, AK-3 bis AK-6: Dashboard', () => {
    render(<AdminDashboard daten={DATEN} now={NOW} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Verwaltung' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Neues Projekt' })).toHaveAttribute('href', '/kunden/admin/projekte/neu');

    const kz = screen.getByRole('list', { name: 'Kennzahlen' });
    expect(within(kz).getByText('Aktive Projekte').closest('li')).toHaveTextContent('3');
    expect(within(kz).getByText('Umsatz 2026').closest('li')).toHaveTextContent('16.000 €');
    expect(kz).toHaveTextContent('davon sicher 14.000 €');

    // AK-3: Diagramm dekorativ, Tabelle als Alternative
    const prognose = screen.getByRole('region', { name: 'Umsatzprognose' });
    expect(prognose.querySelector('svg[data-diagramm]')).toHaveAttribute('aria-hidden', 'true');
    const table = within(prognose).getByRole('table', { name: /Umsatzprognose/ });
    const zeilen = within(table).getAllByRole('row');
    expect(zeilen[1]).toHaveTextContent(/2026.*14\.000 €.*2\.000 €.*16\.000 €/);
    expect(zeilen).toHaveLength(4);
    expect(prognose).toHaveTextContent('2 Projekte ohne Auftragswert oder Abrechnungsdatum');
    // Legende über dem Diagramm (für Screenreader trägt die Tabelle die Werte)
    const legende = prognose.querySelector('ul[aria-hidden="true"]');
    expect(legende).toHaveTextContent(/Sicher.*Gewichtet/);

    // AK-4
    const termine = screen.getByRole('region', { name: 'Nächste Termine' });
    expect(within(termine).getAllByRole('listitem')).toHaveLength(2);
    expect(within(termine).getByRole('link', { name: 'Projekt a' })).toHaveAttribute(
      'href',
      '/kunden/admin/projekte/a',
    );
    expect(within(termine).getByRole('link', { name: /Meet beitreten: Abstimmung Design/ })).toHaveAttribute(
      'href',
      'https://meet.google.com/abc',
    );

    // AK-5: laufende Projekte, abgeschlossene stehen auf der Seite Projekte (admin-aufbau.md AK-2)
    const projekte = screen.getByRole('region', { name: 'Laufende Projekte' });
    expect(projekte).toHaveTextContent('Nächster Schritt: Texte liefern (Kunde)');

    // AK-6: Anfragen kurz, alle Angaben auf der Seite der Anfrage (admin-aufbau.md AK-5)
    const anfragen = screen.getByRole('region', { name: 'Neue Anfragen' });
    expect(anfragen).toHaveTextContent('Max Muster');
    expect(anfragen).toHaveTextContent('Webdesign & Webentwicklung');
    expect(within(anfragen).getByRole('link', { name: 'Max Muster' })).toHaveAttribute(
      'href',
      '/kunden/admin/anfragen/40000000-0000-4000-8000-000000000001',
    );
    expect(screen.queryByRole('form')).toBeNull();
  });

  it('AK-3: ohne Beträge ein Hinweis statt Diagramm', () => {
    render(<AdminDashboard daten={{ projekte: [], termine: [], anfragen: [], kunden: [] }} now={NOW} />);
    const prognose = screen.getByRole('region', { name: 'Umsatzprognose' });
    expect(prognose).toHaveTextContent('Noch keine Beträge. Trag beim Projekt einen Auftragswert ein.');
    expect(prognose.querySelector('svg[data-diagramm]')).toBeNull();
    expect(screen.getByRole('region', { name: 'Nächste Termine' })).toHaveTextContent('Keine Termine geplant.');
  });

  it('Kritiker Dashboard 11: Diagramm wie die Tabelle formatiert', () => {
    const { container } = render(<AdminDashboard daten={DATEN} now={NOW} />);
    const beschriftung = [...container.querySelectorAll('svg text')].map((t) => t.textContent ?? '');
    expect(beschriftung.length).toBeGreaterThan(0);
    for (const t of beschriftung.filter((x) => x.includes('€'))) expect(t).not.toMatch(/,0|T€|Mio/);
  });
});
