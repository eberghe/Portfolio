import Link from 'next/link';
import AdminTabs, { type Bereich } from './AdminTabs';

// Rahmen der Verwaltungsseiten: Pfadnavigation, Titel, Abschnitte (functions/kundenbereich/admin.md)

export const adminSection = 'border-t border-border pt-8 mt-10';
// Trennlinie oben je Eintrag; die nächste Abschnittslinie schließt die Liste ab (Kritiker Verwaltung 8)
export const listItem = 'flex flex-wrap items-center gap-x-4 gap-y-2 py-4 border-t border-border';

export type { Bereich } from './AdminTabs';

export default function AdminShell({
  title,
  pfad = [],
  aside,
  wide = false,
  bereich,
  unterseite = false,
  children,
}: {
  title: string;
  /** Bereich, zu dem die Seite gehört; die Übersicht selbst ist aktuelle Seite */
  bereich?: Bereich;
  /** Detailseite in einem Bereich, z. B. eine Anfrage: Bereich ist markiert, aber nicht die aktuelle Seite */
  unterseite?: boolean;
  /** Pfadnavigation bis zur aktuellen Seite (ohne sie) */
  pfad?: { href: string; label: string }[];
  aside?: React.ReactNode;
  /** Volle Seitenbreite, z. B. für das Dashboard */
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12 py-6 md:py-10">
      {/* Meldungen, deren Button nach der Aktion verschwunden ist (Kritiker Aufbau 3) */}
      <p id="admin-meldung" aria-live="polite" className="sr-only" />
      <AdminTabs bereich={bereich} unterseite={unterseite} />
      {/* Kritiker Aufbau 11: „Verwaltung“ immer als erster Eintrag; auf der Übersicht selbst kein Pfad */}
      {!(bereich === 'uebersicht' && !unterseite) && (
        <nav aria-label="Pfad" className="mb-2">
          <ol role="list" className="flex flex-wrap gap-x-2 text-[14px] text-text2">
            {[{ href: '/kunden/admin', label: 'Verwaltung' }, ...pfad].map((p) => (
              <li key={p.href} className="flex items-center gap-2">
                <Link
                  href={p.href}
                  className="inline-flex items-center min-h-11 underline underline-offset-2 hover:text-foreground"
                >
                  {p.label}
                </Link>
                <span aria-hidden="true">/</span>
              </li>
            ))}
            {/* Kritiker Verwaltung 7: aktuelle Seite am Ende */}
            <li
              aria-current="page"
              className="flex items-center min-h-11 text-foreground font-medium break-words min-w-0"
            >
              {title}
            </li>
          </ol>
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6 md:mb-8">
        <h1 className="text-[28px] md:text-[36px] leading-[1.1] font-bold tracking-tight text-balance break-words min-w-0">
          {title}
        </h1>
        {/* Verhalten 12: schmaler Innenabstand, damit zwei Buttons bei 360 px in eine Zeile passen */}
        {aside && (
          <div className="flex flex-wrap items-center gap-2 max-sm:[&_a]:px-4 max-sm:[&_button]:px-4">{aside}</div>
        )}
      </div>
      <div className={wide ? undefined : 'max-w-[860px]'}>{children}</div>
    </div>
  );
}
