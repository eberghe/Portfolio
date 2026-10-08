import KundenPage from '@/components/kundenbereich/KundenPage';
import { kundenMetadata } from '@/lib/pages/kundenbereich';

export const metadata = kundenMetadata('/kunden', 'en');

export default function Page() {
  return <KundenPage locale="en" />;
}
