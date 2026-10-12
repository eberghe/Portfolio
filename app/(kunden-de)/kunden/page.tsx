import KundenPage from '@/components/kundenbereich/KundenPage';
import { kundenMetadata } from '@/lib/pages/kundenbereich';

export const metadata = kundenMetadata('/kunden', 'de');

export default async function Page({ searchParams }: { searchParams: Promise<{ projekt?: string | string[] }> }) {
  const { projekt } = await searchParams;
  return <KundenPage locale="de" auswahl={typeof projekt === 'string' ? projekt : undefined} />;
}
