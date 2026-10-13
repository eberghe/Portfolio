'use client';

import { useId } from 'react';
import { buttonClass } from '@/components/ui/Button';
import { DialogFenster, DialogFuss, DialogInhalt, type useDialogSteuerung } from './AdminDialog';

// Eigene Rückfrage vor dem Löschen oder Entfernen statt window.confirm
// (functions/kundenbereich/admin-bearbeiten.md Verhalten 2, AK-2, AK-6)

export interface RueckfrageText {
  /** Überschrift, z. B. „Projekt löschen?“ */
  titel: string;
  /** Was dabei verloren geht */
  text: string;
  /** Roter Button, z. B. „Projekt löschen“ */
  knopf: string;
  /** false: kein Löschen, der Button ist die normale Hauptaktion, z. B. „Freigeben“ (angebote.md Verhalten 4) */
  gefahr?: boolean;
}

export default function Rueckfrage({
  text,
  steuerung,
  onJa,
}: {
  text: RueckfrageText;
  steuerung: ReturnType<typeof useDialogSteuerung>;
  onJa: () => void;
}) {
  const id = useId();
  return (
    <DialogFenster title={text.titel} beschreibung={id} steuerung={steuerung}>
      <DialogInhalt>
        <p id={id} className="text-[15px] leading-relaxed">
          {text.text}
        </p>
      </DialogInhalt>
      <DialogFuss abbrechenStart>
        <button
          type="button"
          className={buttonClass(text.gefahr === false ? 'primary' : 'gefahr', 'max-sm:flex-1 max-sm:px-3')}
          onClick={onJa}
        >
          {text.knopf}
        </button>
      </DialogFuss>
    </DialogFenster>
  );
}
