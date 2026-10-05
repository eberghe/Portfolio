import type { ReactNode } from 'react';
import '@fontsource-variable/mona-sans/wght.css';
import '@/app/globals.css';
import { messages, type Locale } from '@/lib/i18n';
import Footer from './Footer';
import Navbar from './Navbar';
import Logo from './Logo';
import RevealObserver from './motion/RevealObserver';
import SmoothScroll from './motion/SmoothScroll';

// Setzt vor dem ersten Zeichnen die Klasse "js" (Animationen, functions/infrastruktur/animationen.md)
// und "dark": gespeicherte Wahl, sonst Systemeinstellung.
// Bei erlaubter Bewegung außerdem "smooth" (weiches Scrollen) und beim ersten Aufruf der Sitzung "preload"
// (Ladeanimation, AK-7 bis AK-9). Unter Testautomatisierung nur mit ?animationstest, damit andere Tests nicht warten.
const themeScript = `(function(){var h=document.documentElement;h.classList.add('js');try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)h.classList.add('dark')}catch(e){}var m=!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&!(navigator.webdriver&&!/[?&]animationstest/.test(location.search));if(!m)return;h.classList.add('smooth');try{if(!sessionStorage.getItem('preloaded')){sessionStorage.setItem('preloaded','1');h.classList.add('preload')}}catch(e){}})()`;

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
        {/* Ladeanimation: nur mit Klasse "preload", endet per CSS von selbst (animationen.md AK-7) */}
        <div data-preloader aria-hidden="true" className="preloader">
          <span className="preloader-mark">
            <Logo className="h-4 sm:h-5 w-auto" />
          </span>
          <span className="preloader-bar" />
        </div>
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
        <SmoothScroll />
      </body>
    </html>
  );
}
