import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminProjekt from '@/components/kundenbereich/admin/AdminProjekt';
import { adminKontext } from '@/components/kundenbereich/admin/kontext';
import { projektDetail } from '@/lib/kundenbereich/admin/laden';
import { istId } from '@/lib/kundenbereich/admin/pruefen';

// functions/kundenbereich/admin.md, projekt-assistent.md
export const metadata: Metadata = { title: 'Projekt | Verwaltung', robots: { index: false, follow: false } };

/** Ergebnis des Assistenten (projekt-assistent.md AK-8) */
function hinweis(q: Record<string, string | undefined>) {
  if (q.angelegt !== '1') return undefined;
  const von = Number(q.von ?? 0);
  if (!von) return 'Projekt angelegt.';
  const ok = Math.min(Number(q.eingeladen ?? 0), von);
  return ok === von
    ? `Projekt angelegt. Anmeldelink an ${von === 1 ? 'den neuen Ansprechpartner' : `alle ${von} neuen Ansprechpartner`} geschickt.`
    : `Projekt angelegt. Anmeldelink an ${ok} von ${von} neuen Ansprechpartnern geschickt; die übrigen kannst du auf der Kundenseite erneut einladen.`;
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const api = await adminKontext();
  const { id } = await params;
  const projekt = istId(id) ? await projektDetail(api, id) : null;
  if (!projekt) notFound();
  return <AdminProjekt projekt={projekt} hinweis={hinweis(await searchParams)} />;
}
