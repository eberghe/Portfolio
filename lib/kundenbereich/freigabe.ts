import type { Locale } from '@/lib/i18n';
import { kundenText } from './text';

// Logo-Freigabe durch Ansprechpartner (functions/kundenbereich/logo-freigabe.md)

export type Entscheidung = 'erteilt' | 'widerrufen';

export interface MeinKunde {
  ansprechpartnerId: string;
  kundeId: string;
  kunde: string;
  freigabe: 'offen' | Entscheidung;
  letzte: { entscheidung: Entscheidung; am: string; name: string } | null;
}

export type FreigabeState = { status: 'idle' } | { status: 'ok' | 'error'; message: string };

export interface FreigabeApi {
  meinKunde(access: string): Promise<MeinKunde | null>;
  freigeben(
    access: string,
    row: { kunde_id: string; ansprechpartner_id: string; entscheidung: Entscheidung },
  ): Promise<void>;
}

/** Entscheidung im eigenen Namen eintragen; die Zugriffsregel `kunde_gibt_frei` prüft zusätzlich (AK-2, AK-3) */
export async function logoFreigabe(
  fd: FormData,
  { access, api }: { access: string | undefined; api: FreigabeApi | null },
): Promise<FreigabeState> {
  const locale: Locale = fd.get('sprache') === 'en' ? 'en' : 'de';
  const t = kundenText[locale];
  const entscheidung = fd.get('entscheidung');
  if (entscheidung !== 'erteilt' && entscheidung !== 'widerrufen') return { status: 'error', message: t.logoError };
  if (!access || !api) return { status: 'error', message: t.logoError };
  try {
    const mk = await api.meinKunde(access);
    if (!mk) return { status: 'error', message: t.logoError };
    await api.freigeben(access, { kunde_id: mk.kundeId, ansprechpartner_id: mk.ansprechpartnerId, entscheidung });
    return { status: 'ok', message: entscheidung === 'erteilt' ? t.logoThanks : t.logoRevoked };
  } catch (e) {
    console.error('Logo-Freigabe', e);
    return { status: 'error', message: t.logoError };
  }
}
