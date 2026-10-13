import type { Locale } from '@/lib/i18n';
import { naechsteNummer } from './rechnen';

// Vorbelegung des Dialogs „Angebot erstellen“ (functions/kundenbereich/angebote.md Verhalten 2)

export interface AngebotVorlage {
  nummer: string;
  titel: string;
  sprache: Locale;
  empfaenger: string;
  datum: string;
  gueltig_bis: string;
}

/** Datum in Deutschland als JJJJ-MM-TT */
const tag = (d: Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);

export function angebotVorlage(
  projekt: { titel: string; kunde: string | null; ansprechpartner: { name: string; sprache?: Locale }[] },
  nummern: string[],
  now = new Date(),
): AngebotVorlage {
  const heute = tag(now);
  return {
    nummer: naechsteNummer(nummern, Number(heute.slice(0, 4))),
    titel: projekt.titel,
    sprache: projekt.ansprechpartner[0]?.sprache === 'en' ? 'en' : 'de',
    empfaenger: [projekt.kunde, ...projekt.ansprechpartner.map((a) => a.name)].filter(Boolean).join('\n'),
    datum: heute,
    gueltig_bis: tag(new Date(now.getTime() + 30 * 86_400_000)),
  };
}
