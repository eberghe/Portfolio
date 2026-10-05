import type { Locale } from '@/lib/i18n';

// Städte-Landingpages, siehe functions/seo/staedte-landingpages.md
// TODO(Erik): Texte prüfen, Einsatzgebiet bestätigen, weitere Städte auswählen (Issue #14)

export interface LocalPageText {
  metaTitle: string;
  metaDescription: string;
  /** Linktext im Footer und im Ortssatz der Leistungsseiten */
  footerLink: string;
  /** Linktext im Ortssatz der Leistungsseiten */
  serviceLink: string;
  eyebrow: string;
  title: string;
  lead: string;
  localTitle: string;
  localText: string;
  facts: { term: string; detail: string }[];
  servicesTitle: string;
  servicesText: string;
  reasonsTitle: string;
  reasons: { title: string; text: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
}

export interface LocalPage extends Record<Locale, LocalPageText> {
  /** Sprachneutraler Pfad, EN-Adresse über `enSlugs` in lib/i18n.ts */
  path: string;
  city: string;
  /** Leistungen, die für diese Stadt hervorgehoben werden (Slugs aus lib/content/services.ts) */
  services: string[];
  /** Land für `areaServed`, Standard Deutschland */
  country?: Record<Locale, string>;
}

export const localPages: LocalPage[] = [
  {
    path: '/webdesign-augsburg',
    city: 'Augsburg',
    services: ['webflow-development', 'ux-ui-design', 'accessibility', 'website-process-optimization'],
    de: {
      metaTitle: 'Webdesign & Webflow in Augsburg | Erik Bergheimer',
      metaDescription:
        'Webdesigner in Augsburg: Webflow-Websites, UX/UI-Design und Barrierefreiheit aus Königsbrunn. Persönlich vor Ort in Augsburg oder remote.',
      footerLink: 'Webdesign Augsburg',
      serviceLink: 'Mehr zu Webdesign in Augsburg',
      eyebrow: 'Augsburg & Umgebung',
      title: 'Webdesign & Webflow in Augsburg',
      lead: 'Du suchst eine Website, die gut aussieht, schnell lädt, gefunden wird und für alle funktioniert? Ich gestalte und baue sie, persönlich und direkt aus der Region.',
      localTitle: 'Vor Ort in Augsburg, remote in ganz Deutschland',
      localText:
        'Ich arbeite von Königsbrunn aus, direkt südlich von Augsburg. Workshops und Abstimmungen machen wir gerne bei dir vor Ort, alles andere läuft bequem per Video-Call.',
      facts: [
        { term: 'Standort', detail: 'Königsbrunn bei Augsburg' },
        { term: 'Vor Ort', detail: 'Augsburg und Umgebung' },
        { term: 'Remote', detail: 'Ganz Deutschland, auf Deutsch oder Englisch' },
      ],
      servicesTitle: 'Was ich für dich mache',
      servicesText: 'Von der ersten Skizze bis zur fertigen Website, alles aus einer Hand.',
      reasonsTitle: 'Warum ein Webdesigner aus der Region?',
      reasons: [
        {
          title: 'Kurze Wege',
          text: 'Wir können uns treffen, gemeinsam auf deine Website schauen und Entscheidungen am Tisch klären statt in langen E-Mail-Ketten.',
        },
        {
          title: 'Eine Ansprechperson',
          text: 'Du sprichst mit der Person, die gestaltet und baut. Keine Agentur-Umwege, keine Übergaben, die Wissen verlieren.',
        },
        {
          title: 'Barrierefrei und auffindbar',
          text: 'Barrierefreiheit nach WCAG, saubere Technik und lokale Suchmaschinenoptimierung denke ich von Anfang an mit.',
        },
      ],
      faqTitle: 'Fragen zu Webdesign in Augsburg',
      faqs: [
        {
          q: 'Kommst du für Workshops nach Augsburg?',
          a: 'Ja. Kickoff, Workshops und wichtige Abstimmungen machen wir gerne bei dir in Augsburg oder der Umgebung. Zwischendurch arbeiten wir per Video-Call, das spart dir Zeit. Die Anfahrt besprechen wir im Angebot.',
        },
        {
          q: 'Arbeitest du nur mit Unternehmen aus Augsburg?',
          a: 'Nein. Ich sitze in Königsbrunn bei Augsburg und arbeite vor Ort in der Region, remote aber mit Kundinnen und Kunden in ganz Deutschland.',
        },
        {
          q: 'Hilfst du Augsburger Unternehmen, lokal gefunden zu werden?',
          a: 'Ja. Ich achte auf saubere Seitenstruktur, schnelle Ladezeiten, passende Texte und strukturierte Daten, damit dich Menschen in Augsburg finden, wenn sie nach deiner Leistung suchen. Rankings kann niemand garantieren, aber die Grundlagen stimmen.',
        },
        {
          q: 'Warum Webflow für meine Website in Augsburg?',
          a: 'Mit Webflow bekommst du eine schnelle, sichere Website, die du selbst pflegen kannst, ohne Plugin-Pflege und Sicherheitsupdates, um die du dich kümmern musst. Ich richte sie so ein, dass du Texte und Bilder ohne Programmierkenntnisse änderst; bei Fragen bin ich in der Nähe von Augsburg erreichbar.',
        },
        {
          q: 'Wie starten wir?',
          a: 'Mit einem kostenlosen Erstgespräch, per Video oder bei dir in Augsburg. Danach bekommst du ein klares Angebot mit Ablauf und Zeitplan.',
        },
      ],
      ctaTitle: 'Lass uns sprechen',
      ctaText:
        'Erzähl mir, was du vorhast. Im kostenlosen Erstgespräch klären wir, wo du stehst und wie deine neue Website aussehen kann.',
    },
    en: {
      metaTitle: 'Web design & Webflow in Augsburg | Erik Bergheimer',
      metaDescription:
        'Web designer in Augsburg: Webflow websites, UX/UI design and accessibility from Königsbrunn. On site in Augsburg or remotely.',
      footerLink: 'Web design Augsburg',
      serviceLink: 'More on web design in Augsburg',
      eyebrow: 'Augsburg & area',
      title: 'Web design & Webflow in Augsburg',
      lead: 'Looking for a website that looks good, loads fast, gets found and works for everyone? I design and build it, personally and right here in the region.',
      localTitle: 'On site in Augsburg, remote across Germany',
      localText:
        'I work from Königsbrunn, just south of Augsburg. We can hold workshops and check-ins at your place; everything else runs smoothly over video calls.',
      facts: [
        { term: 'Location', detail: 'Königsbrunn near Augsburg' },
        { term: 'On site', detail: 'Augsburg and surroundings' },
        { term: 'Remote', detail: 'All of Germany, in German or English' },
      ],
      servicesTitle: 'What I do for you',
      servicesText: 'From the first sketch to the finished website, all from one person.',
      reasonsTitle: 'Why a web designer from the region?',
      reasons: [
        {
          title: 'Close by',
          text: 'We can meet, look at your website together and settle decisions at the table instead of in long email threads.',
        },
        {
          title: 'One point of contact',
          text: 'You talk to the person who designs and builds. No agency layers, no handovers that lose knowledge.',
        },
        {
          title: 'Accessible and findable',
          text: 'WCAG-compliant accessibility, clean technology and local search engine optimisation are part of the plan from day one.',
        },
      ],
      faqTitle: 'Questions about web design in Augsburg',
      faqs: [
        {
          q: 'Do you come to Augsburg for workshops?',
          a: 'Yes. Kick-off, workshops and key check-ins can happen at your place in or around Augsburg. In between we work over video calls, which saves you time. Travel is agreed in the offer.',
        },
        {
          q: 'Do you only work with businesses in Augsburg?',
          a: 'No. I am based in Königsbrunn near Augsburg and work on site in the region, but remotely with clients all over Germany.',
        },
        {
          q: 'Do you help Augsburg businesses get found locally?',
          a: 'Yes. I take care of a clean page structure, fast loading, fitting copy and structured data so people in Augsburg find you when they search for what you offer. Nobody can guarantee rankings, but the foundations will be right.',
        },
        {
          q: 'Why Webflow for my website in Augsburg?',
          a: 'Webflow gives you a fast, secure website you can maintain yourself, without plugin upkeep or security updates to worry about. I set it up so you can change text and images without coding, and I am close by in the Augsburg area if you need help.',
        },
        {
          q: 'How do we start?',
          a: 'With a free intro call, by video or at your place in Augsburg. Afterwards you get a clear offer with process and timeline.',
        },
      ],
      ctaTitle: "Let's talk",
      ctaText:
        "Tell me what you're planning. In a free intro call we'll work out where you are and what your new website could look like.",
    },
  },
];

/** Heimatseite (Augsburg), die Leistungsseiten im Ortssatz verlinken (AK-7) */
export const localPageForService = (slug: string) =>
  localPages[0]!.services.includes(slug) ? localPages[0] : undefined;
