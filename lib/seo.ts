import type { Metadata } from 'next';
import { services } from '@/lib/content/services';
import type { Locale } from '@/lib/i18n';
import { EMAIL, SITE_URL, absoluteUrl, person } from '@/lib/site';

export { absoluteUrl };

// Meta-Daten aller Seiten, siehe functions/seo/meta-und-schema.md
// Englische Texte nutzen britische Schreibweise (optimisation, analyse)
const ogLocale: Record<Locale, string> = { de: 'de_DE', en: 'en_GB' };
const DEFAULT_IMAGE = '/images/og-erik.jpg';

interface PageMeta {
  /** Pfad ohne Sprachpräfix, z. B. "/services/accessibility" */
  path: string;
  locale: Locale;
  title: string;
  description: string;
  /** Vorschaubild, Standard: Porträt im Format 1200 × 630 */
  image?: string;
  /** Open-Graph-Typ, Projekte: article */
  type?: 'website' | 'article';
}

/** Title, Description, Canonical, hreflang, Open Graph und Twitter Card (AK-1) */
export function pageMetadata({
  path,
  locale,
  title,
  description,
  image = DEFAULT_IMAGE,
  type = 'website',
}: PageMeta): Metadata {
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
      type,
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
  const personNode = person(locale);
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
        email: EMAIL,
        founder: { '@id': personNode['@id'] },
        areaServed: areaServed[locale].map((name, i) => ({ '@type': i < 2 ? 'City' : 'Country', name })),
        knowsAbout: services.map((s) => s[locale].title),
      },
    ],
  };
}
