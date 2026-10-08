import { localizedPath, type Locale } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';
import { kundenText } from './text';

// Anmeldelink anfordern, siehe functions/kundenbereich/login.md AK-2 bis AK-6, AK-10

export interface Konto {
  art: 'kunde' | 'admin';
  ansprechpartnerId: string | null;
  userId: string | null;
  name: string;
  sprache: Locale;
}

export interface LoginDeps {
  /** Hinterlegtes Konto zur (klein geschriebenen) Adresse oder null */
  konto(email: string): Promise<Konto | null>;
  /** Versuche seit den Zeitpunkten (ISO): pro Adresse und pro Absender */
  recent(
    emailHash: string,
    ipHash: string | null,
    sinceEmail: string,
    sinceIp: string,
  ): Promise<{ email: number; ip: number }>;
  logAttempt(emailHash: string, ipHash: string | null): Promise<void>;
  /** Legt einen bestätigten Supabase-Nutzer an und gibt seine ID zurück */
  createUser(email: string): Promise<string>;
  linkUser(ansprechpartnerId: string, userId: string): Promise<void>;
  /** Einmaliger Anmeldecode (hashed token) für eine bestehende Adresse */
  generateCode(email: string): Promise<string>;
  sendMail(mail: { to: string; subject: string; text: string }): Promise<void>;
}

export type LoginState =
  { status: 'idle' } | { status: 'invalid'; email: string } | { status: 'sent' } | { status: 'unavailable' };

const MINUTE = 60 * 1000;
const EMAIL_LIMIT = 3; // pro 15 Minuten
const IP_LIMIT = 10; // pro Stunde
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Erlaubte Adressen für den Link in der Mail (AK-6), nie blind der Host-Header */
export function siteOrigin(host: string | null): string {
  const h = (host ?? '').toLowerCase();
  if (h === 'erik-bergheimer.de' || h === 'www.erik-bergheimer.de') return `https://${h}`;
  if (/^erikbergheimer(-[a-z0-9-]+)?-org-8b0b\.vercel\.app$/.test(h)) return `https://${h}`;
  if (/^localhost(:\d{1,5})?$/.test(h)) return `http://${h}`;
  return SITE_URL;
}

export const confirmPath = (locale: Locale) => localizedPath('/kunden/anmelden', locale);

export async function requestLink(
  fd: FormData,
  {
    deps,
    host,
    ip,
    hash,
  }: { deps: LoginDeps | null; host: string | null; ip: string | null; hash: (v: string) => string },
): Promise<LoginState> {
  const raw = String(fd.get('email') ?? '');
  const email = raw.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) return { status: 'invalid', email: raw };
  if (!deps) return { status: 'unavailable' };

  try {
    const emailHash = hash(email);
    const ipHash = ip ? hash(ip) : null;
    const now = Date.now();
    const recent = await deps.recent(
      emailHash,
      ipHash,
      new Date(now - 15 * MINUTE).toISOString(),
      new Date(now - 60 * MINUTE).toISOString(),
    );
    await deps.logAttempt(emailHash, ipHash);
    // Gleiche Antwort bei Limit und unbekannter Adresse: keine Auskunft, wer Kunde ist (AK-3, AK-5)
    if (recent.email >= EMAIL_LIMIT || recent.ip >= IP_LIMIT) return { status: 'sent' };

    // Erst prüfen, dann Code erzeugen: die Supabase-Admin-API legt sonst unbekannte Nutzer an
    const konto = await deps.konto(email);
    if (!konto) return { status: 'sent' };
    if (!konto.userId) {
      const userId = await deps.createUser(email);
      if (konto.ansprechpartnerId) await deps.linkUser(konto.ansprechpartnerId, userId);
    }
    const code = await deps.generateCode(email);
    const t = kundenText[konto.sprache];
    const link = `${siteOrigin(host)}${confirmPath(konto.sprache)}?code=${encodeURIComponent(code)}`;
    await deps.sendMail({ to: email, subject: t.mailSubject, text: t.mailText(konto.name || null, link) });
    return { status: 'sent' };
  } catch (error) {
    console.error('Anmeldelink nicht verschickt', error);
    return { status: 'unavailable' };
  }
}
