'use client';

import { ArrowUp, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { localPages } from '@/lib/content/local';
import { services } from '@/lib/content/services';
import { localizedPath, messages, type Locale } from '@/lib/i18n';
import { EMAIL, INSTAGRAM, LINKEDIN } from '@/lib/site';
import Instagram from './icons/Instagram';
import Linkedin from './icons/Linkedin';
import LocalClock from './LocalClock';
import Logo from './Logo';

const NAV_ITEMS = [
  { path: '/projects', key: 'projects' },
  { path: '/services', key: 'services' },
  { path: '/about', key: 'about' },
  { path: '/contact', key: 'contact' },
  { path: '/faqs', key: 'faqs' },
] as const;

// Leistungs- und Stadtlinks: mobil 44 px Tippfläche, aktuelle Seite sichtbar markiert (AK-19, AK-20)
const groupLink =
  'inline-flex items-center min-h-11 md:min-h-6 text-[13px] text-white/60 hover:text-white transition-colors aria-[current=page]:text-white aria-[current=page]:underline underline-offset-4';

// Footer-Texte mindestens white/60 (7,2:1 auf #0b1219), siehe functions/seiten/navigation-und-footer.md
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

  const socials = [
    { icon: Instagram, label: 'Instagram', href: INSTAGRAM },
    { icon: Linkedin, label: 'LinkedIn', href: LINKEDIN },
    { icon: Mail, label: t.email, href: `mailto:${EMAIL}` },
  ];

  return (
    <footer className="relative py-20 md:py-28 bg-[#0b1219] dark:border-t dark:border-white/10">
      <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12 flex flex-col gap-10 md:gap-20">
        <div className="flex flex-wrap items-center justify-between gap-y-6">
          <Link
            href={href('/')}
            aria-label={`Erik Bergheimer – ${nav.home}`}
            className="py-3 hover:scale-95 transition-transform duration-200 w-fit shrink-0 text-white"
          >
            <Logo className="h-3 sm:h-3.5 w-auto" />
          </Link>
          <nav aria-label={t.label} className="hidden md:block">
            <ul className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    href={href(item.path)}
                    aria-current={current(item.path)}
                    className="inline-block py-1 text-[13px] text-white/60 hover:text-white transition-colors aria-[current=page]:text-white aria-[current=page]:underline underline-offset-4"
                  >
                    {nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex gap-1 md:gap-4">
            {socials.map(({ icon: Icon, label, href: url }) => (
              <li key={label}>
                <a
                  href={url}
                  aria-label={label}
                  className="flex items-center justify-center min-w-11 min-h-11 md:min-w-6 md:min-h-6 text-white/60 hover:text-white transition-colors"
                  {...(url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav id="footer-nav" aria-label={t.label} className="md:hidden scroll-mt-24">
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <Link
                  href={href(item.path)}
                  aria-current={current(item.path)}
                  className="inline-flex items-center min-h-11 text-base text-white/60 hover:text-white transition-colors aria-[current=page]:text-white aria-[current=page]:underline underline-offset-4"
                >
                  {nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Leistungen und Städte nebeneinander (AK-19) */}
        <div className="grid md:grid-cols-2 gap-10">
          <nav aria-labelledby="footer-leistungen">
            <p id="footer-leistungen" className="text-[12px] font-bold tracking-widest uppercase text-white/60 mb-3">
              {t.services}
            </p>
            <ul className="flex flex-wrap gap-x-6 md:gap-y-1">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={href(`/services/${s.slug}`)}
                    aria-current={current(`/services/${s.slug}`)}
                    className={groupLink}
                  >
                    {s[locale].title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-labelledby="footer-regionen">
            <p id="footer-regionen" className="text-[12px] font-bold tracking-widest uppercase text-white/60 mb-3">
              {t.regions}
            </p>
            <ul className="flex flex-wrap gap-x-6 md:gap-y-1">
              {localPages.map((p) => (
                <li key={p.path}>
                  <Link href={href(p.path)} aria-current={current(p.path)} className={groupLink}>
                    {p[locale].footerLink}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col gap-3">
          <div className="hidden md:flex items-center w-full">
            <div className="flex items-center gap-4">
              <Link
                href={href('/impressum')}
                className="inline-block py-1 text-[12px] text-white/60 hover:text-white transition-colors"
              >
                {t.imprint}
              </Link>
              <Link
                href={href('/datenschutz')}
                className="inline-block py-1 text-[12px] text-white/60 hover:text-white transition-colors"
              >
                {t.privacy}
              </Link>
            </div>
            <p lang="en" className="text-[12px] text-white/60 flex-1 text-center">
              <MadeWith text={t.madeWith} />
            </p>
            <p className="text-[12px] text-white/60">© {year}, Erik Bergheimer</p>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 w-full">
              <Link
                href={href('/impressum')}
                className="inline-block py-1 text-[12px] text-white/60 hover:text-white transition-colors"
              >
                {t.imprint}
              </Link>
              <Link
                href={href('/datenschutz')}
                className="inline-block py-1 text-[12px] text-white/60 hover:text-white transition-colors"
              >
                {t.privacy}
              </Link>
              <p className="text-[12px] text-white/60">© {year}, Erik Bergheimer</p>
            </div>
            <div className="flex items-center justify-between w-full mt-6">
              <p lang="en" className="text-[12px] text-white/60">
                <MadeWith text={t.madeWith} />
              </p>
              <a
                href="#seitenanfang"
                aria-label={t.backToTop}
                className="flex items-center justify-center min-w-11 min-h-11 md:min-w-6 md:min-h-6 text-white/60 hover:text-white transition-colors"
              >
                <ArrowUp size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Ortszeit in Augsburg (AK-23), ab 768 px unten links in der Ecke gegenüber „Nach oben“ (AK-24) */}
          <div className="md:absolute md:bottom-8 md:left-12">
            <LocalClock locale={locale} label={t.clockLabel} />
          </div>
        </div>
      </div>

      <a
        href="#seitenanfang"
        className="hidden md:flex absolute bottom-8 right-8 md:right-12 items-center gap-2 text-[13px] text-white/60 hover:text-white transition-colors"
      >
        <span>{t.backToTop}</span>
        <ArrowUp size={16} aria-hidden="true" />
      </a>
    </footer>
  );
}
