import FaqPage from '@/components/faq/FaqPage';
import { faqMetadata } from '@/lib/pages/static';

export const metadata = faqMetadata('de');

export default function Page() {
  return <FaqPage locale="de" />;
}
