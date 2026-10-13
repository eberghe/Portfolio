'use client';

import { Check, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { iconButtonClass } from '@/components/ui/Button';
import { DialogFenster, melden, useDialogSteuerung } from './AdminDialog';
import { abgesichert, type AdminAction } from './AdminForm';

// ⋯-Menü nach dem WAI-ARIA-Muster „Menu Button“ (functions/kundenbereich/admin-sidebar.md Verhalten 7, AK-7, AK-9)

export type MenueEintrag =
  | { art: 'link'; label: string; href: string; extern?: boolean }
  | { art: 'dialog'; label: string; titel?: string; inhalt: ReactNode }
  | {
      art: 'aktion';
      label: string;
      aktion: AdminAction;
      hidden: Record<string, string>;
      /** Rückfrage vor dem Ausführen */
      confirm?: string;
      gefahr?: boolean;
    };

export interface MenueStatus {
  aktion: AdminAction;
  id: string;
  wert: string;
  optionen: { value: string; label: string }[];
}

export default function AktionenMenue({
  name,
  status,
  eintraege = [],
}: {
  /** Name des Ziels, der Button heißt „Aktionen: <name>“ */
  name: string;
  status?: MenueStatus;
  eintraege?: MenueEintrag[];
}) {
  const [offen, setOffen] = useState(false);
  const [dialog, setDialog] = useState<Extract<MenueEintrag, { art: 'dialog' }> | null>(null);
  const knopf = useRef<HTMLButtonElement>(null);
  const menue = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const menueId = useId();
  const steuerung = useDialogSteuerung(knopf, () => setDialog(null));

  const punkte = () => Array.from(menue.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? []);
  const schliessen = (fokus = true) => {
    setOffen(false);
    if (fokus) requestAnimationFrame(() => knopf.current?.focus());
  };

  useEffect(() => {
    if (!offen) return;
    requestAnimationFrame(() => punkte()[0]?.focus());
    // Klick daneben schließt, ohne den Fokus zu verschieben
    const weg = (e: PointerEvent) => {
      if (!menue.current?.contains(e.target as Node) && !knopf.current?.contains(e.target as Node)) schliessen(false);
    };
    document.addEventListener('pointerdown', weg);
    return () => document.removeEventListener('pointerdown', weg);
  }, [offen]);

  const tasten = (e: KeyboardEvent<HTMLDivElement>) => {
    const liste = punkte();
    const i = liste.indexOf(document.activeElement as HTMLElement);
    const ziel = (n: number) => {
      e.preventDefault();
      liste[(n + liste.length) % liste.length]?.focus();
    };
    if (e.key === 'ArrowDown') ziel(i + 1);
    else if (e.key === 'ArrowUp') ziel(i - 1);
    else if (e.key === 'Home') ziel(0);
    else if (e.key === 'End') ziel(liste.length - 1);
    else if (e.key === 'Escape') {
      e.preventDefault();
      schliessen();
    } else if (e.key === 'Tab') schliessen(false);
  };

  const ausfuehren = (aktion: AdminAction, hidden: Record<string, string>, confirm?: string) => {
    schliessen();
    if (confirm && !window.confirm(confirm)) return;
    const fd = new FormData();
    for (const [k, v] of Object.entries(hidden)) fd.set(k, v);
    startTransition(async () => {
      const state = await abgesichert(aktion)({ status: 'idle' }, fd);
      // Ergebnis in der Live-Region der Verwaltung, sichtbar als Hinweis (admin-sidebar.md AK-7)
      if (state.status !== 'idle' && state.message) melden(state.message);
      if (state.status === 'ok') router.refresh();
    });
  };

  const punktKlasse = (gefahr = false) =>
    `flex w-full items-center gap-2 min-h-10 px-3 rounded-md text-left text-[14px] outline-none focus-visible:bg-bg2 hover:bg-bg2 ${
      gefahr ? 'text-error' : 'text-foreground'
    }`;

  return (
    <div className="relative inline-flex">
      <button
        ref={knopf}
        type="button"
        className={iconButtonClass}
        aria-label={`Aktionen: ${name}`}
        title={`Aktionen: ${name}`}
        aria-haspopup="menu"
        aria-expanded={offen}
        aria-controls={offen ? menueId : undefined}
        onClick={() => setOffen((o) => !o)}
      >
        <MoreHorizontal size={18} aria-hidden="true" />
      </button>
      {offen && (
        <div
          ref={menue}
          id={menueId}
          role="menu"
          aria-label={`Aktionen: ${name}`}
          onKeyDown={tasten}
          className="absolute right-0 top-full z-30 mt-1 w-56 rounded-xl border border-border bg-background p-1 shadow-xl"
        >
          {status && (
            <div role="group" aria-label="Status">
              <p
                aria-hidden="true"
                className="px-3 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-text3"
              >
                Status
              </p>
              {status.optionen.map((o) => {
                const aktiv = o.value === status.wert;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={aktiv}
                    tabIndex={-1}
                    className={punktKlasse()}
                    onClick={() =>
                      aktiv ? schliessen() : ausfuehren(status.aktion, { id: status.id, status: o.value })
                    }
                  >
                    <Check size={15} aria-hidden="true" className={aktiv ? 'text-primary-text' : 'invisible'} />
                    {o.label}
                  </button>
                );
              })}
              {eintraege.length > 0 && <div role="separator" className="my-1 h-px bg-border" />}
            </div>
          )}
          {eintraege.map((e) => {
            if (e.art === 'link')
              return (
                <Link
                  key={e.label}
                  href={e.href}
                  role="menuitem"
                  tabIndex={-1}
                  className={punktKlasse()}
                  onClick={() => schliessen(false)}
                  {...(e.extern ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {e.label}
                </Link>
              );
            if (e.art === 'dialog')
              return (
                <button
                  key={e.label}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  className={punktKlasse()}
                  onClick={() => {
                    setOffen(false);
                    setDialog(e);
                    steuerung.oeffnen();
                  }}
                >
                  {e.label}
                </button>
              );
            return (
              <button
                key={e.label}
                type="button"
                role="menuitem"
                tabIndex={-1}
                className={punktKlasse(e.gefahr)}
                onClick={() => ausfuehren(e.aktion, e.hidden, e.confirm)}
              >
                {e.label}
              </button>
            );
          })}
        </div>
      )}
      {dialog && steuerung.offen && (
        <DialogFenster title={dialog.titel ?? dialog.label} steuerung={steuerung}>
          {dialog.inhalt}
        </DialogFenster>
      )}
    </div>
  );
}
