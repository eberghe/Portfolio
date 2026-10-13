import { angebotPdf } from '../angebot/pdf';
import { angebotDaten, ANGEBOT_TEXT } from '../angebot/pruefen';
import { summen } from '../angebot/rechnen';
import { AdminFehler } from './api';
import { ADMIN_TEXT, helfer, type AdminApi, type AdminCtx } from './aktionen';
import { istId } from './pruefen';

// Angebote in der Verwaltung: Entwurf mit PDF, Freigeben an den Kunden, Löschen
// (functions/kundenbereich/angebote.md)

const { run, fehler, ok, id, dateienWeg } = helfer;
const BUCKET = 'kundendokumente';
const ungueltig = { status: 'error' as const, message: ADMIN_TEXT.ungueltig };

export type { AngebotStatus } from './angebote-text';
import type { AngebotStatus } from './angebote-text';

/** Neuer Entwurf oder Änderung eines Entwurfs; erzeugt das PDF neu (AK-4, AK-5) */
export const angebotSpeichern = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const pid = id(fd, 'projekt_id');
    if (!pid) return ungueltig;
    const aid = fd.get('id') ? id(fd) : null;
    if (fd.get('id') && !aid) return ungueltig;
    const r = angebotDaten(fd);
    if (!r.ok) return fehler(r.errors);
    const [p] = await api.get<{ kunde_id: string; titel: string }>('kundenprojekte', {
      select: 'kunde_id,titel',
      id: `eq.${pid}`,
    });
    if (!p) return ungueltig;
    let altPfad: string | null = null;
    if (aid) {
      const [alt] = await api.get<{ projekt_id: string; status: AngebotStatus; pdf_pfad: string }>('angebote', {
        select: 'projekt_id,status,pdf_pfad',
        id: `eq.${aid}`,
      });
      if (!alt || alt.projekt_id !== pid || alt.status !== 'entwurf') return ungueltig;
      altPfad = alt.pdf_pfad;
    }

    const bytes = await angebotPdf({ ...r.data, projekt: p.titel });
    const zufall = ctx.zufall?.() ?? crypto.randomUUID().slice(0, 8);
    const pfad = `${p.kunde_id}/${pid}/angebot-${r.data.nummer}-${zufall}.pdf`;
    await api.upload(BUCKET, pfad, bytes, 'application/pdf');
    const zeile = {
      ...r.data,
      projekt_id: pid,
      gesamt_cent: summen(r.data.positionen, r.data.ust_satz).gesamt,
      pdf_pfad: pfad,
    };
    try {
      if (aid) await api.update('angebote', aid, zeile);
      else await api.insert('angebote', { ...zeile, status: 'entwurf' });
    } catch (e) {
      await dateienWeg(api, BUCKET, [pfad]);
      if (e instanceof AdminFehler && e.code === '23505') return fehler({ nummer: ANGEBOT_TEXT.vergeben });
      throw e;
    }
    if (altPfad && altPfad !== pfad) await dateienWeg(api, BUCKET, [altPfad]);
    return ok('Entwurf gespeichert.');
  });

/** Entwurf als Dokument ins Projekt stellen, ab dann sieht es der Kunde (AK-6) */
export const angebotFreigeben = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const aid = id(fd);
    if (!aid) return ungueltig;
    const [a] = await api.get<{
      id: string;
      projekt_id: string;
      nummer: string;
      sprache: 'de' | 'en';
      status: AngebotStatus;
      pdf_pfad: string;
    }>('angebote', { select: 'id,projekt_id,nummer,sprache,status,pdf_pfad', id: `eq.${aid}` });
    if (!a || a.status !== 'entwurf') return ungueltig;
    const info = await api.info(BUCKET, a.pdf_pfad);
    if (!info) return { status: 'error', message: ADMIN_TEXT.uploadFehlt };
    const wort = a.sprache === 'en' ? 'Quote' : 'Angebot';
    const dok = await api.insert<{ id: string }>('dokumente', {
      projekt_id: a.projekt_id,
      art: 'angebot',
      titel: `${wort} ${a.nummer}`,
      storage_pfad: a.pdf_pfad,
      dateiname: `${wort}-${a.nummer}.pdf`,
      groesse_bytes: info.size,
      mime_typ: 'application/pdf',
      version: 1,
    });
    await api.update('angebote', aid, { status: 'freigegeben', dokument_id: dok.id });
    return ok(`Angebot ${a.nummer} freigegeben. Der Kunde sieht es jetzt unter Dokumente.`);
  });

/** Angebot mit PDF, Dokument und hochgeladener Unterschrift löschen (AK-8) */
export const angebotLoeschen = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const aid = id(fd);
    if (!aid) return ungueltig;
    const [a] = await api.get<{
      nummer: string;
      pdf_pfad: string;
      dokument_id: string | null;
      unterschrift_id: string | null;
    }>('angebote', { select: 'nummer,pdf_pfad,dokument_id,unterschrift_id', id: `eq.${aid}` });
    if (!a) return ungueltig;
    const doks = [a.dokument_id, a.unterschrift_id].filter((x): x is string => !!x);
    const dateien = doks.length
      ? await api.get<{ storage_pfad: string }>('dokumente', {
          select: 'storage_pfad',
          or: `(id.in.(${doks.join(',')}),zu_dokument.in.(${doks.join(',')}))`,
        })
      : [];
    const rows = await api.remove('angebote', { id: `eq.${aid}` });
    if (!rows.length) return ungueltig;
    if (doks.length) await api.remove('dokumente', { id: `in.(${doks.join(',')})` });
    await dateienWeg(api, BUCKET, [...new Set([a.pdf_pfad, ...dateien.map((d) => d.storage_pfad)])]);
    return ok(`Angebot ${a.nummer} gelöscht.`);
  });

/** PDF eines Angebots ansehen, auch als Entwurf, nur für Admins (AK-10) */
export async function angebotPdfAntwort(aid: string, api: AdminApi | null) {
  const headers = { 'Cache-Control': 'private, no-store' };
  if (!api || !istId(aid)) return new Response('Not found', { status: 404, headers });
  try {
    const [a] = await api.get<{ pdf_pfad: string }>('angebote', { select: 'pdf_pfad', id: `eq.${aid}` });
    if (!a) return new Response('Not found', { status: 404, headers });
    return new Response(null, {
      status: 303,
      headers: { ...headers, Location: await api.sign(BUCKET, a.pdf_pfad, 60) },
    });
  } catch {
    return new Response('Bad gateway', { status: 502, headers });
  }
}
