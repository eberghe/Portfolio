import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SiteShell from '@/components/SiteShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://erik-bergheimer.de'),
  title: 'Erik Bergheimer — UX/UI-Designer & Webentwickler',
  description:
    'UX/UI-Designer & Webentwickler aus Augsburg. Digitale Erlebnisse, die Sinn ergeben, gut aussehen und funktionieren.',
};

export default function GermanLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="de">{children}</SiteShell>;
}
