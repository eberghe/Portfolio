import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import { projects } from '@/lib/content/projects';
import { services } from '@/lib/content/services';
import JsonLd from '@/components/JsonLd';
import { localizedPath, type Locale } from '@/lib/i18n';
import { servicesItemListJsonLd } from '@/lib/structured-data';

// Übersicht der Leistungen nach Vorlage designme.agency/services (functions/seiten/leistungen.md AK-29 bis AK-34):
// Kopf mit grünem Verlauf, Sprungliste, je Leistung ein Abschnitt und ein Vollbild darunter.

export const overviewText = {
  de: {
    metaTitle: 'Leistungen: UX/UI, Webentwicklung, Barrierefreiheit, KI | Erik Bergheimer',
    metaDescription:
      'UX/UI, Webdesign & Webentwicklung, Barrierefreiheit, KI-Beratung, Website-Optimierung, Brand-Design und Design Systeme aus Augsburg.',
    eyebrow: 'Was ich mache',
    title: 'Leistungen für Websites und digitale Produkte',
    intro: 'Viele Fähigkeiten, ein Ansprechpartner: von der ersten Idee bis zur fertigen, barrierefreien Umsetzung.',
    keywords: 'Schlagworte',
    jumpLabel: 'Leistungen auf dieser Seite',
    need: 'Wann du das brauchst:',
    get: 'Das bekommst du:',
    related: 'Passende Arbeit:',
    more: (title: string) => `Mehr zu ${title}`,
    cta: 'Nicht sicher, was passt?',
    ctaText:
      'Erzähl mir kurz, worum es geht. Im kostenlosen Erstgespräch finden wir heraus, welche Leistung dir am meisten bringt.',
    contact: 'Kostenloses Erstgespräch',
  },
  en: {
    metaTitle: 'Services: UX/UI, web development, accessibility, AI | Erik Bergheimer',
    metaDescription:
      'UX/UI, web design & development, accessibility, AI consulting, website optimisation, brand design and design systems from Augsburg.',
    eyebrow: 'What I do',
    title: 'Services for websites and digital products',
    intro: 'Many skills, one point of contact: from the first idea to a finished, accessible build.',
    keywords: 'Keywords',
    jumpLabel: 'Services on this page',
    need: 'When you need this:',
    get: 'What you get:',
    related: 'Related work:',
    more: (title: string) => `More on ${title}`,
    cta: 'Not sure what fits?',
    ctaText: 'Tell me briefly what it is about. In a free intro call we find out which service helps you most.',
    contact: 'Free intro call',
  },
};

const container = 'max-w-page mx-auto px-6 sm:px-8 md:px-12';
const label = 'text-[13px] md:text-[14px] font-medium tracking-wide uppercase text-text3';
const num = (i: number) => String(i + 1).padStart(2, '0');

export default function ServicesOverview({ locale }: { locale: Locale }) {
  const t = overviewText[locale];
  return (
    <>
      <JsonLd data={servicesItemListJsonLd(locale)} />
      {/* Grüner Verlauf oben (AK-29); der negative Abstand legt ihn unter die transparente Navigation (AK-36) */}
      <header className="relative overflow-hidden -mt-[65px] pt-[65px]">
        <div
          data-gradient
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--primary)/0.22),transparent_70%)]"
        />
        <div className={`relative ${container} pt-20 md:pt-28 pb-12 md:pb-20 text-center`} data-reveal>
          <p className={`${label} mb-5`}>{t.eyebrow}</p>
          <h1 className="text-[36px] sm:text-[48px] md:text-[64px] lg:text-[76px] font-bold leading-[1.02] tracking-[-0.03em] text-foreground text-balance max-w-[1000px] mx-auto">
            {t.title}
          </h1>
          <p className="mt-6 text-[16px] md:text-[19px] leading-relaxed text-foreground max-w-[620px] mx-auto">
            {t.intro}
          </p>
        </div>
      </header>

      {/* Sprungliste (AK-30) */}
      <nav aria-label={t.jumpLabel} className={`${container} pb-16 md:pb-28`}>
        <ol role="list" className="grid md:grid-cols-2 md:grid-flow-col md:grid-rows-4 border-t border-border bg-card">
          {services.map((s, i) => (
            <li key={s.slug} className="border-b border-border md:[&:nth-child(-n+4)]:border-r">
              <a
                href={`#${s.slug}`}
                className="group flex items-center gap-4 px-5 md:px-8 py-5 md:py-7 rounded-sm hover:bg-bg2 motion-safe:transition-colors"
              >
                <span aria-hidden="true" className="w-7 shrink-0 text-[15px] md:text-[17px] text-text3">
                  {num(i)}
                </span>
                <span className="flex-1 text-[18px] md:text-[22px] font-semibold text-foreground">
                  {s[locale].title}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="w-6 h-6 shrink-0 text-foreground motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {services.map((s) => {
        const text = s[locale];
        const Icon = s.icon;
        const related = projects.filter((p) => p.service === s.slug).slice(0, 3);
        return (
          <Fragment key={s.slug}>
            <section
              id={s.slug}
              aria-labelledby={`${s.slug}-titel`}
              className={`${container} scroll-mt-24 pt-16 md:pt-28 pb-16 md:pb-24`}
            >
              <h2
                id={`${s.slug}-titel`}
                data-reveal
                className="text-[32px] sm:text-[44px] md:text-[60px] lg:text-[88px] font-bold leading-[1] tracking-[-0.035em] text-foreground break-words hyphens-auto"
              >
                {text.title}
              </h2>
              <div className="mt-8 md:mt-12 border-t border-border pt-8 md:pt-10 grid md:grid-cols-2 gap-12 md:gap-16">
                <div className="flex flex-col" data-reveal>
                  <p className={`${label} mb-5`}>{t.need}</p>
                  <p
                    id={`${s.slug}-bedarf`}
                    className="text-[19px] md:text-[23px] leading-snug font-medium text-foreground max-w-[560px]"
                  >
                    {text.need}
                  </p>
                  <Link
                    href={localizedPath(`/services/${s.slug}`, locale)}
                    aria-describedby={`${s.slug}-bedarf`}
                    className="group mt-8 md:mt-12 self-start inline-flex items-center gap-1.5 text-[16px] font-semibold text-foreground underline underline-offset-[6px] decoration-1 hover:text-primary-text"
                  >
                    {t.more(text.title)}
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
                    />
                  </Link>
                  {related.length > 0 && (
                    <div className="mt-12 md:mt-auto md:pt-16">
                      <p className={`${label} mb-4`}>{t.related}</p>
                      <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {related.map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={localizedPath(`/projects/${p.slug}`, locale)}
                              className="group block rounded-lg overflow-hidden bg-bg2"
                            >
                              <span className="relative block aspect-[4/3] overflow-hidden">
                                <Image
                                  src={p.thumbnail.src}
                                  quality={90}
                                  alt=""
                                  fill
                                  sizes="(min-width: 768px) 200px, 45vw"
                                  className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]"
                                />
                              </span>
                              <span className="block px-3 py-2.5 text-[13px] font-medium text-foreground">
                                {p[locale].title}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div data-reveal>
                  <p className={`${label} mb-2`}>{t.get}</p>
                  <ol role="list">
                    {text.features.map((f, n) => (
                      <li
                        key={f}
                        className="flex items-baseline gap-4 py-5 md:py-6 border-b border-border text-[18px] md:text-[22px] font-medium text-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="w-7 shrink-0 text-[14px] md:text-[16px] font-normal text-text3"
                        >
                          {num(n)}
                        </span>
                        {f}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>
            {/* Vollbild unter jeder Leistung (AK-32); echtes Bild mit Alt-Text, sonst dekorativer Platzhalter (AK-38).
                TODO(Erik): Bilder für die übrigen Leistungen */}
            {s.image ? (
              // Ganzes Bild ohne Beschnitt: Breite Bänder und Hochformat würden sonst Bausteine abschneiden, die der Alt-Text nennt
              <div data-fullbleed className="bg-bg2 border-y border-border px-4 sm:px-8 md:px-12 py-8 md:py-14">
                <div className="relative max-w-page mx-auto aspect-[16/9] rounded-xl overflow-hidden">
                  <Image
                    src={s.image.src}
                    alt={locale === 'de' ? s.image.alt : s.image.altEn}
                    fill
                    sizes="(min-width: 1280px) 1280px, 100vw"
                    quality={90}
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <div
                data-fullbleed
                aria-hidden="true"
                className="relative h-[70svh] max-h-[720px] min-h-[280px] overflow-hidden bg-[#0b1219] flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_30%_20%,hsl(var(--primary)/0.55),transparent_70%),radial-gradient(ellipse_60%_60%_at_85%_90%,hsl(160_60%_45%/0.35),transparent_70%)]" />
                <Icon className="relative w-20 h-20 md:w-28 md:h-28 text-white/85" strokeWidth={1} />
              </div>
            )}
          </Fragment>
        );
      })}

      {/* Abschluss (AK-35) */}
      <section aria-labelledby="leistungen-abschluss" className={`${container} py-20 md:py-28 text-center`} data-reveal>
        <h2
          id="leistungen-abschluss"
          className="text-[32px] md:text-[48px] font-bold leading-tight tracking-tight text-foreground text-balance"
        >
          {t.cta}
        </h2>
        <p className="mt-4 text-[16px] md:text-[18px] leading-relaxed text-text2 max-w-[560px] mx-auto">{t.ctaText}</p>
        <Link
          href={localizedPath('/contact', locale)}
          className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg text-[14px] font-medium hover:bg-primary-hover transition-colors"
        >
          {t.contact}
        </Link>
      </section>
    </>
  );
}
