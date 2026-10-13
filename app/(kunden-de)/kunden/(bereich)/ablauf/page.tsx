import KundenPage from '@/components/kundenbereich/KundenPage';
import { kundenMetadata } from '@/lib/pages/kundenbereich';

// Seite „ablauf“ des Kundenbereichs (functions/kundenbereich/kunden-sidebar.md Verhalten 2)
export const metadata = kundenMetadata('/kunden/ablauf', 'de');

export default async function Page({ searchParams }: { searchParams: Promise<{ projekt?: string | string[] }> }) {
  const { projekt } = await searchParams;
  return <KundenPage locale="de" bereich="ablauf" auswahl={typeof projekt === 'string' ? projekt : undefined} />;
}
