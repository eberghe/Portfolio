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

/** Viele Mailprogramme kürzen mailto-Links über etwa 2000 Zeichen (Kritiker-Befund 3) */
const MAX_MAILTO = 2000;

export function inquiryMailto(i: Inquiry) {
  const subject = encodeURIComponent(contactText[i.sprache].mailSubject(i.name));
  const build = (inq: Inquiry) => `mailto:${EMAIL}?subject=${subject}&body=${encodeURIComponent(inquiryText(inq))}`;
  let url = build(i);
  for (let n = i.beschreibung.length - 100; url.length > MAX_MAILTO && n > 0; n -= 100)
    url = build({
      ...i,
      beschreibung: `${i.beschreibung.slice(0, n).trimEnd()} … ${contactText[i.sprache].truncated}`,
    });
  return url;
}
