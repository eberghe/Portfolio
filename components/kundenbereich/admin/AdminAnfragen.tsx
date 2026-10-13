import Link from 'next/link';
import { anfrageStatus } from '@/app/actions/kundenbereich-admin';
import type { Anfrage } from '@/lib/kundenbereich/admin/dashboard';
import { ANFRAGE_STATUS_OPTIONEN } from '@/lib/kundenbereich/admin/texte';
import { datum } from '@/lib/kundenbereich/projekte';
import AktionenMenue from './AktionenMenue';
import { ANFRAGE_STATUS_TEXT, badge, leistung, tabelle as t } from './AdminListen';
import AdminShell from './AdminShell';

// Alle Anfragen als Tabelle, neueste zuerst (functions/kundenbereich/admin-sidebar.md Verhalten 6 und 7, AK-6)

export default function AdminAnfragen({ anfragen }: { anfragen: Anfrage[] }) {
  return (
    <AdminShell title="Anfragen">
      {anfragen.length === 0 ? (
        <p className="text-[15px] text-text2">Noch keine Anfragen.</p>
      ) : (
        <div className={t.rahmen}>
          <table aria-label="Anfragen" className={t.table}>
            <thead className={t.thead}>
              <tr>
                {['Name', 'Eingang', 'Leistungen', 'Status'].map((h) => (
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
              {anfragen.map((a) => (
                <tr key={a.id} className={t.tr}>
                  <td className={t.tdName}>
                    <Link href={`/kunden/admin/anfragen/${a.id}`} className={t.name}>
                      {a.name}
                    </Link>
                  </td>
                  <td className={`${t.td} whitespace-nowrap`}>{datum(a.created_at.slice(0, 10), 'de')}</td>
                  <td className={t.td}>{a.leistungen.map(leistung).join(', ') || '–'}</td>
                  <td className={t.td}>
                    <span className={badge}>{ANFRAGE_STATUS_TEXT[a.status]}</span>
                  </td>
                  <td className={t.tdAktion}>
                    <AktionenMenue
                      name={a.name}
                      status={{ aktion: anfrageStatus, id: a.id, wert: a.status, optionen: ANFRAGE_STATUS_OPTIONEN }}
                      eintraege={[
                        { art: 'link', label: 'Öffnen', href: `/kunden/admin/anfragen/${a.id}` },
                        { art: 'link', label: 'Projekt anlegen', href: `/kunden/admin/projekte/neu?anfrage=${a.id}` },
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
