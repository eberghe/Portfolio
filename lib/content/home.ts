import type { Locale } from '@/lib/i18n';
import { projects } from '@/lib/content/projects';

// Texte der Startseite, siehe functions/seiten/startseite.md
export const homeContent = {
  de: {
    metaTitle: 'Erik Bergheimer: UX/UI-Design & Webentwicklung aus Augsburg',
    metaDescription:
      'UX/UI-Design, Webdesign & Webentwicklung, Barrierefreiheit und KI-Beratung aus Augsburg, vor Ort oder remote. Kostenloses Erstgespräch.',
    // Typografischer Hero (functions/seiten/startseite.md AK-43 bis AK-46, Wörter AK-70)
    hero: {
      lines: ['Hey, ich bin', 'Erik', 'Design', 'Engineer'],
      note: 'Mit Herz für Fußball, Bergsport & Kochen',
      text: 'Ich bin aus Augsburg und mag Design, das bei den Menschen anfängt. Gerade bin ich',
      accent: 'Business Development Manager bei HERO Software',
      after:
        ' und gestalte die HEROCON mit. Für private Projekte bin ich trotzdem offen. Wenn ich nicht arbeite, dreht sich viel um Fußball, Bergsport und Kochen.',
    },
    companiesTitle: 'Unternehmen, für die ich gearbeitet habe',
    current: 'Aktuell',
    newTab: '(öffnet in neuem Tab)',
    // Inhalte der Firmen-Fenster von Erik (functions/seiten/startseite.md AK-76, AK-79)
    companies: [
      {
        name: 'HERO Software',
        url: 'https://hero-software.de/',
        role: 'Business Development Manager',
        current: true,
        period: 'Seit September 2025',
        summary:
          'Als Business Development Manager gestalte ich die digitale Weiterentwicklung und das Erlebnis rund um die HEROCON, das Event von HERO Software. Dabei verbinde ich Strategie mit operativer Umsetzung und sorge dafür, dass digitale Strukturen, Prozesse und Plattformen ineinandergreifen. Mein Ziel: digitale Lösungen, die funktionieren, Orientierung geben und die HEROCON nachhaltig weiterentwickeln.',
        duties: [
          'Betreuung, Design und Weiterentwicklung der HEROCON-Website',
          'Ausbau der Event-App und des Merchshops',
          'Technische Umsetzung des Conkret Podcasts im Hintergrund',
          'Neue Strukturen und Prozesse, Projektsetup in Notion',
          'Interne Wissensplattformen wie Speaker- und Partner-Wikis',
          'Aufbau und Pflege des CRM, Entwicklung der digitalen HEROCON-Kanäle',
          'Customer Experience über alle HEROCON-Touchpoints, verknüpfte Plattformen für effizienten Datenaustausch',
          'Automatisierung von Prozessen mit KI und Automation',
        ],
      },
      {
        name: 'TEAM23',
        url: 'https://www.team23.de/',
        role: 'UX/UI-Designer',
        period: '2021 bis 2025',
        summary:
          'Als UX/UI-Designer gestaltete und entwickelte ich digitale Erlebnisse, von Websites in Webflow bis zu Design-Systemen in Figma. Vier Jahre in Augsburg, vom Pflichtpraktikum über den Werkstudenten bis zur Vollzeitstelle, inklusive einer Workation in Indonesien. Mein Anspruch war, gutes Design mit verlässlicher Projektarbeit und klaren Strukturen zu verbinden.',
        duties: [
          'Websites in Webflow und Arbeit mit Design-Systemen in Figma',
          'Kundenbetreuung und Projektkoordination, von der Abstimmung bis zum fertigen Ergebnis',
          'Mentoring neuer Mitarbeitender beim Einstieg ins Team',
          'Neue Forecasting- und Controlling-Prozesse',
          'Teaminterne Tools und Softwarelizenzen',
        ],
      },
      {
        name: 'Amazon',
        url: 'https://www.amazon.de/',
        role: 'Job vor dem Studium',
        period: 'April bis September 2019',
        summary:
          'Nach meiner Rückkehr aus Neuseeland arbeitete ich als Versandmitarbeiter, um vor dem Studium Geld zu sparen.',
        duties: ['Produkte im Lager einlagern', 'Produkte für Bestellungen picken', 'Pakete packen'],
      },
      {
        name: 'IKEA',
        url: 'https://www.ikea.com/de/de/',
        role: 'Job vor dem Studium',
        period: 'Juli bis September 2018',
        summary: 'Nach dem Abitur arbeitete ich im Kundenservice, um für mein Work & Travel in Neuseeland zu sparen.',
        duties: ['Kundenservice und Fragen im Infocenter', 'Betreuung im Småland', 'Bestellungen zusammenstellen'],
      },
    ],
    companyRole: 'Rolle',
    companyPeriod: 'Zeitraum',
    companyDuties: 'Aufgaben',
    companyWebsite: (name: string) => `Website von ${name}`,
    close: 'Schließen',
    contact: 'Kostenloses Erstgespräch',
    stats: [
      { value: '6+', label: 'Jahre UX Erfahrung' },
      { value: String(projects.length), label: 'Projekte im Portfolio' },
      { value: 'Deutschland', label: 'Vor Ort & remote' },
      { value: 'Augsburg', label: 'Aktueller Standort', small: true },
    ],
    offer: 'Was ich anbiete',
    process: 'So arbeiten wir zusammen',
    processEyebrow: 'Ablauf',
    processProjects: 'Projekte ansehen',
    processSteps: [
      { title: 'Kennenlernen', text: 'Kostenloses Erstgespräch: Wo stehst du, wo willst du hin?' },
      { title: 'Analyse & Angebot', text: 'Ich schaue mir deine Website und Abläufe an und mache ein klares Angebot.' },
      { title: 'Umsetzung', text: 'Konzept, Design und Entwicklung mit regelmäßigen Zwischenständen.' },
      {
        title: 'Launch & Betreuung',
        text: 'Test inklusive Barrierefreiheit, Launch und auf Wunsch laufende Optimierung.',
      },
    ],
    projects: 'Ein Auszug meiner Projekte.',
    references: 'Referenzen',
    viewAll: 'Alle Projekte ansehen',
    offerIntro:
      'Sieben Leistungen, ein Ansprechpartner: von der ersten Nutzerforschung über das Design bis zur barrierefreien Website.',
    learnMore: 'Mehr erfahren',
    offerEyebrow: 'Leistungen',
    offerNav: 'Leistungen auf dieser Seite',
    serviceMore: (title: string) => `Mehr zu ${title}`,
    toProject: 'Zum Projekt',
    aboutTitle: 'Über mich',
    // TODO(Erik): persönliche Notiz prüfen oder ersetzen (Issue #14)
    aboutText: [
      'Ich bin Erik, UX/UI-Designer und Webentwickler aus Augsburg. Ich arbeite direkt mit dir, ohne Agentur-Umwege: Du sprichst mit der Person, die auch gestaltet und baut.',
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
    metaTitle: 'Erik Bergheimer: UX/UI design & web development, Augsburg',
    metaDescription:
      'UX/UI design, web design & development, accessibility and AI consulting from Augsburg, on site or remote. Book a free intro call.',
    hero: {
      lines: ["Hey, I'm", 'Erik', 'Design', 'Engineer'],
      note: 'Passionate about football, mountain sports & cooking',
      text: "I'm from Augsburg and like design that starts with people. Right now I'm",
      accent: 'Business Development Manager at HERO Software',
      after:
        ", helping shape HEROCON. I'm still open to private projects. When I'm not working, it's mostly football, mountain sports and cooking.",
    },
    companiesTitle: "Companies I've worked for",
    current: 'Current',
    newTab: '(opens in a new tab)',
    companies: [
      {
        name: 'HERO Software',
        url: 'https://hero-software.de/',
        role: 'Business Development Manager',
        current: true,
        period: 'Since September 2025',
        summary:
          "As Business Development Manager I shape the digital development and the experience around HEROCON, HERO Software's event. I combine strategy with hands-on delivery and make sure digital structures, processes and platforms work together. My goal: digital solutions that work, give orientation and keep HEROCON growing.",
        duties: [
          'Running, designing and developing the HEROCON website',
          'Expanding the event app and the merch shop',
          'Technical production of the Conkret podcast behind the scenes',
          'New structures and processes, project setup in Notion',
          'Internal knowledge platforms such as speaker and partner wikis',
          'Building and maintaining the CRM, developing the digital HEROCON channels',
          'Customer experience across all HEROCON touchpoints, connected platforms for efficient data exchange',
          'Automating processes with AI and automation',
        ],
      },
      {
        name: 'TEAM23',
        url: 'https://www.team23.de/',
        role: 'UX/UI designer',
        period: '2021 to 2025',
        summary:
          'As a UX/UI designer I designed and built digital experiences, from Webflow websites to design systems in Figma. Four years in Augsburg, from mandatory internship and working student to a full-time role, including a workation in Indonesia. My aim was to combine good design with reliable project work and clear structures.',
        duties: [
          'Webflow websites and work with design systems in Figma',
          'Client care and project coordination, from alignment to the finished result',
          'Mentoring new colleagues as they joined the team',
          'New forecasting and controlling processes',
          'Internal team tools and software licences',
        ],
      },
      {
        name: 'Amazon',
        url: 'https://www.amazon.de/',
        role: 'Job before university',
        period: 'April to September 2019',
        summary: 'After coming back from New Zealand I worked in shipping to save money before university.',
        duties: ['Stowing products in the warehouse', 'Picking products for orders', 'Packing parcels'],
      },
      {
        name: 'IKEA',
        url: 'https://www.ikea.com/de/de/',
        role: 'Job before university',
        period: 'July to September 2018',
        summary: 'After high school I worked in customer service to save up for my Work & Travel in New Zealand.',
        duties: [
          'Customer service and questions at the info desk',
          'Looking after children in Småland',
          'Putting orders together',
        ],
      },
    ],
    companyRole: 'Role',
    companyPeriod: 'Period',
    companyDuties: 'What I did',
    companyWebsite: (name: string) => `${name} website`,
    close: 'Close',
    contact: 'Free intro call',
    stats: [
      { value: '6+', label: 'Years UX experience' },
      { value: String(projects.length), label: 'Projects in portfolio' },
      { value: 'Germany', label: 'On site & remote' },
      { value: 'Augsburg', label: 'Current location', small: true },
    ],
    offer: 'What I offer',
    process: 'How we work together',
    processEyebrow: 'Process',
    processProjects: 'View projects',
    processSteps: [
      { title: 'Intro call', text: 'Free first call: where are you now, where do you want to go?' },
      { title: 'Analysis & offer', text: 'I review your website and workflows and send you a clear offer.' },
      { title: 'Build', text: 'Concept, design and development with regular check-ins.' },
      { title: 'Launch & care', text: 'Testing including accessibility, launch and ongoing optimisation if you like.' },
    ],
    projects: 'A selection of my projects.',
    references: 'References',
    viewAll: 'View all projects',
    offerIntro: 'Seven services, one point of contact: from first user research and design to an accessible website.',
    learnMore: 'Learn more',
    offerEyebrow: 'Services',
    offerNav: 'Services on this page',
    serviceMore: (title: string) => `More on ${title}`,
    toProject: 'View project',
    aboutTitle: 'About me',
    // TODO(Erik): review or replace the personal note (issue #14)
    aboutText: [
      "I'm Erik, a UX/UI designer and web developer based in Augsburg. You work with me directly, no agency layers: the person you talk to is the person who designs and builds.",
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
    id: 'prematch',
    image: { src: '/images/project-prematch.jpg', width: 1920, height: 1080 },
    color: '#d0d8e8',
    de: {
      title: 'PreMatch',
      type: 'UX/UI · App-Design · Masterarbeit',
      desc: 'Eine Tipp-App für Fußball, die vor dem Speichern kurz zum Nachdenken einlädt.',
    },
    en: {
      title: 'PreMatch',
      type: "UX/UI · App design · Master's thesis",
      desc: 'A football prediction app that asks for a moment of reflection before saving.',
    },
  },
  {
    id: 'sightkick',
    image: { src: '/images/project-sightkick.jpg', width: 1920, height: 977 },
    color: '#c8ddf0',
    de: {
      title: "SIGHT'KICK",
      type: 'UX/UI · Gamification · Masterprojekt',
      desc: 'Eine spielerische App, die Sightseeing in Innsbruck komplett neu denkt.',
    },
    en: {
      title: "SIGHT'KICK",
      type: "UX/UI · Gamification · Master's project",
      desc: 'Gamified city exploration app for Innsbruck, classic sightseeing reimagined.',
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

/**
 * Medien-Plätze im Hero (startseite.md AK-44, AK-58), dekorativ. Fotos von Erik, ohne Metadaten auf 480 px verkleinert.
 * `position` ist der Bildausschnitt (object-position), damit das Gesicht im Ausschnitt bleibt.
 */
export const heroMedia: { src?: string; width?: number; height?: number; position?: string }[] = [
  { src: '/images/hero-cap.jpg', width: 480, height: 720, position: '50% 28%' },
  { src: '/images/hero-wandern.jpg', width: 480, height: 720, position: '50% 22%' },
  { src: '/images/hero-berg.jpg', width: 480, height: 853, position: '50% 34%' },
];
