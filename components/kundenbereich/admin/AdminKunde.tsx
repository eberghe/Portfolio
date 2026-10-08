import { Plus } from 'lucide-react';
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
import AdminForm from './AdminForm';
import AdminShell, { adminSection, listItem } from './AdminShell';
import UploadForm from './UploadForm';

// Ein Kunde: Stammdaten, Logo mit Freigabe, Ansprechpartner, Projekte (functions/kundenbereich/admin.md Verhalten 3)

export default function AdminKunde({ kunde: k }: { kunde: KundeDetail }) {
  return (
    <AdminShell title={k.name} pfad={[{ href: '/kunden/admin', label: 'Verwaltung' }]}>
      <section>
        <AdminForm
          id="kunde"
          title="Stammdaten"
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
      </section>

      <section aria-labelledby="logo-titel" className={adminSection}>
        <h2 id="logo-titel" className="text-[20px] font-bold mb-4">
          Logo
        </h2>
        <div className="flex flex-wrap items-center gap-4 mb-6">
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
        <UploadForm
          id="logo-upload"
          title={k.logo_pfad ? 'Neues Logo hochladen' : 'Logo hochladen'}
          prepare={logoVorbereiten}
          finish={logoUebernehmen}
          hidden={{ kunde_id: k.id }}
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          hint="PNG, JPEG, SVG oder WebP, höchstens 5 MB. Ersetzt das bisherige Logo."
          submitLabel="Logo hochladen"
        />
        {k.logo_freigaben.length > 0 && (
          <>
            <h3 className="text-[16px] font-bold mt-8 mb-2">Protokoll der Logo-Freigabe</h3>
            <ul role="list" className="text-[14px] text-text2 flex flex-col gap-1">
              {k.logo_freigaben.map((f) => (
                <li key={f.id}>
                  {datum(f.am.slice(0, 10), 'de')}: {f.entscheidung} von {f.ansprechpartner?.name ?? 'unbekannt'}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section aria-labelledby="ap-titel" className={adminSection}>
        <h2 id="ap-titel" className="text-[20px] font-bold mb-2">
          Ansprechpartner
        </h2>
        {k.ansprechpartner.length === 0 ? (
          <p className="text-[15px] text-text2 mb-6">Noch keine Ansprechpartner.</p>
        ) : (
          <ul role="list" className="border-b border-border mb-8">
            {k.ansprechpartner.map((a) => (
              <li key={a.id} className={listItem}>
                <div className="min-w-0 flex-1 basis-60">
                  <h3 className="text-[16px] font-bold break-words">{a.name}</h3>
                  <p className="text-[13px] text-text2 break-words">
                    {[a.email, a.rolle, a.telefon, optionLabel(SPRACH_OPTIONEN, a.sprache)].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-[13px] text-text2">
                    {a.user_id ? 'Hat sich schon angemeldet' : 'Noch nicht angemeldet'}
                  </p>
                </div>
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
        <AdminForm
          id="ap-neu"
          title="Ansprechpartner hinzufügen"
          titleLevel={3}
          action={ansprechpartnerHinzufuegen}
          submitLabel="Ansprechpartner hinzufügen"
          hidden={{ kunde_id: k.id }}
          reset
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
      </section>

      <section aria-labelledby="projekte-titel" className={adminSection}>
        <h2 id="projekte-titel" className="text-[20px] font-bold mb-2">
          Projekte
        </h2>
        {k.kundenprojekte.length === 0 ? (
          <p className="text-[15px] text-text2 mb-6">Noch keine Projekte.</p>
        ) : (
          <ul role="list" className="border-b border-border mb-8">
            {k.kundenprojekte.map((p) => (
              <li key={p.id} className={listItem}>
                <Link
                  href={`/kunden/admin/projekte/${p.id}`}
                  className="inline-flex items-center min-h-11 text-[16px] font-bold underline underline-offset-2 hover:text-primary-text break-words min-w-0"
                >
                  {p.titel}
                </Link>
                <span className="text-[13px] text-text2">{optionLabel(PROJEKT_STATUS_OPTIONEN, p.status)}</span>
              </li>
            ))}
          </ul>
        )}
        {/* Projekte entstehen im Assistenten (projekt-assistent.md) */}
        <Link href={`/kunden/admin/projekte/neu?kunde=${k.id}`} className={buttonClass('primary')}>
          <Plus size={15} aria-hidden="true" />
          Neues Projekt
        </Link>
      </section>
    </AdminShell>
  );
}
