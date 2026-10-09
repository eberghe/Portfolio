import type { ProjektStatus, SchrittStatus } from '../projekte';
import type { KundeZeile } from './laden';

// Kennzahlen und Umsatzprognose für das Dashboard der Verwaltung (functions/kundenbereich/admin-dashboard.md)

export interface Umsatz {
  /** PostgREST liefert numeric als Text */
  auftragswert_netto: string | number | null;
  wahrscheinlichkeit: number;
  abrechnung_am: string | null;
}

export interface DashboardProjekt {
  id: string;
  titel: string;
  status: ProjektStatus;
  kunden: { id: string; name: string } | null;
  projekt_umsatz: Umsatz | null;
  projektschritte: { titel_de: string; status: SchrittStatus; reihenfolge: number; verantwortlich: 'erik' | 'kunde' }[];
}

export interface DashboardTermin {
  id: string;
  beginn: string;
  ende: string;
  titel_de: string | null;
  meet_url: string | null;
  kundenprojekte: { id: string; titel: string; kunden: { name: string } | null } | null;
}

export type AnfrageStatus = 'neu' | 'beantwortet' | 'erledigt';
export const ANFRAGE_STATUS: AnfrageStatus[] = ['neu', 'beantwortet', 'erledigt'];

export interface Anfrage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  telefon: string | null;
  website: string | null;
  leistungen: string[];
  zeitrahmen: string;
  budget: string;
  beschreibung: string;
  status: AnfrageStatus;
  sprache: 'de' | 'en';
}

export interface DashboardDaten {
  projekte: DashboardProjekt[];
  termine: DashboardTermin[];
  anfragen: Anfrage[];
  kunden: KundeZeile[];
}

const SICHER: ProjektStatus[] = ['in_arbeit', 'abstimmung', 'abgeschlossen'];
const AKTIV: ProjektStatus[] = ['in_arbeit', 'abstimmung'];

const wert = (u: Umsatz | null) => {
  const n = u?.auftragswert_netto;
  return n === null || n === undefined || n === '' ? null : Number(n);
};

/** Sicher und gewichtet je Jahr der Abrechnung, lückenlos mit dem laufenden Jahr (AK-2) */
export function umsatzPrognose(projekte: DashboardProjekt[], now = new Date()) {
  const summen = new Map<number, { sicher: number; gewichtet: number }>();
  let ohneAngaben = 0;
  for (const p of projekte) {
    if (p.status === 'pausiert') continue;
    const w = wert(p.projekt_umsatz);
    const datum = p.projekt_umsatz?.abrechnung_am;
    if (w === null || !datum) {
      ohneAngaben++;
      continue;
    }
    const jahr = Number(datum.slice(0, 4));
    const s = summen.get(jahr) ?? { sicher: 0, gewichtet: 0 };
    if (SICHER.includes(p.status)) s.sicher += w;
    else s.gewichtet += (w * (p.projekt_umsatz?.wahrscheinlichkeit ?? 50)) / 100;
    summen.set(jahr, s);
  }
  const aktuell = now.getUTCFullYear();
  const alle = [aktuell, ...summen.keys()];
  const jahre = [];
  for (let j = Math.min(...alle); j <= Math.max(...alle); j++)
    jahre.push({ jahr: j, sicher: summen.get(j)?.sicher ?? 0, gewichtet: summen.get(j)?.gewichtet ?? 0 });
  return { jahre, ohneAngaben };
}

/** Kacheln oben (AK-1) */
export function dashboardKennzahlen(d: DashboardDaten, now = new Date()) {
  const bis = now.getTime() + 7 * 24 * 60 * 60 * 1000;
  const prognose = umsatzPrognose(d.projekte, now);
  const jahr = now.getUTCFullYear();
  const j = prognose.jahre.find((x) => x.jahr === jahr)!;
  return {
    aktiveProjekte: d.projekte.filter((p) => AKTIV.includes(p.status)).length,
    termine7: d.termine.filter((t) => {
      const b = Date.parse(t.beginn);
      return Date.parse(t.ende) > now.getTime() && b <= bis;
    }).length,
    neueAnfragen: d.anfragen.filter((a) => a.status === 'neu').length,
    jahr,
    umsatzJahr: j.sicher + j.gewichtet,
    sicherJahr: j.sicher,
  };
}

const REIHENFOLGE: ProjektStatus[] = ['in_arbeit', 'abstimmung', 'angebot', 'pausiert', 'abgeschlossen'];

/** Nach Status sortiert, mit nächstem offenem Schritt (AK-5) */
export function projekteNachStatus(projekte: DashboardProjekt[]) {
  return [...projekte]
    .sort(
      (a, b) => REIHENFOLGE.indexOf(a.status) - REIHENFOLGE.indexOf(b.status) || a.titel.localeCompare(b.titel, 'de'),
    )
    .map((p) => {
      const s = [...p.projektschritte]
        .sort((a, b) => a.reihenfolge - b.reihenfolge)
        .find((x) => x.status !== 'erledigt');
      return {
        ...p,
        wert: wert(p.projekt_umsatz),
        naechsterSchritt: s ? { titel: s.titel_de, verantwortlich: s.verantwortlich } : null,
      };
    });
}

const EURO = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
export const euro = (n: number) => EURO.format(n);

const PIPELINE: ProjektStatus[] = ['angebot', 'in_arbeit', 'abstimmung', 'pausiert', 'abgeschlossen'];

/** Auftragswert und Anzahl je Status, ungewichtet (admin-aufbau.md AK-4) */
export function auftragswertNachStatus(projekte: DashboardProjekt[]) {
  return PIPELINE.map((status) => {
    const liste = projekte.filter((p) => p.status === status);
    return { status, anzahl: liste.length, wert: liste.reduce((s, p) => s + (wert(p.projekt_umsatz) ?? 0), 0) };
  });
}
