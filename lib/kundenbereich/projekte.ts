import type { Locale } from '@/lib/i18n';

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
}

/** Abfrage für die REST-Schnittstelle (AK-1) */
export const PROJEKT_SELECT =
  'id,titel,status,phase,beschreibung_de,beschreibung_en,website_url,staging_url,kunden(name),' +
  'projektschritte(id,reihenfolge,titel_de,titel_en,beschreibung_de,beschreibung_en,status,faellig_am,verantwortlich)';

export interface Schritt {
  id: string;
  titel: string;
  beschreibung: string | null;
  status: SchrittStatus;
  faelligAm: string | null;
  verantwortlich: 'erik' | 'kunde';
}

const text = (de: string | null, en: string | null, locale: Locale) => (locale === 'en' ? (en ?? de) : de);

export function projektAnsicht(p: ProjektRow, locale: Locale) {
  const schritte: Schritt[] = [...p.projektschritte]
    .sort((a, b) => a.reihenfolge - b.reihenfolge)
    .map((s) => ({
      id: s.id,
      titel: text(s.titel_de, s.titel_en, locale) ?? s.titel_de,
      beschreibung: text(s.beschreibung_de, s.beschreibung_en, locale),
      status: s.status,
      faelligAm: s.faellig_am,
      verantwortlich: s.verantwortlich,
    }));
  const aktuell =
    (schritte.find((s) => s.status === 'aktiv') ?? schritte.find((s) => s.status === 'offen'))?.id ?? null;
  return {
    id: p.id,
    titel: p.titel,
    kunde: p.kunden?.name ?? null,
    status: p.status,
    phase: p.phase,
    beschreibung: text(p.beschreibung_de, p.beschreibung_en, locale),
    websiteUrl: p.website_url,
    stagingUrl: p.staging_url,
    schritte,
    aktuell,
    naechste: schritte.filter((s) => s.status !== 'erledigt').slice(0, 3),
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
