import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { featuredProjects, homeContent } from '@/lib/content/home';
import { services } from '@/lib/content/services';
import { localizedPath, type Locale } from '@/lib/i18n';

// Startseite, übernommen aus Lovable (HomePage.tsx). Siehe functions/seiten/startseite.md
const cardHover =
  'motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.15)]';

export default function Home({ locale }: { locale: Locale }) {
  const t = homeContent[locale];
  const href = (path: string) => localizedPath(path, locale);

  return (
    <>
      <section className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-2 border-b border-border">
        <div className="flex flex-col justify-center px-6 sm:px-8 md:px-16 py-16 md:py-20 motion-safe:animate-fade-in">
          <p className="inline-flex items-center gap-1.5 bg-primary-light text-primary-text border border-primary-border px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide mb-8 w-fit">
            <span
              aria-hidden="true"
              className="w-[5px] h-[5px] bg-primary rounded-full motion-safe:animate-pulse-dot"
            />
            {t.available}
          </p>
          <h1 className="text-5xl md:text-[56px] font-light leading-[1.08] tracking-[-2px] text-foreground mb-6">
            {t.greeting}
            <span className="text-primary-text">Erik Bergheimer</span>
            <span className="sr-only">, </span>
            <span className="block text-[20px] md:text-[22px] text-text2 font-normal tracking-normal mt-3">
              {t.role}
            </span>
          </h1>
          <p className="text-[17px] text-text2 leading-relaxed max-w-[440px] mb-8">{t.intro}</p>
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href={href('/contact')}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity"
            >
              {t.contact}
            </Link>
            <Link
              href={href('/projects')}
              className="border border-border text-text2 px-6 py-3 rounded-lg text-[13px] hover:text-foreground hover:border-muted-foreground transition-all"
            >
              {t.viewProjects}
            </Link>
          </div>
        </div>
        <div className="relative border-t md:border-t-0 md:border-l border-border overflow-hidden min-h-[300px] md:min-h-0">
          <Image
            src="/images/hero-erik.png"
            alt={t.heroAlt}
            fill
            priority
            sizes="(min-width: 768px) 100vh, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <dl className="grid grid-cols-2 md:grid-cols-4 border-b border-border">
        {t.stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col-reverse justify-end px-6 sm:px-8 md:px-10 py-10 border-r border-border last:border-r-0"
          >
            <dt className="text-xs text-text3 mt-2">{s.label}</dt>
            <dd
              className={`font-light text-primary-text leading-none tracking-tight ${
                'small' in s && s.small ? 'text-[24px] pt-1' : 'text-[36px] tracking-[-1.5px]'
              }`}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="angebot" className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12 pb-16">
        <h2 id="angebot" className="text-[11px] font-medium tracking-widest text-text3 uppercase mt-16 mb-6">
          {t.offer}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((s) => {
            const Icon = s.icon;
            const text = s[locale];
            const accent = s.featured;
            return (
              <li key={s.slug}>
                <Link
                  href={href(`/services/${s.slug}`)}
                  aria-labelledby={`leistung-${s.slug}`}
                  aria-describedby={`leistung-${s.slug}-text`}
                  className={`block rounded-2xl p-6 border group relative h-full ${cardHover} ${
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
                  <span
                    aria-hidden="true"
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                      accent ? 'bg-primary-foreground/15' : 'bg-primary-light'
                    }`}
                  >
                    <Icon size={18} className={accent ? 'text-primary-foreground' : 'text-primary-text'} />
                  </span>
                  <span
                    className={`block text-[10px] font-medium tracking-wider uppercase mb-2 ${
                      accent ? 'text-primary-foreground' : 'text-text3'
                    }`}
                  >
                    {text.label}
                  </span>
                  <h3
                    id={`leistung-${s.slug}`}
                    className={`text-base font-medium mb-2 ${accent ? '' : 'text-foreground'}`}
                  >
                    {text.title}
                  </h3>
                  <span
                    id={`leistung-${s.slug}-text`}
                    className={`block text-[13px] leading-relaxed ${accent ? 'text-primary-foreground' : 'text-text2'}`}
                  >
                    {text.short}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="ablauf" className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12 pb-16">
        <h2 id="ablauf" className="text-[11px] font-medium tracking-widest text-text3 uppercase mb-6">
          {t.process}
        </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {t.processSteps.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-border bg-card p-6">
              <span aria-hidden="true" className="block text-[36px] font-light leading-none text-primary-text mb-4">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-base font-medium text-foreground mb-2">{step.title}</h3>
              <p className="text-[13px] leading-relaxed text-text2">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="projekte" className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12 pb-20">
        <div className="flex items-center justify-between gap-4 mb-5 mt-4">
          <h2 id="projekte" className="text-[11px] font-medium tracking-widest text-text3 uppercase">
            {t.projects}
          </h2>
          <Link href={href('/projects')} className="py-1 text-xs text-primary-text hover:underline">
            {t.viewAll} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {featuredProjects.map((p) => {
            const text = p[locale];
            return (
              <li key={p.id}>
                <Link
                  href={href(`/projects/${p.id}`)}
                  aria-labelledby={`projekt-${p.id}`}
                  aria-describedby={`projekt-${p.id}-typ projekt-${p.id}-text`}
                  className={`bg-card border border-border rounded-2xl overflow-hidden group h-full flex flex-col ${cardHover}`}
                >
                  <span className="relative block overflow-hidden h-[180px]" style={{ background: p.color }}>
                    <Image
                      src={p.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 550px, 100vw"
                      className="object-cover"
                    />
                  </span>
                  <span className="p-5 flex-1 flex flex-col">
                    <span
                      id={`projekt-${p.id}-typ`}
                      className="text-[10px] font-medium tracking-wider uppercase text-primary-text mb-1.5"
                    >
                      {text.type}
                    </span>
                    <h3 id={`projekt-${p.id}`} className="text-[15px] font-medium text-foreground mb-1.5">
                      {text.title}
                    </h3>
                    <span id={`projekt-${p.id}-text`} className="text-xs text-text2 leading-relaxed">
                      {text.desc}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
