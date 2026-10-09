import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import * as A from '@/lib/kundenbereich/admin/aktionen';
import {
  assistentDaten,
  leererAssistent,
  STANDARD_ABLAUF,
  vorbelegung,
  type AssistentDaten,
  type AssistentKunde,
} from '@/lib/kundenbereich/admin/assistent';
import type { Anfrage } from '@/lib/kundenbereich/admin/dashboard';

// functions/kundenbereich/projekt-assistent.md

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Signatur der Server Action
const projektMitAssistent = vi.fn(async (_s: A.AdminState, _fd: FormData): Promise<A.AdminState> => ({
  status: 'idle',
}));
vi.mock('@/app/actions/kundenbereich-admin', () => ({ projektMitAssistent }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }), notFound: vi.fn() }));
const { default: ProjektAssistent } = await import('@/components/kundenbereich/admin/ProjektAssistent');

const K = '10000000-0000-4000-8000-00000000000a';
const AP = '30000000-0000-4000-8000-000000000002';
const ANFRAGE_ID = '40000000-0000-4000-8000-000000000001';

const KUNDEN: AssistentKunde[] = [
  { id: K, name: 'Bäckerei', ansprechpartner: [{ id: AP, name: 'Anna', email: 'anna@b.example' }] },
  { id: '10000000-0000-4000-8000-00000000000b', name: 'Café', ansprechpartner: [] },
];

const ANFRAGE: Anfrage = {
  id: ANFRAGE_ID,
  created_at: '2026-10-07T10:00:00Z',
  name: 'Max Muster',
  email: 'Max@Example.org',
  telefon: '0821 123',
  website: 'max.example',
  leistungen: ['web-design-development', 'accessibility'],
  zeitrahmen: 'bald',
  budget: 'offen',
  beschreibung: 'Wir brauchen eine neue Website.',
  status: 'neu',
  sprache: 'en',
};

const gueltig = (): AssistentDaten => ({
  ...leererAssistent(),
  kunde: { modus: 'bestehend', id: K, name: '', website_url: '' },
  projekt: { ...leererAssistent().projekt, titel: 'Relaunch', auftragswert_netto: '12.500', wahrscheinlichkeit: '40' },
  ansprechpartner: { ids: [AP], neu: [] },
});

describe('Vorbelegung', () => {
  it('AK-5: Standard-Ablauf mit sechs Schritten', () => {
    expect(STANDARD_ABLAUF.map((s) => s.titel_de)).toEqual([
      'Kennenlernen',
      'Analyse & Angebot',
      'Konzept',
      'Design',
      'Umsetzung',
      'Test & Launch',
    ]);
    expect(leererAssistent().schritte).toEqual(STANDARD_ABLAUF);
    expect(leererAssistent().projekt.status).toBe('angebot');
    expect(leererAssistent().projekt.wahrscheinlichkeit).toBe('50');
  });

  it('AK-4: aus ?kunde und aus ?anfrage', () => {
    expect(vorbelegung({ kundeId: K, kunden: KUNDEN }).kunde).toEqual({
      modus: 'bestehend',
      id: K,
      name: '',
      website_url: '',
    });
    // Kritiker Assistent 12: mit bestehenden Kunden startet „Bestehender Kunde“
    expect(vorbelegung({ kundeId: 'unbekannt', kunden: KUNDEN }).kunde).toMatchObject({ modus: 'bestehend', id: '' });
    expect(vorbelegung({ kunden: [] }).kunde.modus).toBe('neu');
    const d = vorbelegung({ anfrage: ANFRAGE, kunden: KUNDEN });
    expect(d.kunde).toEqual({ modus: 'neu', id: '', name: 'Max Muster', website_url: 'https://max.example' });
    expect(d.projekt.titel).toBe('Webdesign & Webentwicklung, Barrierefreiheit-Beratung');
    expect(d.projekt.beschreibung_de).toBe('Wir brauchen eine neue Website.');
    expect(d.ansprechpartner.neu).toEqual([
      { name: 'Max Muster', email: 'max@example.org', rolle: '', telefon: '0821 123', sprache: 'en' },
    ]);
    expect(d.anfrage_id).toBe(ANFRAGE_ID);
  });
});

describe('Prüfung', () => {
  it('AK-6: gültige Daten ergeben den Aufruf für die Datenbank', () => {
    const r = assistentDaten({
      ...gueltig(),
      termin: {
        datum: '2026-11-02',
        beginn: '10:00',
        ende: '11:00',
        titel_de: 'Kick-off',
        titel_en: '',
        meet_url: 'https://meet.google.com/abc',
      },
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.payload).toMatchObject({
      kunde_id: K,
      projekt: { titel: 'Relaunch', status: 'angebot' },
      umsatz: { auftragswert_netto: 12500, wahrscheinlichkeit: 40, abrechnung_am: null },
      ansprechpartner_ids: [AP],
      ansprechpartner_neu: [],
      termin: { beginn: '2026-11-02T09:00:00.000Z', ende: '2026-11-02T10:00:00.000Z', titel_de: 'Kick-off' },
    });
    expect(r.payload.schritte).toHaveLength(6);
    expect(r.payload).not.toHaveProperty('kunde');
  });

  it('AK-6: Fehler nennen Feld und ersten Schritt', () => {
    const d = gueltig();
    expect(assistentDaten({ ...d, kunde: { modus: 'neu', id: '', name: '', website_url: 'x' } })).toMatchObject({
      ok: false,
      schritt: 0,
      errors: { 'kunde.name': expect.any(String), 'kunde.website_url': expect.any(String) },
    });
    expect(assistentDaten({ ...d, kunde: { modus: 'bestehend', id: '', name: '', website_url: '' } })).toMatchObject({
      schritt: 0,
      errors: { 'kunde.id': 'Bitte wähle einen Kunden.' },
    });
    expect(assistentDaten({ ...d, projekt: { ...d.projekt, titel: '', wahrscheinlichkeit: '150' } })).toMatchObject({
      schritt: 1,
      errors: { 'projekt.titel': expect.any(String), 'projekt.wahrscheinlichkeit': expect.any(String) },
    });
    expect(assistentDaten({ ...d, ansprechpartner: { ids: [], neu: [] } })).toMatchObject({
      schritt: 2,
      errors: { ansprechpartner: expect.stringMatching(/mindestens einen/) },
    });
    const doppelt = { name: 'Nina', email: 'n@x.de', rolle: '', telefon: '', sprache: 'de' as const };
    expect(
      assistentDaten({ ...d, ansprechpartner: { ids: [], neu: [doppelt, { ...doppelt, email: 'N@x.de' }] } }),
    ).toMatchObject({ schritt: 2, errors: { 'ap.1.email': expect.stringMatching(/doppelt/) } });
    expect(assistentDaten({ ...d, schritte: [{ titel_de: '', titel_en: '', verantwortlich: 'erik' }] })).toMatchObject({
      schritt: 3,
      errors: { 'schritte.0.titel_de': expect.any(String) },
    });
    expect(
      assistentDaten({
        ...d,
        termin: {
          datum: '2026-11-02',
          beginn: '11:00',
          ende: '10:00',
          titel_de: '',
          titel_en: '',
          meet_url: 'http://x',
        },
      }),
    ).toMatchObject({
      schritt: 4,
      errors: { 'termin.ende': expect.any(String), 'termin.meet_url': expect.any(String) },
    });
    expect(assistentDaten({ ...d, schritte: Array(31).fill(STANDARD_ABLAUF[0]) })).toMatchObject({ schritt: 3 });
  });
});

function fakeApi(vorhanden: string[] = []) {
  return {
    get: vi.fn(async (_t: string, p: Record<string, string>) =>
      vorhanden.includes(p.email?.replace('eq.', '') ?? '') ? [{ id: 'x' }] : [],
    ),
    rpc: vi.fn(async () => '20000000-0000-4000-8000-0000000000ff'),
  };
}

describe('Aktion', () => {
  const fd = (d: unknown) => {
    const f = new FormData();
    f.set('daten', JSON.stringify(d));
    return f;
  };

  it('AK-8: legt an, lädt ein und leitet weiter', async () => {
    const api = fakeApi();
    const einladen = vi.fn(async () => 'sent' as const);
    const d = {
      ...gueltig(),
      einladen: true,
      ansprechpartner: {
        ids: [AP],
        neu: [{ name: 'Nina', email: 'nina@x.de', rolle: '', telefon: '', sprache: 'de' as const }],
      },
    };
    const r = await A.projektMitAssistent(fd(d), { api: api as unknown as A.AdminApi, admin: true, einladen });
    expect(api.rpc).toHaveBeenCalledWith('projekt_anlegen', { daten: expect.objectContaining({ kunde_id: K }) });
    expect(einladen).toHaveBeenCalledWith('nina@x.de');
    expect(r).toMatchObject({
      status: 'ok',
      redirect: '/kunden/admin/projekte/20000000-0000-4000-8000-0000000000ff?angelegt=1&eingeladen=1&von=1',
    });
  });

  it('AK-8: ohne Einladung keine Mail; vergebene E-Mail führt zu Schritt 3', async () => {
    const einladen = vi.fn(async () => 'sent' as const);
    const api = fakeApi();
    const ok = await A.projektMitAssistent(fd(gueltig()), { api: api as unknown as A.AdminApi, admin: true, einladen });
    expect(ok).toMatchObject({ redirect: '/kunden/admin/projekte/20000000-0000-4000-8000-0000000000ff?angelegt=1' });
    expect(einladen).not.toHaveBeenCalled();

    const api2 = fakeApi(['nina@x.de']);
    const d = {
      ...gueltig(),
      ansprechpartner: { ids: [], neu: [{ name: 'Nina', email: 'nina@x.de', rolle: '', telefon: '', sprache: 'de' }] },
    };
    expect(await A.projektMitAssistent(fd(d), { api: api2 as unknown as A.AdminApi, admin: true })).toMatchObject({
      status: 'error',
      schritt: 2,
      errors: { 'ap.0.email': A.ADMIN_TEXT.emailVergeben },
    });
    expect(api2.rpc).not.toHaveBeenCalled();
  });

  it('AK-6: kaputtes JSON und ungültige Daten', async () => {
    const api = fakeApi();
    const f = new FormData();
    f.set('daten', '{kaputt');
    expect(await A.projektMitAssistent(f, { api: api as unknown as A.AdminApi, admin: true })).toMatchObject({
      status: 'error',
      message: A.ADMIN_TEXT.ungueltig,
    });
    expect(
      await A.projektMitAssistent(fd({ ...gueltig(), projekt: { ...gueltig().projekt, titel: '' } }), {
        api: api as unknown as A.AdminApi,
        admin: true,
      }),
    ).toMatchObject({ status: 'error', schritt: 1 });
    expect(api.rpc).not.toHaveBeenCalled();
  });
});

describe('Ansicht', () => {
  const weiter = () => fireEvent.click(screen.getByRole('button', { name: 'Weiter' }));

  it('AK-2/AK-3: Fortschritt, Fehler blockieren Weiter, Zurück behält Eingaben', async () => {
    render(<ProjektAssistent kunden={KUNDEN} start={leererAssistent()} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Neues Projekt' })).toBeInTheDocument();
    const fortschritt = screen.getByRole('list', { name: 'Fortschritt' });
    expect(within(fortschritt).getAllByRole('listitem')).toHaveLength(6);
    expect(within(fortschritt).getAllByRole('listitem')[0]).toHaveAttribute('aria-current', 'step');

    // Schritt 1: neuer Kunde ohne Namen
    fireEvent.click(screen.getByRole('radio', { name: 'Neuer Kunde' }));
    weiter();
    const fehler = await screen.findByRole('alert');
    expect(fehler).toHaveTextContent('Bitte gib einen Namen ein.');
    await waitFor(() => expect(fehler).toHaveFocus());
    expect(screen.getByRole('heading', { name: 'Schritt 1 von 6: Kunde' })).toBeVisible();

    fireEvent.change(screen.getByLabelText(/^Name des Kunden/), { target: { value: 'Neue GmbH' } });
    weiter();
    const h2 = screen.getByRole('heading', { name: 'Schritt 2 von 6: Projekt' });
    await waitFor(() => expect(h2).toHaveFocus());
    expect(within(fortschritt).getAllByRole('listitem')[0]).toHaveTextContent('erledigt');

    fireEvent.change(screen.getByLabelText(/^Titel/), { target: { value: 'Relaunch' } });
    fireEvent.click(screen.getByRole('button', { name: 'Zurück' }));
    expect(screen.getByLabelText(/^Name des Kunden/)).toHaveValue('Neue GmbH');
    weiter();
    expect(screen.getByLabelText(/^Titel/)).toHaveValue('Relaunch');
  });

  it('AK-5: Ablauf bearbeiten mit eindeutigen Buttons, Termin optional, Prüfen und Absenden', async () => {
    const start = vorbelegung({ kundeId: K, kunden: KUNDEN });
    start.projekt.titel = 'Relaunch';
    render(<ProjektAssistent kunden={KUNDEN} start={start} />);
    weiter(); // Kunde
    weiter(); // Projekt
    // Schritt 3: bestehende Ansprechpartnerin wählen, neue hinzufügen
    fireEvent.click(screen.getByRole('checkbox', { name: 'Anna (anna@b.example)' }));
    const neu = screen.getByRole('group', { name: 'Ansprechpartner hinzufügen' });
    fireEvent.change(within(neu).getByLabelText(/^Name/), { target: { value: 'Nina' } });
    fireEvent.change(within(neu).getByLabelText(/^E-Mail/), { target: { value: 'nina@x.de' } });
    fireEvent.click(within(neu).getByRole('button', { name: 'Hinzufügen' }));
    expect(screen.getByRole('button', { name: 'Entfernen: Nina' })).toBeInTheDocument();
    expect(screen.getByText('Nina hinzugefügt.')).toBeInTheDocument();
    weiter();

    // Schritt 4: Ablauf
    expect(screen.getAllByLabelText(/^Titel Deutsch/)).toHaveLength(6);
    fireEvent.click(screen.getByRole('button', { name: 'Nach unten: Kennenlernen' }));
    expect(screen.getAllByLabelText(/^Titel Deutsch/)[1]).toHaveValue('Kennenlernen');
    fireEvent.click(screen.getByRole('button', { name: 'Entfernen: Test & Launch' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ablaufschritt hinzufügen' }));
    expect(screen.getAllByLabelText(/^Titel Deutsch/)).toHaveLength(6);
    fireEvent.change(screen.getAllByLabelText(/^Titel Deutsch/)[5]!, { target: { value: 'Pflege' } });
    weiter();

    // Schritt 5: Termin optional
    expect(screen.queryByLabelText(/^Datum/)).toBeNull();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Ersten Termin eintragen' }));
    expect(screen.getByLabelText(/^Datum/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Ersten Termin eintragen' }));
    weiter();

    // Schritt 6: Prüfen
    const pruefen = screen.getByRole('heading', { name: 'Schritt 6 von 6: Prüfen' }).closest('fieldset')!;
    expect(pruefen).toHaveTextContent('Bäckerei');
    expect(pruefen).toHaveTextContent('Relaunch');
    expect(pruefen).toHaveTextContent('Anna');
    expect(pruefen).toHaveTextContent('Nina');
    expect(pruefen).toHaveTextContent('Pflege');
    expect(pruefen).toHaveTextContent('Kein Termin');
    fireEvent.click(within(pruefen).getByRole('button', { name: 'Bearbeiten: Ablauf' }));
    expect(screen.getByRole('heading', { name: 'Schritt 4 von 6: Ablauf' })).toBeVisible();
    weiter();
    weiter();
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Projekt anlegen' })));
    expect(projektMitAssistent).toHaveBeenCalled();
    const daten = JSON.parse(String(projektMitAssistent.mock.calls[0]![1].get('daten')));
    expect(daten.ansprechpartner).toEqual({
      ids: [AP],
      neu: [{ name: 'Nina', email: 'nina@x.de', rolle: '', telefon: '', sprache: 'de' }],
    });
    expect(daten.schritte.map((s: { titel_de: string }) => s.titel_de)).toEqual([
      'Analyse & Angebot',
      'Kennenlernen',
      'Konzept',
      'Design',
      'Umsetzung',
      'Pflege',
    ]);
    expect(daten.termin).toBeNull();
  });

  it('AK-3: Serverfehler springt zum Schritt mit dem Fehler', async () => {
    projektMitAssistent.mockResolvedValueOnce({
      status: 'error',
      message: A.ADMIN_TEXT.pruefen,
      errors: { 'ap.0.email': A.ADMIN_TEXT.emailVergeben },
      schritt: 2,
    });
    const start = gueltig();
    start.ansprechpartner = {
      ids: [],
      neu: [{ name: 'Nina', email: 'nina@x.de', rolle: '', telefon: '', sprache: 'de' }],
    };
    render(<ProjektAssistent kunden={KUNDEN} start={start} />);
    for (let i = 0; i < 5; i++) weiter();
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Projekt anlegen' })));
    expect(await screen.findByRole('heading', { name: 'Schritt 3 von 6: Ansprechpartner' })).toBeVisible();
    expect(screen.getByRole('alert')).toHaveTextContent(A.ADMIN_TEXT.emailVergeben);
  });
});

describe('Befunde Blinder Kritiker zum Assistenten', () => {
  const weiter = () => fireEvent.click(screen.getByRole('button', { name: 'Weiter' }));
  const zuSchritt = (n: number) => {
    for (let i = 0; i < n; i++) weiter();
  };

  it('5/8: Prüfen mit beschrifteten Werten, Bearbeiten führt mit „Zurück zur Prüfung“ zurück', async () => {
    const start = gueltig();
    start.schritte = [{ titel_de: 'Texte liefern', titel_en: '', verantwortlich: 'kunde' }];
    render(<ProjektAssistent kunden={KUNDEN} start={start} />);
    zuSchritt(5);
    const pruefen = screen.getByRole('heading', { name: 'Schritt 6 von 6: Prüfen' }).closest('fieldset')!;
    const projekt = within(pruefen).getByRole('region', { name: 'Projekt' });
    const werte = Object.fromEntries(
      within(projekt)
        .getAllByRole('term')
        .map((dt) => [dt.textContent, dt.nextElementSibling?.textContent]),
    );
    expect(werte).toMatchObject({
      Titel: 'Relaunch',
      Status: 'Angebot',
      Auftragswert: '12.500 €',
      Wahrscheinlichkeit: '40 %',
    });
    expect(within(pruefen).getByRole('region', { name: 'Ablauf' })).toHaveTextContent('Texte liefern (Kunde)');

    fireEvent.click(within(pruefen).getByRole('button', { name: 'Bearbeiten: Projekt' }));
    expect(screen.getByRole('heading', { name: 'Schritt 2 von 6: Projekt' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Zurück zur Prüfung' }));
    const h2 = screen.getByRole('heading', { name: 'Schritt 6 von 6: Prüfen' });
    await waitFor(() => expect(h2).toHaveFocus());
    expect(screen.queryByRole('button', { name: 'Zurück zur Prüfung' })).toBeNull();
  });

  it('5: „Zurück zur Prüfung“ prüft den Schritt', async () => {
    render(<ProjektAssistent kunden={KUNDEN} start={gueltig()} />);
    zuSchritt(5);
    fireEvent.click(screen.getByRole('button', { name: 'Bearbeiten: Projekt' }));
    fireEvent.change(screen.getByLabelText(/^Titel/), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Zurück zur Prüfung' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Titel');
    expect(screen.getByRole('heading', { name: 'Schritt 2 von 6: Projekt' })).toBeVisible();
  });

  it('7/9/20: Ablaufschritte eindeutig benannt, Fehler verschwinden beim Entfernen, Fokus bleibt in der Liste', async () => {
    const start = gueltig();
    start.schritte = [
      { titel_de: 'Eins', titel_en: '', verantwortlich: 'erik' },
      { titel_de: '', titel_en: '', verantwortlich: 'erik' },
      { titel_de: 'Drei', titel_en: '', verantwortlich: 'erik' },
    ];
    render(<ProjektAssistent kunden={KUNDEN} start={start} />);
    zuSchritt(3);
    expect(screen.getByLabelText('Titel Deutsch, Ablaufschritt 1 (Pflicht)')).toHaveValue('Eins');
    expect(screen.getByRole('button', { name: 'Ablaufschritt hinzufügen' })).toBeInTheDocument();
    weiter();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Entfernen: Ablaufschritt 2' }));
    expect(screen.queryByRole('alert')).toBeNull();
    // Fokus auf das nächste Titelfeld, beim letzten auf das vorige
    await waitFor(() => expect(screen.getByLabelText('Titel Deutsch, Ablaufschritt 2 (Pflicht)')).toHaveFocus());
    fireEvent.click(screen.getByRole('button', { name: 'Entfernen: Drei' }));
    await waitFor(() => expect(screen.getByLabelText('Titel Deutsch, Ablaufschritt 1 (Pflicht)')).toHaveFocus());
  });

  it('13/14: Ansprechpartner-Fehler am Fieldset, klare Pflicht-Hinweise', async () => {
    render(<ProjektAssistent kunden={KUNDEN} start={{ ...gueltig(), ansprechpartner: { ids: [], neu: [] } }} />);
    zuSchritt(2);
    weiter();
    const alert = await screen.findByRole('alert');
    const link = within(alert).getByRole('link');
    const ziel = document.querySelector(link.getAttribute('href')!)!;
    expect(ziel).toBe(screen.getByRole('checkbox', { name: 'Anna (anna@b.example)' }));
    const gruppe = screen.getByRole('group', { name: 'Ansprechpartner von Bäckerei' });
    expect(gruppe).toHaveAccessibleDescription(/mindestens einen Ansprechpartner/);
    const neu = screen.getByRole('group', { name: 'Ansprechpartner hinzufügen' });
    expect(within(neu).getByLabelText(/^Name/)).toHaveAccessibleName('Name (Pflicht beim Hinzufügen)');
    expect(screen.getByRole('checkbox', { name: /Anmeldelink/ })).toHaveAccessibleDescription(/Nur neu hinzugefügte/);
  });
});
