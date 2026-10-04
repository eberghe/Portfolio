import type { Metadata } from 'next';
import { headers } from 'next/headers';
import NotFound from '@/components/NotFound';
import SiteShell from '@/components/SiteShell';
import { notFoundText } from '@/lib/content/not-found';
import type { Locale } from '@/lib/i18n';

// 404 für alle unbekannten Adressen, siehe functions/seiten/nicht-gefunden.md.
// Die Sprache kommt aus dem Proxy (proxy.ts): /en/... englisch, sonst deutsch mit englischem Abschnitt.
async function locale(): Promise<Locale> {
  return (await headers()).get('x-sprache') === 'en' ? 'en' : 'de';
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://erik-bergheimer.de'),
    title: notFoundText[await locale()].metaTitle,
    robots: { index: false },
  };
}

export default async function GlobalNotFound() {
  const l = await locale();
  return (
    <SiteShell locale={l}>
      <NotFound locale={l} bilingual={l === 'de'} />
    </SiteShell>
  );
}
