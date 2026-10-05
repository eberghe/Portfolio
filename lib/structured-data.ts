import { faqs } from '@/lib/content/faq';
import type { LocalPage } from '@/lib/content/local';
import type { Project } from '@/lib/content/projects';
import { services, type Service } from '@/lib/content/services';
import { messages, type Locale } from '@/lib/i18n';
import { EMAIL, SITE_URL, absoluteUrl as absolute, person } from '@/lib/site';

const areaServed = {
  de: [
    { '@type': 'City', name: 'Augsburg' },
    { '@type': 'Country', name: 'Deutschland' },
  ],
  en: [
    { '@type': 'City', name: 'Augsburg' },
    { '@type': 'Country', name: 'Germany' },
  ],
};

/** JSON-LD für eine Leistungsseite (functions/seiten/leistungen.md, AK-3, AK-14) */
export function serviceJsonLd(service: Service, locale: Locale) {
  const t = service[locale];
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: t.title,
    description: t.description,
    serviceType: t.label,
    url: absolute(`/services/${service.slug}`, locale),
    inLanguage: locale,
    provider: person(locale),
    areaServed: areaServed[locale],
  };
}

/** ItemList aller Leistungen für die Übersicht (AK-12) */
export function servicesItemListJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s[locale].title,
      url: absolute(`/services/${s.slug}`, locale),
    })),
  };
}

function breadcrumbList(crumbs: { name: string; path: string }[], locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absolute(c.path, locale),
    })),
  };
}

const home = (locale: Locale) => ({ name: locale === 'de' ? 'Start' : 'Home', path: '/' });

/** BreadcrumbList Start › Leistungen › Leistung (leistungen.md AK-13) */
export function breadcrumbJsonLd(service: Service, locale: Locale) {
  return breadcrumbList(
    [
      home(locale),
      { name: messages[locale].nav.services, path: '/services' },
      { name: service[locale].title, path: `/services/${service.slug}` },
    ],
    locale,
  );
}

/** CreativeWork je Projekt (projekte.md AK-4) */
export function projectJsonLd(project: Project, locale: Locale) {
  const t = project[locale];
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: t.title,
    headline: t.tagline,
    description: t.metaDescription,
    url: absolute(`/projects/${project.slug}`, locale),
    image: `${SITE_URL}${project.thumbnail.src}`,
    inLanguage: locale,
    dateCreated: project.year.slice(0, 4),
    genre: t.type,
    author: person(locale),
  };
}

/** ItemList aller Projekte für die Übersicht (projekte.md AK-11) */
export function projectsItemListJsonLd(locale: Locale, list: Project[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: list.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p[locale].title,
      url: absolute(`/projects/${p.slug}`, locale),
    })),
  };
}

/** BreadcrumbList Start › Projekte › Projekt (projekte.md AK-4) */
export function projectBreadcrumbJsonLd(project: Project, locale: Locale) {
  return breadcrumbList(
    [
      home(locale),
      { name: messages[locale].nav.projects, path: '/projects' },
      { name: project[locale].title, path: `/projects/${project.slug}` },
    ],
    locale,
  );
}

/** FAQPage aus beliebigen Fragen (leistungen.md AK-22): sichtbarer Text und Schema aus denselben Daten */
export function faqListJsonLd(items: { q: string; a: string }[], locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** FAQPage (faq.md AK-3) */
export function faqJsonLd(locale: Locale) {
  return faqListJsonLd(
    faqs.map((f) => f[locale]),
    locale,
  );
}

/** ProfilePage für Über mich (ueber-mich.md AK-2) */
export function profilePageJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: absolute('/about', locale),
    inLanguage: locale,
    mainEntity: person(locale),
  };
}

/** ContactPage (kontakt.md AK-3) */
export function contactPageJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: locale === 'de' ? 'Kontakt & Projektanfrage' : 'Contact & project enquiry',
    url: absolute('/contact', locale),
    inLanguage: locale,
    about: { '@id': `${SITE_URL}/#person` },
    mainEntity: {
      ...person(locale),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: locale === 'de' ? 'Projektanfragen' : 'Project enquiries',
        email: EMAIL,
        availableLanguage: ['de', 'en'],
      },
    },
  };
}

/** ProfessionalService mit Stadt als Einsatzgebiet (staedte-landingpages.md AK-2) */
export function localJsonLd(page: LocalPage, locale: Locale) {
  const t = page[locale];
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `Erik Bergheimer – ${t.title.replace(` in ${page.city}`, '')}`,
    description: t.metaDescription,
    url: absolute(page.path, locale),
    address: { ...person(locale).address, streetAddress: undefined },
    inLanguage: locale,
    email: EMAIL,
    provider: person(locale),
    areaServed: [
      { '@type': 'City', name: page.city },
      page.country ? { '@type': 'Country', name: page.country[locale] } : areaServed[locale][1],
    ],
  };
}

/** BreadcrumbList Start › Landingpage (staedte-landingpages.md AK-2) */
export function localBreadcrumbJsonLd(page: LocalPage, locale: Locale) {
  return breadcrumbList([home(locale), { name: page[locale].title, path: page.path }], locale);
}
