import type { Metadata } from 'next';
import ProjektAssistent from '@/components/kundenbereich/admin/ProjektAssistent';
import { adminKontext } from '@/components/kundenbereich/admin/kontext';
import { vorbelegung } from '@/lib/kundenbereich/admin/assistent';
import { anfrage, assistentKunden } from '@/lib/kundenbereich/admin/laden';
import { istId } from '@/lib/kundenbereich/admin/pruefen';

// functions/kundenbereich/projekt-assistent.md
export const metadata: Metadata = { title: 'Neues Projekt | Verwaltung', robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const api = await adminKontext();
  const q = await searchParams;
  const [kunden, a] = await Promise.all([
    assistentKunden(api),
    q.anfrage && istId(q.anfrage) ? anfrage(api, q.anfrage) : null,
  ]);
  return <ProjektAssistent kunden={kunden} start={vorbelegung({ kundeId: q.kunde, anfrage: a, kunden })} />;
}
