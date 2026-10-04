import ContactPage from '@/components/contact/ContactPage';
import { contactMetadata } from '@/lib/pages/contact';

export const metadata = contactMetadata('en');

export default function Page() {
  return <ContactPage locale="en" />;
}
