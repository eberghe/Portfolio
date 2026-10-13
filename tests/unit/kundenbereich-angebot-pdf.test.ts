// @vitest-environment node
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { PDFDocument, PDFName, PDFDict } from 'pdf-lib';
import { angebotPdf, type AngebotPdfDaten } from '@/lib/kundenbereich/angebot/pdf';
import { AGB } from '@/lib/kundenbereich/angebot/agb';

// functions/kundenbereich/angebot-pdf.md AK-1 bis AK-7

const daten = (extra: Partial<AngebotPdfDaten> = {}): AngebotPdfDaten => ({
  nummer: '2026-002',
  titel: 'Relaunch der Website',
  projekt: 'Relaunch',
  sprache: 'de',
  datum: '2026-10-13',
  gueltig_bis: '2026-11-12',
  empfaenger: 'Bäckerei Huber GmbH\nAnna Huber\nHauptstraße 1\n86150 Augsburg',
  einleitung: 'Danke für das gute Gespräch. Hier ist mein Angebot.',
  positionen: [
    {
      bezeichnung: 'Konzept und Design',
      beschreibung: 'Sitemap, Wireframes, Design in Figma',
      menge: 1,
      einheit: 'pauschal',
      einzelpreis_cent: 240000,
    },
    { bezeichnung: 'Webflow-Entwicklung', beschreibung: '', menge: 24.5, einheit: 'Std.', einzelpreis_cent: 9500 },
  ],
  ust_satz: 19,
  ...extra,
});

async function text(bytes: Uint8Array) {
  const doc = await getDocument({ data: bytes.slice(), useSystemFonts: false, isEvalSupported: false }).promise;
  const seiten: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const c = await (await doc.getPage(i)).getTextContent();
    seiten.push(c.items.map((x) => ('str' in x ? x.str : '')).join(' '));
  }
  return { seiten, alles: seiten.join('\n') };
}

describe('Angebot als PDF', () => {
  it('AK-1: gültiges PDF mit Titel, Autor und Sprache', async () => {
    const bytes = await angebotPdf(daten());
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe('%PDF-');
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getTitle()).toBe('Angebot 2026-002');
    expect(pdf.getAuthor()).toBe('Erik Bergheimer');
    expect(String(pdf.catalog.get(PDFName.of('Lang')))).toContain('de-DE');
    const en = await PDFDocument.load(await angebotPdf(daten({ sprache: 'en' })));
    expect(en.getTitle()).toBe('Quote 2026-002');
    expect(String(en.catalog.get(PDFName.of('Lang')))).toContain('en-GB');
  });

  it('AK-2: Absender, Nummer, Daten, Positionen und Summen im Format der Sprache', async () => {
    const { alles } = await text(await angebotPdf(daten()));
    for (const s of [
      'Weißdornstraße 5',
      '86343 Königsbrunn',
      'erb1209@outlook.de',
      'Angebot 2026-002',
      '13.10.2026',
      '12.11.2026',
      'Bäckerei Huber GmbH',
      'Konzept und Design',
      'Sitemap, Wireframes, Design in Figma',
      'Webflow-Entwicklung',
      '24,5 Std.',
      '95,00 €',
      '2.327,50 €',
      '4.727,50 €',
      '898,23 €',
      '5.625,73 €',
    ])
      expect(alles, s).toContain(s);
    const en = (await text(await angebotPdf(daten({ sprache: 'en' })))).alles;
    for (const s of ['Quote 2026-002', '13 Oct 2026', '€4,727.50', '€5,625.73', '24.5 Std.'])
      expect(en, s).toContain(s);
  });

  it('AK-3: ohne Umsatzsteuer der Hinweis auf § 19 UStG', async () => {
    const { alles } = await text(await angebotPdf(daten({ ust_satz: 0 })));
    expect(alles).toContain('Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.');
    expect(alles).not.toContain('Umsatzsteuer 19 %');
    expect(alles).toContain('4.727,50 €');
  });

  it('AK-4: nur Mona Sans ist eingebettet', async () => {
    const pdf = await PDFDocument.load(await angebotPdf(daten()));
    const namen = new Set<string>();
    for (const page of pdf.getPages()) {
      const fonts = page.node.Resources()?.lookup(PDFName.of('Font'), PDFDict);
      fonts?.entries().forEach(([, ref]) => {
        const f = pdf.context.lookup(ref, PDFDict);
        namen.add(String(f.get(PDFName.of('BaseFont'))));
      });
    }
    expect(namen.size).toBeGreaterThan(0);
    for (const n of namen) expect(n).toMatch(/MonaSans/);
  });

  it('AK-5: lange Angebote gehen über mehrere Seiten mit Seitenzahl', async () => {
    const positionen = Array.from({ length: 30 }, (_, i) => ({
      bezeichnung: `Leistung ${i + 1}`,
      beschreibung: 'Eine längere Beschreibung, die über mehr als eine Zeile laufen kann, damit die Tabelle wächst.',
      menge: 1,
      einheit: 'pauschal',
      einzelpreis_cent: 10000,
    }));
    const { seiten } = await text(await angebotPdf(daten({ positionen })));
    expect(seiten.length).toBeGreaterThan(1);
    seiten.forEach((s, i) => expect(s).toContain(`Seite ${i + 1} von ${seiten.length}`));
    expect(seiten.join(' ')).toContain('Leistung 30');
  });

  it('AK-6: AGB nur, wenn angehängt; das Beispiel zeigt sie als Entwurf', async () => {
    const ohne = (await text(await angebotPdf(daten()))).alles;
    expect(ohne).not.toContain('Allgemeine Geschäftsbedingungen');
    expect(ohne).not.toMatch(/\bAGB\b/);
    const mit = (await text(await angebotPdf(daten(), { agb: 'entwurf' }))).alles;
    expect(mit).toContain('Allgemeine Geschäftsbedingungen');
    expect(mit).toContain('Entwurf, nicht rechtlich geprüft');
    expect(mit).toContain(AGB.abschnitte[0]!.titel);
  });

  it('AK-7: nirgends „freiberuflich“', async () => {
    const mit = (await text(await angebotPdf(daten(), { agb: 'entwurf' }))).alles;
    expect(mit.toLowerCase()).not.toContain('freiberuf');
    expect(JSON.stringify(AGB).toLowerCase()).not.toContain('freiberuf');
  });
});
