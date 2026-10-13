import Link from 'next/link';
import { kundeLoeschen, kundeStatus } from '@/app/actions/kundenbereich-admin';
import type { KundeZeile } from '@/lib/kundenbereich/admin/laden';
import { freigabeText, KUNDEN_STATUS_OPTIONEN, optionLabel } from '@/lib/kundenbereich/admin/texte';
import AktionenMenue from './AktionenMenue';
import { kundeLoeschenText } from './loeschenTexte';
import { badge, KundeAnlegen, tabelle as t } from './AdminListen';
import AdminShell from './AdminShell';

// Alle Kunden als Tabelle mit Status und ⋯-Menü (functions/kundenbereich/admin-sidebar.md Verhalten 6 bis 8, AK-6, AK-8)

export default function AdminKunden({ kunden }: { kunden: KundeZeile[] }) {
  return (
    <AdminShell title="Kunden" aside={<KundeAnlegen variant="primary" />}>
      {kunden.length === 0 ? (
        <p className="text-[15px] text-text2">Noch keine Kunden angelegt.</p>
      ) : (
        <div className={t.rahmen}>
          <table aria-label="Kunden" className={t.table}>
            <thead className={t.thead}>
              <tr>
                {['Kunde', 'Status', 'Projekte', 'Ansprechpartner', 'Logo-Freigabe'].map((h) => (
                  <th key={h} scope="col" className={t.th}>
                    {h}
                  </th>
                ))}
                <th scope="col" className={t.th}>
                  <span className="sr-only">Aktionen</span>
                </th>
              </tr>
            </thead>
            <tbody className={t.tbody}>
              {kunden.map((k) => {
                const pr = k.kundenprojekte[0]?.count ?? 0;
                const ap = k.ansprechpartner[0]?.count ?? 0;
                return (
                  <tr key={k.id} className={t.tr}>
                    <td className={t.tdName}>
                      <Link href={`/kunden/admin/kunden/${k.id}`} className={t.name}>
                        {k.name}
                      </Link>
                    </td>
                    <td className={t.td}>
                      <span className={badge}>{optionLabel(KUNDEN_STATUS_OPTIONEN, k.status)}</span>
                    </td>
                    <td className={`${t.td} tabular-nums`}>
                      <span className="md:hidden">{pr === 1 ? '1 Projekt' : `${pr} Projekte`}</span>
                      <span className="max-md:hidden">{pr}</span>
                    </td>
                    <td className={`${t.td} tabular-nums`}>
                      <span className="md:hidden">{ap === 1 ? '1 Ansprechpartner' : `${ap} Ansprechpartner`}</span>
                      <span className="max-md:hidden">{ap}</span>
                    </td>
                    <td className={`${t.td} max-md:basis-full`}>{freigabeText(k.logo_freigabe, k.logo_freigabe_am)}</td>
                    <td className={t.tdAktion}>
                      <AktionenMenue
                        name={k.name}
                        status={{ aktion: kundeStatus, id: k.id, wert: k.status, optionen: KUNDEN_STATUS_OPTIONEN }}
                        eintraege={[
                          { art: 'link', label: 'Öffnen', href: `/kunden/admin/kunden/${k.id}` },
                          { art: 'link', label: 'Neues Projekt', href: `/kunden/admin/projekte/neu?kunde=${k.id}` },
                          {
                            art: 'aktion',
                            label: 'Löschen',
                            aktion: kundeLoeschen,
                            hidden: { id: k.id },
                            gefahr: true,
                            bestaetigen: kundeLoeschenText(k.name, pr, ap),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
