import { projects } from '@/lib/content/projects';
import { services } from '@/lib/content/services';
import { absoluteUrl } from '@/lib/seo';

// llms.txt aus den Inhaltsdaten, siehe functions/seo/meta-und-schema.md AK-5
export function llmsTxt() {
  const link = (title: string, path: string, desc: string) =>
    `- [${title}](${absoluteUrl(path, 'en')}): ${desc} [German](${absoluteUrl(path, 'de')})`;
  return [
    '# Erik Bergheimer',
    '',
    '> Freelance UX/UI designer and Webflow developer based in Augsburg (Germany) and Innsbruck (Austria). Clients in Germany, Austria and remote. Accessibility, AI consulting, website & process optimisation, brand design.',
    '',
    "Erik Bergheimer holds a Bachelor's in User Experience Design (TH Ingolstadt) and studies Management, Communication & IT (M.A.) at MCI Innsbruck. The site is available in German (default) and English (/en).",
    '',
    '## Pages',
    '',
    link('Home', '/', 'Introduction, services and featured projects.'),
    link('Services', '/services', 'Overview of all services.'),
    link('Projects', '/projects', 'Selected UX/UI, Webflow and photography case studies.'),
    '',
    '## Services',
    '',
    ...services.map((s) => link(s.en.title, `/services/${s.slug}`, s.en.short)),
    '',
    '## Projects',
    '',
    ...projects.map((p) => link(p.en.title, `/projects/${p.slug}`, p.en.tagline + '.')),
    '',
  ].join('\n');
}
