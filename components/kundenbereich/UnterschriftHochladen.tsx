'use client';

import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useRef, useState, type FormEvent } from 'react';
import { unterschriftEintragen, unterschriftVorbereiten } from '@/app/actions/kundenbereich';
import Button, { buttonClass } from '@/components/ui/Button';
import { labelClass } from '@/components/ui/TextField';
import type { Locale } from '@/lib/i18n';
import { kundenText } from '@/lib/kundenbereich/text';
import { UNTERSCHRIFT_TYPEN, type UnterschriftState } from '@/lib/kundenbereich/unterschrift';

// Unterschriebenes Angebot hochladen: Formular klappt unter dem Button auf, Upload direkt in Supabase Storage
// (functions/kundenbereich/angebot-unterschrift.md Verhalten 2 und 3)

export default function UnterschriftHochladen({
  locale,
  dokument,
  titel,
}: {
  locale: Locale;
  /** ID des Angebots-Dokuments */
  dokument: string;
  titel: string;
}) {
  const t = kundenText[locale];
  const [offen, setOffen] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [state, setState] = useState<UnterschriftState>({ status: 'idle' });
  const sperre = useRef(false);
  const datei = useRef<HTMLInputElement>(null);
  const danke = useRef<HTMLParagraphElement>(null);
  const router = useRouter();
  const id = useId();
  const fertig = state.status === 'ok' && !!state.message;
  const feldFehler = state.status === 'error' && state.feld ? state.message : null;

  async function senden(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sperre.current) return;
    const file = datei.current?.files?.[0];
    if (!file) {
      setState({ status: 'error', message: t.uploadMissing, feld: true });
      datei.current?.focus();
      return;
    }
    sperre.current = true;
    setLaeuft(true);
    const fd = new FormData();
    fd.set('sprache', locale);
    fd.set('dokument', dokument);
    try {
      fd.set('name', file.name);
      fd.set('type', file.type);
      fd.set('size', String(file.size));
      const vor = await unterschriftVorbereiten({ status: 'idle' }, fd);
      if (vor.status !== 'ok' || !vor.upload) {
        setState(vor);
        if (vor.status === 'error' && vor.feld) datei.current?.focus();
        return;
      }
      const res = await fetch(vor.upload.url, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
      if (!res.ok) {
        setState({ status: 'error', message: t.uploadError });
        return;
      }
      const ein = new FormData();
      ein.set('sprache', locale);
      ein.set('dokument', dokument);
      ein.set('pfad', vor.upload.pfad);
      ein.set('dateiname', file.name);
      const r = await unterschriftEintragen({ status: 'idle' }, ein);
      setState(r);
      if (r.status === 'ok') {
        setOffen(false);
        router.refresh();
        requestAnimationFrame(() => danke.current?.focus());
      }
    } catch {
      setState({ status: 'error', message: t.uploadError });
    } finally {
      sperre.current = false;
      setLaeuft(false);
    }
  }

  return (
    <div className="mt-2">
      <div role="status">
        {fertig && (
          <p
            ref={danke}
            tabIndex={-1}
            className="rounded-lg border border-primary-border bg-primary-light px-3 py-2 text-[13px] text-foreground"
          >
            {state.message}
          </p>
        )}
      </div>
      {!fertig && (
        <button
          type="button"
          className={buttonClass('secondary', 'max-sm:w-full')}
          aria-expanded={offen}
          aria-controls={offen ? `${id}-form` : undefined}
          aria-label={`${t.uploadSigned}: ${titel}`}
          onClick={() => {
            setOffen((o) => !o);
            setState({ status: 'idle' });
          }}
        >
          <Upload size={15} aria-hidden="true" />
          {t.uploadSigned}
        </button>
      )}
      {offen && (
        <form id={`${id}-form`} onSubmit={senden} noValidate className="mt-3 rounded-xl border border-border p-4">
          {state.status === 'error' && !state.feld && (
            <p role="alert" className="border border-error rounded-lg px-3 py-2 text-[13px] text-error mb-3">
              {state.message}
            </p>
          )}
          <label htmlFor={`${id}-datei`} className={labelClass}>
            {t.uploadFile}
          </label>
          <p id={`${id}-hinweis`} className="text-[12px] text-text2 mb-2">
            {t.uploadHint}
          </p>
          <input
            ref={datei}
            id={`${id}-datei`}
            type="file"
            name="datei"
            accept={Object.keys(UNTERSCHRIFT_TYPEN).join(',')}
            aria-invalid={feldFehler ? true : undefined}
            aria-describedby={[`${id}-hinweis`, feldFehler ? `${id}-fehler` : null].filter(Boolean).join(' ')}
            className="block w-full text-[13px] file:mr-3 file:min-h-11 file:rounded-lg file:border file:border-border file:bg-bg2 file:px-3 file:text-foreground"
          />
          {feldFehler && (
            <p id={`${id}-fehler`} className="text-[12px] text-error mt-1.5">
              {feldFehler}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button type="submit" aria-disabled={laeuft || undefined} className="max-sm:flex-1">
              {laeuft ? t.uploading : t.uploadSubmit}
            </Button>
            <button
              type="button"
              className={buttonClass('secondary', 'max-sm:flex-1')}
              onClick={() => {
                setOffen(false);
                setState({ status: 'idle' });
              }}
            >
              {t.uploadCancel}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
