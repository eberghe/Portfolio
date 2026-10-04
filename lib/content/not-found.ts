import type { Locale } from '@/lib/i18n';

// Texte der 404-Seite, siehe functions/seiten/nicht-gefunden.md
export const notFoundText: Record<
  Locale,
  { metaTitle: string; title: string; text: string; short: string; links: [string, string][]; homeLink: string }
> = {
  de: {
    metaTitle: 'Seite nicht gefunden | Erik Bergheimer',
    title: 'Seite nicht gefunden',
    text: 'Diese Adresse gibt es nicht (mehr). Vielleicht hilft dir einer dieser Wege weiter:',
    short: 'Diese Adresse gibt es nicht (mehr).',
    links: [
      ['/', 'Zur Startseite'],
      ['/services', 'Alle Leistungen'],
      ['/projects', 'Alle Projekte'],
      ['/contact', 'Kontakt aufnehmen'],
    ],
    homeLink: 'Zur deutschen Startseite',
  },
  en: {
    metaTitle: 'Page not found | Erik Bergheimer',
    title: 'Page not found',
    text: 'This address does not exist (anymore). One of these may help you on your way:',
    short: 'This address does not exist (anymore).',
    links: [
      ['/', 'Go to the homepage'],
      ['/services', 'All services'],
      ['/projects', 'All projects'],
      ['/contact', 'Get in touch'],
    ],
    homeLink: 'Go to the English homepage',
  },
};
