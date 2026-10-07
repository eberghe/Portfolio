import type { Locale } from '@/lib/i18n';
import type { Faq } from './faq';

// Ausführliche Inhalte der Leistungs-Unterseiten nach Vorlage designme.agency (Issue #16).
// Siehe functions/seiten/leistungen.md (Umbau). Entwürfe: Erik prüft sie; Platzhalter sind mit TODO(Erik) markiert.

export interface ServiceStep {
  title: string;
  /** Typische Dauer, z. B. „Woche 1“ oder „1 bis 2 Tage“ */
  duration: string;
  text: string;
  /** Typische Ergebnisse dieses Schritts (2 bis 4) */
  outputs: string[];
}

export interface ServicePackage {
  name: string;
  /** Für wen das Paket gedacht ist, ein Satz */
  for: string;
  /** Enthaltene Punkte (4 bis 7) */
  items: string[];
}

export interface ServiceDetailText {
  /** Überline über der h1 */
  eyebrow: string;
  /** h1 mit Suchbegriff, z. B. „Webflow-Entwicklung in Augsburg“ */
  headline: string;
  /** Ein Satz unter der h1 */
  lead: string;
  /** Erste Karte in „Warum mit mir“, passend zur Leistung (leistungen.md AK-27) */
  whyFocus: { title: string; text: string };
  /** Überschrift und Einleitung des Ablaufs */
  processTitle: string;
  steps: ServiceStep[];
  /** Überschrift „Was enthalten ist“ als Satz, z. B. „Eine Website ist mehr als schöne Seiten.“ */
  includedTitle: string;
  /** Genau 6 Karten */
  included: { title: string; text: string }[];
  packages: [ServicePackage, ServicePackage];
  faqs: Faq['de'][];
}

export interface ServiceDetail extends Record<Locale, ServiceDetailText> {
  slug: string;
  /** Passendes Projekt als Beleg (id aus lib/content/projects.ts) oder null */
  project: string | null;
  /** Werkzeuge (Namen aus lib/content/about.ts tools oder freie Namen) */
  tools: string[];
}

export const serviceDetails: ServiceDetail[] = [
  // TODO(Erik): prüfen, Dauer der Schritte (4 bis 8 Wochen) und Paketumfang
  {
    slug: 'ux-ui-design',
    project: 'sightkick',
    tools: ['Figma', 'Lovable', 'Claude', 'Affinity'],
    de: {
      eyebrow: 'UX/UI Design in Augsburg',
      headline: 'UX/UI Design in Augsburg: Interfaces, die einfach funktionieren',
      lead: 'Für Unternehmen und Start-ups, die ein Produkt wollen, das ihre Zielgruppe ohne Erklärung versteht und gern nutzt.',
      whyFocus: {
        title: 'Nutzer zuerst, nicht Annahmen',
        text: 'Ich teste Entwürfe früh mit echten Menschen, damit Entscheidungen auf Beobachtung beruhen und nicht auf Bauchgefühl.',
      },
      processTitle: 'Von der ersten Idee zum fertigen Interface in 4 bis 8 Wochen',
      steps: [
        {
          title: 'Erstgespräch und Briefing',
          duration: 'Woche 1',
          text: 'Wir klären Ziele, Zielgruppe und Rahmen. Ich schaue mir an, was es schon gibt, und wir legen fest, welche Fragen das Projekt beantworten muss.',
          outputs: ['Projektbriefing', 'Zeitplan', 'Offene Fragen'],
        },
        {
          title: 'Nutzeranalyse',
          duration: 'Woche 1 bis 2',
          text: 'Interviews, Analyse bestehender Daten oder ein kurzer Blick auf den Wettbewerb: je nach Projekt so viel Research wie nötig, damit wir nicht raten müssen.',
          outputs: ['Personas', 'User Journeys', 'Erkenntnisse'],
        },
        {
          title: 'Wireframes und Prototyp',
          duration: 'Woche 2 bis 4',
          text: 'Ich baue die Struktur als Wireframes und daraus einen klickbaren Prototyp. So siehst du früh, wie sich das Produkt anfühlt, bevor es schön sein muss.',
          outputs: ['Informationsarchitektur', 'Wireframes', 'Klickbarer Prototyp'],
        },
        {
          title: 'Visual Design und Tests',
          duration: 'Woche 4 bis 7',
          text: 'Das Interface bekommt Farbe, Typografie und Details. Mit echten Nutzerinnen und Nutzern teste ich die wichtigsten Abläufe und verbessere, was hakt.',
          outputs: ['UI-Design aller Screens', 'Usability-Test', 'Überarbeitungen'],
        },
        {
          title: 'Übergabe an die Entwicklung',
          duration: 'Woche 7 bis 8',
          text: 'Ich bereite die Figma-Dateien sauber auf, beschreibe Zustände und Verhalten und stehe der Entwicklung für Rückfragen zur Verfügung.',
          outputs: ['Figma-Handoff', 'Komponenten', 'Begleitung der Umsetzung'],
        },
      ],
      includedTitle: 'Gutes Design beginnt vor dem ersten Pixel.',
      included: [
        {
          title: 'Nutzerforschung',
          text: 'Interviews und Analysen, damit Entscheidungen auf echten Bedürfnissen beruhen statt auf Vermutungen.',
        },
        {
          title: 'Informationsarchitektur',
          text: 'Eine klare Struktur, in der Inhalte dort liegen, wo deine Zielgruppe sie sucht.',
        },
        {
          title: 'Klickbare Prototypen',
          text: 'Du erlebst Abläufe früh in Figma und gibst Feedback, bevor etwas programmiert wird.',
        },
        {
          title: 'Visual Design',
          text: 'Ein stimmiges Interface, das zu deiner Marke passt und auf allen Bildschirmgrößen funktioniert.',
        },
        {
          title: 'Barrierefreiheit mitgedacht',
          text: 'Kontraste, Fokus und Struktur nach WCAG plane ich von Anfang an ein.',
        },
        {
          title: 'Sauberes Handoff',
          text: 'Geordnete Dateien und klare Beschreibungen, damit die Entwicklung ohne Rätselraten loslegen kann.',
        },
      ],
      packages: [
        {
          name: 'Kompakt',
          for: 'Für eine Landingpage, eine einzelne Funktion oder die Überarbeitung bestehender Screens.',
          items: [
            'Kurzes Briefing',
            'Wireframes der wichtigsten Seiten',
            'UI-Design in Figma',
            'Eine Feedbackrunde',
            'Übergabe der Dateien',
          ],
        },
        {
          name: 'Umfassend',
          for: 'Für ein neues digitales Produkt oder einen Relaunch mit Research und Tests.',
          items: [
            'Briefing und Zielklärung',
            'Nutzeranalyse und Personas',
            'Informationsarchitektur und Wireframes',
            'Klickbarer Prototyp',
            'Usability-Test mit echten Nutzerinnen und Nutzern',
            'UI-Design aller Screens',
            'Handoff und Begleitung der Entwicklung',
          ],
        },
      ],
      faqs: [
        {
          q: 'Was kostet UX/UI Design bei dir?',
          a: 'Das hängt vom Umfang ab, also von der Zahl der Screens, dem Research-Bedarf und den Tests. Nach dem kostenlosen Erstgespräch bekommst du ein konkretes Angebot mit klarem Leistungsumfang.',
        },
        {
          q: 'Brauche ich wirklich Nutzerforschung?',
          a: 'Nicht immer in großem Umfang. Schon wenige Gespräche mit echten Nutzerinnen und Nutzern zeigen oft, wo es hakt. Ich schlage dir so viel Research vor, wie dein Projekt braucht, und nicht mehr.',
        },
        {
          q: 'Was muss ich für den Start mitbringen?',
          a: 'Ein Ziel, deine Zielgruppe und vorhandenes Material wie Texte, Logo oder bestehende Designs. Hilfreich ist eine feste Ansprechperson, die Feedback zügig geben kann.',
        },
        {
          q: 'Setzt du das Design auch um?',
          a: 'Ja, Websites setze ich direkt in Webflow um. Für Apps oder individuelle Software übergebe ich saubere Figma-Dateien an dein Entwicklungsteam und begleite die Umsetzung.',
        },
        {
          q: 'Arbeitest du vor Ort in Augsburg?',
          a: 'Workshops und Nutzerinterviews mache ich gern vor Ort in Augsburg und Umgebung. Der Rest läuft remote mit regelmäßigen Terminen, das funktioniert deutschlandweit gut.',
        },
      ],
    },
    en: {
      eyebrow: 'UX/UI design in Augsburg',
      headline: 'UX/UI design in Augsburg: interfaces that simply work',
      lead: 'For companies and start-ups who want a product their audience understands without explanation and enjoys using.',
      whyFocus: {
        title: 'Users first, not assumptions',
        text: 'I test designs early with real people, so decisions rest on what we observe rather than gut feeling.',
      },
      processTitle: 'From first idea to finished interface in 4 to 8 weeks',
      steps: [
        {
          title: 'Intro call and briefing',
          duration: 'Week 1',
          text: 'We clarify goals, audience and scope. I look at what already exists, and we agree on the questions the project needs to answer.',
          outputs: ['Project brief', 'Timeline', 'Open questions'],
        },
        {
          title: 'User research',
          duration: 'Weeks 1 to 2',
          text: 'Interviews, existing data or a quick look at competitors: as much research as the project needs, so we do not have to guess.',
          outputs: ['Personas', 'User journeys', 'Key insights'],
        },
        {
          title: 'Wireframes and prototype',
          duration: 'Weeks 2 to 4',
          text: 'I build the structure as wireframes and turn it into a clickable prototype. You see early how the product feels, before it needs to look polished.',
          outputs: ['Information architecture', 'Wireframes', 'Clickable prototype'],
        },
        {
          title: 'Visual design and testing',
          duration: 'Weeks 4 to 7',
          text: 'The interface gets colour, typography and detail. I test the key flows with real users and fix whatever gets in their way.',
          outputs: ['UI design of all screens', 'Usability test', 'Revisions'],
        },
        {
          title: 'Developer handoff',
          duration: 'Weeks 7 to 8',
          text: 'I prepare tidy Figma files, document states and behaviour, and stay available to the developers for questions.',
          outputs: ['Figma handoff', 'Components', 'Support during build'],
        },
      ],
      includedTitle: 'Good design starts before the first pixel.',
      included: [
        {
          title: 'User research',
          text: 'Interviews and analysis, so decisions rest on real needs rather than assumptions.',
        },
        {
          title: 'Information architecture',
          text: 'A clear structure that puts content where your users look for it.',
        },
        {
          title: 'Clickable prototypes',
          text: 'You experience flows early in Figma and give feedback before anything is coded.',
        },
        { title: 'Visual design', text: 'A consistent interface that fits your brand and works on every screen size.' },
        {
          title: 'Accessibility built in',
          text: 'Contrast, focus and structure following WCAG are planned in from the start.',
        },
        { title: 'Clean handoff', text: 'Organised files and clear notes, so developers can start without guesswork.' },
      ],
      packages: [
        {
          name: 'Compact',
          for: 'For a landing page, a single feature or reworking existing screens.',
          items: [
            'Short briefing',
            'Wireframes of key pages',
            'UI design in Figma',
            'One round of feedback',
            'File handover',
          ],
        },
        {
          name: 'Comprehensive',
          for: 'For a new digital product or a relaunch with research and testing.',
          items: [
            'Briefing and goal setting',
            'User research and personas',
            'Information architecture and wireframes',
            'Clickable prototype',
            'Usability test with real users',
            'UI design of all screens',
            'Handoff and support during development',
          ],
        },
      ],
      faqs: [
        {
          q: 'How much does UX/UI design cost?',
          a: 'It depends on the scope: the number of screens, the research needed and testing. After the free intro call you get a concrete quote with a clearly defined scope.',
        },
        {
          q: 'Do I really need user research?',
          a: 'Not always on a large scale. A handful of conversations with real users often shows where things go wrong. I suggest as much research as your project needs, and no more.',
        },
        {
          q: 'What do I need to bring?',
          a: 'A goal, your target audience and existing material such as copy, logo or current designs. A fixed contact person who can give feedback quickly helps a lot.',
        },
        {
          q: 'Do you also build the design?',
          a: 'Yes, I build websites directly in Webflow. For apps or custom software I hand over clean Figma files to your development team and support the build.',
        },
        {
          q: 'Do you work on site in Augsburg?',
          a: 'I am happy to run workshops and user interviews on site in and around Augsburg. Everything else runs remotely with regular check-ins, which works well across Germany.',
        },
      ],
    },
  },
  // TODO(Erik): prüfen, Dauer (2 bis 6 Wochen), Hosting/Webflow-Plan-Hinweis und ob Pflege/Wartung angeboten wird
  {
    slug: 'webflow-development',
    project: 'webflow',
    tools: ['Webflow', 'Figma', 'VS Code', 'Claude'],
    de: {
      eyebrow: 'Webflow-Entwicklung',
      headline: 'Webflow-Entwicklung in Augsburg: schnelle Websites, die du selbst pflegst',
      lead: 'Am Ende hast du eine Website, die schnell lädt, auf jedem Gerät gut aussieht und die du ohne Agentur selbst aktualisierst.',
      whyFocus: {
        title: 'Sauber gebaut, leicht zu pflegen',
        text: 'Klare Klassen, saubere Struktur und ein CMS, das dein Team ohne mich bedienen kann.',
      },
      processTitle: 'Vom Erstgespräch zur fertigen Website in 2 bis 6 Wochen',
      steps: [
        {
          title: 'Erstgespräch und Struktur',
          duration: 'Woche 1',
          text: 'Wir klären Ziele, Seiten und Inhalte. Daraus entsteht eine Sitemap und ein Plan, welche Inhalte du später selbst über das CMS pflegst.',
          outputs: ['Sitemap', 'Content-Plan', 'Zeitplan'],
        },
        {
          title: 'Design',
          duration: 'Woche 1 bis 2',
          text: 'Ich gestalte die Seiten in Figma oder übernehme ein bestehendes Design. Wir stimmen es ab, bevor der Aufbau in Webflow beginnt.',
          outputs: ['Seitendesigns in Figma', 'Mobile Ansichten', 'Freigabe'],
        },
        {
          title: 'Aufbau in Webflow',
          duration: 'Woche 2 bis 4',
          text: 'Ich baue die Website mit einem sauberen Klassensystem, richte das CMS ein und setze Interactions sparsam und gezielt ein.',
          outputs: ['Responsive Website', 'CMS-Collections', 'Interactions'],
        },
        {
          title: 'Feinschliff und Tests',
          duration: 'Woche 4 bis 5',
          text: 'Ich teste auf verschiedenen Geräten und Browsern, prüfe Ladezeit, Barrierefreiheit und SEO-Grundlagen und baue dein Feedback ein.',
          outputs: ['Gerätetests', 'SEO-Einstellungen', 'Korrekturen'],
        },
        {
          title: 'Launch und Einweisung',
          duration: 'Woche 5 bis 6',
          text: 'Wir schalten die Website auf deiner Domain live. In einer kurzen Einweisung zeige ich dir, wie du Inhalte selbst änderst.',
          outputs: ['Live-Schaltung', 'Weiterleitungen', 'Einweisung ins CMS'],
        },
      ],
      includedTitle: 'Eine Website ist mehr als schöne Seiten.',
      included: [
        {
          title: 'Responsive Umsetzung',
          text: 'Deine Website funktioniert auf Smartphone, Tablet und Desktop gleich gut.',
        },
        {
          title: 'CMS-Einrichtung',
          text: 'Blog, Projekte oder Team pflegst du selbst, ohne Code und ohne mich anrufen zu müssen.',
        },
        {
          title: 'Interactions mit Maß',
          text: 'Animationen, die Inhalte unterstützen und die Ladezeit nicht ausbremsen.',
        },
        {
          title: 'SEO-Grundlagen',
          text: 'Saubere Überschriften, Meta-Daten, Sitemap und sprechende URLs von Anfang an.',
        },
        { title: 'Performance', text: 'Optimierte Bilder und schlanker Aufbau für kurze Ladezeiten.' },
        { title: 'Barrierefreiheit', text: 'Kontraste, Tastaturbedienung und Alternativtexte orientiert an WCAG.' },
      ],
      packages: [
        {
          name: 'Landingpage',
          for: 'Für eine einzelne Seite zu einem Angebot, einer Kampagne oder einem Event.',
          items: [
            'Kurzes Briefing',
            'Design einer Seite',
            'Responsive Umsetzung in Webflow',
            'SEO-Grundeinstellungen',
            'Live-Schaltung',
          ],
        },
        {
          name: 'Website',
          for: 'Für eine vollständige Unternehmenswebsite mit mehreren Seiten und eigenem CMS.',
          items: [
            'Sitemap und Content-Plan',
            'Design aller Seitentypen',
            'Aufbau in Webflow mit Klassensystem',
            'CMS für Blog, Projekte oder Team',
            'Interactions und Animationen',
            'SEO, Performance und Barrierefreiheit',
            'Launch und Einweisung',
          ],
        },
      ],
      faqs: [
        {
          q: 'Was kostet eine Webflow-Website?',
          a: 'Das hängt von der Zahl der Seiten, dem CMS und davon ab, ob ein Design schon steht. Nach dem kostenlosen Erstgespräch bekommst du ein konkretes Angebot. Dazu kommen die laufenden Kosten für den Webflow-Plan.',
        },
        {
          q: 'Warum Webflow und nicht WordPress?',
          a: 'Um Sicherheitsupdates und Hosting kümmert sich Webflow, du musst keine Plugins pflegen. Du pflegst Inhalte direkt auf der Seite. WordPress ist sinnvoll, wenn du sehr spezielle Erweiterungen brauchst; das klären wir im Erstgespräch.',
        },
        {
          q: 'Kann ich die Website danach selbst pflegen?',
          a: 'Ja. Texte, Bilder und CMS-Inhalte wie Blogartikel änderst du im Webflow-Editor selbst. Ich zeige dir zum Launch, wie das geht.',
        },
        {
          q: 'Was muss ich liefern?',
          a: 'Texte, Bilder, dein Logo und Zugang zu deiner Domain. Wenn Texte oder Bilder noch fehlen, planen wir das gemeinsam ein, damit der Launch nicht daran hängt.',
        },
        {
          q: 'Kannst du meine bestehende Website zu Webflow umziehen?',
          a: 'Ja. Ich übernehme Inhalte, richte Weiterleitungen für alte URLs ein, damit deine Rankings möglichst erhalten bleiben, und nutze den Umzug, um Struktur und Design zu verbessern.',
        },
      ],
    },
    en: {
      eyebrow: 'Webflow development',
      headline: 'Webflow development in Augsburg: fast websites you can update yourself',
      lead: 'You end up with a website that loads fast, looks good on every device and that you update yourself, without an agency.',
      whyFocus: {
        title: 'Built clean, easy to maintain',
        text: 'Clear classes, a tidy structure and a CMS your team can run without me.',
      },
      processTitle: 'From intro call to finished website in 2 to 6 weeks',
      steps: [
        {
          title: 'Intro call and structure',
          duration: 'Week 1',
          text: 'We clarify goals, pages and content. The result is a sitemap and a plan for which content you will manage yourself in the CMS.',
          outputs: ['Sitemap', 'Content plan', 'Timeline'],
        },
        {
          title: 'Design',
          duration: 'Weeks 1 to 2',
          text: 'I design the pages in Figma or take over an existing design. We sign it off before the build in Webflow begins.',
          outputs: ['Page designs in Figma', 'Mobile views', 'Sign-off'],
        },
        {
          title: 'Build in Webflow',
          duration: 'Weeks 2 to 4',
          text: 'I build the site with a clean class system, set up the CMS and use interactions sparingly and with purpose.',
          outputs: ['Responsive website', 'CMS collections', 'Interactions'],
        },
        {
          title: 'Polish and testing',
          duration: 'Weeks 4 to 5',
          text: 'I test across devices and browsers, check load time, accessibility and SEO basics, and work in your feedback.',
          outputs: ['Device tests', 'SEO settings', 'Fixes'],
        },
        {
          title: 'Launch and training',
          duration: 'Weeks 5 to 6',
          text: 'We go live on your domain. In a short session I show you how to change content yourself.',
          outputs: ['Go-live', 'Redirects', 'CMS training'],
        },
      ],
      includedTitle: 'A website is more than nice-looking pages.',
      included: [
        { title: 'Responsive build', text: 'Your website works equally well on phone, tablet and desktop.' },
        {
          title: 'CMS setup',
          text: 'You manage blog, projects or team pages yourself, without code and without calling me.',
        },
        {
          title: 'Purposeful interactions',
          text: 'Animations that support the content and do not slow the page down.',
        },
        { title: 'SEO basics', text: 'Clean headings, meta data, sitemap and readable URLs from the start.' },
        { title: 'Performance', text: 'Optimised images and a lean build for short load times.' },
        { title: 'Accessibility', text: 'Contrast, keyboard navigation and alt text guided by WCAG.' },
      ],
      packages: [
        {
          name: 'Landing page',
          for: 'For a single page about an offer, a campaign or an event.',
          items: [
            'Short briefing',
            'Design of one page',
            'Responsive build in Webflow',
            'Basic SEO settings',
            'Go-live',
          ],
        },
        {
          name: 'Website',
          for: 'For a complete company website with several pages and its own CMS.',
          items: [
            'Sitemap and content plan',
            'Design of all page types',
            'Webflow build with class system',
            'CMS for blog, projects or team',
            'Interactions and animations',
            'SEO, performance and accessibility',
            'Launch and training',
          ],
        },
      ],
      faqs: [
        {
          q: 'How much does a Webflow website cost?',
          a: 'It depends on the number of pages, the CMS and whether a design already exists. After the free intro call you get a concrete quote. On top come the running costs of the Webflow plan.',
        },
        {
          q: 'Why Webflow rather than WordPress?',
          a: 'Webflow takes care of security updates and hosting, and there are no plugins for you to maintain. You edit content directly on the page. WordPress makes sense if you need very specific extensions; we clarify that in the intro call.',
        },
        {
          q: 'Can I update the website myself afterwards?',
          a: 'Yes. You change text, images and CMS content such as blog posts yourself in the Webflow editor. I show you how at launch.',
        },
        {
          q: 'What do I need to provide?',
          a: 'Copy, images, your logo and access to your domain. If copy or images are still missing, we plan for them together so the launch does not stall.',
        },
        {
          q: 'Can you move my existing website to Webflow?',
          a: 'Yes. I migrate the content, set up redirects for old URLs so your rankings are preserved as far as possible, and use the move to improve structure and design.',
        },
      ],
    },
  },
  // TODO(Erik): prüfen, Dauer (Audit 1 bis 2 Wochen, Umsetzung 2 bis 6 Wochen) und ob du die Informationen zur Barrierefreiheit (§ 14 BFSG) selbst formulierst (keine Rechtsberatung)
  {
    slug: 'accessibility',
    project: null,
    tools: ['Figma', 'Webflow', 'VS Code'],
    de: {
      eyebrow: 'Barrierefreiheit nach BFSG und WCAG',
      headline: 'Barrierefreie Websites nach BFSG und WCAG, aus Augsburg',
      lead: 'Für Unternehmen, die wissen wollen, ob das BFSG sie betrifft, und ihre Website Schritt für Schritt für mehr Menschen nutzbar machen.',
      whyFocus: {
        title: 'Prüfung mit echten Hilfsmitteln',
        text: 'Ich teste mit Tastatur und Screenreader statt nur mit automatischen Werkzeugen und erkläre jede Lücke verständlich.',
      },
      processTitle: 'Vom Check zu einer deutlich barriereärmeren Website in 3 bis 8 Wochen',
      steps: [
        {
          title: 'Erstgespräch und Einordnung',
          duration: '1 bis 2 Tage',
          text: 'Wir klären, welche Seiten und Abläufe betroffen sind und ob das BFSG für dein Angebot voraussichtlich gilt.',
          outputs: ['Prüfumfang', 'Einschätzung zum BFSG', 'Zeitplan'],
        },
        {
          title: 'Audit nach WCAG',
          duration: 'Woche 1 bis 2',
          text: 'Ich prüfe die wichtigsten Seiten mit automatischen Werkzeugen, per Tastatur und mit Screenreader, gegen die Kriterien der WCAG 2.2 auf Stufe AA.',
          outputs: ['Prüfbericht', 'Screenshots der Fundstellen', 'Bewertung nach Schweregrad'],
        },
        {
          title: 'Maßnahmenplan',
          duration: 'Woche 2',
          text: 'Aus den Ergebnissen entsteht eine priorisierte Liste: was zuerst behoben werden sollte, wie aufwendig es ist und wer es umsetzen kann.',
          outputs: ['Priorisierte Maßnahmen', 'Aufwandsschätzung', 'Besprechung'],
        },
        {
          title: 'Umsetzung',
          duration: 'Woche 3 bis 7',
          text: 'Ich behebe die Probleme in Design und Webflow oder begleite dein Entwicklungsteam mit konkreten Lösungen und Design-Patterns.',
          outputs: ['Angepasstes Design', 'Korrigierte Website', 'Barrierefreie Komponenten'],
        },
        {
          title: 'Nachtest und Informationen',
          duration: 'Woche 7 bis 8',
          text: 'Ich prüfe die Änderungen erneut und unterstütze dich bei den Informationen zur Barrierefreiheit, die das BFSG verlangt.',
          outputs: ['Nachtest', 'Entwurf der Informationen zur Barrierefreiheit', 'Tipps für neue Inhalte'],
        },
      ],
      includedTitle: 'Barrierefreiheit ist mehr als ein Kontrastcheck.',
      included: [
        {
          title: 'WCAG-Audit',
          text: 'Prüfung nach WCAG 2.2 AA mit klaren Fundstellen statt einer langen Fehlerliste ohne Kontext.',
        },
        {
          title: 'Screenreader-Tests',
          text: 'Ich teste, wie deine Website vorgelesen wird und ob Abläufe verständlich bleiben.',
        },
        { title: 'Tastaturbedienung', text: 'Alle Funktionen müssen ohne Maus erreichbar sein, mit sichtbarem Fokus.' },
        {
          title: 'Kontraste und Typografie',
          text: 'Lesbare Texte und Farben, die auch bei Sehschwäche funktionieren.',
        },
        {
          title: 'Formulare und Fehler',
          text: 'Verständliche Beschriftungen und Fehlermeldungen, damit Anfragen und Bestellungen klappen.',
        },
        {
          title: 'Informationen zur Barrierefreiheit',
          text: 'Unterstützung bei den Angaben nach § 14 BFSG, die beschreiben, wie dein Angebot barrierefrei nutzbar ist.',
        },
      ],
      packages: [
        {
          name: 'BFSG-Check',
          for: 'Für alle, die wissen wollen, wo ihre Website steht und was zu tun ist.',
          items: [
            'Einschätzung zum BFSG',
            'Audit der wichtigsten Seiten nach WCAG 2.2 AA',
            'Tests mit Tastatur und Screenreader',
            'Prüfbericht mit Fundstellen',
            'Priorisierter Maßnahmenplan',
          ],
        },
        {
          name: 'BFSG-Umsetzung',
          for: 'Für alle, die ihre Website nicht nur prüfen, sondern auch deutlich barriereärmer machen wollen.',
          items: [
            'Alles aus dem BFSG-Check',
            'Umsetzung in Design und Webflow',
            'Begleitung deines Entwicklungsteams',
            'Barrierefreie Komponenten und Patterns',
            'Nachtest nach der Umsetzung',
            'Entwurf der Informationen zur Barrierefreiheit',
          ],
        },
      ],
      faqs: [
        {
          q: 'Gilt das BFSG für meine Website?',
          a: 'Seit dem 28. Juni 2025 gilt das BFSG für viele Angebote an Verbraucherinnen und Verbraucher, etwa Onlineshops oder Buchungen. Kleinstunternehmen (weniger als 10 Beschäftigte und höchstens 2 Mio. € Jahresumsatz), die Dienstleistungen anbieten, sind ausgenommen. Im Erstgespräch schätze ich ein, ob du betroffen bist; verbindliche Rechtsauskunft gibt eine Anwältin oder ein Anwalt.',
        },
        {
          q: 'Was kostet ein Barrierefreiheits-Check?',
          a: 'Das hängt von der Zahl der Seiten und Abläufe ab, die wir prüfen. Nach dem kostenlosen Erstgespräch bekommst du ein konkretes Angebot, getrennt für Check und Umsetzung.',
        },
        {
          q: 'Reicht ein Overlay-Tool oder Plugin?',
          a: 'Nein. Overlays überdecken Probleme, statt sie zu lösen, und stören oft Screenreader. Barrierefreiheit entsteht im Code und im Design selbst.',
        },
        {
          q: 'Wie lange dauern Check und Umsetzung?',
          a: 'Der Check dauert meist 1 bis 2 Wochen. Die Umsetzung hängt davon ab, wie viel zu tun ist und ob ich selbst umsetze oder dein Team; typisch sind einige Wochen.',
        },
        {
          q: 'Was brauchst du von mir?',
          a: 'Den Link zur Website, gegebenenfalls einen Testzugang für Login oder Checkout und eine Ansprechperson. Für die Umsetzung brauche ich Zugang zu Webflow oder den Kontakt zu deinem Entwicklungsteam.',
        },
      ],
    },
    en: {
      eyebrow: 'Accessibility under the EAA (German BFSG) and WCAG',
      headline: 'Accessible websites under the EAA (German BFSG) and WCAG, from Augsburg',
      lead: 'For businesses who want to know whether the BFSG affects them and make their website usable for more people, step by step.',
      whyFocus: {
        title: 'Tested with real assistive tech',
        text: 'I test with keyboard and screen reader, not just automated tools, and explain every gap in plain words.',
      },
      processTitle: 'From audit to a far more accessible website in 3 to 8 weeks',
      steps: [
        {
          title: 'Intro call and assessment',
          duration: '1 to 2 days',
          text: 'We clarify which pages and flows are affected and whether the BFSG is likely to apply to your offering.',
          outputs: ['Audit scope', 'BFSG assessment', 'Timeline'],
        },
        {
          title: 'WCAG audit',
          duration: 'Weeks 1 to 2',
          text: 'I test the key pages with automated tools, by keyboard and with a screen reader, against WCAG 2.2 level AA.',
          outputs: ['Audit report', 'Screenshots of issues', 'Severity rating'],
        },
        {
          title: 'Action plan',
          duration: 'Week 2',
          text: 'The findings become a prioritised list: what to fix first, how much effort it takes and who can do it.',
          outputs: ['Prioritised actions', 'Effort estimate', 'Review meeting'],
        },
        {
          title: 'Implementation',
          duration: 'Weeks 3 to 7',
          text: 'I fix the issues in design and Webflow, or support your development team with concrete solutions and design patterns.',
          outputs: ['Updated design', 'Fixed website', 'Accessible components'],
        },
        {
          title: 'Retest and information',
          duration: 'Weeks 7 to 8',
          text: 'I test the changes again and help you with the accessibility information required by the BFSG.',
          outputs: ['Retest', 'Draft accessibility information', 'Tips for new content'],
        },
      ],
      includedTitle: 'Accessibility is more than a contrast check.',
      included: [
        {
          title: 'WCAG audit',
          text: 'Testing against WCAG 2.2 AA with clear findings rather than a long list without context.',
        },
        {
          title: 'Screen reader tests',
          text: 'I check how your website is read aloud and whether flows stay understandable.',
        },
        {
          title: 'Keyboard navigation',
          text: 'Every function must be reachable without a mouse, with a visible focus.',
        },
        {
          title: 'Contrast and typography',
          text: 'Readable text and colours that also work for people with low vision.',
        },
        { title: 'Forms and errors', text: 'Clear labels and error messages, so enquiries and orders go through.' },
        {
          title: 'Accessibility information',
          text: 'Support with the accessibility information (as required by the BFSG) describing how your service can be used.',
        },
      ],
      packages: [
        {
          name: 'BFSG check',
          for: 'For anyone who wants to know where their website stands and what needs doing.',
          items: [
            'BFSG assessment',
            'Audit of key pages against WCAG 2.2 AA',
            'Keyboard and screen reader tests',
            'Audit report with findings',
            'Prioritised action plan',
          ],
        },
        {
          name: 'BFSG implementation',
          for: 'For anyone who wants their website not only audited but made far more accessible.',
          items: [
            'Everything in the BFSG check',
            'Implementation in design and Webflow',
            'Support for your development team',
            'Accessible components and patterns',
            'Retest after implementation',
            'Draft accessibility information (as required by the BFSG)',
          ],
        },
      ],
      faqs: [
        {
          q: 'Does the BFSG apply to my website?',
          a: 'Since 28 June 2025 the BFSG, Germany’s implementation of the European Accessibility Act, applies to many consumer services such as online shops or bookings. Micro-enterprises (fewer than 10 employees and at most €2 million annual turnover) that provide services are exempt. I give you an assessment in the intro call; binding legal advice comes from a lawyer.',
        },
        {
          q: 'How much does an accessibility check cost?',
          a: 'It depends on the number of pages and flows we test. After the free intro call you get a concrete quote, separately for the check and the implementation.',
        },
        {
          q: 'Is an overlay tool or plugin enough?',
          a: 'No. Overlays cover up problems instead of solving them and often interfere with screen readers. Accessibility comes from the code and the design itself.',
        },
        {
          q: 'How long do the check and implementation take?',
          a: 'The check usually takes 1 to 2 weeks. Implementation depends on how much needs fixing and whether I do it or your team does; a few weeks is typical.',
        },
        {
          q: 'What do you need from me?',
          a: 'The link to your website, a test account for login or checkout if needed, and a contact person. For implementation I need access to Webflow or contact with your development team.',
        },
      ],
    },
  },
  // TODO(Erik): prüfen, Dauer (2 bis 6 Wochen), Workshop-Format (halber/ganzer Tag) und welche Werkzeuge du konkret empfiehlst
  {
    slug: 'ai-consulting',
    project: null,
    tools: ['Claude', 'Gemini', 'Lovable', 'Antigravity'],
    de: {
      eyebrow: 'KI-Beratung',
      headline: 'KI-Beratung in Augsburg: KI im Alltag sinnvoll einsetzen',
      lead: 'Für kleine und mittlere Teams, die KI nicht nur ausprobieren, sondern verlässlich und datenschutzbewusst im Alltag nutzen wollen.',
      whyFocus: {
        title: 'Praxis statt Hype',
        text: 'Ich empfehle KI nur dort, wo sie euch wirklich Zeit spart, und sage es offen, wenn ein einfacher Prozess besser ist.',
      },
      processTitle: 'Vom ersten Workshop zum eingeführten Werkzeug in 2 bis 6 Wochen',
      steps: [
        {
          title: 'Erstgespräch',
          duration: '1 bis 2 Tage',
          text: 'Wir sprechen über dein Team, deine Abläufe und deine Erwartungen an KI. Ich kläre auch, welche Daten im Spiel sind und was dabei zu beachten ist.',
          outputs: ['Ausgangslage', 'Ziele', 'Rahmen für Datenschutz'],
        },
        {
          title: 'Workshop',
          duration: 'Woche 1',
          text: 'In einem Workshop sammeln wir wiederkehrende Aufgaben und bewerten, wo KI hilft und wo nicht. Gern vor Ort in Augsburg und Umgebung.',
          outputs: ['Liste der Anwendungsfälle', 'Priorisierung', 'Kurze Live-Demos'],
        },
        {
          title: 'Werkzeuge testen',
          duration: 'Woche 2 bis 3',
          text: 'Für die wichtigsten Anwendungsfälle teste ich passende Werkzeuge mit echten Beispielen aus deinem Alltag und vergleiche Ergebnis, Aufwand und Datenschutz.',
          outputs: ['Werkzeugvergleich', 'Empfehlung', 'Prompt-Vorlagen'],
        },
        {
          title: 'Prototyp',
          duration: 'Woche 3 bis 4',
          text: 'Für eine ausgewählte Aufgabe baue ich einen funktionierenden Ablauf, etwa für Texte, Recherche oder interne Tools, und wir testen ihn im echten Einsatz.',
          outputs: ['Funktionierender Prototyp', 'Erfahrungen aus dem Test'],
        },
        {
          title: 'Einführung im Team',
          duration: 'Woche 5 bis 6',
          text: 'Ich schule dein Team praxisnah und halte fest, wie ihr KI nutzt: welche Werkzeuge, welche Daten und wie ihr Ergebnisse prüft.',
          outputs: ['Schulung', 'KI-Leitlinien', 'Ansprechperson für Fragen'],
        },
      ],
      includedTitle: 'Gute KI-Einführung beginnt bei deinen Aufgaben, nicht beim Werkzeug.',
      included: [
        {
          title: 'Anwendungsfälle finden',
          text: 'Wir suchen Aufgaben, die oft vorkommen und bei denen KI spürbar Zeit spart.',
        },
        {
          title: 'Werkzeuge vergleichen',
          text: 'Ehrlicher Vergleich mit echten Beispielen aus deinem Alltag statt Herstellerversprechen.',
        },
        { title: 'Datenschutz mitgedacht', text: 'Welche Daten in welches Werkzeug dürfen, klären wir von Anfang an.' },
        { title: 'Prompt-Vorlagen', text: 'Erprobte Vorlagen, mit denen dein Team schnell gute Ergebnisse bekommt.' },
        { title: 'Praxisnahe Schulung', text: 'Training an euren Aufgaben, nicht an Beispielen aus dem Lehrbuch.' },
        {
          title: 'Klare Leitlinien',
          text: 'Kurze Regeln zu Qualität, Datenschutz und Verantwortung, die im Alltag funktionieren.',
        },
      ],
      packages: [
        {
          name: 'KI-Workshop',
          for: 'Für Teams, die herausfinden wollen, wo KI ihnen im Alltag helfen kann.',
          items: [
            'Vorgespräch',
            'Workshop vor Ort in Augsburg und Umgebung oder remote',
            'Liste priorisierter Anwendungsfälle',
            'Live-Demos passender Werkzeuge',
            'Kurze Zusammenfassung mit nächsten Schritten',
          ],
        },
        {
          name: 'KI-Einführung',
          for: 'Für Teams, die KI nicht nur ausprobieren, sondern fest in ihre Abläufe einbauen wollen.',
          items: [
            'Alles aus dem KI-Workshop',
            'Test und Vergleich von Werkzeugen',
            'Prototyp für eine ausgewählte Aufgabe',
            'Prompt-Vorlagen',
            'Schulung im Team',
            'Leitlinien für Datenschutz und Qualität',
          ],
        },
      ],
      faqs: [
        {
          q: 'Ist der Einsatz von KI mit der DSGVO vereinbar?',
          a: 'Ja, wenn man Werkzeuge und Daten bewusst auswählt. Ich achte auf Anbieter mit Auftragsverarbeitungsvertrag, prüfe, wo Daten verarbeitet werden, und zeige, welche Daten nicht in KI-Werkzeuge gehören. Eine rechtliche Prüfung ersetzt das nicht.',
        },
        {
          q: 'Was kostet die KI-Beratung?',
          a: 'Das hängt davon ab, ob du einen einzelnen Workshop oder eine Einführung mit Prototyp und Schulung möchtest. Nach dem kostenlosen Erstgespräch bekommst du ein konkretes Angebot.',
        },
        {
          q: 'Brauchen wir technisches Vorwissen?',
          a: 'Nein. Ich hole dein Team dort ab, wo es steht. Wichtig ist nur die Bereitschaft, Neues im eigenen Alltag auszuprobieren.',
        },
        {
          q: 'Welche Werkzeuge empfiehlst du?',
          a: 'Das entscheiden wir anhand deiner Aufgaben. Ich arbeite selbst täglich mit Claude, Gemini, Lovable und Antigravity und teste bei Bedarf weitere Werkzeuge, die besser zu deinem Team passen.',
        },
        {
          q: 'Findet der Workshop vor Ort statt?',
          a: 'In Augsburg und Umgebung komme ich gern zu euch ins Büro. Für Teams in anderen Regionen funktioniert der Workshop auch remote gut.',
        },
      ],
    },
    en: {
      eyebrow: 'AI consulting',
      headline: 'AI consulting in Augsburg: using AI sensibly in everyday work',
      lead: 'For small and mid-sized teams who want to use AI reliably and with data protection in mind, not just try it out.',
      whyFocus: {
        title: 'Practice, not hype',
        text: 'I only recommend AI where it genuinely saves you time, and say so openly when a simple process works better.',
      },
      processTitle: 'From the first workshop to a tool in daily use in 2 to 6 weeks',
      steps: [
        {
          title: 'Intro call',
          duration: '1 to 2 days',
          text: 'We talk about your team, your workflows and what you expect from AI. I also clarify which data is involved and what needs to be considered.',
          outputs: ['Starting point', 'Goals', 'Privacy framework'],
        },
        {
          title: 'Workshop',
          duration: 'Week 1',
          text: 'In a workshop we collect recurring tasks and assess where AI helps and where it does not. Happy to do this on site in and around Augsburg.',
          outputs: ['List of use cases', 'Prioritisation', 'Short live demos'],
        },
        {
          title: 'Testing tools',
          duration: 'Weeks 2 to 3',
          text: 'For the key use cases I test suitable tools with real examples from your work and compare results, effort and data protection.',
          outputs: ['Tool comparison', 'Recommendation', 'Prompt templates'],
        },
        {
          title: 'Prototype',
          duration: 'Weeks 3 to 4',
          text: 'For one selected task I build a working flow, for example for copy, research or internal tools, and we test it in real use.',
          outputs: ['Working prototype', 'Lessons from testing'],
        },
        {
          title: 'Team rollout',
          duration: 'Weeks 5 to 6',
          text: 'I train your team hands-on and document how you use AI: which tools, which data and how you check the results.',
          outputs: ['Training', 'AI guidelines', 'Contact for questions'],
        },
      ],
      includedTitle: 'A good AI rollout starts with your tasks, not with the tool.',
      included: [
        { title: 'Finding use cases', text: 'We look for frequent tasks where AI saves noticeable time.' },
        {
          title: 'Comparing tools',
          text: 'An honest comparison using real examples from your work rather than vendor promises.',
        },
        { title: 'Privacy built in', text: 'We clarify from the start which data may go into which tool.' },
        { title: 'Prompt templates', text: 'Tested templates that help your team get good results quickly.' },
        { title: 'Hands-on training', text: 'Training based on your tasks, not textbook examples.' },
        { title: 'Clear guidelines', text: 'Short rules on quality, privacy and responsibility that work day to day.' },
      ],
      packages: [
        {
          name: 'AI workshop',
          for: 'For teams who want to find out where AI can help them in everyday work.',
          items: [
            'Preliminary call',
            'Workshop on site in and around Augsburg, or remote',
            'List of prioritised use cases',
            'Live demos of suitable tools',
            'Short summary with next steps',
          ],
        },
        {
          name: 'AI rollout',
          for: 'For teams who want to build AI firmly into their workflows, not just try it out.',
          items: [
            'Everything in the AI workshop',
            'Testing and comparing tools',
            'Prototype for one selected task',
            'Prompt templates',
            'Team training',
            'Guidelines for privacy and quality',
          ],
        },
      ],
      faqs: [
        {
          q: 'Is using AI compliant with the GDPR?',
          a: 'Yes, if tools and data are chosen carefully. I look for providers with a data processing agreement, check where data is processed and show which data does not belong in AI tools. This does not replace a legal review.',
        },
        {
          q: 'How much does AI consulting cost?',
          a: 'It depends on whether you want a single workshop or a rollout with prototype and training. After the free intro call you get a concrete quote.',
        },
        {
          q: 'Do we need technical knowledge?',
          a: 'No. I meet your team where it is. All you need is the willingness to try new things in your own daily work.',
        },
        {
          q: 'Which tools do you recommend?',
          a: 'We decide based on your tasks. I work with Claude, Gemini, Lovable and Antigravity every day and test other tools if they suit your team better.',
        },
        {
          q: 'Does the workshop take place on site?',
          a: 'In and around Augsburg I am happy to come to your office. For teams elsewhere the workshop works well remotely too.',
        },
      ],
    },
  },
  // TODO(Erik): prüfen, Dauer (Analyse 1 bis 2 Wochen) und ob laufende Optimierung als monatliche Betreuung angeboten wird
  {
    slug: 'website-process-optimization',
    project: null,
    tools: ['Webflow', 'Figma', 'Claude', 'VS Code'],
    de: {
      eyebrow: 'Website- & Prozessoptimierung',
      headline: 'Website-Optimierung in Augsburg: schneller, klarer, für mehr Anfragen',
      lead: 'Für alle, deren Website zwar existiert, aber zu wenig bringt: Du erfährst, was am meisten hilft, und wir setzen es um.',
      whyFocus: {
        title: 'Erst messen, dann ändern',
        text: 'Jede Empfehlung stützt sich auf Daten und Beobachtung, damit du weißt, warum eine Änderung etwas bringt.',
      },
      processTitle: 'Von der Analyse zur besseren Website in 2 bis 6 Wochen',
      steps: [
        {
          title: 'Erstgespräch',
          duration: '1 bis 2 Tage',
          text: 'Wir klären, was deine Website leisten soll, wo es heute hakt und welche Abläufe dahinter Zeit kosten, zum Beispiel bei Anfragen.',
          outputs: ['Ziele', 'Bekannte Probleme', 'Prüfumfang'],
        },
        {
          title: 'Analyse',
          duration: 'Woche 1',
          text: 'Ich prüfe Ladezeit, Barrierefreiheit, Suchmaschinen-Grundlagen und Nutzerführung und schaue mir an, wie Anfragen intern weiterlaufen.',
          outputs: ['Performance-Check', 'SEO- und Barrierefreiheits-Check', 'UX-Review'],
        },
        {
          title: 'Maßnahmenplan',
          duration: 'Woche 2',
          text: 'Ich ordne die Ergebnisse nach Wirkung und Aufwand. Wir besprechen den Plan gemeinsam und entscheiden, was zuerst kommt.',
          outputs: ['Priorisierte Maßnahmen', 'Schnelle Erfolge', 'Besprechung'],
        },
        {
          title: 'Umsetzung',
          duration: 'Woche 2 bis 5',
          text: 'Ich setze die Maßnahmen um, von Texten und Struktur über Formulare bis zu einfacheren Abläufen und passenden Werkzeugen.',
          outputs: ['Verbesserte Seiten', 'Neue Anfrage-Strecke', 'Vereinfachte Abläufe'],
        },
        {
          title: 'Messen und nachjustieren',
          duration: 'Woche 5 bis 6',
          text: 'Wir schauen, was sich verändert hat, und justieren nach. Auf Wunsch begleite ich dich danach mit laufender Optimierung.',
          outputs: ['Vorher-nachher-Vergleich', 'Nächste Schritte'],
        },
      ],
      includedTitle: 'Eine gute Website arbeitet auch dann, wenn du gerade nicht hinschaust.',
      included: [
        { title: 'Ladezeit', text: 'Schnellere Seiten durch optimierte Bilder, schlanken Code und sauberes Hosting.' },
        {
          title: 'Suchmaschinen',
          text: 'Struktur, Überschriften und Meta-Daten, damit Google und KI-Suchen dich finden.',
        },
        { title: 'Nutzerführung', text: 'Klare Wege von der ersten Seite bis zur Anfrage, ohne Umwege.' },
        { title: 'Barrierefreiheit', text: 'Ein kurzer Check nach WCAG, damit die größten Hürden auffallen.' },
        { title: 'Interne Abläufe', text: 'Anfragen landen dort, wo sie gebraucht werden, ohne doppelte Arbeit.' },
        { title: 'Digitale Positionierung', text: 'Eine klare Botschaft, die zeigt, wofür du stehst und für wen.' },
      ],
      packages: [
        {
          name: 'Website-Check',
          for: 'Für alle, die wissen wollen, wo ihre Website steht und was am meisten bringt.',
          items: [
            'Analyse von Ladezeit, SEO und Barrierefreiheit',
            'UX-Review der wichtigsten Seiten',
            'Blick auf die Anfrage-Strecke',
            'Priorisierter Maßnahmenplan',
            'Besprechung der Ergebnisse',
          ],
        },
        {
          name: 'Optimierung',
          for: 'Für alle, die die Verbesserungen nicht nur kennen, sondern umgesetzt haben wollen.',
          items: [
            'Alles aus dem Website-Check',
            'Umsetzung der Maßnahmen',
            'Überarbeitung von Formularen und Anfrage-Strecke',
            'Vereinfachung interner Abläufe',
            'Vorher-nachher-Vergleich',
            'Optional laufende Optimierung',
          ],
        },
      ],
      faqs: [
        {
          q: 'Was kostet eine Website-Optimierung?',
          a: 'Das hängt davon ab, ob du nur eine Analyse möchtest oder auch die Umsetzung. Nach dem kostenlosen Erstgespräch bekommst du ein konkretes Angebot mit klarem Umfang.',
        },
        {
          q: 'Muss meine Website dafür in Webflow gebaut sein?',
          a: 'Nein. Die Analyse funktioniert mit jeder Website. Die Umsetzung übernehme ich direkt in Webflow, bei anderen Systemen arbeite ich mit deinem Entwicklungsteam zusammen.',
        },
        {
          q: 'Was ist mit Prozessoptimierung gemeint?',
          a: 'Ich schaue, was nach dem Klick passiert: Wie landen Anfragen bei dir, wer bearbeitet sie, wo entsteht doppelte Arbeit? Oft lässt sich das mit einfachen Werkzeugen oder etwas KI deutlich vereinfachen.',
        },
        {
          q: 'Wann sehe ich Ergebnisse?',
          a: 'Erste Verbesserungen wie schnellere Ladezeiten wirken sofort. Veränderungen bei Suchmaschinen und Anfragen brauchen meist einige Wochen, bis sie messbar sind.',
        },
        {
          q: 'Was brauchst du von mir?',
          a: 'Zugang zu deiner Website und, falls vorhanden, zu Statistik-Werkzeugen wie der Google Search Console. Dazu eine kurze Beschreibung, wie Anfragen heute bei euch ablaufen.',
        },
      ],
    },
    en: {
      eyebrow: 'Website & process optimisation',
      headline: 'Website optimisation in Augsburg: faster and clearer, for more enquiries',
      lead: 'For anyone whose website exists but does too little: you learn what will help most, and we put it into practice.',
      whyFocus: {
        title: 'Measure first, then change',
        text: 'Every recommendation rests on data and observation, so you know why a change will pay off.',
      },
      processTitle: 'From analysis to a better website in 2 to 6 weeks',
      steps: [
        {
          title: 'Intro call',
          duration: '1 to 2 days',
          text: 'We clarify what your website should achieve, where it falls short today and which workflows behind it cost time, for example with enquiries.',
          outputs: ['Goals', 'Known issues', 'Audit scope'],
        },
        {
          title: 'Analysis',
          duration: 'Week 1',
          text: 'I check load time, accessibility, search basics and user journeys, and look at how enquiries are handled internally.',
          outputs: ['Performance check', 'SEO and accessibility check', 'UX review'],
        },
        {
          title: 'Action plan',
          duration: 'Week 2',
          text: 'I rank the findings by impact and effort. We go through the plan together and decide what comes first.',
          outputs: ['Prioritised actions', 'Quick wins', 'Review meeting'],
        },
        {
          title: 'Implementation',
          duration: 'Weeks 2 to 5',
          text: 'I implement the actions, from copy and structure to forms, simpler workflows and suitable tools.',
          outputs: ['Improved pages', 'New enquiry flow', 'Simplified workflows'],
        },
        {
          title: 'Measure and adjust',
          duration: 'Weeks 5 to 6',
          text: 'We look at what has changed and fine-tune. If you like, I support you with ongoing optimisation afterwards.',
          outputs: ['Before and after comparison', 'Next steps'],
        },
      ],
      includedTitle: 'A good website keeps working even when you are not looking.',
      included: [
        { title: 'Load time', text: 'Faster pages through optimised images, lean code and solid hosting.' },
        { title: 'Search', text: 'Structure, headings and meta data, so Google and AI search can find you.' },
        { title: 'User journeys', text: 'Clear paths from the first page to the enquiry, without detours.' },
        { title: 'Accessibility', text: 'A short WCAG check to spot the biggest barriers.' },
        { title: 'Internal workflows', text: 'Enquiries end up where they are needed, without duplicate work.' },
        { title: 'Digital positioning', text: 'A clear message that shows what you stand for and who you serve.' },
      ],
      packages: [
        {
          name: 'Website check',
          for: 'For anyone who wants to know where their website stands and what will help most.',
          items: [
            'Analysis of load time, SEO and accessibility',
            'UX review of key pages',
            'Look at the enquiry flow',
            'Prioritised action plan',
            'Results meeting',
          ],
        },
        {
          name: 'Optimisation',
          for: 'For anyone who wants the improvements implemented, not just listed.',
          items: [
            'Everything in the website check',
            'Implementation of the actions',
            'Reworked forms and enquiry flow',
            'Simplified internal workflows',
            'Before and after comparison',
            'Optional ongoing optimisation',
          ],
        },
      ],
      faqs: [
        {
          q: 'How much does website optimisation cost?',
          a: 'It depends on whether you want only an analysis or the implementation as well. After the free intro call you get a concrete quote with a clear scope.',
        },
        {
          q: 'Does my website have to be built in Webflow?',
          a: 'No. The analysis works for any website. I implement changes directly in Webflow; for other systems I work with your development team.',
        },
        {
          q: 'What do you mean by process optimisation?',
          a: 'I look at what happens after the click: how enquiries reach you, who handles them and where work is duplicated. Simple tools or a bit of AI can often streamline this a lot.',
        },
        {
          q: 'When will I see results?',
          a: 'Early improvements such as faster load times take effect immediately. Changes in search and enquiries usually take a few weeks to become measurable.',
        },
        {
          q: 'What do you need from me?',
          a: 'Access to your website and, if available, to analytics tools such as Google Search Console. Plus a short description of how enquiries are handled today.',
        },
      ],
    },
  },
  // TODO(Erik): prüfen, Dauer (3 bis 6 Wochen), Zahl der Logo-Entwürfe und Korrekturschleifen
  {
    slug: 'brand-logo-design',
    project: null,
    tools: ['Affinity', 'Figma', 'Webflow'],
    de: {
      eyebrow: 'Brand- & Logo-Design',
      headline: 'Logo-Design und Markenauftritt in Augsburg',
      lead: 'Für Selbstständige, Gründungsteams und kleine Unternehmen, die einen eigenen, wiedererkennbaren Auftritt wollen statt einer Vorlage von der Stange.',
      whyFocus: {
        title: 'Marke, die überall funktioniert',
        text: 'Logo und Farben prüfe ich auf Kontrast und Lesbarkeit, damit sie im Web, im Druck und auf kleinen Bildschirmen tragen.',
      },
      processTitle: 'Vom Erstgespräch zum fertigen Markenauftritt in 3 bis 6 Wochen',
      steps: [
        {
          title: 'Erstgespräch und Fragebogen',
          duration: 'Woche 1',
          text: 'Wir sprechen über dich, dein Angebot und deine Zielgruppe. Ein kurzer Fragebogen hilft, Werte und Tonalität greifbar zu machen.',
          outputs: ['Markenbriefing', 'Zielgruppe', 'Zeitplan'],
        },
        {
          title: 'Recherche und Moodboard',
          duration: 'Woche 1 bis 2',
          text: 'Ich schaue mir dein Umfeld und deinen Wettbewerb an und sammle Bildwelten, Farben und Schriften in einem Moodboard.',
          outputs: ['Wettbewerbsblick', 'Moodboard', 'Gestalterische Richtung'],
        },
        {
          title: 'Logo-Entwürfe',
          duration: 'Woche 2 bis 3',
          text: 'Ich entwickle mehrere Logo-Richtungen und zeige sie dir in echten Anwendungen, etwa auf Website, Visitenkarte und Social Media.',
          outputs: ['Logo-Entwürfe', 'Anwendungsbeispiele', 'Präsentation'],
        },
        {
          title: 'Ausarbeitung',
          duration: 'Woche 3 bis 5',
          text: 'Die gewählte Richtung arbeite ich aus und ergänze Farben, Schriften und Varianten für hellen und dunklen Hintergrund.',
          outputs: ['Finales Logo', 'Farb- und Schriftsystem', 'Logo-Varianten'],
        },
        {
          title: 'Styleguide und Übergabe',
          duration: 'Woche 5 bis 6',
          text: 'Ich fasse alles in einem Styleguide zusammen und übergebe dir alle Dateien in den gängigen Formaten für Web und Druck.',
          outputs: ['Styleguide', 'Logo-Dateien', 'Vorlagen für Social Media'],
        },
      ],
      includedTitle: 'Eine Marke ist mehr als ein Logo.',
      included: [
        { title: 'Logo-Design', text: 'Ein eigenständiges Logo, das auch klein und einfarbig gut funktioniert.' },
        { title: 'Farbsystem', text: 'Eine Farbpalette mit ausreichenden Kontrasten für Web und Druck.' },
        { title: 'Typografie', text: 'Schriften, die zu dir passen und gut lesbar sind.' },
        { title: 'Styleguide', text: 'Klare Regeln, wie Logo, Farben und Schriften eingesetzt werden.' },
        {
          title: 'Anwendungsbeispiele',
          text: 'Dein Auftritt auf Website, Social Media und Geschäftsausstattung gezeigt.',
        },
        { title: 'Alle Dateiformate', text: 'Vektor- und Bilddateien für Web, Druck und Social Media.' },
      ],
      packages: [
        {
          name: 'Logo',
          for: 'Für Gründerinnen, Gründer und kleine Unternehmen, die ein eigenständiges Logo brauchen.',
          items: [
            'Briefing und Recherche',
            'Mehrere Logo-Entwürfe',
            'Ausarbeitung einer Richtung',
            'Varianten für hell und dunkel',
            'Übergabe aller Dateien',
          ],
        },
        {
          name: 'Markenauftritt',
          for: 'Für alle, die einen vollständigen, einheitlichen Auftritt von Logo bis Website wollen.',
          items: [
            'Alles aus dem Logo-Paket',
            'Moodboard und gestalterische Richtung',
            'Farb- und Schriftsystem',
            'Styleguide',
            'Vorlagen für Social Media',
            'Anwendung auf Website und Geschäftsausstattung',
          ],
        },
      ],
      faqs: [
        {
          q: 'Reicht mir ein Logo oder brauche ich eine ganze Marke?',
          a: 'Für den Start reicht oft ein gutes Logo mit Farben und Schrift. Wenn mehrere Menschen Inhalte erstellen oder du auf vielen Kanälen auftrittst, lohnt sich ein Styleguide, der alles festhält.',
        },
        {
          q: 'Was kostet ein Logo bei dir?',
          a: 'Das hängt davon ab, ob du nur ein Logo oder einen vollständigen Markenauftritt möchtest. Nach dem kostenlosen Erstgespräch bekommst du ein konkretes Angebot.',
        },
        {
          q: 'Wie viele Entwürfe bekomme ich?',
          a: 'Ich zeige dir mehrere Richtungen, damit du vergleichen kannst. Die gewählte Richtung arbeiten wir gemeinsam aus, mit festen Feedbackrunden.',
        },
        {
          q: 'Kann ich mein bestehendes Logo überarbeiten lassen?',
          a: 'Ja. Oft reicht es, ein Logo behutsam zu modernisieren, statt alles neu zu machen. So bleibt der Wiedererkennungswert erhalten.',
        },
        {
          q: 'Welche Rechte bekomme ich am Logo?',
          a: 'Nach vollständiger Bezahlung bekommst du die ausschließlichen, zeitlich und räumlich unbeschränkten Nutzungsrechte. Eine Markenrecherche oder -anmeldung ist nicht enthalten.',
        },
      ],
    },
    en: {
      eyebrow: 'Brand & logo design',
      headline: 'Logo design and brand identity in Augsburg',
      lead: 'For freelancers, founding teams and small businesses who want a distinctive, recognisable presence rather than an off-the-shelf template.',
      whyFocus: {
        title: 'A brand that works everywhere',
        text: 'I check logo and colours for contrast and legibility, so they hold up on the web, in print and on small screens.',
      },
      processTitle: 'From intro call to finished brand identity in 3 to 6 weeks',
      steps: [
        {
          title: 'Intro call and questionnaire',
          duration: 'Week 1',
          text: 'We talk about you, your offering and your audience. A short questionnaire helps make values and tone tangible.',
          outputs: ['Brand brief', 'Target audience', 'Timeline'],
        },
        {
          title: 'Research and moodboard',
          duration: 'Weeks 1 to 2',
          text: 'I look at your market and competitors and collect imagery, colours and typefaces in a moodboard.',
          outputs: ['Competitor overview', 'Moodboard', 'Design direction'],
        },
        {
          title: 'Logo concepts',
          duration: 'Weeks 2 to 3',
          text: 'I develop several logo directions and show them in real use, for example on a website, business card and social media.',
          outputs: ['Logo concepts', 'Mock-ups', 'Presentation'],
        },
        {
          title: 'Refinement',
          duration: 'Weeks 3 to 5',
          text: 'I refine the chosen direction and add colours, typefaces and variants for light and dark backgrounds.',
          outputs: ['Final logo', 'Colour and type system', 'Logo variants'],
        },
        {
          title: 'Style guide and handover',
          duration: 'Weeks 5 to 6',
          text: 'I bring everything together in a style guide and hand over all files in common formats for web and print.',
          outputs: ['Style guide', 'Logo files', 'Social media templates'],
        },
      ],
      includedTitle: 'A brand is more than a logo.',
      included: [
        { title: 'Logo design', text: 'A distinctive logo that also works small and in a single colour.' },
        { title: 'Colour system', text: 'A colour palette with sufficient contrast for web and print.' },
        { title: 'Typography', text: 'Typefaces that suit you and are easy to read.' },
        { title: 'Style guide', text: 'Clear rules on how to use logo, colours and typefaces.' },
        { title: 'Mock-ups', text: 'Your brand shown on website, social media and stationery.' },
        { title: 'All file formats', text: 'Vector and image files for web, print and social media.' },
      ],
      packages: [
        {
          name: 'Logo',
          for: 'For founders and small businesses who need a distinctive logo.',
          items: [
            'Briefing and research',
            'Several logo concepts',
            'Refinement of one direction',
            'Light and dark variants',
            'Handover of all files',
          ],
        },
        {
          name: 'Brand identity',
          for: 'For anyone who wants a complete, consistent presence from logo to website.',
          items: [
            'Everything in the logo package',
            'Moodboard and design direction',
            'Colour and type system',
            'Style guide',
            'Social media templates',
            'Application to website and stationery',
          ],
        },
      ],
      faqs: [
        {
          q: 'Do I need just a logo or a full brand identity?',
          a: 'To get started, a good logo with colours and type is often enough. If several people create content or you appear on many channels, a style guide that captures everything is worth it.',
        },
        {
          q: 'How much does a logo cost?',
          a: 'It depends on whether you want just a logo or a complete brand identity. After the free intro call you get a concrete quote.',
        },
        {
          q: 'How many concepts will I get?',
          a: 'I show you several directions so you can compare. We then refine the chosen one together, with fixed rounds of feedback.',
        },
        {
          q: 'Can you rework my existing logo?',
          a: 'Yes. Often a careful refresh is better than starting from scratch, because it keeps your brand recognisable.',
        },
        {
          q: 'What rights do I get to the logo?',
          a: 'Once paid in full, you receive exclusive usage rights, unlimited in time and territory. A trademark search or registration is not included.',
        },
      ],
    },
  },
  // TODO(Erik): prüfen, Dauer (4 bis 10 Wochen) und ob du auch Code-Komponenten/Tokens für die Entwicklung lieferst oder nur Figma
  {
    slug: 'design-systems',
    project: null,
    tools: ['Figma', 'VS Code', 'Webflow', 'Claude'],
    de: {
      eyebrow: 'Design Systeme',
      headline: 'Design Systeme in Augsburg: konsistent gestalten, schneller entwickeln',
      lead: 'Für Produktteams, die weniger Zeit mit Abstimmung und Einzellösungen verbringen und neue Seiten schneller und einheitlicher bauen wollen.',
      whyFocus: {
        title: 'Aus der Praxis gebaut',
        text: 'Ich entwerfe Komponenten so, wie ich sie selbst umsetze, mit Tokens, Zuständen und Barrierefreiheit von Anfang an.',
      },
      processTitle: 'Von der Bestandsaufnahme zum nutzbaren Design System in 4 bis 10 Wochen',
      steps: [
        {
          title: 'Bestandsaufnahme',
          duration: 'Woche 1',
          text: 'Ich sammle, was es schon gibt: Farben, Schriften, Buttons, Formulare. So sehen wir, wo Wildwuchs entstanden ist und was wiederverwendet werden kann.',
          outputs: ['Interface-Inventar', 'Liste der Unstimmigkeiten', 'Prioritäten'],
        },
        {
          title: 'Design-Tokens',
          duration: 'Woche 2 bis 3',
          text: 'Ich lege die Grundlagen als Tokens fest: Farben, Typografie, Abstände, Radien. Mit Varianten für Theming und Dunkelmodus.',
          outputs: ['Token-Architektur', 'Farb- und Schriftskalen', 'Dunkelmodus'],
        },
        {
          title: 'Komponenten',
          duration: 'Woche 3 bis 7',
          text: 'Auf den Tokens baue ich eine Komponentenbibliothek in Figma, mit Varianten und Zuständen und barrierefrei nach WCAG.',
          outputs: ['Komponentenbibliothek', 'Varianten und Zustände', 'Beispielseiten'],
        },
        {
          title: 'Dokumentation',
          duration: 'Woche 7 bis 9',
          text: 'Ich beschreibe, wann welche Komponente passt und was dabei zu beachten ist, kurz und verständlich für Design und Entwicklung.',
          outputs: ['Richtlinien', 'Nutzungsbeispiele', 'Do und Don’t'],
        },
        {
          title: 'Übergabe und Einführung',
          duration: 'Woche 9 bis 10',
          text: 'Ich stelle das System deinem Team vor, kläre die Übergabe an die Entwicklung und lege fest, wie es gepflegt und erweitert wird.',
          outputs: ['Team-Einführung', 'Design-Dev-Übergabe', 'Pflegeprozess'],
        },
      ],
      includedTitle: 'Ein Design System ist mehr als eine Komponentensammlung.',
      included: [
        {
          title: 'Token-Architektur',
          text: 'Farben, Schriften und Abstände als zentrale Werte, die überall gleich wirken.',
        },
        {
          title: 'Komponentenbibliothek',
          text: 'Wiederverwendbare Bausteine in Figma mit allen Varianten und Zuständen.',
        },
        { title: 'Theming und Dunkelmodus', text: 'Mehrere Themes oder Marken auf einer gemeinsamen Grundlage.' },
        { title: 'Barrierefreiheit', text: 'Kontraste, Fokus und Größen nach WCAG direkt in den Komponenten.' },
        { title: 'Dokumentation', text: 'Kurze, verständliche Richtlinien, die dein Team auch wirklich liest.' },
        {
          title: 'Design-Dev-Übergabe',
          text: 'Gleiche Namen und Werte in Figma und Code, damit nichts verloren geht.',
        },
      ],
      packages: [
        {
          name: 'Grundlagen',
          for: 'Für kleine Teams, die mit einer soliden Basis aus Tokens und Kernkomponenten starten wollen.',
          items: [
            'Bestandsaufnahme',
            'Design-Tokens für Farben, Schriften und Abstände',
            'Kernkomponenten wie Buttons und Formulare',
            'Kurze Dokumentation',
            'Übergabe der Figma-Bibliothek',
          ],
        },
        {
          name: 'Komplett',
          for: 'Für Teams mit mehreren Produkten oder Marken, die ein skalierbares System brauchen.',
          items: [
            'Alles aus den Grundlagen',
            'Vollständige Komponentenbibliothek',
            'Theming und Dunkelmodus',
            'Ausführliche Richtlinien',
            'Design-Dev-Übergabe mit Entwicklungsteam',
            'Einführung im Team und Pflegeprozess',
          ],
        },
      ],
      faqs: [
        {
          q: 'Lohnt sich ein Design System für kleine Teams?',
          a: 'Ja, in schlanker Form. Schon wenige Tokens und Kernkomponenten sparen Abstimmung und verhindern, dass jede Seite anders aussieht. Das System wächst dann mit deinem Produkt.',
        },
        {
          q: 'Was kostet ein Design System?',
          a: 'Das hängt vom Umfang ab, also von der Zahl der Komponenten, Themes und Produkte. Nach dem kostenlosen Erstgespräch bekommst du ein konkretes Angebot.',
        },
        {
          q: 'Arbeitest du mit unserem Entwicklungsteam zusammen?',
          a: 'Ja, das ist entscheidend. Ich stimme Namen und Werte mit der Entwicklung ab, damit Figma und Code dieselbe Sprache sprechen.',
        },
        {
          q: 'Können wir auf unserer bestehenden Figma-Bibliothek aufbauen?',
          a: 'Ja. Ich räume bestehende Dateien auf, vereinheitliche sie und ergänze, was fehlt, statt bei null anzufangen.',
        },
        {
          q: 'Wer pflegt das System danach?',
          a: 'Dein Team. Ich lege mit euch fest, wer Änderungen freigibt und wie neue Komponenten dazukommen. Auf Wunsch begleite ich die Pflege weiter.',
        },
      ],
    },
    en: {
      eyebrow: 'Design systems',
      headline: 'Design systems in Augsburg: consistent design, faster development',
      lead: 'For product teams who want to spend less time on alignment and one-off fixes and build new pages faster and more consistently.',
      whyFocus: {
        title: 'Built from real practice',
        text: 'I design components the way I build them myself, with tokens, states and accessibility from the start.',
      },
      processTitle: 'From audit to a usable design system in 4 to 10 weeks',
      steps: [
        {
          title: 'Interface audit',
          duration: 'Week 1',
          text: 'I collect what already exists: colours, typefaces, buttons, forms. This shows where things have drifted apart and what can be reused.',
          outputs: ['Interface inventory', 'List of inconsistencies', 'Priorities'],
        },
        {
          title: 'Design tokens',
          duration: 'Weeks 2 to 3',
          text: 'I define the foundations as tokens: colours, typography, spacing, radii. With variants for theming and dark mode.',
          outputs: ['Token architecture', 'Colour and type scales', 'Dark mode'],
        },
        {
          title: 'Components',
          duration: 'Weeks 3 to 7',
          text: 'On top of the tokens I build a component library in Figma, with variants and states, accessible following WCAG.',
          outputs: ['Component library', 'Variants and states', 'Example pages'],
        },
        {
          title: 'Documentation',
          duration: 'Weeks 7 to 9',
          text: 'I describe when to use which component and what to watch out for, short and clear for design and development.',
          outputs: ['Guidelines', 'Usage examples', 'Dos and don’ts'],
        },
        {
          title: 'Handover and rollout',
          duration: 'Weeks 9 to 10',
          text: 'I introduce the system to your team, align the handover to development and agree how it will be maintained and extended.',
          outputs: ['Team introduction', 'Design-dev handoff', 'Maintenance process'],
        },
      ],
      includedTitle: 'A design system is more than a set of components.',
      included: [
        {
          title: 'Token architecture',
          text: 'Colours, typefaces and spacing as central values that look the same everywhere.',
        },
        { title: 'Component library', text: 'Reusable building blocks in Figma with all variants and states.' },
        { title: 'Theming and dark mode', text: 'Several themes or brands on one shared foundation.' },
        { title: 'Accessibility', text: 'Contrast, focus and sizing following WCAG, built into the components.' },
        { title: 'Documentation', text: 'Short, clear guidelines your team will actually read.' },
        { title: 'Design-dev handoff', text: 'The same names and values in Figma and code, so nothing gets lost.' },
      ],
      packages: [
        {
          name: 'Foundations',
          for: 'For small teams who want to start with a solid base of tokens and core components.',
          items: [
            'Interface audit',
            'Design tokens for colour, type and spacing',
            'Core components such as buttons and forms',
            'Short documentation',
            'Handover of the Figma library',
          ],
        },
        {
          name: 'Complete',
          for: 'For teams with several products or brands who need a scalable system.',
          items: [
            'Everything in Foundations',
            'Full component library',
            'Theming and dark mode',
            'Detailed guidelines',
            'Design-dev handoff with your developers',
            'Team rollout and maintenance process',
          ],
        },
      ],
      faqs: [
        {
          q: 'Is a design system worth it for small teams?',
          a: 'Yes, in a lean form. Even a few tokens and core components save discussion and stop every page from looking different. The system then grows with your product.',
        },
        {
          q: 'How much does a design system cost?',
          a: 'It depends on the scope: the number of components, themes and products. After the free intro call you get a concrete quote.',
        },
        {
          q: 'Do you work with our development team?',
          a: 'Yes, that is essential. I align names and values with the developers, so Figma and code speak the same language.',
        },
        {
          q: 'Can we build on our existing Figma library?',
          a: 'Yes. I tidy up existing files, make them consistent and add what is missing, rather than starting from zero.',
        },
        {
          q: 'Who maintains the system afterwards?',
          a: 'Your team. Together we agree who approves changes and how new components are added. If you like, I can keep supporting the maintenance.',
        },
      ],
    },
  },
];
