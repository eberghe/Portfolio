import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AdminState } from '@/lib/kundenbereich/admin/aktionen';
import type { Anfrage, DashboardDaten, DashboardProjekt } from '@/lib/kundenbereich/admin/dashboard';
import type { KundeDetail, KundeZeile, ProjektDetail } from '@/lib/kundenbereich/admin/laden';

// functions/kundenbereich/admin-aufbau.md

const aktionen = vi.hoisted(() =>
  Object.fromEntries(
    [
      'kundeAnlegen',
      'kundeSpeichern',
      'logoVorbereiten',
      'logoUebernehmen',
      'ansprechpartnerHinzufuegen',
      'ansprechpartnerEntfernen',
      'ansprechpartnerEinladen',
      'projektSpeichern',
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
      'projektStatus',
      'projektLoeschen',
      'kundeLoeschen',
      'anfrageLoeschen',
      'schrittStatus',
      'schritteSortieren',
      'kundeStatus',
      'projektMitAssistent',
    ].map((n) => [n, vi.fn(async (): Promise<AdminState> => ({ status: 'idle' }))]),
  ),
);
vi.mock('@/app/actions/kundenbereich-admin', () => aktionen);
const adresse = vi.hoisted(() => ({ pfad: '/kunden/admin' }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  usePathname: () => adresse.pfad,
  notFound: vi.fn(),
}));

const { default: AdminDashboard } = await import('@/components/kundenbereich/admin/AdminDashboard');
const { default: AdminAnfragen } = await import('@/components/kundenbereich/admin/AdminAnfragen');
const { default: AdminAnfrage } = await import('@/components/kundenbereich/admin/AdminAnfrage');
const { default: AdminProjekte } = await import('@/components/kundenbereich/admin/AdminProjekte');
const { default: AdminKunden } = await import('@/components/kundenbereich/admin/AdminKunden');
const { default: AdminKunde } = await import('@/components/kundenbereich/admin/AdminKunde');
const { default: AdminProjekt } = await import('@/components/kundenbereich/admin/AdminProjekt');

const NOW = new Date('2026-10-08T10:00:00Z');
const K = '10000000-0000-4000-8000-00000000000a';
const P = '20000000-0000-4000-8000-00000000000b';

const projekt = (id: string, status: DashboardProjekt['status'], wert: number | null): DashboardProjekt => ({
  id,
  titel: `Projekt ${id}`,
  status,
  kunden: { id: K, name: 'Bäckerei' },
  projekt_umsatz:
    wert === null ? null : { auftragswert_netto: String(wert), wahrscheinlichkeit: 50, abrechnung_am: '2026-11-01' },
  projektschritte: [],
});

const anfrage = (n: number, status: Anfrage['status'] = 'neu'): Anfrage => ({
  id: `40000000-0000-4000-8000-00000000000${n}`,
  created_at: `2026-10-0${n}T10:00:00Z`,
  name: `Person ${n}`,
  email: `p${n}@example.org`,
  telefon: n === 1 ? '0821 123' : null,
  website: n === 1 ? 'p1.example' : null,
  leistungen: ['web-design-development'],
  zeitrahmen: 'bald',
  budget: '2000-5000',
  beschreibung: `Beschreibung der Anfrage ${n}, ausführlich.`,
  status,
  sprache: 'de',
});

const KUNDEN: KundeZeile[] = [
  {
    id: K,
    name: 'Bäckerei',
    status: 'aktiv',
    logo_freigabe: 'erteilt',
    logo_freigabe_am: '2026-10-08T09:00:00Z',
    kundenprojekte: [{ count: 2 }],
    ansprechpartner: [{ count: 1 }],
  },
];

const termin = (n: number) => ({
  id: `t${n}`,
  beginn: `2026-10-1${n}T08:00:00Z`,
  ende: `2026-10-1${n}T09:00:00Z`,
  titel_de: `Termin ${n}`,
  meet_url: null,
  kundenprojekte: { id: P, titel: 'Relaunch', kunden: { name: 'Bäckerei' } },
});

const DATEN: DashboardDaten = {
  projekte: [
    projekt('a', 'in_arbeit', 10000),
    projekt('b', 'in_arbeit', null),
    projekt('c', 'angebot', 8000),
    projekt('d', 'angebot', 20000),
    projekt('e', 'abstimmung', 3000),
    projekt('f', 'in_arbeit', 1000),
    projekt('g', 'abstimmung', 500),
    projekt('h', 'abgeschlossen', 4000),
  ],
  termine: [1, 2, 3, 4, 5].map(termin),
  anfragen: [anfrage(5), anfrage(4), anfrage(3), anfrage(2), anfrage(1, 'erledigt')],
  kunden: KUNDEN,
};

const KUNDE: KundeDetail = {
  id: K,
  name: 'Bäckerei',
  website_url: 'https://b.example',
  logo_pfad: null,
  status: 'aktiv',
  logo_freigabe: 'offen',
  logo_freigabe_am: null,
  ansprechpartner: [
    { id: 'a1', name: 'Anna', email: 'anna@b.example', rolle: 'GF', telefon: null, sprache: 'de', user_id: null },
  ],
  kundenprojekte: [{ id: P, titel: 'Relaunch', status: 'in_arbeit', created_at: '2026-10-01T00:00:00Z' }],
  logo_freigaben: [],
};

const PROJEKT: ProjektDetail = {
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
  projekt_umsatz: { auftragswert_netto: '12000', wahrscheinlichkeit: 100, abrechnung_am: '2026-11-30' },
  projektschritte: [
    {
      id: 's1',
      reihenfolge: 1,
      titel_de: 'Design',
      titel_en: null,
      beschreibung_de: null,
      beschreibung_en: null,
      status: 'aktiv',
      faellig_am: '2026-10-24',
      verantwortlich: 'erik',
    },
  ],
  termine: [],
  dokumente: [],
};

/** Öffnet das ⋯-Menü „Aktionen: <ziel>“ (admin-sidebar.md AK-7) */
const menue = (ziel: string) => {
  fireEvent.click(screen.getByRole('button', { name: `Aktionen: ${ziel}` }));
  return screen.getByRole('menu', { name: `Aktionen: ${ziel}` });
};
/** Wählt einen Eintrag im ⋯-Menü */
const imMenue = (ziel: string, eintrag: string) =>
  fireEvent.click(within(menue(ziel)).getByRole('menuitem', { name: eintrag }));

/** Sichtbare Eingabefelder, ohne versteckte Felder der Formulare hinter Buttons */
const felder = (c: HTMLElement) => c.querySelectorAll('input:not([type="hidden"]), textarea, select');

describe('Dashboard aufs Wichtigste', () => {
  it('AK-2: höchstens 3 Termine, 3 Anfragen, 5 Projekte, kein Formular', () => {
    const { container } = render(<AdminDashboard daten={DATEN} now={NOW} />);
    expect(felder(container)).toHaveLength(0);
    expect(within(screen.getByRole('region', { name: 'Nächste Termine' })).getAllByRole('listitem')).toHaveLength(3);
    const anfragen = screen.getByRole('region', { name: 'Neue Anfragen' });
    expect(within(anfragen).getAllByRole('listitem')).toHaveLength(3);
    expect(within(anfragen).getByRole('link', { name: 'Person 5' })).toHaveAttribute(
      'href',
      '/kunden/admin/anfragen/40000000-0000-4000-8000-000000000005',
    );
    expect(within(anfragen).getByRole('link', { name: 'Alle Anfragen' })).toHaveAttribute(
      'href',
      '/kunden/admin/anfragen',
    );
    expect(anfragen).not.toHaveTextContent('Beschreibung der Anfrage');
    const projekte = screen.getByRole('region', { name: 'Laufende Projekte' });
    expect(within(projekte).getAllByRole('listitem')).toHaveLength(5);
    expect(within(projekte).getByRole('link', { name: 'Alle Projekte' })).toHaveAttribute(
      'href',
      '/kunden/admin/projekte',
    );
    expect(screen.queryByRole('region', { name: 'Kunden' })).toBeNull();
  });

  it('AK-2/AK-8: „Kunde anlegen“ öffnet einen Dialog, nach Erfolg zu mit Meldung', async () => {
    aktionen.kundeAnlegen!.mockResolvedValueOnce({ status: 'ok', message: 'Kunde angelegt.' });
    render(<AdminDashboard daten={DATEN} now={NOW} />);
    const knopf = screen.getByRole('button', { name: 'Kunde anlegen' });
    expect(knopf).toHaveAttribute('aria-haspopup', 'dialog');
    fireEvent.click(knopf);
    const dialog = screen.getByRole('dialog', { name: 'Kunde anlegen' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(within(dialog).getByRole('button', { name: 'Schließen' })).toBeInTheDocument();
    await waitFor(() => expect(within(dialog).getByLabelText(/^Name/)).toHaveFocus());
    fireEvent.change(within(dialog).getByLabelText(/^Name/), { target: { value: 'Neu GmbH' } });
    await act(async () => fireEvent.click(within(dialog).getByRole('button', { name: 'Kunde anlegen' })));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(screen.getByText('Kunde angelegt.')).toBeInTheDocument();
    await waitFor(() => expect(knopf).toHaveFocus());
  });

  it('AK-8: Fehler lassen den Dialog offen, Schließen gibt den Fokus zurück', async () => {
    aktionen.kundeAnlegen!.mockResolvedValueOnce({
      status: 'error',
      message: 'Bitte prüf die markierten Felder.',
      errors: { name: 'Bitte gib einen Namen ein.' },
    });
    render(<AdminDashboard daten={DATEN} now={NOW} />);
    const knopf = screen.getByRole('button', { name: 'Kunde anlegen' });
    fireEvent.click(knopf);
    const dialog = screen.getByRole('dialog', { name: 'Kunde anlegen' });
    await act(async () => fireEvent.click(within(dialog).getByRole('button', { name: 'Kunde anlegen' })));
    await waitFor(() => expect(within(dialog).getByLabelText(/^Name/)).toHaveAttribute('aria-invalid', 'true'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Schließen' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    await waitFor(() => expect(knopf).toHaveFocus());
  });

  it('AK-3: Hilfe-Buttons an Kennzahlen und Umsatz', () => {
    render(<AdminDashboard daten={DATEN} now={NOW} />);
    for (const name of [
      'Aktive Projekte',
      'Termine in 7 Tagen',
      'Neue Anfragen',
      'Umsatz 2026',
      'Umsatzprognose',
      'Auftragswert nach Status',
    ])
      expect(screen.getByRole('button', { name: `Erklärung: ${name}` })).toHaveAttribute('aria-expanded', 'false');
    const hilfe = screen.getByRole('button', { name: 'Erklärung: Umsatzprognose' });
    fireEvent.click(hilfe);
    expect(hilfe).toHaveAttribute('aria-expanded', 'true');
    expect(within(hilfe.parentElement!).getByRole('status')).toHaveTextContent(/Sicher.*Gewichtet/);
    fireEvent.keyDown(hilfe, { key: 'Escape' });
    expect(hilfe).toHaveAttribute('aria-expanded', 'false');
  });

  it('AK-4: Auftragswert nach Status als Text, Tabelle zur Prognose eingeklappt', () => {
    render(<AdminDashboard daten={DATEN} now={NOW} />);
    const pipeline = screen.getByRole('region', { name: 'Auftragswert nach Status' });
    const zeilen = within(pipeline)
      .getAllByRole('listitem')
      .map((li) => li.textContent);
    expect(zeilen).toEqual([
      'Angebot28.000\u00a0€ · 2 Projekte',
      'In Arbeit11.000\u00a0€ · 3 Projekte',
      'In Abstimmung3.500\u00a0€ · 2 Projekte',
      'Pausiert0\u00a0€ · 0 Projekte',
      'Abgeschlossen4.000\u00a0€ · 1 Projekt',
    ]);
    expect(pipeline.querySelector('[data-balken]')).toHaveAttribute('aria-hidden', 'true');
    const prognose = screen.getByRole('region', { name: 'Umsatzprognose' });
    expect(within(prognose).getByText('Als Tabelle').closest('details')).not.toHaveAttribute('open');
  });
});

describe('Eigene Seiten', () => {
  it('AK-5: Anfragen als Liste, erledigte eingeklappt', () => {
    render(<AdminAnfragen anfragen={DATEN.anfragen} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Anfragen' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Person 5' })).toHaveAttribute(
      'href',
      '/kunden/admin/anfragen/40000000-0000-4000-8000-000000000005',
    );
    expect(screen.getByRole('table', { name: 'Anfragen' })).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent('Beschreibung der Anfrage 5');
  });

  it('AK-5: Anfrage mit allen Angaben beschriftet, Status und Projekt anlegen', () => {
    render(<AdminAnfrage anfrage={anfrage(1)} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Person 1' })).toBeInTheDocument();
    const werte = Object.fromEntries(
      screen.getAllByRole('term').map((dt) => [dt.textContent, dt.nextElementSibling?.textContent]),
    );
    expect(werte).toMatchObject({
      'E-Mail': 'p1@example.org',
      Telefon: '0821 123',
      Website: 'p1.example (öffnet in neuem Tab)',
      Leistungen: 'Webdesign & Webentwicklung',
      Zeitrahmen: expect.any(String),
      Budget: '2.000 bis 5.000 €',
      Sprache: 'Deutsch',
    });
    expect(screen.getByText('Beschreibung der Anfrage 1, ausführlich.')).toBeInTheDocument();
    expect(within(menue('Person 1')).getByRole('menuitemradio', { name: 'Neu' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(screen.getByRole('link', { name: 'Projekt anlegen: Person 1' })).toHaveAttribute(
      'href',
      '/kunden/admin/projekte/neu?anfrage=40000000-0000-4000-8000-000000000001',
    );
    expect(screen.getByRole('navigation', { name: 'Pfad' })).toHaveTextContent('Anfragen');
  });

  it('AK-6: Projekte und Kunden als Listen, Kunde anlegen im Dialog', () => {
    const { unmount } = render(<AdminProjekte projekte={DATEN.projekte} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Projekte' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projekt a' })).toHaveAttribute('href', '/kunden/admin/projekte/a');
    expect(screen.getByRole('table', { name: 'Projekte' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Neues Projekt' })).toHaveAttribute('href', '/kunden/admin/projekte/neu');
    unmount();
    const { container } = render(<AdminKunden kunden={KUNDEN} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Kunden' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Bäckerei' })).toHaveAttribute('href', `/kunden/admin/kunden/${K}`);
    expect(screen.getByRole('table', { name: 'Kunden' })).toBeInTheDocument();
    expect(felder(container)).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Kunde anlegen' }));
    expect(screen.getByRole('dialog', { name: 'Kunde anlegen' })).toBeInTheDocument();
  });
});

describe('Formulare hinter Buttons', () => {
  it('AK-7: Kundenseite ohne offenes Formular, Dialoge mit eindeutigen Buttons', () => {
    const { container } = render(<AdminKunde kunde={KUNDE} />);
    expect(felder(container)).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Ansprechpartner hinzufügen' })).toHaveAttribute(
      'aria-haspopup',
      'dialog',
    );
    // admin-bearbeiten.md AK-10: Bearbeiten im Menü der Karte, im Kopf Neues Projekt und Löschen
    const m = menue('Bäckerei');
    expect(within(m).getByRole('menuitem', { name: 'Neues Projekt' })).toHaveAttribute(
      'href',
      `/kunden/admin/projekte/neu?kunde=${K}`,
    );
    fireEvent.keyDown(m, { key: 'Escape' });
    expect(within(menue('Logo')).getByRole('menuitem', { name: 'Logo hochladen' })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    imMenue('Stammdaten', 'Stammdaten bearbeiten');
    const dialog = screen.getByRole('dialog', { name: 'Stammdaten bearbeiten' });
    expect(within(dialog).getByLabelText(/^Name/)).toHaveValue('Bäckerei');
  });

  it('AK-7: Projektseite ohne offenes Formular, Werte als Übersicht', () => {
    const { container } = render(<AdminProjekt projekt={PROJEKT} now={NOW} />);
    expect(felder(container)).toHaveLength(0);
    for (const name of ['Ablaufschritt hinzufügen', 'Termin hinzufügen', 'Dokument hochladen'])
      expect(screen.getByRole('button', { name })).toHaveAttribute('aria-haspopup', 'dialog');
    for (const [karte, name] of [
      ['Projekt', 'Projekt bearbeiten'],
      ['Umsatz', 'Umsatz bearbeiten'],
      ['Ansprechpartner', 'Zuordnung ändern'],
    ]) {
      const m = menue(karte!);
      expect(within(m).getByRole('menuitem', { name })).toBeInTheDocument();
      fireEvent.keyDown(m, { key: 'Escape' });
    }
    const umsatz = screen.getByRole('region', { name: 'Umsatz' });
    expect(umsatz).toHaveTextContent('12.000 €');
    expect(umsatz).toHaveTextContent('100 %');
    expect(screen.getByRole('region', { name: 'Ansprechpartner' })).toHaveTextContent('Anna');
    imMenue('Schritt Design', 'Bearbeiten');
    const dialog = screen.getByRole('dialog', { name: 'Ablaufschritt bearbeiten: Design' });
    expect(within(dialog).getByLabelText(/^Titel Deutsch/)).toHaveValue('Design');
  });
});

describe('Dialog-Fuß und ruhigere Oberfläche (2026-10-13)', () => {
  /** Buttons im Fuß in Lesereihenfolge */
  const fussKnoepfe = (dialog: HTMLElement) => {
    const fuss = dialog.querySelector<HTMLElement>('[data-dialog-fuss]');
    expect(fuss).not.toBeNull();
    return within(fuss!).getAllByRole('button');
  };

  it('AK-10: Hauptaktion rechts außen im Fuß, Abbrechen direkt davor, außerhalb des Scrollbereichs', () => {
    render(<AdminProjekt projekt={PROJEKT} now={NOW} />);
    for (const [knopf, titel, haupt] of [
      ['Projekt bearbeiten', 'Projekt bearbeiten', 'Projekt speichern'],
      ['Termin hinzufügen', 'Termin hinzufügen', 'Termin hinzufügen'],
      ['Dokument hochladen', 'Dokument hochladen', 'Dokument hochladen'],
    ] as const) {
      if (knopf === 'Projekt bearbeiten') imMenue('Projekt', knopf);
      else fireEvent.click(screen.getByRole('button', { name: knopf }));
      const dialog = screen.getByRole('dialog', { name: titel });
      const knoepfe = fussKnoepfe(dialog);
      const letzter = knoepfe.at(-1)!;
      expect(letzter).toHaveAccessibleName(haupt);
      expect(letzter).toHaveAttribute('type', 'submit');
      // gehört zum Formular, auch wenn der Fuß außerhalb des <form> steht
      expect((letzter as HTMLButtonElement).form).not.toBeNull();
      expect(knoepfe.at(-2)).toHaveAccessibleName('Abbrechen');
      const scroll = dialog.querySelector('[data-dialog-inhalt]');
      expect(scroll).not.toBeNull();
      expect(scroll!.contains(dialog.querySelector('[data-dialog-fuss]'))).toBe(false);
      fireEvent.click(within(dialog).getByRole('button', { name: 'Schließen' }));
    }
  });

  it('AK-10: Abbrechen schließt ohne Speichern, Fokus zurück auf den Auslöser', async () => {
    aktionen.kundeAnlegen!.mockClear();
    render(<AdminDashboard daten={DATEN} now={NOW} />);
    const knopf = screen.getByRole('button', { name: 'Kunde anlegen' });
    fireEvent.click(knopf);
    const dialog = screen.getByRole('dialog', { name: 'Kunde anlegen' });
    fireEvent.change(within(dialog).getByLabelText(/^Name/), { target: { value: 'Neu GmbH' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Abbrechen' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(aktionen.kundeAnlegen).not.toHaveBeenCalled();
    await waitFor(() => expect(knopf).toHaveFocus());
  });

  it('AK-11: Schritt-Dialog nur mit Abbrechen und Speichern, Entfernen im ⋯-Menü (admin-bearbeiten.md AK-8)', () => {
    render(<AdminProjekt projekt={PROJEKT} now={NOW} />);
    imMenue('Schritt Design', 'Bearbeiten');
    const dialog = screen.getByRole('dialog', { name: 'Ablaufschritt bearbeiten: Design' });
    const namen = fussKnoepfe(dialog).map((b) => b.getAttribute('aria-label') ?? b.textContent);
    expect(namen).toEqual(['Abbrechen', 'Schritt speichern']);
  });

  it('AK-13: Ladezustand nur im Inhalt', async () => {
    const { default: Laden } = await import('@/app/(kunden-de)/kunden/admin/loading');
    adresse.pfad = '/kunden/admin/kunden';
    render(<Laden />);
    // Die Sidebar steht im Layout und bleibt stehen, der Ladezustand zeigt nur den Inhalt (admin-sidebar.md)
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Wird geladen');
    adresse.pfad = '/kunden/admin';
  });

  it('AK-14: Zeilenaktionen im ⋯-Menü mit Tooltip', () => {
    const mit = {
      ...PROJEKT,
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
      dokumente: [
        {
          id: 'd1',
          created_at: '2026-10-08T10:00:00Z',
          art: 'vertrag',
          titel: 'Vertrag',
          dateiname: 'v.pdf',
          groesse_bytes: 1000,
          mime_typ: 'application/pdf',
          version: 1,
          storage_pfad: 'x/v.pdf',
        },
      ],
    } as unknown as ProjektDetail;
    render(<AdminProjekt projekt={mit} now={NOW} />);
    for (const [ziel, eintraege] of [
      ['Schritt Design', ['Bearbeiten', 'Entfernen']],
      ['Termin Review', ['Entfernen']],
      ['Vertrag, Version 1', ['Herunterladen', 'Entfernen']],
    ] as const) {
      const knopf = screen.getByRole('button', { name: `Aktionen: ${ziel}` });
      expect(knopf).toHaveAttribute('title', `Aktionen: ${ziel}`);
      // nur Icon, kein sichtbarer Text
      expect(knopf.textContent?.trim()).toBe('');
      const m = menue(ziel);
      expect(
        within(m)
          .getAllByRole('menuitem')
          .map((e) => e.textContent),
      ).toEqual(eintraege);
      fireEvent.keyDown(m, { key: 'Escape' });
    }
  });
});

describe('Befunde Blinder Kritiker Dialoge (2026-10-13)', () => {
  it('AK-16: Netzfehler beim Speichern bleibt im Dialog, Eingaben bleiben', async () => {
    aktionen.kundeAnlegen!.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    render(<AdminDashboard daten={DATEN} now={NOW} />);
    fireEvent.click(screen.getByRole('button', { name: 'Kunde anlegen' }));
    const dialog = screen.getByRole('dialog', { name: 'Kunde anlegen' });
    fireEvent.change(within(dialog).getByLabelText(/^Name/), { target: { value: 'Neu GmbH' } });
    await act(async () => fireEvent.click(within(dialog).getAllByRole('button', { name: 'Kunde anlegen' }).at(-1)!));
    await waitFor(() =>
      expect(dialog).toHaveTextContent('Das hat nicht geklappt. Bitte prüf die Verbindung und versuch es noch einmal.'),
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/^Name/)).toHaveValue('Neu GmbH');
  });

  it('AK-16: Netzfehler beim Entfernen stürzt nicht ab', async () => {
    aktionen.schrittEntfernen!.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    render(
      <>
        <p id="admin-fehler" />
        <AdminProjekt projekt={PROJEKT} now={NOW} />
      </>,
    );
    imMenue('Schritt Design', 'Entfernen');
    const dialog = screen.getByRole('dialog', { name: 'Schritt entfernen?' });
    await act(async () => fireEvent.click(within(dialog).getByRole('button', { name: 'Schritt entfernen' })));
    await waitFor(() => expect(document.getElementById('admin-fehler')).toHaveTextContent('Das hat nicht geklappt.'));
  });

  it('AK-17: Upload markiert leeren Titel und fehlende Datei gemeinsam', async () => {
    render(<AdminProjekt projekt={PROJEKT} now={NOW} />);
    fireEvent.click(screen.getByRole('button', { name: 'Dokument hochladen' }));
    const dialog = screen.getByRole('dialog', { name: 'Dokument hochladen' });
    await act(async () =>
      fireEvent.click(within(dialog).getAllByRole('button', { name: 'Dokument hochladen' }).at(-1)!),
    );
    await waitFor(() => expect(within(dialog).getByLabelText(/^Titel/)).toHaveAttribute('aria-invalid', 'true'));
    expect(within(dialog).getByLabelText(/^Datei/)).toHaveAttribute('aria-invalid', 'true');
    expect(within(dialog).getByLabelText(/^Titel/)).toHaveFocus();
  });

  it('AK-18: Klick neben den Dialog schließt ihn nicht', () => {
    render(<AdminDashboard daten={DATEN} now={NOW} />);
    fireEvent.click(screen.getByRole('button', { name: 'Kunde anlegen' }));
    const dialog = screen.getByRole('dialog', { name: 'Kunde anlegen' });
    fireEvent.mouseDown(dialog);
    fireEvent.click(dialog);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('AK-19: Entfernen in Fehlerfarbe, in der Rückfrage auch der Bestätigen-Knopf', () => {
    render(<AdminProjekt projekt={PROJEKT} now={NOW} />);
    const m = menue('Schritt Design');
    expect(within(m).getByRole('menuitem', { name: 'Entfernen' })).toHaveClass('text-error');
    fireEvent.click(within(m).getByRole('menuitem', { name: 'Entfernen' }));
    const dialog = screen.getByRole('dialog', { name: 'Schritt entfernen?' });
    expect(within(dialog).getByRole('button', { name: 'Schritt entfernen' })).toHaveClass('text-error');
    expect(within(dialog).getByRole('button', { name: 'Abbrechen' })).not.toHaveClass('text-error');
  });
});
