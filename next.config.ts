import type { NextConfig } from 'next';

// Zusammengelegte Leistungen (functions/seiten/leistungen.md, AK-4)
const mergedServices = [
  ['webflow-framer', 'webflow-development'],
  ['business-development', 'website-process-optimization'],
];

const nextConfig: NextConfig = {
  // Eine 404-Seite für Adressen außerhalb beider Sprach-Layouts (functions/seiten/nicht-gefunden.md)
  experimental: { globalNotFound: true },
  async redirects() {
    return ['', '/en'].flatMap((prefix) =>
      mergedServices.map(([from, to]) => ({
        source: `${prefix}/services/${from}`,
        destination: `${prefix}/services/${to}`,
        permanent: true,
      })),
    );
  },
};

export default nextConfig;
