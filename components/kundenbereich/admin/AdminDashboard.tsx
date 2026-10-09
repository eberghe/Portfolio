import { CalendarClock, Inbox, Plus, TrendingUp, Video, Workflow } from 'lucide-react';
import Link from 'next/link';
import { buttonClass } from '@/components/ui/Button';
import {
  auftragswertNachStatus,
  dashboardKennzahlen,
  euro,
  projekteNachStatus,
  umsatzPrognose,
  type DashboardDaten,
} from '@/lib/kundenbereich/admin/dashboard';
import { optionLabel, PROJEKT_STATUS_OPTIONEN } from '@/lib/kundenbereich/admin/texte';
import { zeitraum } from '@/lib/kundenbereich/termine';
import { AnfrageListe, karte, kartenTitel, KundeAnlegen, mehrLink, ProjektListe } from './AdminListen';
import AdminShell from './AdminShell';
import Hilfe from './Hilfe';
import UmsatzDiagramm, { schraffur } from './UmsatzDiagramm';

// Startseite der Verwaltung: nur das Wichtigste (functions/kundenbereich/admin-dashboard.md, admin-aufbau.md AK-2)

export { karte };

const MAX_TERMINE = 3;
const MAX_ANFRAGEN = 3;
const MAX_PROJEKTE = 5;

/** Kopf einer Karte mit Hilfe-Icon oben rechts (admin-aufbau.md Verhalten 8) */
function Kopf({ id, titel, hilfe }: { id: string; titel: string; hilfe?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <h2 id={id} className={kartenTitel}>
        {titel}
      </h2>
      {hilfe && <Hilfe titel={titel}>{hilfe}</Hilfe>}
    </div>
  );
}

export default function AdminDashboard({ daten, now = new Date() }: { daten: DashboardDaten; now?: Date }) {
  const kz = dashboardKennzahlen(daten, now);
  const prognose = umsatzPrognose(daten.projekte, now);
  const pipeline = auftragswertNachStatus(daten.projekte);
  const pipelineMax = Math.max(1, ...pipeline.map((p) => p.wert));
  const laufend = projekteNachStatus(daten.projekte).filter((p) => p.status !== 'abgeschlossen');
  // Kritiker Aufbau 10: dieselbe Bedeutung wie die Kennzahl „Neue Anfragen“
  const neu = daten.anfragen.filter((a) => a.status === 'neu');
  const termine = daten.termine.slice(0, MAX_TERMINE);
  const leer = prognose.jahre.every((j) => j.sicher + j.gewichtet === 0);

  const kacheln = [
    {
      label: 'Aktive Projekte',
      wert: String(kz.aktiveProjekte),
      icon: Workflow,
      hilfe: 'Projekte im Status „In Arbeit“ oder „In Abstimmung“. Angebote und pausierte Projekte zählen nicht.',
    },
    {
      label: 'Termine in 7 Tagen',
      wert: String(kz.termine7),
      icon: CalendarClock,
      hilfe: 'Termine aller Projekte, die in den nächsten sieben Tagen beginnen oder gerade laufen.',
    },
    {
      label: 'Neue Anfragen',
      wert: String(kz.neueAnfragen),
      icon: Inbox,
      hilfe: 'Anfragen aus dem Kontaktformular mit dem Status „Neu“. Beantwortete und erledigte zählen nicht.',
    },
    {
      label: `Umsatz ${kz.jahr}`,
      wert: euro(kz.umsatzJahr),
      zusatz: `davon sicher ${euro(kz.sicherJahr)}`,
      icon: TrendingUp,
      hilfe: `Netto, nach Abrechnungsdatum im Jahr ${kz.jahr}. Sicher sind laufende und abgeschlossene Projekte, Angebote zählen mit ihrer Wahrscheinlichkeit.`,
    },
  ];

  return (
    <AdminShell
      title="Verwaltung"
      wide
      bereich="uebersicht"
      aside={
        <>
          <KundeAnlegen />
          <Link href="/kunden/admin/projekte/neu" className={buttonClass('primary')}>
            <Plus size={15} aria-hidden="true" />
            Neues Projekt
          </Link>
        </>
      }
    >
      <ul
        role="list"
        aria-label="Kennzahlen"
        className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6"
      >
        {kacheln.map((k) => (
          <li key={k.label} className={`${karte} flex flex-col gap-1`}>
            <div className="flex items-start justify-between gap-2">
              <p className="flex items-center gap-2 text-[13px] text-text2 min-w-0">
                <k.icon size={15} aria-hidden="true" className="text-primary-text shrink-0" />
                {k.label}
              </p>
              <Hilfe titel={k.label}>{k.hilfe}</Hilfe>
            </div>
            <p className="text-[24px] md:text-[30px] font-bold tracking-tight leading-tight break-words">{k.wert}</p>
            {k.zusatz && <p className="text-[12px] text-text2">{k.zusatz}</p>}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <section aria-labelledby="prognose-titel" className={`${karte} lg:col-span-2`}>
          <Kopf
            id="prognose-titel"
            titel="Umsatzprognose"
            hilfe="Netto je Jahr der Abrechnung. Sicher: Projekte in Arbeit, in Abstimmung und abgeschlossen. Gewichtet: Angebote mal Wahrscheinlichkeit. Pausierte Projekte zählen nicht."
          />
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
              <details className="mt-3">
                <summary className="cursor-pointer min-h-11 flex items-center text-[14px] font-medium">
                  Als Tabelle
                </summary>
                <table className="w-full mt-2 text-[13px] tabular-nums">
                  <caption className="sr-only">Umsatzprognose je Jahr, netto</caption>
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
              </details>
            </>
          )}
          {prognose.ohneAngaben > 0 && (
            <p className="text-[13px] text-text2 mt-2">
              {prognose.ohneAngaben === 1
                ? '1 Projekt ohne Auftragswert oder Abrechnungsdatum'
                : `${prognose.ohneAngaben} Projekte ohne Auftragswert oder Abrechnungsdatum`}
            </p>
          )}
        </section>

        {/* Zweites Diagramm: ungewichteter Auftragswert je Status (admin-aufbau.md AK-4) */}
        <section aria-labelledby="pipeline-titel" className={karte}>
          <Kopf
            id="pipeline-titel"
            titel="Auftragswert nach Status"
            hilfe="Summe der Auftragswerte netto je Status, ohne Gewichtung. So siehst du, wie viel in Angeboten steckt und wie viel schon läuft."
          />
          <ul role="list" className="flex flex-col gap-3">
            {pipeline.map((p) => (
              <li key={p.status} className="flex flex-col gap-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-3 text-[13px]">
                  <span className="font-medium text-foreground">{optionLabel(PROJEKT_STATUS_OPTIONEN, p.status)}</span>
                  <span className="text-text2 tabular-nums">
                    {euro(p.wert)} · {p.anzahl === 1 ? '1 Projekt' : `${p.anzahl} Projekte`}
                  </span>
                </span>
                <span
                  data-balken
                  aria-hidden="true"
                  className="block h-2 rounded-full bg-foreground/10 overflow-hidden"
                >
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${(p.wert / pipelineMax) * 100}%`,
                      background: p.status === 'angebot' ? schraffur : 'var(--chart-sicher)',
                    }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="termine-titel" className={karte}>
          <Kopf id="termine-titel" titel="Nächste Termine" />
          {termine.length === 0 ? (
            <p className="text-[15px] text-text2">Keine Termine geplant.</p>
          ) : (
            <ul role="list" className="flex flex-col">
              {termine.map((t) => {
                const titel = t.titel_de ?? 'Termin';
                return (
                  <li key={t.id} className="flex flex-col gap-1 py-3 border-t border-border first:border-0 first:pt-0">
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
                    {t.meet_url && (
                      <a
                        href={t.meet_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Meet beitreten: ${titel} (öffnet in neuem Tab)`}
                        className={`${buttonClass('secondary')} self-start mt-1`}
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

        <section aria-labelledby="anfragen-titel" className={karte}>
          <Kopf id="anfragen-titel" titel="Neue Anfragen" />
          {neu.length === 0 ? (
            <p className="text-[15px] text-text2">Keine neuen Anfragen.</p>
          ) : (
            <AnfrageListe anfragen={neu.slice(0, MAX_ANFRAGEN)} />
          )}
          <Link href="/kunden/admin/anfragen" className={`${mehrLink} mt-2`}>
            Alle Anfragen
          </Link>
        </section>

        <section aria-labelledby="projekte-titel" className={karte}>
          <Kopf id="projekte-titel" titel="Laufende Projekte" />
          {laufend.length === 0 ? (
            <p className="text-[15px] text-text2">Noch keine laufenden Projekte.</p>
          ) : (
            <ProjektListe projekte={laufend.slice(0, MAX_PROJEKTE)} />
          )}
          <Link href="/kunden/admin/projekte" className={`${mehrLink} mt-2`}>
            Alle Projekte
          </Link>
        </section>
      </div>
    </AdminShell>
  );
}
