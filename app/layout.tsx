import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@fontsource/inter/300.css';
import '@fontsource/inter/300-italic.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://erik-bergheimer.de'),
  title: 'Erik Bergheimer — UX/UI Designer & Webflow Expert',
  description:
    'UX/UI Designer & Webflow Expert aus Augsburg & Innsbruck. Digitale Erlebnisse, die Sinn ergeben, gut aussehen und funktionieren.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground"
        >
          Zum Inhalt springen
        </a>
        <main id="inhalt">{children}</main>
      </body>
    </html>
  );
}
