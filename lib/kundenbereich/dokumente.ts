import type { Locale } from '@/lib/i18n';
import { datum, type ProjektRow } from './projekte';

// Dokumente des Kundenbereichs: Gruppen, Dateiangaben, Download (functions/kundenbereich/dokumente.md)

export type DokumentRow = ProjektRow['dokumente'][number];
export type DokumentArt = DokumentRow['art'];
/** Unterschriften stehen bei den Angeboten (angebot-unterschrift.md AK-1) */
export type DokumentGruppe = Exclude<DokumentArt, 'unterschrift'>;

const REIHENFOLGE: DokumentGruppe[] = ['angebot', 'vertrag', 'rechnung', 'logo', 'datei'];
const gruppe = (art: DokumentArt): DokumentGruppe => (art === 'unterschrift' ? 'angebot' : art);
export const LINK_LAUFZEIT = 60;

/** Nach Art gruppiert, je Titel höchste Version zuerst und als aktuell markiert (AK-2) */
export function dokumentGruppen(dokumente: DokumentRow[]) {
  return REIHENFOLGE.map((art) => {
    const liste = dokumente
      .filter((d) => gruppe(d.art) === art)
      .sort((a, b) => a.titel.localeCompare(b.titel, 'de') || b.version - a.version);
    return {
      art,
      dokumente: liste.map((d, i) => ({ ...d, aktuell: i === 0 || liste[i - 1]!.titel !== d.titel })),
    };
  }).filter((g) => g.dokumente.length > 0);
}

/** Aktuelle Angebote ohne hochgeladene Unterschrift (angebot-unterschrift.md AK-2, AK-6) */
export function offeneAngebote(dokumente: DokumentRow[]) {
  const unterschrieben = new Set(dokumente.map((d) => d.zu_dokument).filter(Boolean));
  return dokumentGruppen(dokumente)
    .flatMap((g) => g.dokumente)
    .filter((d) => d.art === 'angebot' && d.aktuell && !unterschrieben.has(d.id));
}

/** Die hochgeladene Unterschrift zu einem Angebot */
export const unterschriftZu = (dokumente: DokumentRow[], id: string) =>
  dokumente.find((d) => d.art === 'unterschrift' && d.zu_dokument === id) ?? null;

const TYPEN: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/zip': 'ZIP',
  'image/svg+xml': 'SVG',
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
  'image/webp': 'WEBP',
};

function groesse(bytes: number, locale: Locale) {
  const n = new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'de-DE', { maximumFractionDigits: 1 });
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${n.format(bytes / 1000)} KB`;
  return `${n.format(bytes / 1_000_000)} MB`;
}

/** „PDF, 1,2 MB, Version 2, 8. Okt. 2026“ (AK-3) */
export function dateiInfo(d: DokumentRow, locale: Locale) {
  const typ = (d.mime_typ && TYPEN[d.mime_typ]) ?? d.dateiname.split('.').pop()?.toUpperCase() ?? '';
  return [
    typ,
    d.groesse_bytes != null ? groesse(d.groesse_bytes, locale) : null,
    `${locale === 'en' ? 'version' : 'Version'} ${d.version}`,
    datum(d.created_at.slice(0, 10), locale),
  ]
    .filter(Boolean)
    .join(', ');
}

export interface DokumentDownload {
  id: string;
  storage_pfad: string;
  dateiname: string;
}

/** Antwort der Download-Route: Sitzung prüfen, mit dem Token des Nutzers signieren, weiterleiten (AK-5) */
export async function dokumentAntwort(
  id: string,
  vorschau: boolean,
  access: string | undefined,
  api: {
    dokument: (access: string, id: string) => Promise<DokumentDownload | null>;
    signieren: (access: string, pfad: string, sekunden: number) => Promise<string | null>;
  } | null,
) {
  const headers = { 'Cache-Control': 'private, no-store' };
  if (!access || !api) return new Response('Unauthorized', { status: 401, headers });
  const row = await api.dokument(access, id);
  if (!row) return new Response('Not found', { status: 404, headers });
  const signed = await api.signieren(access, row.storage_pfad, LINK_LAUFZEIT);
  if (!signed) return new Response('Bad gateway', { status: 502, headers });
  const target = new URL(signed);
  if (!vorschau) target.searchParams.set('download', row.dateiname);
  return new Response(null, { status: 303, headers: { ...headers, Location: target.toString() } });
}
