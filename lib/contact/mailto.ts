import { contactText } from '@/lib/content/contact';
import { services } from '@/lib/content/services';
import { EMAIL } from '@/lib/site';
import type { Inquiry } from './validate';

// Ausweichweg: fertige E-Mail mit allen Angaben (functions/kontakt/anfrage-assistent.md AK-7)

export function serviceLabel(slug: string, locale: Inquiry['sprache']) {
  return services.find((s) => s.slug === slug)?.[locale].title ?? contactText[locale].other;
}

/** Angaben als Liste aus Bezeichnung und Wert, für Bestätigung, Mail und Benachrichtigung */
export function inquiryLines(i: Inquiry): [string, string][] {
  const t = contactText[i.sprache];
  return [
    [t.steps[0]!, i.leistungen.map((l) => serviceLabel(l, i.sprache)).join(', ')],
    [t.description, i.beschreibung],
    ...(i.website ? [[t.website, i.website] as [string, string]] : []),
    [t.timeframe, t.timeframes[i.zeitrahmen as keyof typeof t.timeframes] ?? i.zeitrahmen],
    [t.budget, t.budgets[i.budget as keyof typeof t.budgets] ?? i.budget],
    [t.name, i.name],
    [t.emailField, i.email],
    ...(i.telefon ? [[t.phone, i.telefon] as [string, string]] : []),
  ];
}

export function inquiryText(i: Inquiry) {
  return inquiryLines(i)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n\n');
}

export function inquiryMailto(i: Inquiry) {
  const subject = encodeURIComponent(contactText[i.sprache].mailSubject(i.name));
  return `mailto:${EMAIL}?subject=${subject}&body=${encodeURIComponent(inquiryText(i))}`;
}
