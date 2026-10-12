import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SiteShell from '@/components/SiteShell';

// Eigener Rahmen ohne Navigation, Footer und weiches Scrollen (functions/kundenbereich/rahmen.md)
export const metadata: Metadata = {
  metadataBase: new URL('https://erik-bergheimer.de'),
  title: 'Kundenbereich | Erik Bergheimer',
};

export default function KundenLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell locale="de" variant="kunden">
      {children}
    </SiteShell>
  );
}
