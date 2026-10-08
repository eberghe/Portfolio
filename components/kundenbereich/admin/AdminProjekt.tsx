import { Download } from 'lucide-react';
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
import { terminTitel, zeitraum } from '@/lib/kundenbereich/termine';
import ActionButton from './ActionButton';
import AdminForm, { type Feld } from './AdminForm';
import AdminShell, { adminSection, listItem } from './AdminShell';
import UploadForm from './UploadForm';

// Ein Projekt: Daten, Ansprechpartner, Ablauf, Termine, Dokumente (functions/kundenbereich/admin.md Verhalten 4)

type Schritt = ProjektDetail['projektschritte'][number];

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

export default function AdminProjekt({ projekt: p, now = new Date() }: { projekt: ProjektDetail; now?: Date }) {
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
            <h2 className="text-[20px] font-bold mb-2">Ansprechpartner im Projekt</h2>
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
        <div className="flex flex-col gap-8 mb-10">
          {p.projektschritte.map((s) => (
            <div key={s.id} className="border border-border rounded-2xl p-4 sm:p-6">
              <AdminForm
                id={`schritt-${s.id}`}
                title={`${s.reihenfolge}. ${s.titel_de}`}
                titleLevel={3}
                action={schrittSpeichern}
                submitLabel="Schritt speichern"
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
          ))}
        </div>
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
          <ul role="list" className="border-t border-border mb-8">
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
          <ul role="list" className="border-t border-border mb-8">
            {p.dokumente.map((d) => (
              <li key={d.id} className={listItem}>
                <div className="min-w-0 flex-1 basis-60">
                  <h3 className="text-[16px] font-bold break-words">{d.titel}</h3>
                  <p className="text-[13px] text-text2">
                    {optionLabel(DOKUMENT_ART_OPTIONEN, d.art)} · {dateiInfo(d, 'de')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
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
                </div>
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
