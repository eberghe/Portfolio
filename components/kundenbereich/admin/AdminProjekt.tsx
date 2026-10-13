import { Plus } from 'lucide-react';
import Link from 'next/link';
import {
  dokumentEntfernen,
  dokumentUebernehmen,
  dokumentVorbereiten,
  projektAnsprechpartner,
  projektSpeichern,
  projektLoeschen,
  projektStatus,
  schrittHinzufuegen,
  terminEntfernen,
  terminHinzufuegen,
  umsatzSpeichern,
} from '@/app/actions/kundenbereich-admin';
import { dateiInfo } from '@/lib/kundenbereich/dokumente';
import type { ProjektDetail } from '@/lib/kundenbereich/admin/laden';
import { DOKUMENT_ART_OPTIONEN, optionLabel, PROJEKT_STATUS_OPTIONEN } from '@/lib/kundenbereich/admin/texte';
import { euro } from '@/lib/kundenbereich/admin/dashboard';
import { datum } from '@/lib/kundenbereich/projekte';
import { terminTitel, zeitraum } from '@/lib/kundenbereich/termine';
import AblaufListe from './AblaufListe';
import AktionenMenue from './AktionenMenue';
import { projektLoeschenText } from './loeschenTexte';
import AdminDialog from './AdminDialog';
import AdminForm from './AdminForm';
import { badge, karte, kartenTitel, zeile } from './AdminListen';
import AdminShell from './AdminShell';
import FokusHinweis from './FokusHinweis';
import { schrittFelder } from './schrittFelder';
import UploadForm from './UploadForm';

// Ein Projekt als Übersicht, Formulare in Dialogen
// (functions/kundenbereich/admin.md Verhalten 4, admin-aufbau.md Verhalten 5)

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

// Kritiker Dialoge 9: Icon-Buttons bleiben auch bei 360 px rechts neben dem Eintrag (AK-20)
const zeileMitAktion = 'flex items-center justify-between gap-3 py-3 border-t border-border first:border-0 first:pt-0';
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

  const projektForm = (
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
  );
  const umsatzForm = (
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
  );
  const zuordnungForm = kunde && kunde.ansprechpartner.length > 0 && (
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
  );

  return (
    <AdminShell
      title={p.titel}
      pfad={[{ href: '/kunden/admin/projekte', label: 'Projekte' }]}
      aside={
        <>
          <span className={badge}>{optionLabel(PROJEKT_STATUS_OPTIONEN, p.status)}</span>
          {/* admin-bearbeiten.md Verhalten 8: im Kopf Status, Links und Löschen; Bearbeiten in den Karten */}
          <AktionenMenue
            name={p.titel}
            status={{ aktion: projektStatus, id: p.id, wert: p.status, optionen: PROJEKT_STATUS_OPTIONEN }}
            eintraege={[
              { art: 'link', label: 'So sieht es der Kunde', href: `/kunden?projekt=${p.id}` },
              {
                art: 'aktion',
                label: 'Löschen',
                aktion: projektLoeschen,
                hidden: { id: p.id },
                gefahr: true,
                danach: '/kunden/admin/projekte',
                bestaetigen: projektLoeschenText(p.titel),
              },
            ]}
          />
        </>
      }
    >
      {hinweis && <FokusHinweis>{hinweis}</FokusHinweis>}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 md:gap-6 items-start">
        <div className="flex flex-col gap-4 md:gap-6 min-w-0">
          <section aria-labelledby="ablauf-titel" className={karte}>
            <Kopf id="ablauf-titel" titel="Ablauf">
              <AdminDialog label="Ablaufschritt hinzufügen" icon={<Plus size={18} aria-hidden="true" />} nurIcon>
                <AdminForm
                  id="schritt-neu"
                  action={schrittHinzufuegen}
                  submitLabel="Schritt hinzufügen"
                  hidden={{ projekt_id: p.id }}
                  felder={schrittFelder(undefined, naechste)}
                />
              </AdminDialog>
            </Kopf>
            <AblaufListe
              // Neu aufbauen nur, wenn Schritte dazukommen oder wegfallen; sonst bleiben Reihenfolge und Fokus
              key={p.projektschritte
                .map((x) => x.id)
                .sort()
                .join()}
              projektId={p.id}
              schritte={[...p.projektschritte].sort((x, y) => x.reihenfolge - y.reihenfolge)}
            />
          </section>

          <section aria-labelledby="termine-titel" className={karte}>
            <Kopf id="termine-titel" titel="Termine">
              <AdminDialog label="Termin hinzufügen" icon={<Plus size={18} aria-hidden="true" />} nurIcon>
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
                    <li key={t.id} className={zeileMitAktion}>
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-bold break-words">{titel}</h3>
                        <p className="text-[13px] text-text2">
                          <time dateTime={t.beginn}>{zeitraum(t.beginn, t.ende, 'de')}</time>
                          {vergangen && ' · vorbei'}
                          {t.meet_url && ' · mit Meet-Link'}
                        </p>
                      </div>
                      <AktionenMenue
                        name={`Termin ${titel}`}
                        eintraege={[
                          ...(t.meet_url
                            ? [{ art: 'link' as const, label: 'Meet öffnen', href: t.meet_url, extern: true }]
                            : []),
                          {
                            art: 'aktion',
                            label: 'Entfernen',
                            aktion: terminEntfernen,
                            hidden: { id: t.id },
                            bestaetigen: {
                              titel: 'Termin entfernen?',
                              text: `„${titel}“ verschwindet aus dem Projekt, auch für den Kunden.`,
                              knopf: 'Termin entfernen',
                            },
                            gefahr: true,
                          },
                        ]}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section aria-labelledby="dokumente-titel" className={karte}>
            <Kopf id="dokumente-titel" titel="Dokumente">
              <AdminDialog label="Dokument hochladen" icon={<Plus size={18} aria-hidden="true" />} nurIcon>
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
                        <li key={d.id} className="flex items-center gap-x-3">
                          <span className="text-[13px] text-text2 min-w-0 flex-1">
                            {i === 0 && <span className="font-semibold text-foreground">Aktuell: </span>}
                            {dateiInfo(d, 'de')}
                          </span>
                          <AktionenMenue
                            name={`${d.titel}, Version ${d.version}`}
                            eintraege={[
                              { art: 'link', label: 'Herunterladen', href: `/kunden/dokumente/${d.id}` },
                              {
                                art: 'aktion',
                                label: 'Entfernen',
                                aktion: dokumentEntfernen,
                                hidden: { id: d.id },
                                bestaetigen: {
                                  titel: 'Dokument entfernen?',
                                  text: `„${d.titel}“, Version ${d.version}, wird mit der Datei gelöscht. Der Kunde kann sie danach nicht mehr herunterladen.`,
                                  knopf: 'Dokument entfernen',
                                },
                                gefahr: true,
                              },
                            ]}
                          />
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
            <Kopf id="projekt-titel" titel="Projekt">
              <AktionenMenue
                name="Projekt"
                eintraege={[{ art: 'dialog', label: 'Projekt bearbeiten', inhalt: projektForm }]}
              />
            </Kopf>
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
          </section>

          {/* Nur für Admins, eigene Tabelle (admin-dashboard.md Verhalten 9) */}
          <section aria-labelledby="umsatz-titel" className={karte}>
            <Kopf id="umsatz-titel" titel="Umsatz">
              <AktionenMenue
                name="Umsatz"
                eintraege={[{ art: 'dialog', label: 'Umsatz bearbeiten', inhalt: umsatzForm }]}
              />
            </Kopf>
            <dl className={`${dl} mb-4`}>
              <dt className="text-text2">Auftragswert netto</dt>
              <dd className="tabular-nums">{betrag === null ? keine : euro(betrag)}</dd>
              <dt className="text-text2">Wahrscheinlichkeit</dt>
              <dd className="tabular-nums">{u ? `${u.wahrscheinlichkeit} %` : keine}</dd>
              <dt className="text-text2">Abrechnung</dt>
              <dd>{u?.abrechnung_am ? datum(u.abrechnung_am, 'de') : keine}</dd>
            </dl>
          </section>

          <section aria-labelledby="projekt-ap-titel" className={karte}>
            <Kopf id="projekt-ap-titel" titel="Ansprechpartner">
              {zuordnungForm && (
                <AktionenMenue
                  name="Ansprechpartner"
                  eintraege={[
                    {
                      art: 'dialog',
                      label: 'Zuordnung ändern',
                      titel: 'Ansprechpartner im Projekt',
                      inhalt: zuordnungForm,
                    },
                  ]}
                />
              )}
            </Kopf>
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
