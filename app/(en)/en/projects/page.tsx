import ProjectsOverview from '@/components/projects/ProjectsOverview';
import { projectsOverviewMetadata } from '@/lib/pages/projects';

export const metadata = projectsOverviewMetadata('en');

export default function ProjectsPage() {
  return <ProjectsOverview locale="en" />;
}
