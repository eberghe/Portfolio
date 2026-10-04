import type { Locale } from '@/lib/i18n';

// Texte der Startseite, siehe functions/seiten/startseite.md
export const homeContent = {
  de: {
    metaTitle: 'Erik Bergheimer: UX/UI-Design & Webflow aus Augsburg',
    metaDescription:
      'Freelancer in Augsburg & Innsbruck: UX/UI-Design, Webflow-Websites, Barrierefreiheit und KI-Beratung, vor Ort oder remote. Kostenloses Erstgespräch.',
    available: 'Verfügbar für Projekte',
    greeting: 'Hi, ich bin ',
    role: 'UX/UI Designer & Webflow Expert',
    intro:
      'Freiberuflicher UX/UI-Designer und Webflow-Entwickler aus Augsburg & Innsbruck, für Kunden in Deutschland, Österreich und remote. Ich gestalte digitale Erlebnisse, die sinnvoll sind, gut aussehen und sich menschlich anfühlen.',
    contact: 'Kostenloses Erstgespräch',
    viewProjects: 'Projekte ansehen',
    heroAlt: 'Erik Bergheimer, UX/UI Designer und Webflow-Experte, im Porträt',
    stats: [
      { value: '6+', label: 'Jahre UX Erfahrung' },
      { value: '5', label: 'Projekte im Portfolio' },
      { value: 'DE · AT', label: 'Vor Ort & remote' },
      { value: 'Augsburg & Innsbruck', label: 'Aktueller Standort', small: true },
    ],
    offer: 'Was ich anbiete',
    process: 'So arbeiten wir zusammen',
    processSteps: [
      { title: 'Kennenlernen', text: 'Kostenloses Erstgespräch: Wo stehst du, wo willst du hin?' },
      { title: 'Analyse & Angebot', text: 'Ich schaue mir deine Website und Abläufe an und mache ein klares Angebot.' },
      { title: 'Umsetzung', text: 'Konzept, Design und Entwicklung mit regelmäßigen Zwischenständen.' },
      {
        title: 'Launch & Betreuung',
        text: 'Test inklusive Barrierefreiheit, Launch und auf Wunsch laufende Optimierung.',
      },
    ],
    projects: 'Ausgewählte Projekte',
    viewAll: 'Alle Projekte ansehen',
  },
  en: {
    metaTitle: 'Erik Bergheimer: UX/UI design & Webflow, Augsburg',
    metaDescription:
      'Freelancer in Augsburg & Innsbruck: UX/UI design, Webflow websites, accessibility and AI consulting, on site or remote. Book a free intro call.',
    available: 'Available for projects',
    greeting: "Hi, I'm ",
    role: 'UX/UI Designer & Webflow Expert',
    intro:
      'Freelance UX/UI designer and Webflow developer based in Augsburg & Innsbruck, working with clients in Germany, Austria and remotely. I create digital experiences that are meaningful, look great, and feel human.',
    contact: 'Free intro call',
    viewProjects: 'View projects',
    heroAlt: 'Portrait of Erik Bergheimer, UX/UI designer and Webflow expert',
    stats: [
      { value: '6+', label: 'Years UX experience' },
      { value: '5', label: 'Projects in portfolio' },
      { value: 'DE · AT', label: 'On site & remote' },
      { value: 'Augsburg & Innsbruck', label: 'Current location', small: true },
    ],
    offer: 'What I offer',
    process: 'How we work together',
    processSteps: [
      { title: 'Intro call', text: 'Free first call: where are you now, where do you want to go?' },
      { title: 'Analysis & offer', text: 'I review your website and workflows and send you a clear offer.' },
      { title: 'Build', text: 'Concept, design and development with regular check-ins.' },
      { title: 'Launch & care', text: 'Testing including accessibility, launch and ongoing optimisation if you like.' },
    ],
    projects: 'Selected projects',
    viewAll: 'View all projects',
  },
} satisfies Record<Locale, unknown>;

export const featuredProjects = [
  {
    id: 'sightkick',
    image: { src: '/images/project-sightkick.jpg', width: 1920, height: 977 },
    color: '#c8ddf0',
    de: {
      title: "SIGHT'KICK",
      type: 'UX/UI · Gamification · Masterarbeit',
      desc: 'Eine spielerische App, die Sightseeing in Innsbruck komplett neu denkt.',
    },
    en: {
      title: "SIGHT'KICK",
      type: "UX/UI · Gamification · Master's thesis",
      desc: 'Gamified city exploration app for Innsbruck, classic sightseeing reimagined.',
    },
  },
  {
    id: 'cpr',
    image: { src: '/images/project-cpr.jpg', width: 1920, height: 977 },
    color: '#cde8e0',
    de: { title: 'CPR App', type: 'UX/UI · App-Design', desc: 'Wie Kinder spielerisch lernen, Leben zu retten.' },
    en: {
      title: 'CPR App',
      type: 'UX/UI · App Design',
      desc: 'Children learn life-saving CPR techniques through play.',
    },
  },
  {
    id: 'indonesia',
    image: { src: '/images/project-indonesia.jpg', width: 1824, height: 1368 },
    color: '#e8d8c0',
    de: {
      title: 'Indonesien',
      type: 'Fotografie · Reise',
      desc: 'Indonesien durch mein Objektiv: Kultur, Menschen, Landschaft.',
    },
    en: { title: 'Indonesia', type: 'Photography · Travel', desc: 'Culture & landscape of Indonesia through my lens.' },
  },
  {
    id: 'webflow',
    image: { src: '/images/project-webflow.jpg', width: 1728, height: 1117 },
    color: '#c8d8f0',
    de: {
      title: 'Webflow vs. Shopify',
      type: 'Web · No-Code · Bachelorarbeit',
      desc: 'Können No-Code-Tools wirklich professionelle Shops liefern?',
    },
    en: {
      title: 'Webflow vs. Shopify',
      type: "Web · No-Code · Bachelor's thesis",
      desc: 'Can no-code tools deliver professional shops?',
    },
  },
];
