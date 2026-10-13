'use client';

import { LogOut } from 'lucide-react';
import { logout } from '@/app/actions/kundenbereich';
import Button from '@/components/ui/Button';
import Darstellung from '../Darstellung';
import { karte, kartenTitel } from './AdminListen';
import AdminShell from './AdminShell';

// Einstellungen der Verwaltung: Konto, Darstellung, Abmelden (functions/kundenbereich/admin-sidebar.md Verhalten 10, AK-10)

export default function AdminSettings({ email }: { email: string | null }) {
  return (
    <AdminShell title="Einstellungen">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 items-start max-w-[1100px]">
        <section aria-labelledby="konto-titel" className={karte}>
          <h2 id="konto-titel" className={`${kartenTitel} mb-3`}>
            Konto
          </h2>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-[14px] mb-5">
            <dt className="text-text2">Angemeldet als</dt>
            <dd className="break-all">{email ?? 'unbekannt'}</dd>
            <dt className="text-text2">Rolle</dt>
            <dd>Admin</dd>
          </dl>
          <form action={logout}>
            <input type="hidden" name="sprache" value="de" />
            <Button type="submit" variant="secondary">
              <LogOut size={15} aria-hidden="true" />
              Abmelden
            </Button>
          </form>
        </section>

        <section aria-labelledby="darstellung-titel" className={karte}>
          <h2 id="darstellung-titel" className={`${kartenTitel} mb-3`}>
            Darstellung
          </h2>
          <Darstellung titelId="darstellung-titel" labels={{ hell: 'Hell', dunkel: 'Dunkel', system: 'System' }} />
        </section>
      </div>
    </AdminShell>
  );
}
