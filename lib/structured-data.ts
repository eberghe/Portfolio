import { services, type Service } from '@/lib/content/services';
import { localizedPath, messages, type Locale } from '@/lib/i18n';
import { SITE_URL, person } from '@/lib/site';

const areaServed = {
  de: [
    { '@type': 'City', name: 'Augsburg' },
    { '@type': 'City', name: 'Innsbruck' },
    { '@type': 'Country', name: 'Deutschland' },
    { '@type': 'Country', name: 'Österreich' },
  ],
  en: [
    { '@type': 'City', name: 'Augsburg' },
    { '@type': 'City', name: 'Innsbruck' },
    { '@type': 'Country', name: 'Germany' },
    { '@type': 'Country', name: 'Austria' },
  ],
};

const absolute = (path: string, locale: Locale) => `${SITE_URL}${localizedPath(path, locale)}`;

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

/** BreadcrumbList Start › Leistungen › Leistung (AK-13) */
export function breadcrumbJsonLd(service: Service, locale: Locale) {
  const crumbs = [
    { name: locale === 'de' ? 'Start' : 'Home', path: '/' },
    { name: messages[locale].nav.services, path: '/services' },
    { name: service[locale].title, path: `/services/${service.slug}` },
  ];
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
