import type { Locale } from '@/lib/i18n';

// Über mich, siehe functions/seiten/ueber-mich.md. Texte aus dem Lovable-Projekt (AboutPage.tsx, tlData),
// englische Begriffe auf der deutschen Seite eingedeutscht, Alt-Texte neu.
export interface TimelineImage {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
}

export interface TimelineItem extends Record<Locale, { title: string; text: string }> {
  /** ISO-Monat für <time dateTime> */
  date: string;
  image?: TimelineImage;
}

const img = (name: string, width: number, height: number, de: string, en: string): TimelineImage => ({
  src: `/images/about/timeline-${name}.jpg`,
  width,
  height,
  alt: { de, en },
});

const team23 = img(
  'team23',
  533,
  800,
  'Erik im weißen TEAM23-Crew-Shirt mit Schlüsselband',
  'Erik in a white TEAM23 crew shirt with a lanyard',
);

export const aboutContent = {
  de: {
    metaTitle: 'Über mich: Erik Bergheimer, UX/UI-Designer | Erik Bergheimer',
    metaDescription:
      'Erik Bergheimer: UX/UI-Designer und Webflow-Entwickler aus Augsburg. B.Sc. User Experience Design (TH Ingolstadt), M.A. am MCI Innsbruck.',
    badge: 'Augsburg',
    title: 'Erik Bergheimer: UX/UI-Designer & Webflow-Entwickler',
    subtitle: 'Portfolio · Augsburg',
    facts: 'M.A. Management, Communication & IT, MCI Innsbruck',
    intro:
      'Ich bin Erik und arbeite als Freelancer für UX/UI-Design, Webflow, Barrierefreiheit und KI-Beratung, vor Ort in Augsburg oder remote. Meinen Bachelor in User Experience Design habe ich an der TH Ingolstadt gemacht. Seitdem habe ich in verschiedenen Unternehmen und Ländern gearbeitet, von Augsburg über Bali bis Innsbruck. 2026 habe ich meinen Master in Management, Communication & IT (M.A.) am MCI in Innsbruck abgeschlossen; daneben war ich Werkstudent im Business Development bei HERO Software. Heute arbeite ich dort als Business Development Manager.',
    photoAlt: 'Erik Bergheimer mit Sonnenbrille und schwarzem Hemd, lächelnd',
    tools: 'Tools, mit denen ich arbeite',
    pause: 'Animation anhalten',
    journey: 'Mein Weg',
    cta: 'Lass uns sprechen',
    ctaText: 'Du willst wissen, ob ich zu deinem Projekt passe? Im kostenlosen Erstgespräch finden wir es heraus.',
  },
  en: {
    metaTitle: 'About Erik Bergheimer, UX/UI designer | Erik Bergheimer',
    metaDescription:
      'Erik Bergheimer: UX/UI designer and Webflow developer from Augsburg. B.Sc. User Experience Design (TH Ingolstadt), M.A. at MCI Innsbruck.',
    badge: 'Augsburg',
    title: 'Erik Bergheimer: UX/UI Designer & Webflow Developer',
    subtitle: 'Portfolio · Augsburg',
    facts: 'M.A. in Management, Communication & IT, MCI Innsbruck',
    intro:
      "I'm Erik, a freelance UX/UI designer and Webflow developer who also advises on accessibility and AI, on site in Augsburg or remote. I completed my Bachelor's degree in User Experience Design at Technische Hochschule Ingolstadt (THI). Since then I have worked for different companies and in different countries, from Augsburg to Bali to Innsbruck. In 2026 I completed my Master's degree in Management, Communication and IT (M.A.) at MCI in Innsbruck, alongside a working-student role in Business Development at HERO Software, where I now work as Business Development Manager.",
    photoAlt: 'Erik Bergheimer wearing sunglasses and a black shirt, smiling',
    tools: 'Tools I work with',
    pause: 'Pause animation',
    journey: 'My journey',
    cta: "Let's talk",
    ctaText: 'Want to find out whether I am the right fit for your project? A free intro call will tell us.',
  },
};

export const aboutPhoto = { src: '/images/about/erik.jpg', width: 1200, height: 1200 };

export const chips: Record<Locale, string[]> = {
  de: ['UX/UI Design', 'Webflow', 'Barrierefreiheit', 'KI-Beratung', 'Design Systems', 'Fotografie'],
  en: ['UX/UI design', 'Webflow', 'Accessibility', 'AI consulting', 'Design systems', 'Photography'],
};

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

export const timeline: TimelineItem[] = [
  {
    date: '2018-07',
    de: {
      title: 'Abitur & IKEA',
      text: 'Nach dem Abitur in Königsbrunn war mein größter Traum, ins Ausland zu gehen. Bis zur Abreise arbeitete ich bei IKEA, um für dieses Abenteuer zu sparen.',
    },
    en: {
      title: 'High school & IKEA',
      text: 'After graduating from high school in Königsbrunn, Germany, my biggest dream was to go abroad. Until I left, I worked at IKEA to save up for this adventure.',
    },
  },
  {
    date: '2018-10',
    image: img(
      'nz',
      800,
      800,
      'Erik sitzt auf einem Felsen an einem Gletschersee vor schneebedeckten Bergen in Neuseeland',
      'Erik sitting on a rock by a glacier lake in front of snow-capped mountains in New Zealand',
    ),
    de: {
      title: 'Work & Travel in Neuseeland',
      text: 'Im Oktober 2018 begann meine Reise: sechs Monate Work and Travel in Neuseeland. Ganz alleine, ohne festen Plan, aber mit jeder Menge Aufregung und Vorfreude.',
    },
    en: {
      title: 'Work & Travel in New Zealand',
      text: 'In October 2018, my journey began: six months of Work and Travel in New Zealand. All on my own, with no set plan, just a whole lot of excitement and anticipation.',
    },
  },
  {
    date: '2018-12',
    image: img(
      'kiwi',
      600,
      800,
      'Reihen einer Kiwi-Plantage mit Rankgerüsten',
      'Rows of a kiwi orchard with trellises',
    ),
    de: {
      title: 'Kiwi-Farm in Te Puke',
      text: 'Im Dezember begann mein erster Job in Te Puke, Neuseeland: fünf Wochen auf einer Kiwi-Plantage. Lange Tage körperlicher Arbeit an der frischen Luft prägten diese Zeit.',
    },
    en: {
      title: 'Kiwi farm in Te Puke',
      text: 'In December, I started my first job in Te Puke, New Zealand, working on a kiwi orchard for five weeks. Long days of physical work out in the fresh air shaped this time in a big way.',
    },
  },
  {
    date: '2019-06',
    de: {
      title: 'Amazon Deutschland',
      text: 'Nach der Rückkehr nach Deutschland im April 2019 begann ich im Juni bei Amazon zu arbeiten, um vor dem möglichen Studienstart etwas Geld zu sparen.',
    },
    en: {
      title: 'Amazon Germany',
      text: 'After returning to Germany in April 2019, I started working at Amazon in June to save up some money before possibly starting my studies.',
    },
  },
  {
    date: '2019-07',
    de: {
      title: 'Beruflicher Persönlichkeitstest',
      text: 'Unsicher, was ich studieren soll, machte ich einen professionellen Persönlichkeitstest. Das Ergebnis wies mich auf ein Studium im Bereich User Experience Design in Ingolstadt hin.',
    },
    en: {
      title: 'Professional personality test',
      text: "Unsure of what to study, I took a professional personality test. The result pointed me toward a Bachelor's degree in User Experience Design in Ingolstadt, Germany.",
    },
  },
  {
    date: '2019-10',
    image: img(
      'ingolstadt',
      600,
      800,
      'Das Neue Schloss in Ingolstadt im Abendlicht',
      'The New Castle in Ingolstadt in the evening light',
    ),
    de: {
      title: 'B.Sc. User Experience Design',
      text: 'Nach dem Umzug nach Ingolstadt begann ich mein Studium im Bereich User Experience Design.',
    },
    en: {
      title: 'B.Sc. User Experience Design',
      text: 'After moving to Ingolstadt, I began my studies in User Experience Design.',
    },
  },
  {
    date: '2021-10',
    image: team23,
    de: {
      title: 'Pflichtpraktikum bei TEAM23',
      text: 'Für mein fünftes Semester war ein Pflichtpraktikum erforderlich, das ich bei TEAM23 in Augsburg absolvierte.',
    },
    en: {
      title: 'Internship at TEAM23',
      text: 'For my fifth semester, a mandatory internship was required, which I completed at TEAM23 in Augsburg, Germany.',
    },
  },
  {
    date: '2022-02',
    de: {
      title: 'Werkstudent bei TEAM23',
      text: 'Nach dem erfolgreichen Abschluss meines Praktikums begann ich im Februar 2022 als Werkstudent bei TEAM23.',
    },
    en: {
      title: 'Working student at TEAM23',
      text: 'After successfully completing my internship, I started working as a working student at TEAM23 in February 2022.',
    },
  },
  {
    date: '2023-08',
    image: img(
      'thesis',
      600,
      600,
      'Porträt von Erik in schwarzem Pullover in einem Flur',
      'Portrait of Erik in a black jumper in a hallway',
    ),
    de: {
      title: 'Bachelorarbeit',
      text: 'Ich schloss meine Bachelorarbeit mit dem Titel „Limitations and Problems of Low-/No-Code Tools in the Context of E-Commerce“ ab.',
    },
    en: {
      title: 'Bachelor thesis',
      text: 'I completed my Bachelor\'s thesis titled "Limitations and Problems of Low-/No-Code Tools in the Context of E-Commerce."',
    },
  },
  {
    date: '2023-09',
    de: {
      title: 'UX/UI-Designer bei TEAM23 (Vollzeit)',
      text: 'Im September 2023 startete ich als UX/UI-Designer in Vollzeit bei TEAM23!',
    },
    en: {
      title: 'UX/UI designer at TEAM23 (full-time)',
      text: 'In September 2023, I started working full-time as a UX/UI designer at TEAM23!',
    },
  },
  {
    date: '2024-02',
    image: img(
      'bali',
      600,
      800,
      'Arbeitsplatz im Zimmer auf Bali: Schreibtisch mit Laptop, Spiegel und Fernseher',
      'Workspace in a room in Bali: desk with laptop, mirror and TV',
    ),
    de: {
      title: 'Workation auf Bali, Indonesien',
      text: 'Von Februar bis April 2024 machte ich eine Workation auf Bali. Sie zeigte mir, wie Remote-Arbeit gelingen kann, auch über Zeitzonen hinweg. In dieser Zeit lernte ich viel über mich selbst und wie ich in einer digitalen Organisation arbeite.',
    },
    en: {
      title: 'Workation in Bali, Indonesia',
      text: 'From February to April 2024, I took a workation in Bali, Indonesia. It showed me how remote work can succeed, even across time zones. During this time, I learned a lot about myself and how I work within a digital organization.',
    },
  },
  {
    date: '2024-10',
    image: img(
      'innsbruck',
      600,
      800,
      'Erik mit Rucksack auf einem Gipfel, Blick über das Inntal bei Innsbruck',
      'Erik with a backpack on a summit, looking over the Inn valley near Innsbruck',
    ),
    de: {
      title: 'Umzug nach Innsbruck',
      text: 'Im Oktober 2024 entschied ich mich, den nächsten Schritt in meiner Karriere zu machen und nach Innsbruck zu ziehen, um am MCI den Master in Management, Communication & IT (M.A.) zu beginnen.',
    },
    en: {
      title: 'Move to Innsbruck',
      text: "In October 2024, I decided to take the next step in my career and move to Innsbruck to start a Master's degree in Management, Communication & IT at the Management Center Innsbruck (MCI).",
    },
  },
  {
    date: '2025-09',
    image: img(
      'hero-software',
      800,
      800,
      'Porträt von Erik im schwarzen HERO-Shirt vor weißem Hintergrund',
      'Portrait of Erik in a black HERO shirt against a white background',
    ),
    de: {
      title: 'Werkstudent Business Development bei HERO Software',
      text: 'Nach vier lohnenden Jahren bei TEAM23 war es Zeit für eine neue Herausforderung und frische Perspektiven. Im September 2025 wechselte ich als Werkstudent ins Business Development bei HERO Software.',
    },
    en: {
      title: 'Working student in business development at HERO Software',
      text: 'After four rewarding years at TEAM23, I decided it was time for a new challenge and fresh perspectives. In September 2025 I joined HERO Software as a working student in Business Development.',
    },
  },
  {
    date: '2026-09',
    de: {
      title: 'Masterabschluss am MCI',
      text: 'Im September 2026 schloss ich meinen Master in Management, Communication & IT (M.A.) am Management Center Innsbruck ab.',
    },
    en: {
      title: "Master's degree from MCI",
      text: "In September 2026, I completed my Master's degree in Management, Communication & IT (M.A.) at the Management Center Innsbruck.",
    },
  },
];
