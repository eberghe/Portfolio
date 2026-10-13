import Link from 'next/link';

// Kopf und Inhalt einer Verwaltungsseite auf voller Breite neben der Sidebar
// (functions/kundenbereich/admin-sidebar.md Verhalten 5; Pfad auf Detailseiten: admin-aufbau.md Kritiker 11)

export const adminSection = 'border-t border-border pt-8 mt-10';
// Trennlinie oben je Eintrag; die nächste Abschnittslinie schließt die Liste ab (Kritiker Verwaltung 8)
export const listItem = 'flex flex-wrap items-center gap-x-4 gap-y-2 py-4 border-t border-border';

export default function AdminShell({
  title,
  pfad = [],
  aside,
  children,
}: {
  title: string;
  /** Pfadnavigation bis zur aktuellen Seite (ohne sie), nur auf Detailseiten */
  pfad?: { href: string; label: string }[];
  /** Status und ⋯-Menü bzw. Hauptaktion rechts neben dem Titel */
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
      {pfad.length > 0 && (
        <nav aria-label="Pfad" className="mb-1">
          <ol role="list" className="flex flex-wrap gap-x-2 text-[13px] text-text2">
            {pfad.map((p) => (
              <li key={p.href} className="flex items-center gap-2">
                <Link href={p.href} className="inline-flex items-center min-h-11 hover:text-foreground hover:underline">
                  {p.label}
                </Link>
                <span aria-hidden="true">/</span>
              </li>
            ))}
            {/* Kritiker Verwaltung 7: aktuelle Seite am Ende */}
            <li aria-current="page" className="flex items-center min-h-11 text-foreground break-words min-w-0">
              {title}
            </li>
          </ol>
        </nav>
      )}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 mb-6 lg:mb-8">
        <h1 className="text-[24px] md:text-[28px] leading-[1.15] font-bold tracking-tight text-balance break-words min-w-0">
          {title}
        </h1>
        {/* Verhalten 12 (admin-aufbau.md): schmaler Innenabstand, damit zwei Buttons bei 360 px in eine Zeile passen */}
        {aside && (
          <div className="flex flex-wrap items-center gap-2 max-sm:[&_a]:px-4 max-sm:[&_button]:px-4">{aside}</div>
        )}
      </div>
      {children}
    </div>
  );
}
