'use client';

import { startTransition, useActionState, useEffect, useRef, type FormEvent } from 'react';
import Button from '@/components/ui/Button';
import { useAdminDialog } from './AdminDialog';
import SelectField from '@/components/ui/SelectField';
import TextField, { labelClass } from '@/components/ui/TextField';
import type { AdminState } from '@/lib/kundenbereich/admin/aktionen';

// Formular der Verwaltung aus den UI-Bausteinen: Fehler am Feld, Meldung mit aria-live
// (functions/kundenbereich/admin.md, Barrierefreiheit)

export type AdminAction = (state: AdminState, fd: FormData) => Promise<AdminState>;

export interface Feld {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'url' | 'date' | 'time' | 'number' | 'tel' | 'textarea' | 'select' | 'checkboxes';
  required?: boolean;
  defaultValue?: string;
  options?: { value: string; label: string }[];
  /** Vorauswahl bei `checkboxes` */
  checked?: string[];
  hint?: string;
  autoComplete?: string;
  /** Breite im Raster ab 640 px: halbe oder volle Zeile */
  half?: boolean;
}

export function Meldung({ state, live = true }: { state: AdminState; live?: boolean }) {
  return (
    <div aria-live={live ? 'polite' : undefined}>
      {state.status === 'ok' && state.message && (
        <p className="border border-primary-border bg-primary-light rounded-lg px-3 py-2 text-[13px] text-foreground mb-4">
          {state.message}
        </p>
      )}
      {state.status === 'error' && state.message && (
        <p className="border border-error rounded-lg px-3 py-2 text-[13px] text-error mb-4">{state.message}</p>
      )}
    </div>
  );
}

export default function AdminForm({
  action,
  id,
  title,
  titleLevel = 2,
  submitLabel,
  submitName,
  hidden = {},
  felder,
  reset = false,
}: {
  action: AdminAction;
  /** Eindeutiger Präfix für IDs im Formular */
  id: string;
  title?: string;
  titleLevel?: 2 | 3;
  submitLabel: string;
  /** Zugänglicher Name, wenn mehrere gleiche Buttons auf der Seite stehen; beginnt mit dem sichtbaren Text */
  submitName?: string;
  hidden?: Record<string, string>;
  felder: Feld[];
  /** Felder nach Erfolg leeren (Hinzufügen-Formulare) */
  reset?: boolean;
}) {
  const [state, dispatch, pending] = useActionState(action, { status: 'idle' });
  const form = useRef<HTMLFormElement>(null);

  const dialog = useAdminDialog();

  useEffect(() => {
    // Im Dialog: nach Erfolg schließen, die Meldung steht neben dem Button (admin-aufbau.md AK-8)
    if (state.status === 'ok' && dialog) dialog.schliessen(state.message);
    if (state.status === 'ok' && reset) form.current?.reset();
    if (state.status === 'error' && state.errors) {
      const first = Object.keys(state.errors)[0];
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }, [state, reset, dialog]);

  // Kein automatisches Zurücksetzen durch React: Eingaben bleiben bei Fehlern stehen
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Kritiker Aufbau 2: kein doppeltes Absenden
    if (pending) return;
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
  const errors = state.status === 'error' ? (state.errors ?? {}) : {};
  const Heading = titleLevel === 2 ? 'h2' : 'h3';

  return (
    <form ref={form} onSubmit={submit} noValidate aria-labelledby={title ? `${id}-titel` : undefined}>
      {title && (
        <Heading
          id={`${id}-titel`}
          className={titleLevel === 2 ? 'text-[20px] font-bold mb-4' : 'text-[16px] font-bold mb-3'}
        >
          {title}
        </Heading>
      )}
      <Meldung state={state} />
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 mb-5">
        {felder.map((f) => {
          // Kritiker Dashboard 3: eigener Präfix, damit Feld-IDs nicht mit der Überschrift kollidieren
          const fid = `${id}-feld-${f.name}`;
          const marker = f.required ? '(Pflicht)' : undefined;
          const span = f.half ? '' : 'sm:col-span-2';
          if (f.type === 'select')
            return (
              <SelectField
                key={f.name}
                id={fid}
                name={f.name}
                label={f.label}
                marker={marker}
                hint={f.hint}
                error={errors[f.name]}
                options={f.options ?? []}
                defaultValue={f.defaultValue}
                className={span}
              />
            );
          if (f.type === 'checkboxes')
            return (
              <fieldset key={f.name} className={span} aria-describedby={f.hint ? `${fid}-hinweis` : undefined}>
                <legend className={labelClass}>{f.label}</legend>
                {f.hint && (
                  <p id={`${fid}-hinweis`} className="text-[12px] text-text2 mb-2">
                    {f.hint}
                  </p>
                )}
                <div className="flex flex-col gap-1">
                  {(f.options ?? []).map((o) => (
                    <label key={o.value} className="flex items-center gap-3 min-h-11 text-[14px] cursor-pointer">
                      <input
                        type="checkbox"
                        name={f.name}
                        value={o.value}
                        defaultChecked={f.checked?.includes(o.value)}
                        className="w-6 h-6 accent-[hsl(var(--primary))]"
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          return (
            <TextField
              key={f.name}
              id={fid}
              name={f.name}
              label={f.label}
              marker={marker}
              hint={f.hint}
              error={errors[f.name]}
              defaultValue={f.defaultValue}
              autoComplete={f.autoComplete ?? 'off'}
              className={span}
              {...(f.type === 'textarea'
                ? { multiline: true as const, rows: 3 }
                : { type: f.type ?? 'text', required: f.required })}
            />
          );
        })}
      </div>
      <Button type="submit" aria-label={submitName} aria-disabled={pending || undefined}>
        {submitLabel}
      </Button>
    </form>
  );
}
