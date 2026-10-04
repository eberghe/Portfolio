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
      <section className="bg-primary text-primary-foreground px-6 sm:px-7 py-12">
        <div className="max-w-[900px] mx-auto">
          <p className="text-[11px] font-medium tracking-widest uppercase text-primary-foreground mb-3">{t.eyebrow}</p>
          <h1 className="text-[30px] font-medium tracking-tight mb-2">{t.title}</h1>
          <p className="text-[15px] text-primary-foreground max-w-[520px]">{t.intro}</p>
          <a
            href="#anfrage-titel"
            className="md:hidden inline-flex items-center min-h-11 mt-4 underline underline-offset-4 text-[14px] font-medium text-primary-foreground"
          >
            {t.skipToForm}
          </a>
        </div>
      </section>

      <div className="max-w-[900px] mx-auto px-6 sm:px-7">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr]">
          <section aria-labelledby="direktkontakt" className="md:border-r border-border md:pr-8 py-8">
            <h2 id="direktkontakt" className="text-[11px] font-medium tracking-wider uppercase text-text3 mb-4">
              {t.direct}
            </h2>
            <ul aria-labelledby="direktkontakt">
              {links.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label} className="border-b border-border">
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex items-center gap-3.5 py-4"
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
              <li className="flex items-center gap-3.5 py-4">
                <span aria-hidden="true" className={iconBox}>
                  <MapPin size={18} className="text-text2" />
                </span>
                <span>
                  <span className={smallLabel}>{t.location}</span>
                  <span className="block text-[13px] text-foreground">{t.locationValue}</span>
                </span>
              </li>
            </ul>
            <p className="text-[13px] text-text2 leading-relaxed mt-5">{t.directNote}</p>
          </section>

          <section aria-labelledby="anfrage-titel" className="md:pl-8 py-8 min-w-0 scroll-mt-20">
            <h2 id="anfrage-titel" className="text-[11px] font-medium tracking-wider uppercase text-text3 mb-4">
              {t.formTitle}
            </h2>
            <InquiryWizard locale={locale} />
          </section>
        </div>
      </div>
    </>
  );
}
