import { AdminFehler, type adminApi } from './api';
import {
  ansprechpartnerDaten,
  dateiPruefen,
  DATEI_REGELN,
  dokumentMeta,
  dokumentPfad,
  istId,
  kundeDaten,
  logoPfad,
  naechsteVersion,
  projektDaten,
  projektNeu,
  schrittDaten,
  terminDaten,
  type Bucket,
} from './pruefen';

// Aktionen der Verwaltung ohne Next-Abhängigkeiten, damit sie testbar sind; die Server Actions in
// app/actions/kundenbereich-admin.ts rufen sie auf (functions/kundenbereich/admin.md)

export type AdminApi = NonNullable<ReturnType<typeof adminApi>>;

export type AdminState =
  | { status: 'idle' }
  | { status: 'ok'; message: string; redirect?: string; upload?: { url: string; pfad: string } }
  | { status: 'error'; message?: string; errors?: Record<string, string> };

export type Einladung = 'sent' | 'limit' | 'unknown' | 'unavailable';

export interface AdminCtx {
  api: AdminApi | null;
  /** Profil der Sitzung ist `admin` (serverseitig geprüft) */
  admin: boolean;
  einladen?: (email: string) => Promise<Einladung>;
  zufall?: () => string;
  now?: () => Date;
}

export const ADMIN_TEXT = {
  keinZugriff: 'Dafür brauchst du Admin-Rechte. Bitte melde dich neu an.',
  fehler: 'Das hat nicht geklappt. Bitte versuch es noch einmal.',
  pruefen: 'Bitte prüf die markierten Felder.',
  gespeichert: 'Gespeichert.',
  entfernt: 'Entfernt.',
  emailVergeben: 'Diese E-Mail ist schon bei einem Ansprechpartner hinterlegt.',
  ungueltig: 'Dieser Eintrag ist ungültig.',
  uploadFehlt: 'Die Datei ist nicht angekommen. Bitte lade sie noch einmal hoch.',
  einladung: {
    sent: (email: string) => `Anmeldelink an ${email} geschickt.`,
    limit: 'An diese Adresse gingen gerade erst Links. Bitte warte 15 Minuten.',
    unknown: 'Diese Adresse ist nicht hinterlegt.',
    unavailable: 'Der Mailversand ist gerade nicht erreichbar.',
  },
};

const str = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim() : '';
};
const fehler = (errors: Record<string, string>): AdminState => ({
  status: 'error',
  message: ADMIN_TEXT.pruefen,
  errors,
});
const ok = (
  message = ADMIN_TEXT.gespeichert,
  extra: Partial<Extract<AdminState, { status: 'ok' }>> = {},
): AdminState => ({
  status: 'ok',
  message,
  ...extra,
});

/** Prüft Admin und Supabase, fängt Fehler ab (AK-1) */
async function run(ctx: AdminCtx, fn: (api: AdminApi) => Promise<AdminState>): Promise<AdminState> {
  if (!ctx.admin || !ctx.api) return { status: 'error', message: ADMIN_TEXT.keinZugriff };
  try {
    return await fn(ctx.api);
  } catch (e) {
    console.error('Verwaltung', e);
    return { status: 'error', message: ADMIN_TEXT.fehler };
  }
}

/** ID aus dem Formular, nur UUIDs */
function id(fd: FormData, key = 'id') {
  const v = str(fd, key);
  return istId(v) ? v : null;
}

const sicherePfad = (pfad: string, prefix: string) =>
  pfad.startsWith(prefix) && !pfad.split('/').some((s) => s === '' || s === '.' || s === '..');

async function dateiDa(api: AdminApi, bucket: Bucket, pfad: string) {
  const info = await api.info(bucket, pfad);
  if (!info) return null;
  return dateiPruefen(bucket, { name: pfad, type: info.type, size: info.size }) ? null : info;
}

// Kunden --------------------------------------------------------------------------------------------

export const kundeAnlegen = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const r = kundeDaten(fd);
    if (!r.ok) return fehler(r.errors);
    const kunde = await api.insert<{ id: string }>('kunden', r.data);
    return ok('Kunde angelegt.', { redirect: `/kunden/admin/kunden/${kunde.id}` });
  });

export const kundeSpeichern = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const kid = id(fd);
    if (!kid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const r = kundeDaten(fd);
    if (!r.ok) return fehler(r.errors);
    await api.update('kunden', kid, r.data);
    return ok();
  });

export const logoVorbereiten = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const kid = id(fd, 'kunde_id');
    if (!kid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const name = str(fd, 'name');
    const problem = dateiPruefen('kundenlogos', { name, type: str(fd, 'type'), size: Number(str(fd, 'size')) });
    if (problem) return fehler({ datei: problem });
    const pfad = logoPfad(kid, name, ctx.now?.());
    return ok('', { upload: { url: await api.signUpload('kundenlogos', pfad), pfad } });
  });

export const logoUebernehmen = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const kid = id(fd, 'kunde_id');
    const pfad = str(fd, 'pfad');
    if (!kid || !sicherePfad(pfad, `${kid}/logo-`)) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    if (!(await dateiDa(api, 'kundenlogos', pfad))) return fehler({ datei: ADMIN_TEXT.uploadFehlt });
    const [alt] = await api.get<{ logo_pfad: string | null }>('kunden', { select: 'logo_pfad', id: `eq.${kid}` });
    await api.update('kunden', kid, { logo_pfad: pfad });
    if (alt?.logo_pfad && alt.logo_pfad !== pfad) await api.removeFiles('kundenlogos', [alt.logo_pfad]);
    return ok('Logo gespeichert.');
  });

// Ansprechpartner ----------------------------------------------------------------------------------

export const ansprechpartnerHinzufuegen = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const kid = id(fd, 'kunde_id');
    if (!kid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const r = ansprechpartnerDaten(fd);
    if (!r.ok) return fehler(r.errors);
    try {
      await api.insert('ansprechpartner', { ...r.data, kunde_id: kid });
    } catch (e) {
      if (e instanceof AdminFehler && e.code === '23505') return fehler({ email: ADMIN_TEXT.emailVergeben });
      throw e;
    }
    return ok(`${r.data.name} hinzugefügt.`);
  });

export const ansprechpartnerEntfernen = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const aid = id(fd);
    if (!aid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    await api.remove('ansprechpartner', { id: `eq.${aid}` });
    return ok(ADMIN_TEXT.entfernt);
  });

export const ansprechpartnerEinladen = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const aid = id(fd);
    if (!aid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const [ap] = await api.get<{ email: string }>('ansprechpartner', { select: 'email', id: `eq.${aid}` });
    if (!ap) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const r = ctx.einladen ? await ctx.einladen(ap.email) : 'unavailable';
    return r === 'sent'
      ? ok(ADMIN_TEXT.einladung.sent(ap.email))
      : { status: 'error', message: ADMIN_TEXT.einladung[r] };
  });

// Projekte -----------------------------------------------------------------------------------------

export const projektAnlegen = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const kid = id(fd, 'kunde_id');
    if (!kid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const r = projektNeu(fd);
    if (!r.ok) return fehler(r.errors);
    const p = await api.insert<{ id: string }>('kundenprojekte', { ...r.data, kunde_id: kid });
    return ok('Projekt angelegt.', { redirect: `/kunden/admin/projekte/${p.id}` });
  });

export const projektSpeichern = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const pid = id(fd);
    if (!pid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const r = projektDaten(fd);
    if (!r.ok) return fehler(r.errors);
    await api.update('kundenprojekte', pid, r.data);
    return ok();
  });

/** Zuordnung ersetzen; nur Ansprechpartner des Kunden dieses Projekts (AK-6) */
export const projektAnsprechpartner = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const pid = id(fd, 'projekt_id');
    if (!pid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const [p] = await api.get<{ kunde_id: string }>('kundenprojekte', { select: 'kunde_id', id: `eq.${pid}` });
    if (!p) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const erlaubt = new Set(
      (await api.get<{ id: string }>('ansprechpartner', { select: 'id', kunde_id: `eq.${p.kunde_id}` })).map(
        (a) => a.id,
      ),
    );
    const gewaehlt = [...new Set(fd.getAll('ansprechpartner').map(String))].filter((a) => erlaubt.has(a));
    await api.remove('projekt_ansprechpartner', { projekt_id: `eq.${pid}` });
    if (gewaehlt.length)
      await api.insert(
        'projekt_ansprechpartner',
        gewaehlt.map((a) => ({ projekt_id: pid, ansprechpartner_id: a })),
      );
    return ok();
  });

// Schritte und Termine ------------------------------------------------------------------------------

export const schrittHinzufuegen = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const pid = id(fd, 'projekt_id');
    if (!pid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const r = schrittDaten(fd);
    if (!r.ok) return fehler(r.errors);
    await api.insert('projektschritte', { ...r.data, projekt_id: pid });
    return ok('Schritt hinzugefügt.');
  });

export const schrittSpeichern = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const sid = id(fd);
    if (!sid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const r = schrittDaten(fd);
    if (!r.ok) return fehler(r.errors);
    await api.update('projektschritte', sid, r.data);
    return ok();
  });

export const schrittEntfernen = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const sid = id(fd);
    if (!sid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    await api.remove('projektschritte', { id: `eq.${sid}` });
    return ok(ADMIN_TEXT.entfernt);
  });

export const terminHinzufuegen = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const pid = id(fd, 'projekt_id');
    if (!pid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const r = terminDaten(fd);
    if (!r.ok) return fehler(r.errors);
    await api.insert('termine', { ...r.data, projekt_id: pid });
    return ok('Termin hinzugefügt.');
  });

export const terminEntfernen = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const tid = id(fd);
    if (!tid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    await api.remove('termine', { id: `eq.${tid}` });
    return ok(ADMIN_TEXT.entfernt);
  });

// Dokumente ----------------------------------------------------------------------------------------

async function projektKunde(api: AdminApi, pid: string) {
  const [p] = await api.get<{ kunde_id: string }>('kundenprojekte', { select: 'kunde_id', id: `eq.${pid}` });
  return p?.kunde_id ?? null;
}

export const dokumentVorbereiten = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const pid = id(fd, 'projekt_id');
    if (!pid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const meta = dokumentMeta(fd);
    const name = str(fd, 'name');
    const problem = dateiPruefen('kundendokumente', { name, type: str(fd, 'type'), size: Number(str(fd, 'size')) });
    const errors = { ...(meta.ok ? {} : meta.errors), ...(problem ? { datei: problem } : {}) };
    if (Object.keys(errors).length) return fehler(errors);
    const kid = await projektKunde(api, pid);
    if (!kid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const zufall = ctx.zufall?.() ?? crypto.randomUUID().slice(0, 8);
    const pfad = dokumentPfad(kid, pid, name, zufall);
    return ok('', { upload: { url: await api.signUpload('kundendokumente', pfad), pfad } });
  });

export const dokumentUebernehmen = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const pid = id(fd, 'projekt_id');
    if (!pid) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const meta = dokumentMeta(fd);
    if (!meta.ok) return fehler(meta.errors);
    const kid = await projektKunde(api, pid);
    const pfad = str(fd, 'pfad');
    if (!kid || !sicherePfad(pfad, `${kid}/${pid}/`)) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const info = await dateiDa(api, 'kundendokumente', pfad);
    if (!info) return fehler({ datei: ADMIN_TEXT.uploadFehlt });
    const vorhanden = await api.get<{ art: string; titel: string; version: number }>('dokumente', {
      select: 'art,titel,version',
      projekt_id: `eq.${pid}`,
    });
    const dateiname = (str(fd, 'dateiname').split(/[\\/]/).pop() ?? '').slice(0, 200) || (pfad.split('/').pop() ?? '');
    await api.insert('dokumente', {
      projekt_id: pid,
      art: meta.data.art,
      titel: meta.data.titel,
      storage_pfad: pfad,
      dateiname,
      groesse_bytes: info.size,
      mime_typ: info.type,
      version: naechsteVersion(vorhanden, meta.data.art, meta.data.titel),
    });
    return ok('Dokument gespeichert.');
  });

export const dokumentEntfernen = (fd: FormData, ctx: AdminCtx) =>
  run(ctx, async (api) => {
    const did = id(fd);
    if (!did) return { status: 'error', message: ADMIN_TEXT.ungueltig };
    const rows = await api.remove<{ storage_pfad: string }>('dokumente', { id: `eq.${did}` });
    const pfade = rows.map((r) => r.storage_pfad);
    if (pfade.length) await api.removeFiles('kundendokumente', pfade);
    return ok(ADMIN_TEXT.entfernt);
  });

export { DATEI_REGELN };
