import Link from 'next/link';
import AdminShell from '@/components/kundenbereich/admin/AdminShell';
import { buttonClass } from '@/components/ui/Button';

// Unbekannte ID in der Verwaltung: Hinweis im Rahmen der Verwaltung statt der 404-Seite der Website
// (functions/kundenbereich/admin-sidebar.md AK-16)

export default function AdminNichtGefunden() {
  return (
    <AdminShell title="Nicht gefunden">
      <p className="mb-6 max-w-prose text-[15px] text-text2">
        Diesen Eintrag gibt es nicht oder nicht mehr. Vielleicht wurde er gelöscht oder der Link ist unvollständig.
      </p>
      <Link href="/kunden/admin" className={buttonClass('secondary')}>
        Zur Übersicht
      </Link>
    </AdminShell>
  );
}
