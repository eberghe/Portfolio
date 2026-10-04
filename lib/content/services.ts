import {
  Accessibility,
  Camera,
  Grid3x3,
  Layout,
  Monitor,
  PenTool,
  Sparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { Locale } from '@/lib/i18n';

// Leistungen, siehe functions/seiten/leistungen.md.
// Texte bestehender Leistungen aus dem Lovable-Projekt; neue Leistungen sind Entwürfe (von Erik zu prüfen).
export interface ServiceText {
  /** Kleine Überschrift über dem Titel */
  label: string;
  title: string;
  /** Kurzbeschreibung für Kacheln */
  short: string;
}

export interface Service extends Record<Locale, ServiceText> {
  slug: string;
  icon: LucideIcon;
  /** Hervorgehobene Kachel auf der Startseite */
  featured?: boolean;
}

export const services: Service[] = [
  {
    slug: 'ux-ui-design',
    icon: Layout,
    featured: true,
    de: {
      label: 'Kernservice',
      title: 'UX/UI Design',
      short:
        'Von der ersten Idee bis zum fertigen Interface. Ich gestalte digitale Produkte, die sich gut anfühlen und einfach funktionieren.',
    },
    en: {
      label: 'Core service',
      title: 'UX/UI Design',
      short: 'From first idea to final interface. I design digital products that feel right and just work.',
    },
  },
  {
    slug: 'webflow-development',
    icon: Monitor,
    de: {
      label: 'Webflow',
      title: 'Webflow-Entwicklung',
      short: 'Schnelle, professionelle Websites mit Webflow, inklusive CMS, Animationen und sauberer Struktur.',
    },
    en: {
      label: 'Webflow',
      title: 'Webflow development',
      short: 'Fast, professional websites built in Webflow, including CMS, animations and a clean structure.',
    },
  },
  {
    slug: 'accessibility',
    icon: Accessibility,
    de: {
      label: 'Barrierefreiheit',
      title: 'Barrierefreiheit-Beratung',
      short: 'WCAG-Audits und Umsetzung der BFSG-Anforderungen, damit dein Produkt für alle nutzbar ist.',
    },
    en: {
      label: 'Accessibility',
      title: 'Accessibility consulting',
      short:
        'WCAG audits and implementing the European Accessibility Act requirements, so your product works for everyone.',
    },
  },
  {
    slug: 'ai-consulting',
    icon: Sparkles,
    de: {
      label: 'KI',
      title: 'KI-Beratung',
      short: 'Wo KI dir wirklich Zeit spart: vom ersten Workshop bis zum eingeführten Werkzeug im Alltag.',
    },
    en: {
      label: 'AI',
      title: 'AI consulting',
      short: 'Where AI actually saves you time: from the first workshop to a tool your team uses every day.',
    },
  },
  {
    slug: 'website-process-optimization',
    icon: Workflow,
    de: {
      label: 'Optimierung',
      title: 'Website- & Prozessoptimierung',
      short: 'Ich analysiere deine Website und Abläufe und mache sie schneller, klarer und wirksamer.',
    },
    en: {
      label: 'Optimisation',
      title: 'Website & process optimisation',
      short: 'I analyse your website and workflows and make them faster, clearer and more effective.',
    },
  },
  {
    slug: 'brand-logo-design',
    icon: PenTool,
    de: {
      label: 'Brand',
      title: 'Brand- & Logo-Design',
      short: 'Logo, Typografie und Styleguide für einen Auftritt, der zu dir passt und überall gleich wirkt.',
    },
    en: {
      label: 'Brand',
      title: 'Brand & logo design',
      short: 'Logo, typography and style guide for a presence that fits you and stays consistent everywhere.',
    },
  },
  {
    slug: 'design-systems',
    icon: Grid3x3,
    de: { label: 'Design Systems', title: 'Skalierbare Systeme', short: 'Konsistenz, die mitwächst.' },
    en: { label: 'Design Systems', title: 'Scalable systems', short: 'Consistency that scales.' },
  },
  {
    slug: 'photography',
    icon: Camera,
    de: { label: 'Fotografie', title: 'Travel & Editorial', short: 'Echte Momente, ehrliche Bilder.' },
    en: { label: 'Photography', title: 'Travel & Editorial', short: 'Real moments, honest images.' },
  },
];
