import type { Locale } from '@/lib/i18n';
import { terminTitel, type Termin } from './termine';

// Projekte des Kundenbereichs aufbereiten (functions/kundenbereich/projektuebersicht.md AK-2)

export type ProjektStatus = 'angebot' | 'in_arbeit' | 'abstimmung' | 'abgeschlossen' | 'pausiert';
export type SchrittStatus = 'offen' | 'aktiv' | 'erledigt';

/** Zeile aus `kundenprojekte` mit eingebetteten Schritten und Kundennamen, wie Supabase sie liefert */
export interface ProjektRow {
  id: string;
  titel: string;
  status: ProjektStatus;
  phase: string | null;
  beschreibung_de: string | null;
  beschreibung_en: string | null;
  website_url: string | null;
  staging_url: string | null;
  kunden: { name: string } | null;
  projektschritte: {
    id: string;
    reihenfolge: number;
    titel_de: string;
    titel_en: string | null;
    beschreibung_de: string | null;
    beschreibung_en: string | null;
    status: SchrittStatus;
    faellig_am: string | null;
    verantwortlich: 'erik' | 'kunde';
  }[];
  termine: {
    id: string;
    beginn: string;
    ende: string;
    titel_de: string | null;
    titel_en: string | null;
    meet_url: string | null;
  }[];
}

/** Abfrage für die REST-Schnittstelle (AK-1) */
export const PROJEKT_SELECT =
  'id,titel,status,phase,beschreibung_de,beschreibung_en,website_url,staging_url,kunden(name),' +
  'projektschritte(id,reihenfolge,titel_de,titel_en,beschreibung_de,beschreibung_en,status,faellig_am,verantwortlich),' +
  'termine(id,beginn,ende,titel_de,titel_en,meet_url)';

export interface Schritt {
  id: string;
  titel: string;
  beschreibung: string | null;
  status: SchrittStatus;
  faelligAm: string | null;
  verantwortlich: 'erik' | 'kunde';
  /** 'de', wenn auf der englischen Seite der deutsche Text einspringt (Kritiker: Sprache von Teilen) */
  titelLang?: 'de';
  beschreibungLang?: 'de';
}

const text = (de: string | null, en: string | null, locale: Locale) => (locale === 'en' ? (en ?? de) : de);
/** Sprache des gezeigten Texts, wenn sie von der Seite abweicht */
export const fallbackLang = (de: string | null, en: string | null, locale: Locale) =>
  locale === 'en' && en == null && de != null ? ('de' as const) : undefined;

export function projektAnsicht(p: ProjektRow, locale: Locale, now = new Date()) {
  const schritte: Schritt[] = [...p.projektschritte]
    .sort((a, b) => a.reihenfolge - b.reihenfolge)
    .map((s) => ({
      id: s.id,
      titel: text(s.titel_de, s.titel_en, locale) ?? s.titel_de,
      beschreibung: text(s.beschreibung_de, s.beschreibung_en, locale),
      status: s.status,
      faelligAm: s.faellig_am,
      verantwortlich: s.verantwortlich,
      titelLang: fallbackLang(s.titel_de, s.titel_en, locale),
      beschreibungLang: fallbackLang(s.beschreibung_de, s.beschreibung_en, locale),
    }));
  const aktuell =
    (schritte.find((s) => s.status === 'aktiv') ?? schritte.find((s) => s.status === 'offen'))?.id ?? null;
  // Kommende Termine, laufende eingeschlossen (termine.md AK-2)
  const termine: Termin[] = p.termine
    .filter((t) => Date.parse(t.ende) >= now.getTime())
    .sort((a, b) => Date.parse(a.beginn) - Date.parse(b.beginn))
    .map((t) => ({
      id: t.id,
      beginn: t.beginn,
      ende: t.ende,
      titel: terminTitel(t.titel_de, t.titel_en, locale),
      meetUrl: t.meet_url,
      titelLang: fallbackLang(t.titel_de, t.titel_en, locale),
    }));
  return {
    id: p.id,
    titel: p.titel,
    kunde: p.kunden?.name ?? null,
    status: p.status,
    phase: p.phase,
    beschreibung: text(p.beschreibung_de, p.beschreibung_en, locale),
    beschreibungLang: fallbackLang(p.beschreibung_de, p.beschreibung_en, locale),
    websiteUrl: p.website_url,
    stagingUrl: p.staging_url,
    schritte,
    aktuell,
    naechste: schritte.filter((s) => s.status !== 'erledigt').slice(0, 3),
    naechsterTermin: termine[0] ?? null,
    weitereTermine: termine.slice(1, 4),
  };
}

/** Gewähltes Projekt, sonst das neueste (AK-6) */
export function waehleProjekt(projekte: ProjektRow[], id: string | undefined) {
  return projekte.find((p) => p.id === id) ?? projekte[0] ?? null;
}

/** Reines Datum (YYYY-MM-DD) ohne Zeitzonenverschiebung */
export function datum(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'de-DE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`));
}
