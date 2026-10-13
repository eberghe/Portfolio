import { localizedPath, type Locale } from '@/lib/i18n';

// Seiten des Kundenbereichs nach der Anmeldung (functions/kundenbereich/kunden-sidebar.md Verhalten 2, 3)

export const KUNDEN_BEREICHE = ['uebersicht', 'ablauf', 'termine', 'dokumente', 'einstellungen'] as const;
export type KundenBereich = (typeof KUNDEN_BEREICHE)[number];

const PFADE: Record<KundenBereich, string> = {
  uebersicht: '/kunden',
  ablauf: '/kunden/ablauf',
  termine: '/kunden/termine',
  dokumente: '/kunden/dokumente',
  einstellungen: '/kunden/einstellungen',
};

/** Adresse eines Bereichs in der Sprache, mit der gewählten Projekt-ID (AK-2) */
export function bereichPfad(bereich: KundenBereich, locale: Locale, projekt?: string) {
  const pfad = localizedPath(PFADE[bereich], locale);
  return projekt ? `${pfad}?projekt=${encodeURIComponent(projekt)}` : pfad;
}
