import type { NextConfig } from 'next';

// Zusammengelegte Leistungen (functions/seiten/leistungen.md, AK-4)
const mergedServices = [
  ['webflow-framer', 'webflow-development'],
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
      // Englische Slugs der rechtlichen Seiten (functions/seiten/rechtliches.md AK-8)
      { source: '/en/impressum', destination: '/en/imprint', permanent: true },
      { source: '/en/datenschutz', destination: '/en/privacy', permanent: true },
    ];
  },
};

export default nextConfig;
