import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ProjektRow } from '@/lib/kundenbereich/projekte';

// functions/kundenbereich/termine.md

vi.mock('@/app/actions/kundenbereich', () => ({ requestLoginLink: vi.fn(), confirmLogin: vi.fn(), logout: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: vi.fn(), headers: vi.fn() }));

const { projektAnsicht, PROJEKT_SELECT } = await import('@/lib/kundenbereich/projekte');
const { icsDatei, kalenderAntwort, zeitraum } = await import('@/lib/kundenbereich/termine');
const { default: Projektuebersicht } = await import('@/components/kundenbereich/Projektuebersicht');

const termin = (id: string, beginn: string, ende: string, extra: Partial<ProjektRow['termine'][number]> = {}) => ({
  id,
  beginn,
  ende,
  titel_de: `Termin ${id}`,
  titel_en: null,
  meet_url: 'https://meet.google.com/abc-defg-hij',
  ...extra,
});

const NOW = new Date('2026-10-14T12:00:00Z');

const PROJEKT: ProjektRow = {
  id: 'p1',
  titel: 'Relaunch',
  status: 'in_arbeit',
  phase: null,
  beschreibung_de: null,
  beschreibung_en: null,
  website_url: null,
  staging_url: null,
  kunden: { name: 'Kunde A' },
  projektschritte: [],
  termine: [
    termin('t5', '2026-10-30T09:00:00Z', '2026-10-30T10:00:00Z'),
    termin('vergangen', '2026-10-13T08:00:00Z', '2026-10-13T09:00:00Z'),
    termin('t1', '2026-10-15T08:00:00Z', '2026-10-15T09:00:00Z', { titel_en: 'Design review' }),
    termin('laeuft', '2026-10-14T11:30:00Z', '2026-10-14T12:30:00Z', { titel_de: null }),
    termin('t3', '2026-10-20T08:00:00Z', '2026-10-20T09:00:00Z'),
    termin('t4', '2026-10-22T08:00:00Z', '2026-10-22T09:00:00Z'),
  ],
};
const ANNA = { art: 'kunde' as const, name: 'Anna', sprache: 'de' as const };

afterEach(() => vi.unstubAllGlobals());

describe('Termine aufbereiten', () => {
  it('AK-1: Projekte werden mit Terminen geladen', () => {
    expect(PROJEKT_SELECT).toMatch(/termine\(id,beginn,ende,titel_de,titel_en,meet_url\)/);
  });

  it('AK-2: vergangene ausgeblendet, sortiert, nächster und bis zu drei weitere', () => {
    const a = projektAnsicht(PROJEKT, 'de', NOW);
    expect(a.naechsterTermin?.id).toBe('laeuft');
    expect(a.naechsterTermin?.titel).toBe('Projekttermin');
    expect(a.weitereTermine.map((t) => t.id)).toEqual(['t1', 't3', 't4']);
    expect(projektAnsicht(PROJEKT, 'en', NOW).weitereTermine[0]!.titel).toBe('Design review');
    expect(projektAnsicht(PROJEKT, 'en', NOW).weitereTermine[1]!.titel).toBe('Termin t3');
    expect(projektAnsicht({ ...PROJEKT, termine: [] }, 'de', NOW).naechsterTermin).toBeNull();
  });

  it('AK-3/AK-7: Zeitraum mit Zeitzonenkürzel, deutsch und englisch', () => {
    expect(zeitraum('2026-10-15T08:00:00Z', '2026-10-15T09:00:00Z', 'de', 'Europe/Berlin')).toBe(
      'Do., 15. Okt. 2026, 10:00–11:00 MESZ',
    );
    expect(zeitraum('2026-10-15T08:00:00Z', '2026-10-15T09:00:00Z', 'en', 'Europe/London')).toBe(
      'Thu, 15 Oct 2026, 09:00–10:00 BST',
    );
  });
});

describe('Ansicht', () => {
  it('AK-3: nächster Termin mit time, Meet-Button und Kalender', () => {
    vi.useFakeTimers({ now: NOW, toFake: ['Date'] });
    render(<Projektuebersicht locale="de" profil={ANNA} projekte={[PROJEKT]} />);
    vi.useRealTimers();
    const section = screen.getByRole('region', { name: 'Nächster Termin' });
    expect(within(section).getByText('Projekttermin')).toBeInTheDocument();
    expect(section.querySelector('time')).toHaveAttribute('datetime', '2026-10-14T11:30:00Z');
    const meet = within(section).getByRole('link', { name: /Google Meet beitreten.*\(öffnet in neuem Tab\)/ });
    expect(meet).toHaveAttribute('href', 'https://meet.google.com/abc-defg-hij');
    expect(meet).toHaveAttribute('target', '_blank');
    expect(meet).toHaveAttribute('rel', 'noopener noreferrer');
    expect(within(section).getByRole('link', { name: /In Kalender übernehmen/ })).toHaveAttribute(
      'href',
      '/kunden/termine/laeuft?sprache=de',
    );
    expect(within(section).getAllByRole('listitem')).toHaveLength(3);
  });

  it('AK-4: ohne Meet-Link kein Button, ohne Termin Hinweis', () => {
    vi.useFakeTimers({ now: NOW, toFake: ['Date'] });
    const { unmount } = render(
      <Projektuebersicht
        locale="de"
        profil={ANNA}
        projekte={[
          { ...PROJEKT, termine: [termin('x', '2026-10-15T08:00:00Z', '2026-10-15T09:00:00Z', { meet_url: null })] },
        ]}
      />,
    );
    expect(screen.queryByRole('link', { name: /Google Meet/ })).toBeNull();
    expect(screen.getByRole('link', { name: /In Kalender übernehmen/ })).toBeInTheDocument();
    unmount();
    render(<Projektuebersicht locale="de" profil={ANNA} projekte={[{ ...PROJEKT, termine: [] }]} />);
    vi.useRealTimers();
    expect(screen.getByText('Gerade ist kein Termin geplant.')).toBeInTheDocument();
  });

  it('AK-7: englisch', () => {
    vi.useFakeTimers({ now: NOW, toFake: ['Date'] });
    render(<Projektuebersicht locale="en" profil={ANNA} projekte={[PROJEKT]} />);
    vi.useRealTimers();
    const section = screen.getByRole('region', { name: 'Next meeting' });
    expect(within(section).getByText('Project meeting')).toBeInTheDocument();
    expect(within(section).getByRole('link', { name: /Join Google Meet.*\(opens in a new tab\)/ })).toBeInTheDocument();
    expect(within(section).getByRole('link', { name: /Add to calendar/ })).toHaveAttribute(
      'href',
      '/kunden/termine/laeuft?sprache=en',
    );
  });
});

describe('Kalenderdatei', () => {
  it('AK-5: gültiges iCalendar mit Escape und UTC', () => {
    const ics = icsDatei(
      {
        id: 't1',
        beginn: '2026-10-15T08:00:00Z',
        ende: '2026-10-15T09:30:00Z',
        titel: 'Review; Design, Teil 2',
        meetUrl: 'https://meet.google.com/abc-defg-hij',
      },
      'Relaunch',
      'de',
      new Date('2026-10-14T12:00:00Z'),
    );
    expect(ics.split('\r\n').slice(0, 3)).toEqual([
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      expect.stringMatching(/^PRODID:/),
    ]);
    expect(ics).not.toMatch(/[^\r]\n/);
    expect(ics).toContain('\r\nUID:t1@erik-bergheimer.de\r\n');
    expect(ics).toContain('\r\nDTSTAMP:20261014T120000Z\r\n');
    expect(ics).toContain('\r\nDTSTART:20261015T080000Z\r\n');
    expect(ics).toContain('\r\nDTEND:20261015T093000Z\r\n');
    expect(ics).toContain('\r\nSUMMARY:Review\; Design\\, Teil 2 (Relaunch)\r\n');
    expect(ics).toContain('\r\nURL:https://meet.google.com/abc-defg-hij\r\n');
    expect(ics).toContain('\r\nLOCATION:https://meet.google.com/abc-defg-hij\r\n');
    expect(ics).toMatch(/\r\nDESCRIPTION:Google Meet: https:\/\/meet\.google\.com\/abc-defg-hij\r\n/);
    expect(ics.endsWith('END:VEVENT\r\nEND:VCALENDAR\r\n')).toBe(true);

    const ohne = icsDatei(
      { id: 't2', beginn: '2026-10-15T08:00:00Z', ende: '2026-10-15T09:00:00Z', titel: 'A\nB', meetUrl: null },
      'P',
      'en',
    );
    expect(ohne).not.toMatch(/URL:|LOCATION:/);
    expect(ohne).toContain('SUMMARY:A\\nB (P)');
  });

  it('AK-6: Route 401 ohne Sitzung, 404 für fremde Termine, sonst Kalenderdatei', async () => {
    const api = {
      termin: vi.fn(async (_access: string, id: string) =>
        id === 't1'
          ? { ...termin('t1', '2026-10-15T08:00:00Z', '2026-10-15T09:00:00Z'), kundenprojekte: { titel: 'Relaunch' } }
          : null,
      ),
    };
    expect((await kalenderAntwort('t1', 'de', undefined, api)).status).toBe(401);
    expect((await kalenderAntwort('t1', 'de', 'tok', null)).status).toBe(401);
    expect((await kalenderAntwort('fremd', 'de', 'tok', api)).status).toBe(404);
    const ok = await kalenderAntwort('t1', 'en', 'tok', api);
    expect(api.termin).toHaveBeenLastCalledWith('tok', 't1');
    expect(ok.status).toBe(200);
    expect(ok.headers.get('content-type')).toMatch(/^text\/calendar/);
    expect(ok.headers.get('content-disposition')).toMatch(/^attachment; filename=".+\.ics"$/);
    expect(ok.headers.get('cache-control')).toBe('private, no-store');
    expect(await ok.text()).toContain('SUMMARY:Termin t1 (Relaunch)');
  });
});
