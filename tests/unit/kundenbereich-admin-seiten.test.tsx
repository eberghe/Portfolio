import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AdminState } from '@/lib/kundenbereich/admin/aktionen';
import type { KundeDetail, KundeZeile, ProjektDetail } from '@/lib/kundenbereich/admin/laden';

// functions/kundenbereich/admin.md

vi.mock('@/app/actions/kundenbereich-admin', () =>
  Object.fromEntries(
    [
      'kundeAnlegen',
      'kundeSpeichern',
      'logoVorbereiten',
      'logoUebernehmen',
      'ansprechpartnerHinzufuegen',
      'ansprechpartnerEntfernen',
      'ansprechpartnerEinladen',
      'projektAnlegen',
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
      'projektMitAssistent',
    ].map((n) => [n, vi.fn(async () => ({ status: 'idle' }))]),
  ),
);
vi.mock('@/app/actions/kundenbereich', () => ({ requestLoginLink: vi.fn(), confirmLogin: vi.fn(), logout: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: vi.fn(), headers: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }), notFound: vi.fn() }));

const { default: AdminKunden } = await import('@/components/kundenbereich/admin/AdminKunden');
const { default: AdminKunde } = await import('@/components/kundenbereich/admin/AdminKunde');
const { default: AdminProjekt } = await import('@/components/kundenbereich/admin/AdminProjekt');
const { default: AdminForm } = await import('@/components/kundenbereich/admin/AdminForm');
const { default: Projektuebersicht } = await import('@/components/kundenbereich/Projektuebersicht');

const K = '10000000-0000-4000-8000-00000000000a';
const P = '20000000-0000-4000-8000-00000000000b';

const KUNDEN: KundeZeile[] = [
  {
    id: K,
    name: 'Bäckerei',
    logo_freigabe: 'erteilt',
    logo_freigabe_am: '2026-10-08T09:00:00Z',
    kundenprojekte: [{ count: 2 }],
    ansprechpartner: [{ count: 1 }],
  },
  {
    id: 'k2',
    name: 'Café',
    logo_freigabe: 'offen',
    logo_freigabe_am: null,
    kundenprojekte: [{ count: 0 }],
    ansprechpartner: [{ count: 0 }],
  },
];

const KUNDE: KundeDetail = {
  id: K,
  name: 'Bäckerei',
  website_url: 'https://b.example',
  logo_pfad: `${K}/logo.svg`,
  logo_freigabe: 'widerrufen',
  logo_freigabe_am: '2026-10-09T09:00:00Z',
  ansprechpartner: [
    { id: 'a1', name: 'Anna', email: 'anna@b.example', rolle: 'GF', telefon: null, sprache: 'de', user_id: null },
  ],
  kundenprojekte: [{ id: P, titel: 'Relaunch', status: 'in_arbeit', created_at: '2026-10-01T00:00:00Z' }],
  logo_freigaben: [
    { id: 'f1', entscheidung: 'widerrufen', am: '2026-10-09T09:00:00Z', ansprechpartner: { name: 'Anna' } },
  ],
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
  kunden: {
    id: K,
    name: 'Bäckerei',
    ansprechpartner: [
      { id: 'a1', name: 'Anna', email: 'anna@b.example' },
      { id: 'a2', name: 'Ben', email: 'ben@b.example' },
    ],
  },
  projekt_ansprechpartner: [{ ansprechpartner_id: 'a1' }],
  projektschritte: [
    {
      id: 's1',
      reihenfolge: 1,
      titel_de: 'Analyse',
      titel_en: null,
      beschreibung_de: null,
      beschreibung_en: null,
      status: 'erledigt',
      faellig_am: null,
      verantwortlich: 'erik',
    },
    {
      id: 's2',
      reihenfolge: 4,
      titel_de: 'Design',
      titel_en: 'Design',
      beschreibung_de: null,
      beschreibung_en: null,
      status: 'aktiv',
      faellig_am: '2026-10-24',
      verantwortlich: 'erik',
    },
  ],
  termine: [
    {
      id: 't1',
      beginn: '2026-10-15T08:00:00Z',
      ende: '2026-10-15T09:00:00Z',
      titel_de: 'Review',
      titel_en: null,
      meet_url: 'https://meet.google.com/x',
    },
  ],
  dokumente: [
    {
      id: 'd1',
      created_at: '2026-10-08T09:00:00Z',
      art: 'vertrag',
      titel: 'Vertrag',
      dateiname: 'v.pdf',
      groesse_bytes: 182000,
      mime_typ: 'application/pdf',
      version: 2,
      storage_pfad: `${K}/${P}/v.pdf`,
    },
  ],
};

describe('Verwaltung', () => {
  it('AK-10: Kundenliste mit Zählern und Stand der Logo-Freigabe als Text, anlegen im Dialog', () => {
    render(<AdminKunden kunden={KUNDEN} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Kunden' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Bäckerei' })).toHaveAttribute('href', `/kunden/admin/kunden/${K}`);
    expect(screen.getByText('2 Projekte, 1 Ansprechpartner')).toBeInTheDocument();
    expect(screen.getByText('Logo-Freigabe erteilt am 8. Okt. 2026')).toBeInTheDocument();
    expect(screen.getByText('Logo-Freigabe offen')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Kunde anlegen' }));
    const dialog = screen.getByRole('dialog', { name: 'Kunde anlegen' });
    expect(within(dialog).getByLabelText(/^Name/)).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Kunde anlegen' })).toHaveAttribute('type', 'submit');
  });

  it('AK-3/AK-4/AK-5/AK-10: Kundenseite mit Stammdaten, Logo, Protokoll, Ansprechpartnern, Projekten', () => {
    render(<AdminKunde kunde={KUNDE} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Bäckerei' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Pfad' })).toHaveTextContent('Verwaltung');
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Projekte',
      'Ansprechpartner',
      'Stammdaten',
      'Logo',
    ]);
    expect(screen.getByRole('img', { name: 'Aktuelles Logo von Bäckerei' })).toHaveAttribute(
      'src',
      `/kunden/admin/logo/${K}`,
    );
    expect(screen.getByText('Logo-Freigabe widerrufen am 9. Okt. 2026')).toBeInTheDocument();
    expect(screen.getByText('9. Okt. 2026: widerrufen von Anna')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Anmeldelink schicken an Anna' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entfernen: Anna' })).toBeInTheDocument();
    expect(screen.getByText('Noch nicht angemeldet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Relaunch' })).toHaveAttribute('href', `/kunden/admin/projekte/${P}`);
    fireEvent.click(screen.getByRole('button', { name: 'Stammdaten bearbeiten' }));
    expect(within(screen.getByRole('dialog')).getByLabelText(/^Name/)).toHaveValue('Bäckerei');
    fireEvent.click(screen.getByRole('button', { name: 'Schließen' }));
    fireEvent.click(screen.getByRole('button', { name: 'Neues Logo hochladen' }));
    expect(within(screen.getByRole('dialog')).getByLabelText(/^Datei/)).toHaveAttribute('type', 'file');
    fireEvent.click(screen.getByRole('button', { name: 'Schließen' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ansprechpartner hinzufügen' }));
    expect(within(screen.getByRole('dialog')).getByLabelText('Sprache')).toHaveValue('de');
  });

  it('AK-6/AK-7/AK-8/AK-9: Projektseite mit Zuordnung, Schritten, Terminen in deutscher Zeit, Dokumenten', () => {
    render(<AdminProjekt projekt={PROJEKT} now={new Date('2026-10-14T00:00:00Z')} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Relaunch' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'So sieht es der Kunde' })).toHaveAttribute('href', `/kunden?projekt=${P}`);
    expect(screen.getByRole('region', { name: 'Ansprechpartner' })).not.toHaveTextContent('Ben');
    fireEvent.click(screen.getByRole('button', { name: 'Zuordnung ändern' }));
    expect(screen.getByRole('checkbox', { name: 'Anna (anna@b.example)' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Ben (ben@b.example)' })).not.toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'Schließen' }));
    expect(screen.getByText('4. Design')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ablaufschritt hinzufügen' }));
    expect(within(screen.getByRole('dialog')).getByLabelText(/^Reihenfolge/)).toHaveValue(5);
    fireEvent.click(screen.getByRole('button', { name: 'Schließen' }));
    expect(screen.getByText('Do., 15. Okt. 2026, 10:00–11:00 MESZ')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Herunterladen: Vertrag, Version 2' })).toHaveAttribute(
      'href',
      '/kunden/dokumente/d1',
    );
    expect(screen.getByText(/PDF, 182 KB, Version 2/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Dokument hochladen' }));
    expect(within(screen.getByRole('dialog')).getByLabelText('Art')).toBeInTheDocument();
  });

  it('admin-dashboard.md AK-7: Umsatz am Projekt mit deutschem Betrag', () => {
    render(
      <AdminProjekt
        projekt={{
          ...PROJEKT,
          projekt_umsatz: { auftragswert_netto: '12500.50', wahrscheinlichkeit: 40, abrechnung_am: '2027-03-01' },
        }}
      />,
    );
    const umsatz = screen.getByRole('region', { name: 'Umsatz' });
    expect(umsatz).toHaveTextContent('40 %');
    expect(umsatz).toHaveTextContent('1. März 2027');
    fireEvent.click(within(umsatz).getByRole('button', { name: 'Umsatz bearbeiten' }));
    const dialog = screen.getByRole('dialog', { name: 'Umsatz bearbeiten' });
    expect(within(dialog).getByLabelText(/^Auftragswert/)).toHaveValue('12.500,5');
    expect(within(dialog).getByLabelText(/^Wahrscheinlichkeit/)).toHaveValue(40);
    expect(within(dialog).getByLabelText(/^Voraussichtliche Abrechnung/)).toHaveValue('2027-03-01');
  });

  it('Kritiker Dashboard 4: Meldung nach dem Anlegen bekommt den Fokus', async () => {
    render(<AdminProjekt projekt={PROJEKT} hinweis="Projekt angelegt." />);
    const meldung = screen.getByRole('status');
    expect(meldung).toHaveTextContent('Projekt angelegt.');
    await waitFor(() => expect(meldung).toHaveFocus());
  });

  it('Befunde Blinder Kritiker zur Verwaltung', () => {
    const doks = [
      PROJEKT.dokumente[0]!,
      { ...PROJEKT.dokumente[0]!, id: 'd0', version: 1, dateiname: 'v1.pdf', storage_pfad: `${K}/${P}/v1.pdf` },
    ];
    const { container } = render(<AdminProjekt projekt={{ ...PROJEKT, dokumente: doks }} />);
    // 2: eindeutige Namen der Bearbeiten-Buttons
    expect(screen.getByRole('button', { name: 'Bearbeiten: Analyse' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bearbeiten: Design' })).toBeInTheDocument();
    // 3: Versionen unter einem Titel
    expect(screen.getAllByRole('heading', { level: 3, name: 'Vertrag' })).toHaveLength(1);
    expect(screen.getByText(/Aktuell:/).parentElement).toHaveTextContent('Version 2');
    // Kritiker Dashboard 3: IDs eindeutig
    const ids = [...container.querySelectorAll('[id]')].map((e) => e.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    // 5: keine Browser-Blasen statt eigener Meldungen; Titel-Feld hat einen Namen
    fireEvent.click(screen.getByRole('button', { name: 'Projekt bearbeiten' }));
    const dialog = screen.getByRole('dialog', { name: 'Projekt bearbeiten' });
    for (const f of dialog.querySelectorAll('form')) expect(f).toHaveAttribute('novalidate');
    expect(within(dialog).getByRole('textbox', { name: /^Titel/ })).toHaveValue('Relaunch');
    // 7: Pfad endet mit der aktuellen Seite
    expect(
      within(screen.getByRole('navigation', { name: 'Pfad' })).getByText('Relaunch', { selector: 'li' }),
    ).toHaveAttribute('aria-current', 'page');
  });

  it('Formular: Fehler am Feld mit Fokus, Eingaben bleiben; nach Erfolg Meldung und leere Felder', async () => {
    const action = vi.fn<(s: AdminState, fd: FormData) => Promise<AdminState>>();
    action.mockResolvedValueOnce({
      status: 'error',
      message: 'Bitte prüf die markierten Felder.',
      errors: { email: 'Falsch' },
    });
    action.mockResolvedValueOnce({ status: 'ok', message: 'Anna hinzugefügt.' });
    render(
      <AdminForm
        id="t"
        title="Test"
        action={action}
        submitLabel="Senden"
        reset
        hidden={{ kunde_id: K }}
        felder={[{ name: 'email', label: 'E-Mail', type: 'email', required: true }]}
      />,
    );
    const field = screen.getByLabelText(/^E-Mail/);
    fireEvent.change(field, { target: { value: 'kaputt' } });
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Senden' })));
    await waitFor(() => expect(field).toHaveAttribute('aria-invalid', 'true'));
    expect(field).toHaveAccessibleDescription('Falsch');
    expect(field).toHaveFocus();
    expect(field).toHaveValue('kaputt');
    expect(action.mock.calls[0]![1].get('kunde_id')).toBe(K);

    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Senden' })));
    await waitFor(() => expect(screen.getByText('Anna hinzugefügt.')).toBeInTheDocument());
    expect(field).toHaveValue('');
  });

  it('Verhalten 1: Admins sehen in der Projektübersicht den Weg zur Verwaltung, Kunden nicht', () => {
    const { unmount } = render(
      <Projektuebersicht locale="de" profil={{ art: 'admin', name: 'Erik', sprache: 'de' }} projekte={[]} />,
    );
    expect(screen.getByRole('link', { name: 'Verwaltung' })).toHaveAttribute('href', '/kunden/admin');
    unmount();
    render(<Projektuebersicht locale="de" profil={{ art: 'kunde', name: 'Anna', sprache: 'de' }} projekte={[]} />);
    expect(screen.queryByRole('link', { name: 'Verwaltung' })).toBeNull();
  });
});
