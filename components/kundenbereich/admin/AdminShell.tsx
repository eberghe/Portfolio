import Link from 'next/link';

// Rahmen der Verwaltungsseiten: Pfadnavigation, Titel, Abschnitte (functions/kundenbereich/admin.md)

export const adminSection = 'border-t border-border pt-8 mt-10';
export const listItem = 'flex flex-wrap items-center gap-x-4 gap-y-2 py-4 border-b border-border';

export default function AdminShell({
  title,
  pfad = [],
  aside,
  children,
}: {
  title: string;
  /** Pfadnavigation bis zur aktuellen Seite (ohne sie) */
  pfad?: { href: string; label: string }[];
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12 py-8 md:py-16">
      <nav aria-label="Pfad" className="mb-4">
        <ol role="list" className="flex flex-wrap gap-x-2 text-[14px] text-text2">
          {[{ href: '/kunden', label: 'Kundenbereich' }, ...pfad].map((p) => (
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
        </ol>
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <h1 className="text-[32px] md:text-[44px] leading-[1.1] font-bold tracking-tight text-balance break-words min-w-0">
          {title}
        </h1>
        {aside}
      </div>
      <div className="max-w-[860px]">{children}</div>
    </div>
  );
}
