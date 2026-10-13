import type { Locale } from '@/lib/i18n';

// Beträge eines Angebots in Cent (functions/kundenbereich/angebote.md AK-2)

export interface Position {
  bezeichnung: string;
  beschreibung: string;
  menge: number;
  einheit: string;
  /** netto, in Cent */
  einzelpreis_cent: number;
}

export type UstSatz = 0 | 19;

export function summen(positionen: Position[], ust: UstSatz) {
  const zeilen = positionen.map((p) => Math.round(p.menge * p.einzelpreis_cent));
  const netto = zeilen.reduce((a, b) => a + b, 0);
  const steuer = Math.round((netto * ust) / 100);
  return { zeilen, netto, ust: steuer, gesamt: netto + steuer };
}

/** „1.234,50 €“ bzw. „€1,234.50“ */
export const euro = (cent: number, locale: Locale) =>
  new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'de-DE', { style: 'currency', currency: 'EUR' })
    .format(cent / 100)
    .replace(/ /g, ' ');

/** Menge ohne unnötige Nachkommastellen: „24,5“ bzw. „24.5“ */
export const zahl = (n: number, locale: Locale) =>
  new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'de-DE', { maximumFractionDigits: 2 }).format(n);

/** Nächste freie Nummer im Jahr, z. B. „2026-003“ (angebote.md AK-3) */
export function naechsteNummer(vorhanden: string[], jahr: number) {
  const max = vorhanden
    .map((n) => /^(\d{4})-(\d{3,})$/.exec(n))
    .filter((m) => m && Number(m[1]) === jahr)
    .reduce((a, m) => Math.max(a, Number(m![2])), 0);
  return `${jahr}-${String(max + 1).padStart(3, '0')}`;
}
