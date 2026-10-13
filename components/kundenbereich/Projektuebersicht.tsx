import {
  ArrowRight,
  CalendarClock,
  CalendarPlus,
  Check,
  Circle,
  CircleDot,
  Download,
  ExternalLink,
  FileText,
  Hand,
  ListChecks,
  Mail,
  Settings,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import Button, { buttonClass } from '@/components/ui/Button';
import type { Locale } from '@/lib/i18n';
import { bereichPfad, type KundenBereich } from '@/lib/kundenbereich/bereiche';
import { dateiInfo, dokumentGruppen, type DokumentRow } from '@/lib/kundenbereich/dokumente';
import type { MeinKunde } from '@/lib/kundenbereich/freigabe';
import {
  datum,
  kennzahlen,
  projektAnsicht,
  waehleProjekt,
  type ProjektRow,
  type Schritt,
} from '@/lib/kundenbereich/projekte';
import type { Profil } from '@/lib/kundenbereich/supabase';
import { kurzTermin, type Termin } from '@/lib/kundenbereich/termine';
import { kundenText } from '@/lib/kundenbereich/text';
import { EMAIL } from '@/lib/site';
import { badge, karte, kartenTitel } from './admin/AdminListen';
import AdminShell from './admin/AdminShell';
import LogoFreigabe from './LogoFreigabe';
import TerminZeit from './TerminZeit';

// Seiten des Kundenbereichs nach dem Login: Übersicht, Ablauf, Termine, Dokumente
// (functions/kundenbereich/projektuebersicht.md, kunden-dashboard.md, kunden-sidebar.md).
// Seitenkopf, Karten und Kacheln sind dieselben wie in der Verwaltung (kunden-sidebar.md Zweck).

type T = (typeof kundenText)['de'];
type Ansicht = ReturnType<typeof projektAnsicht>;
export type ProjektBereich = Exclude<KundenBereich, 'einstellungen'>;

const kopf = `${kartenTitel} mb-4`;
const MAX_DOKUMENTE = 3;

export default function Projektuebersicht({
  locale,
  profil,
  projekte,
  auswahl,
  logo = null,
  bereich = 'uebersicht',
}: {
  locale: Locale;
  profil: Profil;
  /** Kunde des Ansprechpartners für die Logo-Freigabe; null für Admins */
  logo?: MeinKunde | null;
  /** null: Laden fehlgeschlagen (projektuebersicht.md AK-7) */
  projekte: ProjektRow[] | null;
  auswahl?: string;
  bereich?: ProjektBereich;
}) {
  const t = kundenText[locale];
  const gewaehlt = projekte && waehleProjekt(projekte, auswahl);
  const ansicht = gewaehlt && projektAnsicht(gewaehlt, locale);
  // Mit mehreren Projekten bleibt die Wahl in allen Links erhalten (kunden-sidebar.md AK-2)
  const projekt = projekte && projekte.length > 1 ? gewaehlt?.id : auswahl;
  const pfad = (b: KundenBereich) => bereichPfad(b, locale, projekt);

  return (
    <AdminShell
      title={t.nav[bereich]}
      intro={
        <>
          {t.hello(profil.name)}
          {profil.art === 'admin' && ' '}
          {profil.art === 'admin' && <span className={`${badge} ml-1 align-middle uppercase`}>{t.admin}</span>}
        </>
      }
      aside={
        <>
          {ansicht && (
            <span className={badge}>
              {/* Kritiker Kunden-Dashboard 7: Status mit Bezeichnung für Screenreader */}
              <span className="sr-only">{t.projectStatusLabel} </span>
              {t.projectStatus[ansicht.status]}
            </span>
          )}
          {profil.art === 'admin' && (
            // Zurück in die Verwaltung (admin.md Verhalten 1, kunden-sidebar.md AK-9)
            <Button href="/kunden/admin" variant="secondary" lang={locale === 'en' ? 'de' : undefined}>
              <Settings size={15} aria-hidden="true" />
              {t.manage}
            </Button>
          )}
        </>
      }
    >
      {projekte && projekte.length > 1 && (
        <nav aria-label={t.projectsNav} className="mb-6">
          <ul role="list" className="flex flex-wrap gap-2">
            {projekte.map((p) => {
              const current = p.id === gewaehlt?.id;
              return (
                <li key={p.id}>
                  <Link
                    href={bereichPfad(bereich, locale, p.id)}
                    aria-current={current ? 'page' : undefined}
                    className={`inline-flex items-center min-h-11 px-4 rounded-lg border text-[14px] font-medium transition-colors ${
                      current
                        ? 'border-primary bg-primary/[0.08] dark:bg-primary/[0.18] text-foreground'
                        : 'border-border text-text2 hover:text-foreground'
                    }`}
                  >
                    {/* Kritiker 5: gewähltes Projekt nicht nur über Farbe erkennbar */}
                    {current && <Check size={15} aria-hidden="true" className="mr-1.5 text-primary-text" />}
                    {p.titel}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {!projekte ? (
        <p role="status" className="text-[15px] text-text2 leading-relaxed max-w-[560px]">
          {t.loadError}
        </p>
      ) : !ansicht ? (
        <>
          <div className={`${karte} max-w-[560px]`}>
            <p className="text-[16px] text-text2 leading-relaxed mb-6">{t.noProjects}</p>
            <a href={`mailto:${EMAIL}`} className={buttonClass('secondary')}>
              <Mail size={15} aria-hidden="true" />
              {t.noProjectsContact}
            </a>
          </div>
          {logo && <LogoFreigabe locale={locale} mk={logo} className={`${karte} max-w-[560px] mt-6`} />}
        </>
      ) : bereich === 'ablauf' ? (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-4 md:gap-6 items-start">
          <Ablauf t={t} locale={locale} projekt={ansicht} titel={t.allSteps} />
          <NaechsteSchritte t={t} locale={locale} projekt={ansicht} />
        </div>
      ) : bereich === 'termine' ? (
        <div className="max-w-[900px]">
          <Meeting t={t} locale={locale} next={ansicht.naechsterTermin} later={ansicht.weitereTermine} />
        </div>
      ) : bereich === 'dokumente' ? (
        <div className="max-w-[900px]">
          <Documents t={t} locale={locale} dokumente={ansicht.dokumente} titel={t.allDocumentsLink} />
        </div>
      ) : (
        <Uebersicht t={t} locale={locale} projekt={ansicht} logo={logo} pfad={pfad} />
      )}
    </AdminShell>
  );
}

/** Dashboard: Projekt, Kacheln, dann Karten in zwei Spalten (kunden-sidebar.md Verhalten 5, AK-4) */
function Uebersicht({
  t,
  locale,
  projekt: p,
  logo,
  pfad,
}: {
  t: T;
  locale: Locale;
  projekt: Ansicht;
  logo: MeinKunde | null;
  pfad: (b: KundenBereich) => string;
}) {
  const links = [
    p.websiteUrl && { href: p.websiteUrl, label: t.website },
    p.stagingUrl && { href: p.stagingUrl, label: t.staging },
  ].filter((l): l is { href: string; label: string } => !!l);

  return (
    <article aria-labelledby="projekt-titel">
      <div className="min-w-0 mb-4 md:mb-6">
        {p.kunde && <p className="text-[14px] font-semibold text-primary-text mb-1">{p.kunde}</p>}
        <h2
          id="projekt-titel"
          className="text-[22px] md:text-[26px] font-bold leading-tight tracking-tight mb-2 text-balance"
        >
          {p.titel}
        </h2>
        {p.phase && <p className="text-[14px] text-text2 mb-2">{t.phase(p.phase)}</p>}
        {p.beschreibung && (
          <p
            lang={p.beschreibungLang}
            className="text-[15px] text-text2 leading-relaxed max-w-[720px] whitespace-pre-line"
          >
            {p.beschreibung}
          </p>
        )}
      </div>

      <Kacheln t={t} locale={locale} projekt={p} pfad={pfad} />

      {/* Kritiker Kunde 6: sichtbare Reihenfolge = DOM-Reihenfolge, Termin und nächste Schritte links */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-4 md:gap-6 mt-4 md:mt-6 items-start">
        <div className="min-w-0 flex flex-col gap-4 md:gap-6">
          <Meeting t={t} locale={locale} next={p.naechsterTermin} later={p.weitereTermine} />
          <NaechsteSchritte t={t} locale={locale} projekt={p} />
          {links.length > 0 && (
            <section aria-labelledby="links-titel" className={karte}>
              <h2 id="links-titel" className={kopf}>
                {t.links}
              </h2>
              <ul role="list" className="flex flex-wrap gap-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className={buttonClass('secondary')} target="_blank" rel="noopener noreferrer">
                      {l.label}
                      <ExternalLink size={14} aria-hidden="true" />
                      <span className="sr-only">{t.newTab}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {logo && <LogoFreigabe locale={locale} mk={logo} className={karte} />}
        </div>
        <div className="min-w-0 flex flex-col gap-4 md:gap-6">
          {p.schritte.length > 0 && <Ablauf t={t} locale={locale} projekt={p} kurz mehr={pfad('ablauf')} />}
          <NeuesteDokumente t={t} locale={locale} dokumente={p.dokumente} mehr={pfad('dokumente')} />
        </div>
      </div>
    </article>
  );
}

const mehrLink =
  'inline-flex items-center gap-1.5 min-h-11 text-[14px] font-medium text-primary-text underline underline-offset-4 hover:no-underline';

/** Bezeichnung einer Kachel mit Icon, wie in der Verwaltung */
function Bezeichnung({ icon: Icon, children }: { icon: typeof ListChecks; children: string }) {
  return (
    <p className="flex items-center gap-2 text-[13px] text-text2 min-w-0">
      <Icon size={15} aria-hidden="true" className="text-primary-text shrink-0" />
      {children}
    </p>
  );
}

/** Vier Kacheln wie in der Verwaltung (kunden-dashboard.md AK-2, AK-3, kunden-sidebar.md AK-4) */
function Kacheln({
  t,
  locale,
  projekt,
  pfad,
}: {
  t: T;
  locale: Locale;
  projekt: Ansicht;
  pfad: (b: KundenBereich) => string;
}) {
  const k = kennzahlen(projekt);
  // Kritiker Kunden-Dashboard 5: eine Farbe und Größe für alle Werte
  const wert = 'text-[20px] md:text-[24px] font-bold tracking-tight leading-tight break-words text-foreground';
  const leer = 'text-[15px] text-text2';
  const kachelLink = `${mehrLink} mt-auto`;
  const kachel = `${karte} flex flex-col gap-1 max-sm:p-4`;
  return (
    <ul
      role="list"
      aria-label={t.overview}
      // Kritiker Kunden-Dashboard 6: auch auf dem Handy zu zweit, damit der Inhalt früher kommt
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
    >
      <li className={kachel}>
        <Bezeichnung icon={ListChecks}>{t.progress}</Bezeichnung>
        {k.gesamt === 0 ? (
          <p className={leer}>{t.noProcess}</p>
        ) : (
          <>
            <p className="text-[14px] text-text2">
              <span className={wert}>{t.progressValue(k.erledigt, k.gesamt)}</span> {t.stepsDone}
            </p>
            <div
              role="progressbar"
              aria-label={t.progressLabel}
              aria-valuemin={0}
              aria-valuemax={k.gesamt}
              aria-valuenow={k.erledigt}
              aria-valuetext={`${t.progressValue(k.erledigt, k.gesamt)} ${t.stepsDone}`}
              className="h-2 rounded-full bg-foreground/10 overflow-hidden mt-3"
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${(k.erledigt / k.gesamt) * 100}%` }} />
            </div>
          </>
        )}
      </li>
      <li className={kachel}>
        <Bezeichnung icon={CalendarClock}>{t.nextMeeting}</Bezeichnung>
        {k.termin ? (
          <>
            <p className={wert}>{kurzTermin(k.termin.beginn, locale)}</p>
            <a href={pfad('termine')} className={kachelLink}>
              {k.termin.titel}
            </a>
          </>
        ) : (
          <p className={leer}>{t.noMeetingShort}</p>
        )}
      </li>
      <li className={`${kachel} ${k.kundeOffen > 0 ? 'border-primary' : ''}`}>
        <Bezeichnung icon={Hand}>{t.yourTurn}</Bezeichnung>
        {k.kundeOffen > 0 ? (
          <>
            <p className={wert}>{t.yourTurnCount(k.kundeOffen)}</p>
            <a href="#naechste-titel" className={kachelLink}>
              {t.yourTurnCount(k.kundeOffen)} {t.yourTurnHint}
            </a>
          </>
        ) : (
          <p className={leer}>{t.allWithErik}</p>
        )}
      </li>
      <li className={kachel}>
        <Bezeichnung icon={FileText}>{t.documents}</Bezeichnung>
        {k.dokumenteAktuell === 0 && !k.neuestes ? (
          <p className={leer}>{t.noDocumentsShort}</p>
        ) : (
          <>
            <p className={wert}>{t.documentsCount(k.dokumenteAktuell)}</p>
            {k.neuestes && (
              <p className="text-[13px] text-text2">
                {t.newestDocument(k.neuestes.titel, datum(k.neuestes.created_at.slice(0, 10), locale))}
              </p>
            )}
            <a href={pfad('dokumente')} className={kachelLink}>
              {t.allDocuments}
            </a>
          </>
        )}
      </li>
    </ul>
  );
}

function NaechsteSchritte({ t, locale, projekt: p }: { t: T; locale: Locale; projekt: Ansicht }) {
  return (
    <section aria-labelledby="naechste-titel" className={karte}>
      <h2 id="naechste-titel" className={kopf}>
        {t.nextSteps}
      </h2>
      {p.naechste.length === 0 ? (
        // Kritiker 1: ohne geplante Schritte nicht „Alles erledigt.“
        <p className="text-[15px] text-text2">{p.schritte.length === 0 ? t.noSteps : t.allDone}</p>
      ) : (
        <ul role="list" aria-labelledby="naechste-titel" className="flex flex-col gap-4">
          {p.naechste.map((s) => (
            <li key={s.id} className="flex flex-col gap-1">
              <span lang={s.titelLang} className="text-[15px] font-medium text-foreground">
                {s.titel}
              </span>
              <span className="flex flex-wrap gap-x-3 text-[13px] text-text2">
                <span className={s.verantwortlich === 'kunde' ? 'font-semibold text-primary-text' : ''}>
                  {s.verantwortlich === 'kunde' ? t.fromClient : t.fromErik}
                </span>
                {s.faelligAm && <span>{t.due(datum(s.faelligAm, locale))}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Ablauf ganz oder kurz (nur Titel und Status) mit Link zur Seite „Ablauf“ (kunden-sidebar.md AK-4, AK-5) */
function Ablauf({
  t,
  locale,
  projekt: p,
  kurz = false,
  mehr,
  titel,
}: {
  t: T;
  locale: Locale;
  projekt: Ansicht;
  kurz?: boolean;
  mehr?: string;
  /** Kritiker Kunden-Dashboard 3: auf der eigenen Seite nicht noch einmal „Ablauf“ */
  titel?: string;
}) {
  return (
    <section aria-labelledby="ablauf-titel" className={karte}>
      <h2 id="ablauf-titel" className={kopf}>
        {titel ?? t.process}
      </h2>
      {p.schritte.length === 0 ? (
        <p className="text-[15px] text-text2">{t.noSteps}</p>
      ) : (
        <ol role="list" aria-labelledby="ablauf-titel">
          {p.schritte.map((s, i) => (
            <Step
              key={s.id}
              t={t}
              locale={locale}
              schritt={s}
              current={s.id === p.aktuell}
              last={i === p.schritte.length - 1}
              kurz={kurz}
            />
          ))}
        </ol>
      )}
      {mehr && p.schritte.length > 0 && (
        <Link href={mehr} className={`${mehrLink} mt-2`}>
          {t.fullProcess}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}

function Step({
  t,
  locale,
  schritt: s,
  current,
  last,
  kurz,
}: {
  t: T;
  locale: Locale;
  schritt: Schritt;
  current: boolean;
  last: boolean;
  kurz: boolean;
}) {
  const Icon = s.status === 'erledigt' ? Check : s.status === 'aktiv' ? CircleDot : Circle;
  const done = s.status === 'erledigt';
  const kreis = kurz ? 'w-8 h-8' : 'w-10 h-10';
  return (
    <li
      aria-current={current ? 'step' : undefined}
      className={`grid gap-x-4 ${kurz ? 'grid-cols-[32px_minmax(0,1fr)]' : 'grid-cols-[40px_minmax(0,1fr)]'}`}
    >
      <div className="flex flex-col items-center">
        <span
          aria-hidden="true"
          className={`flex items-center justify-center ${kreis} rounded-full shrink-0 ${
            done
              ? 'bg-primary text-primary-foreground'
              : current
                ? 'bg-primary/[0.14] dark:bg-primary/30 text-primary-text ring-2 ring-primary'
                : 'bg-foreground/[0.06] text-text3'
          }`}
        >
          <Icon size={kurz ? 15 : 18} />
        </span>
        {!last && (
          <span
            aria-hidden="true"
            className={`flex-1 w-0.5 ${kurz ? 'min-h-3 my-1' : 'min-h-6 my-2'} rounded-full ${done ? 'bg-primary' : 'bg-foreground/15'}`}
          />
        )}
      </div>
      <div className={`${kurz ? 'pt-1' : 'pt-2'} ${last ? '' : kurz ? 'pb-3' : 'pb-6'}`}>
        <p
          lang={s.titelLang}
          className={`${kurz ? 'text-[15px]' : 'text-[16px]'} leading-snug font-bold ${done ? 'text-text2' : 'text-foreground'}`}
        >
          {s.titel}
        </p>
        <p className="flex flex-wrap gap-x-3 text-[13px] text-text2 mt-0.5">
          <span className={current ? 'font-semibold text-primary-text' : ''}>{t.stepStatus[s.status]}</span>
          {s.faelligAm && !done && <span>{t.due(datum(s.faelligAm, locale))}</span>}
        </p>
        {!kurz && s.beschreibung && (
          <p lang={s.beschreibungLang} className="text-[14px] text-text2 leading-relaxed mt-2 whitespace-pre-line">
            {s.beschreibung}
          </p>
        )}
      </div>
    </li>
  );
}

/** Nächster Termin mit Meet-Link und Kalenderdatei (functions/kundenbereich/termine.md) */
function Meeting({ t, locale, next, later }: { t: T; locale: Locale; next: Termin | null; later: Termin[] }) {
  return (
    <section aria-labelledby="termin-titel" className={karte}>
      <h2 id="termin-titel" className={kopf}>
        {t.nextMeeting}
      </h2>
      {!next ? (
        <p className="text-[15px] text-text2">{t.noMeeting}</p>
      ) : (
        <>
          <p lang={next.titelLang} className="text-[18px] font-bold leading-snug text-foreground mb-1">
            {next.titel}
          </p>
          <p className="text-[14px] text-text2 mb-5">
            <TerminZeit beginn={next.beginn} ende={next.ende} locale={locale} />
          </p>
          <div className="flex flex-wrap gap-3">
            {next.meetUrl && (
              <a href={next.meetUrl} className={buttonClass('primary')} target="_blank" rel="noopener noreferrer">
                <Video size={15} aria-hidden="true" />
                {t.joinMeet}
                <span className="sr-only">{t.newTab}</span>
              </a>
            )}
            <a
              href={`/kunden/termine/${encodeURIComponent(next.id)}?sprache=${locale}`}
              className={buttonClass('secondary')}
            >
              <CalendarPlus size={15} aria-hidden="true" />
              {t.addToCalendar}
            </a>
          </div>
          {later.length > 0 && (
            <>
              <h3 id="termine-danach" className="text-[13px] font-semibold text-text2 mt-6 mb-2">
                {t.laterMeetings}
              </h3>
              <ul role="list" aria-labelledby="termine-danach" className="flex flex-col gap-2 text-[14px]">
                {later.map((m) => (
                  <li key={m.id} className="flex flex-col">
                    <span lang={m.titelLang} className="font-medium text-foreground">
                      {m.titel}
                    </span>
                    <span className="text-text2">
                      <TerminZeit beginn={m.beginn} ende={m.ende} locale={locale} />
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </section>
  );
}

/** Ein Dokument als Link zum Download über den Server (dokumente.md AK-3, AK-4) */
function DokumentLink({
  t,
  locale,
  d,
  logo,
}: {
  t: T;
  locale: Locale;
  d: DokumentRow & { aktuell: boolean };
  logo: boolean;
}) {
  return (
    <a
      href={`/kunden/dokumente/${encodeURIComponent(d.id)}`}
      // Name eindeutig zusammengesetzt, beginnt mit dem sichtbaren Titel (WCAG 2.5.3)
      aria-label={[d.titel, dateiInfo(d, locale), d.aktuell ? t.currentVersion : null].filter(Boolean).join(', ')}
      className="group flex items-center gap-4 min-h-11 py-3 hover:bg-foreground/[0.03] transition-colors"
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- privates Bild über die Download-Route
        <img
          src={`/kunden/dokumente/${encodeURIComponent(d.id)}?vorschau=1`}
          // Kritiker Dokumente 4: Name kommt aus dem aria-label des Links
          alt=""
          width={48}
          height={48}
          className="w-12 h-12 shrink-0 object-contain rounded-md border border-border bg-white p-1"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex items-center justify-center w-12 h-12 shrink-0 rounded-md bg-foreground/[0.06] text-text2"
        >
          <Download size={18} />
        </span>
      )}
      <span className="min-w-0 flex-1 flex flex-col">
        <span className={`text-[15px] font-medium break-words ${d.aktuell ? 'text-foreground' : 'text-text2'}`}>
          {d.titel}
        </span>
        <span className="text-[13px] text-text2">{dateiInfo(d, locale)}</span>
      </span>
      {d.aktuell && <span className={`${badge} shrink-0`}>{t.currentVersion}</span>}
    </a>
  );
}

/** Die neuesten aktuellen Dokumente auf der Übersicht (kunden-sidebar.md AK-4) */
function NeuesteDokumente({
  t,
  locale,
  dokumente,
  mehr,
}: {
  t: T;
  locale: Locale;
  dokumente: DokumentRow[];
  mehr: string;
}) {
  const neueste = dokumentGruppen(dokumente)
    .flatMap((g) => g.dokumente.filter((d) => d.aktuell))
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, MAX_DOKUMENTE);
  return (
    <section aria-labelledby="neueste-titel" className={karte}>
      <h2 id="neueste-titel" className={kopf}>
        {t.latestDocuments}
      </h2>
      {neueste.length === 0 ? (
        <p className="text-[15px] text-text2">{t.noDocuments}</p>
      ) : (
        <>
          <ul role="list" className="flex flex-col divide-y divide-border border-y border-border">
            {neueste.map((d) => (
              <li key={d.id}>
                <DokumentLink t={t} locale={locale} d={d} logo={d.art === 'logo'} />
              </li>
            ))}
          </ul>
          <Link href={mehr} className={`${mehrLink} mt-2`}>
            {t.allDocumentsLink}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </>
      )}
    </section>
  );
}

/** Dokumente nach Art gruppiert, Download über den Server (functions/kundenbereich/dokumente.md) */
function Documents({ t, locale, dokumente, titel }: { t: T; locale: Locale; dokumente: DokumentRow[]; titel: string }) {
  const gruppen = dokumentGruppen(dokumente);
  return (
    <section aria-labelledby="dokumente-titel" className={karte}>
      <h2 id="dokumente-titel" className={kopf}>
        {titel}
      </h2>
      {gruppen.length === 0 ? (
        <p className="text-[15px] text-text2">{t.noDocuments}</p>
      ) : (
        <div className="flex flex-col gap-8">
          {gruppen.map((g) => (
            <div key={g.art}>
              <h3 id={`dokumente-${g.art}`} className="text-[15px] font-bold text-foreground mb-3">
                {t.documentGroups[g.art]}
              </h3>
              <ul
                role="list"
                aria-labelledby={`dokumente-${g.art}`}
                className="flex flex-col divide-y divide-border border-y border-border"
              >
                {g.dokumente.map((d) => (
                  <li key={d.id}>
                    <DokumentLink t={t} locale={locale} d={d} logo={g.art === 'logo'} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
