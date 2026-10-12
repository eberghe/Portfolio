import type { Anfrage } from '@/lib/kundenbereich/admin/dashboard';
import { AnfrageListe, karte } from './AdminListen';
import AdminShell from './AdminShell';

// Alle Anfragen auf einer eigenen Seite (functions/kundenbereich/admin-aufbau.md Verhalten 3, AK-5)

export default function AdminAnfragen({ anfragen }: { anfragen: Anfrage[] }) {
  const offen = anfragen.filter((a) => a.status !== 'erledigt');
  const erledigt = anfragen.filter((a) => a.status === 'erledigt');
  return (
    <AdminShell title="Anfragen" bereich="anfragen">
      <section aria-label="Offene Anfragen" className={karte}>
        {offen.length === 0 ? (
          <p className="text-[15px] text-text2">Keine offenen Anfragen.</p>
        ) : (
          <AnfrageListe anfragen={offen} />
        )}
      </section>
      {erledigt.length > 0 && (
        <details className={`${karte} mt-4`}>
          <summary className="cursor-pointer min-h-11 flex items-center text-[15px] font-bold">
            Erledigt ({erledigt.length})
          </summary>
          <div className="mt-3">
            <AnfrageListe anfragen={erledigt} />
          </div>
        </details>
      )}
    </AdminShell>
  );
}
