import type { Locale } from '@/lib/i18n';
import { kundenText } from './text';

// Unterschriebenes Angebot hochladen: prüfen, signierter Upload-Link mit dem Token des Kunden, eintragen
// über die Datenbankfunktion unterschrift_eintragen (functions/kundenbereich/angebot-unterschrift.md)

export type UnterschriftState =
  | { status: 'idle' }
  | { status: 'ok'; message?: string; upload?: { url: string; pfad: string } }
  | { status: 'error'; message: string; /** Fehler gehört an das Dateifeld */ feld?: boolean };

export const UNTERSCHRIFT_TYPEN: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};
export const UNTERSCHRIFT_MAX = 10 * 1024 * 1024;

export interface AngebotDokument {
  id: string;
  projekt_id: string;
  kunde_id: string;
  unterschrieben: boolean;
}

export interface UnterschriftApi {
  angebotDokument(access: string, id: string): Promise<AngebotDokument | null>;
  signUpload(access: string, pfad: string): Promise<string | null>;
  unterschriftEintragen(
    access: string,
    dokument: string,
    pfad: string,
    dateiname: string,
  ): Promise<'ok' | 'schon' | 'fehler'>;
}

interface Ctx {
  access: string | undefined;
  api: UnterschriftApi | null;
  zufall?: () => string;
}

const text = (fd: FormData) => kundenText[(fd.get('sprache') === 'en' ? 'en' : 'de') as Locale];
const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === 'string' ? v.trim() : '';
};

export async function unterschriftVorbereiten(fd: FormData, ctx: Ctx): Promise<UnterschriftState> {
  const t = text(fd);
  const endung = UNTERSCHRIFT_TYPEN[str(fd, 'type')];
  if (!endung) return { status: 'error', message: t.uploadType, feld: true };
  if (!(Number(str(fd, 'size')) > 0)) return { status: 'error', message: t.uploadMissing, feld: true };
  if (Number(str(fd, 'size')) > UNTERSCHRIFT_MAX) return { status: 'error', message: t.uploadSize, feld: true };
  if (!ctx.access || !ctx.api) return { status: 'error', message: t.uploadError };
  try {
    const d = await ctx.api.angebotDokument(ctx.access, str(fd, 'dokument'));
    if (!d) return { status: 'error', message: t.uploadError };
    if (d.unterschrieben) return { status: 'error', message: t.uploadAlready };
    const zufall = (ctx.zufall?.() ?? crypto.randomUUID()).replace(/[^A-Za-z0-9-]/g, '');
    const pfad = `${d.kunde_id}/${d.projekt_id}/unterschrift-${zufall}.${endung}`;
    const url = await ctx.api.signUpload(ctx.access, pfad);
    return url ? { status: 'ok', upload: { url, pfad } } : { status: 'error', message: t.uploadError };
  } catch (e) {
    console.error('Unterschrift vorbereiten', e);
    return { status: 'error', message: t.uploadError };
  }
}

export async function unterschriftEintragen(fd: FormData, ctx: Ctx): Promise<UnterschriftState> {
  const t = text(fd);
  if (!ctx.access || !ctx.api) return { status: 'error', message: t.uploadError };
  try {
    const dateiname = (str(fd, 'dateiname').split(/[\\/]/).pop() ?? '').slice(0, 200);
    const r = await ctx.api.unterschriftEintragen(ctx.access, str(fd, 'dokument'), str(fd, 'pfad'), dateiname);
    if (r === 'ok') return { status: 'ok', message: t.uploadThanks };
    return { status: 'error', message: r === 'schon' ? t.uploadAlready : t.uploadError };
  } catch (e) {
    console.error('Unterschrift eintragen', e);
    return { status: 'error', message: t.uploadError };
  }
}
