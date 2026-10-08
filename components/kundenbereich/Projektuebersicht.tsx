import { Check, Circle, CircleDot, ExternalLink, LogOut } from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/app/actions/kundenbereich';
import Button, { buttonClass } from '@/components/ui/Button';
import { localizedPath, type Locale } from '@/lib/i18n';
import { datum, projektAnsicht, waehleProjekt, type ProjektRow, type Schritt } from '@/lib/kundenbereich/projekte';
import type { Profil } from '@/lib/kundenbereich/supabase';
import { kundenText } from '@/lib/kundenbereich/text';

// Startseite des Kundenbereichs nach dem Login (functions/kundenbereich/projektuebersicht.md)

type T = (typeof kundenText)['de'];

const sectionTitle = 'text-[13px] font-bold tracking-wider uppercase text-text3 mb-4';
const badge =
  'inline-flex items-center text-[12px] font-medium border border-primary-border text-primary-text rounded-full px-2.5 py-0.5';

export default function Projektuebersicht({
  locale,
  profil,
  projekte,
  auswahl,
}: {
  locale: Locale;
  profil: Profil;
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
        <form action={logout}>
          <input type="hidden" name="sprache" value={locale} />
          <Button type="submit" variant="secondary">
            <LogOut size={15} aria-hidden="true" />
            {t.logout}
          </Button>
        </form>
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
        <p className="text-[15px] text-text2 leading-relaxed max-w-[560px]">{t.noProjects}</p>
      ) : (
        <Projekt t={t} locale={locale} projekt={projektAnsicht(gewaehlt, locale)} />
      )}
    </div>
  );
}

function Projekt({ t, locale, projekt: p }: { t: T; locale: Locale; projekt: ReturnType<typeof projektAnsicht> }) {
  const links = [
    p.websiteUrl && { href: p.websiteUrl, label: t.website },
    p.stagingUrl && { href: p.stagingUrl, label: t.staging },
  ].filter((l): l is { href: string; label: string } => !!l);

  return (
    <article
      aria-labelledby="projekt-titel"
      className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-x-16 gap-y-10"
    >
      <div className="min-w-0">
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
          <p className="text-[15px] md:text-[16px] text-text2 leading-relaxed mb-10 max-w-[640px] whitespace-pre-line">
            {p.beschreibung}
          </p>
        )}

        {p.schritte.length > 0 && (
          <section aria-labelledby="ablauf-titel">
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
      </div>

      <div className="min-w-0 flex flex-col gap-10 lg:pt-1">
        <section aria-labelledby="naechste-titel" className="sm:border sm:border-border sm:rounded-2xl sm:p-6">
          <h3 id="naechste-titel" className={sectionTitle}>
            {t.nextSteps}
          </h3>
          {p.naechste.length === 0 ? (
            <p className="text-[15px] text-text2">{t.allDone}</p>
          ) : (
            <ul role="list" aria-labelledby="naechste-titel" className="flex flex-col gap-4">
              {p.naechste.map((s) => (
                <li key={s.id} className="flex flex-col gap-1">
                  <span className="text-[15px] font-medium text-foreground">{s.titel}</span>
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
          <section aria-labelledby="links-titel">
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
      </div>
    </article>
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
        <p className={`text-[16px] leading-snug font-bold ${done ? 'text-text2' : 'text-foreground'}`}>{s.titel}</p>
        <p className="flex flex-wrap gap-x-3 text-[13px] text-text2 mt-1">
          <span className={current ? 'font-semibold text-primary-text' : ''}>{t.stepStatus[s.status]}</span>
          {s.faelligAm && !done && <span>{t.due(datum(s.faelligAm, locale))}</span>}
        </p>
        {s.beschreibung && (
          <p className="text-[14px] text-text2 leading-relaxed mt-2 whitespace-pre-line">{s.beschreibung}</p>
        )}
      </div>
    </li>
  );
}
