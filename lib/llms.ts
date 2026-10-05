import { localPages } from '@/lib/content/local';
import { projects } from '@/lib/content/projects';
import { services } from '@/lib/content/services';
import { EMAIL, absoluteUrl } from '@/lib/site';

// llms.txt aus den Inhaltsdaten, siehe functions/seo/meta-und-schema.md AK-5
export function llmsTxt() {
  const link = (title: string, path: string, desc: string) =>
    `- [${title}](${absoluteUrl(path, 'en')}): ${desc} [German](${absoluteUrl(path, 'de')})`;
  return [
    '# Erik Bergheimer',
    '',
    '> Freelance UX/UI designer and Webflow developer based in Augsburg (Germany). Clients in Germany and remote. Accessibility, AI consulting, website & process optimisation, brand design.',
    '',
    "Erik Bergheimer holds a Bachelor's in User Experience Design (TH Ingolstadt) and a Master's in Management, Communication & IT (M.A.) from MCI Innsbruck. The site is available in German (default) and English (/en).",
    '',
    '## Working with Erik',
    '',
    '- Based in Augsburg (Germany); on site in Germany or remote.',
    '- Languages: German and English.',
    '- Accessibility audits against WCAG 2.2, including the German Barrierefreiheitsstärkungsgesetz (BFSG) and the European Accessibility Act.',
    `- Contact: ${EMAIL}; a free intro call is the first step for every project.`,
    '',
    '## Pages',
    '',
    link('Home', '/', 'Introduction, services and featured projects.'),
    link('Services', '/services', 'Overview of all services.'),
    link('Projects', '/projects', 'Selected UX/UI and Webflow case studies, plus photo series.'),
    link(
      'Contact',
      '/contact',
      'Project enquiry in four short steps (service, project, scope, contact) or direct contact.',
    ),
    '',
    '## Services',
    '',
    ...services.map((s) => link(s.en.title, `/services/${s.slug}`, s.en.short)),
    '',
    '## Regions',
    '',
    ...localPages.map((p) => link(p.en.title, p.path, p.en.metaDescription)),
    '',
    '## Projects',
    '',
    ...projects.map((p) => link(p.en.title, `/projects/${p.slug}`, p.en.tagline + '.')),
    '',
  ].join('\n');
}
