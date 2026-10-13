// Bettet Mona Sans (OFL, @fontsource/mona-sans) als Base64 für das Angebots-PDF ein
// (functions/kundenbereich/angebot-pdf.md, Daten). Aufruf: node scripts/schrift-einbetten.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const dir = 'node_modules/@fontsource/mona-sans/files';
const datei = (s) => readFileSync(`${dir}/mona-sans-latin-${s}.woff`).toString('base64');
const out = `// Erzeugt von scripts/schrift-einbetten.mjs, nicht von Hand ändern. Mona Sans, SIL Open Font License 1.1.
export const MONA_REGULAR = '${datei('400-normal')}';
export const MONA_BOLD = '${datei('700-normal')}';
export const MONA_ITALIC = '${datei('400-italic')}';
`;
writeFileSync('lib/kundenbereich/angebot/schrift.ts', out);
