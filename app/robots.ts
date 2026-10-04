import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// functions/seo/sitemap-und-redirects.md AK-2
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/projekt-' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  } satisfies MetadataRoute.Robots;
}
