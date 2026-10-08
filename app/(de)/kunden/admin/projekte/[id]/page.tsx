import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminProjekt from '@/components/kundenbereich/admin/AdminProjekt';
import { adminKontext } from '@/components/kundenbereich/admin/kontext';
import { projektDetail } from '@/lib/kundenbereich/admin/laden';
import { istId } from '@/lib/kundenbereich/admin/pruefen';

// functions/kundenbereich/admin.md
export const metadata: Metadata = { title: 'Projekt | Verwaltung', robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const api = await adminKontext();
  const { id } = await params;
  const projekt = istId(id) ? await projektDetail(api, id) : null;
  if (!projekt) notFound();
  return <AdminProjekt projekt={projekt} />;
}
