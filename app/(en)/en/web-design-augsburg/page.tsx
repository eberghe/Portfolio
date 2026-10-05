import LocalLanding from '@/components/local/LocalLanding';
import { localPages } from '@/lib/content/local';
import { localMetadata } from '@/lib/pages/static';

// functions/seo/staedte-landingpages.md
const page = localPages.find((p) => p.path === '/webdesign-augsburg')!;

export const metadata = localMetadata(page, 'en');

export default function Page() {
  return <LocalLanding page={page} locale="en" />;
}
