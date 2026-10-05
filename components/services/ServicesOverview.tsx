import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { services } from '@/lib/content/services';
import JsonLd from '@/components/JsonLd';
import { localizedPath, type Locale } from '@/lib/i18n';
import { servicesItemListJsonLd } from '@/lib/structured-data';

// Übersicht der Leistungen, übernommen aus Lovable (ServicesPage.tsx). Siehe functions/seiten/leistungen.md
export const overviewText = {
  de: {
    metaTitle: 'Leistungen: UX/UI, Webflow, Barrierefreiheit, KI | Erik Bergheimer',
    metaDescription:
      'UX/UI, Webflow, Barrierefreiheit, KI-Beratung, Website-Optimierung, Brand-Design und Design Systems aus Augsburg.',
    title: 'Leistungen',
    intro: 'Was ich für dich tun kann: Design, Entwicklung und alles dazwischen.',
    keywords: 'Schlagworte',
  },
  en: {
    metaTitle: 'Services: UX/UI, Webflow, accessibility, AI | Erik Bergheimer',
    metaDescription:
      'UX/UI, Webflow, accessibility, AI consulting, website optimisation, brand design and design systems from Augsburg.',
    title: 'Services',
    intro: 'What I can do for you: design, development and everything in between.',
    keywords: 'Keywords',
  },
};

export default function ServicesOverview({ locale }: { locale: Locale }) {
  const t = overviewText[locale];
  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12">
      <JsonLd data={servicesItemListJsonLd(locale)} />
      <div className="py-16 border-b border-border mb-10">
        <h1 className="text-[32px] font-bold tracking-tight mb-3">{t.title}</h1>
        <p className="text-[15px] text-text2 max-w-[500px]">{t.intro}</p>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-20">
        {services.map((s) => {
          const Icon = s.icon;
          const text = s[locale];
          const accent = s.featured;
          return (
            <li key={s.slug} className={accent ? 'sm:col-span-2' : ''}>
              <Link
                href={localizedPath(`/services/${s.slug}`, locale)}
                aria-labelledby={`leistung-${s.slug}`}
                aria-describedby={`leistung-${s.slug}-text`}
                className={`block rounded-2xl p-6 border group relative h-full motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.15)] ${
                  accent ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'
                }`}
              >
                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className={`absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity ${
                    accent ? 'text-primary-foreground' : 'text-text3'
                  }`}
                />
                <span className="flex items-center gap-3 mb-4" aria-hidden="true">
                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      accent ? 'bg-primary-foreground/15' : 'bg-primary-light'
                    }`}
                  >
                    <Icon size={20} className={accent ? 'text-primary-foreground' : 'text-primary-text'} />
                  </span>
                </span>
                <span
                  className={`block text-[10px] font-medium tracking-wider uppercase mb-2 ${
                    accent ? 'text-primary-foreground' : 'text-text3'
                  }`}
                >
                  {text.label}
                </span>
                <h2 id={`leistung-${s.slug}`} className={`text-base font-bold mb-2 ${accent ? '' : 'text-foreground'}`}>
                  {text.title}
                </h2>
                <span
                  id={`leistung-${s.slug}-text`}
                  className={`block text-[13px] leading-relaxed mb-4 ${accent ? 'text-primary-foreground' : 'text-text2'}`}
                >
                  {text.short}
                </span>
                <span className="flex flex-wrap gap-1.5" aria-hidden="true">
                  {text.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[11px] px-2 py-0.5 rounded border ${
                        accent
                          ? 'border-primary-foreground/30 text-primary-foreground'
                          : 'bg-bg2 border-border text-text3'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
