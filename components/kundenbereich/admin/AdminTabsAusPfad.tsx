'use client';

import { usePathname } from 'next/navigation';
import AdminTabs, { bereichAusPfad } from './AdminTabs';

/** Bereichsleiste im Ladezustand: der Bereich ergibt sich aus der Adresse (admin-aufbau.md AK-13) */
export default function AdminTabsAusPfad() {
  return <AdminTabs {...bereichAusPfad(usePathname())} />;
}
