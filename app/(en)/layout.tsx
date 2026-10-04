import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SiteShell from '@/components/SiteShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://erik-bergheimer.de'),
  title: 'Erik Bergheimer — UX/UI Designer & Webflow Expert',
  description:
    'UX/UI Designer & Webflow Expert from Augsburg & Innsbruck. Digital experiences that make sense, look great and work.',
};

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
