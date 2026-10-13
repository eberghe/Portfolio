import type { Locale } from '@/lib/i18n';
import { EMAIL, SITE_URL } from '@/lib/site';

// Feste Texte des Angebots-PDFs (functions/kundenbereich/angebot-pdf.md, Sprachen)

export const ABSENDER = {
  name: 'Erik Bergheimer',
  strasse: 'Weißdornstraße 5',
  ort: '86343 Königsbrunn',
  email: EMAIL,
  web: SITE_URL.replace(/^https:\/\//, ''),
};

const de = {
  lang: 'de-DE',
  land: 'Deutschland',
  angebot: 'Angebot',
  nummer: 'Angebotsnummer',
  datum: 'Datum',
  gueltigBis: 'Gültig bis',
  projekt: 'Projekt',
  an: 'Für',
  einleitung:
    'vielen Dank für dein Interesse. Gern mache ich dir für das Projekt folgendes Angebot. Alle Preise sind Nettopreise.',
  anrede: 'Hallo,',
  pos: 'Nr.',
  leistung: 'Leistung',
  menge: 'Menge',
  einzelpreis: 'Einzelpreis',
  betrag: 'Betrag',
  netto: 'Summe netto',
  ust: (satz: number) => `Umsatzsteuer ${satz} %`,
  keineUst: 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.',
  gesamt: 'Gesamtbetrag',
  bedingungen: 'Bedingungen',
  gueltig: (datum: string) => `Dieses Angebot gilt bis ${datum}.`,
  zahlung: 'Zahlbar innerhalb von 14 Tagen nach Rechnungsstellung ohne Abzug.',
  agbHinweis: 'Es gelten meine Allgemeinen Geschäftsbedingungen (AGB), die diesem Angebot beiliegen.',
  annahme: 'Angebot angenommen',
  ortDatum: 'Ort, Datum',
  unterschrift: 'Unterschrift Auftraggeber',
  hochladen: 'Bitte lade das unterschriebene Angebot in deinem Kundenbereich hoch:',
  kundenbereich: 'erik-bergheimer.de/kunden',
  gruss: 'Ich freue mich auf die Zusammenarbeit.',
  seite: (n: number, von: number) => `Seite ${n} von ${von}`,
  fortsetzung: 'Fortsetzung',
  agbTitel: 'Allgemeine Geschäftsbedingungen',
  agbEntwurf: 'Entwurf, nicht rechtlich geprüft',
};

export type PdfTexte = typeof de;

const en: PdfTexte = {
  ...de,
  lang: 'en-GB',
  land: 'Germany',
  angebot: 'Quote',
  nummer: 'Quote number',
  datum: 'Date',
  gueltigBis: 'Valid until',
  projekt: 'Project',
  an: 'For',
  anrede: 'Hello,',
  einleitung:
    'thank you for your interest. I am happy to make you the following offer for the project. All prices are net.',
  pos: 'No.',
  leistung: 'Service',
  menge: 'Quantity',
  einzelpreis: 'Unit price',
  betrag: 'Amount',
  netto: 'Net total',
  ust: (satz) => `VAT ${satz}%`,
  keineUst: 'No VAT is charged in accordance with Section 19 of the German VAT Act (UStG).',
  gesamt: 'Total',
  bedingungen: 'Terms',
  gueltig: (datum) => `This quote is valid until ${datum}.`,
  zahlung: 'Payable within 14 days of invoicing without deduction.',
  agbHinweis: 'My general terms and conditions, enclosed with this quote, apply.',
  annahme: 'Quote accepted',
  ortDatum: 'Place, date',
  unterschrift: 'Client signature',
  hochladen: 'Please upload the signed quote in your client area:',
  kundenbereich: 'erik-bergheimer.de/en/clients',
  gruss: 'I look forward to working with you.',
  seite: (n, von) => `Page ${n} of ${von}`,
  fortsetzung: 'continued',
};

export const pdfTexte = (locale: Locale) => (locale === 'en' ? en : de);
