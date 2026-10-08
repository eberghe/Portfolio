'use client';

import { ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { localPages } from '@/lib/content/local';
import { services } from '@/lib/content/services';
import { localizedPath, messages, type Locale } from '@/lib/i18n';
import { EMAIL, INSTAGRAM, LINKEDIN } from '@/lib/site';
import LocalClock from './LocalClock';
import Logo from './Logo';

const NAV_ITEMS = [
  { path: '/projects', key: 'projects' },
  { path: '/services', key: 'services' },
  { path: '/about', key: 'about' },
  { path: '/contact', key: 'contact' },
  { path: '/faqs', key: 'faqs' },
] as const;

// Footer in beschrifteten Spalten (functions/seiten/navigation-und-footer.md AK-25). Texte mindestens white/60
// (7,2:1 auf #0b1219); Links mobil 44 px hoch (AK-13, AK-19), aktuelle Seite sichtbar markiert (AK-20).
const linkClass =
  'inline-flex items-center min-h-11 md:min-h-7 text-[14px] text-white/80 hover:text-white transition-colors aria-[current=page]:text-white aria-[current=page]:underline underline-offset-4';
const headingClass = 'text-[12px] font-bold tracking-widest uppercase text-white/60 mb-3 md:mb-4';

/** „made with 🤍 in augsburg“: Herz für Screenreader als „love“ */
function MadeWith({ text }: { text: string }) {
  const [before, after] = text.split('🤍');
  return (
    <>
      {before}
      <span aria-hidden="true">🤍</span>
      <span className="sr-only">love</span>
      {after}
    </>
  );
}

export default function Footer({ locale }: { locale: Locale }) {
  const nav = messages[locale].nav;
  const t = messages[locale].footer;
  const pathname = usePathname();
  const href = (path: string) => localizedPath(path, locale);
  const current = (path: string) => (pathname === href(path) ? ('page' as const) : undefined);
  const year = 2026;

  const pages = [
    ...NAV_ITEMS.map((item) => ({ path: item.path, label: nav[item.key] })),
    { path: '/impressum', label: t.imprint },
    { path: '/datenschutz', label: t.privacy },
  ];

  return (
    <footer className="relative pt-20 md:pt-28 pb-8 bg-[#0b1219] dark:border-t dark:border-white/10">
      <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12 flex flex-col gap-14 md:gap-20">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]">
          {/* Marke */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href={href('/')}
              aria-label={`Erik Bergheimer – ${nav.home}`}
              className="inline-block py-3 hover:scale-95 transition-transform duration-200 text-white"
            >
              <Logo className="h-3 sm:h-3.5 w-auto" />
            </Link>
            <p className="mt-4 text-[14px] leading-relaxed text-white/60 max-w-[260px]">{t.tagline}</p>
          </div>

          {/* Kontakt */}
          <div>
            <p data-footer-heading className={headingClass}>
              {t.contact}
            </p>
            <ul>
              <li>
                <a href={`mailto:${EMAIL}`} className={linkClass}>
                  {EMAIL}
                </a>
              </li>
              <li>
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Instagram
                </a>
              </li>
              <li>
                <Link href={href('/contact')} aria-current={current('/contact')} className={linkClass}>
                  {t.firstCall}
                </Link>
              </li>
            </ul>
          </div>

          {/* Leistungen (AK-19) */}
          <nav aria-labelledby="footer-leistungen">
            <p id="footer-leistungen" data-footer-heading className={headingClass}>
              {t.services}
            </p>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={href(`/services/${s.slug}`)}
                    aria-current={current(`/services/${s.slug}`)}
                    className={linkClass}
                  >
                    {s[locale].title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Städte */}
          <nav aria-labelledby="footer-regionen">
            <p id="footer-regionen" data-footer-heading className={headingClass}>
              {t.regions}
            </p>
            <ul>
              {localPages.map((p) => (
                <li key={p.path}>
                  <Link href={href(p.path)} aria-current={current(p.path)} className={linkClass}>
                    {p[locale].footerLink}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Seiten: auch Ziel des „Menü“-Links ohne JavaScript (AK-22) */}
          <nav id="footer-nav" aria-label={t.label} className="scroll-mt-24">
            <p data-footer-heading className={headingClass}>
              {t.pages}
            </p>
            <ul>
              {pages.map((p) => (
                <li key={p.path}>
                  <Link href={href(p.path)} aria-current={current(p.path)} className={linkClass}>
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Leiste: Ortszeit links (AK-24), Copyright und Satz, „Nach oben“ rechts */}
        <div className="border-t border-white/10 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="order-3 md:order-1">
            <LocalClock locale={locale} label={t.clockLabel} />
          </div>
          <p className="order-1 md:order-2 text-[12px] text-white/60">
            © {year} Erik Bergheimer
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            <span lang="en">
              <MadeWith text={t.madeWith} />
            </span>
          </p>
          <a
            href="#seitenanfang"
            className="order-2 md:order-3 inline-flex items-center gap-2 min-h-11 w-fit text-[13px] text-white/60 hover:text-white transition-colors"
          >
            <span>{t.backToTop}</span>
            <ArrowUp size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
