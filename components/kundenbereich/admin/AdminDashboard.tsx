import { CalendarClock, Inbox, Plus, TrendingUp, Video, Workflow } from 'lucide-react';
import Link from 'next/link';
import { kundeAnlegen } from '@/app/actions/kundenbereich-admin';
import { buttonClass } from '@/components/ui/Button';
import { contactText } from '@/lib/content/contact';
import { services } from '@/lib/content/services';
import {
  dashboardKennzahlen,
  euro,
  projekteNachStatus,
  umsatzPrognose,
  type Anfrage,
  type DashboardDaten,
} from '@/lib/kundenbereich/admin/dashboard';
import { freigabeText, optionLabel, PROJEKT_STATUS_OPTIONEN } from '@/lib/kundenbereich/admin/texte';
import { datum } from '@/lib/kundenbereich/projekte';
import { zeitraum } from '@/lib/kundenbereich/termine';
import AdminForm from './AdminForm';
import AdminShell, { listItem } from './AdminShell';
import AnfrageStatusForm from './AnfrageStatusForm';
import UmsatzDiagramm, { schraffur } from './UmsatzDiagramm';

// Startseite der Verwaltung als Dashboard (functions/kundenbereich/admin-dashboard.md)

export const karte = 'border border-border rounded-2xl p-5 md:p-6 min-w-0 bg-background';
const h2 = 'text-[18px] font-bold mb-4 flex items-center gap-2';
const badge =
  'inline-flex items-center text-[12px] font-medium border border-primary-border text-primary-text rounded-full px-2.5 py-0.5';
const ct = contactText.de;

const leistung = (slug: string) =>
  services.find((s) => s.slug === slug)?.de.title ?? (slug === 'sonstiges' ? ct.other : slug);

export default function AdminDashboard({ daten, now = new Date() }: { daten: DashboardDaten; now?: Date }) {
  const kz = dashboardKennzahlen(daten, now);
  const prognose = umsatzPrognose(daten.projekte, now);
  const projekte = projekteNachStatus(daten.projekte);
  const laufend = projekte.filter((p) => p.status !== 'abgeschlossen');
  const fertig = projekte.filter((p) => p.status === 'abgeschlossen');
  const offen = daten.anfragen.filter((a) => a.status !== 'erledigt');
  const erledigt = daten.anfragen.filter((a) => a.status === 'erledigt');
  const termine = daten.termine.slice(0, 5);
  const leer = prognose.jahre.every((j) => j.sicher + j.gewichtet === 0);

  const kacheln = [
    { label: 'Aktive Projekte', wert: String(kz.aktiveProjekte), icon: Workflow },
    { label: 'Termine in 7 Tagen', wert: String(kz.termine7), icon: CalendarClock },
    { label: 'Neue Anfragen', wert: String(kz.neueAnfragen), icon: Inbox },
    {
      label: `Umsatz ${kz.jahr}`,
      wert: euro(kz.umsatzJahr),
      zusatz: `davon sicher ${euro(kz.sicherJahr)}`,
      icon: TrendingUp,
    },
  ];

  return (
    <AdminShell
      title="Verwaltung"
      wide
      aside={
        <Link href="/kunden/admin/projekte/neu" className={buttonClass('primary')}>
          <Plus size={15} aria-hidden="true" />
          Neues Projekt
        </Link>
      }
    >
      <ul role="list" aria-label="Kennzahlen" className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {kacheln.map((k) => (
          <li key={k.label} className={`${karte} flex flex-col gap-1`}>
            <p className="flex items-center gap-2 text-[13px] text-text2">
              <k.icon size={15} aria-hidden="true" className="text-primary-text shrink-0" />
              {k.label}
            </p>
            <p className="text-[24px] md:text-[30px] font-bold tracking-tight leading-tight break-words">{k.wert}</p>
            {k.zusatz && <p className="text-[12px] text-text2">{k.zusatz}</p>}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <section aria-labelledby="prognose-titel" className={karte}>
          <h2 id="prognose-titel" className={h2}>
            Umsatzprognose
          </h2>
          {leer ? (
            <p className="text-[15px] text-text2">Noch keine Beträge. Trag beim Projekt einen Auftragswert ein.</p>
          ) : (
            <>
              <ul role="list" aria-hidden="true" className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-text2 mb-3">
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ background: 'var(--chart-sicher)' }} />
                  Sicher
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ background: schraffur }} />
                  Gewichtet
                </li>
              </ul>
              <UmsatzDiagramm jahre={prognose.jahre} />
              <table className="w-full mt-4 text-[13px] tabular-nums">
                <caption className="text-left text-[13px] text-text2 mb-2">
                  Umsatzprognose je Jahr, netto. Sicher: laufende und abgeschlossene Projekte. Gewichtet: Angebote mal
                  Wahrscheinlichkeit.
                </caption>
                <thead>
                  <tr className="text-text2 border-b border-border">
                    <th scope="col" className="text-left font-medium py-1.5">
                      Jahr
                    </th>
                    <th scope="col" className="text-right font-medium py-1.5">
                      Sicher
                    </th>
                    <th scope="col" className="text-right font-medium py-1.5">
                      Gewichtet
                    </th>
                    <th scope="col" className="text-right font-medium py-1.5">
                      Summe
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prognose.jahre.map((j) => (
                    <tr key={j.jahr} className="border-b border-border last:border-0">
                      <th scope="row" className="text-left font-medium py-1.5">
                        {j.jahr}
                      </th>
                      <td className="text-right py-1.5">{euro(j.sicher)}</td>
                      <td className="text-right py-1.5">{euro(j.gewichtet)}</td>
                      <td className="text-right py-1.5 font-semibold">{euro(j.sicher + j.gewichtet)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {prognose.ohneAngaben > 0 && (
            <p className="text-[13px] text-text2 mt-3">
              {prognose.ohneAngaben === 1
                ? '1 Projekt ohne Auftragswert oder Abrechnungsdatum'
                : `${prognose.ohneAngaben} Projekte ohne Auftragswert oder Abrechnungsdatum`}
            </p>
          )}
        </section>

        <section aria-labelledby="termine-titel" className={karte}>
          <h2 id="termine-titel" className={h2}>
            Nächste Termine
          </h2>
          {termine.length === 0 ? (
            <p className="text-[15px] text-text2">Keine Termine geplant.</p>
          ) : (
            <ul role="list" className="flex flex-col">
              {termine.map((t) => {
                const titel = t.titel_de ?? 'Termin';
                return (
                  <li
                    key={t.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 border-t border-border first:border-0 first:pt-0"
                  >
                    <div className="min-w-0 flex-1 basis-56">
                      <p className="text-[13px] text-text2">{zeitraum(t.beginn, t.ende, 'de')}</p>
                      <p className="text-[15px] font-medium break-words">{titel}</p>
                      {t.kundenprojekte && (
                        <p className="text-[13px] text-text2">
                          <Link
                            href={`/kunden/admin/projekte/${t.kundenprojekte.id}`}
                            className="underline underline-offset-2 hover:text-foreground"
                          >
                            {t.kundenprojekte.titel}
                          </Link>
                          {t.kundenprojekte.kunden && ` · ${t.kundenprojekte.kunden.name}`}
                        </p>
                      )}
                    </div>
                    {t.meet_url && (
                      <a
                        href={t.meet_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Meet beitreten: ${titel} (öffnet in neuem Tab)`}
                        className={buttonClass('secondary')}
                      >
                        <Video size={15} aria-hidden="true" />
                        Meet beitreten
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section aria-labelledby="projekte-titel" className={karte}>
          <h2 id="projekte-titel" className={h2}>
            Projekte
          </h2>
          {projekte.length === 0 ? (
            <p className="text-[15px] text-text2">Noch keine Projekte.</p>
          ) : (
            <>
              <ProjektListe projekte={laufend} />
              {fertig.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer min-h-11 flex items-center text-[14px] font-medium">
                    Abgeschlossen ({fertig.length})
                  </summary>
                  <ProjektListe projekte={fertig} />
                </details>
              )}
            </>
          )}
        </section>

        <section aria-labelledby="anfragen-titel" className={karte}>
          <h2 id="anfragen-titel" className={h2}>
            Anfragen
          </h2>
          {offen.length === 0 ? (
            <p className="text-[15px] text-text2">Keine offenen Anfragen.</p>
          ) : (
            <AnfrageListe anfragen={offen} />
          )}
          {erledigt.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer min-h-11 flex items-center text-[14px] font-medium">
                Erledigt ({erledigt.length})
              </summary>
              <AnfrageListe anfragen={erledigt} />
            </details>
          )}
        </section>

        <section aria-labelledby="kunden-titel" className={`${karte} lg:col-span-2`}>
          <h2 id="kunden-titel" className={h2}>
            Kunden
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-x-10 gap-y-8">
            {daten.kunden.length === 0 ? (
              <p className="text-[15px] text-text2">Noch keine Kunden angelegt.</p>
            ) : (
              <ul role="list">
                {daten.kunden.map((k) => {
                  const pr = k.kundenprojekte[0]?.count ?? 0;
                  const ap = k.ansprechpartner[0]?.count ?? 0;
                  return (
                    <li key={k.id} className={`${listItem} first:border-0 first:pt-0`}>
                      <Link
                        href={`/kunden/admin/kunden/${k.id}`}
                        className="inline-flex items-center min-h-11 text-[16px] font-bold underline underline-offset-2 hover:text-primary-text break-words min-w-0"
                      >
                        {k.name}
                      </Link>
                      <span className="text-[13px] text-text2">
                        {pr === 1 ? '1 Projekt' : `${pr} Projekte`},{' '}
                        {ap === 1 ? '1 Ansprechpartner' : `${ap} Ansprechpartner`}
                      </span>
                      <span className="text-[13px] text-text2">
                        {freigabeText(k.logo_freigabe, k.logo_freigabe_am)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            <AdminForm
              id="kunde-neu"
              title="Kunde anlegen"
              titleLevel={3}
              action={kundeAnlegen}
              submitLabel="Kunde anlegen"
              felder={[
                { name: 'name', label: 'Name', required: true, autoComplete: 'organization' },
                { name: 'website_url', label: 'Website', type: 'url', hint: 'Mit https://, z. B. https://firma.de' },
              ]}
            />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function ProjektListe({ projekte }: { projekte: ReturnType<typeof projekteNachStatus> }) {
  return (
    <ul role="list" className="flex flex-col">
      {projekte.map((p) => (
        <li key={p.id} className="flex flex-col gap-1 py-3 border-t border-border first:border-0 first:pt-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              href={`/kunden/admin/projekte/${p.id}`}
              className="inline-flex items-center min-h-11 text-[15px] font-bold underline underline-offset-2 hover:text-primary-text break-words min-w-0"
            >
              {p.titel}
            </Link>
            <span className={badge}>{optionLabel(PROJEKT_STATUS_OPTIONEN, p.status)}</span>
          </div>
          <p className="flex flex-wrap gap-x-3 text-[13px] text-text2">
            {p.kunden && <span>{p.kunden.name}</span>}
            <span>{p.wert === null ? 'kein Auftragswert' : euro(p.wert)}</span>
          </p>
          {p.naechsterSchritt && (
            <p className="text-[13px] text-text2">
              Nächster Schritt: {p.naechsterSchritt.titel} (
              {p.naechsterSchritt.verantwortlich === 'kunde' ? 'Kunde' : 'Erik'})
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

function AnfrageListe({ anfragen }: { anfragen: Anfrage[] }) {
  return (
    <ul role="list" className="flex flex-col">
      {anfragen.map((a) => (
        <li key={a.id} className="flex flex-col gap-2 py-4 border-t border-border first:border-0 first:pt-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <h3 className="text-[15px] font-bold break-words min-w-0">{a.name}</h3>
            <span className="text-[13px] text-text2">{datum(a.created_at.slice(0, 10), 'de')}</span>
          </div>
          <p className="text-[13px] text-text2">{a.leistungen.map(leistung).join(', ')}</p>
          <p className="flex flex-wrap gap-x-3 text-[13px] text-text2">
            <span>{ct.timeframes[a.zeitrahmen as keyof typeof ct.timeframes] ?? a.zeitrahmen}</span>
            <span>Budget: {ct.budgets[a.budget as keyof typeof ct.budgets] ?? a.budget}</span>
          </p>
          <p className="flex flex-wrap gap-x-4 text-[13px]">
            <a
              href={`mailto:${a.email}`}
              className="inline-flex items-center min-h-11 underline underline-offset-2 break-all"
            >
              {a.email}
            </a>
            {a.telefon && (
              <a
                href={`tel:${a.telefon.replace(/[^\d+]/g, '')}`}
                className="inline-flex items-center min-h-11 underline underline-offset-2"
              >
                {a.telefon}
              </a>
            )}
          </p>
          <details>
            <summary className="cursor-pointer min-h-11 flex items-center text-[13px] font-medium">
              Beschreibung
            </summary>
            <p className="text-[14px] text-text2 leading-relaxed whitespace-pre-line break-words">{a.beschreibung}</p>
            {a.website && <p className="text-[13px] text-text2 mt-2 break-all">Website: {a.website}</p>}
          </details>
          <div className="flex flex-wrap items-end gap-3">
            <AnfrageStatusForm id={a.id} name={a.name} status={a.status} />
            <Link
              href={`/kunden/admin/projekte/neu?anfrage=${a.id}`}
              aria-label={`Projekt anlegen: ${a.name}`}
              className={buttonClass('secondary')}
            >
              <Plus size={15} aria-hidden="true" />
              Projekt anlegen
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
