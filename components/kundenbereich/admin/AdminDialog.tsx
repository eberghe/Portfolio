'use client';

import { X } from 'lucide-react';
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { buttonClass } from '@/components/ui/Button';

// Formular hinter einem Button in einem modalen Dialog (functions/kundenbereich/admin-aufbau.md Verhalten 7, AK-8)

/** Meldung in der Live-Region der Verwaltung (AdminShell), wenn der eigene Platz verschwunden ist */
export function melden(text: string) {
  const ziel = document.getElementById('admin-meldung');
  if (!ziel) return;
  ziel.textContent = '';
  requestAnimationFrame(() => (ziel.textContent = text));
}

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
    const karte = knopf.current?.closest('section');
    setOffen(false);
    setMeldung(m ?? '');
    // Der Dialog wird entfernt; der Fokus geht zurück auf den Auslöser (AK-8)
    requestAnimationFrame(() => {
      if (knopf.current?.isConnected) return knopf.current.focus();
      // Kritiker Aufbau 3: Auslöser ist mit dem Eintrag verschwunden, z. B. nach „Entfernen“
      if (m) melden(m);
      const ziel = karte?.isConnected ? karte.querySelector<HTMLElement>('h2') : null;
      if (ziel) {
        ziel.tabIndex = -1;
        ziel.focus();
      }
    });
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
      {/* Kritiker Aufbau 4: Live-Region bleibt im Baum, auch leer */}
      <span aria-live="polite" className="text-[13px] text-text2">
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
  const druck = useRef(false);
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
      // Kritiker Aufbau Rand: nur schließen, wenn Druck und Loslassen auf der Fläche liegen (Text markieren)
      onMouseDown={(e) => {
        druck.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (druck.current && e.target === e.currentTarget) onClose();
        druck.current = false;
      }}
      // Kritiker Aufbau 5: Kopf fest, Inhalt scrollt, auch wenn der Titel umbricht
      className="admin-dialog m-auto w-[calc(100%-2rem)] max-w-[640px] max-h-[calc(100svh-2rem)] overflow-hidden flex-col open:flex rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl"
    >
      <div className="shrink-0 flex items-center justify-between gap-4 border-b border-border px-5 py-3 sm:px-6">
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
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">{children}</div>
    </dialog>
  );
}
