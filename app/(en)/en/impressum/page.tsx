import LegalPage from '@/components/legal/LegalPage';
import { legalMetadata } from '@/lib/pages/static';

export const metadata = legalMetadata('impressum', 'en');

export default function Page() {
  return <LegalPage kind="impressum" locale="en" />;
}
