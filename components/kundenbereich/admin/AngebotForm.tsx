'use client';

import { Plus, Trash2 } from 'lucide-react';
import { startTransition, useActionState, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import Button from '@/components/ui/Button';
import SelectField from '@/components/ui/SelectField';
import TextField from '@/components/ui/TextField';
import type { AdminState } from '@/lib/kundenbereich/admin/aktionen';
import type { AngebotEingabe } from '@/lib/kundenbereich/angebot/pruefen';
import { dezimal } from '@/lib/kundenbereich/angebot/pruefen';
import { euro, summen } from '@/lib/kundenbereich/angebot/rechnen';
import type { AngebotVorlage } from '@/lib/kundenbereich/angebot/vorlage';
import { DialogFuss, DialogInhalt, useAdminDialog } from './AdminDialog';
import { abgesichert, Meldung, type AdminAction } from './AdminForm';

// Dialog „Angebot erstellen“ bzw. „bearbeiten“ mit Positionen und laufender Summe
// (functions/kundenbereich/angebote.md Verhalten 2, Barrierefreiheit)

interface Zeile {
  key: number;
  bezeichnung: string;
  beschreibung: string;
  menge: string;
  einheit: string;
  preis: string;
}

const preisText = (cent: number) =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cent / 100);
const mengeText = (n: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(n);

let naechsterKey = 1;
const leer = (): Zeile => ({
  key: naechsterKey++,
  bezeichnung: '',
  beschreibung: '',
  menge: '1',
  einheit: '',
  preis: '',
});

export default function AngebotForm({
  action,
  projektId,
  angebotId,
  start,
}: {
  action: AdminAction;
  projektId: string;
  /** Beim Bearbeiten eines Entwurfs */
  angebotId?: string;
  start: AngebotVorlage & Partial<AngebotEingabe>;
}) {
  const [state, dispatch, pending] = useActionState(abgesichert(action), { status: 'idle' } as AdminState);
  const [zeilen, setZeilen] = useState<Zeile[]>(() =>
    start.positionen?.length
      ? start.positionen.map((p) => ({
          key: naechsterKey++,
          bezeichnung: p.bezeichnung,
          beschreibung: p.beschreibung,
          menge: mengeText(p.menge),
          einheit: p.einheit,
          preis: preisText(p.einzelpreis_cent),
        }))
      : [leer()],
  );
  const [ust, setUst] = useState(String(start.ust_satz ?? 19));
  // Nach Hinzufügen oder Entfernen: Fokus auf die Bezeichnung dieser Position (Barrierefreiheit)
  const fokus = useRef<number | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const dialog = useAdminDialog();
  const id = useId();
  const formId = `${id}-angebot`;

  useEffect(() => {
    if (state.status === 'ok' && dialog) dialog.schliessen(state.message);
    if (state.status === 'error' && state.errors) {
      const first = Object.keys(state.errors)[0];
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }, [state, dialog]);

  useEffect(() => {
    if (fokus.current === null) return;
    form.current?.querySelector<HTMLElement>(`[name="pos.${fokus.current}.bezeichnung"]`)?.focus();
    fokus.current = null;
  }, [zeilen]);

  const errors = state.status === 'error' ? (state.errors ?? {}) : {};
  const aendern = (i: number, feld: keyof Omit<Zeile, 'key'>, wert: string) =>
    setZeilen((z) => z.map((x, j) => (j === i ? { ...x, [feld]: wert } : x)));
  const s = summen(
    zeilen.map((z) => ({
      bezeichnung: z.bezeichnung,
      beschreibung: z.beschreibung,
      menge: Math.max(0, dezimal(z.menge) ?? 0),
      einheit: z.einheit,
      einzelpreis_cent: Math.max(0, Math.round((dezimal(z.preis) ?? 0) * 100)),
    })),
    ust === '0' ? 0 : 19,
  );

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
  const fid = (name: string) => `${id}-${name.replace(/\./g, '-')}`;
  const half = 'sm:col-span-1';
  const voll = 'sm:col-span-2';

  return (
    <>
      <DialogInhalt>
        <form ref={form} id={formId} onSubmit={submit} noValidate>
          <Meldung state={state} />
          <input type="hidden" name="projekt_id" value={projektId} />
          {angebotId && <input type="hidden" name="id" value={angebotId} />}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <TextField
              id={fid('nummer')}
              name="nummer"
              label="Nummer"
              marker="(Pflicht)"
              hint="Jahr und laufende Nummer"
              defaultValue={start.nummer}
              error={errors.nummer}
              autoComplete="off"
              className={half}
            />
            <SelectField
              id={fid('sprache')}
              name="sprache"
              label="Sprache des PDFs"
              defaultValue={start.sprache}
              options={[
                { value: 'de', label: 'Deutsch' },
                { value: 'en', label: 'Englisch' },
              ]}
              className={half}
            />
            <TextField
              id={fid('titel')}
              name="titel"
              label="Titel"
              marker="(Pflicht)"
              defaultValue={start.titel}
              error={errors.titel}
              autoComplete="off"
              className={voll}
            />
            <TextField
              id={fid('datum')}
              name="datum"
              type="date"
              label="Datum"
              marker="(Pflicht)"
              defaultValue={start.datum}
              error={errors.datum}
              className={half}
            />
            <TextField
              id={fid('gueltig_bis')}
              name="gueltig_bis"
              type="date"
              label="Gültig bis"
              marker="(Pflicht)"
              defaultValue={start.gueltig_bis}
              error={errors.gueltig_bis}
              className={half}
            />
            <TextField
              id={fid('empfaenger')}
              name="empfaenger"
              label="Empfänger"
              hint="Eine Angabe pro Zeile, z. B. Firma, Name, Straße, Ort"
              multiline
              rows={4}
              defaultValue={start.empfaenger}
              error={errors.empfaenger}
              className={voll}
            />
            <TextField
              id={fid('einleitung')}
              name="einleitung"
              label="Einleitung"
              marker="(optional)"
              hint="Leer lassen für den Standardtext"
              multiline
              rows={3}
              defaultValue={start.einleitung ?? ''}
              error={errors.einleitung}
              className={voll}
            />
          </div>

          <h3 className="text-[16px] font-bold mt-6 mb-3">Positionen</h3>
          {errors.positionen && <p className="text-[12px] text-error mb-3">{errors.positionen}</p>}
          <div className="flex flex-col gap-4">
            {zeilen.map((z, i) => {
              const n = (f: string) => `pos.${i}.${f}`;
              return (
                <fieldset key={z.key} className="relative border border-border rounded-xl p-4">
                  <legend className="sr-only">Position {i + 1}</legend>
                  <p aria-hidden="true" className="text-[14px] font-bold min-h-11 flex items-center -mt-2 mb-1">
                    Position {i + 1}
                  </p>
                  {zeilen.length > 1 && (
                    <button
                      type="button"
                      className="absolute right-2 top-2 inline-flex items-center gap-1.5 min-h-11 px-2 rounded-lg text-[13px] text-text2 hover:text-error hover:bg-bg2"
                      aria-label={`Position ${i + 1} entfernen`}
                      onClick={() => {
                        setZeilen((alt) => alt.filter((_, j) => j !== i));
                        fokus.current = Math.max(0, i - 1);
                      }}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                      Entfernen
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4">
                    <TextField
                      id={fid(n('bezeichnung'))}
                      name={n('bezeichnung')}
                      label="Bezeichnung"
                      marker="(Pflicht)"
                      value={z.bezeichnung}
                      onChange={(e) => aendern(i, 'bezeichnung', e.target.value)}
                      error={errors[n('bezeichnung')]}
                      autoComplete="off"
                      className="sm:col-span-3"
                    />
                    <TextField
                      id={fid(n('beschreibung'))}
                      name={n('beschreibung')}
                      label="Beschreibung"
                      marker="(optional)"
                      multiline
                      rows={2}
                      value={z.beschreibung}
                      onChange={(e) => aendern(i, 'beschreibung', e.target.value)}
                      error={errors[n('beschreibung')]}
                      className="sm:col-span-3"
                    />
                    <TextField
                      id={fid(n('menge'))}
                      name={n('menge')}
                      label="Menge"
                      marker="(Pflicht)"
                      inputMode="decimal"
                      value={z.menge}
                      onChange={(e) => aendern(i, 'menge', e.target.value)}
                      error={errors[n('menge')]}
                      autoComplete="off"
                    />
                    <TextField
                      id={fid(n('einheit'))}
                      name={n('einheit')}
                      label="Einheit"
                      hint="z. B. Std., Tage, pauschal"
                      value={z.einheit}
                      onChange={(e) => aendern(i, 'einheit', e.target.value)}
                      autoComplete="off"
                    />
                    <TextField
                      id={fid(n('preis'))}
                      name={n('preis')}
                      label="Einzelpreis netto in €"
                      marker="(Pflicht)"
                      inputMode="decimal"
                      value={z.preis}
                      onChange={(e) => aendern(i, 'preis', e.target.value)}
                      error={errors[n('preis')]}
                      autoComplete="off"
                    />
                  </div>
                </fieldset>
              );
            })}
          </div>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 min-h-11 px-3 rounded-lg text-[14px] font-medium text-primary-text hover:bg-bg2"
            onClick={() => {
              setZeilen((z) => [...z, leer()]);
              fokus.current = zeilen.length;
            }}
          >
            <Plus size={16} aria-hidden="true" />
            Position hinzufügen
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 mt-6 items-start">
            <SelectField
              id={fid('ust_satz')}
              name="ust_satz"
              label="Umsatzsteuer"
              value={ust}
              onChange={(e) => setUst(e.target.value)}
              options={[
                { value: '19', label: '19 % ausweisen' },
                { value: '0', label: 'Keine (Kleinunternehmer, § 19 UStG)' },
              ]}
            />
            {/* Summen werden nicht bei jeder Eingabe angesagt (Barrierefreiheit) */}
            <output
              form={formId}
              aria-live="off"
              className="block rounded-xl bg-bg2 px-4 py-3 text-[14px] tabular-nums"
            >
              <span className="flex justify-between gap-3">
                <span>Netto</span> <span>{euro(s.netto, 'de')}</span>
              </span>
              {ust !== '0' && (
                <span className="flex justify-between gap-3 text-text2">
                  <span>Umsatzsteuer 19 %</span> <span>{euro(s.ust, 'de')}</span>
                </span>
              )}
              <span className="flex justify-between gap-3 font-bold mt-1">
                <span>Gesamt</span> <span>{euro(s.gesamt, 'de')}</span>
              </span>
            </output>
          </div>
        </form>
      </DialogInhalt>
      <DialogFuss>
        <Button type="submit" form={formId} aria-disabled={pending || undefined} className="max-sm:flex-1 max-sm:px-3">
          Entwurf speichern
        </Button>
      </DialogFuss>
    </>
  );
}
