import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminKunde from '@/components/kundenbereich/admin/AdminKunde';
import { adminKontext } from '@/components/kundenbereich/admin/kontext';
import { kundeDetail } from '@/lib/kundenbereich/admin/laden';
import { istId } from '@/lib/kundenbereich/admin/pruefen';

// functions/kundenbereich/admin.md
export const metadata: Metadata = { title: 'Kunde | Verwaltung', robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const api = await adminKontext();
  const { id } = await params;
  const kunde = istId(id) ? await kundeDetail(api, id) : null;
  if (!kunde) notFound();
  return <AdminKunde kunde={kunde} />;
}
