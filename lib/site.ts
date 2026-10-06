import { localizedPath, type Locale } from '@/lib/i18n';

export const SITE_URL = 'https://erik-bergheimer.de';
export const EMAIL = 'erb1209@outlook.de';
export const INSTAGRAM = 'https://www.instagram.com/erik.bergheimer/';
export const LINKEDIN = 'https://www.linkedin.com/in/erik-bergheimer/';

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
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Technische Hochschule Ingolstadt',
        alternateName: 'THI',
        sameAs: 'https://www.thi.de',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'Management Center Innsbruck',
        alternateName: 'MCI',
        sameAs: 'https://www.mci.edu',
      },
    ],
    image: `${SITE_URL}/images/about/erik.jpg`,
    knowsLanguage: ['de', 'en'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Weißdornstraße 5',
      postalCode: '86343',
      addressLocality: 'Königsbrunn',
      addressRegion: 'Bayern',
      addressCountry: 'DE',
    },
    workLocation: [
      { '@type': 'Place', name: 'Augsburg' },
      { '@type': 'Country', name: locale === 'de' ? 'Deutschland' : 'Germany' },
    ],
    sameAs: ['https://www.linkedin.com/in/erik-bergheimer/', 'https://www.instagram.com/erik.bergheimer/'],
  } as const;
}
