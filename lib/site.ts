import type { Locale } from '@/lib/i18n';

export const SITE_URL = 'https://erik-bergheimer.de';

const jobTitle = {
  de: 'UX/UI-Designer & Webflow-Entwickler',
  en: 'UX/UI Designer & Webflow Developer',
};

/** Person-Objekt für JSON-LD, `jobTitle` in der Sprache der Seite */
export function person(locale: Locale) {
  return {
    '@type': 'Person',
    name: 'Erik Bergheimer',
    url: SITE_URL,
    jobTitle: jobTitle[locale],
    sameAs: ['https://www.linkedin.com/in/erik-bergheimer/', 'https://www.instagram.com/erik.bergheimer/'],
  } as const;
}
