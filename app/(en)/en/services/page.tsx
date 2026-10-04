import ServicesOverview from '@/components/services/ServicesOverview';
import { overviewMetadata } from '@/lib/pages/services';

export const metadata = overviewMetadata('en');

export default function ServicesPage() {
  return <ServicesOverview locale="en" />;
}
