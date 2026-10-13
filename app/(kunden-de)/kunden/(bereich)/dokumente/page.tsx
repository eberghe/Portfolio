import KundenPage from '@/components/kundenbereich/KundenPage';
import { kundenMetadata } from '@/lib/pages/kundenbereich';

// Seite „dokumente“ des Kundenbereichs (functions/kundenbereich/kunden-sidebar.md Verhalten 2)
export const metadata = kundenMetadata('/kunden/dokumente', 'de');

export default async function Page({ searchParams }: { searchParams: Promise<{ projekt?: string | string[] }> }) {
  const { projekt } = await searchParams;
  return <KundenPage locale="de" bereich="dokumente" auswahl={typeof projekt === 'string' ? projekt : undefined} />;
}
