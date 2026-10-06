import { Accessibility, Grid3x3, Layout, Monitor, PenTool, Sparkles, Workflow, type LucideIcon } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

// Leistungen, siehe functions/seiten/leistungen.md.
// Texte bestehender Leistungen aus dem Lovable-Projekt; neue Leistungen sind Entwürfe (von Erik zu prüfen).
export interface ServiceText {
  /** Kleine Überschrift über dem Titel */
  label: string;
  title: string;
  /** „Wann du das brauchst“: ein Satz aus Sicht des Kunden (leistungen.md AK-33) */
  need: string;
  /** Kurzbeschreibung für Kacheln */
  short: string;
  /** Einleitung der Detailseite */
  description: string;
  /** „Das ist enthalten" */
  features: string[];
  /** Schlagworte in der Sprache der Seite */
  tags: string[];
}

export interface Service extends Record<Locale, ServiceText> {
  slug: string;
  icon: LucideIcon;
  /** Hervorgehobene Kachel auf der Startseite */
  featured?: boolean;
  /** Slugs der passenden Leistungen (2 bis 3), AK-9 */
  related: string[];
}

export const services: Service[] = [
  {
    slug: 'ux-ui-design',
    related: ['design-systems', 'accessibility', 'webflow-development'],
    icon: Layout,
    featured: true,
    de: {
      tags: ['Figma', 'Prototyping', 'Nutzerforschung', 'Usability-Tests', 'Wireframes'],
      description:
        'Von der ersten Idee bis zum fertigen Interface: Nutzeranalyse, Wireframes, Prototypen und sauberes Handoff an die Entwicklung.',
      features: [
        'User Research & Interviews',
        'Wireframing & Prototyping',
        'Visual Design & UI',
        'Usability Testing',
        'Design Handoff & Dev Support',
      ],
      label: 'Kernservice',
      title: 'UX/UI Design',
      // TODO(Erik): Entwurf prüfen (leistungen.md AK-33)
      need: 'Dein Produkt kann viel, aber Nutzer finden sich nicht zurecht: Abläufe sind umständlich, Fragen an den Support häufen sich und jede neue Funktion macht es komplizierter.',
      short:
        'Von der ersten Idee bis zum fertigen Interface. Ich gestalte digitale Produkte, die sich gut anfühlen und einfach funktionieren.',
    },
    en: {
      tags: ['Figma', 'Prototyping', 'User research', 'Usability testing', 'Wireframing'],
      description:
        'From research through wireframes to final interface, user-centered, accessible, on point. I guide the entire design process: from initial user analysis through iterative prototypes to pixel-perfect developer handoff.',
      features: [
        'User Research & Interviews',
        'Wireframing & Prototyping',
        'Visual Design & UI',
        'Usability Testing',
        'Design Handoff & Dev Support',
      ],
      label: 'Core service',
      title: 'UX/UI Design',
      // TODO(Erik): Entwurf prüfen (leistungen.md AK-33)
      need: 'Your product can do a lot, but people get lost in it: flows feel clunky, support questions pile up and every new feature makes it more complicated.',
      short: 'From first idea to final interface. I design digital products that feel right and just work.',
    },
  },
  {
    slug: 'webflow-development',
    related: ['ux-ui-design', 'website-process-optimization', 'accessibility'],
    icon: Monitor,
    de: {
      tags: ['Webflow', 'CMS', 'Animationen', 'SEO'],
      description:
        'Schnelle, animierte Websites ohne Code-Overhead. Ich baue responsive Seiten mit Webflow, inklusive CMS und Custom Interactions, barrierefrei und suchmaschinenfreundlich.',
      features: [
        'Responsive Website-Entwicklung',
        'CMS-Setup & Content-Modellierung',
        'Interactions & Animationen',
        'Performance-Optimierung',
        'SEO & Launch-Support',
      ],
      label: 'Webflow',
      title: 'Webflow-Entwicklung',
      // TODO(Erik): Entwurf prüfen (leistungen.md AK-33)
      need: 'Deine Website wirkt veraltet, lädt langsam oder jede kleine Änderung braucht eine Agentur. Du willst eine Seite, die gut aussieht und die dein Team selbst pflegen kann.',
      short: 'Schnelle, professionelle Websites mit Webflow, inklusive CMS, Animationen und sauberer Struktur.',
    },
    en: {
      tags: ['Webflow', 'CMS', 'Animations', 'SEO'],
      description:
        'Fast, animated websites without code overhead. I build responsive sites in Webflow, including CMS and custom interactions, accessible and search-friendly.',
      features: [
        'Responsive website development',
        'CMS setup & content modelling',
        'Interactions & animations',
        'Performance optimisation',
        'SEO & launch support',
      ],
      label: 'Webflow',
      title: 'Webflow development',
      // TODO(Erik): Entwurf prüfen (leistungen.md AK-33)
      need: 'Your website looks dated, loads slowly or every small change needs an agency. You want a site that looks good and that your team can update on its own.',
      short: 'Fast, professional websites built in Webflow, including CMS, animations and a clean structure.',
    },
  },
  {
    slug: 'accessibility',
    related: ['ux-ui-design', 'website-process-optimization', 'webflow-development'],
    icon: Accessibility,
    de: {
      tags: ['WCAG 2.2', 'BFSG', 'Audit', 'Screenreader'],
      description:
        'Barrierefreiheit ist kein Extra, sondern gehört dazu. Ich prüfe dein Produkt nach WCAG, setze die Anforderungen des BFSG um und gestalte Interfaces, die alle nutzen können.',
      features: [
        'WCAG-Audits mit Maßnahmenplan',
        'Umsetzung der BFSG-Anforderungen',
        'Tests mit Screenreader und Tastatur',
        'Barrierefreie Design-Patterns',
        'Erklärung zur Barrierefreiheit',
      ],
      label: 'Barrierefreiheit',
      title: 'Barrierefreiheit-Beratung',
      // TODO(Erik): Entwurf prüfen (leistungen.md AK-33)
      need: 'Seit Juni 2025 gilt das Barrierefreiheitsstärkungsgesetz, und du weißt nicht, ob deine Website oder App die Anforderungen erfüllt oder wo du anfangen sollst.',
      short: 'WCAG-Audits und Umsetzung der BFSG-Anforderungen, damit dein Produkt für alle nutzbar ist.',
    },
    en: {
      tags: ['WCAG 2.2', 'EAA', 'Audit', 'Screen reader'],
      description:
        'Accessibility is not an add-on, it is part of quality. I audit your product against WCAG, implement the European Accessibility Act requirements and design interfaces everyone can use.',
      features: [
        'WCAG audits with action plan',
        'Implementing European Accessibility Act requirements',
        'Screen reader and keyboard testing',
        'Accessible design patterns',
        'Accessibility statement',
      ],
      label: 'Accessibility',
      title: 'Accessibility consulting',
      // TODO(Erik): Entwurf prüfen (leistungen.md AK-33)
      need: 'The European Accessibility Act has applied since June 2025, and you are not sure whether your website or app meets it or where to start.',
      short:
        'WCAG audits and implementing the European Accessibility Act requirements, so your product works for everyone.',
    },
  },
  {
    slug: 'ai-consulting',
    related: ['website-process-optimization', 'ux-ui-design'],
    icon: Sparkles,
    de: {
      tags: ['KI', 'Automatisierung', 'Workshops', 'Prompting'],
      description:
        'Ich finde mit dir die Stellen, an denen KI im Alltag wirklich Zeit spart, teste passende Werkzeuge und führe sie so ein, dass dein Team sie gern nutzt.',
      features: [
        'Workshop: Wo hilft KI in deinem Alltag?',
        'Auswahl und Test passender Werkzeuge',
        'Prototypen für wiederkehrende Aufgaben',
        'Einführung und Schulung im Team',
        'Leitlinien für Datenschutz und Qualität',
      ],
      label: 'KI',
      title: 'KI-Beratung',
      // TODO(Erik): Entwurf prüfen (leistungen.md AK-33)
      need: 'Alle reden über KI, aber in deinem Team bleibt es beim Ausprobieren. Du willst wissen, wo sie euch wirklich Arbeit abnimmt und wie ihr sie sicher einsetzt.',
      short: 'Wo KI dir wirklich Zeit spart: vom ersten Workshop bis zum eingeführten Werkzeug im Alltag.',
    },
    en: {
      tags: ['AI', 'Automation', 'Workshops', 'Prompting'],
      description:
        'Together we find the places where AI actually saves time, test suitable tools and roll them out so your team enjoys using them.',
      features: [
        'Workshop: where can AI help you?',
        'Selecting and testing suitable tools',
        'Prototypes for recurring tasks',
        'Team onboarding and training',
        'Guidelines for privacy and quality',
      ],
      label: 'AI',
      title: 'AI consulting',
      // TODO(Erik): Entwurf prüfen (leistungen.md AK-33)
      need: 'Everyone talks about AI, but your team never gets past experimenting. You want to know where it really saves work and how to use it safely.',
      short: 'Where AI actually saves you time: from the first workshop to a tool your team uses every day.',
    },
  },
  {
    slug: 'website-process-optimization',
    related: ['accessibility', 'ai-consulting', 'webflow-development'],
    icon: Workflow,
    de: {
      tags: ['Analyse', 'Performance', 'Conversion', 'Prozesse'],
      description:
        'Ich analysiere deine Website und die Abläufe dahinter: Ladezeit, Barrierefreiheit, Suchmaschinen, Nutzerführung und interne Prozesse. Daraus entsteht ein klarer Plan, den wir gemeinsam umsetzen.',
      features: [
        'Website-Analyse (Performance, Barrierefreiheit, SEO)',
        'Nutzerführung und Anfrage-Strecken verbessern',
        'Abläufe und Werkzeuge vereinfachen',
        'Digitale Positionierung',
        'Laufende Optimierung',
      ],
      label: 'Optimierung',
      title: 'Website- & Prozessoptimierung',
      // TODO(Erik): Entwurf prüfen (leistungen.md AK-33)
      need: 'Deine Website bringt zu wenige Anfragen, und intern laufen Abläufe über Umwege, Tabellen und doppelte Arbeit. Du spürst, dass mehr drin ist.',
      short: 'Ich analysiere deine Website und Abläufe und mache sie schneller, klarer und wirksamer.',
    },
    en: {
      tags: ['Analysis', 'Performance', 'Conversion', 'Processes'],
      description:
        'I analyse your website and the workflows behind it: load time, accessibility, search, user journeys and internal processes. The result is a clear plan we implement together.',
      features: [
        'Website analysis (performance, accessibility, SEO)',
        'Improving user journeys and enquiry flows',
        'Simplifying workflows and tools',
        'Digital positioning',
        'Ongoing optimisation',
      ],
      label: 'Optimisation',
      title: 'Website & process optimisation',
      // TODO(Erik): Entwurf prüfen (leistungen.md AK-33)
      need: 'Your website brings in too few enquiries, and internal workflows run through detours, spreadsheets and duplicate work. You know there is more potential.',
      short: 'I analyse your website and workflows and make them faster, clearer and more effective.',
    },
  },
  {
    slug: 'brand-logo-design',
    related: ['design-systems', 'webflow-development', 'ux-ui-design'],
    icon: PenTool,
    de: {
      tags: ['Logo', 'Typografie', 'Styleguide', 'Branding'],
      description:
        'Ein Auftritt, der zu dir passt: Logo, Farben, Typografie und ein Styleguide, mit dem dein Auftritt auf Website, Social Media und Print gleich wirkt.',
      features: [
        'Logo-Design',
        'Farb- und Schriftsystem',
        'Styleguide',
        'Anwendung auf Website und Social Media',
        'Übergabe aller Dateien',
      ],
      label: 'Brand',
      title: 'Brand- & Logo-Design',
      // TODO(Erik): Entwurf prüfen (leistungen.md AK-33)
      need: 'Dein Unternehmen ist gewachsen, aber der Auftritt hat nicht mitgezogen: Logo, Farben und Unterlagen passen nicht zusammen und wirken nicht mehr wie du.',
      short: 'Logo, Typografie und Styleguide für einen Auftritt, der zu dir passt und überall gleich wirkt.',
    },
    en: {
      tags: ['Logo', 'Typography', 'Style guide', 'Branding'],
      description:
        'A presence that fits you: logo, colours, typography and a style guide that keeps your brand consistent on web, social media and print.',
      features: [
        'Logo design',
        'Colour and type system',
        'Style guide',
        'Application to website and social media',
        'Handover of all files',
      ],
      label: 'Brand',
      title: 'Brand & logo design',
      // TODO(Erik): Entwurf prüfen (leistungen.md AK-33)
      need: 'Your business has grown, but its look has not kept up: logo, colours and materials do not match and no longer feel like you.',
      short: 'Logo, typography and style guide for a presence that fits you and stays consistent everywhere.',
    },
  },
  {
    slug: 'design-systems',
    related: ['ux-ui-design', 'brand-logo-design', 'accessibility'],
    icon: Grid3x3,
    de: {
      tags: ['Design-Tokens', 'Komponenten', 'Figma', 'Dokumentation'],
      description:
        'Ich baue Design Systems, die Teams schneller und konsistenter arbeiten lassen, mit Token-Architektur, Komponenten und klarer Doku.',
      features: [
        'Design-Token-Architektur',
        'Komponentenbibliothek (Figma)',
        'Dokumentation & Richtlinien',
        'Theming & Dunkelmodus',
        'Design-Dev-Übergabe',
      ],
      label: 'Design Systems',
      title: 'Design Systems',
      // TODO(Erik): Entwurf prüfen (leistungen.md AK-33)
      need: 'Dein Team baut dieselben Komponenten immer wieder neu, Screens sehen überall etwas anders aus und Übergaben an die Entwicklung kosten zu viel Zeit.',
      short: 'Konsistenz, die mitwächst: Design-Tokens, Komponenten und Doku, mit denen dein Team schneller gestaltet.',
    },
    en: {
      tags: ['Tokens', 'Components', 'Figma', 'Documentation'],
      description:
        'Scalable, token-based component libraries for consistent products. I build design systems that empower teams to work faster and more consistently.',
      features: [
        'Design token architecture',
        'Component library (Figma)',
        'Documentation & guidelines',
        'Theming & dark mode',
        'Design-dev handoff',
      ],
      label: 'Design Systems',
      title: 'Design systems',
      // TODO(Erik): Entwurf prüfen (leistungen.md AK-33)
      need: 'Your team keeps rebuilding the same components, screens look slightly different everywhere and handoffs to development take too long.',
      short: 'Consistency that scales: design tokens, components and docs that help your team design faster.',
    },
  },
];
