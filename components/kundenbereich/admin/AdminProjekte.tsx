import { Plus } from 'lucide-react';
import Link from 'next/link';
import { buttonClass } from '@/components/ui/Button';
import { projekteNachStatus, type DashboardProjekt } from '@/lib/kundenbereich/admin/dashboard';
import { karte, ProjektListe } from './AdminListen';
import AdminShell from './AdminShell';

// Alle Projekte, abgeschlossene eingeklappt (functions/kundenbereich/admin-aufbau.md Verhalten 3, AK-6)

export default function AdminProjekte({ projekte }: { projekte: DashboardProjekt[] }) {
  const alle = projekteNachStatus(projekte);
  const laufend = alle.filter((p) => p.status !== 'abgeschlossen');
  const fertig = alle.filter((p) => p.status === 'abgeschlossen');
  return (
    <AdminShell
      title="Projekte"
      bereich="projekte"
      aside={
        <Link href="/kunden/admin/projekte/neu" className={buttonClass('primary')}>
          <Plus size={15} aria-hidden="true" />
          Neues Projekt
        </Link>
      }
    >
      <section aria-label="Laufende Projekte" className={karte}>
        {laufend.length === 0 ? (
          <p className="text-[15px] text-text2">Noch keine laufenden Projekte.</p>
        ) : (
          <ProjektListe projekte={laufend} />
        )}
      </section>
      {fertig.length > 0 && (
        <details className={`${karte} mt-4`}>
          <summary className="cursor-pointer min-h-11 flex items-center text-[15px] font-bold">
            Abgeschlossen ({fertig.length})
          </summary>
          <div className="mt-3">
            <ProjektListe projekte={fertig} />
          </div>
        </details>
      )}
    </AdminShell>
  );
}
