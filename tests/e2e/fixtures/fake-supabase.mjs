// Nachgebildetes Supabase für E2E-Tests des angemeldeten Kundenbereichs (functions/kundenbereich/projektuebersicht.md AK-9).
// Der Nutzer steckt im „sub“ des (unsignierten) Tokens: anna (ein Projekt), erik (Admin, zwei Projekte), leer (keins).
import { createServer } from 'node:http';

const port = Number(process.argv[2] ?? 3199);

const schritt = (n, titel_de, status, extra = {}) => ({
  id: `s${n}`,
  reihenfolge: n,
  titel_de,
  titel_en: null,
  beschreibung_de: null,
  beschreibung_en: null,
  status,
  faellig_am: null,
  verantwortlich: 'erik',
  ...extra,
});

// Termine relativ zum Start, damit sie immer in der Zukunft liegen
const inTagen = (d, h) => {
  const t = new Date(Date.now() + d * 86400000);
  t.setUTCHours(h, 0, 0, 0);
  return t.toISOString();
};
const termine = [
  {
    id: 't-review',
    beginn: inTagen(2, 8),
    ende: inTagen(2, 9),
    titel_de: 'Design-Review',
    titel_en: 'Design review',
    meet_url: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 't-texte',
    beginn: inTagen(9, 13),
    ende: inTagen(9, 14),
    titel_de: 'Texte besprechen',
    titel_en: null,
    meet_url: null,
  },
  {
    id: 't-alt',
    beginn: inTagen(-3, 8),
    ende: inTagen(-3, 9),
    titel_de: 'Erstgespräch',
    titel_en: null,
    meet_url: null,
  },
];

const dok = (id, art, titel, version, dateiname, mime_typ, groesse_bytes) => ({
  id,
  created_at: '2026-10-08T09:00:00Z',
  art,
  titel,
  dateiname,
  groesse_bytes,
  mime_typ,
  version,
  storage_pfad: `k1/p-relaunch/${dateiname}`,
});
const dokumente = [
  dok('d-vertrag-2', 'vertrag', 'Vertrag Relaunch', 2, 'vertrag-v2.pdf', 'application/pdf', 182_000),
  dok('d-vertrag-1', 'vertrag', 'Vertrag Relaunch', 1, 'vertrag-v1.pdf', 'application/pdf', 179_000),
  dok('d-rechnung', 'rechnung', 'Rechnung 2026-001', 1, 'rechnung-2026-001.pdf', 'application/pdf', 64_000),
  dok('d-logo', 'logo', 'Logo dunkel', 1, 'logo.svg', 'image/svg+xml', 3_200),
];
const LOGO_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#1f6f5c"/></svg>';

const relaunch = {
  id: 'p-relaunch',
  titel: 'Relaunch der Website',
  status: 'in_arbeit',
  phase: 'Design',
  beschreibung_de: 'Neue, barrierefreie Website mit Webflow, inklusive Texten und Bildern.',
  beschreibung_en: 'New accessible Webflow website, including copy and images.',
  website_url: 'https://kunde.example',
  staging_url: 'https://staging.kunde.example',
  kunden: { name: 'Bäckerei Beispiel' },
  termine,
  dokumente,
  projektschritte: [
    schritt(1, 'Erstgespräch', 'erledigt', { titel_en: 'Kick-off call' }),
    schritt(2, 'Analyse der bestehenden Website', 'erledigt', { titel_en: 'Audit of the current website' }),
    schritt(3, 'Konzept und Design', 'aktiv', {
      titel_en: 'Concept and design',
      beschreibung_de: 'Ich gestalte Startseite und Unterseiten, du bekommst zwei Entwürfe zur Auswahl.',
      faellig_am: '2026-10-24',
    }),
    schritt(4, 'Texte und Fotos liefern', 'offen', {
      titel_en: 'Deliver copy and photos',
      verantwortlich: 'kunde',
      faellig_am: '2026-10-31',
    }),
    schritt(5, 'Umsetzung in Webflow', 'offen', { titel_en: 'Build in Webflow' }),
    schritt(6, 'Test und Launch', 'offen', { titel_en: 'Testing and launch' }),
  ],
};
const logo = {
  ...relaunch,
  id: 'p-logo',
  titel: 'Neues Logo',
  status: 'angebot',
  phase: null,
  beschreibung_de: 'Wortmarke und Bildmarke für die Bäckerei, mit Farben und Schrift.',
  beschreibung_en: null,
  termine: [],
  dokumente: [],
  website_url: null,
  staging_url: null,
  projektschritte: [],
};

// Verwaltung (Erik): Kunden im Speicher, „Kunde anlegen“ fügt hinzu
const K1 = '10000000-0000-4000-8000-00000000000a';
const P1 = '20000000-0000-4000-8000-00000000000b';
const kunden = [
  {
    id: K1,
    name: 'Bäckerei Beispiel',
    website_url: 'https://kunde.example',
    logo_pfad: `${K1}/logo.svg`,
    logo_freigabe: 'erteilt',
    logo_freigabe_am: '2026-10-08T09:00:00Z',
    ansprechpartner: [
      {
        id: 'a-anna',
        name: 'Anna',
        email: 'anna@kunde.example',
        rolle: 'Geschäftsführung',
        telefon: null,
        sprache: 'de',
        user_id: 'u-anna',
      },
      {
        id: 'a-ben',
        name: 'Ben',
        email: 'ben@kunde.example',
        rolle: null,
        telefon: '+49 821 1234',
        sprache: 'en',
        user_id: null,
      },
    ],
    kundenprojekte: [
      { id: P1, titel: 'Relaunch der Website', status: 'in_arbeit', created_at: '2026-10-01T00:00:00Z' },
    ],
    logo_freigaben: [
      { id: 'f1', entscheidung: 'erteilt', am: '2026-10-08T09:00:00Z', ansprechpartner: { name: 'Anna' } },
    ],
  },
];
const adminProjekt = () => ({
  ...relaunch,
  id: P1,
  kunde_id: K1,
  kunden: { id: K1, name: kunden[0].name, ansprechpartner: kunden[0].ansprechpartner },
  projekt_ansprechpartner: [{ ansprechpartner_id: 'a-anna' }],
});

const annaFreigabe = { stand: 'offen', letzte: [] };

const users = {
  anna: { profil: { art: 'kunde', name: 'Anna', sprache: 'de' }, projekte: [relaunch] },
  erik: { profil: { art: 'admin', name: 'Erik', sprache: 'de' }, projekte: [logo, relaunch] },
  leer: { profil: { art: 'kunde', name: 'Ben', sprache: 'de' }, projekte: [] },
};

function user(req) {
  const token = (req.headers.authorization ?? '').replace(/^Bearer /, '');
  try {
    return users[JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64url').toString()).sub] ?? null;
  } catch {
    return null;
  }
}

createServer((req, res) => {
  const send = (status, body) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(body === undefined ? '' : JSON.stringify(body));
  };
  const path = (req.url ?? '/').split('?')[0];
  const u = user(req);
  if (path === '/') return send(200, { ok: true });
  if (path === '/auth/v1/logout') return send(204);
  // Signierte Links: ohne Token-Prüfung, liefert eine kleine Datei
  if (req.method === 'GET' && path.startsWith('/storage/v1/object/sign/')) {
    const svg = path.endsWith('.svg');
    res.writeHead(200, { 'Content-Type': svg ? 'image/svg+xml' : 'application/pdf' });
    return res.end(svg ? LOGO_SVG : '%PDF-1.4\n%%EOF\n');
  }
  if (path === '/auth/v1/verify' || path === '/auth/v1/token') return send(403, { error_code: 'otp_expired' });
  if (!u) return send(401, { message: 'invalid token' });
  if (path === '/auth/v1/user') return send(200, { id: 'x' });
  if (path === '/rest/v1/rpc/kundenbereich_profil') return send(200, [u.profil]);
  const params = new URL(req.url ?? '/', 'http://x').searchParams;
  const idParam = params.get('id')?.replace(/^eq\./, '');
  if (u.profil.art === 'admin' && path === '/rest/v1/kunden') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        const row = JSON.parse(body);
        const neu = {
          id: `10000000-0000-4000-8000-${String(kunden.length + 100).padStart(12, '0')}`,
          website_url: null,
          logo_pfad: null,
          logo_freigabe: 'offen',
          logo_freigabe_am: null,
          ansprechpartner: [],
          kundenprojekte: [],
          logo_freigaben: [],
          ...row,
        };
        kunden.push(neu);
        send(201, [neu]);
      });
      return;
    }
    if (idParam)
      return send(
        200,
        kunden.filter((k) => k.id === idParam),
      );
    return send(
      200,
      kunden.map((k) => ({
        ...k,
        kundenprojekte: [{ count: k.kundenprojekte.length }],
        ansprechpartner: [{ count: k.ansprechpartner.length }],
      })),
    );
  }
  if (u.profil.art === 'admin' && path === '/rest/v1/kundenprojekte' && idParam)
    return send(200, idParam === P1 ? [adminProjekt()] : []);
  if (u.profil.art === 'admin' && req.method === 'POST' && path.startsWith('/storage/v1/object/sign/kundenlogos/'))
    return send(200, { signedURL: `/object/sign/kundenlogos/${K1}/logo.svg?token=signiert` });
  if (path === '/rest/v1/kundenprojekte') return send(200, u.projekte);
  // Logo-Freigabe (logo-freigabe.md): nur Anna ist Ansprechpartnerin
  if (path === '/rest/v1/ansprechpartner' && u === users.anna)
    return send(200, [
      {
        id: 'a-anna',
        kunde_id: K1,
        kunden: { name: 'Bäckerei Beispiel', logo_freigabe: annaFreigabe.stand, logo_freigaben: annaFreigabe.letzte },
      },
    ]);
  if (path === '/rest/v1/ansprechpartner') return send(200, []);
  if (path === '/rest/v1/logo_freigaben' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      const row = JSON.parse(body);
      if (u !== users.anna || row.ansprechpartner_id !== 'a-anna' || row.kunde_id !== K1) return send(403, {});
      annaFreigabe.stand = row.entscheidung;
      annaFreigabe.letzte = [
        { entscheidung: row.entscheidung, am: new Date().toISOString(), ansprechpartner: { name: 'Anna' } },
      ];
      send(201);
    });
    return;
  }
  if (path === '/rest/v1/dokumente') {
    const id = new URL(req.url ?? '/', 'http://x').searchParams.get('id')?.replace(/^eq\./, '');
    const d = u.projekte.flatMap((p) => p.dokumente).find((d) => d.id === id);
    return send(200, d ? [{ id: d.id, storage_pfad: d.storage_pfad, dateiname: d.dateiname }] : []);
  }
  if (req.method === 'POST' && path.startsWith('/storage/v1/object/sign/kundendokumente/')) {
    const pfad = decodeURIComponent(path.slice('/storage/v1/object/sign/kundendokumente/'.length));
    const erlaubt = u.projekte.some((p) => p.dokumente.some((d) => d.storage_pfad === pfad));
    return erlaubt
      ? send(200, { signedURL: `/object/sign/kundendokumente/${encodeURI(pfad)}?token=signiert` })
      : send(400, { message: 'Object not found' });
  }
  if (path === '/rest/v1/termine') {
    const id = new URL(req.url ?? '/', 'http://x').searchParams.get('id')?.replace(/^eq\./, '');
    const projekt = u.projekte.find((p) => p.termine.some((t) => t.id === id));
    const t = projekt?.termine.find((t) => t.id === id);
    return send(200, t ? [{ ...t, kundenprojekte: { titel: projekt.titel } }] : []);
  }
  return send(404, { message: 'not found' });
}).listen(port);
