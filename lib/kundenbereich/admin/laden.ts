import type { DokumentRow } from '../dokumente';
import type { ProjektRow, ProjektStatus } from '../projekte';
import type { AdminApi } from './aktionen';

// Daten der Verwaltung, gelesen mit Eriks Token (functions/kundenbereich/admin.md)

export type Freigabe = 'offen' | 'erteilt' | 'widerrufen';

export interface KundeZeile {
  id: string;
  name: string;
  logo_freigabe: Freigabe;
  logo_freigabe_am: string | null;
  kundenprojekte: { count: number }[];
  ansprechpartner: { count: number }[];
}

export interface Ansprechpartner {
  id: string;
  name: string;
  email: string;
  rolle: string | null;
  telefon: string | null;
  sprache: 'de' | 'en';
  user_id: string | null;
}

export interface KundeDetail {
  id: string;
  name: string;
  website_url: string | null;
  logo_pfad: string | null;
  logo_freigabe: Freigabe;
  logo_freigabe_am: string | null;
  ansprechpartner: Ansprechpartner[];
  kundenprojekte: { id: string; titel: string; status: ProjektStatus; created_at: string }[];
  logo_freigaben: {
    id: string;
    entscheidung: 'erteilt' | 'widerrufen';
    am: string;
    ansprechpartner: { name: string } | null;
  }[];
}

export type ProjektDetail = Omit<ProjektRow, 'kunden' | 'dokumente'> & {
  kunde_id: string;
  kunden: { id: string; name: string; ansprechpartner: Pick<Ansprechpartner, 'id' | 'name' | 'email'>[] } | null;
  projekt_ansprechpartner: { ansprechpartner_id: string }[];
  dokumente: (DokumentRow & { storage_pfad: string })[];
};

export const kundenListe = (api: AdminApi) =>
  api.get<KundeZeile>('kunden', {
    select: 'id,name,logo_freigabe,logo_freigabe_am,kundenprojekte(count),ansprechpartner(count)',
    order: 'name.asc',
  });

export async function kundeDetail(api: AdminApi, id: string) {
  const [k] = await api.get<KundeDetail>('kunden', {
    select:
      'id,name,website_url,logo_pfad,logo_freigabe,logo_freigabe_am,' +
      'ansprechpartner(id,name,email,rolle,telefon,sprache,user_id),' +
      'kundenprojekte(id,titel,status,created_at),' +
      'logo_freigaben(id,entscheidung,am,ansprechpartner(name))',
    id: `eq.${id}`,
    'ansprechpartner.order': 'name.asc',
    'kundenprojekte.order': 'created_at.desc',
    'logo_freigaben.order': 'am.desc',
  });
  return k ?? null;
}

export async function projektDetail(api: AdminApi, id: string) {
  const [p] = await api.get<ProjektDetail>('kundenprojekte', {
    select:
      'id,kunde_id,titel,status,phase,beschreibung_de,beschreibung_en,website_url,staging_url,' +
      'kunden(id,name,ansprechpartner(id,name,email)),projekt_ansprechpartner(ansprechpartner_id),' +
      'projektschritte(*),termine(*),dokumente(*)',
    id: `eq.${id}`,
    'projektschritte.order': 'reihenfolge.asc',
    'termine.order': 'beginn.desc',
    'dokumente.order': 'created_at.desc',
  });
  return p ?? null;
}
