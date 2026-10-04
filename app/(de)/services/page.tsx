import ServicesOverview from '@/components/services/ServicesOverview';
import { overviewMetadata } from '@/lib/pages/services';

export const metadata = overviewMetadata('de');

export default function ServicesPage() {
  return <ServicesOverview locale="de" />;
}
