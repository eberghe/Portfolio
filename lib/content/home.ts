import type { Locale } from '@/lib/i18n';
import { projects } from '@/lib/content/projects';

// Texte der Startseite, siehe functions/seiten/startseite.md
export const homeContent = {
  de: {
    metaTitle: 'Erik Bergheimer: UX/UI-Design & Webflow aus Augsburg',
    metaDescription:
      'Freelancer in Augsburg: UX/UI-Design, Webflow-Websites, Barrierefreiheit und KI-Beratung, vor Ort oder remote. Kostenloses Erstgespräch.',
    available: 'Verfügbar für Projekte',
    greeting: ['Hey,', 'ich', 'bin', 'Erik'],
    companiesTitle: 'Unternehmen, für die ich gearbeitet habe',
    current: 'Aktuell',
    newTab: '(öffnet in neuem Tab)',
    clockLabel: 'Ortszeit in Königsbrunn',
    companies: [
      {
        name: 'HERO Software',
        url: 'https://hero-software.de/',
        role: 'Business Development Manager',
        current: true,
      },
      { name: 'TEAM23', url: 'https://www.team23.de/', role: 'UX/UI-Designer' },
      { name: 'Amazon', url: 'https://www.amazon.de/', role: 'Job vor dem Studium' },
      { name: 'IKEA', url: 'https://www.ikea.com/de/de/', role: 'Job vor dem Studium' },
    ],
    role: 'UX/UI Designer & Webflow Expert',
    intro:
      'Freiberuflicher UX/UI-Designer und Webflow-Entwickler aus Augsburg, für Kunden in Deutschland und remote. Ich gestalte digitale Erlebnisse, die sinnvoll sind, gut aussehen und sich menschlich anfühlen.',
    contact: 'Kostenloses Erstgespräch',
    viewProjects: 'Projekte ansehen',
    heroAlt: 'Erik Bergheimer, UX/UI Designer und Webflow-Experte, im Porträt',
    stats: [
      { value: '6+', label: 'Jahre UX Erfahrung' },
      { value: String(projects.length), label: 'Projekte im Portfolio' },
      { value: 'Deutschland', label: 'Vor Ort & remote' },
      { value: 'Augsburg', label: 'Aktueller Standort', small: true },
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
    offerIntro:
      'Acht Leistungen, ein Ansprechpartner: von der ersten Nutzerforschung über das Design bis zur barrierefreien Webflow-Website.',
    learnMore: 'Mehr erfahren',
    readCase: 'Fallstudie lesen',
    tags: 'Schlagworte',
    aboutTitle: 'Über mich',
    // TODO(Erik): persönliche Notiz prüfen oder ersetzen (Issue #14)
    aboutText: [
      'Ich bin Erik, freiberuflicher UX/UI-Designer und Webflow-Entwickler aus Augsburg. Ich arbeite direkt mit dir, ohne Agentur-Umwege: Du sprichst mit der Person, die auch gestaltet und baut.',
      'Mir ist wichtig, dass Websites für alle funktionieren. Deshalb denke ich Barrierefreiheit, Ladezeit und Auffindbarkeit von Anfang an mit, und setze KI dort ein, wo sie dir wirklich Arbeit abnimmt.',
    ],
    aboutMore: 'Mehr über mich',
    faqTitle: 'Häufige Fragen',
    faqAll: 'Alle FAQs',
    aboutPhotoAlt: 'Erik Bergheimer mit Sonnenbrille und schwarzem Hemd, lächelnd',
    ctaTitle: 'Erzähl mir, was du vorhast',
    ctaText:
      'Ob neue Website, Relaunch oder erst mal eine Idee: Im kostenlosen Erstgespräch klären wir, wo du stehst und wie ich helfen kann.',
    ctaMail: 'Oder schreib direkt an',
  },
  en: {
    metaTitle: 'Erik Bergheimer: UX/UI design & Webflow, Augsburg',
    metaDescription:
      'Freelancer in Augsburg: UX/UI design, Webflow websites, accessibility and AI consulting, on site or remote. Book a free intro call.',
    available: 'Available for projects',
    greeting: ['Hey,', "I'm", 'Erik'],
    companiesTitle: "Companies I've worked for",
    current: 'Current',
    newTab: '(opens in a new tab)',
    clockLabel: 'Local time in Königsbrunn',
    companies: [
      {
        name: 'HERO Software',
        url: 'https://hero-software.de/',
        role: 'Business Development Manager',
        current: true,
      },
      { name: 'TEAM23', url: 'https://www.team23.de/', role: 'UX/UI designer' },
      { name: 'Amazon', url: 'https://www.amazon.de/', role: 'Job before university' },
      { name: 'IKEA', url: 'https://www.ikea.com/de/de/', role: 'Job before university' },
    ],
    role: 'UX/UI Designer & Webflow Expert',
    intro:
      'Freelance UX/UI designer and Webflow developer based in Augsburg, working with clients in Germany and remotely. I create digital experiences that are meaningful, look great, and feel human.',
    contact: 'Free intro call',
    viewProjects: 'View projects',
    heroAlt: 'Portrait of Erik Bergheimer, UX/UI designer and Webflow expert',
    stats: [
      { value: '6+', label: 'Years UX experience' },
      { value: String(projects.length), label: 'Projects in portfolio' },
      { value: 'Germany', label: 'On site & remote' },
      { value: 'Augsburg', label: 'Current location', small: true },
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
    offerIntro:
      'Eight services, one point of contact: from first user research and design to an accessible Webflow website.',
    learnMore: 'Learn more',
    readCase: 'Read case study',
    tags: 'Tags',
    aboutTitle: 'About me',
    // TODO(Erik): review or replace the personal note (issue #14)
    aboutText: [
      "I'm Erik, a freelance UX/UI designer and Webflow developer based in Augsburg. You work with me directly, no agency layers: the person you talk to is the person who designs and builds.",
      'I care about websites that work for everyone. That is why accessibility, speed and findability are part of every project from day one, and why I use AI where it genuinely saves you work.',
    ],
    aboutMore: 'More about me',
    faqTitle: 'Frequently asked questions',
    faqAll: 'All FAQs',
    aboutPhotoAlt: 'Erik Bergheimer wearing sunglasses and a black shirt, smiling',
    ctaTitle: "Tell me what you're planning",
    ctaText:
      "New website, relaunch or just an idea: in a free intro call we'll work out where you are and how I can help.",
    ctaMail: 'Or email me at',
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
