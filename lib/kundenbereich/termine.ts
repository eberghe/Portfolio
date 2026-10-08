import type { Locale } from '@/lib/i18n';
import { kundenText } from './text';

// Termine des Kundenbereichs: Zeitangabe und Kalenderdatei (functions/kundenbereich/termine.md)

export interface Termin {
  id: string;
  beginn: string;
  ende: string;
  titel: string;
  meetUrl: string | null;
  titelLang?: 'de';
}

/** Zeile aus `termine` mit dem Projekttitel, wie die Kalenderroute sie lädt */
export interface TerminRow {
  id: string;
  beginn: string;
  ende: string;
  titel_de: string | null;
  titel_en: string | null;
  meet_url: string | null;
  kundenprojekte: { titel: string } | null;
}

export const SERVER_ZEITZONE = 'Europe/Berlin';

export function terminTitel(de: string | null, en: string | null, locale: Locale) {
  return (locale === 'en' ? (en ?? de) : de) ?? kundenText[locale].meetingFallback;
}

/** „Do., 15. Okt. 2026, 10:00–11:00 MESZ“ in der angegebenen Zeitzone (AK-3) */
export function zeitraum(beginn: string, ende: string, locale: Locale, timeZone = SERVER_ZEITZONE) {
  const lang = locale === 'en' ? 'en-GB' : 'de-DE';
  const tag = new Intl.DateTimeFormat(lang, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone,
  }).format(new Date(beginn));
  const zeit = (iso: string) =>
    new Intl.DateTimeFormat(lang, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone,
      timeZoneName: 'short',
    }).formatToParts(new Date(iso));
  const von = zeit(beginn);
  const bis = zeit(ende);
  const uhr = (parts: Intl.DateTimeFormatPart[]) =>
    parts
      .filter((p) => p.type === 'hour' || p.type === 'minute' || (p.type === 'literal' && p.value === ':'))
      .map((p) => p.value)
      .join('');
  const zone = bis.find((p) => p.type === 'timeZoneName')?.value ?? '';
  return `${tag}, ${uhr(von)}–${uhr(bis)} ${zone}`.trim();
}

const escape = (v: string) =>
  v.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const utc = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');

/** iCalendar-Datei für einen Termin (AK-5) */
export function icsDatei(t: Termin, projekt: string, locale: Locale, now = new Date()) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Erik Bergheimer//Kundenbereich//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${t.id}@erik-bergheimer.de`,
    `DTSTAMP:${utc(now)}`,
    `DTSTART:${utc(new Date(t.beginn))}`,
    `DTEND:${utc(new Date(t.ende))}`,
    `SUMMARY:${escape(`${t.titel} (${projekt})`)}`,
    ...(t.meetUrl
      ? [`URL:${t.meetUrl}`, `LOCATION:${t.meetUrl}`, `DESCRIPTION:${escape(`Google Meet: ${t.meetUrl}`)}`]
      : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}

/** Antwort der Kalenderroute: Sitzung prüfen, Termin mit dem Token des Nutzers laden (AK-6) */
export async function kalenderAntwort(
  id: string,
  locale: Locale,
  access: string | undefined,
  api: { termin: (access: string, id: string) => Promise<TerminRow | null> } | null,
) {
  const headers = { 'Cache-Control': 'private, no-store' };
  if (!access || !api) return new Response('Unauthorized', { status: 401, headers });
  const row = await api.termin(access, id);
  if (!row) return new Response('Not found', { status: 404, headers });
  const ics = icsDatei(
    {
      id: row.id,
      beginn: row.beginn,
      ende: row.ende,
      titel: terminTitel(row.titel_de, row.titel_en, locale),
      meetUrl: row.meet_url,
    },
    row.kundenprojekte?.titel ?? '',
    locale,
  );
  return new Response(ics, {
    status: 200,
    headers: {
      ...headers,
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${locale === 'en' ? 'meeting' : 'termin'}.ics"`,
    },
  });
}
