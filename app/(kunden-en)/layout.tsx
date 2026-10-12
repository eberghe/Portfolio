import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SiteShell from '@/components/SiteShell';

// Own frame without navigation, footer and smooth scrolling (functions/kundenbereich/rahmen.md)
export const metadata: Metadata = {
  metadataBase: new URL('https://erik-bergheimer.de'),
  title: 'Client area | Erik Bergheimer',
};

export default function ClientsLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell locale="en" variant="kunden">
      {children}
    </SiteShell>
  );
}
