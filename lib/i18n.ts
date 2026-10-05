export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

/** Englische Slugs, wo sie vom deutschen abweichen (functions/mehrsprachigkeit/de-en.md) */
const enSlugs: Record<string, string> = {
  '/impressum': '/imprint',
  '/datenschutz': '/privacy',
  '/webdesign-augsburg': '/web-design-augsburg',
  '/webdesign-muenchen': '/web-design-munich',
  '/webdesign-stuttgart': '/web-design-stuttgart',
  '/webdesign-innsbruck': '/web-design-innsbruck',
  '/webdesign-kempten': '/web-design-kempten',
};
const deSlugs = Object.fromEntries(Object.entries(enSlugs).map(([de, en]) => [en, de]));

/** Sprachneutraler (deutscher) Pfad ("/about") → URL der Sprache ("/about" bzw. "/en/about"). */
export function localizedPath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return path === '/' ? `/${locale}` : `/${locale}${enSlugs[path] ?? path}`;
}

/** URL → Sprache und sprachneutraler Pfad. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}`) return { locale, path: '/' };
    if (pathname.startsWith(`/${locale}/`)) {
      const path = pathname.slice(locale.length + 1);
      return { locale, path: deSlugs[path] ?? path };
    }
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
    regions: 'Webdesign nach Stadt',
    services: 'Leistungen',
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
    regions: 'Web design by city',
    services: 'Services',
    madeWith: 'made with 🤍 in augsburg',
    backToTop: 'Back to top',
    email: 'Email',
  },
};

export const messages: Record<Locale, Messages> = { de, en };
