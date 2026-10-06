'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n';

// Ortszeit in Augsburg im Footer, siehe functions/seiten/navigation-und-footer.md AK-23.
// Die Zeile erscheint erst nach dem Laden im Browser, damit Server und Client nicht abweichen
// und ohne JavaScript keine halbe Zeile stehen bleibt.
export default function LocalClock({ locale, label }: { locale: Locale; label: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  if (!now) return null;
  const text = new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', {
    timeZone: 'Europe/Berlin',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(now);
  return (
    <p className="flex items-center gap-3 text-[12px] font-medium tracking-wider uppercase text-white/60">
      <span className="sr-only">{label}:</span>
      <span aria-hidden="true">Augsburg</span>
      <span aria-hidden="true" className="h-3 w-px bg-white/20" />
      <time dateTime={now.toISOString()} className="normal-case tracking-normal tabular-nums">
        {text}
      </time>
    </p>
  );
}
