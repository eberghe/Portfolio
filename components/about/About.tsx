import { ArrowRight, Mail } from 'lucide-react';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import Instagram from '@/components/icons/Instagram';
import Linkedin from '@/components/icons/Linkedin';
import { aboutContent, aboutPhoto, timeline, tools } from '@/lib/content/about';
import { localizedPath, messages, type Locale } from '@/lib/i18n';
import { EMAIL, INSTAGRAM, LINKEDIN } from '@/lib/site';
import { profilePageJsonLd } from '@/lib/structured-data';
import Journey from './Journey';
import ToolsMarquee from './ToolsMarquee';

// Über mich, umgebaut nach Vorlage matteofabbiani.webflow.io/about. Siehe functions/seiten/ueber-mich.md
export default function About({ locale }: { locale: Locale }) {
  const t = aboutContent[locale];
  const socials = [
    { icon: Instagram, label: 'Instagram', href: INSTAGRAM },
    { icon: Linkedin, label: 'LinkedIn', href: LINKEDIN },
    { icon: Mail, label: messages[locale].footer.email, href: `mailto:${EMAIL}` },
  ];
  return (
    <>
      <JsonLd data={profilePageJsonLd(locale)} />
      {/* Schlichter Hero nach Vorlage matteofabbiani.webflow.io/about: Begrüßung, ein Satz, Links, Foto (AK-14, AK-26) */}
      <section className="max-w-page mx-auto px-6 sm:px-8 md:px-12 pt-14 md:pt-16 pb-16 md:pb-24 lg:min-h-[calc(100svh-5rem)] grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-12 md:gap-16 items-center">
        <div>
          <h1
            className="text-[44px] sm:text-[60px] md:text-[56px] lg:text-[80px] font-bold leading-[1.02] tracking-[-0.04em] mb-6 text-balance hero-rise"
            style={{ '--r': 0 } as CSSProperties}
          >
            {t.greeting}
          </h1>
          <p
            className="text-[16px] md:text-[18px] text-text2 leading-relaxed max-w-[480px] mb-8 hero-rise"
            style={{ '--r': 1 } as CSSProperties}
          >
            {t.intro}
          </p>
          <ul className="flex gap-2 -ml-3 hero-rise" style={{ '--r': 2 } as CSSProperties}>
            {socials.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center w-11 h-11 rounded-full text-foreground hover:text-primary-text hover:bg-bg2 transition-colors"
                  {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <Icon size={22} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="relative aspect-[2/3] w-full max-w-[420px] md:ml-auto overflow-hidden bg-bg2 hero-rise"
          style={{ '--r': 3 } as CSSProperties}
        >
          <Image
            src={aboutPhoto.src}
            alt={t.photoAlt}
            fill
            priority
            sizes="(min-width: 768px) 624px, 150vw"
            className="object-cover"
          />
        </div>
      </section>

      <section aria-labelledby="werkzeuge" className="border-y border-border py-8 overflow-hidden">
        <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12">
          <h2 id="werkzeuge" className="text-[11px] font-bold tracking-widest uppercase text-text3 mb-6">
            {t.tools}
          </h2>
          <ul aria-label={t.tools} className="sr-only">
            {tools.map((tool) => (
              <li key={tool.name}>{tool.name}</li>
            ))}
          </ul>
        </div>
        <ToolsMarquee pauseLabel={t.pause} />
      </section>

      <Journey
        items={timeline}
        locale={locale}
        title={t.journey}
        intro={t.journeyIntro}
        hint={t.journeyHint}
        prev={t.journeyPrev}
        next={t.journeyNext}
      />

      {/* Abschluss nach Vorlage: „Jetzt bist du dran“ (AK-19) */}
      <section aria-labelledby="ueber-abschluss" className="max-w-page mx-auto px-6 sm:px-8 md:px-12 py-24 md:py-36">
        <div data-reveal className="max-w-[860px]">
          <h2
            id="ueber-abschluss"
            className="text-[40px] md:text-[72px] font-bold leading-[1.02] tracking-[-0.04em] mb-6 text-balance"
          >
            {t.outroTitle}
          </h2>
          <p className="text-[17px] md:text-[20px] text-text2 leading-relaxed max-w-[620px] mb-10">{t.outroText}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={localizedPath('/contact', locale)}
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-lg text-[14px] font-medium hover:bg-primary-hover transition-colors"
            >
              {t.cta}
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
              />
            </Link>
            <p className="text-[14px] text-text2">
              {t.outroMail}{' '}
              <a
                href={`mailto:${EMAIL}`}
                className="underline underline-offset-4 font-medium text-foreground whitespace-nowrap"
              >
                {EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
