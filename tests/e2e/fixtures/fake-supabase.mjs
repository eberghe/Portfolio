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
  website_url: null,
  staging_url: null,
  projektschritte: [],
};

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
  if (path === '/auth/v1/verify' || path === '/auth/v1/token') return send(403, { error_code: 'otp_expired' });
  if (!u) return send(401, { message: 'invalid token' });
  if (path === '/auth/v1/user') return send(200, { id: 'x' });
  if (path === '/rest/v1/rpc/kundenbereich_profil') return send(200, [u.profil]);
  if (path === '/rest/v1/kundenprojekte') return send(200, u.projekte);
  return send(404, { message: 'not found' });
}).listen(port);
