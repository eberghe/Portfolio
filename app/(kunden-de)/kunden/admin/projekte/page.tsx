import type { Metadata } from 'next';
import AdminProjekte from '@/components/kundenbereich/admin/AdminProjekte';
import { adminKontext } from '@/components/kundenbereich/admin/kontext';
import { projektListe } from '@/lib/kundenbereich/admin/laden';

// functions/kundenbereich/admin-aufbau.md
export const metadata: Metadata = { title: 'Projekte | Verwaltung', robots: { index: false, follow: false } };

export default async function Page() {
  const api = await adminKontext();
  return <AdminProjekte projekte={await projektListe(api)} />;
}
