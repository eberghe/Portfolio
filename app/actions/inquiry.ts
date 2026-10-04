'use server';

import { createHmac } from 'node:crypto';
import { headers } from 'next/headers';
import type { InquiryState } from '@/lib/contact/state';
import { handleInquiry } from '@/lib/contact/submit';
import { resendNotifier, supabaseStore } from '@/lib/contact/supabase';

// Server Action des Anfrage-Assistenten (functions/kontakt/anfrage-assistent.md)
export async function submitInquiry(_prev: InquiryState, fd: FormData): Promise<InquiryState> {
  const env = process.env;
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim();
  const secret = env.SUPABASE_SERVICE_ROLE_KEY;
  // Nur ein Hash der IP für das Rate-Limit, nie die IP selbst (AK-3)
  const ipHash = ip && secret ? createHmac('sha256', secret).update(ip).digest('hex') : null;
  return handleInquiry(fd, { store: supabaseStore(env), notify: resendNotifier(env), ipHash });
}
