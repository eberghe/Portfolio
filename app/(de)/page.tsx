import type { Metadata } from 'next';
import Home from '@/components/home/Home';
import { homeContent } from '@/lib/content/home';

export const metadata: Metadata = {
  title: homeContent.de.metaTitle,
  description: homeContent.de.metaDescription,
};

export default function HomePage() {
  return <Home locale="de" />;
}
