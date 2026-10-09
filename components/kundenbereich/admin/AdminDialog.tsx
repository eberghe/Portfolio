'use client';

import { X } from 'lucide-react';
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { buttonClass } from '@/components/ui/Button';

// Formular hinter einem Button in einem modalen Dialog (functions/kundenbereich/admin-aufbau.md Verhalten 7, AK-8)

type DialogApi = { schliessen: (meldung?: string) => void };
const DialogContext = createContext<DialogApi | null>(null);

/** Formulare im Dialog schließen ihn nach Erfolg */
export const useAdminDialog = () => useContext(DialogContext);

export default function AdminDialog({
  label,
  title,
  name,
  icon,
  variant = 'secondary',
  children,
}: {
  /** Sichtbarer Text des Buttons */
  label: string;
  /** Überschrift und Name des Dialogs, Standard: label */
  title?: string;
  /** Zugänglicher Name des Buttons, beginnt mit dem sichtbaren Text, z. B. „Bearbeiten: Design“ */
  name?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}) {
  const [offen, setOffen] = useState(false);
  const [meldung, setMeldung] = useState('');
  const knopf = useRef<HTMLButtonElement>(null);
  const heading = title ?? label;

  const schliessen = (m?: string) => {
    setOffen(false);
    setMeldung(m ?? '');
    // Der Dialog wird entfernt; der Fokus geht zurück auf den Auslöser (AK-8)
    requestAnimationFrame(() => knopf.current?.focus());
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      <button
        ref={knopf}
        type="button"
        className={buttonClass(variant)}
        aria-haspopup="dialog"
        aria-label={name}
        onClick={() => {
          setMeldung('');
          setOffen(true);
        }}
      >
        {icon}
        {label}
      </button>
      <span aria-live="polite" className="text-[13px] text-text2 empty:hidden">
        {meldung}
      </span>
      {offen && (
        <DialogContext.Provider value={{ schliessen }}>
          <Fenster title={heading} onClose={() => schliessen()}>
            {children}
          </Fenster>
        </DialogContext.Provider>
      )}
    </span>
  );
}

function Fenster({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    // Fokus auf das erste Feld, sonst auf „Schließen“
    const erstes = dialog.querySelector<HTMLElement>(
      'input:not([type="hidden"]), select, textarea, [data-dialog-start]',
    );
    (erstes ?? dialog.querySelector<HTMLElement>('[data-dialog-schliessen]'))?.focus();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-modal="true"
      aria-labelledby={titleId}
      // Escape: Browser schließt den Dialog, wir räumen auf
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // Klick auf die abgedunkelte Fläche trifft das <dialog> selbst
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="admin-dialog m-auto w-[calc(100%-2rem)] max-w-[640px] max-h-[calc(100svh-2rem)] overflow-hidden rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 sm:px-6">
        <h2 id={titleId} className="text-[18px] font-bold break-words min-w-0">
          {title}
        </h2>
        <button
          type="button"
          data-dialog-schliessen
          onClick={onClose}
          aria-label="Schließen"
          className="shrink-0 w-11 h-11 -mr-2 rounded-full flex items-center justify-center text-text2 hover:text-foreground hover:bg-bg2"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="max-h-[calc(100svh-2rem-70px)] overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
        {children}
      </div>
    </dialog>
  );
}
