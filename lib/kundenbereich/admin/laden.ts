import type { DokumentRow } from '../dokumente';
import type { ProjektRow, ProjektStatus } from '../projekte';
import type { AdminApi } from './aktionen';
import type { AssistentKunde } from './assistent';
import type { Anfrage, DashboardDaten, DashboardProjekt, DashboardTermin, Umsatz } from './dashboard';

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
  projekt_umsatz?: Umsatz | null;
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
      'projektschritte(*),termine(*),dokumente(*),projekt_umsatz(auftragswert_netto,wahrscheinlichkeit,abrechnung_am)',
    id: `eq.${id}`,
    'projektschritte.order': 'reihenfolge.asc',
    'termine.order': 'beginn.desc',
    'dokumente.order': 'created_at.desc',
  });
  return p ?? null;
}

/** Alles für das Dashboard der Verwaltung (admin-dashboard.md) */
export async function dashboardDaten(api: AdminApi, now = new Date()): Promise<DashboardDaten> {
  const [projekte, termine, anfragen, kunden] = await Promise.all([
    api.get<DashboardProjekt>('kundenprojekte', {
      select:
        'id,titel,status,kunden(id,name),projekt_umsatz(auftragswert_netto,wahrscheinlichkeit,abrechnung_am),' +
        'projektschritte(titel_de,status,reihenfolge,verantwortlich)',
      order: 'titel.asc',
    }),
    api.get<DashboardTermin>('termine', {
      select: 'id,beginn,ende,titel_de,meet_url,kundenprojekte(id,titel,kunden(name))',
      ende: `gte.${now.toISOString()}`,
      order: 'beginn.asc',
      limit: '50',
    }),
    api.get<Anfrage>('anfragen', {
      select: 'id,created_at,name,email,telefon,website,leistungen,zeitrahmen,budget,beschreibung,status,sprache',
      order: 'created_at.desc',
      limit: '200',
    }),
    kundenListe(api),
  ]);
  return { projekte, termine, anfragen, kunden };
}

/** Kunden mit Ansprechpartnern für den Assistenten (projekt-assistent.md) */
export const assistentKunden = (api: AdminApi) =>
  api.get<AssistentKunde>('kunden', {
    select: 'id,name,ansprechpartner(id,name,email)',
    order: 'name.asc',
    'ansprechpartner.order': 'name.asc',
  });

export async function anfrage(api: AdminApi, id: string) {
  const [a] = await api.get<Anfrage>('anfragen', {
    select: 'id,created_at,name,email,telefon,website,leistungen,zeitrahmen,budget,beschreibung,status,sprache',
    id: `eq.${id}`,
  });
  return a ?? null;
}
