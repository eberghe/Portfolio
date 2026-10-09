import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminAnfrage from '@/components/kundenbereich/admin/AdminAnfrage';
import { adminKontext } from '@/components/kundenbereich/admin/kontext';
import { anfrage } from '@/lib/kundenbereich/admin/laden';
import { istId } from '@/lib/kundenbereich/admin/pruefen';

// functions/kundenbereich/admin-aufbau.md
export const metadata: Metadata = { title: 'Anfrage | Verwaltung', robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const api = await adminKontext();
  const { id } = await params;
  const a = istId(id) ? await anfrage(api, id) : null;
  if (!a) notFound();
  return <AdminAnfrage anfrage={a} />;
}
