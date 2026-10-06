import { EMAIL } from '@/lib/site';
import { contactText } from '@/lib/content/contact';
import { inquiryText, serviceLabel } from './mailto';
import type { InquiryStore, NotifyOptions } from './submit';
import type { Inquiry } from './validate';

// Speicherung in Supabase (REST, Service-Role-Schlüssel) und Benachrichtigung per Resend.
// Nur auf dem Server verwenden. Siehe functions/kontakt/anfrage-assistent.md AK-4, AK-5

type Env = Record<string, string | undefined>;

export function supabaseStore(env: Env): InquiryStore | null {
  const url = env.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const endpoint = `${url.replace(/\/$/, '')}/rest/v1/anfragen`;
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

  const count = async (column: string, value: string, sinceIso: string) => {
    const query = `?select=id&${column}=eq.${encodeURIComponent(value)}&created_at=gte.${encodeURIComponent(sinceIso)}`;
    const res = await fetch(endpoint + query, {
      method: 'HEAD',
      headers: { ...headers, Prefer: 'count=exact' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Supabase ${res.status}`);
    return Number(res.headers.get('content-range')?.split('/')[1] ?? 0);
  };

  return {
    async save(i: Inquiry, ipHash: string | null) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { ...headers, Prefer: 'return=minimal' },
        body: JSON.stringify({
          sprache: i.sprache,
          leistungen: i.leistungen,
          beschreibung: i.beschreibung,
          website: i.website,
          zeitrahmen: i.zeitrahmen,
          budget: i.budget,
          name: i.name,
          email: i.email,
          telefon: i.telefon,
          einwilligung_am: new Date().toISOString(),
          ip_hash: ipHash,
        }),
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`Supabase ${res.status}`);
    },
    recentCount: (ipHash: string, sinceIso: string) => count('ip_hash', ipHash, sinceIso),
    recentEmailCount: (email: string, sinceIso: string) => count('email', email, sinceIso),
  };
}

export function resendNotifier(env: Env): ((i: Inquiry, options?: NotifyOptions) => Promise<void>) | null {
  const key = env.RESEND_API_KEY;
  if (!key) return null;
  const owner = env.ANFRAGE_EMPFAENGER ?? EMAIL;
  const send = async (mail: Record<string, unknown>) => {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.ANFRAGE_ABSENDER ?? 'onboarding@resend.dev', ...mail }),
    });
    // Status und Antwort ins Log, damit die Ursache sichtbar ist (anfrage-assistent.md AK-17)
    if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
  };
  return async (i, options) => {
    await send({ to: [owner], reply_to: i.email, subject: `Neue Anfrage: ${i.name}`, text: inquiryText(i) });
    // Bestätigung an den Absender nur mit eigener Domain (AK-18), ohne Name und Beschreibung (AK-19), nur mit Freigabe (AK-21)
    if (!env.ANFRAGE_ABSENDER || !options?.confirm) return;
    const t = contactText[i.sprache];
    try {
      await send({
        to: [i.email],
        reply_to: owner,
        subject: t.confirmSubject,
        text: t.confirmText(i.leistungen.map((l) => serviceLabel(l, i.sprache)).join(', ')),
      });
    } catch (error) {
      console.error('Bestätigung an den Absender fehlgeschlagen', error);
    }
  };
}
