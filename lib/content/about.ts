import type { Locale } from '@/lib/i18n';

// Über mich, siehe functions/seiten/ueber-mich.md. Texte aus dem Lovable-Projekt (AboutPage.tsx, tlData),
// englische Begriffe auf der deutschen Seite eingedeutscht, Alt-Texte neu.
export interface TimelineImage {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  /** Bildausschnitt als CSS object-position, damit Erik im Querformat sichtbar bleibt (AK-27) */
  position?: string;
}

export interface TimelineItem extends Record<Locale, { title: string; text: string }> {
  /** ISO-Monat für <time dateTime> */
  date: string;
  image?: TimelineImage;
}

const img = (
  name: string,
  width: number,
  height: number,
  de: string,
  en: string,
  position?: string,
): TimelineImage => ({
  src: `/images/about/timeline-${name}.jpg`,
  width,
  height,
  alt: { de, en },
  ...(position ? { position } : {}),
});

export const aboutContent = {
  de: {
    metaTitle: 'Über mich: Erik Bergheimer, UX/UI-Designer | Erik Bergheimer',
    metaDescription:
      'Erik Bergheimer: UX/UI-Designer und Webentwickler aus Augsburg. B.Sc. User Experience Design (TH Ingolstadt), M.A. am MCI Innsbruck.',
    title: 'Erik Bergheimer: UX/UI-Designer & Webentwickler',
    greeting: 'Servus, ich bin Erik',
    intro:
      'UX/UI-Designer und Webentwickler aus Augsburg. Schreib mir, um herauszufinden, ob ich gerade Zeit für dein Projekt habe.',
    photoAlt: 'Erik von hinten am Strand im weißen T-Shirt und mit Kappe, neben ihm ein Surfbrett',
    tools: 'Tools, mit denen ich arbeite',
    pause: 'Animation anhalten',
    journey: 'Mein Weg',
    journeyIntro:
      'Von der Kiwi-Farm in Neuseeland über Bali bis zum Master in Innsbruck: die Stationen, die mich geprägt haben.',
    journeyHint: 'Scroll weiter',
    journeyPrev: 'Vorherige Station',
    journeyNext: 'Nächste Station',
    outroTitle: 'Genug über mich. Jetzt bist du dran',
    outroText:
      'Erzähl mir, wo du gerade stehst und was du vorhast. Im kostenlosen Erstgespräch schauen wir gemeinsam, wie ich helfen kann.',
    outroMail: 'Oder schreib direkt an',
    cta: 'Lass uns sprechen',
    ctaText: 'Du willst wissen, ob ich zu deinem Projekt passe? Im kostenlosen Erstgespräch finden wir es heraus.',
  },
  en: {
    metaTitle: 'About Erik Bergheimer, UX/UI designer | Erik Bergheimer',
    metaDescription:
      'Erik Bergheimer: UX/UI designer and web developer from Augsburg. B.Sc. User Experience Design (TH Ingolstadt), M.A. at MCI Innsbruck.',
    title: 'Erik Bergheimer: UX/UI Designer & Web Developer',
    greeting: "Hi, I'm Erik",
    intro: 'UX/UI designer and web developer from Augsburg. Get in touch to find out if I have time for your project.',
    photoAlt: 'Erik seen from behind on a beach in a white T-shirt and cap, next to a surfboard',
    tools: 'Tools I work with',
    pause: 'Pause animation',
    journey: 'My journey',
    journeyIntro:
      "From a kiwi farm in New Zealand to Bali to a Master's degree in Innsbruck: the places that shaped me.",
    journeyHint: 'Keep scrolling',
    journeyPrev: 'Previous stop',
    journeyNext: 'Next stop',
    outroTitle: 'Enough about me. Your turn',
    outroText:
      "Tell me where you are right now and what you're planning. In a free intro call we'll work out together how I can help.",
    outroMail: 'Or email me at',
    cta: "Let's talk",
    ctaText: 'Want to find out whether I am the right fit for your project? A free intro call will tell us.',
  },
};

export const aboutPhoto = { src: '/images/about/erik.jpg', width: 1200, height: 1200 };

export const tools = [
  { name: 'Figma', src: '/images/logos/figma.png', width: 53, height: 80 },
  { name: 'Webflow', src: '/images/logos/webflow.png', width: 128, height: 80 },
  { name: 'Lovable', src: '/images/logos/lovable.png', width: 79, height: 80 },
  { name: 'Claude', src: '/images/logos/claude.png', width: 80, height: 80 },
  { name: 'Gemini', src: '/images/logos/gemini.png', width: 80, height: 80 },
  { name: 'Affinity', src: '/images/logos/affinity.png', width: 80, height: 80 },
  { name: 'Antigravity', src: '/images/logos/antigravity.png', width: 80, height: 80 },
  { name: 'VS Code', src: '/images/logos/vscode.png', width: 80, height: 80 },
];

// Sechs zusammengefasste Stationen (functions/seiten/ueber-mich.md AK-30, Issue #35)
export const timeline: TimelineItem[] = [
  {
    date: '2018-10',
    image: img(
      'nz',
      2400,
      2400,
      'Erik sitzt auf einem Felsen an einem Gletschersee vor schneebedeckten Bergen in Neuseeland',
      'Erik sitting on a rock by a glacier lake in front of snow-capped mountains in New Zealand',
    ),
    de: {
      title: 'Work & Travel in Neuseeland',
      text: 'Nach dem Abitur in Königsbrunn wollte ich unbedingt ins Ausland. Im Oktober 2018 ging es für sechs Monate nach Neuseeland, allein und ohne festen Plan. Fünf Wochen davon arbeitete ich auf einer Kiwi-Farm in Te Puke.',
    },
    en: {
      title: 'Work & Travel in New Zealand',
      text: 'After high school in Königsbrunn, Germany, I wanted nothing more than to go abroad. In October 2018 I left for six months in New Zealand, on my own and without a set plan. For five of those weeks I worked on a kiwi farm in Te Puke.',
    },
  },
  {
    date: '2019-10',
    image: img(
      'bachelor',
      1500,
      2000,
      'Erik bekommt seine Bachelorurkunde in User Experience Design überreicht und schüttelt dabei die Hand',
      "Erik receiving his bachelor's degree certificate in User Experience Design with a handshake",
      '60% 15%',
    ),
    de: {
      title: 'B.Sc. User Experience Design',
      text: 'Ein Persönlichkeitstest brachte mich auf User Experience Design. Im Oktober 2019 begann ich das Studium an der TH Ingolstadt. 2023 schloss ich es mit meiner Bachelorarbeit über die Grenzen von Low-/No-Code-Tools im E-Commerce ab.',
    },
    en: {
      title: 'B.Sc. User Experience Design',
      text: "A personality test pointed me towards User Experience Design. In October 2019 I started my studies at TH Ingolstadt. In 2023 I graduated with a bachelor's thesis on the limits of low-/no-code tools in e-commerce.",
    },
  },
  {
    date: '2021-10',
    image: img(
      'team23-festival',
      1659,
      2400,
      'Erik im weißen TEAM23-Crew-Shirt mit Rucksack und Badge, er zeigt lachend ein Peace-Zeichen',
      'Erik in a white TEAM23 crew shirt with a backpack and badge, smiling and making a peace sign',
      '50% 28%',
    ),
    de: {
      title: 'UX/UI-Designer bei TEAM23',
      text: 'Insgesamt vier Jahre war ich bei TEAM23 in Augsburg: 2021 als Pflichtpraktikant, danach als Werkstudent und ab September 2023 in Vollzeit als UX/UI-Designer.',
    },
    en: {
      title: 'UX/UI designer at TEAM23',
      text: 'I spent four years at TEAM23 in Augsburg: as a mandatory intern in 2021, then as a working student and from September 2023 full-time as a UX/UI designer.',
    },
  },
  {
    date: '2024-02',
    image: img(
      'bali',
      1800,
      2400,
      'Arbeitsplatz im Zimmer auf Bali: Schreibtisch mit Laptop, Spiegel und Fernseher',
      'Workspace in a room in Bali: desk with laptop, mirror and TV',
    ),
    de: {
      title: 'Workation auf Bali, Indonesien',
      text: 'Von Februar bis April 2024 arbeitete ich remote von Bali aus. Dort habe ich gelernt, wie Remote-Arbeit über Zeitzonen hinweg gelingt.',
    },
    en: {
      title: 'Workation in Bali, Indonesia',
      text: 'From February to April 2024 I worked remotely from Bali. There I learned how to make remote work across time zones.',
    },
  },
  {
    date: '2024-10',
    image: img(
      'innsbruck',
      1800,
      2400,
      'Erik mit Rucksack auf einem Gipfel, Blick über das Inntal bei Innsbruck',
      'Erik with a backpack on a summit, looking over the Inn valley near Innsbruck',
    ),
    de: {
      title: 'Master am MCI in Innsbruck',
      text: 'Im Oktober 2024 zog ich für den Master in Management, Communication & IT (M.A.) am MCI nach Innsbruck. Im September 2026 schloss ich ihn ab.',
    },
    en: {
      title: "Master's at MCI in Innsbruck",
      text: "In October 2024 I moved to Innsbruck for a Master's in Management, Communication & IT (M.A.) at the Management Center Innsbruck. I graduated in September 2026.",
    },
  },
  {
    date: '2025-09',
    image: img(
      'herocon',
      1800,
      2400,
      'Die Bühne der Herocon im Signal Iduna Park in Dortmund, auf der Leinwand „Herocon 2027“',
      'The Herocon stage at Signal Iduna Park in Dortmund, with "Herocon 2027" on the screen',
      '50% 55%',
    ),
    de: {
      title: 'Business Development Manager bei HERO Software',
      text: 'Im September 2025 kam ich als Werkstudent ins Business Development von HERO Software. Seit September 2026 bin ich dort Business Development Manager für die Herocon, die von HERO Software initiierte Konferenz.',
    },
    en: {
      title: 'Business Development Manager at HERO Software',
      text: 'In September 2025 I joined HERO Software as a working student in business development. Since September 2026 I have been Business Development Manager for Herocon, the conference started by HERO Software.',
    },
  },
];
