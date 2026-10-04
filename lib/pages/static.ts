import type { Metadata } from 'next';
import { faqText } from '@/components/faq/FaqPage';
import { aboutContent } from '@/lib/content/about';
import { legal, type LegalKind } from '@/lib/content/legal';
import type { Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';

// Meta-Daten der einfachen Seiten (functions/seiten/rechtliches.md, faq.md, ueber-mich.md)
export function legalMetadata(kind: LegalKind, locale: Locale): Metadata {
  const t = legal[kind][locale];
  return {
    ...pageMetadata({ path: `/${kind}`, locale, title: t.metaTitle, description: t.metaDescription }),
    robots: { index: false, follow: true },
  };
}

export const faqMetadata = (locale: Locale) =>
  pageMetadata({
    path: '/faqs',
    locale,
    title: faqText[locale].metaTitle,
    description: faqText[locale].metaDescription,
  });

export const aboutMetadata = (locale: Locale) =>
  pageMetadata({
    path: '/about',
    locale,
    title: aboutContent[locale].metaTitle,
    description: aboutContent[locale].metaDescription,
  });
