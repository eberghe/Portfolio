import { contactText } from '@/lib/content/contact';
import type { Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';

// Meta-Daten der Kontaktseite (functions/seiten/kontakt.md AK-1)
export const contactMetadata = (locale: Locale) =>
  pageMetadata({
    path: '/contact',
    locale,
    title: contactText[locale].metaTitle,
    description: contactText[locale].metaDescription,
  });
