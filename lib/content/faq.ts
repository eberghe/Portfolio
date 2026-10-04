import type { Locale } from '@/lib/i18n';

// FAQ, siehe functions/seiten/faq.md. Fragen aus dem Lovable-Projekt, Antworten an die aktuellen Leistungen angepasst.
// Später aus Supabase (functions/seo/fragen-antworten.md).
export interface Faq extends Record<Locale, { q: string; a: string }> {
  id: string;
}

export const faqs: Faq[] = [
  {
    id: 'leistungen',
    de: {
      q: 'Welche Leistungen bietest du an?',
      a: 'UX/UI-Design, Webflow-Entwicklung, Barrierefreiheit-Beratung (WCAG und BFSG), KI-Beratung, Website- & Prozessoptimierung, Brand- & Logo-Design, Design Systems und Fotografie. Alle Details findest du unter Leistungen.',
    },
    en: {
      q: 'What services do you offer?',
      a: 'UX/UI design, Webflow development, accessibility consulting (WCAG and the European Accessibility Act), AI consulting, website & process optimisation, brand & logo design, design systems and photography. You will find all details under Services.',
    },
  },
  {
    id: 'remote',
    de: {
      q: 'Arbeitest du auch remote?',
      a: 'Klar, ich bin komplett remote-fähig, das hat sogar von Bali aus super funktioniert. Termine vor Ort sind in und um Augsburg und Innsbruck genauso möglich.',
    },
    en: {
      q: 'Do you work remotely?',
      a: 'Yes, I am fully remote-capable; it even worked well from Bali. On-site meetings in and around Augsburg and Innsbruck are just as possible.',
    },
  },
  {
    id: 'ablauf',
    de: {
      q: 'Wie läuft ein Projekt bei dir ab?',
      a: 'Erstmal lernen wir uns in einem kostenlosen Erstgespräch kennen, dann gibt es ein Briefing. Danach geht es iterativ weiter: Design, Review, Feedback, bis alles sitzt. Am Ende übergebe ich sauber alle Dateien.',
    },
    en: {
      q: 'How does a project typically run?',
      a: 'We start with a free intro call to get to know each other, followed by a briefing. Then we work iteratively: design, review and feedback until everything fits. At the end I hand over all files neatly.',
    },
  },
  {
    id: 'tools',
    de: {
      q: 'Welche Tools nutzt du?',
      a: 'Figma, Webflow, Adobe Lightroom, Capture One, Notion sowie KI-Werkzeuge wie Claude und Gemini.',
    },
    en: {
      q: 'What tools do you use?',
      a: 'Figma, Webflow, Adobe Lightroom, Capture One, Notion and AI tools such as Claude and Gemini.',
    },
  },
  {
    id: 'dauer',
    de: {
      q: 'Wie lange dauert ein typisches Projekt?',
      a: 'Eine Landingpage schaffe ich in 1 bis 2 Wochen. Für ein komplettes UX-Projekt solltest du 4 bis 8 Wochen einplanen. Ich bin von Anfang an offen, was den Zeitplan angeht.',
    },
    en: {
      q: 'How long does a project take?',
      a: 'A landing page takes 1 to 2 weeks. For a complete UX project, plan 4 to 8 weeks. I am transparent about timelines from day one.',
    },
  },
  {
    id: 'verfuegbar',
    de: {
      q: 'Bist du gerade verfügbar?',
      a: 'Ja! Schreib mir einfach, ich melde mich in der Regel innerhalb von 24 Stunden.',
    },
    en: { q: 'Are you currently available?', a: 'Yes! Reach out, I usually respond within 24 hours.' },
  },
];
