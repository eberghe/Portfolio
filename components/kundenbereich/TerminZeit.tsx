'use client';

import { useSyncExternalStore } from 'react';
import type { Locale } from '@/lib/i18n';
import { SERVER_ZEITZONE, zeitraum } from '@/lib/kundenbereich/termine';

// Datum und Uhrzeit eines Termins: auf dem Server in deutscher Zeit, im Browser in dessen Zeitzone
// (functions/kundenbereich/termine.md Verhalten 3)

const subscribe = () => () => {};
const browserZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || SERVER_ZEITZONE;
const serverZone = () => SERVER_ZEITZONE;

export default function TerminZeit({ beginn, ende, locale }: { beginn: string; ende: string; locale: Locale }) {
  const zone = useSyncExternalStore(subscribe, browserZone, serverZone);
  return <time dateTime={beginn}>{zeitraum(beginn, ende, locale, zone)}</time>;
}
