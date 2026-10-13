import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, PDFName, PDFString, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { LOGO_PFADE } from '@/components/logoPfade';
import type { Locale } from '@/lib/i18n';
import { AGB } from './agb';
import { euro, summen, zahl, type Position, type UstSatz } from './rechnen';
import { MONA_BOLD, MONA_ITALIC, MONA_REGULAR } from './schrift';
import { ABSENDER, pdfTexte, type PdfTexte } from './texte';

// Angebot als PDF in Eriks Design: Mona Sans, Farben der Website, Schriftzug und Adresse
// (functions/kundenbereich/angebot-pdf.md)

export interface AngebotPdfDaten {
  nummer: string;
  titel: string;
  projekt?: string;
  sprache: Locale;
  /** JJJJ-MM-TT */
  datum: string;
  gueltig_bis: string;
  empfaenger: string;
  einleitung: string;
  positionen: Position[];
  ust_satz: UstSatz;
}

export interface PdfOptionen {
  /** AGB anhängen: freigegeben (mit Hinweis im Angebot) oder als Entwurf (nur Beispiel) */
  agb?: 'freigegeben' | 'entwurf' | false;
}

// Farben aus app/globals.css (hell)
const FARBE = {
  text: rgb(23 / 255, 34 / 255, 43 / 255),
  text2: rgb(96 / 255, 111 / 255, 131 / 255),
  primary: rgb(55 / 255, 118 / 255, 98 / 255),
  hell: rgb(233 / 255, 242 / 255, 237 / 255),
  linie: rgb(225 / 255, 228 / 255, 226 / 255),
  weiss: rgb(1, 1, 1),
};

const A4: [number, number] = [595.28, 841.89];
const RAND = 56;
const BREITE = A4[0] - 2 * RAND;
const UNTEN = 84; // darunter steht der Fuß

interface Schriften {
  normal: PDFFont;
  fett: PDFFont;
  kursiv: PDFFont;
}

/** „13.10.2026“ bzw. „13 Oct 2026“ */
export function pdfDatum(iso: string, locale: Locale) {
  const [j, m, t] = iso.split('-');
  if (locale !== 'en') return `${t}.${m}.${j}`;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${iso}T12:00:00Z`),
  );
}

/** Zeichen, die Mona Sans nicht hat, ersetzen, damit keine leeren Kästchen entstehen */
function sauber(text: string, font: PDFFont) {
  const zeichen = new Set(font.getCharacterSet());
  return [...text.replace(/\t/g, ' ').replace(/\r/g, '')]
    .map((c) => (c === '\n' || zeichen.has(c.codePointAt(0)!) ? c : '?'))
    .join('');
}

/** Zeilen umbrechen; zu lange Wörter werden geteilt */
function umbrechen(text: string, font: PDFFont, groesse: number, max: number) {
  const zeilen: string[] = [];
  for (const absatz of sauber(text, font).split('\n')) {
    let zeile = '';
    for (const wort of absatz.split(/ +/)) {
      let w = wort;
      while (font.widthOfTextAtSize(w, groesse) > max) {
        let n = w.length - 1;
        while (n > 1 && font.widthOfTextAtSize(w.slice(0, n), groesse) > max) n--;
        if (zeile) zeilen.push(zeile);
        zeilen.push(w.slice(0, n));
        zeile = '';
        w = w.slice(n);
      }
      const probe = zeile ? `${zeile} ${w}` : w;
      if (font.widthOfTextAtSize(probe, groesse) <= max) zeile = probe;
      else {
        zeilen.push(zeile);
        zeile = w;
      }
    }
    zeilen.push(zeile);
  }
  return zeilen;
}

class Satz {
  seite!: PDFPage;
  y = 0;
  readonly seiten: PDFPage[] = [];

  constructor(
    readonly pdf: PDFDocument,
    readonly f: Schriften,
    readonly kopf: (seite: PDFPage, erste: boolean) => number,
  ) {
    this.neueSeite();
  }

  neueSeite() {
    this.seite = this.pdf.addPage(A4);
    this.seiten.push(this.seite);
    this.y = this.kopf(this.seite, this.seiten.length === 1);
  }

  /** Platz für h Punkte, sonst neue Seite; true, wenn umgebrochen wurde */
  platz(h: number) {
    if (this.y - h >= UNTEN) return false;
    this.neueSeite();
    return true;
  }

  text(t: string, x: number, y: number, o: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb> } = {}) {
    const font = o.font ?? this.f.normal;
    this.seite.drawText(sauber(t, font), { x, y, font, size: o.size ?? 10, color: o.color ?? FARBE.text });
  }

  rechts(
    t: string,
    xRechts: number,
    y: number,
    o: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb> } = {},
  ) {
    const font = o.font ?? this.f.normal;
    const s = sauber(t, font);
    this.text(s, xRechts - font.widthOfTextAtSize(s, o.size ?? 10), y, o);
  }

  /** Absatz mit Umbruch ab der aktuellen Höhe, bricht bei Bedarf auf eine neue Seite um */
  absatz(
    t: string,
    o: {
      font?: PDFFont;
      size?: number;
      color?: ReturnType<typeof rgb>;
      zeile?: number;
      x?: number;
      breite?: number;
    } = {},
  ) {
    const size = o.size ?? 10;
    const zeile = o.zeile ?? size * 1.5;
    for (const z of umbrechen(t, o.font ?? this.f.normal, size, o.breite ?? BREITE)) {
      this.platz(zeile);
      this.y -= zeile;
      if (z) this.text(z, o.x ?? RAND, this.y + (zeile - size) / 2, o);
    }
  }

  linie(y: number, farbe = FARBE.linie, dicke = 0.6, x = RAND, breite = BREITE) {
    this.seite.drawLine({ start: { x, y }, end: { x: x + breite, y }, thickness: dicke, color: farbe });
  }
}

function logo(seite: PDFPage, x: number, yOben: number, breite: number, farbe = FARBE.text) {
  const scale = breite / 205;
  for (const d of LOGO_PFADE) seite.drawSvgPath(d, { x, y: yOben, scale, color: farbe });
}

async function schriften(pdf: PDFDocument): Promise<Schriften> {
  pdf.registerFontkit(fontkit);
  const laden = (b64: string) => pdf.embedFont(Buffer.from(b64, 'base64'), { subset: true });
  const [normal, fett, kursiv] = await Promise.all([laden(MONA_REGULAR), laden(MONA_BOLD), laden(MONA_ITALIC)]);
  return { normal, fett, kursiv };
}

export async function angebotPdf(d: AngebotPdfDaten, optionen: PdfOptionen = {}): Promise<Uint8Array> {
  const t = pdfTexte(d.sprache);
  const titel = `${t.angebot} ${d.nummer}`;
  const pdf = await PDFDocument.create();
  pdf.setTitle(titel, { showInWindowTitleBar: true });
  pdf.setAuthor(ABSENDER.name);
  pdf.setCreator(ABSENDER.name);
  pdf.setProducer('erik-bergheimer.de');
  pdf.setSubject(d.titel);
  pdf.setLanguage(t.lang);
  pdf.catalog.set(PDFName.of('Lang'), PDFString.of(t.lang));
  const f = await schriften(pdf);
  const agb = optionen.agb ?? false;

  const kopf = (seite: PDFPage, erste: boolean) => {
    const oben = A4[1] - RAND;
    if (!erste) {
      logo(seite, RAND, oben + 2, 120);
      const s = `${titel} (${t.fortsetzung})`;
      seite.drawText(s, {
        x: RAND + BREITE - f.normal.widthOfTextAtSize(s, 8.5),
        y: oben - 8,
        font: f.normal,
        size: 8.5,
        color: FARBE.text2,
      });
      seite.drawLine({
        start: { x: RAND, y: oben - 22 },
        end: { x: RAND + BREITE, y: oben - 22 },
        thickness: 0.6,
        color: FARBE.linie,
      });
      return oben - 40;
    }
    logo(seite, RAND, oben + 2, 170);
    seite.drawText('Design Engineer', { x: RAND, y: oben - 30, font: f.normal, size: 9, color: FARBE.primary });
    const absender = [ABSENDER.name, ABSENDER.strasse, ABSENDER.ort, ABSENDER.email, ABSENDER.web];
    absender.forEach((z, i) => {
      const font = i === 0 ? f.fett : f.normal;
      seite.drawText(z, {
        x: RAND + BREITE - font.widthOfTextAtSize(z, 8.5),
        y: oben - 8 - i * 12.5,
        font,
        size: 8.5,
        color: i === 0 ? FARBE.text : FARBE.text2,
      });
    });
    const linie = oben - 76;
    seite.drawLine({
      start: { x: RAND, y: linie },
      end: { x: RAND + BREITE, y: linie },
      thickness: 1.2,
      color: FARBE.primary,
    });
    return linie - 28;
  };

  const s = new Satz(pdf, f, kopf);
  angebotSetzen(s, d, t, f, agb === 'freigegeben' || agb === 'entwurf');

  if (agb) agbSetzen(pdf, f, t, agb === 'entwurf', s.seiten);

  // Fuß mit Seitenzahl auf jeder Seite
  const alle = s.seiten;
  alle.forEach((seite, i) => {
    seite.drawLine({ start: { x: RAND, y: 50 }, end: { x: RAND + BREITE, y: 50 }, thickness: 0.6, color: FARBE.linie });
    const links = [ABSENDER.name, ABSENDER.strasse, ABSENDER.ort, ABSENDER.email, ABSENDER.web].join('  ·  ');
    seite.drawText(links, { x: RAND, y: 34, font: f.normal, size: 7.5, color: FARBE.text2 });
    const nr = t.seite(i + 1, alle.length);
    seite.drawText(nr, {
      x: RAND + BREITE - f.normal.widthOfTextAtSize(nr, 7.5),
      y: 34,
      font: f.normal,
      size: 7.5,
      color: FARBE.text2,
    });
  });
  return pdf.save();
}

function angebotSetzen(s: Satz, d: AngebotPdfDaten, t: PdfTexte, f: Schriften, mitAgb: boolean) {
  const L = d.sprache;
  const start = s.y;

  // Empfänger links
  s.text(t.an.toUpperCase(), RAND, s.y, { font: f.fett, size: 7.5, color: FARBE.text2 });
  let yL = s.y - 6;
  for (const z of umbrechen(d.empfaenger, f.normal, 10.5, 250)) {
    yL -= 15;
    s.text(z, RAND, yL, { size: 10.5 });
  }

  // Angaben rechts
  const meta: [string, string][] = [
    [t.nummer, d.nummer],
    [t.datum, pdfDatum(d.datum, L)],
    [t.gueltigBis, pdfDatum(d.gueltig_bis, L)],
  ];
  if (d.projekt) meta.push([t.projekt, d.projekt]);
  const xMeta = RAND + BREITE - 190;
  let yR = start;
  for (const [k, v] of meta) {
    s.text(k, xMeta, yR, { size: 9, color: FARBE.text2 });
    const wert = umbrechen(v, f.fett, 9, 100)[0] ?? '';
    s.rechts(wert, RAND + BREITE, yR, { font: f.fett, size: 9 });
    yR -= 16;
  }
  s.y = Math.min(yL, yR) - 40;

  // Titel
  s.text(`${t.angebot} ${d.nummer}`, RAND, s.y, { font: f.fett, size: 26 });
  s.y -= 10;
  s.absatz(d.titel, { size: 13, color: FARBE.primary, zeile: 19 });
  s.y -= 14;

  // Einleitung
  const einleitung = d.einleitung.trim() || `${t.anrede}\n\n${t.einleitung}`;
  s.absatz(einleitung, { size: 10, zeile: 15 });
  s.y -= 22;

  // Positionen
  const sp = {
    nr: RAND + 8,
    leistung: RAND + 34,
    leistungBreite: 222,
    menge: RAND + 330,
    preis: RAND + 405,
    betrag: RAND + BREITE - 8,
  };
  const tabellenKopf = () => {
    s.seite.drawRectangle({ x: RAND, y: s.y - 24, width: BREITE, height: 24, color: FARBE.hell });
    const y = s.y - 15.5;
    const o = { font: f.fett, size: 8.5 };
    s.text(t.pos, sp.nr, y, o);
    s.text(t.leistung, sp.leistung, y, o);
    s.rechts(t.menge, sp.menge, y, o);
    s.rechts(t.einzelpreis, sp.preis, y, o);
    s.rechts(t.betrag, sp.betrag, y, o);
    s.y -= 24;
  };
  s.platz(24 + 40);
  tabellenKopf();
  const { zeilen, netto, ust, gesamt } = summen(d.positionen, d.ust_satz);
  d.positionen.forEach((p, i) => {
    const titelZeilen = umbrechen(p.bezeichnung, f.fett, 10, sp.leistungBreite);
    const beschrZeilen = p.beschreibung.trim() ? umbrechen(p.beschreibung, f.normal, 8.5, sp.leistungBreite) : [];
    const h = 10 + titelZeilen.length * 14 + beschrZeilen.length * 12 + 8;
    if (s.platz(h)) tabellenKopf();
    let y = s.y - 10 - 10;
    s.text(String(i + 1), sp.nr, y, { size: 9.5, color: FARBE.text2 });
    const menge = `${zahl(p.menge, L)} ${p.einheit}`.trim();
    s.rechts(menge, sp.menge, y, { size: 9.5 });
    s.rechts(euro(p.einzelpreis_cent, L), sp.preis, y, { size: 9.5 });
    s.rechts(euro(zeilen[i]!, L), sp.betrag, y, { font: f.fett, size: 9.5 });
    for (const z of titelZeilen) {
      s.text(z, sp.leistung, y, { font: f.fett, size: 10 });
      y -= 14;
    }
    y += 2;
    for (const z of beschrZeilen) {
      s.text(z, sp.leistung, y, { size: 8.5, color: FARBE.text2 });
      y -= 12;
    }
    s.y -= h;
    s.linie(s.y);
  });

  // Summen (22 + 18 + 16 + 30 Punkte)
  s.platz(d.ust_satz > 0 ? 88 : 72);
  s.y -= 22;
  const xSum = RAND + BREITE - 230;
  s.text(t.netto, xSum + 10, s.y, { size: 10 });
  s.rechts(euro(netto, L), sp.betrag, s.y, { size: 10 });
  if (d.ust_satz > 0) {
    s.y -= 18;
    s.text(t.ust(d.ust_satz), xSum + 10, s.y, { size: 10 });
    s.rechts(euro(ust, L), sp.betrag, s.y, { size: 10 });
  }
  s.y -= 16;
  s.seite.drawRectangle({ x: xSum, y: s.y - 30, width: 230, height: 30, color: FARBE.primary });
  s.text(t.gesamt, xSum + 10, s.y - 19.5, { font: f.fett, size: 11, color: FARBE.weiss });
  s.rechts(euro(gesamt, L), sp.betrag, s.y - 19.5, { font: f.fett, size: 12, color: FARBE.weiss });
  s.y -= 30;
  if (d.ust_satz === 0) {
    s.y -= 4;
    s.absatz(t.keineUst, { font: f.kursiv, size: 8.5, color: FARBE.text2, zeile: 13 });
  }

  // Bedingungen
  s.y -= 22;
  s.platz(80);
  s.absatz(t.bedingungen, { font: f.fett, size: 11, zeile: 18 });
  const bed = [t.gueltig(pdfDatum(d.gueltig_bis, L)), t.zahlung];
  if (mitAgb) bed.push(t.agbHinweis);
  for (const b of bed) s.absatz(b, { size: 9.5, zeile: 14.5 });
  s.y -= 10;
  s.absatz(t.gruss, { size: 10, zeile: 15 });

  // Unterschrift, immer zusammen auf einer Seite
  s.y -= 24;
  s.platz(140);
  s.seite.drawRectangle({
    x: RAND,
    y: s.y - 128,
    width: BREITE,
    height: 128,
    borderColor: FARBE.linie,
    borderWidth: 0.8,
    color: rgb(250 / 255, 251 / 255, 250 / 255),
  });
  const innen = RAND + 16;
  s.text(t.annahme, innen, s.y - 24, { font: f.fett, size: 11 });
  const yLinie = s.y - 74;
  const halb = (BREITE - 48) / 2;
  s.linie(yLinie, FARBE.text, 0.6, innen, halb);
  s.linie(yLinie, FARBE.text, 0.6, innen + halb + 16, halb);
  s.text(t.ortDatum, innen, yLinie - 12, { size: 8, color: FARBE.text2 });
  s.text(t.unterschrift, innen + halb + 16, yLinie - 12, { size: 8, color: FARBE.text2 });
  s.text(t.hochladen, innen, s.y - 112, { size: 8.5, color: FARBE.text2 });
  s.text(t.kundenbereich, innen + f.normal.widthOfTextAtSize(t.hochladen, 8.5) + 4, s.y - 112, {
    font: f.fett,
    size: 8.5,
    color: FARBE.primary,
  });
  s.y -= 128;
}

function agbSetzen(pdf: PDFDocument, f: Schriften, t: PdfTexte, entwurf: boolean, seiten: PDFPage[]) {
  const kopf = (seite: PDFPage) => {
    const oben = A4[1] - RAND;
    logo(seite, RAND, oben + 2, 120);
    seite.drawText(t.agbTitel, {
      x: RAND + BREITE - f.normal.widthOfTextAtSize(t.agbTitel, 8.5),
      y: oben - 8,
      font: f.normal,
      size: 8.5,
      color: FARBE.text2,
    });
    let y = oben - 30;
    if (entwurf) {
      seite.drawRectangle({ x: RAND, y: y - 22, width: BREITE, height: 22, color: FARBE.hell });
      seite.drawText(t.agbEntwurf, { x: RAND + 10, y: y - 14.5, font: f.fett, size: 9, color: FARBE.primary });
      y -= 40;
    }
    return y;
  };
  const s = new Satz(pdf, f, (seite) => kopf(seite));
  s.seiten.forEach((p) => seiten.push(p));
  const neueSeite = s.neueSeite.bind(s);
  s.neueSeite = () => {
    neueSeite();
    seiten.push(s.seite);
  };
  s.y -= 10;
  s.absatz(AGB.titel, { font: f.fett, size: 18, zeile: 24 });
  s.absatz(AGB.stand, { size: 8.5, color: FARBE.text2, zeile: 14 });
  s.y -= 8;
  for (const a of AGB.abschnitte) {
    s.y -= 8;
    s.platz(50);
    s.absatz(a.titel, { font: f.fett, size: 9.5, zeile: 15 });
    for (const p of a.absaetze) {
      s.absatz(p, { size: 8.5, zeile: 12.5 });
      s.y -= 4;
    }
  }
}
