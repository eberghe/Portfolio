import type { KundeZeile } from '@/lib/kundenbereich/admin/laden';
import { karte, KundeAnlegen, KundenListe } from './AdminListen';
import AdminShell from './AdminShell';

// Alle Kunden, anlegen im Dialog (functions/kundenbereich/admin-aufbau.md Verhalten 3, AK-6)

export default function AdminKunden({ kunden }: { kunden: KundeZeile[] }) {
  return (
    <AdminShell title="Kunden" bereich="kunden" aside={<KundeAnlegen variant="primary" />}>
      <section aria-label="Alle Kunden" className={karte}>
        <KundenListe kunden={kunden} />
      </section>
    </AdminShell>
  );
}
