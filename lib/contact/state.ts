import type { FieldErrors, Inquiry } from './validate';

/** Antwort der Server Action an den Anfrage-Assistenten */
export type InquiryState =
  | { status: 'idle' }
  | { status: 'invalid'; errors: FieldErrors; values: Record<string, string | string[]> }
  | { status: 'sent'; summary: Inquiry }
  | { status: 'fallback'; reason: 'unavailable' | 'failed'; mailto: string }
  | { status: 'limited' };
