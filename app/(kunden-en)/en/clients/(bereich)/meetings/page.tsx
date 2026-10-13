import KundenPage from '@/components/kundenbereich/KundenPage';
import { kundenMetadata } from '@/lib/pages/kundenbereich';

// Seite „termine“ des Kundenbereichs (functions/kundenbereich/kunden-sidebar.md Verhalten 2)
export const metadata = kundenMetadata('/kunden/termine', 'en');

export default async function Page({ searchParams }: { searchParams: Promise<{ projekt?: string | string[] }> }) {
  const { projekt } = await searchParams;
  return <KundenPage locale="en" bereich="termine" auswahl={typeof projekt === 'string' ? projekt : undefined} />;
}
