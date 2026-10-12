import { Pencil, Plus, Upload, UserPlus } from 'lucide-react';
import Link from 'next/link';
import {
  ansprechpartnerEinladen,
  ansprechpartnerEntfernen,
  ansprechpartnerHinzufuegen,
  kundeSpeichern,
  logoUebernehmen,
  logoVorbereiten,
} from '@/app/actions/kundenbereich-admin';
import { buttonClass } from '@/components/ui/Button';
import type { KundeDetail } from '@/lib/kundenbereich/admin/laden';
import { freigabeText, optionLabel, PROJEKT_STATUS_OPTIONEN, SPRACH_OPTIONEN } from '@/lib/kundenbereich/admin/texte';
import { datum } from '@/lib/kundenbereich/projekte';
import ActionButton from './ActionButton';
import AdminDialog from './AdminDialog';
import AdminForm from './AdminForm';
import { badge, karte, kartenTitel, zeile, titelLink } from './AdminListen';
import AdminShell from './AdminShell';
import UploadForm from './UploadForm';

// Ein Kunde als Übersicht, Formulare in Dialogen (functions/kundenbereich/admin.md Verhalten 3, admin-aufbau.md Verhalten 5)

export default function AdminKunde({ kunde: k }: { kunde: KundeDetail }) {
  return (
    <AdminShell
      title={k.name}
      bereich="kunden"
      unterseite
      pfad={[{ href: '/kunden/admin/kunden', label: 'Kunden' }]}
      aside={
        <Link href={`/kunden/admin/projekte/neu?kunde=${k.id}`} className={buttonClass('primary')}>
          <Plus size={15} aria-hidden="true" />
          Neues Projekt
        </Link>
      }
      wide
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 md:gap-6 items-start">
        <div className="flex flex-col gap-4 md:gap-6 min-w-0">
          <section aria-labelledby="projekte-titel" className={karte}>
            <h2 id="projekte-titel" className={`${kartenTitel} mb-3`}>
              Projekte
            </h2>
            {k.kundenprojekte.length === 0 ? (
              <p className="text-[15px] text-text2">Noch keine Projekte.</p>
            ) : (
              <ul role="list" className="flex flex-col">
                {k.kundenprojekte.map((p) => (
                  <li key={p.id} className={`${zeile} sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3`}>
                    <Link href={`/kunden/admin/projekte/${p.id}`} className={titelLink}>
                      {p.titel}
                    </Link>
                    <span className={`${badge} self-start sm:self-auto`}>
                      {optionLabel(PROJEKT_STATUS_OPTIONEN, p.status)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="ap-titel" className={karte}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h2 id="ap-titel" className={kartenTitel}>
                Ansprechpartner
              </h2>
              <AdminDialog label="Ansprechpartner hinzufügen" icon={<UserPlus size={15} aria-hidden="true" />}>
                <AdminForm
                  id="ap-neu"
                  action={ansprechpartnerHinzufuegen}
                  submitLabel="Ansprechpartner hinzufügen"
                  hidden={{ kunde_id: k.id }}
                  felder={[
                    { name: 'name', label: 'Name', required: true, half: true },
                    { name: 'email', label: 'E-Mail', type: 'email', required: true, half: true },
                    { name: 'rolle', label: 'Rolle', half: true, hint: 'z. B. Geschäftsführung' },
                    { name: 'telefon', label: 'Telefon', type: 'tel', half: true },
                    {
                      name: 'sprache',
                      label: 'Sprache',
                      type: 'select',
                      options: SPRACH_OPTIONEN,
                      half: true,
                      hint: 'Für Mails und den Kundenbereich',
                    },
                  ]}
                />
              </AdminDialog>
            </div>
            {k.ansprechpartner.length === 0 ? (
              <p className="text-[15px] text-text2">Noch keine Ansprechpartner.</p>
            ) : (
              <ul role="list" className="flex flex-col">
                {k.ansprechpartner.map((a) => (
                  <li key={a.id} className={`${zeile} gap-2`}>
                    <h3 className="text-[15px] font-bold break-words">{a.name}</h3>
                    <p className="text-[13px] text-text2 break-words">
                      {[a.email, a.rolle, a.telefon, optionLabel(SPRACH_OPTIONEN, a.sprache)]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    <p className="text-[13px] text-text2">
                      {a.user_id ? 'Hat sich schon angemeldet' : 'Noch nicht angemeldet'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <ActionButton
                        action={ansprechpartnerEinladen}
                        hidden={{ id: a.id }}
                        label="Anmeldelink schicken"
                        name={`Anmeldelink schicken an ${a.name}`}
                      />
                      <ActionButton
                        action={ansprechpartnerEntfernen}
                        hidden={{ id: a.id }}
                        label="Entfernen"
                        name={`Entfernen: ${a.name}`}
                        confirm={`${a.name} wirklich entfernen? Der Zugang zum Kundenbereich endet damit.`}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-4 md:gap-6 min-w-0">
          <section aria-labelledby="stamm-titel" className={karte}>
            <h2 id="stamm-titel" className={`${kartenTitel} mb-3`}>
              Stammdaten
            </h2>
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-[14px] mb-4">
              <dt className="text-text2">Name</dt>
              <dd className="break-words">{k.name}</dd>
              <dt className="text-text2">Website</dt>
              <dd className="break-words">
                {k.website_url ? (
                  <a
                    href={k.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-primary-text break-all"
                  >
                    {k.website_url.replace(/^https?:\/\//, '')}
                    <span className="sr-only"> (öffnet in neuem Tab)</span>
                  </a>
                ) : (
                  'keine Angabe'
                )}
              </dd>
            </dl>
            <AdminDialog label="Stammdaten bearbeiten" icon={<Pencil size={15} aria-hidden="true" />}>
              <AdminForm
                id="kunde"
                action={kundeSpeichern}
                submitLabel="Stammdaten speichern"
                hidden={{ id: k.id }}
                felder={[
                  { name: 'name', label: 'Name', required: true, defaultValue: k.name },
                  {
                    name: 'website_url',
                    label: 'Website',
                    type: 'url',
                    defaultValue: k.website_url ?? '',
                    hint: 'Mit https://',
                  },
                ]}
              />
            </AdminDialog>
          </section>

          <section aria-labelledby="logo-titel" className={karte}>
            <h2 id="logo-titel" className={`${kartenTitel} mb-3`}>
              Logo
            </h2>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {k.logo_pfad ? (
                // eslint-disable-next-line @next/next/no-img-element -- privates Bild über die Verwaltungsroute
                <img
                  src={`/kunden/admin/logo/${k.id}`}
                  alt={`Aktuelles Logo von ${k.name}`}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-contain rounded-lg border border-border bg-white p-2"
                />
              ) : (
                <p className="text-[15px] text-text2">Noch kein Logo hochgeladen.</p>
              )}
              <p className="text-[14px] text-text2">{freigabeText(k.logo_freigabe, k.logo_freigabe_am)}</p>
            </div>
            <AdminDialog
              label={k.logo_pfad ? 'Neues Logo hochladen' : 'Logo hochladen'}
              icon={<Upload size={15} aria-hidden="true" />}
            >
              <UploadForm
                id="logo-upload"
                prepare={logoVorbereiten}
                finish={logoUebernehmen}
                hidden={{ kunde_id: k.id }}
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                hint="PNG, JPEG, SVG oder WebP, höchstens 5 MB. Ersetzt das bisherige Logo."
                submitLabel="Logo hochladen"
              />
            </AdminDialog>
            {k.logo_freigaben.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer min-h-11 flex items-center text-[14px] font-medium">
                  Protokoll der Logo-Freigabe
                </summary>
                <ul role="list" className="text-[13px] text-text2 flex flex-col gap-1 mt-1">
                  {k.logo_freigaben.map((f) => (
                    <li key={f.id}>
                      {datum(f.am.slice(0, 10), 'de')}: {f.entscheidung} von {f.ansprechpartner?.name ?? 'unbekannt'}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
