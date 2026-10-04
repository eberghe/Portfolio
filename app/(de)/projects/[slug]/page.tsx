import ProjectDetail from '@/components/projects/ProjectDetail';
import { findProject, projectMetadata, projectStaticParams } from '@/lib/pages/projects';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = projectStaticParams;

export async function generateMetadata({ params }: Props) {
  return projectMetadata((await params).slug, 'de');
}

export default async function ProjectPage({ params }: Props) {
  return <ProjectDetail project={findProject((await params).slug)} locale="de" />;
}
