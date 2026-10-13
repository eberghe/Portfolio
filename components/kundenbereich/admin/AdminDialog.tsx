'use client';

import { X } from 'lucide-react';
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react';
import { buttonClass, iconButtonClass } from '@/components/ui/Button';

// Formular hinter einem Button in einem modalen Dialog (functions/kundenbereich/admin-aufbau.md Verhalten 7, AK-8)

/**
 * Meldung in der Live-Region der Verwaltung; im Rahmen der Verwaltung zugleich ein kurzer sichtbarer Hinweis
 * (admin-sidebar.md AK-7), der nach einigen Sekunden verschwindet.
 */
const meldungsTimer: Record<string, ReturnType<typeof setTimeout> | undefined> = {};
/** `fehler`: eigene Meldung mit role="alert" (admin-sidebar.md AK-13) */
export function melden(text: string, fehler = false) {
  const id = fehler ? 'admin-fehler' : 'admin-meldung';
  const ziel = document.getElementById(id);
  if (!ziel) return;
  ziel.textContent = '';
  clearTimeout(meldungsTimer[id]);
  requestAnimationFrame(() => {
    ziel.textContent = text;
    meldungsTimer[id] = setTimeout(() => (ziel.textContent = ''), fehler ? 8000 : 5000);
  });
}

/**
 * Fokus nach dem Löschen (Kritiker Bearbeiten 5): Mit `pfad` nach der Weiterleitung auf die Überschrift der neuen
 * Seite, sonst auf die Überschrift der Karte, sobald der gelöschte Eintrag weg ist, ohne Karte auf das h1.
 */
export function titelFokussieren(ausloeser: HTMLElement | null, pfad?: string) {
  const karte = ausloeser?.closest('section') ?? null;
  const bis = Date.now() + 8000;
  const pruefen = () => {
    const fertig = pfad ? window.location.pathname === pfad : !ausloeser?.isConnected;
    if (!fertig) {
      if (Date.now() < bis) setTimeout(pruefen, 50);
      return;
    }
    const ziel =
      (!pfad && karte?.isConnected ? karte.querySelector<HTMLElement>('h2') : null) ??
      document.querySelector<HTMLElement>('main h1');
    if (!ziel) return;
    ziel.tabIndex = -1;
    ziel.focus();
  };
  pruefen();
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
  nurIcon = false,
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
  /** Nur das Icon zeigen, z. B. in Listenzeilen; `name` ist dann Name und Tooltip (AK-14) */
  nurIcon?: boolean;
  children: ReactNode;
}) {
  const [meldung, setMeldung] = useState('');
  const knopf = useRef<HTMLButtonElement>(null);
  const heading = title ?? label;
  const steuerung = useDialogSteuerung(knopf, undefined, setMeldung);

  return (
    <span className="inline-flex flex-wrap items-center gap-y-1">
      <button
        ref={knopf}
        type="button"
        className={nurIcon ? iconButtonClass : buttonClass(variant)}
        aria-haspopup="dialog"
        aria-label={nurIcon ? (name ?? label) : name}
        title={nurIcon ? (name ?? label) : undefined}
        onClick={() => {
          setMeldung('');
          steuerung.oeffnen();
        }}
      >
        {icon}
        {!nurIcon && label}
      </button>
      {/* Kritiker Aufbau 4: Live-Region bleibt im Baum, auch leer; Abstand nur mit Text, sonst bricht der Kopf um */}
      <span aria-live="polite" className="text-[13px] text-text2 [&:not(:empty)]:ml-3">
        {meldung}
      </span>
      {steuerung.offen && (
        <DialogFenster title={heading} steuerung={steuerung}>
          {children}
        </DialogFenster>
      )}
    </span>
  );
}

type Steuerung = ReturnType<typeof useDialogSteuerung>;

/**
 * Öffnen und Schließen eines Dialogs mit Fokus-Rückgabe an den Auslöser (AK-8). `inline` zeigt die Meldung
 * neben dem Auslöser; ohne sie geht die Meldung an die Live-Region der Verwaltung, z. B. bei ⋯-Menüs.
 */
export function useDialogSteuerung(
  knopf: RefObject<HTMLElement | null>,
  nachSchliessen?: () => void,
  inline?: (meldung: string) => void,
) {
  const [offen, setOffen] = useState(false);
  const schliessen = (m?: string) => {
    const karte = knopf.current?.closest('section');
    setOffen(false);
    inline?.(m ?? '');
    nachSchliessen?.();
    // Der Dialog wird entfernt; der Fokus geht zurück auf den Auslöser (AK-8). Nach einer Server Action kann
    // das Schließen einige Frames dauern; solange der modale Dialog offen ist, nimmt der Auslöser keinen Fokus.
    let versuche = 0;
    const zurueck = () => {
      const k = knopf.current;
      if (!k?.isConnected) return;
      k.focus();
      if (document.activeElement !== k && ++versuche < 60) requestAnimationFrame(zurueck);
    };
    requestAnimationFrame(() => {
      if (knopf.current?.isConnected) {
        if (m && !inline) melden(m);
        zurueck();
        return;
      }
      // Kritiker Aufbau 3: Auslöser ist mit dem Eintrag verschwunden, z. B. nach „Entfernen“
      if (m) melden(m);
      const ziel = karte?.isConnected ? karte.querySelector<HTMLElement>('h2') : null;
      if (ziel) {
        ziel.tabIndex = -1;
        ziel.focus();
      }
    });
  };
  return { offen, oeffnen: () => setOffen(true), schliessen };
}

/** Modaler Dialog mit Kontext für Formulare (schließen nach Erfolg) */
export function DialogFenster({
  title,
  beschreibung,
  steuerung,
  children,
}: {
  title: string;
  /** ID des Textes, der den Dialog beschreibt (aria-describedby) */
  beschreibung?: string;
  steuerung: Steuerung;
  children: ReactNode;
}) {
  return (
    <DialogContext.Provider value={{ schliessen: steuerung.schliessen }}>
      <Fenster title={title} beschreibung={beschreibung} onClose={() => steuerung.schliessen()}>
        {children}
      </Fenster>
    </DialogContext.Provider>
  );
}

function Fenster({
  title,
  beschreibung,
  onClose,
  children,
}: {
  title: string;
  beschreibung?: string;
  onClose: () => void;
  children: ReactNode;
}) {
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
      // Kritiker Bearbeiten 6: Rückfragen sagen ihren Text beim Öffnen mit an
      aria-describedby={beschreibung}
      // Escape: Browser schließt den Dialog, wir räumen auf
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // Kritiker Dialoge 4: Klick daneben schließt nicht mehr, Eingaben gehen sonst verloren (AK-18)
      // Kritiker Aufbau 5: Kopf fest, Inhalt scrollt, auch wenn der Titel umbricht
      // Kritiker Bearbeiten 7: linksbündig, auch wenn der Auslöser in einer rechtsbündigen Tabellenzelle steht
      className="admin-dialog text-left m-auto w-[calc(100%-2rem)] max-w-[640px] max-h-[calc(100svh-2rem)] overflow-hidden flex-col open:flex rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl"
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
      {/* Inhalt und Fuß kommen vom Formular: DialogInhalt scrollt, DialogFuss bleibt unten (AK-10) */}
      {children}
    </dialog>
  );
}

/** Scrollbereich des Dialogs zwischen Kopf und Fuß */
export function DialogInhalt({ children }: { children: ReactNode }) {
  return (
    <div data-dialog-inhalt className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
      {children}
    </div>
  );
}

/**
 * Fester Fuß des Dialogs (admin-aufbau.md Verhalten 9, AK-10, AK-11): links außen eine zerstörende Aktion,
 * rechts „Abbrechen“ und als letzter Button die Hauptaktion (`children`).
 */
export function DialogFuss({
  links,
  abbrechenStart = false,
  children,
}: {
  links?: ReactNode;
  /** Fokus startet auf „Abbrechen“, z. B. bei Rückfragen (admin-bearbeiten.md AK-2) */
  abbrechenStart?: boolean;
  children: ReactNode;
}) {
  const dialog = useAdminDialog();
  return (
    <div
      data-dialog-fuss
      className="shrink-0 flex flex-wrap items-stretch justify-end gap-2 border-t border-border px-5 py-3 sm:px-6"
    >
      {links && <div className="flex flex-wrap items-center gap-2 basis-full sm:basis-auto sm:mr-auto">{links}</div>}
      <button
        type="button"
        className={buttonClass('secondary', 'max-sm:flex-1 max-sm:px-3')}
        data-dialog-start={abbrechenStart || undefined}
        onClick={() => dialog?.schliessen()}
      >
        Abbrechen
      </button>
      {children}
    </div>
  );
}
