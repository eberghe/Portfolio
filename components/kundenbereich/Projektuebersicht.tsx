import {
  CalendarPlus,
  Check,
  Circle,
  CircleDot,
  Download,
  ExternalLink,
  LogOut,
  Mail,
  Settings,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/app/actions/kundenbereich';
import Button, { buttonClass } from '@/components/ui/Button';
import { localizedPath, type Locale } from '@/lib/i18n';
import {
  datum,
  kennzahlen,
  projektAnsicht,
  waehleProjekt,
  type ProjektRow,
  type Schritt,
} from '@/lib/kundenbereich/projekte';
import type { Profil } from '@/lib/kundenbereich/supabase';
import { dateiInfo, dokumentGruppen, type DokumentRow } from '@/lib/kundenbereich/dokumente';
import { kurzTermin, type Termin } from '@/lib/kundenbereich/termine';
import { kundenText } from '@/lib/kundenbereich/text';
import { EMAIL } from '@/lib/site';
import type { MeinKunde } from '@/lib/kundenbereich/freigabe';
import LogoFreigabe from './LogoFreigabe';
import TerminZeit from './TerminZeit';

// Startseite des Kundenbereichs nach dem Login (functions/kundenbereich/projektuebersicht.md)

type T = (typeof kundenText)['de'];

const card = 'border border-border rounded-2xl p-5 md:p-6';
const sectionTitle = 'text-[13px] font-bold tracking-wider uppercase text-text3 mb-4';
const badge =
  'inline-flex items-center text-[12px] font-medium border border-primary-border text-primary-text rounded-full px-2.5 py-0.5';

export default function Projektuebersicht({
  locale,
  profil,
  projekte,
  auswahl,
  logo = null,
}: {
  locale: Locale;
  profil: Profil;
  /** Kunde des Ansprechpartners für die Logo-Freigabe; null für Admins */
  logo?: MeinKunde | null;
  /** null: Laden fehlgeschlagen (AK-7) */
  projekte: ProjektRow[] | null;
  auswahl?: string;
}) {
  const t = kundenText[locale];
  const gewaehlt = projekte && waehleProjekt(projekte, auswahl);
  const base = localizedPath('/kunden', locale);

  return (
    <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12 py-8 md:py-16">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 mb-8 md:mb-12">
        <div className="min-w-0">
          <h1 className="text-[32px] md:text-[48px] leading-[1.1] font-bold tracking-tight mb-2 text-balance">
            {t.title}
          </h1>
          <p className="text-[16px] text-text2">
            {t.hello(profil.name)}
            {profil.art === 'admin' && ' '}
            {profil.art === 'admin' && <span className={`${badge} ml-1 align-middle uppercase`}>{t.admin}</span>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {profil.art === 'admin' && (
            // Einstieg in die Verwaltung (functions/kundenbereich/admin.md Verhalten 1)
            <Button href="/kunden/admin" variant="secondary" lang={locale === 'en' ? 'de' : undefined}>
              <Settings size={15} aria-hidden="true" />
              {t.manage}
            </Button>
          )}
          <form action={logout}>
            <input type="hidden" name="sprache" value={locale} />
            <Button type="submit" variant="secondary">
              <LogOut size={15} aria-hidden="true" />
              {t.logout}
            </Button>
          </form>
        </div>
      </header>

      {projekte && projekte.length > 1 && (
        <nav aria-label={t.projectsNav} className="mb-8 md:mb-10">
          <ul role="list" className="flex flex-wrap gap-2">
            {projekte.map((p) => {
              const current = p.id === gewaehlt?.id;
              return (
                <li key={p.id}>
                  <Link
                    href={`${base}?projekt=${encodeURIComponent(p.id)}`}
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
      ) : !gewaehlt ? (
        <div className="max-w-[560px] sm:border sm:border-border sm:rounded-2xl sm:p-8">
          <p className="text-[16px] text-text2 leading-relaxed mb-6">{t.noProjects}</p>
          <a href={`mailto:${EMAIL}`} className={buttonClass('secondary')}>
            <Mail size={15} aria-hidden="true" />
            {t.noProjectsContact}
          </a>
        </div>
      ) : (
        <Projekt t={t} locale={locale} projekt={projektAnsicht(gewaehlt, locale)} logo={logo} />
      )}
      {(!projekte || !gewaehlt) && logo && (
        <LogoFreigabe locale={locale} mk={logo} className={`${card} max-w-[560px] mt-10`} />
      )}
    </div>
  );
}

function Projekt({
  t,
  locale,
  projekt: p,
  logo,
}: {
  t: T;
  locale: Locale;
  projekt: ReturnType<typeof projektAnsicht>;
  logo: MeinKunde | null;
}) {
  const links = [
    p.websiteUrl && { href: p.websiteUrl, label: t.website },
    p.stagingUrl && { href: p.stagingUrl, label: t.staging },
  ].filter((l): l is { href: string; label: string } => !!l);

  return (
    <article aria-labelledby="projekt-titel">
      {/* Kritiker Termine 2: Reihenfolge im DOM = Projekt, Kacheln, Termin und nächste Schritte, dann Ablauf und Dokumente */}
      <div className="min-w-0 mb-8">
        {p.kunde && <p className="text-[14px] font-semibold text-primary-text mb-2">{p.kunde}</p>}
        <h2
          id="projekt-titel"
          className="text-[26px] md:text-[32px] font-bold leading-tight tracking-tight mb-3 text-balance"
        >
          {p.titel}
        </h2>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4 text-[14px] text-text2">
          <span className={badge}>{t.projectStatus[p.status]}</span>
          {p.phase && <span>{t.phase(p.phase)}</span>}
        </p>
        {p.beschreibung && (
          <p
            lang={p.beschreibungLang}
            className="text-[15px] md:text-[16px] text-text2 leading-relaxed max-w-[640px] whitespace-pre-line"
          >
            {p.beschreibung}
          </p>
        )}
      </div>

      <Kacheln t={t} locale={locale} projekt={p} />

      {/* Kritiker Kunde 6: sichtbare Reihenfolge = DOM-Reihenfolge, Termin und nächste Schritte links */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-8 gap-y-6 mt-6">
        <div className="min-w-0 flex flex-col gap-6">
          <Meeting t={t} locale={locale} next={p.naechsterTermin} later={p.weitereTermine} />
          <section aria-labelledby="naechste-titel" className={card}>
            <h3 id="naechste-titel" className={sectionTitle}>
              {t.nextSteps}
            </h3>
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

          {links.length > 0 && (
            <section aria-labelledby="links-titel" className={card}>
              <h3 id="links-titel" className={sectionTitle}>
                {t.links}
              </h3>
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
          {logo && <LogoFreigabe locale={locale} mk={logo} className={card} />}
        </div>
        <div className="min-w-0 flex flex-col gap-6">
          {p.schritte.length > 0 && (
            <section aria-labelledby="ablauf-titel" className={card}>
              <h3 id="ablauf-titel" className={sectionTitle}>
                {t.process}
              </h3>
              <ol role="list" aria-labelledby="ablauf-titel">
                {p.schritte.map((s, i) => (
                  <Step
                    key={s.id}
                    t={t}
                    locale={locale}
                    schritt={s}
                    current={s.id === p.aktuell}
                    last={i === p.schritte.length - 1}
                  />
                ))}
              </ol>
            </section>
          )}

          <Documents t={t} locale={locale} dokumente={p.dokumente} />
        </div>
      </div>
    </article>
  );
}

const tile = 'flex flex-col gap-1 border border-border rounded-2xl p-5 min-w-0';
const tileLabel = 'text-[13px] font-semibold text-text2';
const tileValue = 'text-[20px] font-bold leading-tight text-foreground';
const tileLink =
  'text-[14px] font-medium text-primary-text underline underline-offset-4 hover:no-underline mt-auto pt-2';

/** Vier Kacheln oben (functions/kundenbereich/kunden-dashboard.md AK-2, AK-3) */
function Kacheln({ t, locale, projekt }: { t: T; locale: Locale; projekt: ReturnType<typeof projektAnsicht> }) {
  const k = kennzahlen(projekt);
  return (
    <ul role="list" aria-label={t.overview} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <li className={tile}>
        <p className={tileLabel}>{t.progress}</p>
        {k.gesamt === 0 ? (
          <p className="text-[15px] text-text2">{t.noProcess}</p>
        ) : (
          <>
            <p className="text-[15px] text-text2">
              <span className={tileValue}>{t.progressValue(k.erledigt, k.gesamt)}</span> {t.stepsDone}
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
      <li className={tile}>
        <p className={tileLabel}>{t.nextMeeting}</p>
        {k.termin ? (
          <>
            <p className={tileValue}>{kurzTermin(k.termin.beginn, locale)}</p>
            <a href="#termin-titel" className={tileLink}>
              {k.termin.titel}
            </a>
          </>
        ) : (
          <p className="text-[15px] text-text2">{t.noMeetingShort}</p>
        )}
      </li>
      <li className={tile}>
        <p className={tileLabel}>{t.yourTurn}</p>
        {k.kundeOffen > 0 ? (
          <>
            <p className={tileValue}>{t.yourTurnCount(k.kundeOffen)}</p>
            <a href="#naechste-titel" className={tileLink}>
              {t.yourTurnCount(k.kundeOffen)} {t.yourTurnHint}
            </a>
          </>
        ) : (
          <p className="text-[15px] text-text2">{t.allWithErik}</p>
        )}
      </li>
      <li className={tile}>
        <p className={tileLabel}>{t.documents}</p>
        {k.dokumenteAktuell === 0 && !k.neuestes ? (
          <p className="text-[15px] text-text2">{t.noDocumentsShort}</p>
        ) : (
          <>
            <p className={tileValue}>{t.documentsCount(k.dokumenteAktuell)}</p>
            {k.neuestes && (
              <p className="text-[13px] text-text2">
                {t.newestDocument(k.neuestes.titel, datum(k.neuestes.created_at.slice(0, 10), locale))}
              </p>
            )}
            <a href="#dokumente-titel" className={tileLink}>
              {t.allDocuments}
            </a>
          </>
        )}
      </li>
    </ul>
  );
}

function Step({
  t,
  locale,
  schritt: s,
  current,
  last,
}: {
  t: T;
  locale: Locale;
  schritt: Schritt;
  current: boolean;
  last: boolean;
}) {
  const Icon = s.status === 'erledigt' ? Check : s.status === 'aktiv' ? CircleDot : Circle;
  const done = s.status === 'erledigt';
  return (
    <li aria-current={current ? 'step' : undefined} className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-4">
      <div className="flex flex-col items-center">
        <span
          aria-hidden="true"
          className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${
            done
              ? 'bg-primary text-primary-foreground'
              : current
                ? 'bg-primary/[0.14] dark:bg-primary/30 text-primary-text ring-2 ring-primary'
                : 'bg-foreground/[0.06] text-text3'
          }`}
        >
          <Icon size={18} />
        </span>
        {!last && (
          <span
            aria-hidden="true"
            className={`flex-1 w-0.5 min-h-6 my-2 rounded-full ${done ? 'bg-primary' : 'bg-foreground/15'}`}
          />
        )}
      </div>
      <div className={`pt-2 ${last ? '' : 'pb-6'}`}>
        <p
          lang={s.titelLang}
          className={`text-[16px] leading-snug font-bold ${done ? 'text-text2' : 'text-foreground'}`}
        >
          {s.titel}
        </p>
        <p className="flex flex-wrap gap-x-3 text-[13px] text-text2 mt-1">
          <span className={current ? 'font-semibold text-primary-text' : ''}>{t.stepStatus[s.status]}</span>
          {s.faelligAm && !done && <span>{t.due(datum(s.faelligAm, locale))}</span>}
        </p>
        {s.beschreibung && (
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
    <section aria-labelledby="termin-titel" className={card}>
      <h3 id="termin-titel" className={sectionTitle}>
        {t.nextMeeting}
      </h3>
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
              <h4 id="termine-danach" className="text-[13px] font-semibold text-text2 mt-6 mb-2">
                {t.laterMeetings}
              </h4>
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

/** Dokumente nach Art gruppiert, Download über den Server (functions/kundenbereich/dokumente.md) */
function Documents({ t, locale, dokumente }: { t: T; locale: Locale; dokumente: DokumentRow[] }) {
  const gruppen = dokumentGruppen(dokumente);
  return (
    <section aria-labelledby="dokumente-titel" className={card}>
      <h3 id="dokumente-titel" className={sectionTitle}>
        {t.documents}
      </h3>
      {gruppen.length === 0 ? (
        <p className="text-[15px] text-text2">{t.noDocuments}</p>
      ) : (
        <div className="flex flex-col gap-8">
          {gruppen.map((g) => (
            <div key={g.art}>
              <h4 id={`dokumente-${g.art}`} className="text-[15px] font-bold text-foreground mb-3">
                {t.documentGroups[g.art]}
              </h4>
              <ul
                role="list"
                aria-labelledby={`dokumente-${g.art}`}
                className="flex flex-col divide-y divide-border border-y border-border"
              >
                {g.dokumente.map((d) => (
                  <li key={d.id}>
                    <a
                      href={`/kunden/dokumente/${encodeURIComponent(d.id)}`}
                      // Name eindeutig zusammengesetzt, beginnt mit dem sichtbaren Titel (WCAG 2.5.3)
                      aria-label={[d.titel, dateiInfo(d, locale), d.aktuell ? t.currentVersion : null]
                        .filter(Boolean)
                        .join(', ')}
                      className="group flex items-center gap-4 min-h-11 py-3 hover:bg-foreground/[0.03] transition-colors"
                    >
                      {g.art === 'logo' ? (
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
                        <span
                          className={`text-[15px] font-medium break-words ${d.aktuell ? 'text-foreground' : 'text-text2'}`}
                        >
                          {d.titel}
                        </span>
                        <span className="text-[13px] text-text2">{dateiInfo(d, locale)}</span>
                      </span>
                      {d.aktuell && <span className={`${badge} shrink-0`}>{t.currentVersion}</span>}
                    </a>
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
