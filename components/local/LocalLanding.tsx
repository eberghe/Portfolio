import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import FaqList from '@/components/faq/FaqList';
import JsonLd from '@/components/JsonLd';
import type { LocalPage } from '@/lib/content/local';
import { services } from '@/lib/content/services';
import { localizedPath, type Locale } from '@/lib/i18n';
import { EMAIL } from '@/lib/site';
import { faqListJsonLd, localBreadcrumbJsonLd, localJsonLd } from '@/lib/structured-data';

// Städte-Landingpage nach Vorlage der Leistungsseiten, siehe functions/seo/staedte-landingpages.md
const text = {
  de: {
    cta: 'Kostenloses Erstgespräch',
    projects: 'Projekte ansehen',
    more: 'Mehr erfahren',
    mail: 'Oder schreib direkt an',
  },
  en: { cta: 'Free intro call', projects: 'View projects', more: 'Learn more', mail: 'Or email me at' },
};

const sectionClass = 'py-16 md:py-20 border-b border-border';
const sectionTitle = 'text-[28px] md:text-[36px] font-bold leading-tight tracking-tight text-balance';
const stagger = (i: number) => ({ '--reveal-i': i }) as CSSProperties;

export default function LocalLanding({ page, locale }: { page: LocalPage; locale: Locale }) {
  const t = text[locale];
  const d = page[locale];
  const href = (path: string) => localizedPath(path, locale);
  const offered = page.services.flatMap((slug) => services.filter((s) => s.slug === slug));

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12">
      <JsonLd data={localJsonLd(page, locale)} />
      <JsonLd data={localBreadcrumbJsonLd(page, locale)} />
      <JsonLd data={faqListJsonLd(d.faqs, locale)} />

      <header className="pt-14 pb-16 md:pt-20 md:pb-20 border-b border-border motion-safe:animate-fade-in">
        <p className="text-[11px] font-medium tracking-widest uppercase text-primary-text mb-4">{d.eyebrow}</p>
        <h1 className="text-[36px] md:text-[60px] font-bold leading-[1.04] tracking-[-0.03em] mb-6 max-w-[860px] text-balance">
          {d.title}
        </h1>
        <p className="text-[18px] md:text-[20px] text-text2 leading-relaxed max-w-[640px] mb-8">{d.lead}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={href('/contact')}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-[14px] font-medium hover:bg-primary-hover transition-colors"
          >
            {t.cta}
          </Link>
          <Link
            href={href('/projects')}
            className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg text-[14px] font-medium hover:border-primary transition-colors"
          >
            {t.projects}
          </Link>
        </div>
      </header>

      <section
        aria-labelledby="vor-ort"
        className={`${sectionClass} grid md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 md:gap-14`}
      >
        <div data-reveal>
          <h2 id="vor-ort" className={`${sectionTitle} mb-5`}>
            {d.localTitle}
          </h2>
          <p className="text-[16px] md:text-[17px] text-text2 leading-relaxed">{d.localText}</p>
        </div>
        <dl data-reveal className="rounded-2xl border border-border bg-bg2 p-6 md:p-8 flex flex-col gap-5">
          {d.facts.map((f) => (
            <div key={f.term}>
              <dt className="text-[11px] font-bold tracking-widest uppercase text-text3 mb-1">{f.term}</dt>
              <dd className="text-[16px] font-medium">{f.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="leistungen-ort" className={sectionClass}>
        <h2 id="leistungen-ort" className={`${sectionTitle} mb-3`} data-reveal>
          {d.servicesTitle}
        </h2>
        <p className="text-[16px] text-text2 mb-10 max-w-[560px]" data-reveal>
          {d.servicesText}
        </p>
        <ul className="grid sm:grid-cols-2 gap-4">
          {offered.map((s, i) => {
            const Icon = s.icon;
            return (
              <li
                key={s.slug}
                data-reveal
                style={stagger(i)}
                className="group relative rounded-2xl border border-border bg-card p-6 md:p-8 motion-safe:transition hover:border-primary/40 motion-safe:hover:-translate-y-1"
              >
                <span
                  aria-hidden="true"
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-primary-light"
                >
                  <Icon size={20} className="text-primary-text" />
                </span>
                <h3 className="text-[19px] font-bold mb-2">
                  <Link
                    href={href(`/services/${s.slug}`)}
                    className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-primary"
                  >
                    {s[locale].title}
                  </Link>
                </h3>
                <p className="text-[14px] text-text2 leading-relaxed mb-5">
                  {d.serviceTexts?.[s.slug] ?? s[locale].short}
                </p>
                <span aria-hidden="true" className="inline-flex items-center gap-2 text-[13px] font-medium">
                  {t.more}
                  <ArrowRight
                    size={14}
                    className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
                  />
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="gruende" className={sectionClass}>
        <h2 id="gruende" className={`${sectionTitle} mb-10`} data-reveal>
          {d.reasonsTitle}
        </h2>
        <ol className="grid md:grid-cols-3 gap-8">
          {d.reasons.map((r, i) => (
            <li key={r.title} data-reveal style={stagger(i)}>
              <span aria-hidden="true" className="block text-[40px] font-bold text-primary-text leading-none mb-4">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-[18px] font-bold mb-2">{r.title}</h3>
              <p className="text-[15px] text-text2 leading-relaxed">{r.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="fragen-ort"
        className="py-16 md:py-20 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-10"
      >
        <h2 id="fragen-ort" className={sectionTitle} data-reveal>
          {d.faqTitle}
        </h2>
        <div className="min-w-0">
          <FaqList items={d.faqs} level={3} idPrefix="frage-ort" />
        </div>
      </section>

      <section aria-labelledby="ort-abschluss" className="pb-16 md:pb-24">
        <div data-reveal className="rounded-3xl bg-primary text-primary-foreground px-6 py-12 md:px-14 md:py-16">
          <h2
            id="ort-abschluss"
            className="text-[30px] md:text-[44px] font-bold leading-[1.1] tracking-tight mb-4 text-balance"
          >
            {d.ctaTitle}
          </h2>
          <p className="text-[16px] md:text-[18px] leading-relaxed max-w-[560px] mb-8">{d.ctaText}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={href('/contact')}
              className="group inline-flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-lg text-[14px] font-medium"
            >
              {t.cta}
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
              />
            </Link>
            <p className="text-[14px]">
              {t.mail}{' '}
              <a href={`mailto:${EMAIL}`} className="underline underline-offset-4 font-medium whitespace-nowrap">
                {EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
