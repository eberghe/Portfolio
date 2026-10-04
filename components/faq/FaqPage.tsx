import { Plus } from 'lucide-react';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { faqs } from '@/lib/content/faq';
import { localizedPath, type Locale } from '@/lib/i18n';
import { faqJsonLd } from '@/lib/structured-data';

// FAQ mit nativem Akkordeon, übernommen aus Lovable (FaqsPage.tsx). Siehe functions/seiten/faq.md
export const faqText = {
  de: {
    metaTitle: 'FAQ: Zusammenarbeit, Ablauf, Dauer | Erik Bergheimer',
    metaDescription:
      'Antworten auf häufige Fragen: Leistungen, Arbeit vor Ort in Augsburg & Innsbruck oder remote, Projektablauf, Dauer und Verfügbarkeit.',
    title: 'FAQs',
    intro: 'Häufig gestellte Fragen',
    more: 'Deine Frage ist nicht dabei?',
    cta: 'Schreib mir',
  },
  en: {
    metaTitle: 'FAQ: collaboration, process, timelines | Erik Bergheimer',
    metaDescription:
      'Answers to common questions: services, working on site in Augsburg & Innsbruck or remotely, project process, timelines and availability.',
    title: 'FAQs',
    intro: 'Frequently asked questions',
    more: 'Your question is not listed?',
    cta: 'Get in touch',
  },
};

export default function FaqPage({ locale }: { locale: Locale }) {
  const t = faqText[locale];
  return (
    <div className="max-w-[900px] mx-auto px-6 sm:px-7">
      <JsonLd data={faqJsonLd(locale)} />
      <div className="py-14 border-b border-border mb-8">
        <h1 className="text-[28px] font-medium tracking-tight mb-2">{t.title}</h1>
        <p className="text-sm text-text2">{t.intro}</p>
      </div>
      <div className="pb-12 space-y-2">
        {faqs.map((f) => (
          <details key={f.id} id={f.id} className="group border-b border-border">
            <summary className="flex items-center justify-between py-6 text-sm text-foreground hover:text-primary-text transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span>{f[locale].q}</span>
              <span
                aria-hidden="true"
                className="w-5 h-5 border border-border rounded-full flex items-center justify-center shrink-0 ml-4 transition-colors group-open:bg-primary group-open:border-primary"
              >
                <Plus
                  size={10}
                  className="text-text3 motion-safe:transition-transform group-open:rotate-45 group-open:text-primary-foreground"
                />
              </span>
            </summary>
            <p className="text-[13px] text-text2 leading-relaxed pb-4 max-w-[620px]">{f[locale].a}</p>
          </details>
        ))}
      </div>
      <p className="pb-20 text-sm text-text2">
        {t.more}{' '}
        <Link
          href={localizedPath('/contact', locale)}
          className="text-primary-text font-medium underline underline-offset-2"
        >
          {t.cta}
        </Link>
      </p>
    </div>
  );
}
