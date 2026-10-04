import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { overviewText } from '@/components/services/ServicesOverview';
import { services } from '@/lib/content/services';
import type { Locale } from '@/lib/i18n';

// Gemeinsame Logik der DE- und EN-Routen für Leistungen (functions/seiten/leistungen.md)
const suffix = { de: 'Leistung', en: 'Service' };

export const serviceStaticParams = () => services.map((s) => ({ slug: s.slug }));

export function findService(slug: string) {
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();
  return service;
}

export function serviceMetadata(slug: string, locale: Locale): Metadata {
  const t = findService(slug)[locale];
  return { title: `${t.title} – ${suffix[locale]} | Erik Bergheimer`, description: t.short };
}

export function overviewMetadata(locale: Locale): Metadata {
  return { title: overviewText[locale].metaTitle, description: overviewText[locale].metaDescription };
}
