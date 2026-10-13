// Ladezustand der Verwaltung: Sidebar bleibt stehen, der Inhalt zeigt ruhige Platzhalter
// (functions/kundenbereich/admin-aufbau.md Verhalten 10, AK-13; admin-sidebar.md)

export default function Laden() {
  return (
    <div role="status" className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
      <span className="sr-only">Wird geladen …</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="h-9 md:h-10 w-56 max-w-full rounded-lg bg-foreground/10 mb-6 md:mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="h-48 rounded-2xl border border-border lg:col-span-2" />
          <div className="h-48 rounded-2xl border border-border" />
        </div>
      </div>
    </div>
  );
}
