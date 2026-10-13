import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AdminState } from '@/lib/kundenbereich/admin/aktionen';
import type { AngebotZeile } from '@/lib/kundenbereich/admin/laden';

// functions/kundenbereich/angebote.md AK-7, Barrierefreiheit

const aktionen = vi.hoisted(() => ({
  angebotSpeichern: vi.fn(async (): Promise<AdminState> => ({ status: 'ok', message: 'Entwurf gespeichert.' })),
  angebotFreigeben: vi.fn(async (): Promise<AdminState> => ({ status: 'ok', message: 'Freigegeben.' })),
  angebotLoeschen: vi.fn(async (): Promise<AdminState> => ({ status: 'ok', message: 'Gelöscht.' })),
}));
vi.mock('@/app/actions/kundenbereich-angebote', () => aktionen);
const router = vi.hoisted(() => ({ refresh: vi.fn(), push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router, usePathname: () => '/kunden/admin', notFound: vi.fn() }));

const { default: Angebote } = await import('@/components/kundenbereich/admin/Angebote');

const P = '20000000-0000-4000-8000-00000000000b';
const angebot = (extra: Partial<AngebotZeile>): AngebotZeile => ({
  id: '60000000-0000-4000-8000-000000000001',
  created_at: '2026-10-13T10:00:00Z',
  nummer: '2026-001',
  titel: 'Relaunch',
  sprache: 'de',
  datum: '2026-10-13',
  gueltig_bis: '2026-11-12',
  empfaenger: 'Bäckerei',
  einleitung: '',
  positionen: [{ bezeichnung: 'Design', beschreibung: '', menge: 1, einheit: 'pauschal', einzelpreis_cent: 120000 }],
  ust_satz: 19,
  gesamt_cent: 142800,
  status: 'entwurf',
  dokument_id: null,
  unterschrift_id: null,
  unterschrieben_am: null,
  ...extra,
});
const vorlage = {
  nummer: '2026-004',
  titel: 'Relaunch',
  sprache: 'de' as const,
  empfaenger: 'Bäckerei\nAnna Huber',
  datum: '2026-10-13',
  gueltig_bis: '2026-11-12',
};

afterEach(() => vi.clearAllMocks());

async function menue(name: string) {
  await act(async () => fireEvent.click(screen.getByRole('button', { name: `Aktionen: ${name}` })));
  return screen.getByRole('menu').querySelectorAll('[role="menuitem"]');
}

describe('Angebote in der Verwaltung', () => {
  it('AK-7: Liste mit Nummer, Titel, Betrag und Status, Menü je nach Status', async () => {
    render(
      <Angebote
        projektId={P}
        vorlage={vorlage}
        angebote={[
          angebot({}),
          angebot({
            id: '60000000-0000-4000-8000-000000000002',
            nummer: '2026-002',
            status: 'freigegeben',
            dokument_id: 'd1',
          }),
          angebot({
            id: '60000000-0000-4000-8000-000000000003',
            nummer: '2026-003',
            status: 'unterschrieben',
            dokument_id: 'd2',
            unterschrift_id: '50000000-0000-4000-8000-000000000009',
            unterschrieben_am: '2026-10-14T09:00:00Z',
          }),
        ]}
      />,
    );
    const karte = screen.getByRole('region', { name: 'Angebote' });
    expect(within(karte).getByText('Angebot 2026-001')).toBeInTheDocument();
    expect(within(karte).getAllByText('1.428,00 €')).toHaveLength(3);
    expect(within(karte).getByText('Entwurf')).toBeInTheDocument();
    expect(within(karte).getByText('Beim Kunden')).toBeInTheDocument();
    expect(within(karte).getByText(/Unterschrieben am 14\. Okt\. 2026/)).toBeInTheDocument();

    const entwurf = [...(await menue('Angebot 2026-001'))].map((e) => e.getAttribute('aria-label') ?? e.textContent);
    expect(entwurf).toEqual(['PDF ansehen (öffnet in neuem Tab)', 'Bearbeiten', 'An Kunden freigeben', 'Löschen']);
    const pdf = screen.getByRole('menuitem', { name: 'PDF ansehen (öffnet in neuem Tab)' });
    expect(pdf).toHaveAttribute('href', '/kunden/admin/angebote/60000000-0000-4000-8000-000000000001/pdf');
    expect(pdf).toHaveAttribute('target', '_blank');
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });

    const frei = [...(await menue('Angebot 2026-002'))].map((e) => e.getAttribute('aria-label') ?? e.textContent);
    expect(frei).toEqual(['PDF ansehen (öffnet in neuem Tab)', 'Löschen']);
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });

    const unterschrieben = [...(await menue('Angebot 2026-003'))].map(
      (e) => e.getAttribute('aria-label') ?? e.textContent,
    );
    expect(unterschrieben).toEqual([
      'PDF ansehen (öffnet in neuem Tab)',
      'Unterschriebenes ansehen (öffnet in neuem Tab)',
      'Löschen',
    ]);
    expect(screen.getByRole('menuitem', { name: 'Unterschriebenes ansehen (öffnet in neuem Tab)' })).toHaveAttribute(
      'href',
      '/kunden/dokumente/50000000-0000-4000-8000-000000000009',
    );
  });

  it('AK-7: ohne Angebote ein Hinweis', () => {
    render(<Angebote projektId={P} vorlage={vorlage} angebote={[]} />);
    expect(screen.getByText('Noch keine Angebote.')).toBeInTheDocument();
  });

  it('Freigeben fragt vorher nach', async () => {
    render(<Angebote projektId={P} vorlage={vorlage} angebote={[angebot({})]} />);
    await menue('Angebot 2026-001');
    await act(async () => fireEvent.click(screen.getByRole('menuitem', { name: 'An Kunden freigeben' })));
    const frage = screen.getByRole('dialog', { name: 'Angebot 2026-001 freigeben?' });
    await act(async () => fireEvent.click(within(frage).getByRole('button', { name: 'Freigeben' })));
    expect(aktionen.angebotFreigeben).toHaveBeenCalled();
  });

  it('Dialog: Vorbelegung, Positionen als Gruppen, Fokus und Summen', async () => {
    render(<Angebote projektId={P} vorlage={vorlage} angebote={[]} />);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Angebot erstellen' })));
    const dialog = screen.getByRole('dialog', { name: 'Angebot erstellen' });
    expect(within(dialog).getByLabelText(/Nummer/)).toHaveValue('2026-004');
    expect(within(dialog).getByLabelText(/Empfänger/)).toHaveValue('Bäckerei\nAnna Huber');
    expect(within(dialog).getByRole('group', { name: 'Position 1' })).toBeInTheDocument();

    const pos1 = within(dialog).getByRole('group', { name: 'Position 1' });
    fireEvent.change(within(pos1).getByLabelText(/Bezeichnung/), { target: { value: 'Design' } });
    fireEvent.change(within(pos1).getByLabelText(/Menge/), { target: { value: '2' } });
    fireEvent.change(within(pos1).getByLabelText(/Einzelpreis/), { target: { value: '1.000,50' } });
    const summe = within(dialog).getByRole('status');
    expect(summe).toHaveTextContent('Netto 2.001,00 €');
    expect(summe).toHaveTextContent('Umsatzsteuer 19 % 380,19 €');
    expect(summe).toHaveTextContent('Gesamt 2.381,19 €');
    expect(summe).toHaveAttribute('aria-live', 'off');

    await act(async () => fireEvent.click(within(dialog).getByRole('button', { name: 'Position hinzufügen' })));
    const pos2 = within(dialog).getByRole('group', { name: 'Position 2' });
    expect(within(pos2).getByLabelText(/Bezeichnung/)).toHaveFocus();
    expect(within(pos2).getByLabelText(/Bezeichnung/)).toHaveAttribute('name', 'pos.1.bezeichnung');

    await act(async () => fireEvent.click(within(dialog).getByRole('button', { name: 'Position 1 entfernen' })));
    expect(within(dialog).queryByRole('group', { name: 'Position 2' })).toBeNull();
    // die frühere zweite Position heißt jetzt Position 1 und hat die Felder pos.0
    expect(
      within(within(dialog).getByRole('group', { name: 'Position 1' })).getByLabelText(/Bezeichnung/),
    ).toHaveAttribute('name', 'pos.0.bezeichnung');
    expect(within(dialog).queryByRole('button', { name: 'Position 1 entfernen' })).toBeNull();
  });

  it('Dialog: Absenden schickt alle Felder, Fehler stehen an der Position', async () => {
    aktionen.angebotSpeichern.mockResolvedValueOnce({
      status: 'error',
      message: 'Bitte prüf die markierten Felder.',
      errors: { 'pos.0.bezeichnung': 'Bitte gib eine Bezeichnung ein.' },
    });
    render(<Angebote projektId={P} vorlage={vorlage} angebote={[]} />);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Angebot erstellen' })));
    const dialog = screen.getByRole('dialog', { name: 'Angebot erstellen' });
    await act(async () => fireEvent.click(within(dialog).getByRole('button', { name: 'Entwurf speichern' })));
    const fd = (aktionen.angebotSpeichern.mock.calls[0] as unknown[])[1] as FormData;
    expect(fd.get('projekt_id')).toBe(P);
    expect(fd.get('nummer')).toBe('2026-004');
    expect(fd.get('ust_satz')).toBe('19');
    const feld = within(dialog).getByLabelText(/Bezeichnung/);
    expect(feld).toHaveAttribute('aria-invalid', 'true');
    expect(feld).toHaveAccessibleDescription(/Bitte gib eine Bezeichnung ein/);
    expect(feld).toHaveFocus();
  });
});
