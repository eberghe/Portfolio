import type { NextConfig } from 'next';

// Zusammengelegte Leistungen (functions/seiten/leistungen.md, AK-4)
// Webflow-Entwicklung heißt seit 2026-10-07 Webdesign & Webentwicklung (leistungen.md AK-39)
const mergedServices = [
  ['webflow-framer', 'web-design-development'],
  ['webflow-development', 'web-design-development'],
  ['business-development', 'website-process-optimization'],
];

const nextConfig: NextConfig = {
  // Eine 404-Seite für Adressen außerhalb beider Sprach-Layouts (functions/seiten/nicht-gefunden.md)
  experimental: { globalNotFound: true },
  // Stationsfotos der Zeitleiste in höherer Qualität (functions/seiten/ueber-mich.md AK-29)
  images: { qualities: [75, 85] },
  async redirects() {
    return [
      ...['', '/en'].flatMap((prefix) =>
        mergedServices.map(([from, to]) => ({
          source: `${prefix}/services/${from}`,
          destination: `${prefix}/services/${to}`,
          permanent: true,
        })),
      ),
      // Fotografie ist keine Leistung mehr, die Fotoserien stehen bei den Projekten (functions/seiten/leistungen.md AK-28)
      { source: '/services/photography', destination: '/projects', permanent: true },
      { source: '/en/services/photography', destination: '/en/projects', permanent: true },
      // Englische Slugs der rechtlichen Seiten (functions/seiten/rechtliches.md AK-8)
      { source: '/en/impressum', destination: '/en/imprint', permanent: true },
      { source: '/en/datenschutz', destination: '/en/privacy', permanent: true },
    ];
  },
};

export default nextConfig;
