import type { Project } from '@/lib/content/projects';
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
