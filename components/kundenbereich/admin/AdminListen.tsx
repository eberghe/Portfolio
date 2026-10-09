import { Plus } from 'lucide-react';
import Link from 'next/link';
import { kundeAnlegen } from '@/app/actions/kundenbereich-admin';
import { contactText } from '@/lib/content/contact';
import { services } from '@/lib/content/services';
import { euro, projekteNachStatus, type Anfrage, type AnfrageStatus } from '@/lib/kundenbereich/admin/dashboard';
import type { KundeZeile } from '@/lib/kundenbereich/admin/laden';
import { freigabeText, optionLabel, PROJEKT_STATUS_OPTIONEN } from '@/lib/kundenbereich/admin/texte';
import { datum } from '@/lib/kundenbereich/projekte';
import AdminDialog from './AdminDialog';
import AdminForm from './AdminForm';

// Gemeinsame Listen der Verwaltung: Projekte, Anfragen, Kunden (functions/kundenbereich/admin-aufbau.md)

export const karte = 'relative border border-border rounded-2xl p-5 md:p-6 min-w-0 bg-background';
export const kartenTitel = 'text-[16px] font-bold flex items-center gap-2';
export const badge =
  'inline-flex items-center text-[12px] font-medium border border-primary-border text-primary-text rounded-full px-2.5 py-0.5';
export const zeile = 'flex flex-col gap-1 py-3 border-t border-border first:border-0 first:pt-0';
export const titelLink =
  'inline-flex items-center min-h-11 text-[15px] font-bold underline underline-offset-2 hover:text-primary-text break-words min-w-0';
export const mehrLink =
  'inline-flex items-center min-h-11 text-[14px] font-medium text-primary-text underline underline-offset-4 hover:no-underline';

const ct = contactText.de;
export const leistung = (slug: string) =>
  services.find((s) => s.slug === slug)?.de.title ?? (slug === 'sonstiges' ? ct.other : slug);
export const zeitrahmen = (z: string) => ct.timeframes[z as keyof typeof ct.timeframes] ?? z;
export const budget = (b: string) => ct.budgets[b as keyof typeof ct.budgets] ?? b;

export const ANFRAGE_STATUS_TEXT: Record<AnfrageStatus, string> = {
  neu: 'Neu',
  beantwortet: 'Beantwortet',
  erledigt: 'Erledigt',
};

export function ProjektListe({ projekte }: { projekte: ReturnType<typeof projekteNachStatus> }) {
  return (
    <ul role="list" className="flex flex-col">
      {projekte.map((p) => (
        <li key={p.id} className={zeile}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link href={`/kunden/admin/projekte/${p.id}`} className={titelLink}>
              {p.titel}
            </Link>
            <span className={badge}>{optionLabel(PROJEKT_STATUS_OPTIONEN, p.status)}</span>
          </div>
          <p className="flex flex-wrap gap-x-3 text-[13px] text-text2">
            {p.kunden && <span>{p.kunden.name}</span>}
            <span>{p.wert === null ? 'kein Auftragswert' : euro(p.wert)}</span>
          </p>
          {p.naechsterSchritt && (
            <p className="text-[13px] text-text2">
              Nächster Schritt: {p.naechsterSchritt.titel} (
              {p.naechsterSchritt.verantwortlich === 'kunde' ? 'Kunde' : 'Erik'})
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Kurze Zeile je Anfrage; alle Angaben stehen auf der Seite der Anfrage */
export function AnfrageListe({ anfragen }: { anfragen: Anfrage[] }) {
  return (
    <ul role="list" className="flex flex-col">
      {anfragen.map((a) => (
        <li key={a.id} className={zeile}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link href={`/kunden/admin/anfragen/${a.id}`} className={titelLink}>
              {a.name}
            </Link>
            <span className={badge}>{ANFRAGE_STATUS_TEXT[a.status]}</span>
          </div>
          <p className="flex flex-wrap gap-x-3 text-[13px] text-text2">
            <span>{datum(a.created_at.slice(0, 10), 'de')}</span>
            <span>{a.leistungen.map(leistung).join(', ')}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export function KundenListe({ kunden }: { kunden: KundeZeile[] }) {
  if (kunden.length === 0) return <p className="text-[15px] text-text2">Noch keine Kunden angelegt.</p>;
  return (
    <ul role="list" className="flex flex-col">
      {kunden.map((k) => {
        const pr = k.kundenprojekte[0]?.count ?? 0;
        const ap = k.ansprechpartner[0]?.count ?? 0;
        return (
          <li key={k.id} className={zeile}>
            <Link href={`/kunden/admin/kunden/${k.id}`} className={titelLink}>
              {k.name}
            </Link>
            <p className="flex flex-wrap gap-x-3 text-[13px] text-text2">
              <span>
                {pr === 1 ? '1 Projekt' : `${pr} Projekte`}, {ap === 1 ? '1 Ansprechpartner' : `${ap} Ansprechpartner`}
              </span>
              <span>{freigabeText(k.logo_freigabe, k.logo_freigabe_am)}</span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}

export function KundeAnlegen({ variant = 'secondary' }: { variant?: 'primary' | 'secondary' }) {
  return (
    <AdminDialog label="Kunde anlegen" variant={variant} icon={<Plus size={15} aria-hidden="true" />}>
      <AdminForm
        id="kunde-neu"
        action={kundeAnlegen}
        submitLabel="Kunde anlegen"
        felder={[
          { name: 'name', label: 'Name', required: true, autoComplete: 'organization' },
          { name: 'website_url', label: 'Website', type: 'url', hint: 'Mit https://, z. B. https://firma.de' },
        ]}
      />
    </AdminDialog>
  );
}
