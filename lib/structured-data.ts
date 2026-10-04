import type { Service } from '@/lib/content/services';
import { localizedPath, type Locale } from '@/lib/i18n';
import { SITE_URL, person } from '@/lib/site';

const areaServed = {
  de: [
    { '@type': 'Country', name: 'Deutschland' },
    { '@type': 'Country', name: 'Österreich' },
  ],
  en: [
    { '@type': 'Country', name: 'Germany' },
    { '@type': 'Country', name: 'Austria' },
  ],
};

/** JSON-LD für eine Leistungsseite (functions/seiten/leistungen.md, AK-3) */
export function serviceJsonLd(service: Service, locale: Locale) {
  const t = service[locale];
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: t.title,
    description: t.description,
    serviceType: t.title,
    url: `${SITE_URL}${localizedPath(`/services/${service.slug}`, locale)}`,
    inLanguage: locale,
    provider: person,
    areaServed: areaServed[locale],
  };
}
