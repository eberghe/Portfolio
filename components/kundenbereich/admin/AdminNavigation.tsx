'use client';

import { Building2, FolderKanban, Inbox, LayoutDashboard, Settings } from 'lucide-react';
import Seitenleiste from '../Seitenleiste';

// Sidebar der Verwaltung (functions/kundenbereich/admin-sidebar.md Verhalten 1 bis 4, AK-1 bis AK-5);
// dieselbe Komponente wie im Kundenbereich (kunden-sidebar.md AK-3)

const START = '/kunden/admin';

export default function AdminNavigation({ neueAnfragen, eingeklappt }: { neueAnfragen: number; eingeklappt: boolean }) {
  return (
    <Seitenleiste
      start={START}
      bereiche={[
        { href: START, label: 'Übersicht', icon: LayoutDashboard },
        { href: `${START}/projekte`, label: 'Projekte', icon: FolderKanban },
        { href: `${START}/kunden`, label: 'Kunden', icon: Building2 },
        { href: `${START}/anfragen`, label: 'Anfragen', icon: Inbox, zahl: neueAnfragen },
        { href: `${START}/einstellungen`, label: 'Einstellungen', icon: Settings },
      ]}
      navLabel="Verwaltung"
      logoLabel="Erik Bergheimer, Verwaltung"
      website={{ href: '/', label: 'Zur Website' }}
      texte={{
        seitenleiste: 'Seitenleiste',
        ausklappen: 'Seitenleiste ausklappen',
        einklappen: 'Seitenleiste einklappen',
        neu: (n) => `${n} neu`,
      }}
      eingeklappt={eingeklappt}
    />
  );
}
