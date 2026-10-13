'use client';

import { useState, useSyncExternalStore } from 'react';

// Wahl der Darstellung, in Verwaltung und Kundenbereich gleich (admin-sidebar.md AK-10, kunden-sidebar.md AK-6)

type Modus = 'hell' | 'dunkel' | 'system';
const MODI: Modus[] = ['hell', 'dunkel', 'system'];

/** Gleiche Speicherung wie der Schalter der Website (localStorage „theme“) */
function anwenden(m: Modus) {
  const dunkel = m === 'dunkel' || (m === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', !!dunkel);
  try {
    if (m === 'system') localStorage.removeItem('theme');
    else localStorage.setItem('theme', m === 'dunkel' ? 'dark' : 'light');
  } catch {
    // Speichern nicht möglich (z. B. privater Modus): Wahl gilt nur für diese Seite
  }
}

function gespeicherterModus(): Modus {
  try {
    const t = localStorage.getItem('theme');
    return t === 'dark' ? 'dunkel' : t === 'light' ? 'hell' : 'system';
  } catch {
    return 'system';
  }
}
const abonnieren = (fn: () => void) => {
  window.addEventListener('storage', fn);
  return () => window.removeEventListener('storage', fn);
};

export default function Darstellung({ titelId, labels }: { titelId: string; labels: Record<Modus, string> }) {
  // Gespeicherte Wahl erst im Browser lesen; auf dem Server gilt „System“
  const gespeichert = useSyncExternalStore(abonnieren, gespeicherterModus, () => 'system' as Modus);
  const [wahl, setModus] = useState<Modus | null>(null);
  const modus = wahl ?? gespeichert;
  return (
    <div role="radiogroup" aria-labelledby={titelId} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {MODI.map((m) => (
        <label
          key={m}
          className="flex items-center gap-3 min-h-11 rounded-lg border border-border px-3 text-[14px] cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-bg2"
        >
          <input
            type="radio"
            name="darstellung"
            value={m}
            checked={modus === m}
            onChange={() => {
              setModus(m);
              anwenden(m);
            }}
            className="w-5 h-5 accent-[hsl(var(--primary))]"
          />
          {labels[m]}
        </label>
      ))}
    </div>
  );
}
