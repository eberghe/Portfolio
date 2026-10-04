import LegalPage from '@/components/legal/LegalPage';
import { legalMetadata } from '@/lib/pages/static';

export const metadata = legalMetadata('datenschutz', 'en');

export default function Page() {
  return <LegalPage kind="datenschutz" locale="en" />;
}
