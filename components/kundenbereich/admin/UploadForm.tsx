'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';
import Button from '@/components/ui/Button';
import SelectField from '@/components/ui/SelectField';
import TextField from '@/components/ui/TextField';
import type { AdminState } from '@/lib/kundenbereich/admin/aktionen';
import { useAdminDialog } from './AdminDialog';
import { Meldung, type AdminAction } from './AdminForm';

// Upload in drei Schritten: Server prüft und gibt einen signierten Upload-Link, der Browser lädt direkt
// in Supabase Storage, der Server trägt die Datei ein (functions/kundenbereich/admin.md, Grundsätze)

export default function UploadForm({
  id,
  title,
  prepare,
  finish,
  hidden,
  accept,
  hint,
  submitLabel,
  meta = false,
  arten = [],
}: {
  id: string;
  /** Überschrift; im Dialog trägt der Dialog den Titel */
  title?: string;
  prepare: AdminAction;
  finish: AdminAction;
  hidden: Record<string, string>;
  accept: string;
  hint: string;
  submitLabel: string;
  /** Art und Titel abfragen (Dokumente) */
  meta?: boolean;
  arten?: { value: string; label: string }[];
}) {
  const [state, setState] = useState<AdminState>({ status: 'idle' });
  const [pending, setPending] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const dialog = useAdminDialog();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = e.currentTarget;
    const file = (el.elements.namedItem('datei') as HTMLInputElement).files?.[0];
    if (!file) {
      setState({
        status: 'error',
        message: 'Bitte prüf die markierten Felder.',
        errors: { datei: 'Bitte wähle eine Datei.' },
      });
      el.querySelector<HTMLElement>('[name="datei"]')?.focus();
      return;
    }
    setPending(true);
    const fd = new FormData(el);
    fd.delete('datei');
    fd.set('name', file.name);
    fd.set('type', file.type);
    fd.set('size', String(file.size));
    try {
      const vorbereitet = await prepare({ status: 'idle' }, fd);
      if (vorbereitet.status !== 'ok' || !vorbereitet.upload) {
        setState(vorbereitet);
        return;
      }
      const res = await fetch(vorbereitet.upload.url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!res.ok) {
        setState({
          status: 'error',
          message: 'Die Datei konnte nicht hochgeladen werden. Bitte versuch es noch einmal.',
        });
        return;
      }
      fd.set('pfad', vorbereitet.upload.pfad);
      fd.set('dateiname', file.name);
      const fertig = await finish({ status: 'idle' }, fd);
      setState(fertig);
      if (fertig.status === 'ok') {
        form.current?.reset();
        router.refresh();
        dialog?.schliessen(fertig.message);
      }
    } catch {
      setState({ status: 'error', message: 'Das hat nicht geklappt. Bitte versuch es noch einmal.' });
    } finally {
      setPending(false);
    }
  }

  const errors = state.status === 'error' ? (state.errors ?? {}) : {};
  return (
    <form ref={form} onSubmit={submit} noValidate aria-labelledby={title ? `${id}-titel` : undefined}>
      {title && (
        <h3 id={`${id}-titel`} className="text-[16px] font-bold mb-3">
          {title}
        </h3>
      )}
      <Meldung state={state} />
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {meta && (
          <>
            <SelectField id={`${id}-art`} name="art" label="Art" options={arten} error={errors.art} />
            <TextField
              id={`${id}-titel-feld`}
              name="titel"
              label="Titel"
              marker="(Pflicht)"
              error={errors.titel}
              autoComplete="off"
            />
          </>
        )}
        <TextField
          id={`${id}-datei`}
          name="datei"
          type="file"
          label="Datei"
          marker="(Pflicht)"
          hint={hint}
          accept={accept}
          error={errors.datei}
          className="sm:col-span-2"
          inputClassName="file:mr-3 file:border-0 file:bg-transparent file:font-medium file:text-foreground"
        />
      </div>
      <Button type="submit" aria-disabled={pending || undefined}>
        {pending ? 'Wird hochgeladen …' : submitLabel}
      </Button>
    </form>
  );
}
