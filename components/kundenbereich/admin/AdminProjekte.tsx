import { Plus } from 'lucide-react';
import Link from 'next/link';
import { projektLoeschen, projektStatus } from '@/app/actions/kundenbereich-admin';
import { buttonClass } from '@/components/ui/Button';
import { euro, projekteNachStatus, type DashboardProjekt } from '@/lib/kundenbereich/admin/dashboard';
import { optionLabel, PROJEKT_STATUS_OPTIONEN } from '@/lib/kundenbereich/admin/texte';
import AktionenMenue from './AktionenMenue';
import { projektLoeschenText } from './loeschenTexte';
import { badge, tabelle as t } from './AdminListen';
import AdminShell from './AdminShell';

// Alle Projekte als Tabelle mit ⋯-Menü je Zeile (functions/kundenbereich/admin-sidebar.md Verhalten 6 und 7, AK-6, AK-7)

export default function AdminProjekte({ projekte }: { projekte: DashboardProjekt[] }) {
  const alle = projekteNachStatus(projekte);
  return (
    <AdminShell
      title="Projekte"
      aside={
        <Link href="/kunden/admin/projekte/neu" className={buttonClass('primary')}>
          <Plus size={15} aria-hidden="true" />
          Neues Projekt
        </Link>
      }
    >
      {alle.length === 0 ? (
        <p className="text-[15px] text-text2">Noch keine Projekte.</p>
      ) : (
        <div className={t.rahmen}>
          <table aria-label="Projekte" className={t.table}>
            <thead className={t.thead}>
              <tr>
                <th scope="col" className={t.th}>
                  Projekt
                </th>
                <th scope="col" className={t.th}>
                  Kunde
                </th>
                <th scope="col" className={t.th}>
                  Status
                </th>
                <th scope="col" className={`${t.th} text-right`}>
                  Auftragswert
                </th>
                <th scope="col" className={t.th}>
                  Nächster Schritt
                </th>
                <th scope="col" className={t.th}>
                  <span className="sr-only">Aktionen</span>
                </th>
              </tr>
            </thead>
            <tbody className={t.tbody}>
              {alle.map((p) => (
                <tr key={p.id} className={t.tr}>
                  <td className={t.tdName}>
                    <Link href={`/kunden/admin/projekte/${p.id}`} className={t.name}>
                      {p.titel}
                    </Link>
                  </td>
                  <td className={t.td}>{p.kunden?.name ?? '–'}</td>
                  <td className={t.td}>
                    <span className={badge}>{optionLabel(PROJEKT_STATUS_OPTIONEN, p.status)}</span>
                  </td>
                  <td className={`${t.td} md:text-right tabular-nums`}>{p.wert === null ? '–' : euro(p.wert)}</td>
                  <td className={`${t.td} max-md:basis-full`}>
                    {p.naechsterSchritt
                      ? `${p.naechsterSchritt.titel} (${p.naechsterSchritt.verantwortlich === 'kunde' ? 'Kunde' : 'Erik'})`
                      : '–'}
                  </td>
                  <td className={t.tdAktion}>
                    <AktionenMenue
                      name={p.titel}
                      status={{ aktion: projektStatus, id: p.id, wert: p.status, optionen: PROJEKT_STATUS_OPTIONEN }}
                      eintraege={[
                        { art: 'link', label: 'Öffnen', href: `/kunden/admin/projekte/${p.id}` },
                        { art: 'link', label: 'So sieht es der Kunde', href: `/kunden?projekt=${p.id}` },
                        {
                          art: 'aktion',
                          label: 'Löschen',
                          aktion: projektLoeschen,
                          hidden: { id: p.id },
                          gefahr: true,
                          bestaetigen: projektLoeschenText(p.titel),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
