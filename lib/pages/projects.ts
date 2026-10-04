import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projectsOverviewText } from '@/components/projects/ProjectsOverview';
import { projects } from '@/lib/content/projects';
import type { Locale } from '@/lib/i18n';

// Gemeinsame Logik der DE- und EN-Routen für Projekte (functions/seiten/projekte.md)
export const projectStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export function findProject(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return project;
}

export function projectMetadata(slug: string, locale: Locale): Metadata {
  const t = findProject(slug)[locale];
  return { title: t.metaTitle, description: t.metaDescription };
}

export function projectsOverviewMetadata(locale: Locale): Metadata {
  return { title: projectsOverviewText[locale].metaTitle, description: projectsOverviewText[locale].metaDescription };
}
