import Home from '@/components/home/Home';
import { homeContent } from '@/lib/content/home';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/',
  locale: 'en',
  title: homeContent.en.metaTitle,
  description: homeContent.en.metaDescription,
});

export default function HomePageEn() {
  return <Home locale="en" />;
}
