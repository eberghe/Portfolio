import type { Metadata } from 'next';
import Home from '@/components/home/Home';
import { homeContent } from '@/lib/content/home';

export const metadata: Metadata = {
  title: homeContent.en.metaTitle,
  description: homeContent.en.metaDescription,
};

export default function HomePageEn() {
  return <Home locale="en" />;
}
