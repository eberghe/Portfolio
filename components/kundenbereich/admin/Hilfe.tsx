'use client';

import { CircleHelp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Fragezeichen in der Ecke einer Karte mit kurzer Erklärung (functions/kundenbereich/admin-aufbau.md Verhalten 8, AK-3)
// Muster „Toggletip“: Button mit aria-expanded, Text in einem role="status", damit er angesagt wird

export default function Hilfe({
  titel,
  children,
  className = '',
}: {
  titel: string;
  children: string;
  className?: string;
}) {
  const [offen, setOffen] = useState(false);
  const box = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!offen) return;
    const weg = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOffen(false);
    };
    // Kritiker Aufbau 8: Escape auch außerhalb des Buttons
    const taste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOffen(false);
    };
    document.addEventListener('pointerdown', weg);
    document.addEventListener('keydown', taste);
    return () => {
      document.removeEventListener('pointerdown', weg);
      document.removeEventListener('keydown', taste);
    };
  }, [offen]);

  return (
    // Kritiker Aufbau 1: Blase richtet sich an der Karte aus (relative), nicht am Button, damit sie bei 320 px nicht abgeschnitten wird
    // Kritiker Aufbau 8: Fokus verlässt die Hilfe, die Blase schließt
    <span
      ref={box}
      className={`inline-flex ${className}`}
      onBlur={(e) => {
        if (!box.current?.contains(e.relatedTarget as Node | null)) setOffen(false);
      }}
    >
      <button
        type="button"
        aria-label={`Erklärung: ${titel}`}
        aria-expanded={offen}
        onClick={() => setOffen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && offen) {
            e.stopPropagation();
            setOffen(false);
          }
        }}
        className="w-11 h-11 -m-2.5 rounded-full flex items-center justify-center text-text3 hover:text-foreground hover:bg-bg2"
      >
        <CircleHelp size={17} aria-hidden="true" />
      </button>
      <span role="status" className="contents">
        {offen && (
          <span className="absolute inset-x-3 top-14 z-20 rounded-xl border border-border bg-background p-3 text-[13px] leading-relaxed text-text2 shadow-xl text-left font-normal normal-case tracking-normal">
            {children}
          </span>
        )}
      </span>
    </span>
  );
}
