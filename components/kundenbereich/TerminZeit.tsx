'use client';

import { useSyncExternalStore } from 'react';
import type { Locale } from '@/lib/i18n';
import { SERVER_ZEITZONE, uhrzeit, zeitraum } from '@/lib/kundenbereich/termine';
import { kundenText } from '@/lib/kundenbereich/text';

// Datum und Uhrzeit eines Termins immer in deutscher Zeit; weicht die Zeitzone des Browsers ab,
// steht die Ortszeit dahinter (Kritiker Termine 1)
// (functions/kundenbereich/termine.md Verhalten 3)

const subscribe = () => () => {};
const browserZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || SERVER_ZEITZONE;
const serverZone = () => SERVER_ZEITZONE;

export default function TerminZeit({ beginn, ende, locale }: { beginn: string; ende: string; locale: Locale }) {
  const zone = useSyncExternalStore(subscribe, browserZone, serverZone);
  return (
    <>
      <time dateTime={beginn}>{zeitraum(beginn, ende, locale)}</time>
      {zone !== SERVER_ZEITZONE && ` (${kundenText[locale].localTime(uhrzeit(beginn, ende, locale, zone))})`}
    </>
  );
}
