import type { MetadataRoute } from 'next';
import { sitePaths } from '@/lib/routes';
import { absoluteUrl } from '@/lib/seo';

// functions/seo/sitemap-und-redirects.md AK-1
export default function sitemap(): MetadataRoute.Sitemap {
  return sitePaths().flatMap((path) =>
    (['de', 'en'] as const).map((locale) => ({
      url: absoluteUrl(path, locale),
      alternates: {
        languages: { de: absoluteUrl(path, 'de'), en: absoluteUrl(path, 'en'), 'x-default': absoluteUrl(path, 'de') },
      },
    })),
  );
}
