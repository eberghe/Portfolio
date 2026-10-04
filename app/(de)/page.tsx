import Home from '@/components/home/Home';
import { homeContent } from '@/lib/content/home';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/',
  locale: 'de',
  title: homeContent.de.metaTitle,
  description: homeContent.de.metaDescription,
});

export default function HomePage() {
  return <Home locale="de" />;
}
