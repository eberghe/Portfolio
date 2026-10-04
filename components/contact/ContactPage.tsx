import { Mail, MapPin } from 'lucide-react';
import Instagram from '@/components/icons/Instagram';
import Linkedin from '@/components/icons/Linkedin';
import JsonLd from '@/components/JsonLd';
import { contactText } from '@/lib/content/contact';
import type { Locale } from '@/lib/i18n';
import { EMAIL } from '@/lib/site';
import { contactPageJsonLd } from '@/lib/structured-data';
import InquiryWizard from './InquiryWizard';

// Kontaktseite, übernommen aus Lovable (ContactPage.tsx). Siehe functions/seiten/kontakt.md
const iconBox =
  'w-10 h-10 border border-border rounded-lg flex items-center justify-center bg-bg2 shrink-0 transition-colors';
const smallLabel = 'block text-[11px] uppercase tracking-wider text-text3 font-medium mb-0.5';

export default function ContactPage({ locale }: { locale: Locale }) {
  const t = contactText[locale];
  const links = [
    { icon: Mail, label: t.email, value: EMAIL, href: `mailto:${EMAIL}`, external: false },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Erik Bergheimer',
      href: 'https://www.linkedin.com/in/erik-bergheimer/',
      external: true,
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@erik.bergheimer',
      href: 'https://www.instagram.com/erik.bergheimer/',
      external: true,
    },
  ];

  return (
    <>
      <JsonLd data={contactPageJsonLd(locale)} />
      {/* Kopf, Assistent und Direktkontakt in einem Raster: auf dem Handy in dieser Reihenfolge, ab 768 px
          Kopf und Direktkontakt links, Assistent rechts, alles im ersten Bildschirm (functions/seiten/kontakt.md AK-6) */}
      <div className="max-w-[1100px] mx-auto px-6 sm:px-8 py-4 md:py-10 grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:grid-rows-[auto_1fr] gap-x-10 lg:gap-x-16 gap-y-4 md:gap-y-6">
        <div className="md:col-start-1 md:row-start-1">
          <p className="text-[11px] font-medium tracking-widest uppercase text-primary-text mb-2">{t.eyebrow}</p>
          <h1 className="text-[26px] md:text-[34px] leading-[1.15] font-bold tracking-tight mb-2 text-balance">
            {t.title}
          </h1>
          {/* Auf dem Handy nur für Screenreader, damit der Assistent in den ersten Bildschirm passt; sichtbar steht sie dort
              unter dem Direktkontakt (kontakt.md AK-8) */}
          <p className="sr-only md:not-sr-only md:text-[15px] md:text-text2 md:leading-relaxed md:max-w-[420px]">
            {t.intro}
          </p>
        </div>

        <section
          aria-labelledby="anfrage-titel"
          className="md:col-start-2 md:row-start-1 md:row-span-2 min-w-0 sm:border sm:border-border sm:rounded-2xl bg-background sm:p-6 sm:shadow-[0_8px_30px_-16px_hsl(var(--primary)/0.25)]"
        >
          <h2 id="anfrage-titel" className="text-[11px] font-bold tracking-wider uppercase text-text3 mb-3">
            {t.formTitle}
          </h2>
          <InquiryWizard locale={locale} />
        </section>

        <section aria-labelledby="direktkontakt" className="md:col-start-1 md:row-start-2 min-w-0">
          <h2 id="direktkontakt" className="text-[11px] font-bold tracking-wider uppercase text-text3 mb-1">
            {t.direct}
          </h2>
          <ul aria-labelledby="direktkontakt">
            {links.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label} className="border-b border-border">
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center gap-3.5 py-3"
                >
                  <span aria-hidden="true" className={`${iconBox} group-hover:bg-primary group-hover:border-primary`}>
                    <Icon size={18} className="text-text2 group-hover:text-primary-foreground transition-colors" />
                  </span>
                  <span className="min-w-0">
                    <span className={smallLabel}>{label}</span>
                    <span className="block text-[13px] text-foreground break-all group-hover:text-primary-text">
                      {value}
                    </span>
                    {external && <span className="sr-only"> {t.newTab}</span>}
                  </span>
                </a>
              </li>
            ))}
            <li className="flex items-center gap-3.5 py-3">
              <span aria-hidden="true" className={iconBox}>
                <MapPin size={18} className="text-text2" />
              </span>
              <span>
                <span className={smallLabel}>{t.location}</span>
                <span className="block text-[13px] text-foreground">{t.locationValue}</span>
              </span>
            </li>
          </ul>
          <p className="text-[13px] text-text2 leading-relaxed mt-3">{t.directNote}</p>
          <p aria-hidden="true" className="md:hidden text-[13px] text-text2 leading-relaxed mt-2">
            {t.intro}
          </p>
        </section>
      </div>
    </>
  );
}
