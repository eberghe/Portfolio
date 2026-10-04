import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import type { Service } from '@/lib/content/services';
import { localizedPath, type Locale } from '@/lib/i18n';
import { serviceJsonLd } from '@/lib/structured-data';
import { overviewText } from './ServicesOverview';

// Detailseite einer Leistung, übernommen aus Lovable (ServiceDetailPage.tsx). Siehe functions/seiten/leistungen.md
const text = {
  de: {
    back: 'Alle Services',
    included: 'Das ist enthalten',
    interested: 'Interesse?',
    talk: 'Lass uns darüber sprechen, wie ich dir helfen kann.',
    cta: 'Kostenloses Erstgespräch',
  },
  en: {
    back: 'All services',
    included: "What's included",
    interested: 'Interested?',
    talk: "Let's talk about how I can help you.",
    cta: 'Free intro call',
  },
};

export default function ServiceDetail({ service, locale }: { service: Service; locale: Locale }) {
  const t = text[locale];
  const content = service[locale];
  const Icon = service.icon;

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12">
      <JsonLd data={serviceJsonLd(service, locale)} />
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
          <h1 className="text-[32px] font-medium tracking-tight mb-4">{content.title}</h1>
          <p className="text-[15px] text-text2 leading-relaxed mb-8">{content.description}</p>
          <ul aria-label={overviewText[locale].keywords} className="flex flex-wrap gap-2">
            {service.tags.map((tag) => (
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
            <h2 id="enthalten" className="text-sm font-medium text-foreground mb-5">
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

      <section aria-labelledby="interesse" className="py-16 text-center">
        <h2 id="interesse" className="text-xl font-medium mb-3">
          {t.interested}
        </h2>
        <p className="text-[13px] text-text2 mb-6 max-w-[400px] mx-auto">{t.talk}</p>
        <Link
          href={localizedPath('/contact', locale)}
          className="inline-flex bg-primary text-primary-foreground px-6 py-3 rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          {t.cta}
        </Link>
      </section>
    </div>
  );
}
