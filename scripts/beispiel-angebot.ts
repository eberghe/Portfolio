// Beispiel-Angebot mit erfundenen Positionen und dem AGB-Entwurf (functions/kundenbereich/angebot-pdf.md Verhalten 13).
// Aufruf: npx tsx scripts/beispiel-angebot.ts [ziel.pdf] [de|en]
import { writeFileSync } from 'node:fs';
import { angebotPdf } from '@/lib/kundenbereich/angebot/pdf';

const ziel = process.argv[2] ?? 'beispiel-angebot.pdf';
const sprache = process.argv[3] === 'en' ? 'en' : 'de';
const de = sprache === 'de';

const bytes = await angebotPdf(
  {
    nummer: '2026-001',
    titel: de ? 'Relaunch der Website mit Webflow' : 'Website relaunch with Webflow',
    projekt: de ? 'Website-Relaunch' : 'Website relaunch',
    sprache,
    datum: '2026-10-13',
    gueltig_bis: '2026-11-12',
    empfaenger: 'Beispiel GmbH\nMax Mustermann\nMusterstraße 1\n86150 Augsburg',
    einleitung: '',
    positionen: [
      {
        bezeichnung: de ? 'Workshop und Konzept' : 'Workshop and concept',
        beschreibung: de
          ? 'Ziele, Zielgruppen und Inhalte gemeinsam klären, Sitemap und Wireframes der wichtigsten Seiten'
          : 'Goals, audiences and content, sitemap and wireframes of the key pages',
        menge: 1,
        einheit: de ? 'pauschal' : 'flat',
        einzelpreis_cent: 120000,
      },
      {
        bezeichnung: 'UX/UI-Design',
        beschreibung: de
          ? 'Design in Figma für Desktop und Handy, kleines Design System mit Farben, Schrift und Komponenten, zwei Korrekturschleifen'
          : 'Figma design for desktop and mobile, small design system, two rounds of revisions',
        menge: 28,
        einheit: de ? 'Std.' : 'hrs',
        einzelpreis_cent: 9500,
      },
      {
        bezeichnung: de ? 'Webflow-Entwicklung' : 'Webflow development',
        beschreibung: de
          ? 'Umsetzung aller Seiten, CMS für Projekte und Blog, Animationen, barrierefrei nach WCAG 2.2 AA'
          : 'All pages, CMS for projects and blog, animations, accessible to WCAG 2.2 AA',
        menge: 36,
        einheit: de ? 'Std.' : 'hrs',
        einzelpreis_cent: 9500,
      },
      {
        bezeichnung: de ? 'SEO-Grundlagen und Livegang' : 'SEO basics and launch',
        beschreibung: de
          ? 'Meta-Daten, strukturierte Daten, Weiterleitungen, Domain verbinden, Einweisung ins CMS'
          : 'Meta data, structured data, redirects, domain, CMS training',
        menge: 1,
        einheit: de ? 'pauschal' : 'flat',
        einzelpreis_cent: 60000,
      },
    ],
    ust_satz: 19,
  },
  { agb: de ? 'entwurf' : false },
);
writeFileSync(ziel, bytes);
console.log(`${ziel}: ${bytes.length} Bytes`);
