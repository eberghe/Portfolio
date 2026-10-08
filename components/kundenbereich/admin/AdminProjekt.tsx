import { ChevronRight, Download } from 'lucide-react';
import Link from 'next/link';
import {
  dokumentEntfernen,
  dokumentUebernehmen,
  dokumentVorbereiten,
  projektAnsprechpartner,
  projektSpeichern,
  schrittEntfernen,
  schrittHinzufuegen,
  schrittSpeichern,
  terminEntfernen,
  terminHinzufuegen,
  umsatzSpeichern,
} from '@/app/actions/kundenbereich-admin';
import { buttonClass } from '@/components/ui/Button';
import { dateiInfo } from '@/lib/kundenbereich/dokumente';
import type { ProjektDetail } from '@/lib/kundenbereich/admin/laden';
import {
  DOKUMENT_ART_OPTIONEN,
  optionLabel,
  PROJEKT_STATUS_OPTIONEN,
  SCHRITT_STATUS_OPTIONEN,
  VERANTWORTLICH_OPTIONEN,
} from '@/lib/kundenbereich/admin/texte';
import { datum } from '@/lib/kundenbereich/projekte';
import { terminTitel, zeitraum } from '@/lib/kundenbereich/termine';
import ActionButton from './ActionButton';
import AdminForm, { type Feld } from './AdminForm';
import FokusHinweis from './FokusHinweis';
import AdminShell, { adminSection, listItem } from './AdminShell';
import UploadForm from './UploadForm';

// Ein Projekt: Daten, Ansprechpartner, Ablauf, Termine, Dokumente (functions/kundenbereich/admin.md Verhalten 4)

type Schritt = ProjektDetail['projektschritte'][number];
type Dok = ProjektDetail['dokumente'][number];

/** Dokumente nach Art und Titel, neueste Version zuerst */
function dokumentStapel(dokumente: Dok[]) {
  const map = new Map<string, { key: string; art: Dok['art']; titel: string; versionen: Dok[] }>();
  for (const d of dokumente) {
    const key = `${d.art}:${d.titel.trim().toLowerCase()}`;
    const g = map.get(key) ?? { key, art: d.art, titel: d.titel, versionen: [] };
    g.versionen.push(d);
    map.set(key, g);
  }
  return [...map.values()].map((g) => ({ ...g, versionen: g.versionen.sort((a, b) => b.version - a.version) }));
}

const schrittFelder = (s?: Schritt, reihenfolge = 1): Feld[] => [
  {
    name: 'reihenfolge',
    label: 'Reihenfolge',
    type: 'number',
    required: true,
    defaultValue: String(s?.reihenfolge ?? reihenfolge),
    half: true,
  },
  {
    name: 'status',
    label: 'Stand',
    type: 'select',
    options: SCHRITT_STATUS_OPTIONEN,
    defaultValue: s?.status ?? 'offen',
    half: true,
  },
  { name: 'titel_de', label: 'Titel Deutsch', required: true, defaultValue: s?.titel_de ?? '', half: true },
  { name: 'titel_en', label: 'Titel Englisch', defaultValue: s?.titel_en ?? '', half: true },
  { name: 'beschreibung_de', label: 'Beschreibung Deutsch', type: 'textarea', defaultValue: s?.beschreibung_de ?? '' },
  { name: 'beschreibung_en', label: 'Beschreibung Englisch', type: 'textarea', defaultValue: s?.beschreibung_en ?? '' },
  { name: 'faellig_am', label: 'Fällig am', type: 'date', defaultValue: s?.faellig_am ?? '', half: true },
  {
    name: 'verantwortlich',
    label: 'Verantwortlich',
    type: 'select',
    options: VERANTWORTLICH_OPTIONEN,
    defaultValue: s?.verantwortlich ?? 'erik',
    half: true,
  },
];

/** „12.500,50“ für das Eingabefeld */
const betragText = (v: string | number | null | undefined) =>
  v === null || v === undefined || v === ''
    ? ''
    : new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2, useGrouping: true }).format(Number(v));

export default function AdminProjekt({
  projekt: p,
  now = new Date(),
  hinweis,
}: {
  projekt: ProjektDetail;
  now?: Date;
  /** Meldung nach dem Assistenten, z. B. „Projekt angelegt.“ */
  hinweis?: string;
}) {
  const kunde = p.kunden;
  const naechste = Math.max(0, ...p.projektschritte.map((s) => s.reihenfolge)) + 1;
  const zugeordnet = p.projekt_ansprechpartner.map((a) => a.ansprechpartner_id);

  return (
    <AdminShell
      title={p.titel}
      pfad={[
        { href: '/kunden/admin', label: 'Verwaltung' },
        ...(kunde ? [{ href: `/kunden/admin/kunden/${kunde.id}`, label: kunde.name }] : []),
      ]}
      aside={
        <Link href={`/kunden?projekt=${p.id}`} className={buttonClass('secondary')}>
          So sieht es der Kunde
        </Link>
      }
    >
      {hinweis && <FokusHinweis>{hinweis}</FokusHinweis>}
      {/* Kritiker Verwaltung 1: Sprungmarken, Schritte eingeklappt */}
      <nav aria-label="Auf dieser Seite" className="mb-8">
        <ul role="list" className="flex flex-wrap gap-2">
          {[
            ['#projekt-titel', 'Projekt'],
            ['#umsatz-titel', 'Umsatz'],
            ['#projekt-ap-titel', 'Ansprechpartner'],
            ['#ablauf-titel', 'Ablauf'],
            ['#termine-titel', 'Termine'],
            ['#dokumente-titel', 'Dokumente'],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className={buttonClass('secondary', 'min-h-11')}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section>
        <AdminForm
          id="projekt"
          title="Projekt"
          action={projektSpeichern}
          submitLabel="Projekt speichern"
          hidden={{ id: p.id }}
          felder={[
            { name: 'titel', label: 'Titel', required: true, defaultValue: p.titel },
            {
              name: 'status',
              label: 'Status',
              type: 'select',
              options: PROJEKT_STATUS_OPTIONEN,
              defaultValue: p.status,
              half: true,
            },
            { name: 'phase', label: 'Aktuelle Phase', defaultValue: p.phase ?? '', half: true },
            {
              name: 'beschreibung_de',
              label: 'Beschreibung Deutsch',
              type: 'textarea',
              defaultValue: p.beschreibung_de ?? '',
            },
            {
              name: 'beschreibung_en',
              label: 'Beschreibung Englisch',
              type: 'textarea',
              defaultValue: p.beschreibung_en ?? '',
            },
            {
              name: 'website_url',
              label: 'Website',
              type: 'url',
              defaultValue: p.website_url ?? '',
              half: true,
              hint: 'Mit https://',
            },
            {
              name: 'staging_url',
              label: 'Testversion (Staging)',
              type: 'url',
              defaultValue: p.staging_url ?? '',
              half: true,
              hint: 'Mit https://',
            },
          ]}
        />
      </section>

      {/* Nur für Admins, eigene Tabelle (admin-dashboard.md Verhalten 9) */}
      <section className={adminSection}>
        <AdminForm
          id="umsatz"
          title="Umsatz"
          action={umsatzSpeichern}
          submitLabel="Umsatz speichern"
          hidden={{ projekt_id: p.id }}
          felder={[
            {
              name: 'auftragswert_netto',
              label: 'Auftragswert netto in Euro',
              defaultValue: betragText(p.projekt_umsatz?.auftragswert_netto),
              hint: 'Z. B. 12.500 oder 12.500,50. Nur für dich sichtbar.',
              half: true,
            },
            {
              name: 'wahrscheinlichkeit',
              label: 'Wahrscheinlichkeit in Prozent',
              type: 'number',
              defaultValue: String(p.projekt_umsatz?.wahrscheinlichkeit ?? 50),
              hint: 'Zählt nur bei Angeboten.',
              half: true,
            },
            {
              name: 'abrechnung_am',
              label: 'Voraussichtliche Abrechnung',
              type: 'date',
              defaultValue: p.projekt_umsatz?.abrechnung_am ?? '',
              half: true,
            },
          ]}
        />
      </section>

      <section className={adminSection}>
        {kunde && kunde.ansprechpartner.length > 0 ? (
          <AdminForm
            id="projekt-ap"
            title="Ansprechpartner im Projekt"
            action={projektAnsprechpartner}
            submitLabel="Zuordnung speichern"
            hidden={{ projekt_id: p.id }}
            felder={[
              {
                name: 'ansprechpartner',
                label: 'Wer sieht dieses Projekt?',
                type: 'checkboxes',
                options: kunde.ansprechpartner.map((a) => ({ value: a.id, label: `${a.name} (${a.email})` })),
                checked: zugeordnet,
              },
            ]}
          />
        ) : (
          <>
            <h2 id="projekt-ap-titel" className="text-[20px] font-bold mb-2">
              Ansprechpartner im Projekt
            </h2>
            <p className="text-[15px] text-text2">
              Der Kunde hat noch keine Ansprechpartner.{' '}
              {kunde && (
                <Link
                  href={`/kunden/admin/kunden/${kunde.id}`}
                  className="underline underline-offset-2 text-primary-text"
                >
                  Ansprechpartner hinzufügen
                </Link>
              )}
            </p>
          </>
        )}
      </section>

      <section aria-labelledby="ablauf-titel" className={adminSection}>
        <h2 id="ablauf-titel" className="text-[20px] font-bold mb-4">
          Ablauf
        </h2>
        {p.projektschritte.length === 0 && <p className="text-[15px] text-text2 mb-6">Noch keine Schritte.</p>}
        <ol role="list" className="flex flex-col gap-3 mb-10">
          {p.projektschritte.map((s) => (
            <li key={s.id}>
              <details className="group border border-border rounded-2xl">
                <summary className="flex flex-wrap items-center gap-x-3 gap-y-1 min-h-11 px-4 py-3 cursor-pointer list-none">
                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 transition-transform group-open:rotate-90"
                  />
                  <span className="font-bold text-[15px] break-words min-w-0">
                    {s.reihenfolge}. {s.titel_de}
                  </span>
                  <span className="text-[13px] text-text2">
                    {optionLabel(SCHRITT_STATUS_OPTIONEN, s.status)} ·{' '}
                    {optionLabel(VERANTWORTLICH_OPTIONEN, s.verantwortlich)}
                    {s.faellig_am && ` · fällig ${datum(s.faellig_am, 'de')}`}
                  </span>
                </summary>
                <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-2">
                  <AdminForm
                    id={`schritt-${s.id}`}
                    title={`Schritt bearbeiten: ${s.titel_de}`}
                    titleLevel={3}
                    action={schrittSpeichern}
                    submitLabel="Schritt speichern"
                    submitName={`Schritt speichern: ${s.titel_de}`}
                    hidden={{ id: s.id }}
                    felder={schrittFelder(s)}
                  />
                  <div className="flex flex-wrap gap-2 mt-3">
                    <ActionButton
                      action={schrittEntfernen}
                      hidden={{ id: s.id }}
                      label="Entfernen"
                      name={`Entfernen: Schritt ${s.titel_de}`}
                      confirm={`Schritt „${s.titel_de}“ entfernen?`}
                    />
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ol>
        <AdminForm
          id="schritt-neu"
          title="Schritt hinzufügen"
          titleLevel={3}
          action={schrittHinzufuegen}
          submitLabel="Schritt hinzufügen"
          hidden={{ projekt_id: p.id }}
          reset
          felder={schrittFelder(undefined, naechste)}
        />
      </section>

      <section aria-labelledby="termine-titel" className={adminSection}>
        <h2 id="termine-titel" className="text-[20px] font-bold mb-2">
          Termine
        </h2>
        {p.termine.length === 0 ? (
          <p className="text-[15px] text-text2 mb-6">Noch keine Termine.</p>
        ) : (
          <ul role="list" className="border-b border-border mb-8">
            {p.termine.map((t) => {
              const titel = terminTitel(t.titel_de, t.titel_en, 'de');
              const vergangen = Date.parse(t.ende) < now.getTime();
              return (
                <li key={t.id} className={listItem}>
                  <div className="min-w-0 flex-1 basis-60">
                    <h3 className="text-[16px] font-bold break-words">{titel}</h3>
                    <p className="text-[13px] text-text2">
                      <time dateTime={t.beginn}>{zeitraum(t.beginn, t.ende, 'de')}</time>
                      {vergangen && ' · vorbei'}
                      {t.meet_url && ' · mit Meet-Link'}
                    </p>
                  </div>
                  <ActionButton
                    action={terminEntfernen}
                    hidden={{ id: t.id }}
                    label="Entfernen"
                    name={`Entfernen: Termin ${titel}`}
                    confirm={`Termin „${titel}“ entfernen?`}
                  />
                </li>
              );
            })}
          </ul>
        )}
        <AdminForm
          id="termin-neu"
          title="Termin hinzufügen"
          titleLevel={3}
          action={terminHinzufuegen}
          submitLabel="Termin hinzufügen"
          hidden={{ projekt_id: p.id }}
          reset
          felder={[
            { name: 'datum', label: 'Datum', type: 'date', required: true, half: true },
            { name: 'beginn', label: 'Beginn', type: 'time', required: true, half: true, hint: 'Deutsche Zeit' },
            { name: 'ende', label: 'Ende', type: 'time', required: true, half: true, hint: 'Deutsche Zeit' },
            { name: 'meet_url', label: 'Google-Meet-Link', type: 'url', half: true, hint: 'Mit https://' },
            { name: 'titel_de', label: 'Thema Deutsch', half: true },
            { name: 'titel_en', label: 'Thema Englisch', half: true },
          ]}
        />
      </section>

      <section aria-labelledby="dokumente-titel" className={adminSection}>
        <h2 id="dokumente-titel" className="text-[20px] font-bold mb-2">
          Dokumente
        </h2>
        {p.dokumente.length === 0 ? (
          <p className="text-[15px] text-text2 mb-6">Noch keine Dokumente.</p>
        ) : (
          <ul role="list" className="border-b border-border mb-8">
            {/* Kritiker Verwaltung 3: Versionen eines Dokuments unter einem Titel */}
            {dokumentStapel(p.dokumente).map((g) => (
              <li key={g.key} className={listItem}>
                <div className="min-w-0 basis-full">
                  <h3 className="text-[16px] font-bold break-words">{g.titel}</h3>
                  <p className="text-[13px] text-text2">{optionLabel(DOKUMENT_ART_OPTIONEN, g.art)}</p>
                </div>
                <ul role="list" className="basis-full flex flex-col gap-3">
                  {g.versionen.map((d, i) => (
                    <li key={d.id} className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="text-[13px] text-text2 min-w-0 flex-1 basis-48">
                        {i === 0 && <span className="font-semibold text-foreground">Aktuell: </span>}
                        {dateiInfo(d, 'de')}
                      </span>
                      <span className="flex flex-wrap gap-2">
                        <a
                          href={`/kunden/dokumente/${d.id}`}
                          className={buttonClass('secondary')}
                          aria-label={`Herunterladen: ${d.titel}, Version ${d.version}`}
                        >
                          Herunterladen
                          <Download size={14} aria-hidden="true" />
                        </a>
                        <ActionButton
                          action={dokumentEntfernen}
                          hidden={{ id: d.id }}
                          label="Entfernen"
                          name={`Entfernen: ${d.titel}, Version ${d.version}`}
                          confirm={`„${d.titel}“ (Version ${d.version}) mit Datei entfernen?`}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
        <UploadForm
          id="dokument-upload"
          title="Dokument hochladen"
          prepare={dokumentVorbereiten}
          finish={dokumentUebernehmen}
          hidden={{ projekt_id: p.id }}
          accept="application/pdf,image/png,image/jpeg,image/svg+xml,image/webp,application/zip"
          hint="PDF, PNG, JPEG, SVG, WebP oder ZIP, höchstens 25 MB. Gleiche Art und gleicher Titel ergeben eine neue Version."
          submitLabel="Dokument hochladen"
          meta
          arten={DOKUMENT_ART_OPTIONEN}
        />
      </section>
    </AdminShell>
  );
}
