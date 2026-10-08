import type { Locale } from '@/lib/i18n';
import type { ProjektStatus, SchrittStatus } from '../projekte';

// Prüfungen der Verwaltung, nur auf dem Server verwenden (functions/kundenbereich/admin.md, „Prüfungen“)

export type Ergebnis<T> = { ok: true; data: T } | { ok: false; errors: Record<string, string> };

const PROJEKT_STATUS: ProjektStatus[] = ['angebot', 'in_arbeit', 'abstimmung', 'abgeschlossen', 'pausiert'];
const SCHRITT_STATUS: SchrittStatus[] = ['offen', 'aktiv', 'erledigt'];
export const DOKUMENT_ARTEN = ['vertrag', 'rechnung', 'logo', 'datei'] as const;

const MSG = {
  name: 'Bitte gib einen Namen ein.',
  titel: 'Bitte gib einen Titel ein.',
  lang: 'Bitte höchstens 200 Zeichen.',
  url: 'Bitte gib eine Adresse mit https:// ein.',
  https: 'Bitte gib einen Link mit https:// ein.',
  email: 'Bitte gib eine gültige E-Mail-Adresse ein.',
  sprache: 'Bitte wähle eine Sprache.',
  auswahl: 'Bitte wähle einen Eintrag aus der Liste.',
  zahl: 'Bitte gib eine ganze Zahl ein.',
  datum: 'Bitte gib ein gültiges Datum ein.',
  zeit: 'Bitte gib eine gültige Uhrzeit ein.',
  ende: 'Das Ende muss nach dem Beginn liegen.',
};

const str = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim() : '';
};
const optional = (v: string) => (v === '' ? null : v);

/** Sammelt Felder und Fehler; `done` liefert das Ergebnis */
function form() {
  const errors: Record<string, string> = {};
  return {
    errors,
    pflicht(fd: FormData, key: string, msg: string, max = 200) {
      const v = str(fd, key);
      if (!v) errors[key] = msg;
      else if (v.length > max) errors[key] = MSG.lang;
      return v;
    },
    text(fd: FormData, key: string, max = 200) {
      const v = str(fd, key);
      if (v.length > max) errors[key] = MSG.lang;
      return optional(v);
    },
    url(fd: FormData, key: string, pattern = /^https?:\/\/\S+$/, msg = MSG.url) {
      const v = str(fd, key);
      if (v && !pattern.test(v)) errors[key] = msg;
      return optional(v);
    },
    auswahl<T extends string>(fd: FormData, key: string, values: readonly T[], msg = MSG.auswahl) {
      const v = str(fd, key);
      if (!values.includes(v as T)) errors[key] = msg;
      return v as T;
    },
    done<T>(data: T): Ergebnis<T> {
      return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
    },
  };
}

export function kundeDaten(fd: FormData) {
  const f = form();
  const name = f.pflicht(fd, 'name', MSG.name);
  const website_url = f.url(fd, 'website_url');
  return f.done({ name, website_url });
}

export function ansprechpartnerDaten(fd: FormData) {
  const f = form();
  const name = f.pflicht(fd, 'name', MSG.name);
  const email = str(fd, 'email').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) f.errors.email = MSG.email;
  const rolle = f.text(fd, 'rolle', 100);
  const telefon = f.text(fd, 'telefon', 40);
  const sprache = f.auswahl<Locale>(fd, 'sprache', ['de', 'en'], MSG.sprache);
  return f.done({ name, email, rolle, telefon, sprache });
}

export function projektNeu(fd: FormData) {
  const f = form();
  const titel = f.pflicht(fd, 'titel', MSG.titel);
  return f.done({ titel });
}

export function projektDaten(fd: FormData) {
  const f = form();
  const titel = f.pflicht(fd, 'titel', MSG.titel);
  const status = f.auswahl(fd, 'status', PROJEKT_STATUS);
  const phase = f.text(fd, 'phase');
  const beschreibung_de = f.text(fd, 'beschreibung_de', 5000);
  const beschreibung_en = f.text(fd, 'beschreibung_en', 5000);
  const website_url = f.url(fd, 'website_url');
  const staging_url = f.url(fd, 'staging_url');
  return f.done({ titel, status, phase, beschreibung_de, beschreibung_en, website_url, staging_url });
}

const gueltigesDatum = (v: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1]!, +m[2]! - 1, +m[3]!));
  return d.getUTCFullYear() === +m[1]! && d.getUTCMonth() === +m[2]! - 1 && d.getUTCDate() === +m[3]!;
};

export function schrittDaten(fd: FormData) {
  const f = form();
  const r = str(fd, 'reihenfolge');
  if (!/^-?\d{1,6}$/.test(r)) f.errors.reihenfolge = MSG.zahl;
  const titel_de = f.pflicht(fd, 'titel_de', MSG.titel);
  const titel_en = f.text(fd, 'titel_en');
  const beschreibung_de = f.text(fd, 'beschreibung_de', 2000);
  const beschreibung_en = f.text(fd, 'beschreibung_en', 2000);
  const status = f.auswahl(fd, 'status', SCHRITT_STATUS);
  const faellig = str(fd, 'faellig_am');
  if (faellig && !gueltigesDatum(faellig)) f.errors.faellig_am = MSG.datum;
  const verantwortlich = f.auswahl(fd, 'verantwortlich', ['erik', 'kunde'] as const);
  return f.done({
    reihenfolge: Number(r),
    titel_de,
    titel_en,
    beschreibung_de,
    beschreibung_en,
    status,
    faellig_am: optional(faellig),
    verantwortlich,
  });
}

/** Versatz von Europe/Berlin zu UTC in Millisekunden zum Zeitpunkt `ms` */
function berlinVersatz(ms: number) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(ms));
  const n = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return Date.UTC(n('year'), n('month') - 1, n('day'), n('hour'), n('minute'), n('second')) - ms;
}

/** Datum (JJJJ-MM-TT) und Uhrzeit (HH:MM) in deutscher Zeit als UTC-Zeitpunkt; null, wenn ungültig (AK-8) */
export function berlinZuUtc(datum: string, zeit: string) {
  if (!gueltigesDatum(datum)) return null;
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(zeit);
  if (!m) return null;
  const [y, mo, d] = datum.split('-').map(Number) as [number, number, number];
  const lokal = Date.UTC(y, mo - 1, d, +m[1]!, +m[2]!);
  let ms = lokal - berlinVersatz(lokal);
  ms = lokal - berlinVersatz(ms);
  return new Date(ms).toISOString();
}

export function terminDaten(fd: FormData) {
  const f = form();
  const datum = str(fd, 'datum');
  if (!gueltigesDatum(datum)) f.errors.datum = MSG.datum;
  const beginn = berlinZuUtc(datum, str(fd, 'beginn'));
  const ende = berlinZuUtc(datum, str(fd, 'ende'));
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(str(fd, 'beginn'))) f.errors.beginn = MSG.zeit;
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(str(fd, 'ende'))) f.errors.ende = MSG.zeit;
  else if (beginn && ende && ende <= beginn) f.errors.ende = MSG.ende;
  const titel_de = f.text(fd, 'titel_de');
  const titel_en = f.text(fd, 'titel_en');
  const meet_url = f.url(fd, 'meet_url', /^https:\/\/\S+$/, MSG.https);
  return f.done({ beginn: beginn ?? '', ende: ende ?? '', titel_de, titel_en, meet_url });
}

export function dokumentMeta(fd: FormData) {
  const f = form();
  const art = f.auswahl(fd, 'art', DOKUMENT_ARTEN);
  const titel = f.pflicht(fd, 'titel', MSG.titel);
  return f.done({ art, titel });
}

// Dateien -----------------------------------------------------------------------------------------

export type Bucket = 'kundenlogos' | 'kundendokumente';

const BILDER = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
export const DATEI_REGELN: Record<Bucket, { typen: string[]; max: number; typFehler: string; groesse: string }> = {
  kundenlogos: {
    typen: BILDER,
    max: 5 * 1024 * 1024,
    typFehler: 'Bitte wähle ein Bild (PNG, JPEG, SVG oder WebP).',
    groesse: '5 MB',
  },
  kundendokumente: {
    typen: ['application/pdf', ...BILDER, 'application/zip'],
    max: 25 * 1024 * 1024,
    typFehler: 'Dieser Dateityp geht nicht. Erlaubt sind PDF, PNG, JPEG, SVG, WebP und ZIP.',
    groesse: '25 MB',
  },
};

/** Fehlertext oder null (AK-5, AK-9); die Buckets prüfen zusätzlich selbst */
export function dateiPruefen(bucket: Bucket, file: { name: string; type: string; size: number }) {
  const r = DATEI_REGELN[bucket];
  if (!r.typen.includes(file.type)) return r.typFehler;
  if (file.size <= 0) return 'Die Datei ist leer.';
  if (file.size > r.max) return `Die Datei ist zu groß (höchstens ${r.groesse}).`;
  return null;
}

export const istId = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

function zerlegen(dateiname: string) {
  const base = dateiname.split(/[\\/]/).pop() ?? '';
  const dot = base.lastIndexOf('.');
  const name = dot > 0 ? base.slice(0, dot) : base.replace(/\./g, '');
  const ext = dot > 0 ? base.slice(dot + 1).toLowerCase() : '';
  return { name, ext: /^[a-z0-9]{1,8}$/.test(ext) ? ext : '' };
}

const slug = (v: string) =>
  v
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

export function logoPfad(kundeId: string, dateiname: string, now = new Date()) {
  const zeit = now.toISOString().replace(/\D/g, '').slice(0, 14);
  const { ext } = zerlegen(dateiname);
  return `${kundeId}/logo-${zeit}${ext ? `.${ext}` : ''}`;
}

export function dokumentPfad(kundeId: string, projektId: string, dateiname: string, zufall: string) {
  const { name, ext } = zerlegen(dateiname);
  return `${kundeId}/${projektId}/${zufall}-${slug(name) || 'datei'}${ext ? `.${ext}` : ''}`;
}

export function naechsteVersion(
  dokumente: { art: string; titel: string; version: number }[],
  art: string,
  titel: string,
) {
  const key = titel.trim().toLowerCase();
  return (
    Math.max(
      0,
      ...dokumente.filter((d) => d.art === art && d.titel.trim().toLowerCase() === key).map((d) => d.version),
    ) + 1
  );
}
