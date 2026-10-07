import type { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { comingSoon, projects } from '@/lib/content/projects';
import JsonLd from '@/components/JsonLd';
import { localizedPath, type Locale } from '@/lib/i18n';
import { EMAIL } from '@/lib/site';
import { projectsItemListJsonLd } from '@/lib/structured-data';
import ProjectFilter from './ProjectFilter';

// Projektübersicht, übernommen aus Lovable (ProjectsPage.tsx), umgebaut nach Vorlage designme.agency/projects
// (Issue #18). Siehe functions/seiten/projekte.md
export const projectsOverviewText = {
  de: {
    metaTitle: 'Projekte: UX/UI, Webflow & Fotografie | Erik Bergheimer',
    metaDescription:
      'Projekte von Erik Bergheimer, UX/UI-Designer aus Augsburg: Case Studies, eine Bachelorarbeit zu Webflow und Shopify, Reisefotografie aus Indonesien und Marokko.',
    eyebrow: 'Projekte',
    title: 'UX/UI, Webflow & Fotografie: ausgewählte Arbeiten',
    intro:
      'Von der App, die Kindern Wiederbelebung beibringt, bis zur Fotoserie aus Marokko: Hier zeige ich, wie ich Probleme angehe und was dabei herauskommt.',
    filter: 'Projekte filtern',
    filters: { all: 'Alle', ux: 'UX/UI', web: 'Web', photo: 'Fotografie' },
    count: { one: '1 Projekt', other: '{n} Projekte' },
    readCase: 'Fallstudie lesen',
    viewSeries: 'Fotoserie ansehen',
    type: 'Art',
    soonTitle: 'In Arbeit',
    soon: 'Kommt bald',
    ctaTitle: 'Dein Projekt könnte das nächste sein',
    ctaText:
      'Erzähl mir, was du vorhast. Im kostenlosen Erstgespräch klären wir, wo du stehst und wie ich helfen kann.',
    cta: 'Kostenloses Erstgespräch',
    ctaMail: 'Oder schreib direkt an',
  },
  en: {
    metaTitle: 'Projects: UX/UI, Webflow & photography | Erik Bergheimer',
    metaDescription:
      'Projects by Erik Bergheimer, UX/UI designer in Augsburg: case studies, a bachelor thesis on Webflow and Shopify, travel photography from Indonesia and Morocco.',
    eyebrow: 'Projects',
    title: 'UX/UI, Webflow & photography: selected work',
    intro:
      'From an app that teaches children CPR to a photo series from Morocco: this is how I approach problems and what comes out of it.',
    filter: 'Filter projects',
    filters: { all: 'All', ux: 'UX/UI', web: 'Web', photo: 'Photography' },
    count: { one: '1 project', other: '{n} projects' },
    readCase: 'Read case study',
    viewSeries: 'View photo series',
    type: 'Type',
    soonTitle: 'In the pipeline',
    soon: 'Coming soon',
    ctaTitle: 'Your project could be next',
    ctaText: "Tell me what you're planning. In a free intro call we'll work out where you are and how I can help.",
    cta: 'Free intro call',
    ctaMail: 'Or email me at',
  },
};

/** Filterkategorie aus der passenden Leistung (AK-19) */
const categoryOf: Record<string, 'ux' | 'web' | 'photo'> = {
  'ux-ui-design': 'ux',
  'web-design-development': 'web',
  photography: 'photo',
};

export default function ProjectsOverview({ locale }: { locale: Locale }) {
  const t = projectsOverviewText[locale];
  const used = new Set(projects.map((p) => categoryOf[p.service]));
  const filters = [
    { key: 'all', label: t.filters.all },
    ...(['ux', 'web', 'photo'] as const).filter((k) => used.has(k)).map((k) => ({ key: k, label: t.filters[k] })),
  ];

  const items = projects.map((p, i) => {
    const data = p[locale];
    const id = `projekt-${p.slug}`;
    return {
      key: p.slug,
      category: categoryOf[p.service] ?? 'all',
      node: (
        <article className="group relative grid md:grid-cols-12 gap-6 md:gap-10 items-center">
          <div
            className={`relative overflow-hidden rounded-2xl bg-bg2 aspect-[4/3] md:col-span-7 ${i % 2 ? 'md:order-2' : ''}`}
          >
            <Image
              src={p.thumbnail.src}
              alt=""
              fill
              sizes="(min-width: 1100px) 600px, (min-width: 768px) 58vw, 100vw"
              className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-105"
            />
          </div>
          <div className="md:col-span-5 min-w-0">
            <p className="text-[13px] font-medium text-text2 mb-3">{p.year}</p>
            <h2 className="text-[28px] md:text-[40px] font-bold leading-[1.1] tracking-tight mb-4 text-balance">
              <Link
                id={id}
                href={localizedPath(`/projects/${p.slug}`, locale)}
                aria-describedby={`${id}-typ ${id}-text`}
                className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-primary"
              >
                {data.title}
              </Link>
            </h2>
            <p id={`${id}-text`} className="text-[16px] text-text2 leading-relaxed mb-5">
              {data.tagline}
            </p>
            <span id={`${id}-typ`} className="sr-only">
              {`${t.type}: ${data.type}`}
            </span>
            <ul aria-hidden="true" className="flex flex-wrap gap-2 mb-6">
              {data.type.split(' · ').map((tag) => (
                <li
                  key={tag}
                  className="text-[12px] font-medium px-3 py-1 rounded-full border border-border text-primary-text"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <span aria-hidden="true" className="inline-flex items-center gap-2 text-[14px] font-medium">
              {categoryOf[p.service] === 'photo' ? t.viewSeries : t.readCase}
              <ArrowRight
                size={16}
                className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
              />
            </span>
          </div>
        </article>
      ),
    };
  });

  return (
    <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12">
      <JsonLd data={projectsItemListJsonLd(locale, projects)} />
      <header className="pt-14 pb-10 md:pt-20 md:pb-14 motion-safe:animate-fade-in">
        <p className="text-[11px] font-medium tracking-widest uppercase text-primary-text mb-3">{t.eyebrow}</p>
        <h1 className="text-[34px] md:text-[56px] font-bold leading-[1.05] tracking-[-0.03em] mb-5 max-w-[860px] text-balance">
          {t.title}
        </h1>
        <p className="text-[16px] md:text-[18px] text-text2 max-w-[620px] leading-relaxed">{t.intro}</p>
      </header>

      <ProjectFilter label={t.filter} filters={filters} count={t.count} items={items} />

      <section aria-labelledby="bald" className="pt-24 md:pt-32">
        <h2 id="bald" className="text-[28px] md:text-[36px] font-bold tracking-tight mb-8" data-reveal>
          {t.soonTitle}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {comingSoon.map((c, i) => (
            <li
              key={c.slug}
              data-reveal
              style={{ '--reveal-i': i } as CSSProperties}
              className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
            >
              <span
                aria-hidden="true"
                className="relative overflow-hidden h-[140px] flex items-center justify-center bg-[var(--soon)] dark:bg-bg3 dark:border-b-4 dark:border-[var(--soon)]"
                style={{ '--soon': c.color } as CSSProperties}
              >
                <span className="text-[11px] font-medium tracking-wider uppercase text-black/70 dark:text-text2">
                  {t.soon}
                </span>
              </span>
              <span className="p-5 flex-1 flex flex-col">
                <span className="text-[11px] font-medium tracking-wider uppercase text-text2 mb-1.5">
                  {c.type[locale]}
                </span>
                <h3 className="text-[17px] font-bold text-foreground mb-1.5">{c[locale].title}</h3>
                <span className="text-[13px] text-text2 leading-relaxed">{c[locale].tagline}</span>
                <span className="sr-only">{t.soon}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="projekte-abschluss" className="py-16 md:py-24">
        <div data-reveal className="rounded-3xl bg-primary text-primary-foreground px-6 py-12 md:px-14 md:py-16">
          <h2
            id="projekte-abschluss"
            className="text-[30px] md:text-[44px] font-bold leading-[1.1] tracking-tight mb-4 text-balance"
          >
            {t.ctaTitle}
          </h2>
          <p className="text-[16px] md:text-[18px] leading-relaxed max-w-[560px] mb-8">{t.ctaText}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={localizedPath('/contact', locale)}
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
              {t.ctaMail}{' '}
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
