import type { Metadata } from 'next';
import AdminUebersicht from '@/components/kundenbereich/admin/AdminUebersicht';
import { adminKontext } from '@/components/kundenbereich/admin/kontext';
import { kundenListe } from '@/lib/kundenbereich/admin/laden';

// functions/kundenbereich/admin.md
export const metadata: Metadata = { title: 'Verwaltung | Kundenbereich', robots: { index: false, follow: false } };

export default async function Page() {
  const api = await adminKontext();
  return <AdminUebersicht kunden={await kundenListe(api)} />;
}
