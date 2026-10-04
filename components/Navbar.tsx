'use client';

import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { alternatePath, localizedPath, messages, type Locale } from '@/lib/i18n';
import Logo from './Logo';

const NAV_ITEMS = [
  { path: '/projects', key: 'projects' },
  { path: '/services', key: 'services' },
  { path: '/about', key: 'about' },
  { path: '/faqs', key: 'faqs' },
] as const;

/** notFound: auf der 404 ist kein Menüpunkt aktiv, der Sprachwechsel führt zur anderen Startseite (nicht-gefunden.md AK-6) */
export default function Navbar({ locale, notFound = false }: { locale: Locale; notFound?: boolean }) {
  const t = messages[locale].nav;
  const realPath = usePathname();
  const pathname = notFound ? '' : realPath;
  const otherLocale: Locale = locale === 'de' ? 'en' : 'de';
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Zustand aus dem Theme-Skript im <head> übernehmen (siehe ThemeScript)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- einmaliger Abgleich mit dem DOM nach dem Hydrieren
    setDark(document.documentElement.classList.contains('dark'));
    // Signal für E2E-Tests: interaktive Elemente sind bereit
    document.documentElement.dataset.hydrated = 'true';
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Menü bei Seitenwechsel schließen
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = 'hidden';
    // Alles außer Header und Menü unerreichbar machen, solange das Menü offen ist
    const background = Array.from(document.body.children).filter(
      (el) => el.tagName !== 'HEADER' && el.id !== 'mobile-menu' && el.tagName !== 'SCRIPT',
    ) as HTMLElement[];
    background.forEach((el) => (el.inert = true));
    const desktop = window.matchMedia('(min-width: 768px)');
    const onBreakpoint = () => {
      if (desktop.matches) setMobileOpen(false);
    };
    desktop.addEventListener('change', onBreakpoint);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      // Fokus zwischen Header und Menü im Kreis führen
      const focusables = Array.from(
        document.querySelectorAll<HTMLElement>('header a[href], header button, #mobile-menu a[href]'),
      ).filter((el) => el.offsetParent !== null);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      background.forEach((el) => (el.inert = false));
      desktop.removeEventListener('change', onBreakpoint);
      document.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  // Beim Runterscrollen ausblenden, beim Hochscrollen einblenden
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (!mobileOpen) setHidden(y > lastScrollY.current && y > 80);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // Speichern nicht möglich (z. B. privater Modus): Wahl gilt nur für diese Seite
    }
  };

  const isActive = (path: string) => pathname === localizedPath(path, locale);
  // Unterseiten (z. B. /services/<slug>) markieren ihren Bereich: aria-current="true" statt "page"
  const inSection = (path: string) => path !== '/' && pathname.startsWith(`${localizedPath(path, locale)}/`);
  const current = (path: string) => (isActive(path) ? 'page' : inSection(path) ? 'true' : undefined);
  const linkClass = (active: boolean) =>
    active
      ? 'bg-primary-light dark:bg-white/10 text-primary-text dark:text-white font-medium'
      : 'text-text2 hover:bg-bg2 hover:text-foreground';

  return (
    <>
      <header
        className={`sticky top-0 z-[100] bg-background/95 backdrop-blur-md border-b border-border motion-safe:transition-transform motion-safe:duration-300 ${
          hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <nav aria-label={t.label} className="flex items-center justify-between gap-2 px-4 sm:px-6 md:px-8 h-16">
          <Link
            href={localizedPath('/', locale)}
            aria-label={`Erik Bergheimer – ${t.home}`}
            className="shrink-0 py-3 text-foreground hover:scale-95 transition-transform duration-200"
          >
            <Logo className="h-3 sm:h-3.5 w-auto" />
          </Link>

          <ul className="hidden md:flex gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path) || inSection(item.path);
              return (
                <li key={item.path}>
                  <Link
                    href={localizedPath(item.path, locale)}
                    aria-current={current(item.path)}
                    className={`block whitespace-nowrap px-3.5 py-2 rounded-lg text-[13px] transition duration-150 ${linkClass(active)}`}
                  >
                    {t[item.key]}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={notFound ? localizedPath('/', otherLocale) : alternatePath(pathname, otherLocale)}
              hrefLang={otherLocale}
              lang={otherLocale}
              className="h-9 min-w-9 px-2 sm:px-2.5 rounded-lg border border-border flex items-center justify-center text-[13px] text-text2 hover:bg-bg2 hover:text-foreground hover:border-muted-foreground transition"
            >
              <span aria-hidden="true" className="sm:hidden">
                {otherLocale.toUpperCase()}
              </span>
              <span className="sr-only sm:not-sr-only">{t.switchLanguage}</span>
            </a>

            <button
              type="button"
              onClick={toggleDark}
              aria-pressed={dark}
              aria-label={t.darkMode}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text2 hover:bg-bg2 hover:text-foreground hover:border-muted-foreground transition"
            >
              {dark ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
            </button>

            <Link
              href={localizedPath('/contact', locale)}
              aria-current={isActive('/contact') ? 'page' : undefined}
              className="hidden md:inline-flex bg-primary text-primary-foreground px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-primary-hover transition-colors"
            >
              {t.contact}
            </Link>

            <button
              ref={burgerRef}
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={t.menu}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1"
            >
              <span
                aria-hidden="true"
                className={`block w-4 h-0.5 bg-foreground transition ${mobileOpen ? 'rotate-45 translate-y-[3px]' : ''}`}
              />
              <span
                aria-hidden="true"
                className={`block w-4 h-0.5 bg-foreground transition ${mobileOpen ? '-rotate-45 -translate-y-[3px]' : ''}`}
              />
            </button>
          </div>
        </nav>
      </header>
      <div
        id="mobile-menu"
        hidden={!mobileOpen}
        className="fixed inset-x-0 bottom-0 top-16 bg-background px-6 py-8 md:hidden z-[100] overflow-y-auto motion-safe:animate-fade-in"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <nav aria-label={t.menu}>
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path) || inSection(item.path);
              return (
                <li key={item.path}>
                  <Link
                    href={localizedPath(item.path, locale)}
                    aria-current={current(item.path)}
                    className={`block px-4 py-4 rounded-lg text-lg ${linkClass(active)}`}
                  >
                    {t[item.key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <Link
          href={localizedPath('/contact', locale)}
          className="mt-6 block bg-primary text-primary-foreground px-4 py-4 rounded-lg text-lg font-medium text-center hover:bg-primary-hover"
        >
          {t.contact}
        </Link>
      </div>
    </>
  );
}
