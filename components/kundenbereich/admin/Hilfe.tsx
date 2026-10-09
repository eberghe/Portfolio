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
    document.addEventListener('pointerdown', weg);
    return () => document.removeEventListener('pointerdown', weg);
  }, [offen]);

  return (
    <span ref={box} className={`relative inline-flex ${className}`}>
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
          <span className="absolute right-0 top-full mt-2 z-20 w-64 max-w-[calc(100vw-3rem)] rounded-xl border border-border bg-background p-3 text-[13px] leading-relaxed text-text2 shadow-xl text-left font-normal normal-case tracking-normal">
            {children}
          </span>
        )}
      </span>
    </span>
  );
}
