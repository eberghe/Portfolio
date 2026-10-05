'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n';

// Ortszeit in Königsbrunn, siehe functions/seiten/startseite.md AK-30.
// Die Zeit erscheint erst nach dem Laden im Browser, damit Server und Client nicht abweichen.
export default function LocalClock({ locale }: { locale: Locale }) {
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
  return <time dateTime={now.toISOString()}>{text}</time>;
}
