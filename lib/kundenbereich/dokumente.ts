import type { Locale } from '@/lib/i18n';
import { datum, type ProjektRow } from './projekte';

// Dokumente des Kundenbereichs: Gruppen, Dateiangaben, Download (functions/kundenbereich/dokumente.md)

export type DokumentRow = ProjektRow['dokumente'][number];
export type DokumentArt = DokumentRow['art'];

const REIHENFOLGE: DokumentArt[] = ['vertrag', 'rechnung', 'logo', 'datei'];
export const LINK_LAUFZEIT = 60;

/** Nach Art gruppiert, je Titel höchste Version zuerst und als aktuell markiert (AK-2) */
export function dokumentGruppen(dokumente: DokumentRow[]) {
  return REIHENFOLGE.map((art) => {
    const liste = dokumente
      .filter((d) => d.art === art)
      .sort((a, b) => a.titel.localeCompare(b.titel, 'de') || b.version - a.version);
    return {
      art,
      dokumente: liste.map((d, i) => ({ ...d, aktuell: i === 0 || liste[i - 1]!.titel !== d.titel })),
    };
  }).filter((g) => g.dokumente.length > 0);
}

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
