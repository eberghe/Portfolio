import JsonLd from '@/components/JsonLd';
import { contactText } from '@/lib/content/contact';
import type { Locale } from '@/lib/i18n';
import { contactPageJsonLd } from '@/lib/structured-data';
import InquiryWizard from './InquiryWizard';

// Kontaktseite, übernommen aus Lovable (ContactPage.tsx). Siehe functions/seiten/kontakt.md
export default function ContactPage({ locale }: { locale: Locale }) {
  const t = contactText[locale];

  return (
    <>
      <JsonLd data={contactPageJsonLd(locale)} />
      {/* Links Überschrift und Absatz, rechts der Assistent, alles im ersten Bildschirm (functions/seiten/kontakt.md AK-6, AK-9) */}
      <div className="max-w-[1100px] mx-auto px-6 sm:px-8 py-4 md:py-10 grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-10 lg:gap-x-16 gap-y-4 md:items-start">
        <div className="md:sticky md:top-28">
          <h1 className="text-[26px] md:text-[40px] lg:text-[48px] leading-[1.1] font-bold tracking-tight mb-2 md:mb-4 text-balance">
            {t.title}
          </h1>
          {/* Auf dem Handy nur für Screenreader, damit der Assistent in den ersten Bildschirm passt; sichtbar steht er dort
              unter dem Assistenten (kontakt.md AK-8) */}
          <p className="sr-only md:not-sr-only md:text-[16px] md:text-text2 md:leading-relaxed md:max-w-[420px]">
            {t.intro}
          </p>
        </div>

        <section
          aria-labelledby="anfrage-titel"
          className="min-w-0 sm:border sm:border-border sm:rounded-2xl bg-background sm:p-6 sm:shadow-[0_8px_30px_-16px_hsl(var(--primary)/0.25)]"
        >
          <h2 id="anfrage-titel" className="text-[11px] font-bold tracking-wider uppercase text-text3 mb-3">
            {t.formTitle}
          </h2>
          <InquiryWizard locale={locale} />
        </section>

        <p aria-hidden="true" className="md:hidden text-[13px] text-text2 leading-relaxed">
          {t.intro}
        </p>
      </div>
    </>
  );
}
