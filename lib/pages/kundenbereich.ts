import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import type { KundenBereich } from '@/lib/kundenbereich/bereiche';
import { kundenText } from '@/lib/kundenbereich/text';
import { pageMetadata } from '@/lib/seo';

// Meta-Daten des Kundenbereichs: nie indexieren (functions/kundenbereich/login.md, Sicherheit)
const SEITEN: Record<string, KundenBereich> = {
  '/kunden/ablauf': 'ablauf',
  '/kunden/termine': 'termine',
  '/kunden/dokumente': 'dokumente',
  '/kunden/einstellungen': 'einstellungen',
};

export function kundenMetadata(path: string, locale: Locale): Metadata {
  const t = kundenText[locale];
  // Kritiker Kunden-Dashboard 1: Unterseiten nennen sich im Titel, z. B. „Ablauf | Kundenbereich“
  const seite = SEITEN[path];
  const title = seite ? `${t.nav[seite]} | ${t.nav.label}` : t.metaTitle;
  return {
    ...pageMetadata({ path, locale, title, description: t.metaDescription }),
    robots: { index: false, follow: false },
  };
}
