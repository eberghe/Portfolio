import { ArrowLeft, ChevronLeft, Download } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import type { Project, ProjectImage } from '@/lib/content/projects';
import { services } from '@/lib/content/services';
import { localizedPath, type Locale } from '@/lib/i18n';
import { projectBreadcrumbJsonLd, projectJsonLd } from '@/lib/structured-data';
import ImageGallery from './ImageGallery';
import TableOfContents from './TableOfContents';

// Case Study, übernommen aus Lovable (ProjectDetailPage.tsx). Siehe functions/seiten/projekte.md
const text = {
  de: {
    back: 'Alle Projekte',
    toc: 'Inhaltsverzeichnis',
    type: 'Typ',
    role: 'Rolle',
    timeline: 'Zeitraum',
    tools: 'Tools',
    team: 'Team',
    metrics: 'Kennzahlen',
    source: 'Quelle',
    visuals: 'Bildmaterial',
    cta: 'Ähnliches Projekt anfragen',
    service: 'Passende Leistung',
    backShort: 'Zurück',
  },
  en: {
    back: 'All projects',
    toc: 'Table of contents',
    type: 'Type',
    role: 'Role',
    timeline: 'Timeline',
    tools: 'Tools',
    team: 'Team',
    metrics: 'Key figures',
    source: 'Source',
    visuals: 'Visuals',
    cta: 'Request a similar project',
    service: 'Related service',
    backShort: 'Back',
  },
};

/** Absätze aus Text mit Leerzeilen; einfache Zeilenumbrüche bleiben sichtbar */
function Paragraphs({ content, className }: { content: string; className: string }) {
  return (
    <>
      {content
        .split('\n\n')
        .filter((p) => p.trim())
        .map((p, i) => {
          const lines = p.split('\n');
          // Zeilen der Form „Phase: Inhalt" sind eine Aufzählung (AK-15)
          if (lines.length > 1 && lines.every((l) => /^[^:]{1,40}: \S/.test(l)))
            return (
              <ul key={i} className={`${className} list-disc pl-5 space-y-1`}>
                {lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            );
          return (
            <p key={i} className={`${className} whitespace-pre-line`}>
              {p}
            </p>
          );
        })}
    </>
  );
}

const localized = (images: ProjectImage[], locale: Locale) => images.map((img) => ({ ...img, alt: img.alt[locale] }));

export default function ProjectDetail({ project, locale }: { project: Project; locale: Locale }) {
  const t = text[locale];
  const content = project[locale];
  const sections = content.sections;
  const href = (path: string) => localizedPath(path, locale);
  const service = services.find((s) => s.slug === project.service);

  const meta = [
    { label: t.type, value: content.type },
    { label: t.role, value: content.role },
    { label: t.timeline, value: project.timeline ?? project.year },
    { label: t.tools, value: project.tools },
    ...(project.team ? [{ label: t.team, value: project.team }] : []),
  ];

  return (
    <div className="max-w-[1100px] mx-auto px-6 sm:px-7 md:px-12 pt-8 pb-28 lg:pb-16">
      <JsonLd data={projectJsonLd(project, locale)} />
      <JsonLd data={projectBreadcrumbJsonLd(project, locale)} />

      <Link
        href={href('/projects')}
        className="inline-flex items-center gap-1.5 py-1 text-text2 text-[13px] hover:text-primary-text transition-colors mb-6"
      >
        <ChevronLeft size={14} aria-hidden="true" />
        {t.back}
      </Link>

      <h1 className="text-[30px] font-medium tracking-tight mb-2">{content.title}</h1>
      <p className="text-[15px] text-primary-text mb-3">{content.tagline}</p>
      <Paragraphs content={content.body} className="text-sm text-text2 leading-[1.8] mb-5" />

      <div className="w-full rounded-2xl overflow-hidden mb-7 bg-bg2 motion-safe:animate-fade-in">
        <Image
          src={project.thumbnail.src}
          width={project.thumbnail.width}
          height={project.thumbnail.height}
          alt={project.thumbnail.alt[locale]}
          priority
          sizes="(min-width: 1100px) 1004px, 100vw"
          className="w-full h-auto object-cover"
        />
      </div>

      <dl className="flex flex-col md:flex-row border border-border rounded-xl overflow-hidden mb-7">
        {meta.map((m) => (
          <div
            key={m.label}
            className="flex-1 min-w-[120px] px-4 py-3.5 border-b md:border-b-0 md:border-r border-border last:border-b-0 last:border-r-0"
          >
            <dt className="text-[10px] uppercase tracking-wider text-text3 font-medium mb-1">{m.label}</dt>
            <dd className="text-[13px] text-foreground">{m.value}</dd>
          </div>
        ))}
      </dl>

      {project.metrics && project.metrics.length > 0 && (
        <section aria-labelledby="kennzahlen" className="mb-10">
          <h2 id="kennzahlen" className="text-[22px] font-medium tracking-tight mb-4">
            {t.metrics}
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {project.metrics.map((m) => (
              <div key={m.label[locale]} className="border border-border rounded-xl p-4">
                <dt className="text-[13px] text-text2">{m.label[locale]}</dt>
                <dd className="text-2xl font-medium text-foreground">{m.value}</dd>
                <dd className="text-[11px] text-text3 mt-1">
                  {t.source}: {m.source}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {sections.length > 0 && (
        <div className="flex gap-12 relative">
          <TableOfContents items={sections.map((s) => ({ id: s.id, title: s.title }))} label={t.toc} />
          <div className="flex-1 min-w-0">
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={section.id} className="mb-12">
                <h2 id={section.id} className="text-[22px] font-medium tracking-tight mb-4 scroll-mt-24">
                  {section.title}
                </h2>
                <Paragraphs content={section.content} className="text-sm text-text2 leading-[1.8] mb-6" />
                {section.subsections?.map((sub) => {
                  const images = project.inlineImages[sub.id] ?? [];
                  return (
                    <div key={sub.id} className="mb-8">
                      <h3 id={sub.id} className="text-[17px] font-medium mb-3 scroll-mt-24">
                        {sub.title}
                      </h3>
                      <Paragraphs content={sub.content} className="text-sm text-text2 leading-[1.8] mb-4" />
                      {images.length > 0 && (
                        <ImageGallery images={localized(images, locale)} locale={locale} variant="inline" />
                      )}
                    </div>
                  );
                })}
              </section>
            ))}
          </div>
        </div>
      )}

      {project.gallery.length > 0 && (
        <section aria-labelledby="bildmaterial" className="mt-10 pt-7 border-t border-border">
          <h2 id="bildmaterial" className="text-[11px] font-medium tracking-wider uppercase text-text3 mb-4">
            {t.visuals}
          </h2>
          <ImageGallery images={localized(project.gallery, locale)} locale={locale} variant="grid" />
        </section>
      )}

      {project.download && (
        <div className="mt-10 pt-7 border-t border-border">
          <a
            href={project.download.url}
            type="application/pdf"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity"
          >
            <Download size={15} aria-hidden="true" />
            {project.download.label[locale]}
          </a>
        </div>
      )}

      {service && (
        <p className="mt-10 pt-7 border-t border-border text-[13px] text-text2">
          {t.service}:{' '}
          <Link
            href={href(`/services/${service.slug}`)}
            className="text-primary-text font-medium underline underline-offset-2"
          >
            {service[locale].title}
          </Link>
        </p>
      )}

      <div className="mt-7 flex flex-wrap gap-2.5">
        <Link
          href={href('/contact')}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          {t.cta}
        </Link>
        <Link
          href={href('/projects')}
          className="inline-flex items-center gap-1.5 border border-border text-text2 px-5 py-2.5 rounded-lg text-[13px] hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {t.backShort}
        </Link>
      </div>
    </div>
  );
}
