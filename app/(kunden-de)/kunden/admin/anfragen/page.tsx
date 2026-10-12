import type { Metadata } from 'next';
import AdminAnfragen from '@/components/kundenbereich/admin/AdminAnfragen';
import { adminKontext } from '@/components/kundenbereich/admin/kontext';
import { anfragenListe } from '@/lib/kundenbereich/admin/laden';

// functions/kundenbereich/admin-aufbau.md
export const metadata: Metadata = { title: 'Anfragen | Verwaltung', robots: { index: false, follow: false } };

export default async function Page() {
  const api = await adminKontext();
  return <AdminAnfragen anfragen={await anfragenListe(api)} />;
}
