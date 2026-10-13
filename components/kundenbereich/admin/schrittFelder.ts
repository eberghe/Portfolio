import type { ProjektDetail } from '@/lib/kundenbereich/admin/laden';
import { SCHRITT_STATUS_OPTIONEN, VERANTWORTLICH_OPTIONEN } from '@/lib/kundenbereich/admin/texte';
import type { Feld } from './AdminForm';

// Felder eines Ablaufschritts, für „hinzufügen“ und „bearbeiten“ (functions/kundenbereich/admin.md Verhalten 4)

export type Schritt = ProjektDetail['projektschritte'][number];

export const schrittFelder = (s?: Schritt, reihenfolge = 1): Feld[] => [
  {
    name: 'reihenfolge',
    label: 'Reihenfolge',
    type: 'number',
    required: true,
    defaultValue: String(s?.reihenfolge ?? reihenfolge),
    half: true,
  },
  {
    name: 'status',
    label: 'Stand',
    type: 'select',
    options: SCHRITT_STATUS_OPTIONEN,
    defaultValue: s?.status ?? 'offen',
    half: true,
  },
  { name: 'titel_de', label: 'Titel Deutsch', required: true, defaultValue: s?.titel_de ?? '', half: true },
  { name: 'titel_en', label: 'Titel Englisch', defaultValue: s?.titel_en ?? '', half: true },
  { name: 'beschreibung_de', label: 'Beschreibung Deutsch', type: 'textarea', defaultValue: s?.beschreibung_de ?? '' },
  { name: 'beschreibung_en', label: 'Beschreibung Englisch', type: 'textarea', defaultValue: s?.beschreibung_en ?? '' },
  { name: 'faellig_am', label: 'Fällig am', type: 'date', defaultValue: s?.faellig_am ?? '', half: true },
  {
    name: 'verantwortlich',
    label: 'Verantwortlich',
    type: 'select',
    options: VERANTWORTLICH_OPTIONEN,
    defaultValue: s?.verantwortlich ?? 'erik',
    half: true,
  },
];
