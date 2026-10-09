import { Plus } from 'lucide-react';
import Link from 'next/link';
import { buttonClass } from '@/components/ui/Button';
import type { Anfrage } from '@/lib/kundenbereich/admin/dashboard';
import { datum } from '@/lib/kundenbereich/projekte';
import { ANFRAGE_STATUS_TEXT, badge, budget, karte, kartenTitel, leistung, zeitrahmen } from './AdminListen';
import AdminShell from './AdminShell';
import AnfrageStatusForm from './AnfrageStatusForm';

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
    ['Website', a.website ?? 'keine Angabe'],
    ['Leistungen', a.leistungen.map(leistung).join(', ') || 'keine Angabe'],
    ['Zeitrahmen', a.zeitrahmen ? zeitrahmen(a.zeitrahmen) : 'keine Angabe'],
    ['Budget', a.budget ? budget(a.budget) : 'keine Angabe'],
    ['Sprache', a.sprache === 'en' ? 'Englisch' : 'Deutsch'],
    ['Eingegangen', datum(a.created_at.slice(0, 10), 'de')],
  ];
  return (
    <AdminShell
      title={a.name}
      bereich="anfragen"
      unterseite
      pfad={[
        { href: '/kunden/admin', label: 'Verwaltung' },
        { href: '/kunden/admin/anfragen', label: 'Anfragen' },
      ]}
      aside={
        <>
          <span className={badge}>{ANFRAGE_STATUS_TEXT[a.status]}</span>
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
          <section aria-labelledby="anfrage-status" className={karte}>
            <h2 id="anfrage-status" className={`${kartenTitel} mb-3`}>
              Status
            </h2>
            <AnfrageStatusForm id={a.id} name={a.name} status={a.status} />
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
