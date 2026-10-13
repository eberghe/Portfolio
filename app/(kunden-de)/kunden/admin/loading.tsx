import AdminTabsAusPfad from '@/components/kundenbereich/admin/AdminTabsAusPfad';

// Ladezustand der Verwaltung: Bereichsleiste sofort, Inhalt als ruhige Platzhalter
// (functions/kundenbereich/admin-aufbau.md Verhalten 10, AK-13)

export default function Laden() {
  return (
    <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12 py-6 md:py-10">
      <AdminTabsAusPfad />
      <div role="status">
        <span className="sr-only">Wird geladen …</span>
        <div aria-hidden="true" className="motion-safe:animate-pulse">
          <div className="h-9 md:h-11 w-56 max-w-full rounded-lg bg-foreground/10 mb-6 md:mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="h-48 rounded-2xl border border-border lg:col-span-2" />
            <div className="h-48 rounded-2xl border border-border" />
          </div>
        </div>
      </div>
    </div>
  );
}
