import { llmsTxt } from '@/lib/llms';

// functions/seo/meta-und-schema.md AK-5
export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
