'use client';

import { GripVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { startTransition, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import {
  schrittEntfernen,
  schrittSpeichern,
  schrittStatus,
  schritteSortieren,
} from '@/app/actions/kundenbereich-admin';
import { optionLabel, SCHRITT_STATUS_OPTIONEN, VERANTWORTLICH_OPTIONEN } from '@/lib/kundenbereich/admin/texte';
import { datum } from '@/lib/kundenbereich/projekte';
import AktionenMenue from './AktionenMenue';
import { melden } from './AdminDialog';
import AdminForm, { abgesichert } from './AdminForm';
import { schrittFelder, type Schritt } from './schrittFelder';

// Ablauf eines Projekts: Schritte per Ziehen am Griff oder per „Nach oben/unten“ sortieren, Aktionen im ⋯-Menü
// (functions/kundenbereich/admin-bearbeiten.md Verhalten 5 bis 7, AK-7, AK-8)

const verschieben = <T,>(liste: T[], von: number, nach: number) => {
  const neu = [...liste];
  const [x] = neu.splice(von, 1);
  neu.splice(nach, 0, x!);
  return neu;
};

export default function AblaufListe({ projektId, schritte }: { projektId: string; schritte: Schritt[] }) {
  const router = useRouter();
  const [reihe, setReihe] = useState(() => schritte.map((s) => s.id));
  const [zieht, setZieht] = useState<string | null>(null);
  const start = useRef<string[]>([]);
  const zeilen = useRef(new Map<string, HTMLLIElement>());
  const griffe = useRef(new Map<string, HTMLButtonElement>());
  const nachId = new Map(schritte.map((s) => [s.id, s]));
  const liste = reihe.map((id) => nachId.get(id)).filter((s): s is Schritt => !!s);

  /** Kritiker Bearbeiten 8: neue Position ansagen, nicht nur „gespeichert“ */
  const positionText = (id: string, ids: string[]) =>
    `${nachId.get(id)?.titel_de ?? 'Schritt'} jetzt an Position ${ids.indexOf(id) + 1} von ${ids.length}.`;

  const speichern = (ids: string[], vorher: string[], bewegt: string) => {
    const fd = new FormData();
    fd.set('projekt_id', projektId);
    fd.set('ids', JSON.stringify(ids));
    startTransition(async () => {
      const state = await abgesichert(schritteSortieren)({ status: 'idle' }, fd);
      if (state.status === 'ok') {
        melden(positionText(bewegt, ids));
        router.refresh();
      } else if (state.status === 'error') {
        setReihe(vorher);
        melden(['Reihenfolge konnte nicht gespeichert werden.', state.message].filter(Boolean).join(' '), true);
      }
    });
  };

  /** `fokus`: danach auf den Griff (Pfeiltasten) oder zurück aufs ⋯-Menü (Kritiker Bearbeiten 9) */
  const bewegen = (id: string, um: number, fokus: 'griff' | 'menue' = 'griff') => {
    const i = reihe.indexOf(id);
    const ziel = i + um;
    if (i < 0 || ziel < 0 || ziel >= reihe.length) return;
    const neu = verschieben(reihe, i, ziel);
    setReihe(neu);
    speichern(neu, reihe, id);
    requestAnimationFrame(() =>
      (fokus === 'griff'
        ? griffe.current.get(id)
        : zeilen.current.get(id)?.querySelector<HTMLElement>('[aria-haspopup="menu"]')
      )?.focus(),
    );
  };

  // Ziehen mit Maus, Finger oder Stift über Pointer Events (AK-7). Die Bewegung hört am Fenster zu: Beim
  // Umsortieren verschiebt React die Zeile im DOM, dabei ginge ein Pointer Capture am Griff verloren.
  const aktuell = useRef<string[]>([]);
  const runter = (e: PointerEvent<HTMLButtonElement>, id: string) => {
    if (e.button !== 0) return;
    e.preventDefault();
    start.current = reihe;
    aktuell.current = reihe;
    setZieht(id);
  };
  useEffect(() => {
    if (!zieht) return;
    const ziehen = (e: globalThis.PointerEvent) => {
      const r = aktuell.current;
      const ziel = r
        .filter((x) => x !== zieht)
        .filter((x) => {
          const box = zeilen.current.get(x)?.getBoundingClientRect();
          return box ? box.top + box.height / 2 < e.clientY : false;
        }).length;
      if (r.indexOf(zieht) !== ziel) {
        aktuell.current = verschieben(r, r.indexOf(zieht), ziel);
        setReihe(aktuell.current);
      }
    };
    const los = () => {
      setZieht(null);
      if (start.current.join() !== aktuell.current.join()) speichern(aktuell.current, start.current, zieht);
      griffe.current.get(zieht)?.focus();
    };
    window.addEventListener('pointermove', ziehen);
    window.addEventListener('pointerup', los);
    window.addEventListener('pointercancel', los);
    return () => {
      window.removeEventListener('pointermove', ziehen);
      window.removeEventListener('pointerup', los);
      window.removeEventListener('pointercancel', los);
    };
    // speichern hängt nur an Props, die sich während des Ziehens nicht ändern
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zieht]);
  const taste = (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      bewegen(id, e.key === 'ArrowUp' ? -1 : 1);
    }
  };

  if (liste.length === 0) return <p className="text-[15px] text-text2">Noch keine Schritte.</p>;

  return (
    <>
      <ol role="list" className="flex flex-col">
        {liste.map((s, i) => (
          <li
            key={s.id}
            ref={(el) => {
              if (el) zeilen.current.set(s.id, el);
              else zeilen.current.delete(s.id);
            }}
            data-zieht={zieht === s.id || undefined}
            className="flex items-center gap-2 py-3 border-t border-border first:border-0 first:pt-0 rounded-lg data-[zieht]:bg-bg2 data-[zieht]:shadow-lg data-[zieht]:relative data-[zieht]:z-10"
          >
            <button
              ref={(el) => {
                if (el) griffe.current.set(s.id, el);
                else griffe.current.delete(s.id);
              }}
              type="button"
              aria-label={`Ziehen zum Sortieren: ${s.titel_de}`}
              aria-describedby="ablauf-griff-hilfe"
              title="Ziehen zum Sortieren"
              onPointerDown={(e) => runter(e, s.id)}
              onKeyDown={(e) => taste(e, s.id)}
              className="shrink-0 -ml-2 w-11 h-11 flex items-center justify-center rounded-lg text-text3 hover:text-foreground hover:bg-bg2 cursor-grab active:cursor-grabbing touch-none"
            >
              <GripVertical size={18} aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[15px] break-words">
                {i + 1}. {s.titel_de}
              </p>
              <p className="text-[13px] text-text2">
                {optionLabel(SCHRITT_STATUS_OPTIONEN, s.status)} ·{' '}
                {optionLabel(VERANTWORTLICH_OPTIONEN, s.verantwortlich)}
                {s.faellig_am && ` · fällig ${datum(s.faellig_am, 'de')}`}
              </p>
            </div>
            <AktionenMenue
              name={`Schritt ${s.titel_de}`}
              status={{ aktion: schrittStatus, id: s.id, wert: s.status, optionen: SCHRITT_STATUS_OPTIONEN }}
              eintraege={[
                {
                  art: 'dialog',
                  label: 'Bearbeiten',
                  titel: `Ablaufschritt bearbeiten: ${s.titel_de}`,
                  inhalt: (
                    <AdminForm
                      id={`schritt-${s.id}`}
                      action={schrittSpeichern}
                      submitLabel="Schritt speichern"
                      // Die Reihenfolge ändert sich per Ziehen, nicht im Formular
                      hidden={{ id: s.id, reihenfolge: String(i + 1) }}
                      felder={schrittFelder(s).filter((f) => f.name !== 'reihenfolge')}
                    />
                  ),
                },
                ...(i > 0
                  ? [{ art: 'klick' as const, label: 'Nach oben', onSelect: () => bewegen(s.id, -1, 'menue') }]
                  : []),
                ...(i < liste.length - 1
                  ? [{ art: 'klick' as const, label: 'Nach unten', onSelect: () => bewegen(s.id, 1, 'menue') }]
                  : []),
                {
                  art: 'aktion',
                  label: 'Entfernen',
                  aktion: schrittEntfernen,
                  hidden: { id: s.id },
                  bestaetigen: {
                    titel: 'Schritt entfernen?',
                    text: `„${s.titel_de}“ verschwindet aus dem Ablauf, auch für den Kunden.`,
                    knopf: 'Schritt entfernen',
                  },
                  gefahr: true,
                },
              ]}
            />
          </li>
        ))}
      </ol>
      <p id="ablauf-griff-hilfe" hidden>
        Mit Pfeil hoch und runter verschieben, oder im Menü „Nach oben“ und „Nach unten“ wählen.
      </p>
    </>
  );
}
