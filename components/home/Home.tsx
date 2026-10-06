import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, type CSSProperties } from 'react';
import FaqList from '@/components/faq/FaqList';
import JsonLd from '@/components/JsonLd';
import CountUp from '@/components/motion/CountUp';
import Magnetic from '@/components/motion/Magnetic';
import LocalClock from './LocalClock';
import { aboutPhoto } from '@/lib/content/about';
import { faqs } from '@/lib/content/faq';
import { featuredProjects, heroMedia, homeContent } from '@/lib/content/home';
import { services } from '@/lib/content/services';
import { EMAIL } from '@/lib/site';
import { localizedPath, type Locale } from '@/lib/i18n';
import { homeJsonLd } from '@/lib/seo';

// Startseite, übernommen aus Lovable (HomePage.tsx) und umgebaut nach Vorlage designme.agency (Issue #17).
// Siehe functions/seiten/startseite.md, Animationen: functions/infrastruktur/animationen.md
/** Fragen für die FAQ-Auswahl auf der Startseite (AK-39) */
const HOME_FAQS = ['leistungen', 'ablauf', 'dauer', 'remote'];

const cardHover =
  'motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.15)]';

export default function Home({ locale }: { locale: Locale }) {
  const t = homeContent[locale];
  const href = (path: string) => localizedPath(path, locale);
  /** Gestaffeltes Einblenden: n-tes Geschwister startet n × 80 ms später */
  const stagger = (i: number) => ({ '--reveal-i': i }) as CSSProperties;
  const eyebrow = 'text-[11px] font-bold tracking-widest text-text3 uppercase';
  const sectionTitle = 'text-[28px] md:text-[36px] font-bold leading-tight tracking-tight text-foreground text-balance';

  return (
    <>
      <JsonLd data={homeJsonLd(locale)} />
      {/* Negativer Abstand = Navigationshöhe (64 px + 1 px Linie): der Hero liegt unter der (oben transparenten)
          Navigation (AK-36) und füllt mit ihr den ersten Bildschirm (AK-42) */}
      <section className="relative overflow-hidden border-b border-border -mt-[65px] pt-[65px] min-h-[100svh] flex flex-col justify-center">
        <div className="max-w-[1200px] w-full mx-auto px-5 sm:px-8 md:px-12 py-10 md:py-10">
          {/* Typografische h1 (AK-43): drei Zeilen in Mona Sans, „Erik“ und „Designer“ kursiv.
              Medien-Plätze und Randnotiz sind dekorativ (AK-44, AK-45), das Komma nur für Screenreader. */}
          <h1 className="text-[clamp(28px,7.6vw,80px)] leading-[0.98] tracking-[-0.035em] text-foreground font-bold uppercase">
            <span className="flex items-center justify-center gap-[0.2em]">
              <span data-word className="hero-word hero-line whitespace-nowrap" style={{ '--w': 0 } as CSSProperties}>
                {t.hero.lines[0]}
              </span>
              <HeroMedia index={0} className="w-[1.3em] h-[0.78em]" />{' '}
              <span
                data-word
                className="hero-word hero-line whitespace-nowrap italic text-primary-text pr-[0.06em]"
                style={{ '--w': 1 } as CSSProperties}
              >
                {t.hero.lines[1]}
                <span className="text-[0px]">,</span>
              </span>
            </span>{' '}
            <span className="flex items-center justify-center gap-[0.2em] lg:pl-[1.4em]">
              <span data-word className="hero-word hero-line whitespace-nowrap" style={{ '--w': 2 } as CSSProperties}>
                {t.hero.lines[2]}
              </span>
              <HeroMedia index={1} className="w-[1.05em] h-[1.05em]" />
            </span>{' '}
            <span className="flex items-center justify-center gap-[0.2em]">
              <HeroMedia index={2} className="w-[1.2em] h-[0.72em]" />
              <span
                data-word
                className="hero-word hero-line whitespace-nowrap italic pr-[0.06em]"
                style={{ '--w': 3 } as CSSProperties}
              >
                {t.hero.lines[3]}
              </span>
              <span
                aria-hidden="true"
                data-hero-note
                className="hidden sm:block normal-case not-italic text-[12px] md:text-[13px] font-medium leading-snug tracking-wide max-w-[12ch] self-end mb-[0.2em] hero-rise"
                style={{ '--r': 4 } as CSSProperties}
              >
                {t.hero.note}
              </span>
            </span>
          </h1>
          <div className="mt-10 md:mt-12 md:ml-auto md:mr-[6%] max-w-[500px]">
            <p
              className="text-[16px] md:text-[18px] leading-[1.5] text-foreground text-pretty hero-rise"
              style={{ '--r': 5 } as CSSProperties}
            >
              {t.hero.text} <span className="text-primary-text">{t.hero.accent}</span>
              {t.hero.after}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="unternehmen" className="border-b border-border">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12 pt-10 md:pt-12">
          <h2 id="unternehmen" className={`${eyebrow} text-center mb-6`} data-reveal>
            {t.companiesTitle}
          </h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-dashed border-border">
            {t.companies.map((c, i) => (
              <li key={c.name} data-reveal style={stagger(i)} className="border-r border-b border-dashed border-border">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  // Sichtbarer Text in derselben Reihenfolge, mit Pausen und Hinweis auf den neuen Tab (AK-32)
                  aria-label={[c.name, 'current' in c && c.current ? t.current : null, c.role]
                    .filter(Boolean)
                    .join(', ')
                    .concat(` ${t.newTab}`)}
                  className={`group relative flex flex-col items-center text-center gap-3 h-full min-h-[120px] md:min-h-[150px] px-4 pt-9 pb-6 md:pt-11 text-foreground motion-safe:transition-colors ${'current' in c && c.current ? 'bg-primary-light' : 'hover:bg-bg2'}`}
                >
                  {/* Feste Logo-Höhe: Logos und Rollen stehen in allen Kacheln auf einer Linie */}
                  <span className="flex items-center justify-center h-10 lg:h-12">
                    <CompanyLogo name={c.name} />
                  </span>
                  {'current' in c && c.current && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-primary-text">
                      <span aria-hidden="true" className="w-[6px] h-[6px] bg-primary rounded-full" />
                      {t.current}
                    </span>
                  )}
                  <span className={`text-[12px] ${'current' in c && c.current ? 'text-foreground' : 'text-text2'}`}>
                    {c.role}
                  </span>
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="absolute top-3 right-3 text-text3 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:transition-opacity"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12">
          <LocalClock locale={locale} label={t.clockLabel} />
        </div>
      </section>

      <section
        aria-labelledby="angebot"
        className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12 pt-16 md:pt-24 pb-12 md:pb-16 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8 lg:gap-12"
      >
        <div className="lg:sticky lg:top-24 lg:self-start" data-reveal>
          <h2 id="angebot" className={`${sectionTitle} mb-4`}>
            {t.offer}
          </h2>
          <p className="text-[16px] md:text-[17px] leading-relaxed text-text2 mb-6 max-w-[520px]">{t.offerIntro}</p>
          <Link
            href={href('/contact')}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-lg text-[13px] font-medium hover:bg-primary-hover transition-colors"
          >
            {t.contact}
          </Link>
        </div>
        <ol className="sticky-stack grid gap-4" style={{ '--stack-n': services.length } as CSSProperties}>
          {services.map((s, i) => {
            const Icon = s.icon;
            const text = s[locale];
            const accent = s.featured;
            return (
              <li
                key={s.slug}
                data-reveal
                style={{ '--stack-i': i } as CSSProperties}
                className={`group relative rounded-2xl p-6 md:p-8 border shadow-[0_-8px_30px_-20px_hsl(var(--foreground)/0.25)] ${cardHover} ${
                  accent ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <span
                    aria-hidden="true"
                    className={`text-[40px] md:text-[48px] font-bold leading-none tracking-tight ${
                      accent ? 'text-primary-foreground' : 'text-primary-text'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      accent ? 'bg-primary-foreground/15' : 'bg-primary-light'
                    }`}
                  >
                    <Icon size={18} className={accent ? 'text-primary-foreground' : 'text-primary-text'} />
                  </span>
                </div>
                <p
                  className={`text-[10px] font-medium tracking-wider uppercase mb-2 ${
                    accent ? 'text-primary-foreground' : 'text-text3'
                  }`}
                >
                  {text.label}
                </p>
                <h3 id={`leistung-${s.slug}`} className={`text-xl font-bold mb-2 ${accent ? '' : 'text-foreground'}`}>
                  {text.title}
                </h3>
                <p
                  id={`leistung-${s.slug}-text`}
                  className={`text-[14px] leading-relaxed mb-4 ${accent ? 'text-primary-foreground' : 'text-text2'}`}
                >
                  {text.short}
                </p>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-5">
                  {text.features.slice(0, 4).map((f) => (
                    <li
                      key={f}
                      className={`flex gap-2 text-[13px] ${accent ? 'text-primary-foreground' : 'text-foreground'}`}
                    >
                      <span aria-hidden="true" className={accent ? '' : 'text-primary-text'}>
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={href(`/services/${s.slug}`)}
                  aria-labelledby={`leistung-${s.slug}`}
                  aria-describedby={`leistung-${s.slug}-text`}
                  className={`inline-flex items-center gap-1.5 text-[13px] font-medium after:absolute after:inset-0 after:rounded-2xl ${
                    accent ? 'text-primary-foreground' : 'text-primary-text'
                  }`}
                >
                  {t.learnMore}
                  <ArrowRight
                    size={14}
                    aria-hidden="true"
                    className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
                  />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="ablauf" className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12 pb-16 md:pb-24">
        <h2 id="ablauf" className={`${sectionTitle} mb-8`} data-reveal>
          {t.process}
        </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {t.processSteps.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={stagger(i)}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <span
                aria-hidden="true"
                className="block text-[36px] font-bold leading-none tracking-tight text-primary-text mb-4"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-[13px] leading-relaxed text-text2">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="projekte" className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12 pb-16 md:pb-24">
        <div className="flex items-center justify-between gap-4 mb-6" data-reveal>
          <h2 id="projekte" className={sectionTitle}>
            {t.projects}
          </h2>
          <Link href={href('/projects')} className="py-1 text-xs text-primary-text hover:underline">
            {t.viewAll} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {featuredProjects.map((p, i) => {
            const text = p[locale];
            return (
              <li key={p.id} data-reveal style={stagger(i % 2)}>
                <Link
                  href={href(`/projects/${p.id}`)}
                  aria-labelledby={`projekt-${p.id}`}
                  aria-describedby={`projekt-${p.id}-typ projekt-${p.id}-text`}
                  className={`bg-card border border-border rounded-2xl overflow-hidden group h-full flex flex-col ${cardHover}`}
                >
                  <span className="relative block overflow-hidden aspect-[16/10]" style={{ background: p.color }}>
                    <Image
                      src={p.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 550px, 100vw"
                      className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="p-5 md:p-6 flex-1 flex flex-col">
                    <span id={`projekt-${p.id}-typ`} className="sr-only">
                      {text.type}
                    </span>
                    <ul aria-label={t.tags} className="flex flex-wrap gap-1.5 mb-3">
                      {text.type.split(' · ').map((tag) => (
                        <li
                          key={tag}
                          className="text-[11px] font-medium tracking-wider uppercase text-primary-text bg-primary-light border border-primary-border rounded-full px-2.5 py-1"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <h3 id={`projekt-${p.id}`} className="text-lg font-bold text-foreground mb-1.5">
                      {text.title}
                    </h3>
                    <span id={`projekt-${p.id}-text`} className="text-[13px] text-text2 leading-relaxed mb-4">
                      {text.desc}
                    </span>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-medium text-primary-text">
                      {t.readCase}
                      <ArrowRight
                        size={14}
                        aria-hidden="true"
                        className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
                      />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="ueber-mich" className="border-y border-border bg-bg2">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12 py-16 md:py-24 grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 md:gap-14 items-center">
          <div
            data-reveal
            className="relative aspect-square max-w-[360px] w-full rounded-2xl overflow-hidden border border-border"
          >
            <Image
              src={aboutPhoto.src}
              alt={t.aboutPhotoAlt}
              fill
              sizes="(min-width: 768px) 360px, 90vw"
              className="object-cover"
            />
          </div>
          <div data-reveal style={stagger(1)}>
            <h2 id="ueber-mich" className={`${sectionTitle} mb-5`}>
              {t.aboutTitle}
            </h2>
            {t.aboutText.map((para) => (
              <p key={para} className="text-[17px] md:text-[19px] leading-relaxed text-foreground mb-4">
                {para}
              </p>
            ))}
            <Link
              href={href('/about')}
              className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-primary-text mt-2"
            >
              {t.aboutMore}
              <ArrowRight
                size={14}
                aria-hidden="true"
                className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
        {/* Faktenleiste unter Foto und Text (AK-37) */}
        <dl className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 border-t border-border">
          {t.stats.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              style={stagger(i)}
              className="flex flex-col-reverse justify-end min-w-0 px-6 sm:px-8 lg:px-10 py-10 border-r border-b md:border-b-0 border-border last:border-r-0"
            >
              <dt className="text-xs text-text3 mt-2">{s.label}</dt>
              <dd
                className={`font-light text-primary-text leading-none tracking-tight min-w-0 ${
                  /^\d/.test(s.value)
                    ? 'text-[26px] md:text-[28px] lg:text-[34px]'
                    : 'text-[20px] md:text-[22px] lg:text-[26px]'
                }`}
              >
                <CountUp value={s.value} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* FAQ-Auswahl (AK-39) */}
      <section
        aria-labelledby="haeufige-fragen"
        className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12 pt-16 md:pt-24 grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8 md:gap-12"
      >
        <div className="md:sticky md:top-24 md:self-start">
          <h2 id="haeufige-fragen" className={`${sectionTitle} mb-4`}>
            {t.faqTitle}
          </h2>
          <Link
            href={href('/faqs')}
            className="group inline-flex items-center gap-1.5 min-h-11 text-[14px] font-medium text-primary-text"
          >
            {t.faqAll}
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
            />
          </Link>
        </div>
        <FaqList items={HOME_FAQS.map((id) => faqs.find((f) => f.id === id)![locale])} idPrefix="start-frage" />
      </section>

      <section aria-labelledby="abschluss" className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12 py-16 md:py-24">
        <div data-reveal className="rounded-3xl bg-primary text-primary-foreground px-6 py-12 md:px-14 md:py-16">
          <h2
            id="abschluss"
            className="text-[30px] md:text-[44px] font-bold leading-[1.1] tracking-tight mb-4 text-balance"
          >
            {t.ctaTitle}
          </h2>
          <p className="text-[16px] md:text-[18px] leading-relaxed max-w-[560px] mb-8">{t.ctaText}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={href('/contact')}
              className="group inline-flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-lg text-[14px] font-medium"
            >
              {t.contact}
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
              />
            </Link>
            <p className="text-[14px]">
              {t.ctaMail}{' '}
              <a href={`mailto:${EMAIL}`} className="underline underline-offset-4 font-medium whitespace-nowrap">
                {EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/** Echte Logos als einfarbige SVG-Dateien, nachgezeichnet aus Eriks Dateien (AK-34).
 *  Höhen gleichen die unterschiedlichen Seitenverhältnisse optisch an. */
const logos: Record<string, { src: string; width: number; height: number; className: string }> = {
  'HERO Software': { src: '/logos/hero.svg', width: 900, height: 233, className: 'h-6 lg:h-7' },
  TEAM23: { src: '/logos/team23.svg', width: 137, height: 32, className: 'h-6 lg:h-7' },
  Amazon: { src: '/logos/amazon.svg', width: 960, height: 290, className: 'h-7 lg:h-8 translate-y-1' },
  IKEA: { src: '/logos/ikea.svg', width: 960, height: 384, className: 'h-7 lg:h-9' },
};

function CompanyLogo({ name }: { name: string }) {
  const logo = logos[name];
  if (!logo) return <span className="text-[20px] lg:text-[26px] font-bold leading-none">{name}</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- kleine SVG-Datei, keine Bildoptimierung nötig
    <img
      src={logo.src}
      alt=""
      width={logo.width}
      height={logo.height}
      className={`w-auto max-w-full dark:invert ${logo.className}`}
    />
  );
}

/** Medien-Platz im Hero (AK-44): Bild/GIF von Erik oder, solange es fehlt, eine ruhige Fläche. Dekorativ, magnetisch (AK-49). */
function HeroMedia({ index, className }: { index: number; className: string }) {
  const m = heroMedia[index];
  return (
    <Magnetic>
      <span
        aria-hidden="true"
        data-hero-media
        className={`hero-media relative inline-block shrink-0 overflow-hidden rounded-[0.14em] bg-primary-light dark:bg-primary/25 border border-primary-border ${className}`}
        style={{ '--r': index + 1 } as CSSProperties}
      >
        {m?.src && (
          <Image
            src={m.src}
            alt=""
            fill
            sizes="200px"
            unoptimized={m.src.endsWith('.gif')}
            className="object-cover"
            // Leicht gegenläufig zum Magneten (AK-49)
            style={{ transform: 'translate(var(--magnet-x, 0), var(--magnet-y, 0)) scale(1.1)' }}
          />
        )}
      </span>
    </Magnetic>
  );
}
