import KundenPage from '@/components/kundenbereich/KundenPage';
import { kundenMetadata } from '@/lib/pages/kundenbereich';

export const metadata = kundenMetadata('/kunden', 'en');

export default async function Page({ searchParams }: { searchParams: Promise<{ projekt?: string | string[] }> }) {
  const { projekt } = await searchParams;
  return <KundenPage locale="en" auswahl={typeof projekt === 'string' ? projekt : undefined} />;
}
