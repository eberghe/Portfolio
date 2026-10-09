import { datum } from '../projekte';
import type { Freigabe } from './laden';

// Kleine Texte der Verwaltung (nur Deutsch, functions/kundenbereich/admin.md)

export const PROJEKT_STATUS_OPTIONEN = [
  { value: 'angebot', label: 'Angebot' },
  { value: 'in_arbeit', label: 'In Arbeit' },
  { value: 'abstimmung', label: 'In Abstimmung' },
  { value: 'abgeschlossen', label: 'Abgeschlossen' },
  { value: 'pausiert', label: 'Pausiert' },
];
export const SCHRITT_STATUS_OPTIONEN = [
  { value: 'offen', label: 'Offen' },
  { value: 'aktiv', label: 'Läuft gerade' },
  { value: 'erledigt', label: 'Erledigt' },
];
export const VERANTWORTLICH_OPTIONEN = [
  { value: 'erik', label: 'Erik' },
  { value: 'kunde', label: 'Kunde' },
];
export const SPRACH_OPTIONEN = [
  { value: 'de', label: 'Deutsch' },
  { value: 'en', label: 'Englisch' },
];
export const DOKUMENT_ART_OPTIONEN = [
  { value: 'vertrag', label: 'Vertrag' },
  { value: 'rechnung', label: 'Rechnung' },
  { value: 'logo', label: 'Logo' },
  { value: 'datei', label: 'Weitere Datei' },
];

export const optionLabel = (opts: { value: string; label: string }[], v: string) =>
  opts.find((o) => o.value === v)?.label ?? v;

/** „offen“, „erteilt am 8. Okt. 2026“, „widerrufen am …“ (AK-10) */
export function freigabeText(f: Freigabe, am: string | null) {
  if (f === 'offen' || !am) return 'Logo-Freigabe offen';
  return `Logo-Freigabe ${f} am ${datum(am.slice(0, 10), 'de')}`;
}
