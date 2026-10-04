import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { services, type Service } from '@/lib/content/services';
import { localizedPath, type Locale } from '@/lib/i18n';
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/structured-data';
import { overviewText } from './ServicesOverview';

// Detailseite einer Leistung, übernommen aus Lovable (ServiceDetailPage.tsx). Siehe functions/seiten/leistungen.md

/** Leistungsname klein im Satz, außer Akronyme (UX/UI, AI) und Marken (AK-17) */
const brands = ['Webflow'];
const lowerFirst = (title: string) =>
  title
    .split(' ')
    .map((word) =>
      (word.length > 1 && word[1] === word[1]!.toUpperCase()) || brands.includes(word)
        ? word
        : word.charAt(0).toLowerCase() + word.slice(1),
    )
    .join(' ');
const text = {
  de: {
    back: 'Alle Leistungen',
    included: 'Das ist enthalten',
    related: 'Passende Leistungen',
    place: 'Ich arbeite von Augsburg aus: vor Ort in Deutschland oder remote.',
    interested: (title: string) => `Interesse an ${title}?`,
    talk: 'Im kostenlosen Erstgespräch klären wir unverbindlich, was du brauchst und wie ich dir helfen kann.',
    cta: 'Kostenloses Erstgespräch',
  },
  en: {
    back: 'All services',
    included: "What's included",
    related: 'Related services',
    place: 'I work from Augsburg: on site in Germany, or remote.',
    interested: (title: string) => `Interested in ${lowerFirst(title)}?`,
    talk: 'In a free, no-obligation intro call we work out what you need and how I can help.',
    cta: 'Free intro call',
  },
};

export default function ServiceDetail({ service, locale }: { service: Service; locale: Locale }) {
  const t = text[locale];
  const content = service[locale];
  const Icon = service.icon;
  const related = service.related.flatMap((slug) => services.filter((s) => s.slug === slug));

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12">
      <JsonLd data={serviceJsonLd(service, locale)} />
      <JsonLd data={breadcrumbJsonLd(service, locale)} />
      <div className="pt-8 pb-4">
        <Link
          href={localizedPath('/services', locale)}
          className="inline-flex items-center gap-1.5 py-1 text-[13px] text-text2 hover:text-primary-text transition-colors"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {t.back}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-b border-border">
        <div className="motion-safe:animate-fade-in">
          <p className="text-[10px] font-medium tracking-wider uppercase text-text3 mb-3">{content.label}</p>
          <h1 className="text-[32px] font-bold tracking-tight mb-4">{content.title}</h1>
          <p className="text-[15px] text-text2 leading-relaxed mb-4">{content.description}</p>
          <p className="text-[13px] text-text2 leading-relaxed mb-8">{t.place}</p>
          <ul aria-label={overviewText[locale].keywords} className="flex flex-wrap gap-2">
            {content.tags.map((tag) => (
              <li
                key={tag}
                className="bg-primary-light text-primary-text border border-primary-border px-3 py-1.5 rounded-full text-[11px] font-medium"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <section aria-labelledby="enthalten" className="flex items-start">
          <div className="w-full bg-bg3 rounded-2xl border border-border p-8">
            <span
              aria-hidden="true"
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-primary-light"
            >
              <Icon size={22} className="text-primary-text" />
            </span>
            <h2 id="enthalten" className="text-sm font-bold text-foreground mb-5">
              {t.included}
            </h2>
            <ul className="space-y-3.5">
              {content.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-[13px] text-text2">
                  <Check size={15} aria-hidden="true" className="text-primary-text shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section aria-labelledby="passend" className="py-12 border-b border-border">
        <h2 id="passend" className="text-sm font-bold text-foreground mb-5">
          {t.related}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {related.map((r) => (
            <li key={r.slug}>
              <Link
                href={localizedPath(`/services/${r.slug}`, locale)}
                className="flex items-center gap-3 h-full rounded-xl border border-border bg-card p-4 text-[13px] font-medium text-foreground hover:border-primary/30 motion-safe:transition"
              >
                <r.icon size={18} aria-hidden="true" className="text-primary-text shrink-0" />
                {r[locale].title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="interesse" className="py-16 text-center">
        <h2 id="interesse" className="text-xl font-bold mb-3">
          {t.interested(content.title)}
        </h2>
        <p className="text-[13px] text-text2 mb-6 max-w-[400px] mx-auto">{t.talk}</p>
        <Link
          href={localizedPath(`/contact?leistung=${service.slug}`, locale)}
          className="inline-flex bg-primary text-primary-foreground px-6 py-3 rounded-lg text-[13px] font-medium hover:bg-primary-hover transition-colors"
        >
          {t.cta}
        </Link>
      </section>
    </div>
  );
}
