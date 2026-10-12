import type { Locale } from '@/lib/i18n';
import { contactText } from '@/lib/content/contact';
import { services } from '@/lib/content/services';
import type { ProjektStatus } from '../projekte';
import type { Anfrage } from './dashboard';
import {
  ansprechpartnerDaten,
  istId,
  kundeDaten,
  projektDaten,
  terminDaten,
  umsatzDaten,
  type Ergebnis,
} from './pruefen';

// Projekt-Assistent: Daten, Vorbelegung, Prüfung je Schritt (functions/kundenbereich/projekt-assistent.md).
// Ohne Server-Abhängigkeiten, damit Browser (Weiter) und Server (Anlegen) dieselben Regeln nutzen.

export const SCHRITTE = ['Kunde', 'Projekt', 'Ansprechpartner', 'Ablauf', 'Termin', 'Prüfen'] as const;

export interface NeuerAnsprechpartner {
  name: string;
  email: string;
  rolle: string;
  telefon: string;
  sprache: Locale;
}
export interface AblaufSchritt {
  titel_de: string;
  titel_en: string;
  verantwortlich: 'erik' | 'kunde';
}
export interface AssistentDaten {
  kunde: { modus: 'bestehend' | 'neu'; id: string; name: string; website_url: string };
  projekt: {
    titel: string;
    status: ProjektStatus;
    phase: string;
    beschreibung_de: string;
    beschreibung_en: string;
    website_url: string;
    staging_url: string;
    auftragswert_netto: string;
    wahrscheinlichkeit: string;
    abrechnung_am: string;
  };
  ansprechpartner: { ids: string[]; neu: NeuerAnsprechpartner[] };
  einladen: boolean;
  schritte: AblaufSchritt[];
  termin: null | { datum: string; beginn: string; ende: string; titel_de: string; titel_en: string; meet_url: string };
  anfrage_id?: string;
}

export interface AssistentKunde {
  id: string;
  name: string;
  ansprechpartner: { id: string; name: string; email: string }[];
}

export const STANDARD_ABLAUF: AblaufSchritt[] = [
  { titel_de: 'Kennenlernen', titel_en: 'Getting to know each other', verantwortlich: 'erik' },
  { titel_de: 'Analyse & Angebot', titel_en: 'Analysis & proposal', verantwortlich: 'erik' },
  { titel_de: 'Konzept', titel_en: 'Concept', verantwortlich: 'erik' },
  { titel_de: 'Design', titel_en: 'Design', verantwortlich: 'erik' },
  { titel_de: 'Umsetzung', titel_en: 'Build', verantwortlich: 'erik' },
  { titel_de: 'Test & Launch', titel_en: 'Testing & launch', verantwortlich: 'erik' },
];
export const MAX_SCHRITTE = 30;

export const leererAssistent = (): AssistentDaten => ({
  kunde: { modus: 'neu', id: '', name: '', website_url: '' },
  projekt: {
    titel: '',
    status: 'angebot',
    phase: '',
    beschreibung_de: '',
    beschreibung_en: '',
    website_url: '',
    staging_url: '',
    auftragswert_netto: '',
    wahrscheinlichkeit: '50',
    abrechnung_am: '',
  },
  ansprechpartner: { ids: [], neu: [] },
  einladen: false,
  schritte: STANDARD_ABLAUF.map((s) => ({ ...s })),
  termin: null,
});

export const leererTermin = () => ({
  datum: '',
  beginn: '10:00',
  ende: '11:00',
  titel_de: '',
  titel_en: '',
  meet_url: '',
});
export const leererAnsprechpartner = (): NeuerAnsprechpartner => ({
  name: '',
  email: '',
  rolle: '',
  telefon: '',
  sprache: 'de',
});

const leistung = (slug: string) =>
  services.find((s) => s.slug === slug)?.de.title ?? (slug === 'sonstiges' ? contactText.de.other : slug);
const mitHttps = (v: string | null) => (!v ? '' : /^https?:\/\//.test(v) ? v : `https://${v}`);

/** Startwerte aus `?kunde=<id>` oder `?anfrage=<id>` (AK-4) */
export function vorbelegung({
  kundeId,
  anfrage,
  kunden,
}: {
  kundeId?: string;
  anfrage?: Anfrage | null;
  kunden: AssistentKunde[];
}): AssistentDaten {
  const d = leererAssistent();
  // Kritiker Assistent 12: mit bestehenden Kunden startet „Bestehender Kunde“, gegen Dubletten
  if (kunden.length > 0)
    d.kunde = {
      modus: 'bestehend',
      id: kunden.some((k) => k.id === kundeId) ? kundeId! : '',
      name: '',
      website_url: '',
    };
  if (anfrage) {
    d.anfrage_id = anfrage.id;
    d.kunde = { modus: 'neu', id: '', name: anfrage.name, website_url: mitHttps(anfrage.website) };
    d.projekt.titel = anfrage.leistungen.map(leistung).join(', ').slice(0, 200);
    d.projekt.beschreibung_de = anfrage.beschreibung;
    d.projekt.website_url = mitHttps(anfrage.website);
    d.ansprechpartner.neu = [
      {
        name: anfrage.name,
        email: anfrage.email.toLowerCase(),
        rolle: '',
        telefon: anfrage.telefon ?? '',
        sprache: anfrage.sprache,
      },
    ];
  }
  return d;
}

const fdAus = (o: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.set(k, v);
  return f;
};
const mitPrefix = (prefix: string, r: Ergebnis<unknown>, errors: Record<string, string>) => {
  if (!r.ok) for (const [k, v] of Object.entries(r.errors)) errors[`${prefix}${k}`] = v;
};

/** Fehler eines Schritts (0 bis 4), Schlüssel wie die Feld-IDs im Assistenten (AK-3, AK-6) */
export function schrittFehler(schritt: number, d: AssistentDaten): Record<string, string> {
  const e: Record<string, string> = {};
  if (schritt === 0) {
    if (d.kunde.modus === 'bestehend') {
      if (!istId(d.kunde.id)) e['kunde.id'] = 'Bitte wähle einen Kunden.';
    } else mitPrefix('kunde.', kundeDaten(fdAus({ name: d.kunde.name, website_url: d.kunde.website_url })), e);
  }
  if (schritt === 1) {
    const { auftragswert_netto, wahrscheinlichkeit, abrechnung_am, ...projekt } = d.projekt;
    mitPrefix('projekt.', projektDaten(fdAus(projekt)), e);
    mitPrefix('projekt.', umsatzDaten(fdAus({ auftragswert_netto, wahrscheinlichkeit, abrechnung_am })), e);
  }
  if (schritt === 2) {
    if (d.ansprechpartner.ids.length + d.ansprechpartner.neu.length === 0)
      e.ansprechpartner = 'Bitte wähle oder füge mindestens einen Ansprechpartner hinzu.';
    const gesehen = new Set<string>();
    d.ansprechpartner.neu.forEach((a, i) => {
      mitPrefix(`ap.${i}.`, ansprechpartnerDaten(fdAus({ ...a })), e);
      const mail = a.email.trim().toLowerCase();
      if (gesehen.has(mail)) e[`ap.${i}.email`] = 'Diese E-Mail steht doppelt in der Liste.';
      gesehen.add(mail);
    });
  }
  if (schritt === 3) {
    if (d.schritte.length > MAX_SCHRITTE) e.schritte = `Bitte höchstens ${MAX_SCHRITTE} Schritte.`;
    d.schritte.forEach((s, i) => {
      const t = s.titel_de.trim();
      if (!t) e[`schritte.${i}.titel_de`] = 'Bitte gib einen Titel ein.';
      else if (t.length > 200) e[`schritte.${i}.titel_de`] = 'Bitte höchstens 200 Zeichen.';
      if (s.titel_en.trim().length > 200) e[`schritte.${i}.titel_en`] = 'Bitte höchstens 200 Zeichen.';
      if (s.verantwortlich !== 'erik' && s.verantwortlich !== 'kunde')
        e[`schritte.${i}.verantwortlich`] = 'Bitte wähle einen Eintrag aus der Liste.';
    });
  }
  if (schritt === 4 && d.termin) mitPrefix('termin.', terminDaten(fdAus(d.termin)), e);
  return e;
}

export type ProjektAnlegenDaten = {
  kunde_id?: string;
  kunde?: { name: string; website_url: string | null };
  projekt: Record<string, unknown>;
  umsatz: Record<string, unknown>;
  ansprechpartner_ids: string[];
  ansprechpartner_neu: Record<string, unknown>[];
  schritte: { titel_de: string; titel_en: string | null; verantwortlich: string }[];
  termin: Record<string, unknown> | null;
};

/** Alle Schritte prüfen und den Aufruf für `projekt_anlegen` bauen (AK-6) */
export function assistentDaten(
  d: AssistentDaten,
):
  | { ok: true; payload: ProjektAnlegenDaten; einladen: string[] }
  | { ok: false; schritt: number; errors: Record<string, string> } {
  for (let s = 0; s < 5; s++) {
    const errors = schrittFehler(s, d);
    if (Object.keys(errors).length) return { ok: false, schritt: s, errors };
  }
  const { auftragswert_netto, wahrscheinlichkeit, abrechnung_am, ...p } = d.projekt;
  const projekt = projektDaten(fdAus(p));
  const umsatz = umsatzDaten(fdAus({ auftragswert_netto, wahrscheinlichkeit, abrechnung_am }));
  const kunde = kundeDaten(fdAus({ name: d.kunde.name, website_url: d.kunde.website_url }));
  const neu = d.ansprechpartner.neu.map((a) => ansprechpartnerDaten(fdAus({ ...a })));
  const termin = d.termin ? terminDaten(fdAus(d.termin)) : null;
  if (!projekt.ok || !umsatz.ok || neu.some((a) => !a.ok) || (termin && !termin.ok))
    return { ok: false, schritt: 0, errors: {} }; // durch schrittFehler ausgeschlossen
  const neuDaten = neu.map((a) => (a.ok ? a.data : null)).filter((a) => a !== null);
  return {
    ok: true,
    payload: {
      ...(d.kunde.modus === 'bestehend'
        ? { kunde_id: d.kunde.id }
        : { kunde: kunde.ok ? kunde.data : { name: d.kunde.name, website_url: null } }),
      projekt: projekt.data,
      umsatz: umsatz.data,
      ansprechpartner_ids: [...new Set(d.ansprechpartner.ids)],
      ansprechpartner_neu: neuDaten,
      schritte: d.schritte.map((s) => ({
        titel_de: s.titel_de.trim(),
        titel_en: s.titel_en.trim() || null,
        verantwortlich: s.verantwortlich,
      })),
      termin: termin && termin.ok ? termin.data : null,
    },
    einladen: d.einladen ? neuDaten.map((a) => a.email) : [],
  };
}

const s = (v: unknown) => (typeof v === 'string' ? v : '');
const obj = (v: unknown) => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const arr = (v: unknown) => (Array.isArray(v) ? v : []);

/** JSON aus dem Formular in die erwartete Form bringen; null, wenn es kein Objekt ist */
export function normalisieren(raw: unknown): AssistentDaten | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  const leer = leererAssistent();
  const k = obj(r.kunde);
  const p = obj(r.projekt);
  const ap = obj(r.ansprechpartner);
  const t = r.termin ? obj(r.termin) : null;
  return {
    kunde: {
      modus: k.modus === 'bestehend' ? 'bestehend' : 'neu',
      id: s(k.id),
      name: s(k.name),
      website_url: s(k.website_url),
    },
    projekt: Object.fromEntries(Object.keys(leer.projekt).map((key) => [key, s(p[key])])) as AssistentDaten['projekt'],
    ansprechpartner: {
      ids: arr(ap.ids).map(s).filter(Boolean),
      neu: arr(ap.neu).map((a) => {
        const o = obj(a);
        return {
          name: s(o.name),
          email: s(o.email),
          rolle: s(o.rolle),
          telefon: s(o.telefon),
          sprache: s(o.sprache) as Locale,
        };
      }),
    },
    einladen: r.einladen === true,
    schritte: arr(r.schritte).map((x) => {
      const o = obj(x);
      return { titel_de: s(o.titel_de), titel_en: s(o.titel_en), verantwortlich: s(o.verantwortlich) as 'erik' };
    }),
    termin: t && {
      datum: s(t.datum),
      beginn: s(t.beginn),
      ende: s(t.ende),
      titel_de: s(t.titel_de),
      titel_en: s(t.titel_en),
      meet_url: s(t.meet_url),
    },
    ...(istId(s(r.anfrage_id)) ? { anfrage_id: s(r.anfrage_id) } : {}),
  };
}
