'use client';

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
  return (
    <DialogFenster title={text.titel} steuerung={steuerung}>
      <DialogInhalt>
        <p className="text-[15px] leading-relaxed">{text.text}</p>
      </DialogInhalt>
      <DialogFuss abbrechenStart>
        <button type="button" className={buttonClass('gefahr', 'max-sm:flex-1 max-sm:px-3')} onClick={onJa}>
          {text.knopf}
        </button>
      </DialogFuss>
    </DialogFenster>
  );
}
