import type { Metadata } from 'next';
import AdminKunden from '@/components/kundenbereich/admin/AdminKunden';
import { adminKontext } from '@/components/kundenbereich/admin/kontext';
import { kundenListe } from '@/lib/kundenbereich/admin/laden';

// functions/kundenbereich/admin-aufbau.md
export const metadata: Metadata = { title: 'Kunden | Verwaltung', robots: { index: false, follow: false } };

export default async function Page() {
  const api = await adminKontext();
  return <AdminKunden kunden={await kundenListe(api)} />;
}
