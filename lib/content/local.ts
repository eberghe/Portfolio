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
  /** Eigener Kartentext je Leistung (Slug), sonst der allgemeine Kurztext */
  serviceTexts?: Record<string, string>;
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
  {
    path: '/webdesign-muenchen',
    city: 'München',
    services: ['webflow-development', 'ux-ui-design', 'accessibility', 'website-process-optimization'],
    de: {
      metaTitle: 'Webdesign & Webentwicklung in München | Erik Bergheimer',
      metaDescription:
        'Webdesign und Webentwicklung für München: Webflow-Websites, UX/UI-Design und Barrierefreiheit, remote aus Königsbrunn, Termine nach Absprache.',
      footerLink: 'Webdesign München',
      serviceLink: 'Mehr zu Webdesign in München',
      eyebrow: 'Remote für München',
      title: 'Webdesign & Webentwicklung in München',
      lead: 'Du willst eine Website auf Agenturniveau, aber ohne Agentur-Overhead? Ich gestalte und entwickle sie für dich, remote und mit einer festen Ansprechperson von der ersten Idee bis zum Launch.',
      localTitle: 'Remote für München, Treffen nach Absprache',
      localText:
        'Ich arbeite von Königsbrunn bei Augsburg aus und betreue Projekte in München remote. Abstimmungen laufen per Video-Call; wenn ein Treffen in München sinnvoll ist, vereinbaren wir es nach Absprache.',
      facts: [
        { term: 'Standort', detail: 'Königsbrunn bei Augsburg' },
        { term: 'Einsatzgebiet', detail: 'München, Termine vor Ort nach Absprache' },
        { term: 'Arbeitsweise', detail: 'Remote per Video-Call, auf Deutsch oder Englisch' },
      ],
      servicesTitle: 'Leistungen für dein Projekt',
      servicesText: 'Gestaltung, Entwicklung, Barrierefreiheit und schlankere Abläufe rund um deine Website.',
      reasonsTitle: 'Warum ein Freelancer statt einer Agentur?',
      reasons: [
        {
          title: 'Agenturqualität ohne Overhead',
          text: 'Konzept, Design und Umsetzung auf professionellem Niveau, ohne zusätzliche Projektmanagement-Schichten, die Zeit und Budget kosten.',
        },
        {
          title: 'Eingespielt remote',
          text: 'Geteilte Figma-Dateien, kurze Video-Calls und eine Webflow-Vorschau, die du jederzeit öffnen kannst: Du siehst den Fortschritt, ohne einen Termin quer durch die Stadt einzuplanen.',
        },
        {
          title: 'Barrierefreiheit mitgedacht',
          text: 'Seit Juni 2025 gilt das Barrierefreiheitsstärkungsgesetz für viele digitale Angebote. Ich gestalte und entwickle nach WCAG, damit mehr Menschen deine Website nutzen können.',
        },
      ],
      faqTitle: 'Fragen zu Webdesign in München',
      faqs: [
        {
          q: 'Hast du ein Büro in München?',
          a: 'Nein. Ich arbeite von Königsbrunn bei Augsburg aus und betreue Projekte in München remote. Wenn ein Treffen vor Ort sinnvoll ist, etwa für einen Workshop, vereinbaren wir es nach Absprache.',
        },
        {
          q: 'Wie läuft ein Remote-Projekt für Kundinnen und Kunden in München ab?',
          a: 'Nach dem Erstgespräch bekommst du ein Angebot mit Ablauf und Zeitplan. Dann arbeiten wir in klaren Schritten: Konzept, Design in Figma, Umsetzung in Webflow, Abnahme. Feedback gibst du per Video-Call oder direkt in der Vorschau.',
        },
        {
          q: 'Lohnt sich ein Freelancer statt einer Agentur in München?',
          a: 'Für viele Websites ja: Du sprichst direkt mit der Person, die gestaltet und entwickelt, und zahlst keinen Agentur-Overhead. Braucht dein Projekt in München ein großes Team mit vielen Disziplinen, sage ich dir das offen.',
        },
        {
          q: 'Kann ich die Website nach dem Launch selbst pflegen?',
          a: 'Ja. Ich richte Webflow so ein, dass du Texte, Bilder und Beiträge selbst änderst. Zum Abschluss gibt es eine Einführung per Video, und auch danach bin ich von Königsbrunn aus für Fragen erreichbar.',
        },
        {
          q: 'Was kostet eine Website für ein Unternehmen in München?',
          a: 'Das hängt von Umfang, Inhalten und Funktionen ab. Nach dem kostenlosen Erstgespräch bekommst du ein klares Angebot, sodass du dein Projekt in München ohne Überraschungen budgetieren kannst.',
        },
      ],
      ctaTitle: 'Dein Projekt in München besprechen',
      ctaText:
        'Erzähl mir, was du vorhast. Im kostenlosen Erstgespräch per Video klären wir Ziele, Umfang und den nächsten Schritt.',
    },
    en: {
      metaTitle: 'Web design & development in Munich | Erik Bergheimer',
      metaDescription:
        'Web design and development for Munich (München): Webflow websites, UX/UI design and accessibility, remote from Königsbrunn, meetings by arrangement.',
      footerLink: 'Web design Munich',
      serviceLink: 'More on web design in Munich',
      eyebrow: 'Remote for Munich',
      title: 'Web design & development in Munich',
      lead: 'Want an agency-quality website without the agency overhead? I design and build it for you, remotely and with one fixed point of contact from the first idea to launch.',
      localTitle: 'Remote for Munich, meetings by arrangement',
      localText:
        'I work from Königsbrunn near Augsburg and look after projects in Munich (München) remotely. Check-ins happen over video calls; if meeting in Munich makes sense, we arrange it.',
      facts: [
        { term: 'Location', detail: 'Königsbrunn near Augsburg' },
        { term: 'Service area', detail: 'Munich (München), on-site meetings by arrangement' },
        { term: 'Way of working', detail: 'Remote over video calls, in German or English' },
      ],
      servicesTitle: 'Services for your project',
      servicesText: 'Design, development, accessibility and leaner processes around your website.',
      reasonsTitle: 'Why a freelancer instead of an agency?',
      reasons: [
        {
          title: 'Agency quality, no overhead',
          text: 'Concept, design and build at a professional level, without extra layers of project management that cost time and budget.',
        },
        {
          title: 'Practised at remote work',
          text: 'Shared Figma files, short video calls and a Webflow preview you can open any time: you see the progress without planning a trip across town.',
        },
        {
          title: 'Accessibility built in',
          text: 'Since June 2025 the German Accessibility Strengthening Act applies to many digital services. I design and build to WCAG so more people can use your website.',
        },
      ],
      faqTitle: 'Questions about web design in Munich',
      faqs: [
        {
          q: 'Do you have an office in Munich?',
          a: 'No. I work from Königsbrunn near Augsburg and look after projects in München remotely. If meeting on site makes sense, for a workshop for example, we arrange it.',
        },
        {
          q: 'How does a remote project for clients in Munich work?',
          a: 'After the intro call you get an offer with process and timeline. Then we work in clear steps: concept, design in Figma, build in Webflow, sign-off. You give feedback over video calls or directly in the preview, wherever you are in München.',
        },
        {
          q: 'Is a freelancer worth it compared to a Munich agency?',
          a: 'For many websites, yes: you talk directly to the person who designs and builds, and you pay no agency overhead. If your project in München needs a large team across many disciplines, I will tell you openly.',
        },
        {
          q: 'Can I maintain the website myself after launch?',
          a: 'Yes. I set up Webflow so you can change text, images and posts yourself. At the end there is a walkthrough over video, and afterwards I am still reachable from Königsbrunn if questions come up.',
        },
        {
          q: 'What does a website for a Munich business cost?',
          a: 'It depends on scope, content and features. After the free intro call you get a clear offer, so you can budget your project in München without surprises.',
        },
      ],
      ctaTitle: 'Talk about your Munich project',
      ctaText:
        'Tell me what you are planning. In a free intro call over video we clarify goals, scope and the next step.',
    },
  },
  {
    path: '/webdesign-stuttgart',
    city: 'Stuttgart',
    services: ['webflow-development', 'ux-ui-design', 'design-systems', 'accessibility'],
    de: {
      metaTitle: 'Webdesign & Webentwicklung in Stuttgart | Erik Bergheimer',
      metaDescription:
        'Webdesign, Webflow-Entwicklung und Design-Systeme für Stuttgart: remote aus Königsbrunn bei Augsburg, Termine vor Ort nach Absprache.',
      footerLink: 'Webdesign Stuttgart',
      serviceLink: 'Mehr zu Webdesign in Stuttgart',
      eyebrow: 'Remote für Stuttgart',
      title: 'Webdesign & Webentwicklung in Stuttgart',
      lead: 'Deine Website soll mit deinem Unternehmen wachsen, ohne dass jede neue Seite neu erfunden wird? Ich gestalte und entwickle sie auf einer sauberen Grundlage aus Komponenten und klaren Regeln.',
      localTitle: 'Remote für Stuttgart, Termine nach Absprache',
      localText:
        'Mein Arbeitsplatz ist in Königsbrunn bei Augsburg. Projekte in Stuttgart betreue ich remote mit festen Abstimmungsterminen per Video; für Kickoff oder Workshop komme ich nach Absprache auch nach Stuttgart.',
      facts: [
        { term: 'Standort', detail: 'Königsbrunn bei Augsburg' },
        { term: 'Einsatzgebiet', detail: 'Stuttgart, Termine vor Ort nach Absprache' },
        { term: 'Arbeitsweise', detail: 'Remote mit festen Video-Terminen, auf Deutsch oder Englisch' },
      ],
      servicesTitle: 'Was ich für dein Team mache',
      servicesText: 'Website, Interface und Design-System aus einer Hand, barrierefrei gedacht.',
      reasonsTitle: 'Was du von der Zusammenarbeit hast',
      reasons: [
        {
          title: 'Design-Systeme für Produktteams',
          text: 'Komponenten, Farben, Typografie und Regeln, dokumentiert in Figma: Für Produktteams und Mittelstand eine gemeinsame Sprache zwischen Design und Entwicklung.',
        },
        {
          title: 'Saubere Übergaben',
          text: 'Ich dokumentiere Entscheidungen und baue nachvollziehbar, damit dein Team oder deine IT später ohne mich weiterarbeiten kann.',
        },
        {
          title: 'Planbar aus der Ferne',
          text: 'Feste Termine, klare Meilensteine und eine Vorschau, die immer aktuell ist. So bleibt das Projekt auch remote verlässlich im Takt.',
        },
      ],
      faqTitle: 'Fragen zu Webdesign in Stuttgart',
      faqs: [
        {
          q: 'Kommst du für Termine nach Stuttgart?',
          a: 'Nach Absprache ja, etwa für einen Kickoff oder Workshop. Die Arbeit selbst läuft remote von Königsbrunn bei Augsburg aus; die Anreise klären wir vorab im Angebot.',
        },
        {
          q: 'Baust du Design-Systeme für Teams in Stuttgart?',
          a: 'Ja. Für Produktteams und mittelständische Unternehmen in Stuttgart und anderswo lege ich Komponenten, Farben, Typografie und Regeln in Figma an und dokumentiere sie, damit Design und Entwicklung dieselbe Grundlage nutzen.',
        },
        {
          q: 'Arbeitest du mit unserer IT in Stuttgart zusammen?',
          a: 'Ja. Ich stimme mich mit eurer IT oder Entwicklung ab, übergebe sauber und halte Entscheidungen schriftlich fest. Das funktioniert remote, ohne dass jemand nach Stuttgart oder Königsbrunn fahren muss.',
        },
        {
          q: 'Ist Webflow für ein Unternehmen aus Stuttgart sicher genug?',
          a: 'Webflow übernimmt Hosting, SSL-Zertifikat und Updates der Plattform, Plugins musst du nicht pflegen. Ob das zu den Anforderungen deines Unternehmens in Stuttgart passt, klären wir im Erstgespräch gemeinsam.',
        },
        {
          q: 'Achtest du bei Websites für Stuttgart auf Barrierefreiheit?',
          a: 'Ja. Ich gestalte und entwickle nach WCAG und teste mit automatischen Prüfungen, mit der Tastatur und mit dem Screenreader. Eine Rechtsberatung ersetzt das nicht, für dein Unternehmen in Stuttgart ist es aber eine solide Grundlage.',
        },
      ],
      ctaTitle: 'Dein Vorhaben in Stuttgart besprechen',
      ctaText:
        'Schreib mir, woran dein Team gerade arbeitet. Im kostenlosen Erstgespräch schauen wir, ob Website, Interface oder Design-System der beste Startpunkt ist.',
    },
    en: {
      metaTitle: 'Web design & development in Stuttgart | Erik Bergheimer',
      metaDescription:
        'Web design, Webflow development and design systems for Stuttgart: remote from Königsbrunn near Augsburg, on-site meetings by arrangement.',
      footerLink: 'Web design Stuttgart',
      serviceLink: 'More on web design in Stuttgart',
      eyebrow: 'Remote for Stuttgart',
      title: 'Web design & development in Stuttgart',
      lead: 'Want a website that grows with your company without reinventing every new page? I design and build it on a clean foundation of components and clear rules.',
      localTitle: 'Remote for Stuttgart, meetings by arrangement',
      localText:
        'I am based in Königsbrunn near Augsburg. I look after projects in Stuttgart remotely with regular video check-ins; for a kick-off or workshop I can come to Stuttgart by arrangement.',
      facts: [
        { term: 'Location', detail: 'Königsbrunn near Augsburg' },
        { term: 'Service area', detail: 'Stuttgart, on-site meetings by arrangement' },
        { term: 'Way of working', detail: 'Remote with regular video check-ins, in German or English' },
      ],
      servicesTitle: 'What I do for your team',
      servicesText: 'Website, interface and design system from one person, with accessibility in mind.',
      reasonsTitle: 'What you get from working together',
      reasons: [
        {
          title: 'Design systems for product teams',
          text: 'Components, colours, typography and rules, documented in Figma: a shared language between design and development for product teams and mid-sized companies.',
        },
        {
          title: 'Clean handovers',
          text: 'I document decisions and build in a way that is easy to follow, so your team or IT can carry on without me later.',
        },
        {
          title: 'Predictable from afar',
          text: 'Fixed check-ins, clear milestones and a preview that is always up to date. That keeps the project on schedule, even remotely.',
        },
      ],
      faqTitle: 'Questions about web design in Stuttgart',
      faqs: [
        {
          q: 'Do you come to Stuttgart for meetings?',
          a: 'By arrangement, yes, for a kick-off or workshop for example. The work itself happens remotely from Königsbrunn near Augsburg; travel is agreed in the offer.',
        },
        {
          q: 'Do you build design systems for teams in Stuttgart?',
          a: 'Yes. For product teams and mid-sized companies in Stuttgart and elsewhere I set up components, colours, typography and rules in Figma and document them, so design and development share the same foundation.',
        },
        {
          q: 'Will you work with our IT team in Stuttgart?',
          a: 'Yes. I coordinate with your IT or developers, hand over cleanly and keep decisions in writing. It all works remotely, without anyone travelling to Stuttgart or Königsbrunn.',
        },
        {
          q: 'Is Webflow secure enough for a Stuttgart company?',
          a: 'Webflow handles hosting, the SSL certificate and platform updates, and there are no plugins to maintain. Whether that fits the requirements of your company in Stuttgart is something we clarify together in the intro call.',
        },
        {
          q: 'Do you consider accessibility for websites in Stuttgart?',
          a: 'Yes. I design and build to WCAG and test with automated checks, the keyboard and a screen reader. It does not replace legal advice, but it gives your company in Stuttgart a solid foundation.',
        },
      ],
      ctaTitle: 'Discuss your Stuttgart project',
      ctaText:
        'Tell me what your team is working on. In a free intro call we look at whether a website, an interface or a design system is the best place to start.',
    },
  },
  {
    path: '/webdesign-innsbruck',
    city: 'Innsbruck',
    country: { de: 'Österreich', en: 'Austria' },
    services: ['ux-ui-design', 'webflow-development', 'accessibility', 'ai-consulting'],
    de: {
      metaTitle: 'Webdesign & Webentwicklung in Innsbruck | Erik Bergheimer',
      metaDescription:
        'Webdesign für Innsbruck von einem MCI-Absolventen: UX/UI-Design, Webflow, Barrierefreiheit und KI-Beratung, remote aus Deutschland.',
      footerLink: 'Webdesign Innsbruck',
      serviceLink: 'Mehr zu Webdesign in Innsbruck',
      eyebrow: 'Remote für Innsbruck & Tirol',
      title: 'Webdesign & Webentwicklung in Innsbruck',
      lead: 'Innsbruck kenne ich aus meinem Masterstudium am MCI. Heute gestalte und entwickle ich Websites und Apps von Deutschland aus, für Unternehmen in Tirol remote und ohne Umwege.',
      localTitle: 'Remote für Innsbruck, über die Grenze hinweg',
      localText:
        'Während meines Studiums habe ich in Innsbruck gelebt, heute arbeite ich von Königsbrunn bei Augsburg aus. Projekte in Innsbruck und Tirol laufen remote per Video-Call, ein Treffen vor Ort ist nach Absprache möglich.',
      facts: [
        { term: 'Standort', detail: 'Königsbrunn bei Augsburg, Deutschland' },
        { term: 'Einsatzgebiet', detail: 'Innsbruck und Tirol, Termine vor Ort nach Absprache' },
        { term: 'Arbeitsweise', detail: 'Remote über die Grenze, auf Deutsch oder Englisch' },
      ],
      servicesTitle: 'Leistungen für Innsbruck',
      servicesText: 'Nutzerzentriertes Design, schnelle Websites, Barrierefreiheit und KI mit Augenmaß.',
      reasonsTitle: 'Was mich mit Innsbruck verbindet',
      reasons: [
        {
          title: 'Studium am MCI',
          text: "Meinen Master in Management, Communication & IT habe ich am MCI gemacht. Dort entstand auch SIGHT'KICK, ein App-Konzept, das Innsbruck spielerisch erkunden lässt.",
        },
        {
          title: 'Barrierefreiheit auch in Österreich',
          text: 'Der European Accessibility Act gilt in Österreich über das Barrierefreiheitsgesetz (BaFG). Ich gestalte und entwickle nach WCAG, damit deine Website für mehr Menschen funktioniert.',
        },
        {
          title: 'Unkompliziert über die Grenze',
          text: 'Gleiche Sprache, gleiche Zeitzone, kurze Video-Calls: Dass ich in Deutschland sitze, merkst du im Projektalltag kaum.',
        },
      ],
      faqTitle: 'Fragen zu Webdesign in Innsbruck',
      faqs: [
        {
          q: 'Woher kennst du Innsbruck?',
          a: "Ich habe meinen Master am MCI in Innsbruck gemacht und während des Studiums dort gelebt. In dieser Zeit entstand SIGHT'KICK, ein Konzept für eine App zur spielerischen Stadterkundung. Heute arbeite ich von Königsbrunn bei Augsburg aus.",
        },
        {
          q: 'Arbeitest du von Deutschland aus für Unternehmen in Innsbruck?',
          a: 'Ja. Projekte in Innsbruck und ganz Tirol betreue ich remote per Video-Call. Ein Treffen vor Ort ist nach Absprache möglich, die Anreise klären wir im Angebot.',
        },
        {
          q: 'Gilt der European Accessibility Act auch für Websites in Innsbruck?',
          a: 'Der European Accessibility Act gilt EU-weit, in Österreich umgesetzt durch das Barrierefreiheitsgesetz (BaFG). Ob dein Angebot in Innsbruck darunter fällt, klärst du am besten rechtlich; ich sorge dafür, dass sich Design und Umsetzung an WCAG orientieren.',
        },
        {
          q: 'Berätst du auch Unternehmen in Innsbruck zum Einsatz von KI?',
          a: 'Ja. In Workshops per Video finden wir die Stellen, an denen KI in deinem Alltag wirklich Zeit spart, testen passende Werkzeuge und legen Leitlinien für Datenschutz und Qualität fest. Für Innsbruck läuft das komplett remote.',
        },
        {
          q: 'Wie beginnt ein Projekt mit dir in Innsbruck?',
          a: 'Mit einem kostenlosen Erstgespräch per Video. Danach bekommst du ein Angebot mit Ablauf und Zeitplan, egal ob dein Unternehmen in Innsbruck, im Inntal oder anderswo in Tirol sitzt.',
        },
      ],
      ctaTitle: 'Dein Projekt in Innsbruck besprechen',
      ctaText:
        'Erzähl mir von deinem Vorhaben. Im kostenlosen Erstgespräch per Video klären wir, was du brauchst und wie wir es angehen.',
    },
    en: {
      metaTitle: 'Web design & development in Innsbruck | Erik Bergheimer',
      metaDescription:
        'Web design for Innsbruck from an MCI graduate: UX/UI design, Webflow, accessibility and AI consulting, working remotely from Germany.',
      footerLink: 'Web design Innsbruck',
      serviceLink: 'More on web design in Innsbruck',
      eyebrow: 'Remote for Innsbruck & Tyrol',
      title: 'Web design & development in Innsbruck',
      lead: "I got to know Innsbruck during my Master's at MCI. Today I design and build websites and apps from Germany, working remotely and directly with businesses in Tyrol.",
      localTitle: 'Remote for Innsbruck, across the border',
      localText:
        'I lived in Innsbruck while studying; today I work from Königsbrunn near Augsburg. Projects in Innsbruck and Tyrol run remotely over video calls, and meeting on site is possible by arrangement.',
      facts: [
        { term: 'Location', detail: 'Königsbrunn near Augsburg, Germany' },
        { term: 'Service area', detail: 'Innsbruck and Tyrol, on-site meetings by arrangement' },
        { term: 'Way of working', detail: 'Remote across the border, in German or English' },
      ],
      servicesTitle: 'Services for Innsbruck',
      servicesText: 'User-centred design, fast websites, accessibility and AI with a sense of proportion.',
      reasonsTitle: 'My connection to Innsbruck',
      reasons: [
        {
          title: 'Studied at MCI',
          text: "I did my Master's in Management, Communication & IT at MCI. That is also where SIGHT'KICK came about, an app concept that turns exploring Innsbruck into a game.",
        },
        {
          title: 'Accessibility in Austria too',
          text: 'In Austria the European Accessibility Act is implemented through the Accessibility Act (BaFG). I design and build to WCAG so your website works for more people.',
        },
        {
          title: 'Easy across the border',
          text: 'Same language, same time zone, short video calls: in day-to-day work you will hardly notice that I am based in Germany.',
        },
      ],
      faqTitle: 'Questions about web design in Innsbruck',
      faqs: [
        {
          q: 'How do you know Innsbruck?',
          a: "I did my Master's at MCI in Innsbruck and lived there during my studies. That is when SIGHT'KICK came about, a concept for an app that makes discovering the city playful. Today I work from Königsbrunn near Augsburg.",
        },
        {
          q: 'Do you work from Germany for businesses in Innsbruck?',
          a: 'Yes. I look after projects in Innsbruck and across Tyrol remotely over video calls. Meeting on site is possible by arrangement; travel is agreed in the offer.',
        },
        {
          q: 'Does the European Accessibility Act apply to websites in Innsbruck?',
          a: 'The European Accessibility Act applies across the EU and is implemented in Austria through the Accessibility Act (BaFG). Whether your service in Innsbruck is covered is best checked legally; I make sure design and build follow WCAG.',
        },
        {
          q: 'Do you also advise businesses in Innsbruck on using AI?',
          a: 'Yes. In video workshops we find the spots where AI really saves time in your daily work, test suitable tools and set guidelines for data protection and quality. For Innsbruck this runs entirely remotely.',
        },
        {
          q: 'How does a project with you in Innsbruck start?',
          a: 'With a free intro call over video. Afterwards you get an offer with process and timeline, whether your business is in Innsbruck, the Inn valley or elsewhere in Tyrol.',
        },
      ],
      ctaTitle: 'Discuss your Innsbruck project',
      ctaText:
        'Tell me about your plans. In a free intro call over video we clarify what you need and how we tackle it.',
    },
  },
  {
    path: '/webdesign-kempten',
    city: 'Kempten',
    services: ['webflow-development', 'brand-logo-design', 'website-process-optimization', 'ux-ui-design'],
    de: {
      metaTitle: 'Webdesign & Webentwicklung in Kempten | Erik Bergheimer',
      metaDescription:
        'Webdesign für Kempten und das Allgäu: Webflow-Websites, Logo und Marke, schlankere Abläufe. Remote aus Königsbrunn, Termine vor Ort nach Absprache.',
      footerLink: 'Webdesign Kempten',
      serviceLink: 'Mehr zu Webdesign in Kempten',
      eyebrow: 'Remote für Kempten & das Allgäu',
      title: 'Webdesign & Webentwicklung in Kempten',
      lead: 'Dein Betrieb ist gut, aber die Website erzählt davon zu wenig? Ich gestalte Marke und Website aus einem Guss und sorge dafür, dass Anfragen ohne Umwege bei dir ankommen.',
      localTitle: 'Remote für Kempten, Treffen nach Absprache',
      localText:
        'Ich sitze in Königsbrunn bei Augsburg, von dort ist Kempten gut erreichbar. Die laufende Arbeit erledigen wir remote per Video-Call, ein Termin in Kempten ist nach Absprache möglich.',
      facts: [
        { term: 'Standort', detail: 'Königsbrunn bei Augsburg' },
        { term: 'Einsatzgebiet', detail: 'Kempten und Allgäu, Termine vor Ort nach Absprache' },
        { term: 'Arbeitsweise', detail: 'Remote per Video-Call, auf Deutsch oder Englisch' },
      ],
      servicesTitle: 'Was ich für deinen Betrieb mache',
      servicesText: 'Website, Marke und Abläufe, die zusammenpassen und dir Arbeit abnehmen.',
      reasonsTitle: 'Warum sich das für deinen Betrieb lohnt',
      reasons: [
        {
          title: 'Für Mittelstand, Handwerk und Tourismus',
          text: 'Klare Seiten, die zeigen, was du kannst, und schnell laden, auch unterwegs auf dem Handy. Ohne Schnickschnack, mit dem Fokus auf Anfragen.',
        },
        {
          title: 'Marke und Website aus einem Guss',
          text: 'Logo, Farben und Schrift entwickle ich auf Wunsch gleich mit und setze sie direkt auf der Website um. So wirkt dein Auftritt überall gleich.',
        },
        {
          title: 'Weniger Handarbeit',
          text: 'Formulare, die die richtigen Angaben abfragen, und Automatisierungen, die Anfragen sortieren: So bleibt mehr Zeit für deine eigentliche Arbeit.',
        },
      ],
      faqTitle: 'Fragen zu Webdesign in Kempten',
      faqs: [
        {
          q: 'Bist du für Termine in Kempten vor Ort?',
          a: 'Nach Absprache ja, Kempten ist von Königsbrunn aus gut erreichbar. Die laufende Arbeit erledigen wir remote per Video-Call, das spart dir Zeit im Betriebsalltag.',
        },
        {
          q: 'Gestaltest du auch Logo und Marke für Betriebe in Kempten?',
          a: 'Ja. Für Betriebe in Kempten und im Allgäu entwickle ich auf Wunsch Logo, Farben und Schrift und setze sie direkt auf der Website um, damit alles zusammenpasst.',
        },
        {
          q: 'Kann die Website Anfragen für meinen Betrieb in Kempten vorsortieren?',
          a: 'Oft ja. Mit klaren Formularen und passenden Automatisierungen landen Anfragen strukturiert bei dir, statt im Postfach unterzugehen. Was für deinen Betrieb in Kempten sinnvoll ist, schauen wir uns gemeinsam an.',
        },
        {
          q: 'Eignet sich Webflow für Gastgeberinnen und Gastgeber rund um Kempten?',
          a: 'Webflow passt gut für schnelle, bildstarke Seiten, die du selbst pflegst, etwa Zimmer, Angebote oder Öffnungszeiten. Ein bestehendes Buchungssystem lässt sich oft einbinden; ob das für dein Angebot rund um Kempten klappt, klären wir im Erstgespräch.',
        },
        {
          q: 'Wie lange dauert eine neue Website für ein Unternehmen aus Kempten?',
          a: 'Das hängt vom Umfang ab und davon, wie schnell Texte und Bilder bereitstehen. Einen realistischen Zeitplan bekommst du nach dem Erstgespräch mit dem Angebot, damit du in Kempten verlässlich planen kannst.',
        },
      ],
      ctaTitle: 'Weniger Postfach, mehr Betrieb',
      ctaText:
        'Erzähl mir, wo es bei deiner Website hakt. Im kostenlosen Erstgespräch klären wir, was dein Betrieb braucht und wie wir anfangen.',
    },
    en: {
      metaTitle: 'Web design & development in Kempten | Erik Bergheimer',
      metaDescription:
        'Web design for Kempten and the Allgäu: Webflow websites, logo and brand, leaner processes. Remote from Königsbrunn, on-site meetings by arrangement.',
      footerLink: 'Web design Kempten',
      serviceLink: 'More on web design in Kempten',
      eyebrow: 'Remote for Kempten & the Allgäu',
      title: 'Web design & development in Kempten',
      lead: 'Your business is good, but your website does not show it? I design brand and website as one and make sure enquiries reach you without detours.',
      localTitle: 'Remote for Kempten, meetings by arrangement',
      localText:
        'I am based in Königsbrunn near Augsburg, which is within easy reach of Kempten. Ongoing work happens remotely over video calls, and a meeting in Kempten is possible by arrangement.',
      facts: [
        { term: 'Location', detail: 'Königsbrunn near Augsburg' },
        { term: 'Service area', detail: 'Kempten and the Allgäu, on-site meetings by arrangement' },
        { term: 'Way of working', detail: 'Remote over video calls, in German or English' },
      ],
      servicesTitle: 'What I do for your business',
      servicesText: 'Website, brand and processes that fit together and take work off your plate.',
      reasonsTitle: 'Why it pays off for your business',
      reasons: [
        {
          title: 'For SMEs, trades and tourism',
          text: 'Clear pages that show what you do and load fast, even on a phone on the go. No frills, with the focus on enquiries.',
        },
        {
          title: 'Brand and website as one',
          text: 'If you like, I develop logo, colours and typeface as well and apply them straight to the website, so your presence looks consistent everywhere.',
        },
        {
          title: 'Less manual work',
          text: 'Forms that ask for the right details and automations that sort enquiries: more time for the work that actually matters.',
        },
      ],
      faqTitle: 'Questions about web design in Kempten',
      faqs: [
        {
          q: 'Can you meet on site in Kempten?',
          a: 'By arrangement, yes; Kempten is within easy reach of Königsbrunn. Ongoing work happens remotely over video calls, which saves you time in your daily business.',
        },
        {
          q: 'Do you also design logos and brands for businesses in Kempten?',
          a: 'Yes. For businesses in Kempten and the Allgäu I can develop logo, colours and typeface and apply them straight to the website, so everything fits together.',
        },
        {
          q: 'Can the website pre-sort enquiries for my business in Kempten?',
          a: 'Often, yes. With clear forms and suitable automations, enquiries reach you in a structured way instead of getting lost in your inbox. We look together at what makes sense for your business in Kempten.',
        },
        {
          q: 'Is Webflow a good fit for hosts around Kempten?',
          a: 'Webflow works well for fast, image-rich pages you maintain yourself, such as rooms, offers or opening hours. An existing booking system can often be embedded; whether that works for your offer around Kempten we clarify in the intro call.',
        },
        {
          q: 'How long does a new website for a Kempten business take?',
          a: 'It depends on scope and on how quickly text and images are ready. You get a realistic timeline with the offer after the intro call, so you can plan reliably in Kempten.',
        },
      ],
      ctaTitle: 'Less inbox, more business',
      ctaText:
        'Tell me where your website is falling short. In a free intro call we clarify what your business needs and how to begin.',
    },
  },
];

/** Heimatseite (Augsburg), die Leistungsseiten im Ortssatz verlinken (AK-7) */
export const localPageForService = (slug: string) =>
  localPages[0]!.services.includes(slug) ? localPages[0] : undefined;
