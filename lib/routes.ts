import { projects } from '@/lib/content/projects';
import { services } from '@/lib/content/services';

// Verzeichnis aller fertigen Seiten (ohne Sprachpräfix), siehe functions/seo/sitemap-und-redirects.md.
// Neue Seiten hier eintragen, dann erscheinen sie in der Sitemap und werden getestet.
const staticPaths = ['/', '/services', '/projects', '/about', '/faqs', '/contact'];

export const sitePaths = () => [
  ...staticPaths,
  ...services.map((s) => `/services/${s.slug}`),
  ...projects.map((p) => `/projects/${p.slug}`),
];
