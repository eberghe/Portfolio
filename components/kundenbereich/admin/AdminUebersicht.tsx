import Link from 'next/link';
import { kundeAnlegen } from '@/app/actions/kundenbereich-admin';
import type { KundeZeile } from '@/lib/kundenbereich/admin/laden';
import { freigabeText } from '@/lib/kundenbereich/admin/texte';
import AdminForm from './AdminForm';
import AdminShell, { adminSection, listItem } from './AdminShell';

// Startseite der Verwaltung: Kunden und „Kunde anlegen“ (functions/kundenbereich/admin.md Verhalten 2)

export default function AdminUebersicht({ kunden }: { kunden: KundeZeile[] }) {
  return (
    <AdminShell title="Verwaltung">
      <section aria-labelledby="kunden-titel">
        <h2 id="kunden-titel" className="text-[20px] font-bold mb-2">
          Kunden
        </h2>
        {kunden.length === 0 ? (
          <p className="text-[15px] text-text2">Noch keine Kunden angelegt.</p>
        ) : (
          <ul role="list">
            {kunden.map((k) => {
              const projekte = k.kundenprojekte[0]?.count ?? 0;
              const ap = k.ansprechpartner[0]?.count ?? 0;
              return (
                <li key={k.id} className={listItem}>
                  <Link
                    href={`/kunden/admin/kunden/${k.id}`}
                    className="inline-flex items-center min-h-11 text-[16px] font-bold underline underline-offset-2 hover:text-primary-text break-words min-w-0"
                  >
                    {k.name}
                  </Link>
                  <span className="text-[13px] text-text2">
                    {projekte === 1 ? '1 Projekt' : `${projekte} Projekte`},{' '}
                    {ap === 1 ? '1 Ansprechpartner' : `${ap} Ansprechpartner`}
                  </span>
                  <span className="text-[13px] text-text2">{freigabeText(k.logo_freigabe, k.logo_freigabe_am)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className={adminSection}>
        <AdminForm
          id="kunde-neu"
          title="Kunde anlegen"
          action={kundeAnlegen}
          submitLabel="Kunde anlegen"
          felder={[
            { name: 'name', label: 'Name', required: true, autoComplete: 'organization' },
            { name: 'website_url', label: 'Website', type: 'url', hint: 'Mit https://, z. B. https://firma.de' },
          ]}
        />
      </section>
    </AdminShell>
  );
}
