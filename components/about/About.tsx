import { ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { aboutContent, aboutPhoto, chips, timeline, tools } from '@/lib/content/about';
import { localizedPath, type Locale } from '@/lib/i18n';
import { EMAIL } from '@/lib/site';
import { profilePageJsonLd } from '@/lib/structured-data';
import Journey from './Journey';
import ToolsMarquee from './ToolsMarquee';

// Über mich, umgebaut nach Vorlage matteofabbiani.webflow.io/about. Siehe functions/seiten/ueber-mich.md
export default function About({ locale }: { locale: Locale }) {
  const t = aboutContent[locale];
  return (
    <>
      <JsonLd data={profilePageJsonLd(locale)} />
      {/* Hero nach Vorlage matteofabbiani.webflow.io/about: große Begrüßung links, Hochkant-Foto rechts (AK-14) */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-8 md:px-12 pt-14 md:pt-20 pb-16 md:pb-24 grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-10 md:gap-16 items-center">
        <div>
          <p
            className="text-[11px] font-medium tracking-widest uppercase text-primary-text mb-4 hero-rise"
            style={{ '--r': 0 } as CSSProperties}
          >
            {t.eyebrow}
          </p>
          <h1
            className="text-[44px] sm:text-[64px] md:text-[60px] lg:text-[84px] font-bold leading-[0.98] tracking-[-0.04em] mb-6 hero-rise"
            style={{ '--r': 1 } as CSSProperties}
          >
            Erik Bergheimer
          </h1>
          <p
            className="text-[18px] md:text-[21px] font-medium text-foreground mb-4 text-balance hero-rise"
            style={{ '--r': 2 } as CSSProperties}
          >
            {t.role}
          </p>
          <p
            className="flex items-center gap-1.5 text-[13px] text-text2 mb-6 hero-rise"
            style={{ '--r': 3 } as CSSProperties}
          >
            <MapPin size={13} aria-hidden="true" />
            {t.badge} · {t.facts}
          </p>
          <p
            className="text-[16px] md:text-[17px] text-text2 leading-relaxed max-w-[560px] mb-8 hero-rise"
            style={{ '--r': 4 } as CSSProperties}
          >
            {t.intro}
          </p>
          <ul className="flex flex-wrap gap-2 hero-rise" style={{ '--r': 5 } as CSSProperties}>
            {chips[locale].map((c) => (
              <li
                key={c}
                className="bg-primary-light text-primary-text border border-primary-border px-3 py-1.5 rounded-full text-[12px] font-medium"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="relative aspect-[4/5] w-full max-w-[460px] md:ml-auto rounded-3xl overflow-hidden bg-bg2 hero-rise"
          style={{ '--r': 6 } as CSSProperties}
        >
          <Image
            src={aboutPhoto.src}
            alt={t.photoAlt}
            fill
            priority
            sizes="(min-width: 768px) 460px, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section aria-labelledby="werkzeuge" className="border-y border-border py-8 overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <h2 id="werkzeuge" className="text-[11px] font-bold tracking-widest uppercase text-text3 mb-6">
            {t.tools}
          </h2>
          <ul aria-label={t.tools} className="sr-only">
            {tools.map((tool) => (
              <li key={tool.name}>{tool.name}</li>
            ))}
          </ul>
        </div>
        <ToolsMarquee pauseLabel={t.pause} />
      </section>

      <Journey
        items={timeline}
        locale={locale}
        title={t.journey}
        intro={t.journeyIntro}
        hint={t.journeyHint}
        prev={t.journeyPrev}
        next={t.journeyNext}
      />

      {/* Abschluss nach Vorlage: „Jetzt bist du dran“ (AK-19) */}
      <section
        aria-labelledby="ueber-abschluss"
        className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12 py-24 md:py-36"
      >
        <div data-reveal className="max-w-[860px]">
          <h2
            id="ueber-abschluss"
            className="text-[40px] md:text-[72px] font-bold leading-[1.02] tracking-[-0.04em] mb-6 text-balance"
          >
            {t.outroTitle}
          </h2>
          <p className="text-[17px] md:text-[20px] text-text2 leading-relaxed max-w-[620px] mb-10">{t.outroText}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={localizedPath('/contact', locale)}
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-lg text-[14px] font-medium hover:bg-primary-hover transition-colors"
            >
              {t.cta}
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
              />
            </Link>
            <p className="text-[14px] text-text2">
              {t.outroMail}{' '}
              <a
                href={`mailto:${EMAIL}`}
                className="underline underline-offset-4 font-medium text-foreground whitespace-nowrap"
              >
                {EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
