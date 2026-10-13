import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import KundenLeiste from './KundenLeiste';

// Rahmen der Kundenseiten: schmale Leiste „Zur Website“ und Inhalt (functions/kundenbereich/rahmen.md AK-2).
// Die Verwaltung hat stattdessen eine Sidebar (admin-sidebar.md).

export default function KundenRahmen({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <>
      <KundenLeiste locale={locale} />
      <main id="inhalt" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
    </>
  );
}
