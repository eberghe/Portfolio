import type { Metadata } from 'next';
import { services } from '@/lib/content/services';
import { localizedPath, type Locale } from '@/lib/i18n';
import { SITE_URL, person } from '@/lib/site';

// Meta-Daten aller Seiten, siehe functions/seo/meta-und-schema.md
const ogLocale: Record<Locale, string> = { de: 'de_DE', en: 'en_US' };
const DEFAULT_IMAGE = '/images/hero-erik.png';

export const absoluteUrl = (path: string, locale: Locale) => {
  const p = localizedPath(path, locale);
  return `${SITE_URL}${p}`;
};

interface PageMeta {
  /** Pfad ohne Sprachpräfix, z. B. "/services/accessibility" */
  path: string;
  locale: Locale;
  title: string;
  description: string;
  /** Vorschaubild, Standard: Porträt */
  image?: string;
}

/** Title, Description, Canonical, hreflang, Open Graph und Twitter Card (AK-1) */
export function pageMetadata({ path, locale, title, description, image = DEFAULT_IMAGE }: PageMeta): Metadata {
  const url = absoluteUrl(path, locale);
  const other: Locale = locale === 'de' ? 'en' : 'de';
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { de: absoluteUrl(path, 'de'), en: absoluteUrl(path, 'en'), 'x-default': absoluteUrl(path, 'de') },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Erik Bergheimer',
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[other]],
      type: 'website',
      images: [{ url: `${SITE_URL}${image}` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}${image}`] },
  };
}

const areaServed = {
  de: ['Augsburg', 'Innsbruck', 'Deutschland', 'Österreich'],
  en: ['Augsburg', 'Innsbruck', 'Germany', 'Austria'],
};

/** Person und ProfessionalService für die Startseite (AK-2) */
export function homeJsonLd(locale: Locale) {
  const personNode = { ...person(locale), '@id': `${SITE_URL}/#person` };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personNode,
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#service`,
        name: 'Erik Bergheimer',
        url: absoluteUrl('/', locale),
        image: `${SITE_URL}${DEFAULT_IMAGE}`,
        founder: { '@id': personNode['@id'] },
        areaServed: areaServed[locale].map((name, i) => ({ '@type': i < 2 ? 'City' : 'Country', name })),
        knowsAbout: services.map((s) => s[locale].title),
      },
    ],
  };
}
