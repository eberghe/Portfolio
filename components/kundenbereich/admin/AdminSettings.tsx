'use client';

import { LogOut } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import { logout } from '@/app/actions/kundenbereich';
import Button from '@/components/ui/Button';
import { karte, kartenTitel } from './AdminListen';
import AdminShell from './AdminShell';

// Einstellungen der Verwaltung: Konto, Darstellung, Abmelden (functions/kundenbereich/admin-sidebar.md Verhalten 10, AK-10)

type Modus = 'hell' | 'dunkel' | 'system';
const MODI: { value: Modus; label: string }[] = [
  { value: 'hell', label: 'Hell' },
  { value: 'dunkel', label: 'Dunkel' },
  { value: 'system', label: 'System' },
];

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

export default function AdminSettings({ email }: { email: string | null }) {
  // Gespeicherte Wahl erst im Browser lesen; auf dem Server gilt „System“
  const gespeichert = useSyncExternalStore(abonnieren, gespeicherterModus, () => 'system' as Modus);
  const [wahl, setModus] = useState<Modus | null>(null);
  const modus = wahl ?? gespeichert;

  return (
    <AdminShell title="Einstellungen">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 items-start max-w-[1100px]">
        <section aria-labelledby="konto-titel" className={karte}>
          <h2 id="konto-titel" className={`${kartenTitel} mb-3`}>
            Konto
          </h2>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-[14px] mb-5">
            <dt className="text-text2">Angemeldet als</dt>
            <dd className="break-all">{email ?? 'unbekannt'}</dd>
            <dt className="text-text2">Rolle</dt>
            <dd>Admin</dd>
          </dl>
          <form action={logout}>
            <input type="hidden" name="sprache" value="de" />
            <Button type="submit" variant="secondary">
              <LogOut size={15} aria-hidden="true" />
              Abmelden
            </Button>
          </form>
        </section>

        <section aria-labelledby="darstellung-titel" className={karte}>
          <h2 id="darstellung-titel" className={`${kartenTitel} mb-3`}>
            Darstellung
          </h2>
          <div role="radiogroup" aria-labelledby="darstellung-titel" className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {MODI.map((m) => (
              <label
                key={m.value}
                className="flex items-center gap-3 min-h-11 rounded-lg border border-border px-3 text-[14px] cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-bg2"
              >
                <input
                  type="radio"
                  name="darstellung"
                  value={m.value}
                  checked={modus === m.value}
                  onChange={() => {
                    setModus(m.value);
                    anwenden(m.value);
                  }}
                  className="w-5 h-5 accent-[hsl(var(--primary))]"
                />
                {m.label}
              </label>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
