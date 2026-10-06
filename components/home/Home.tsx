import { ArrowRight, ArrowUpRight, MessagesSquare, PenTool, Rocket, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, type CSSProperties } from 'react';
import FaqList from '@/components/faq/FaqList';
import JsonLd from '@/components/JsonLd';
import CountUp from '@/components/motion/CountUp';
import Magnetic from '@/components/motion/Magnetic';
import ProjectRail from '@/components/home/ProjectRail';
import ServiceAccordion from '@/components/home/ServiceAccordion';
import { aboutPhoto } from '@/lib/content/about';
import { faqs } from '@/lib/content/faq';
import { projects } from '@/lib/content/projects';
import { featuredProjects, heroMedia, homeContent } from '@/lib/content/home';
import { services } from '@/lib/content/services';
import { EMAIL } from '@/lib/site';
import { localizedPath, type Locale } from '@/lib/i18n';
import { homeJsonLd } from '@/lib/seo';

// Startseite, übernommen aus Lovable (HomePage.tsx) und umgebaut nach Vorlage designme.agency (Issue #17).
// Siehe functions/seiten/startseite.md, Animationen: functions/infrastruktur/animationen.md
/** Fragen für die FAQ-Auswahl auf der Startseite (AK-39) */
const HOME_FAQS = ['leistungen', 'ablauf', 'dauer', 'remote'];
/** Icons der Ablauf-Schritte (AK-60): Kennenlernen, Analyse & Angebot, Umsetzung, Launch & Betreuung */
const PROCESS_ICONS = [MessagesSquare, Search, PenTool, Rocket];

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
      <section className="relative overflow-hidden -mt-[65px] pt-[65px] min-h-[100svh] flex flex-col justify-center">
        <div className="w-full max-w-page mx-auto px-6 sm:px-8 md:px-12 py-10 md:py-10">
          {/* Typografische h1 (AK-43): drei Zeilen in Mona Sans, „Erik“ und „Designer“ kursiv.
              Medien-Plätze und Randnotiz sind dekorativ (AK-44, AK-45), das Komma nur für Screenreader. */}
          {/* Unter 640 px größer und mit Umbruch nach „Hey, ich bin“ (AK-63) */}
          <h1 className="text-[clamp(36px,11.5vw,60px)] sm:text-[clamp(28px,7.6vw,80px)] leading-[0.98] tracking-[-0.035em] text-foreground font-bold uppercase">
            <span className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-x-[0.2em]">
              <span data-word className="hero-word hero-line whitespace-nowrap" style={{ '--w': 0 } as CSSProperties}>
                {t.hero.lines[0]}
              </span>
              {/* Zeilenumbruch nur unter 640 px; das Wort selbst bleibt so breit wie sein Text (AK-63) */}
              <span aria-hidden="true" className="basis-full h-0 sm:hidden" />
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

      <section aria-labelledby="unternehmen">
        <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12 pt-10 md:pt-12">
          <h2 id="unternehmen" className={`${eyebrow} text-center mb-6`} data-reveal>
            {t.companiesTitle}
          </h2>
        </div>
        {/* Durchgehende Linien über die volle Breite, außen senkrecht ab 768 px (AK-62) */}
        <div className="border-y border-border mb-10 md:mb-12">
          <ul className="md:w-[calc(100%-6rem)] md:max-w-[calc(1280px-6rem)] mx-auto grid grid-cols-2 md:grid-cols-4 auto-rows-fr md:border-l border-border">
            {t.companies.map((c, i) => (
              <li
                key={c.name}
                data-reveal
                style={stagger(i)}
                className="border-border [&:nth-child(odd)]:border-r md:border-r [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0"
              >
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
      </section>

      {/* Leistungen als Akkordeon (AK-64 bis AK-66) */}
      <section
        aria-labelledby="angebot"
        className="max-w-page mx-auto px-6 sm:px-8 md:px-12 pt-16 md:pt-28 pb-16 md:pb-24"
      >
        <div className="text-center max-w-[900px] mx-auto mb-12 md:mb-24" data-reveal>
          <p className={`${eyebrow} mb-4`}>{t.offerEyebrow}</p>
          <h2
            id="angebot"
            className="text-[36px] sm:text-[48px] md:text-[64px] lg:text-[80px] font-bold leading-[1.02] tracking-[-0.03em] text-foreground text-balance mb-5 md:mb-6"
          >
            {t.offer}
          </h2>
          <p className="text-[16px] md:text-[19px] leading-relaxed text-foreground max-w-[620px] mx-auto">
            {t.offerIntro}
          </p>
        </div>
        <ServiceAccordion
          items={services.map((s) => {
            const Icon = s.icon;
            const text = s[locale];
            return {
              slug: s.slug,
              href: href(`/services/${s.slug}`),
              title: text.title,
              description: text.description,
              features: text.features,
              more: t.serviceMore(text.title),
              media: <Icon size={72} strokeWidth={1.25} className="opacity-90" />,
            };
          })}
        />
      </section>

      {/* Ablauf als Timeline mit klebender linker Spalte (AK-59 bis AK-61) */}
      <section aria-labelledby="ablauf" className="border-y border-border bg-bg2">
        <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12 py-16 md:py-24 grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-10 md:gap-16">
          <div data-process-intro data-reveal className="md:sticky md:top-28 md:self-start">
            <p className="text-[14px] font-semibold text-primary-text mb-3">{t.processEyebrow}</p>
            <h2 id="ablauf" className={`${sectionTitle} mb-6`}>
              {t.process}
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href={href('/contact')}
                className="inline-flex items-center min-h-11 px-5 rounded-lg bg-primary text-primary-foreground text-[14px] font-medium hover:bg-primary-hover transition-colors"
              >
                {t.contact}
              </Link>
              <Link
                href={href('/projects')}
                className="inline-flex items-center min-h-11 px-5 rounded-lg border border-border bg-background text-foreground text-[14px] font-medium hover:border-primary/40 transition-colors"
              >
                {t.processProjects}
              </Link>
            </div>
          </div>
          <ol role="list">
            {t.processSteps.map((step, i) => {
              const Icon = PROCESS_ICONS[i]!;
              const last = i === t.processSteps.length - 1;
              return (
                <li
                  key={step.title}
                  data-reveal
                  style={stagger(i)}
                  className="grid grid-cols-[56px_minmax(0,1fr)] gap-x-5 md:gap-x-8"
                >
                  <div className="flex flex-col items-center">
                    <span
                      aria-hidden="true"
                      data-step-icon
                      className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/[0.08] dark:bg-primary/[0.18] shrink-0"
                    >
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/[0.14] dark:bg-primary/30 text-primary-text">
                        <Icon size={20} />
                      </span>
                    </span>
                    {!last && (
                      <span
                        aria-hidden="true"
                        data-step-line
                        className="relative flex-1 w-0.5 min-h-16 my-3 rounded-full bg-foreground/15 overflow-clip"
                      >
                        <span className="process-line absolute inset-0 rounded-full bg-primary origin-top" />
                      </span>
                    )}
                  </div>
                  <div className={`pt-3 ${last ? '' : 'pb-12 md:pb-16'}`}>
                    <h3 className="text-[18px] md:text-[20px] font-bold leading-snug text-foreground mb-2">
                      {i + 1}. {step.title}
                    </h3>
                    <p className="text-[15px] md:text-[16px] leading-relaxed text-text2">{step.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Referenzen als dunkles Querband (AK-53 bis AK-56) */}
      <section aria-labelledby="projekte" className="bg-[#0b1219] text-white dark:border-y dark:border-white/10">
        <ProjectRail
          toProject={t.toProject}
          items={featuredProjects.map((p) => {
            const text = p[locale];
            const tags = text.type.split(' · ');
            return {
              id: p.id,
              href: href(`/projects/${p.id}`),
              title: text.title,
              year: projects.find((q) => q.slug === p.id)?.year ?? '',
              kind: tags[tags.length - 1]!,
              category: tags[0]!,
              image: p.image,
              color: p.color,
            };
          })}
        >
          <div
            data-reveal
            className="w-full max-w-page mx-auto px-6 sm:px-8 md:px-12 mb-8 md:mb-12 grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4 md:gap-8"
          >
            <p className="self-start flex items-center gap-3 text-[15px] font-medium md:pt-4">
              <span aria-hidden="true" className="w-2 h-2 rounded-full bg-primary" />
              {t.references}
            </p>
            <div>
              <h2
                id="projekte"
                className="text-[30px] md:text-[48px] font-bold leading-[1.1] tracking-tight text-balance"
              >
                {t.projects}
              </h2>
              <Link
                href={href('/projects')}
                className="inline-flex items-center min-h-11 mt-2 text-[15px] text-white/80 underline underline-offset-4 hover:text-white focus-visible:outline-white"
              >
                {t.viewAll}
              </Link>
            </div>
          </div>
        </ProjectRail>
      </section>

      <section aria-labelledby="ueber-mich" className="border-y border-border bg-bg2">
        <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div data-reveal className="relative aspect-square w-full rounded-2xl overflow-hidden border border-border">
            <Image
              src={aboutPhoto.src}
              alt={t.aboutPhotoAlt}
              fill
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
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
        {/* Faktenleiste unter Foto und Text (AK-37); Linien über die volle Breite, außen senkrecht (AK-57) */}
        <div className="border-t border-border">
          <dl className="md:w-[calc(100%-6rem)] md:max-w-[calc(1280px-6rem)] mx-auto grid grid-cols-2 md:grid-cols-4 md:border-l border-border">
            {t.stats.map((s, i) => (
              <div
                key={s.label}
                data-reveal
                style={stagger(i)}
                className="flex flex-col-reverse justify-end min-w-0 px-6 sm:px-8 lg:px-10 py-10 border-b md:border-b-0 border-border [&:nth-child(odd)]:border-r md:border-r"
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
        </div>
      </section>

      {/* FAQ-Auswahl (AK-39) */}
      <section
        aria-labelledby="haeufige-fragen"
        className="max-w-page mx-auto px-6 sm:px-8 md:px-12 pt-16 md:pt-24 grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8 md:gap-12"
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

      <section aria-labelledby="abschluss" className="max-w-page mx-auto px-6 sm:px-8 md:px-12 py-16 md:py-24">
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
            style={{
              transform: 'translate(var(--magnet-x, 0), var(--magnet-y, 0)) scale(1.1)',
              objectPosition: m.position,
            }}
          />
        )}
      </span>
    </Magnetic>
  );
}
