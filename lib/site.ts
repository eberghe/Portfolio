import { localizedPath, type Locale } from '@/lib/i18n';

export const SITE_URL = 'https://erik-bergheimer.de';
export const EMAIL = 'erb1209@outlook.de';

/** Absolute URL; die Startseite ohne Schrägstrich am Ende (functions/seo/meta-und-schema.md AK-6) */
export const absoluteUrl = (path: string, locale: Locale) => {
  const p = localizedPath(path, locale);
  return p === '/' ? SITE_URL : `${SITE_URL}${p}`;
};

const jobTitle = {
  de: 'UX/UI-Designer & Webflow-Entwickler',
  en: 'UX/UI Designer & Webflow Developer',
};

/** Person-Objekt für JSON-LD mit fester @id, `jobTitle` in der Sprache der Seite (AK-7) */
export function person(locale: Locale) {
  return {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Erik Bergheimer',
    url: SITE_URL,
    email: EMAIL,
    jobTitle: jobTitle[locale],
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Technische Hochschule Ingolstadt' },
    image: `${SITE_URL}/images/about/erik.jpg`,
    knowsLanguage: ['de', 'en'],
    workLocation: [
      { '@type': 'Place', name: 'Augsburg' },
      { '@type': 'Country', name: 'Deutschland' },
    ],
    sameAs: ['https://www.linkedin.com/in/erik-bergheimer/', 'https://www.instagram.com/erik.bergheimer/'],
  } as const;
}
