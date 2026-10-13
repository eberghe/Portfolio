import { cookies } from 'next/headers';
import AdminNavigation from '@/components/kundenbereich/admin/AdminNavigation';
import { adminKontext } from '@/components/kundenbereich/admin/kontext';
import { neueAnfragenZahl } from '@/lib/kundenbereich/admin/laden';

// Rahmen der Verwaltung: Sidebar links, Inhalt auf voller Breite (functions/kundenbereich/admin-sidebar.md).
// Die Admin-Prüfung läuft hier vor dem Ladezustand, sonst ginge Status 200 raus, bevor die Seite 404 meldet
// (admin-aufbau.md AK-13, admin.md AK-1).

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const api = await adminKontext();
  const [zahl, store] = await Promise.all([neueAnfragenZahl(api).catch(() => 0), cookies()]);
  return (
    <div className="lg:flex lg:min-h-svh">
      <AdminNavigation neueAnfragen={zahl} eingeklappt={store.get('kb_sidebar')?.value === 'zu'} />
      <main id="inhalt" tabIndex={-1} className="min-w-0 flex-1 pb-24 focus:outline-none lg:pb-0">
        {children}
      </main>
      {/* Meldungen der Verwaltung: Live-Region und kurzer Hinweis unten rechts (admin-sidebar.md AK-7) */}
      <p
        id="admin-meldung"
        aria-live="polite"
        className="pointer-events-none fixed bottom-20 right-4 z-50 max-w-[calc(100%-2rem)] rounded-lg bg-foreground px-4 py-2.5 text-[13px] font-medium text-background shadow-lg transition-opacity empty:opacity-0 lg:bottom-6 lg:right-6"
      />
      {/* Fehler eigens und sofort angesagt (admin-sidebar.md AK-13) */}
      <p
        id="admin-fehler"
        role="alert"
        className="pointer-events-none fixed bottom-20 right-4 z-50 max-w-[calc(100%-2rem)] rounded-lg border border-error bg-background px-4 py-2.5 text-[13px] font-medium text-error shadow-lg transition-opacity empty:opacity-0 lg:bottom-6 lg:right-6"
      />
    </div>
  );
}
