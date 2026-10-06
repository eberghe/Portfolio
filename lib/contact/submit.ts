import { inquiryMailto, inquiryText } from './mailto';
import type { InquiryState } from './state';
import { fields, validateInquiry, type Inquiry } from './validate';

// Verarbeitung einer Anfrage auf dem Server, siehe functions/kontakt/anfrage-assistent.md

export interface InquiryStore {
  save(inquiry: Inquiry, ipHash: string | null): Promise<void>;
  /** Anfragen desselben Absenders seit dem Zeitpunkt (ISO) */
  recentCount(ipHash: string, sinceIso: string): Promise<number>;
  /** Anfragen an dieselbe E-Mail-Adresse seit dem Zeitpunkt (ISO), für das Limit der Bestätigungen */
  recentEmailCount(email: string, sinceIso: string): Promise<number>;
}

export interface NotifyOptions {
  /** Bestätigung an den Absender erlaubt (AK-21) */
  confirm: boolean;
}

export type { InquiryState };

export interface Deps {
  store: InquiryStore | null;
  notify?: ((inquiry: Inquiry, options: NotifyOptions) => Promise<void>) | null;
  ipHash: string | null;
}

const LIMIT = 3;
const HOUR = 60 * 60 * 1000;
/** Höchstens so viele Bestätigungen pro E-Mail-Adresse in 24 Stunden (AK-21) */
const CONFIRM_LIMIT = 2;

function values(fd: FormData) {
  return Object.fromEntries(
    fields.map((f) => [f, f === 'leistungen' ? fd.getAll(f).map(String) : String(fd.get(f) ?? '')]),
  );
}

export async function handleInquiry(fd: FormData, { store, notify, ipHash }: Deps): Promise<InquiryState> {
  const { errors, data } = validateInquiry(fd);
  if (!data) return { status: 'invalid', errors, values: values(fd) };

  // Honeypot: Bots bekommen eine Erfolgsmeldung, gespeichert wird nichts (AK-3)
  if (String(fd.get('fax') ?? '').trim()) return { status: 'sent', summary: data };

  if (!store)
    return { status: 'fallback', reason: 'unavailable', mailto: inquiryMailto(data), text: inquiryText(data) };

  let confirm = false;
  try {
    if (ipHash && (await store.recentCount(ipHash, new Date(Date.now() - HOUR).toISOString())) >= LIMIT)
      return { status: 'limited' };
    // Vor dem Speichern zählen, damit die neue Anfrage nicht mitzählt
    confirm =
      !!ipHash &&
      (await store.recentEmailCount(data.email, new Date(Date.now() - 24 * HOUR).toISOString())) < CONFIRM_LIMIT;
    await store.save(data, ipHash);
  } catch (error) {
    console.error('Anfrage nicht gespeichert', error);
    return { status: 'fallback', reason: 'failed', mailto: inquiryMailto(data), text: inquiryText(data) };
  }

  try {
    await notify?.(data, { confirm });
  } catch (error) {
    console.error('Benachrichtigung fehlgeschlagen', error);
  }
  return { status: 'sent', summary: data };
}
