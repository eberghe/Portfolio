import { CalendarPlus, Download, Eye, ListPlus, Pencil, Upload, Users } from 'lucide-react';
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
import { euro } from '@/lib/kundenbereich/admin/dashboard';
import { datum } from '@/lib/kundenbereich/projekte';
import { terminTitel, zeitraum } from '@/lib/kundenbereich/termine';
import ActionButton from './ActionButton';
import AdminDialog from './AdminDialog';
import AdminForm, { type Feld } from './AdminForm';
import { badge, karte, kartenTitel, zeile } from './AdminListen';
import AdminShell from './AdminShell';
import FokusHinweis from './FokusHinweis';
import UploadForm from './UploadForm';

// Ein Projekt als Übersicht, Formulare in Dialogen
// (functions/kundenbereich/admin.md Verhalten 4, admin-aufbau.md Verhalten 5)

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

/** Kopf einer Karte: Überschrift links, Button für den Dialog rechts */
function Kopf({ id, titel, children }: { id: string; titel: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
      <h2 id={id} className={kartenTitel}>
        {titel}
      </h2>
      {children}
    </div>
  );
}

const keine = <span className="text-text2">keine Angabe</span>;

function UrlWert({ url }: { url: string | null }) {
  if (!url) return keine;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 hover:text-primary-text break-all"
    >
      {url.replace(/^https?:\/\//, '')}
      <span className="sr-only"> (öffnet in neuem Tab)</span>
    </a>
  );
}

const dl = 'grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-[14px]';

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
  const sichtbar = kunde?.ansprechpartner.filter((a) => zugeordnet.includes(a.id)) ?? [];
  const u = p.projekt_umsatz;
  const betrag = u?.auftragswert_netto ? Number(u.auftragswert_netto) : null;

  return (
    <AdminShell
      title={p.titel}
      bereich="projekte"
      unterseite
      wide
      pfad={[{ href: '/kunden/admin/projekte', label: 'Projekte' }]}
      aside={
        <>
          <span className={badge}>{optionLabel(PROJEKT_STATUS_OPTIONEN, p.status)}</span>
          <Link href={`/kunden?projekt=${p.id}`} className={buttonClass('secondary')}>
            <Eye size={15} aria-hidden="true" />
            So sieht es der Kunde
          </Link>
        </>
      }
    >
      {hinweis && <FokusHinweis>{hinweis}</FokusHinweis>}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 md:gap-6 items-start">
        <div className="flex flex-col gap-4 md:gap-6 min-w-0">
          <section aria-labelledby="ablauf-titel" className={karte}>
            <Kopf id="ablauf-titel" titel="Ablauf">
              <AdminDialog label="Ablaufschritt hinzufügen" icon={<ListPlus size={15} aria-hidden="true" />}>
                <AdminForm
                  id="schritt-neu"
                  action={schrittHinzufuegen}
                  submitLabel="Schritt hinzufügen"
                  hidden={{ projekt_id: p.id }}
                  felder={schrittFelder(undefined, naechste)}
                />
              </AdminDialog>
            </Kopf>
            {p.projektschritte.length === 0 ? (
              <p className="text-[15px] text-text2">Noch keine Schritte.</p>
            ) : (
              <ol role="list" className="flex flex-col">
                {p.projektschritte.map((s) => (
                  <li key={s.id} className={`${zeile} sm:flex-row sm:items-center sm:justify-between sm:gap-4`}>
                    <div className="min-w-0">
                      <p className="font-bold text-[15px] break-words">
                        {s.reihenfolge}. {s.titel_de}
                      </p>
                      <p className="text-[13px] text-text2">
                        {optionLabel(SCHRITT_STATUS_OPTIONEN, s.status)} ·{' '}
                        {optionLabel(VERANTWORTLICH_OPTIONEN, s.verantwortlich)}
                        {s.faellig_am && ` · fällig ${datum(s.faellig_am, 'de')}`}
                      </p>
                    </div>
                    <AdminDialog
                      label="Bearbeiten"
                      name={`Bearbeiten: ${s.titel_de}`}
                      title={`Ablaufschritt bearbeiten: ${s.titel_de}`}
                      icon={<Pencil size={14} aria-hidden="true" />}
                    >
                      <AdminForm
                        id={`schritt-${s.id}`}
                        action={schrittSpeichern}
                        submitLabel="Schritt speichern"
                        hidden={{ id: s.id }}
                        felder={schrittFelder(s)}
                      />
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                        <ActionButton
                          action={schrittEntfernen}
                          hidden={{ id: s.id }}
                          label="Entfernen"
                          name={`Entfernen: Schritt ${s.titel_de}`}
                          confirm={`Schritt „${s.titel_de}“ entfernen?`}
                        />
                      </div>
                    </AdminDialog>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section aria-labelledby="termine-titel" className={karte}>
            <Kopf id="termine-titel" titel="Termine">
              <AdminDialog label="Termin hinzufügen" icon={<CalendarPlus size={15} aria-hidden="true" />}>
                <AdminForm
                  id="termin-neu"
                  action={terminHinzufuegen}
                  submitLabel="Termin hinzufügen"
                  hidden={{ projekt_id: p.id }}
                  felder={[
                    { name: 'datum', label: 'Datum', type: 'date', required: true, half: true },
                    {
                      name: 'beginn',
                      label: 'Beginn',
                      type: 'time',
                      required: true,
                      half: true,
                      hint: 'Deutsche Zeit',
                    },
                    { name: 'ende', label: 'Ende', type: 'time', required: true, half: true, hint: 'Deutsche Zeit' },
                    { name: 'meet_url', label: 'Google-Meet-Link', type: 'url', half: true, hint: 'Mit https://' },
                    { name: 'titel_de', label: 'Thema Deutsch', half: true },
                    { name: 'titel_en', label: 'Thema Englisch', half: true },
                  ]}
                />
              </AdminDialog>
            </Kopf>
            {p.termine.length === 0 ? (
              <p className="text-[15px] text-text2">Noch keine Termine.</p>
            ) : (
              <ul role="list" className="flex flex-col">
                {p.termine.map((t) => {
                  const titel = terminTitel(t.titel_de, t.titel_en, 'de');
                  const vergangen = Date.parse(t.ende) < now.getTime();
                  return (
                    <li key={t.id} className={`${zeile} sm:flex-row sm:items-center sm:justify-between sm:gap-4`}>
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-bold break-words">{titel}</h3>
                        <p className="text-[13px] text-text2">
                          <time dateTime={t.beginn}>{zeitraum(t.beginn, t.ende, 'de')}</time>
                          {vergangen && ' · vorbei'}
                          {t.meet_url && ' · mit Meet-Link'}
                        </p>
                      </div>
                      <span className="flex flex-wrap gap-2">
                        <ActionButton
                          action={terminEntfernen}
                          hidden={{ id: t.id }}
                          label="Entfernen"
                          name={`Entfernen: Termin ${titel}`}
                          confirm={`Termin „${titel}“ entfernen?`}
                        />
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section aria-labelledby="dokumente-titel" className={karte}>
            <Kopf id="dokumente-titel" titel="Dokumente">
              <AdminDialog label="Dokument hochladen" icon={<Upload size={15} aria-hidden="true" />}>
                <UploadForm
                  id="dokument-upload"
                  prepare={dokumentVorbereiten}
                  finish={dokumentUebernehmen}
                  hidden={{ projekt_id: p.id }}
                  accept="application/pdf,image/png,image/jpeg,image/svg+xml,image/webp,application/zip"
                  hint="PDF, PNG, JPEG, SVG, WebP oder ZIP, höchstens 25 MB. Gleiche Art und gleicher Titel ergeben eine neue Version."
                  submitLabel="Dokument hochladen"
                  meta
                  arten={DOKUMENT_ART_OPTIONEN}
                />
              </AdminDialog>
            </Kopf>
            {p.dokumente.length === 0 ? (
              <p className="text-[15px] text-text2">Noch keine Dokumente.</p>
            ) : (
              <ul role="list" className="flex flex-col">
                {/* Kritiker Verwaltung 3: Versionen eines Dokuments unter einem Titel */}
                {dokumentStapel(p.dokumente).map((g) => (
                  <li key={g.key} className={`${zeile} gap-2`}>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-bold break-words">{g.titel}</h3>
                      <p className="text-[13px] text-text2">{optionLabel(DOKUMENT_ART_OPTIONEN, g.art)}</p>
                    </div>
                    <ul role="list" className="flex flex-col gap-3">
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
          </section>
        </div>

        <div className="flex flex-col gap-4 md:gap-6 min-w-0">
          <section aria-labelledby="projekt-titel" className={karte}>
            <Kopf id="projekt-titel" titel="Projekt" />
            <dl className={`${dl} mb-4`}>
              <dt className="text-text2">Kunde</dt>
              <dd className="break-words">
                {kunde ? (
                  <Link
                    href={`/kunden/admin/kunden/${kunde.id}`}
                    className="underline underline-offset-2 hover:text-primary-text"
                  >
                    {kunde.name}
                  </Link>
                ) : (
                  keine
                )}
              </dd>
              <dt className="text-text2">Status</dt>
              <dd>{optionLabel(PROJEKT_STATUS_OPTIONEN, p.status)}</dd>
              <dt className="text-text2">Phase</dt>
              <dd className="break-words">{p.phase || keine}</dd>
              <dt className="text-text2">Website</dt>
              <dd>
                <UrlWert url={p.website_url} />
              </dd>
              <dt className="text-text2">Testversion</dt>
              <dd>
                <UrlWert url={p.staging_url} />
              </dd>
            </dl>
            {p.beschreibung_de && (
              <p className="text-[14px] text-text2 leading-relaxed whitespace-pre-line break-words mb-4">
                {p.beschreibung_de}
              </p>
            )}
            <AdminDialog label="Projekt bearbeiten" icon={<Pencil size={15} aria-hidden="true" />}>
              <AdminForm
                id="projekt"
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
            </AdminDialog>
          </section>

          {/* Nur für Admins, eigene Tabelle (admin-dashboard.md Verhalten 9) */}
          <section aria-labelledby="umsatz-titel" className={karte}>
            <Kopf id="umsatz-titel" titel="Umsatz" />
            <dl className={`${dl} mb-4`}>
              <dt className="text-text2">Auftragswert netto</dt>
              <dd className="tabular-nums">{betrag === null ? keine : euro(betrag)}</dd>
              <dt className="text-text2">Wahrscheinlichkeit</dt>
              <dd className="tabular-nums">{u ? `${u.wahrscheinlichkeit} %` : keine}</dd>
              <dt className="text-text2">Abrechnung</dt>
              <dd>{u?.abrechnung_am ? datum(u.abrechnung_am, 'de') : keine}</dd>
            </dl>
            <AdminDialog label="Umsatz bearbeiten" icon={<Pencil size={15} aria-hidden="true" />}>
              <AdminForm
                id="umsatz"
                action={umsatzSpeichern}
                submitLabel="Umsatz speichern"
                hidden={{ projekt_id: p.id }}
                felder={[
                  {
                    name: 'auftragswert_netto',
                    label: 'Auftragswert netto in Euro',
                    defaultValue: betragText(u?.auftragswert_netto),
                    hint: 'Z. B. 12.500 oder 12.500,50. Nur für dich sichtbar.',
                    half: true,
                  },
                  {
                    name: 'wahrscheinlichkeit',
                    label: 'Wahrscheinlichkeit in Prozent',
                    type: 'number',
                    defaultValue: String(u?.wahrscheinlichkeit ?? 50),
                    hint: 'Zählt nur bei Angeboten.',
                    half: true,
                  },
                  {
                    name: 'abrechnung_am',
                    label: 'Voraussichtliche Abrechnung',
                    type: 'date',
                    defaultValue: u?.abrechnung_am ?? '',
                    half: true,
                  },
                ]}
              />
            </AdminDialog>
          </section>

          <section aria-labelledby="projekt-ap-titel" className={karte}>
            <Kopf id="projekt-ap-titel" titel="Ansprechpartner" />
            {kunde && kunde.ansprechpartner.length > 0 ? (
              <>
                {sichtbar.length === 0 ? (
                  <p className="text-[14px] text-text2 mb-4">Noch niemand sieht dieses Projekt.</p>
                ) : (
                  <ul role="list" className="flex flex-col gap-1 text-[14px] mb-4">
                    {sichtbar.map((a) => (
                      <li key={a.id} className="break-words">
                        {a.name} <span className="text-text2">({a.email})</span>
                      </li>
                    ))}
                  </ul>
                )}
                <AdminDialog
                  label="Zuordnung ändern"
                  title="Ansprechpartner im Projekt"
                  icon={<Users size={15} aria-hidden="true" />}
                >
                  <AdminForm
                    id="projekt-ap"
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
                </AdminDialog>
              </>
            ) : (
              <p className="text-[14px] text-text2">
                Der Kunde hat noch keine Ansprechpartner.{' '}
                {kunde && (
                  <Link
                    href={`/kunden/admin/kunden/${kunde.id}`}
                    className="underline underline-offset-2 text-primary-text"
                  >
                    Ansprechpartner beim Kunden hinzufügen
                  </Link>
                )}
              </p>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
