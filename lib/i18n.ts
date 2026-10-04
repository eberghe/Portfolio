export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

/** Sprachneutraler Pfad ("/about") → URL der Sprache ("/about" bzw. "/en/about"). */
export function localizedPath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/** URL → Sprache und sprachneutraler Pfad. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}`) return { locale, path: '/' };
    if (pathname.startsWith(`/${locale}/`)) return { locale, path: pathname.slice(locale.length + 1) };
  }
  return { locale: defaultLocale, path: pathname };
}

/** Dieselbe Seite in einer anderen Sprache. */
export function alternatePath(pathname: string, target: Locale): string {
  return localizedPath(splitLocale(pathname).path, target);
}

const de = {
  skipLink: 'Zum Inhalt springen',
  nav: {
    label: 'Hauptnavigation',
    home: 'Startseite',
    projects: 'Projekte',
    services: 'Leistungen',
    about: 'Über mich',
    faqs: 'FAQs',
    contact: 'Kontakt',
    menu: 'Menü',
    darkMode: 'Dunkelmodus',
    switchLanguage: 'English',
  },
  footer: {
    label: 'Fußzeile',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    madeWith: 'made with 🤍 in augsburg',
    backToTop: 'Nach oben',
    email: 'E-Mail',
  },
};

type Messages = typeof de;

const en: Messages = {
  skipLink: 'Skip to content',
  nav: {
    label: 'Main navigation',
    home: 'Home',
    projects: 'Projects',
    services: 'Services',
    about: 'About',
    faqs: 'FAQs',
    contact: 'Contact',
    menu: 'Menu',
    darkMode: 'Dark mode',
    switchLanguage: 'Deutsch',
  },
  footer: {
    label: 'Footer',
    imprint: 'Imprint',
    privacy: 'Privacy',
    madeWith: 'made with 🤍 in augsburg',
    backToTop: 'Back to top',
    email: 'Email',
  },
};

export const messages: Record<Locale, Messages> = { de, en };
