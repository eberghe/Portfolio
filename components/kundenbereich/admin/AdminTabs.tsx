import Link from 'next/link';

// Bereichsleiste der Verwaltung (functions/kundenbereich/admin-aufbau.md Verhalten 1 und 10, AK-1, AK-12, AK-13)

export type Bereich = 'uebersicht' | 'projekte' | 'kunden' | 'anfragen';

export const BEREICHE: { key: Bereich; href: string; label: string }[] = [
  { key: 'uebersicht', href: '/kunden/admin', label: 'Übersicht' },
  { key: 'projekte', href: '/kunden/admin/projekte', label: 'Projekte' },
  { key: 'kunden', href: '/kunden/admin/kunden', label: 'Kunden' },
  { key: 'anfragen', href: '/kunden/admin/anfragen', label: 'Anfragen' },
];

/** Bereich aus der Adresse, z. B. im Ladezustand (AK-13) */
export function bereichAusPfad(pfad: string | null): { bereich?: Bereich; unterseite: boolean } {
  if (!pfad) return { unterseite: false };
  const treffer = [...BEREICHE].reverse().find((b) => pfad === b.href || pfad.startsWith(`${b.href}/`));
  if (!treffer) return { unterseite: false };
  // Unterseiten der Übersicht gibt es nicht: /kunden/admin/logo/… gehört zu keinem Bereich
  if (treffer.key === 'uebersicht' && pfad !== treffer.href) return { unterseite: false };
  return { bereich: treffer.key, unterseite: pfad !== treffer.href };
}

export default function AdminTabs({ bereich, unterseite = false }: { bereich?: Bereich; unterseite?: boolean }) {
  const aktuell = bereich;
  const unter = unterseite;
  return (
    <nav aria-label="Bereiche der Verwaltung" className="mb-6">
      {/* Verhalten 10: vier gleich breite Ziele auf dem Handy, kein waagerechtes Scrollen */}
      <ul role="list" className="grid grid-cols-4 sm:flex sm:gap-1 border-b border-border">
        {BEREICHE.map((b) => {
          const aktiv = b.key === aktuell;
          return (
            <li key={b.key} className="min-w-0">
              <Link
                href={b.href}
                aria-current={aktiv ? (unter ? 'true' : 'page') : undefined}
                className={`flex sm:inline-flex items-center justify-center min-h-11 px-1 sm:px-3 -mb-px border-b-2 focus-visible:outline-offset-[-2px] text-[13px] sm:text-[14px] font-medium transition-colors ${
                  aktiv ? 'border-primary text-foreground' : 'border-transparent text-text2 hover:text-foreground'
                }`}
              >
                {b.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
