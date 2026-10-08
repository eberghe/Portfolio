import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { kundenText } from '@/lib/kundenbereich/text';
import { pageMetadata } from '@/lib/seo';

// Meta-Daten des Kundenbereichs: nie indexieren (functions/kundenbereich/login.md, Sicherheit)
export function kundenMetadata(path: string, locale: Locale): Metadata {
  const t = kundenText[locale];
  return {
    ...pageMetadata({ path, locale, title: t.metaTitle, description: t.metaDescription }),
    robots: { index: false, follow: false },
  };
}
