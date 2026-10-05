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
      eyebrow: 'Freelancer für München',
      title: 'Webdesign & Webentwicklung in München',
      lead: 'Du willst eine Website auf Agenturniveau, aber ohne Agentur-Overhead? Ich gestalte und entwickle sie für dich, mit einer festen Ansprechperson von der ersten Idee bis zum Launch. Beispiele findest du bei den Projekten.',
      localTitle: 'Projekte in München, betreut aus Königsbrunn',
      localText:
        'Ich arbeite von Königsbrunn bei Augsburg aus und betreue Projekte in München remote. Abstimmungen laufen per Video-Call; wenn ein Treffen in München sinnvoll ist, vereinbaren wir es nach Absprache.',
      facts: [
        { term: 'Arbeitsplatz', detail: 'Königsbrunn bei Augsburg' },
        { term: 'Für München', detail: 'Remote, persönliche Termine nach Absprache' },
        { term: 'Ansprechperson', detail: 'Eine Person für Design und Entwicklung, auf Deutsch oder Englisch' },
      ],
      serviceTexts: {
        'webflow-development':
          'Eine Webflow-Website, gebaut von der Person, die sie auch gestaltet hat, ohne Übergabe zwischen Agentur-Abteilungen.',
        'ux-ui-design':
          'Konzept und Interface direkt mit dir abgestimmt, statt über Account-Management und mehrere Feedbackschleifen.',
        accessibility: 'Barrierefreiheit nach WCAG als Teil des Projekts, nicht als teurer Zusatzauftrag am Ende.',
        'website-process-optimization':
          'Ich schaue mir deine bestehende Website und Abläufe an und mache sie schlanker, ohne gleich einen kompletten Relaunch zu verkaufen.',
      },
      servicesTitle: 'Leistungen für dein Projekt',
      servicesText: 'Gestaltung, Entwicklung, Barrierefreiheit und schlankere Abläufe rund um deine Website.',
      reasonsTitle: 'Warum ein Freelancer statt einer Agentur?',
      reasons: [
        {
          title: 'Agenturqualität ohne Overhead',
          text: 'Konzept, Design und Umsetzung auf professionellem Niveau, ohne zusätzliche Projektmanagement-Schichten, die Zeit und Budget kosten. Wie das aussieht, zeigen die Projekte.',
        },
        {
          title: 'Eingespielt remote',
          text: 'Geteilte Figma-Dateien, kurze Video-Calls und eine Webflow-Vorschau, die du jederzeit öffnen kannst: Du siehst den Fortschritt, wann es dir passt.',
        },
        {
          title: 'Barrierefreiheit mitgedacht',
          text: 'Seit Juni 2025 gilt das Barrierefreiheitsstärkungsgesetz für viele digitale Angebote. Ich gestalte und entwickle nach WCAG, damit mehr Menschen deine Website nutzen können.',
        },
      ],
      faqTitle: 'Häufige Fragen aus München',
      faqs: [
        {
          q: 'Hast du ein Büro in München?',
          a: 'Nein. Ich arbeite von Königsbrunn bei Augsburg aus und betreue Projekte remote. Wenn ein Treffen vor Ort sinnvoll ist, etwa für einen Workshop, vereinbaren wir es nach Absprache.',
        },
        {
          q: 'Wie läuft ein Remote-Projekt für Kundinnen und Kunden in München ab?',
          a: 'Nach dem Erstgespräch bekommst du ein Angebot mit Ablauf und Zeitplan. Dann arbeiten wir in klaren Schritten: Konzept, Design in Figma, Umsetzung in Webflow, Abnahme. Feedback gibst du per Video-Call oder direkt in der Vorschau.',
        },
        {
          q: 'Lohnt sich ein Freelancer statt einer Agentur in München?',
          a: 'Für viele Websites ja: Du sprichst direkt mit der Person, die gestaltet und entwickelt, und zahlst keinen Agentur-Overhead. Braucht dein Projekt ein großes Team mit vielen Disziplinen, sage ich dir das offen.',
        },
        {
          q: 'Kann ich die Website nach dem Launch in München selbst pflegen?',
          a: 'Ja. Ich richte Webflow so ein, dass du Texte, Bilder und Beiträge selbst änderst. Zum Abschluss gibt es eine Einführung per Video, und auch danach bin ich für Fragen erreichbar.',
        },
        {
          q: 'Was kostet eine Website für ein Unternehmen in München?',
          a: 'Das hängt von Umfang, Inhalten und Funktionen ab. Nach dem kostenlosen Erstgespräch bekommst du ein klares Angebot, sodass du ohne Überraschungen budgetieren kannst.',
        },
      ],
      ctaTitle: 'Dein Projekt in München besprechen',
      ctaText:
        'Du hast eine Idee oder eine Website, die nicht mehr passt? Im kostenlosen Erstgespräch per Video klären wir Ziele, Umfang und den nächsten Schritt.',
    },
    en: {
      metaTitle: 'Web design & development in Munich | Erik Bergheimer',
      metaDescription:
        'Web design and development for Munich (München): Webflow websites, UX/UI design and accessibility, remote from Königsbrunn, meetings by arrangement.',
      footerLink: 'Web design Munich',
      serviceLink: 'More on web design in Munich',
      eyebrow: 'Freelance for Munich',
      title: 'Web design & development in Munich',
      lead: 'Want an agency-quality website without the agency overhead? I design and build it for you, with one fixed point of contact from the first idea to launch. You can see examples in the projects.',
      localTitle: 'Munich projects, run from Königsbrunn',
      localText:
        'I work from Königsbrunn near Augsburg and look after projects in Munich remotely. Check-ins happen over video calls; if meeting in Munich makes sense, we arrange it.',
      facts: [
        { term: 'Workplace', detail: 'Königsbrunn near Augsburg' },
        { term: 'For Munich', detail: 'Remote, in-person meetings by arrangement' },
        { term: 'Point of contact', detail: 'One person for design and development, in German or English' },
      ],
      serviceTexts: {
        'webflow-development':
          'A Webflow website built by the same person who designed it, with no handover between agency departments.',
        'ux-ui-design':
          'Concept and interface agreed directly with you, not through account managers and several rounds of feedback.',
        accessibility: 'WCAG accessibility as part of the project, not an expensive add-on at the very end.',
        'website-process-optimization':
          'I review your existing website and workflows and make them leaner, without pushing a full relaunch right away.',
      },
      servicesTitle: 'Services for your project',
      servicesText: 'Design, development, accessibility and leaner processes around your website.',
      reasonsTitle: 'Why a freelancer instead of an agency?',
      reasons: [
        {
          title: 'Agency quality, no overhead',
          text: 'Concept, design and build at a professional level, without extra layers of project management that cost time and budget. The projects show what that looks like.',
        },
        {
          title: 'Practised at remote work',
          text: 'Shared Figma files, short video calls and a Webflow preview you can open any time: you see the progress whenever it suits you.',
        },
        {
          title: 'Accessibility built in',
          text: 'Since June 2025 the German Accessibility Strengthening Act applies to many digital services. I design and build to WCAG so more people can use your website.',
        },
      ],
      faqTitle: 'Common questions from Munich',
      faqs: [
        {
          q: 'Do you have an office in Munich?',
          a: 'No. I work from Königsbrunn near Augsburg and look after projects remotely. If meeting on site makes sense, for a workshop for example, we arrange it.',
        },
        {
          q: 'How does a remote project for clients in Munich work?',
          a: 'After the intro call you get an offer with process and timeline. Then we work in clear steps: concept, design in Figma, build in Webflow, sign-off. You give feedback over video calls or directly in the preview.',
        },
        {
          q: 'Is a freelancer worth it compared to a Munich agency?',
          a: 'For many websites, yes: you talk directly to the person who designs and builds, and you pay no agency overhead. If your project needs a large team across many disciplines, I will tell you openly.',
        },
        {
          q: 'Can my Munich team maintain the website after launch?',
          a: 'Yes. I set up Webflow so you can change text, images and posts yourself. At the end there is a walkthrough over video, and afterwards I am still reachable if questions come up.',
        },
        {
          q: 'What does a website for a Munich business cost?',
          a: 'It depends on scope, content and features. After the free intro call you get a clear offer, so you can budget without surprises.',
        },
      ],
      ctaTitle: 'Talk about your Munich project',
      ctaText:
        'Got an idea, or a website that no longer fits? In a free intro call over video we clarify goals, scope and the next step.',
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
      eyebrow: 'Für Teams in Stuttgart',
      title: 'Webdesign & Webentwicklung in Stuttgart',
      lead: 'Deine Website soll mit deinem Unternehmen wachsen, ohne dass jede neue Seite neu erfunden wird? Ich gestalte und entwickle sie auf einer sauberen Grundlage aus Komponenten und klaren Regeln.',
      localTitle: 'So arbeiten wir zusammen, auch auf Distanz',
      localText:
        'Mein Arbeitsplatz ist in Königsbrunn bei Augsburg. Projekte in Stuttgart betreue ich remote mit festen Abstimmungsterminen per Video; für Kickoff oder Workshop komme ich nach Absprache auch nach Stuttgart.',
      facts: [
        { term: 'Sitz', detail: 'Königsbrunn bei Augsburg' },
        { term: 'Kickoff in Stuttgart', detail: 'Nach Absprache möglich, sonst per Video' },
        { term: 'Rhythmus', detail: 'Feste Video-Termine und eine stets aktuelle Vorschau' },
      ],
      serviceTexts: {
        'webflow-development':
          'Webflow-Websites aus wiederverwendbaren Komponenten, die eure IT nachvollziehen und euer Team selbst erweitern kann.',
        'ux-ui-design':
          'Interfaces für Produkte und Portale, abgestimmt mit Produktteam und Entwicklung statt im stillen Kämmerlein.',
        'design-systems':
          'Ein dokumentiertes Design-System in Figma, damit Produktteams und Mittelstand mit einer gemeinsamen Sprache arbeiten.',
        accessibility:
          'Barrierefreiheit von Anfang an in Komponenten und Regeln verankert, damit sie bei jeder neuen Seite mitkommt.',
      },
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
      faqTitle: 'Was Teams aus Stuttgart oft fragen',
      faqs: [
        {
          q: 'Kommst du für Termine nach Stuttgart?',
          a: 'Nach Absprache ja, etwa für einen Kickoff oder Workshop. Die Arbeit selbst läuft remote von Königsbrunn bei Augsburg aus; die Anreise klären wir vorab im Angebot.',
        },
        {
          q: 'Baust du Design-Systeme für Teams in Stuttgart?',
          a: 'Ja. Für Produktteams und mittelständische Unternehmen lege ich Komponenten, Farben, Typografie und Regeln in Figma an und dokumentiere sie, damit Design und Entwicklung dieselbe Grundlage nutzen.',
        },
        {
          q: 'Arbeitest du mit unserer IT in Stuttgart zusammen?',
          a: 'Ja. Ich stimme mich mit eurer IT oder Entwicklung ab, übergebe sauber und halte Entscheidungen schriftlich fest. Das funktioniert remote, ohne dass jemand anreisen muss.',
        },
        {
          q: 'Ist Webflow für ein Unternehmen aus Stuttgart sicher genug?',
          a: 'Webflow übernimmt Hosting, SSL-Zertifikat und Updates der Plattform, Plugins musst du nicht pflegen. Beim Datenschutz gilt: Webflow hostet auf Infrastruktur in den USA und bietet einen Auftragsverarbeitungsvertrag an. Ob das zu euren Anforderungen passt, prüfen wir gemeinsam; eine Rechtsberatung ersetzt das nicht.',
        },
        {
          q: 'Achtest du bei Websites für Stuttgart auf Barrierefreiheit?',
          a: 'Ja. Ich gestalte und entwickle nach WCAG und teste mit automatischen Prüfungen, mit der Tastatur und mit dem Screenreader. Eine Rechtsberatung ersetzt das nicht, es ist aber eine solide Grundlage.',
        },
      ],
      ctaTitle: 'Dein Vorhaben in Stuttgart besprechen',
      ctaText:
        'Woran arbeitet dein Team gerade? Im kostenlosen Erstgespräch schauen wir, ob Website, Interface oder Design-System der beste Startpunkt ist.',
    },
    en: {
      metaTitle: 'Web design & development in Stuttgart | Erik Bergheimer',
      metaDescription:
        'Web design, Webflow development and design systems for Stuttgart: remote from Königsbrunn near Augsburg, on-site meetings by arrangement.',
      footerLink: 'Web design Stuttgart',
      serviceLink: 'More on web design in Stuttgart',
      eyebrow: 'For teams in Stuttgart',
      title: 'Web design & development in Stuttgart',
      lead: 'Want a website that grows with your company without reinventing every new page? I design and build it on a clean foundation of components and clear rules.',
      localTitle: 'How we work together, even at a distance',
      localText:
        'I am based in Königsbrunn near Augsburg. I look after projects in Stuttgart remotely with regular video check-ins; for a kick-off or workshop I can come to Stuttgart by arrangement.',
      facts: [
        { term: 'Base', detail: 'Königsbrunn near Augsburg' },
        { term: 'Kick-off in Stuttgart', detail: 'Possible by arrangement, otherwise over video' },
        { term: 'Rhythm', detail: 'Regular video check-ins and an always up-to-date preview' },
      ],
      serviceTexts: {
        'webflow-development':
          'Webflow websites made of reusable components that your IT can follow and your team can extend on its own.',
        'ux-ui-design':
          'Interfaces for products and portals, worked out with your product team and developers rather than behind closed doors.',
        'design-systems':
          'A documented design system in Figma, so product teams and mid-sized companies work from one shared language.',
        accessibility:
          'Accessibility anchored in components and rules from the start, so it comes along with every new page.',
      },
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
      faqTitle: 'What Stuttgart teams often ask',
      faqs: [
        {
          q: 'Do you come to Stuttgart for meetings?',
          a: 'By arrangement, yes, for a kick-off or workshop for example. The work itself happens remotely from Königsbrunn near Augsburg; travel is agreed in the offer.',
        },
        {
          q: 'Do you build design systems for teams in Stuttgart?',
          a: 'Yes. For product teams and mid-sized companies I set up components, colours, typography and rules in Figma and document them, so design and development share the same foundation.',
        },
        {
          q: 'Will you work with our IT team in Stuttgart?',
          a: 'Yes. I coordinate with your IT or developers, hand over cleanly and keep decisions in writing. It all works remotely, without anyone having to travel.',
        },
        {
          q: 'Is Webflow secure enough for a Stuttgart company?',
          a: 'Webflow handles hosting, the SSL certificate and platform updates, and there are no plugins to maintain. On data protection: Webflow hosts on US-based infrastructure and offers a data processing agreement. We check together whether that fits your requirements; this is not legal advice.',
        },
        {
          q: 'Do you consider accessibility for websites in Stuttgart?',
          a: 'Yes. I design and build to WCAG and test with automated checks, the keyboard and a screen reader. It does not replace legal advice, but it gives you a solid foundation.',
        },
      ],
      ctaTitle: 'Discuss your Stuttgart project',
      ctaText:
        'What is your team working on right now? In a free intro call we look at whether a website, an interface or a design system is the best place to start.',
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
      eyebrow: 'Innsbruck & Tirol',
      title: 'Webdesign & Webentwicklung in Innsbruck',
      lead: 'Innsbruck kenne ich aus meinem Masterstudium am MCI. Heute gestalte und entwickle ich Websites von Deutschland aus, für Unternehmen in Tirol remote und ohne Umwege.',
      localTitle: 'Vom MCI nach Königsbrunn, für Tirol weiter da',
      localText:
        'Während meines Studiums habe ich in Innsbruck gelebt, heute arbeite ich von Königsbrunn bei Augsburg aus. Projekte in Innsbruck und Tirol laufen remote per Video-Call, ein Treffen vor Ort ist nach Absprache möglich.',
      facts: [
        { term: 'Heute', detail: 'Königsbrunn bei Augsburg, Deutschland' },
        { term: 'Bezug zu Innsbruck', detail: 'Masterstudium am MCI' },
        { term: 'Zusammenarbeit', detail: 'Remote über die Grenze, Treffen nach Absprache' },
      ],
      serviceTexts: {
        'ux-ui-design':
          "Nutzerzentriertes Design, wie ich es am MCI vertieft und bei SIGHT'KICK für Gäste in Innsbruck angewendet habe.",
        'webflow-development':
          'Schnelle Webflow-Websites für Unternehmen in Tirol, die du nach dem Launch selbst pflegst, auch ohne Agentur vor Ort.',
        accessibility:
          'Umsetzung nach WCAG, damit deine Website den Anforderungen des European Accessibility Act näherkommt, in Österreich geregelt im BaFG.',
        'ai-consulting':
          'Workshops per Video, in denen wir herausfinden, wo KI deinem Team in Tirol wirklich Arbeit abnimmt und wo nicht.',
      },
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
          text: 'Wir sprechen beide Deutsch, sitzen in derselben Zeitzone und klären vieles in kurzen Video-Calls: Dass ich in Deutschland arbeite, merkst du im Projektalltag kaum.',
        },
      ],
      faqTitle: 'Fragen aus Innsbruck und Tirol',
      faqs: [
        {
          q: 'Woher kennst du Innsbruck?',
          a: "Ich habe meinen Master am MCI gemacht und während des Studiums dort gelebt. In dieser Zeit entstand SIGHT'KICK, ein Konzept für eine App zur spielerischen Stadterkundung. Heute arbeite ich von Königsbrunn bei Augsburg aus.",
        },
        {
          q: 'Arbeitest du von Deutschland aus für Unternehmen in Innsbruck?',
          a: 'Ja. Projekte in ganz Tirol betreue ich remote per Video-Call. Ein Treffen vor Ort ist nach Absprache möglich, die Anreise klären wir im Angebot.',
        },
        {
          q: 'Gilt der European Accessibility Act auch für Websites in Innsbruck?',
          a: 'Der European Accessibility Act gilt EU-weit und ist in Österreich durch das Barrierefreiheitsgesetz (BaFG) umgesetzt. Ob dein Angebot darunter fällt, klärst du am besten rechtlich; ich sorge dafür, dass sich Design und Umsetzung an WCAG orientieren.',
        },
        {
          q: 'Berätst du auch Unternehmen in Innsbruck zum Einsatz von KI?',
          a: 'Ja. In Workshops per Video finden wir die Stellen, an denen KI in deinem Alltag wirklich Zeit spart, testen passende Werkzeuge und legen Leitlinien für Datenschutz und Qualität fest.',
        },
        {
          q: 'Wie beginnt ein Projekt mit dir in Innsbruck?',
          a: 'Mit einem kostenlosen Erstgespräch per Video. Danach bekommst du ein Angebot mit Ablauf und Zeitplan, egal ob du in der Stadt, im Inntal oder anderswo in Tirol sitzt.',
        },
      ],
      ctaTitle: 'Dein Projekt in Innsbruck besprechen',
      ctaText:
        'Schreib mir ein paar Zeilen zu deinem Vorhaben. Im kostenlosen Erstgespräch per Video klären wir, was du brauchst und wie wir es angehen.',
    },
    en: {
      metaTitle: 'Web design & development in Innsbruck | Erik Bergheimer',
      metaDescription:
        'Web design for Innsbruck from an MCI graduate: UX/UI design, Webflow, accessibility and AI consulting, working remotely from Germany.',
      footerLink: 'Web design Innsbruck',
      serviceLink: 'More on web design in Innsbruck',
      eyebrow: 'Innsbruck & Tyrol',
      title: 'Web design & development in Innsbruck',
      lead: "I got to know Innsbruck during my Master's at MCI. Today I design and build websites from Germany, working remotely and directly with businesses in Tyrol.",
      localTitle: 'From MCI to Königsbrunn, still there for Tyrol',
      localText:
        'I lived in Innsbruck while studying; today I work from Königsbrunn near Augsburg. Projects in Innsbruck and Tyrol run remotely over video calls, and meeting on site is possible by arrangement.',
      facts: [
        { term: 'Today', detail: 'Königsbrunn near Augsburg, Germany' },
        { term: 'Link to Innsbruck', detail: "Master's degree at MCI" },
        { term: 'Working together', detail: 'Remote across the border, meetings by arrangement' },
      ],
      serviceTexts: {
        'ux-ui-design':
          "User-centred design as I deepened it at MCI and applied it in SIGHT'KICK for visitors to Innsbruck.",
        'webflow-development':
          'Fast Webflow websites for businesses in Tyrol that you maintain yourself after launch, no local agency needed.',
        accessibility:
          'Building to WCAG so your website moves closer to the European Accessibility Act requirements, which Austria regulates in the BaFG.',
        'ai-consulting':
          'Video workshops in which we find out where AI really takes work off your team in Tyrol, and where it does not.',
      },
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
          text: 'We can work in German, we share a time zone and many things get settled in short video calls: in day-to-day work you will hardly notice that I am based in Germany.',
        },
      ],
      faqTitle: 'Questions from Innsbruck and Tyrol',
      faqs: [
        {
          q: 'How do you know Innsbruck?',
          a: "I did my Master's at MCI and lived in the city during my studies. That is when SIGHT'KICK came about, a concept for an app that makes discovering the city playful. Today I work from Königsbrunn near Augsburg.",
        },
        {
          q: 'Do you work from Germany for businesses in Innsbruck?',
          a: 'Yes. I look after projects across Tyrol remotely over video calls. Meeting on site is possible by arrangement; travel is agreed in the offer.',
        },
        {
          q: 'Does the European Accessibility Act apply to websites in Innsbruck?',
          a: 'The European Accessibility Act applies across the EU and is implemented in Austria through the Accessibility Act (BaFG). Whether your service is covered is best checked legally; I make sure design and build follow WCAG.',
        },
        {
          q: 'Do you also advise businesses in Innsbruck on using AI?',
          a: 'Yes. In video workshops we find the spots where AI really saves time in your daily work, test suitable tools and set guidelines for data protection and quality.',
        },
        {
          q: 'How does a project with you in Innsbruck start?',
          a: 'With a free intro call over video. Afterwards you get an offer with process and timeline, whether you are in the city, the Inn valley or elsewhere in Tyrol.',
        },
      ],
      ctaTitle: 'Discuss your Innsbruck project',
      ctaText:
        'Drop me a few lines about your plans. In a free intro call over video we clarify what you need and how we tackle it.',
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
      eyebrow: 'Kempten & Allgäu',
      title: 'Webdesign & Webentwicklung in Kempten',
      lead: 'Dein Betrieb ist gut, aber die Website erzählt davon zu wenig? Ich gestalte Marke und Website aus einem Guss und sorge dafür, dass Anfragen ohne Umwege bei dir ankommen.',
      localTitle: 'Gut erreichbar, meistens per Video',
      localText:
        'Ich sitze in Königsbrunn bei Augsburg, von dort ist Kempten gut erreichbar. Die laufende Arbeit erledigen wir remote per Video-Call, ein Termin in Kempten ist nach Absprache möglich.',
      facts: [
        { term: 'Von wo', detail: 'Königsbrunn bei Augsburg' },
        { term: 'Region', detail: 'Kempten und Allgäu, Termine vor Ort nach Absprache' },
        { term: 'Im Alltag', detail: 'Video-Calls, die in deinen Betriebsablauf passen' },
      ],
      serviceTexts: {
        'webflow-development':
          'Eine Webflow-Website, auf der du Angebote, Saisonzeiten oder Öffnungszeiten selbst änderst, ohne jedes Mal jemanden zu beauftragen.',
        'brand-logo-design':
          'Ein Auftritt für Handwerk, Mittelstand oder Gastgewerbe im Allgäu, der vom Firmenschild bis zur Website zusammenpasst.',
        'website-process-optimization':
          'Formulare und Abläufe, die Anfragen sortieren, damit im Betriebsalltag weniger Zeit im Postfach verloren geht.',
        'ux-ui-design': 'Seiten, die Kundinnen, Kunden und Gäste auch unterwegs auf dem Handy schnell zum Ziel führen.',
      },
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
      faqTitle: 'Gut zu wissen für Betriebe in Kempten',
      faqs: [
        {
          q: 'Bist du für Termine in Kempten vor Ort?',
          a: 'Nach Absprache ja, von Königsbrunn aus bin ich gut dort. Die laufende Arbeit erledigen wir remote per Video-Call, das spart dir Zeit im Betriebsalltag.',
        },
        {
          q: 'Gestaltest du auch Logo und Marke für Betriebe in Kempten?',
          a: 'Ja. Auf Wunsch entwickle ich Logo, Farben und Schrift und setze sie direkt auf der Website um, damit alles zusammenpasst.',
        },
        {
          q: 'Kann die Website Anfragen für meinen Betrieb in Kempten vorsortieren?',
          a: 'Oft ja. Mit klaren Formularen und passenden Automatisierungen landen Anfragen strukturiert bei dir, statt im Postfach unterzugehen. Was für deinen Betrieb sinnvoll ist, schauen wir uns gemeinsam an.',
        },
        {
          q: 'Eignet sich Webflow für Gastgeberinnen und Gastgeber in Kempten und Umland?',
          a: 'Webflow passt gut für schnelle, bildstarke Seiten, die du selbst pflegst, etwa Zimmer, Angebote oder Öffnungszeiten. Ein bestehendes Buchungssystem lässt sich oft einbinden; ob das für dein Angebot klappt, klären wir im Erstgespräch.',
        },
        {
          q: 'Wie lange dauert eine neue Website für ein Unternehmen aus Kempten?',
          a: 'Das hängt vom Umfang ab und davon, wie schnell Texte und Bilder bereitstehen. Einen realistischen Zeitplan bekommst du nach dem Erstgespräch mit dem Angebot.',
        },
      ],
      ctaTitle: 'Weniger Postfach, mehr Betrieb',
      ctaText:
        'Wo hakt es bei deiner Website gerade? Im kostenlosen Erstgespräch klären wir, was dein Betrieb braucht und wie wir anfangen.',
    },
    en: {
      metaTitle: 'Web design & development in Kempten | Erik Bergheimer',
      metaDescription:
        'Web design for Kempten and the Allgäu: Webflow websites, logo and brand, leaner processes. Remote from Königsbrunn, on-site meetings by arrangement.',
      footerLink: 'Web design Kempten',
      serviceLink: 'More on web design in Kempten',
      eyebrow: 'Kempten & the Allgäu',
      title: 'Web design & development in Kempten',
      lead: 'Your business is good, but your website does not show it? I design brand and website as one and make sure enquiries reach you without detours.',
      localTitle: 'Within easy reach, mostly over video',
      localText:
        'I am based in Königsbrunn near Augsburg, which is within easy reach of Kempten. Ongoing work happens remotely over video calls, and a meeting in Kempten is possible by arrangement.',
      facts: [
        { term: 'Based in', detail: 'Königsbrunn near Augsburg' },
        { term: 'Region', detail: 'Kempten and the Allgäu, on-site meetings by arrangement' },
        { term: 'Day to day', detail: 'Video calls that fit around your working day' },
      ],
      serviceTexts: {
        'webflow-development':
          'A Webflow website where you update offers, seasonal dates or opening hours yourself, without hiring someone every time.',
        'brand-logo-design':
          'A look for trades, SMEs or hospitality in the Allgäu that fits together from the shop sign to the website.',
        'website-process-optimization':
          'Forms and workflows that sort enquiries, so less of your working day disappears into the inbox.',
        'ux-ui-design':
          'Pages that get customers and guests where they want to go quickly, even on a phone on the move.',
      },
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
      faqTitle: 'Good to know for businesses in Kempten',
      faqs: [
        {
          q: 'Can you meet on site in Kempten?',
          a: 'By arrangement, yes; it is within easy reach of Königsbrunn. Ongoing work happens remotely over video calls, which saves you time in your daily business.',
        },
        {
          q: 'Do you also design logos and brands for businesses in Kempten?',
          a: 'Yes. If you like, I develop logo, colours and typeface and apply them straight to the website, so everything fits together.',
        },
        {
          q: 'Can the website pre-sort enquiries for my business in Kempten?',
          a: 'Often, yes. With clear forms and suitable automations, enquiries reach you in a structured way instead of getting lost in your inbox. We look together at what makes sense for your business.',
        },
        {
          q: 'Is Webflow a good fit for hosts in and around Kempten?',
          a: 'Webflow works well for fast, image-rich pages you maintain yourself, such as rooms, offers or opening hours. An existing booking system can often be embedded; whether that works for your offer we clarify in the intro call.',
        },
        {
          q: 'How long does a new website for a Kempten business take?',
          a: 'It depends on scope and on how quickly text and images are ready. You get a realistic timeline with the offer after the intro call.',
        },
      ],
      ctaTitle: 'Less inbox, more business',
      ctaText:
        'Where is your website falling short right now? In a free intro call we clarify what your business needs and how to begin.',
    },
  },
];

/** Heimatseite (Augsburg), die Leistungsseiten im Ortssatz verlinken (AK-7) */
export const localPageForService = (slug: string) =>
  localPages[0]!.services.includes(slug) ? localPages[0] : undefined;
