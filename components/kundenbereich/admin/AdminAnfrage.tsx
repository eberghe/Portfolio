import { Plus } from 'lucide-react';
import Link from 'next/link';
import { buttonClass } from '@/components/ui/Button';
import { anfrageStatus } from '@/app/actions/kundenbereich-admin';
import type { Anfrage } from '@/lib/kundenbereich/admin/dashboard';
import { ANFRAGE_STATUS_OPTIONEN } from '@/lib/kundenbereich/admin/texte';
import { datum } from '@/lib/kundenbereich/projekte';
import { ANFRAGE_STATUS_TEXT, badge, budget, karte, kartenTitel, leistung, zeitrahmen } from './AdminListen';
import AdminShell from './AdminShell';
import AktionenMenue from './AktionenMenue';

// Eine Anfrage mit allen Angaben (functions/kundenbereich/admin-aufbau.md Verhalten 3, AK-5)

export default function AdminAnfrage({ anfrage: a }: { anfrage: Anfrage }) {
  const angaben: [string, React.ReactNode][] = [
    [
      'E-Mail',
      <a key="m" href={`mailto:${a.email}`} className="underline underline-offset-2 hover:text-primary-text break-all">
        {a.email}
      </a>,
    ],
    ['Telefon', a.telefon ?? 'keine Angabe'],
    [
      'Website',
      a.website ? (
        // admin-sidebar.md AK-17
        <a
          key="w"
          href={/^https?:\/\//.test(a.website) ? a.website : `https://${a.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-primary-text break-all"
        >
          {a.website.replace(/^https?:\/\//, '')}
          <span className="sr-only"> (öffnet in neuem Tab)</span>
        </a>
      ) : (
        'keine Angabe'
      ),
    ],
    ['Leistungen', a.leistungen.map(leistung).join(', ') || 'keine Angabe'],
    ['Zeitrahmen', a.zeitrahmen ? zeitrahmen(a.zeitrahmen) : 'keine Angabe'],
    ['Budget', a.budget ? budget(a.budget) : 'keine Angabe'],
    ['Sprache', a.sprache === 'en' ? 'Englisch' : 'Deutsch'],
    ['Eingegangen', datum(a.created_at.slice(0, 10), 'de')],
  ];
  return (
    <AdminShell
      title={a.name}
      pfad={[{ href: '/kunden/admin/anfragen', label: 'Anfragen' }]}
      aside={
        <>
          <span className={badge}>{ANFRAGE_STATUS_TEXT[a.status]}</span>
          {/* admin-sidebar.md Verhalten 7: Status im ⋯-Menü */}
          <AktionenMenue
            name={a.name}
            status={{ aktion: anfrageStatus, id: a.id, wert: a.status, optionen: ANFRAGE_STATUS_OPTIONEN }}
            eintraege={[{ art: 'link', label: 'E-Mail schreiben', href: `mailto:${a.email}` }]}
          />
          <Link
            href={`/kunden/admin/projekte/neu?anfrage=${a.id}`}
            aria-label={`Projekt anlegen: ${a.name}`}
            className={buttonClass('primary')}
          >
            <Plus size={15} aria-hidden="true" />
            Projekt anlegen
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4 md:gap-6 items-start">
        <section aria-labelledby="anfrage-text" className={karte}>
          <h2 id="anfrage-text" className={`${kartenTitel} mb-3`}>
            Beschreibung
          </h2>
          <p className="text-[15px] leading-relaxed whitespace-pre-line break-words">{a.beschreibung}</p>
        </section>
        <div className="flex flex-col gap-4 md:gap-6">
          <section aria-labelledby="anfrage-angaben" className={karte}>
            <h2 id="anfrage-angaben" className={`${kartenTitel} mb-3`}>
              Angaben
            </h2>
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-[14px]">
              {angaben.map(([dt, dd]) => (
                <div key={dt} className="contents">
                  <dt className="text-text2">{dt}</dt>
                  <dd className="break-words">{dd}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
