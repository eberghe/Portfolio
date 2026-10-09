'use client';

import { Mail } from 'lucide-react';
import { useActionState, useEffect, useRef } from 'react';
import { requestLoginLink } from '@/app/actions/kundenbereich';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import { EMAIL } from '@/lib/site';
import type { Locale } from '@/lib/i18n';
import type { LoginState } from '@/lib/kundenbereich/login';
import { kundenText } from '@/lib/kundenbereich/text';

// Anmeldeformular des Kundenbereichs, siehe functions/kundenbereich/login.md AK-1, AK-2, AK-3, AK-10

export default function LoginForm({ locale }: { locale: Locale }) {
  const t = kundenText[locale];
  const [state, action, pending] = useActionState<LoginState, FormData>(requestLoginLink, { status: 'idle' });
  const notice = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.status === 'sent' || state.status === 'unavailable') notice.current?.focus();
    if (state.status === 'invalid') field.current?.focus();
  }, [state]);

  return (
    <>
      <div ref={notice} tabIndex={-1} aria-live="polite" className="outline-none">
        {state.status === 'sent' && (
          <div className="border border-primary-border bg-primary-light rounded-xl p-4 mb-5">
            <h3 className="text-[15px] font-bold text-foreground mb-1">{t.sentTitle}</h3>
            <p className="text-[13px] text-text2 leading-relaxed">{t.sentText}</p>
          </div>
        )}
        {state.status === 'unavailable' && (
          <div className="border border-border bg-bg2 rounded-xl p-4 mb-5">
            <h3 className="text-[15px] font-bold text-foreground mb-1">{t.unavailableTitle}</h3>
            <p className="text-[13px] text-text2 leading-relaxed">
              {t.unavailableText}{' '}
              <a href={`mailto:${EMAIL}`} className="text-primary-text underline underline-offset-2">
                {EMAIL}
              </a>
            </p>
          </div>
        )}
      </div>
      <form action={action} noValidate>
        <input type="hidden" name="sprache" value={locale} />
        <TextField
          ref={field}
          id="kunden-email"
          name="email"
          label={t.email}
          hint={t.emailHint}
          error={state.status === 'invalid' ? t.emailInvalid : undefined}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          defaultValue={state.status === 'invalid' ? state.email : undefined}
          className="mb-5"
        />
        <Button type="submit" aria-disabled={pending || undefined} className="w-full sm:w-auto">
          <Mail size={15} aria-hidden="true" />
          {pending ? t.sending : t.submit}
        </Button>
      </form>
    </>
  );
}
