import type { ReactNode } from 'react';
import '@fontsource-variable/mona-sans/wght.css';
import '@/app/globals.css';
import { messages, type Locale } from '@/lib/i18n';
import Footer from './Footer';
import Navbar from './Navbar';
import RevealObserver from './motion/RevealObserver';

// Setzt vor dem ersten Zeichnen die Klasse "js" (Animationen, functions/infrastruktur/animationen.md)
// und "dark": gespeicherte Wahl, sonst Systemeinstellung.
const themeScript = `(function(){document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`;

/** Gemeinsames HTML-Gerüst beider Sprach-Root-Layouts. */
export default function SiteShell({
  locale,
  notFound = false,
  children,
}: {
  locale: Locale;
  notFound?: boolean;
  children: ReactNode;
}) {
  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element -- App Router: SiteShell ist das Root-Layout */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <span id="seitenanfang" />
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground"
        >
          {messages[locale].skipLink}
        </a>
        <Navbar locale={locale} notFound={notFound} />
        <main id="inhalt" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer locale={locale} />
        <RevealObserver />
      </body>
    </html>
  );
}
