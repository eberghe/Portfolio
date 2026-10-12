import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import '@/app/globals.css';
import { messages, type Locale } from '@/lib/i18n';
import Footer from './Footer';
import Hydriert from './kundenbereich/Hydriert';
import KundenLeiste from './kundenbereich/KundenLeiste';
import Navbar from './Navbar';
import Logo from './Logo';
import RevealObserver from './motion/RevealObserver';
import SmoothScroll from './motion/SmoothScroll';

// Mona Sans selbst gehostet über next/font: vorgeladen, mit größenangepasster Ersatzschrift gegen
// Layout-Sprünge beim Laden (functions/infrastruktur/design-tokens.md AK-6, AK-10)
// Kursiv nur für Akzente (Hero der Startseite, startseite.md AK-43)
const mona = localFont({
  src: [
    { path: '../app/fonts/mona-sans-latin-wght-normal.woff2', weight: '200 900', style: 'normal' },
    { path: '../app/fonts/mona-sans-latin-wght-italic.woff2', weight: '200 900', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-mona',
  adjustFontFallback: 'Arial',
});

// Setzt vor dem ersten Zeichnen die Klasse "js" (Animationen, functions/infrastruktur/animationen.md)
// und "dark": gespeicherte Wahl, sonst Systemeinstellung.
// Bei erlaubter Bewegung außerdem "smooth" (weiches Scrollen) und beim ersten Aufruf der Sitzung "preload"
// (Ladeanimation, AK-7 bis AK-9). Unter Testautomatisierung nur mit ?animationstest, damit andere Tests nicht warten.
const themeScript = `(function(){var h=document.documentElement;h.classList.add('js');try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)h.classList.add('dark')}catch(e){}var m=!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&!(navigator.webdriver&&!/[?&]animationstest/.test(location.search));if(!m)return;h.classList.add('smooth');try{if(!sessionStorage.getItem('preloaded')){sessionStorage.setItem('preloaded','1');h.classList.add('preload')}}catch(e){}})()`;

// Kundenbereich: nur Klasse "js" und Dunkelmodus, ohne weiches Scrollen und Ladeanimation (kundenbereich/rahmen.md AK-3)
const kundenScript = `(function(){var h=document.documentElement;h.classList.add('js');try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)h.classList.add('dark')}catch(e){}})()`;

/** Gemeinsames HTML-Gerüst beider Sprach-Root-Layouts. */
export default function SiteShell({
  locale,
  notFound = false,
  variant = 'website',
  children,
}: {
  locale: Locale;
  notFound?: boolean;
  /** „kunden“: eigener Rahmen ohne Navigation, Footer und weiches Scrollen (functions/kundenbereich/rahmen.md) */
  variant?: 'website' | 'kunden';
  children: ReactNode;
}) {
  const kunden = variant === 'kunden';
  return (
    <html
      lang={locale}
      data-scroll-behavior={kunden ? undefined : 'smooth'}
      className={kunden ? `${mona.variable} kundenbereich` : mona.variable}
      suppressHydrationWarning
    >
      {/* eslint-disable-next-line @next/next/no-head-element -- App Router: SiteShell ist das Root-Layout */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: kunden ? kundenScript : themeScript }} />
      </head>
      <body>
        {/* Ladeanimation: nur mit Klasse "preload", endet per CSS von selbst (animationen.md AK-7) */}
        {!kunden && (
          <div data-preloader aria-hidden="true" className="preloader">
            <span className="preloader-mark">
              <Logo className="h-4 sm:h-5 w-auto" />
            </span>
            <span className="preloader-bar" />
          </div>
        )}
        <span id="seitenanfang" />
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground"
        >
          {messages[locale].skipLink}
        </a>
        {kunden ? (
          <>
            <KundenLeiste locale={locale} />
            <Hydriert />
          </>
        ) : (
          <Navbar locale={locale} notFound={notFound} />
        )}
        <main id="inhalt" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        {!kunden && <Footer locale={locale} />}
        <RevealObserver />
        {!kunden && <SmoothScroll />}
      </body>
    </html>
  );
}
