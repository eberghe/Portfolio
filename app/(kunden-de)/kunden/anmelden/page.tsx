import ConfirmPage from '@/components/kundenbereich/ConfirmPage';
import { kundenMetadata } from '@/lib/pages/kundenbereich';

export const metadata = kundenMetadata('/kunden/anmelden', 'de');

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { code, ungueltig } = await searchParams;
  return <ConfirmPage locale="de" code={typeof code === 'string' ? code : ''} invalid={ungueltig === '1'} />;
}
