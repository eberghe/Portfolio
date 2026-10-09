'use client';

import { useActionState } from 'react';
import { logoFreigabe } from '@/app/actions/kundenbereich';
import Button from '@/components/ui/Button';
import type { Locale } from '@/lib/i18n';
import type { FreigabeState, MeinKunde } from '@/lib/kundenbereich/freigabe';
import { datum } from '@/lib/kundenbereich/projekte';
import { kundenText } from '@/lib/kundenbereich/text';

// Logo-Freigabe für Ansprechpartner (functions/kundenbereich/logo-freigabe.md AK-1)

export default function LogoFreigabe({ locale, mk, className }: { locale: Locale; mk: MeinKunde; className?: string }) {
  const t = kundenText[locale];
  const [state, action, pending] = useActionState<FreigabeState, FormData>(logoFreigabe, { status: 'idle' });
  const stand = t.logoState[mk.freigabe];
  const erteilt = mk.freigabe === 'erteilt';
  return (
    <section aria-labelledby="logo-freigabe-titel" className={className}>
      <h3 id="logo-freigabe-titel" className="text-[13px] font-bold tracking-wider uppercase text-text3 mb-4">
        {t.logoTitle}
      </h3>
      <p className="text-[15px] text-text2 leading-relaxed mb-3">{t.logoQuestion(mk.kunde)}</p>
      <p className="text-[14px] font-medium text-foreground mb-4">
        {mk.letzte && mk.freigabe !== 'offen'
          ? t.logoStateBy(stand, datum(mk.letzte.am.slice(0, 10), locale), mk.letzte.name)
          : stand}
      </p>
      <div aria-live="polite">
        {state.status !== 'idle' && (
          <p
            className={`rounded-lg px-3 py-2 text-[13px] mb-4 border ${
              state.status === 'ok'
                ? 'border-primary-border bg-primary-light text-foreground'
                : 'border-error text-error'
            }`}
          >
            {state.message}
          </p>
        )}
      </div>
      <form action={action}>
        <input type="hidden" name="sprache" value={locale} />
        <input type="hidden" name="entscheidung" value={erteilt ? 'widerrufen' : 'erteilt'} />
        <Button type="submit" variant={erteilt ? 'secondary' : 'primary'} aria-disabled={pending || undefined}>
          {erteilt ? t.logoRevoke : t.logoApprove}
        </Button>
      </form>
    </section>
  );
}
