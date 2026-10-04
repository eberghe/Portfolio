import { inquiryMailto, inquiryText } from './mailto';
import type { InquiryState } from './state';
import { fields, validateInquiry, type Inquiry } from './validate';

// Verarbeitung einer Anfrage auf dem Server, siehe functions/kontakt/anfrage-assistent.md

export interface InquiryStore {
  save(inquiry: Inquiry, ipHash: string | null): Promise<void>;
  /** Anfragen desselben Absenders seit dem Zeitpunkt (ISO) */
  recentCount(ipHash: string, sinceIso: string): Promise<number>;
}

export type { InquiryState };

export interface Deps {
  store: InquiryStore | null;
  notify?: ((inquiry: Inquiry) => Promise<void>) | null;
  ipHash: string | null;
}

const LIMIT = 3;
const HOUR = 60 * 60 * 1000;

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

  try {
    if (ipHash && (await store.recentCount(ipHash, new Date(Date.now() - HOUR).toISOString())) >= LIMIT)
      return { status: 'limited' };
    await store.save(data, ipHash);
  } catch (error) {
    console.error('Anfrage nicht gespeichert', error);
    return { status: 'fallback', reason: 'failed', mailto: inquiryMailto(data), text: inquiryText(data) };
  }

  try {
    await notify?.(data);
  } catch (error) {
    console.error('Benachrichtigung fehlgeschlagen', error);
  }
  return { status: 'sent', summary: data };
}
