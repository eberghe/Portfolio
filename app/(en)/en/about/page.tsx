import About from '@/components/about/About';
import { aboutMetadata } from '@/lib/pages/static';

export const metadata = aboutMetadata('en');

export default function Page() {
  return <About locale="en" />;
}
