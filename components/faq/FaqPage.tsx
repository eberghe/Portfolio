import Image from 'next/image';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { aboutPhoto } from '@/lib/content/about';
import { faqs } from '@/lib/content/faq';
import { EMAIL } from '@/lib/site';
import FaqList from './FaqList';
import { localizedPath, type Locale } from '@/lib/i18n';
import { faqJsonLd } from '@/lib/structured-data';

// FAQ mit nativem Akkordeon, übernommen aus Lovable (FaqsPage.tsx), umgebaut nach Vorlage designme.agency
// (Issue #19). Siehe functions/seiten/faq.md
export const faqText = {
  de: {
    metaTitle: 'FAQ: Zusammenarbeit, Ablauf, Dauer | Erik Bergheimer',
    metaDescription:
      'Antworten auf häufige Fragen: Leistungen, Arbeit vor Ort in Augsburg oder remote, Projektablauf, Dauer und Verfügbarkeit.',
    title: 'FAQs',
    intro: 'Häufig gestellte Fragen',
    more: 'Deine Frage ist nicht dabei?',
    cta: 'Kostenloses Erstgespräch',
    lead: 'Antworten zu Leistungen, Ablauf, Dauer und Zusammenarbeit, vor Ort in Augsburg oder remote.',
    moreText:
      'Frag mich einfach direkt. Im kostenlosen Erstgespräch oder per E-Mail, ich antworte meist innerhalb von 24 Stunden.',
    photoAlt: 'Erik Bergheimer, lächelnd',
  },
  en: {
    metaTitle: 'FAQ: collaboration, process, timelines | Erik Bergheimer',
    metaDescription:
      'Answers to common questions: services, working on site in Augsburg or remotely, project process, timelines and availability.',
    title: 'FAQs',
    intro: 'Frequently asked questions',
    more: 'Your question is not listed?',
    cta: 'Free intro call',
    lead: 'Answers about services, process, timelines and working together, on site in Augsburg or remotely.',
    moreText: 'Just ask me directly. In a free intro call or by email, I usually reply within 24 hours.',
    photoAlt: 'Erik Bergheimer, smiling',
  },
};

export default function FaqPage({ locale }: { locale: Locale }) {
  const t = faqText[locale];
  return (
    <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12">
      <JsonLd data={faqJsonLd(locale)} />
      <div className="pt-14 pb-10 md:pt-20 md:pb-14 motion-safe:animate-fade-in">
        <p className="text-[11px] font-medium tracking-widest uppercase text-primary-text mb-3">{t.title}</p>
        <h1 className="text-[34px] md:text-[48px] font-bold leading-[1.08] tracking-[-0.03em] mb-4">{t.intro}</h1>
        <p className="text-[16px] md:text-[18px] text-text2 max-w-[560px]">{t.lead}</p>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-10 lg:gap-14 pb-20">
        <div className="lg:order-2 min-w-0">
          <FaqList items={faqs.map((f) => ({ ...f[locale], id: f.id }))} level={2} />
        </div>
        <aside
          aria-labelledby="faq-frage"
          data-reveal
          className="lg:order-1 lg:sticky lg:top-24 lg:self-start rounded-2xl border border-border bg-bg2 p-6 md:p-8"
        >
          <div className="relative w-16 h-16 rounded-full overflow-hidden mb-5 border border-border">
            <Image src={aboutPhoto.src} alt={t.photoAlt} fill sizes="64px" className="object-cover" />
          </div>
          <h2 id="faq-frage" className="text-[20px] font-bold mb-2">
            {t.more}
          </h2>
          <p className="text-[14px] text-text2 leading-relaxed mb-6">{t.moreText}</p>
          <Link
            href={localizedPath('/contact', locale)}
            className="inline-flex items-center justify-center w-full bg-primary text-primary-foreground px-5 py-3 rounded-lg text-[14px] font-medium hover:bg-primary-hover transition-colors mb-3"
          >
            {t.cta}
          </Link>
          <a
            href={`mailto:${EMAIL}`}
            className="block text-center text-[13px] text-text2 hover:text-primary-text underline underline-offset-4 break-all"
          >
            {EMAIL}
          </a>
        </aside>
      </div>
    </div>
  );
}
