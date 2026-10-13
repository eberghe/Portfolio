import type { Locale } from '@/lib/i18n';
import type { Position, UstSatz } from './rechnen';

// Prüfung des Angebots-Formulars (functions/kundenbereich/angebote.md AK-1)

export interface AngebotEingabe {
  nummer: string;
  titel: string;
  sprache: Locale;
  datum: string;
  gueltig_bis: string;
  empfaenger: string;
  einleitung: string;
  positionen: Position[];
  ust_satz: UstSatz;
}

export const ANGEBOT_TEXT = {
  nummer: 'Bitte gib die Nummer als Jahr und laufende Nummer ein, z. B. 2026-002.',
  titel: 'Bitte gib einen Titel ein.',
  datum: 'Bitte gib ein Datum ein.',
  gueltigBis: 'Gültig bis darf nicht vor dem Datum liegen.',
  positionen: 'Bitte füg mindestens eine Position hinzu.',
  bezeichnung: 'Bitte gib eine Bezeichnung ein.',
  menge: 'Bitte gib eine Menge größer als 0 ein.',
  preis: 'Bitte gib einen Preis ein, z. B. 1.200,00.',
  zuLang: (n: number) => `Höchstens ${n} Zeichen.`,
  vergeben: 'Diese Nummer ist schon vergeben.',
};

const str = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim() : '';
};

/** „1.234,56“, „1234,5“, „99.5“ oder „1200“ als Zahl; null, wenn es keine ist */
export function dezimal(text: string) {
  let t = text.replace(/\s|€/g, '');
  if (!t) return null;
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
  else if ((t.match(/\./g) ?? []).length > 1) t = t.replace(/\./g, '');
  if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
  return Number(t);
}

const istDatum = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(`${d}T00:00:00Z`));

export function angebotDaten(
  fd: FormData,
): { ok: true; data: AngebotEingabe } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const nummer = str(fd, 'nummer');
  if (!/^\d{4}-\d{3,}$/.test(nummer)) errors.nummer = ANGEBOT_TEXT.nummer;
  const titel = str(fd, 'titel');
  if (!titel) errors.titel = ANGEBOT_TEXT.titel;
  else if (titel.length > 200) errors.titel = ANGEBOT_TEXT.zuLang(200);
  const datum = str(fd, 'datum');
  if (!istDatum(datum)) errors.datum = ANGEBOT_TEXT.datum;
  const gueltig_bis = str(fd, 'gueltig_bis');
  if (!istDatum(gueltig_bis)) errors.gueltig_bis = ANGEBOT_TEXT.datum;
  else if (istDatum(datum) && gueltig_bis < datum) errors.gueltig_bis = ANGEBOT_TEXT.gueltigBis;
  const empfaenger = str(fd, 'empfaenger');
  if (empfaenger.length > 1000) errors.empfaenger = ANGEBOT_TEXT.zuLang(1000);
  const einleitung = str(fd, 'einleitung');
  if (einleitung.length > 4000) errors.einleitung = ANGEBOT_TEXT.zuLang(4000);

  const indizes = [
    ...new Set([...fd.keys()].map((k) => /^pos\.(\d+)\./.exec(k)?.[1]).filter((x): x is string => x !== undefined)),
  ]
    .map(Number)
    .sort((a, b) => a - b);
  const positionen: Position[] = [];
  for (const i of indizes) {
    const feld = (n: string) => str(fd, `pos.${i}.${n}`);
    const bezeichnung = feld('bezeichnung');
    const menge = dezimal(feld('menge'));
    const preis = dezimal(feld('preis'));
    if (!bezeichnung) errors[`pos.${i}.bezeichnung`] = ANGEBOT_TEXT.bezeichnung;
    else if (bezeichnung.length > 200) errors[`pos.${i}.bezeichnung`] = ANGEBOT_TEXT.zuLang(200);
    if (menge === null || menge <= 0 || menge > 100000) errors[`pos.${i}.menge`] = ANGEBOT_TEXT.menge;
    if (preis === null || preis < 0 || preis > 10_000_000) errors[`pos.${i}.preis`] = ANGEBOT_TEXT.preis;
    const beschreibung = feld('beschreibung');
    if (beschreibung.length > 1000) errors[`pos.${i}.beschreibung`] = ANGEBOT_TEXT.zuLang(1000);
    positionen.push({
      bezeichnung,
      beschreibung,
      menge: menge ?? 0,
      einheit: feld('einheit').slice(0, 30),
      einzelpreis_cent: Math.round((preis ?? 0) * 100),
    });
  }
  if (!positionen.length) errors.positionen = ANGEBOT_TEXT.positionen;
  else if (positionen.length > 100) errors.positionen = ANGEBOT_TEXT.zuLang(100);

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      nummer,
      titel,
      sprache: str(fd, 'sprache') === 'en' ? 'en' : 'de',
      datum,
      gueltig_bis,
      empfaenger,
      einleitung,
      positionen,
      ust_satz: str(fd, 'ust_satz') === '0' ? 0 : 19,
    },
  };
}
