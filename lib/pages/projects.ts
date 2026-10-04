import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projectsOverviewText } from '@/components/projects/ProjectsOverview';
import { projects } from '@/lib/content/projects';
import type { Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';

// Gemeinsame Logik der DE- und EN-Routen für Projekte (functions/seiten/projekte.md)
export const projectStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export function findProject(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return project;
}

export function projectMetadata(slug: string, locale: Locale): Metadata {
  const project = findProject(slug);
  const t = project[locale];
  return pageMetadata({
    path: `/projects/${slug}`,
    locale,
    title: t.metaTitle,
    description: t.metaDescription,
    image: project.thumbnail.src,
    type: 'article',
  });
}

export function projectsOverviewMetadata(locale: Locale): Metadata {
  const t = projectsOverviewText[locale];
  return pageMetadata({ path: '/projects', locale, title: t.metaTitle, description: t.metaDescription });
}
