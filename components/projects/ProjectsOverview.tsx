import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { comingSoon, projects } from '@/lib/content/projects';
import JsonLd from '@/components/JsonLd';
import { localizedPath, type Locale } from '@/lib/i18n';
import { projectsItemListJsonLd } from '@/lib/structured-data';

// Projektübersicht, übernommen aus Lovable (ProjectsPage.tsx). Siehe functions/seiten/projekte.md
export const projectsOverviewText = {
  de: {
    metaTitle: 'Projekte: UX/UI, Webflow & Fotografie | Erik Bergheimer',
    metaDescription:
      'Ausgewählte Projekte von Erik Bergheimer: UX/UI-Case-Studies, eine Bachelorarbeit zu Webflow und Shopify sowie Reisefotografie aus Indonesien und Marokko.',
    title: 'Projekte — UX/UI, Webflow & Fotografie',
    intro: 'Ausgewählte Arbeiten aus UX/UI Design, No-Code-Entwicklung und Reisefotografie.',
    soon: 'Kommt bald',
  },
  en: {
    metaTitle: 'Projects: UX/UI, Webflow & photography | Erik Bergheimer',
    metaDescription:
      'Selected projects by Erik Bergheimer: UX/UI case studies, a bachelor thesis on Webflow and Shopify, and travel photography from Indonesia and Morocco.',
    title: 'Projects — UX/UI, Webflow & Photography',
    intro: 'Selected work in UX/UI design, no-code development and travel photography.',
    soon: 'Coming soon',
  },
};

const card = 'block bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col';

export default function ProjectsOverview({ locale }: { locale: Locale }) {
  const t = projectsOverviewText[locale];
  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12">
      <JsonLd data={projectsItemListJsonLd(locale, projects)} />
      <div className="py-16 border-b border-border mb-10">
        <h1 className="text-[32px] font-bold tracking-tight mb-3">{t.title}</h1>
        <p className="text-[15px] text-text2 max-w-[500px]">{t.intro}</p>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-20">
        {projects.map((p) => {
          const data = p[locale];
          return (
            <li key={p.slug}>
              <Link
                href={localizedPath(`/projects/${p.slug}`, locale)}
                aria-labelledby={`projekt-${p.slug}`}
                aria-describedby={`projekt-${p.slug}-typ projekt-${p.slug}-text`}
                className={`${card} group motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.15)]`}
              >
                <span className="relative block overflow-hidden h-[180px] bg-bg2">
                  <Image
                    src={p.thumbnail.src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <ArrowUpRight
                    size={18}
                    aria-hidden="true"
                    className="absolute top-4 right-4 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </span>
                <span className="p-5 flex-1 flex flex-col">
                  <span
                    id={`projekt-${p.slug}-typ`}
                    className="text-[10px] font-medium tracking-wider uppercase text-primary-text mb-1.5"
                  >
                    {data.type}
                  </span>
                  <h2 id={`projekt-${p.slug}`} className="text-[15px] font-bold text-foreground mb-1.5">
                    {data.title}
                  </h2>
                  <span id={`projekt-${p.slug}-text`} className="text-xs text-text2 leading-relaxed">
                    {data.tagline}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
        {comingSoon.map((c) => (
          <li key={c.slug} className={card}>
            <span
              aria-hidden="true"
              className="relative overflow-hidden h-[180px] flex items-center justify-center"
              style={{ background: c.color }}
            >
              <span className="text-[11px] font-medium tracking-wider uppercase text-black/70">{t.soon}</span>
            </span>
            <span className="p-5 flex-1 flex flex-col">
              <span className="text-[10px] font-medium tracking-wider uppercase text-text2 mb-1.5">
                {c.type[locale]}
              </span>
              <h2 className="text-[15px] font-bold text-foreground mb-1.5">{c[locale].title}</h2>
              <span className="text-xs text-text2 leading-relaxed">{c[locale].tagline}</span>
              <span className="sr-only">{t.soon}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
