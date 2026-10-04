import { budgets, OTHER_SERVICE, timeframes, type ErrorCode } from '@/lib/content/contact';
import { services } from '@/lib/content/services';
import type { Locale } from '@/lib/i18n';

// Prüfregeln des Anfrage-Assistenten, gleich im Browser und auf dem Server.
// Siehe functions/kontakt/anfrage-assistent.md AK-6

export const fields = [
  'leistungen',
  'beschreibung',
  'website',
  'zeitrahmen',
  'budget',
  'name',
  'email',
  'telefon',
  'einwilligung',
] as const;
export type Field = (typeof fields)[number];
export type FieldErrors = Partial<Record<Field, ErrorCode>>;

/** Felder je Schritt des Assistenten */
export const steps: Field[][] = [
  ['leistungen'],
  ['beschreibung', 'website'],
  ['zeitrahmen', 'budget'],
  ['name', 'email', 'telefon', 'einwilligung'],
];

export interface Inquiry {
  sprache: Locale;
  leistungen: string[];
  beschreibung: string;
  website: string | null;
  zeitrahmen: string;
  budget: string;
  name: string;
  email: string;
  telefon: string | null;
}

export const serviceValues = [...services.map((s) => s.slug), OTHER_SERVICE];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[0-9+/()\- ]{5,40}$/;

const text = (fd: FormData, key: string) => String(fd.get(key) ?? '').trim();

function length(value: string, min: number, max: number): ErrorCode | undefined {
  if (!value) return 'required';
  if (value.length < min) return 'tooShort';
  if (value.length > max) return 'tooLong';
}

function normalizeUrl(value: string): string | null | undefined {
  if (!value) return null;
  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    if ((url.protocol !== 'http:' && url.protocol !== 'https:') || !url.hostname.includes('.') || value.length > 300)
      return undefined;
    return url.href.replace(/\/$/, '');
  } catch {
    return undefined;
  }
}

/** Prüft die Formulardaten, auf Wunsch nur bestimmte Felder (ein Schritt). */
export function validateInquiry(
  fd: FormData,
  only: readonly Field[] = fields,
): { errors: FieldErrors; data?: Inquiry } {
  const errors: FieldErrors = {};

  const leistungen = fd.getAll('leistungen').map(String);
  const beschreibung = text(fd, 'beschreibung');
  const website = normalizeUrl(text(fd, 'website'));
  const zeitrahmen = text(fd, 'zeitrahmen') || 'offen';
  const budget = text(fd, 'budget') || 'offen';
  const name = text(fd, 'name').replace(/\s+/g, ' ');
  const email = text(fd, 'email');
  const telefon = text(fd, 'telefon');

  const checks: Record<Field, () => ErrorCode | undefined> = {
    leistungen: () =>
      leistungen.length === 0 ? 'required' : leistungen.some((l) => !serviceValues.includes(l)) ? 'invalid' : undefined,
    beschreibung: () => length(beschreibung, 20, 3000),
    website: () => (website === undefined ? 'invalid' : undefined),
    zeitrahmen: () => ((timeframes as readonly string[]).includes(zeitrahmen) ? undefined : 'invalid'),
    budget: () => ((budgets as readonly string[]).includes(budget) ? undefined : 'invalid'),
    name: () => length(name, 2, 100),
    email: () => (!email ? 'required' : !EMAIL.test(email) || email.length > 200 ? 'invalid' : undefined),
    telefon: () => (telefon && !PHONE.test(telefon) ? 'invalid' : undefined),
    einwilligung: () => (fd.get('einwilligung') ? undefined : 'required'),
  };

  for (const field of only) {
    const error = checks[field]();
    if (error) errors[field] = error;
  }
  if (Object.keys(errors).length > 0 || only.length !== fields.length) return { errors };

  return {
    errors,
    data: {
      sprache: fd.get('sprache') === 'en' ? 'en' : 'de',
      leistungen,
      beschreibung,
      website: website ?? null,
      zeitrahmen,
      budget,
      name,
      email,
      telefon: telefon || null,
    },
  };
}
