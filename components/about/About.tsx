import { MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { aboutContent, aboutPhoto, chips, timeline, tools } from '@/lib/content/about';
import { localizedPath, type Locale } from '@/lib/i18n';
import { profilePageJsonLd } from '@/lib/structured-data';
import ToolsMarquee from './ToolsMarquee';

// Über mich, übernommen aus Lovable (AboutPage.tsx, LogoSlider.tsx). Siehe functions/seiten/ueber-mich.md
export default function About({ locale }: { locale: Locale }) {
  const t = aboutContent[locale];
  return (
    <>
      <JsonLd data={profilePageJsonLd(locale)} />
      <section className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-2 border-b border-border">
        <div className="px-6 sm:px-8 md:px-16 py-16 md:py-20 flex flex-col justify-center">
          <p className="inline-flex items-center gap-1.5 bg-primary-light text-primary-text border border-primary-border px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide mb-8 w-fit">
            <span
              aria-hidden="true"
              className="w-[5px] h-[5px] bg-primary rounded-full motion-safe:animate-pulse-dot"
            />
            {t.badge}
          </p>
          <h1 className="text-[32px] font-bold tracking-tight mb-2">{t.title}</h1>
          <p className="text-sm text-primary-text mb-5">{t.subtitle}</p>
          <p className="flex items-center gap-1.5 text-[13px] text-text2 mb-6">
            <MapPin size={13} aria-hidden="true" />
            {t.facts}
          </p>
          <p className="text-[15px] text-text2 leading-relaxed max-w-[500px] mb-8">{t.intro}</p>
          <ul className="flex flex-wrap gap-2">
            {chips[locale].map((c) => (
              <li
                key={c}
                className="bg-primary-light text-primary-text border border-primary-border px-3 py-1.5 rounded-full text-[11px] font-medium"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative border-t md:border-t-0 md:border-l border-border overflow-hidden min-h-[300px] md:min-h-0">
          <Image
            src={aboutPhoto.src}
            alt={t.photoAlt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section aria-labelledby="werkzeuge" className="border-b border-border py-8 overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
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

      <section className="max-w-[1100px] mx-auto px-6 sm:px-8 md:px-12 py-16">
        <h2 className="text-[11px] font-bold tracking-widest text-text3 uppercase mb-10">{t.journey}</h2>
        <ol className="relative">
          <span aria-hidden="true" className="absolute left-[7px] top-0 bottom-0 w-[1.5px] bg-border" />
          {timeline.map((item) => (
            <li
              key={item.date}
              className="relative grid grid-cols-[24px_1fr] md:grid-cols-[24px_1fr_320px] gap-5 md:gap-8 py-10"
            >
              <span
                aria-hidden="true"
                className="absolute left-[3px] top-[46px] w-[9px] h-[9px] bg-primary rounded-full border-2 border-background shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]"
              />
              <div />
              <div className="md:sticky md:top-24 md:self-start">
                <time dateTime={item.date} className="block text-[11px] text-text2 mb-1.5">
                  {new Date(`${item.date}-01`).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-GB', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </time>
                <h3 className="text-[15px] font-bold text-foreground mb-2 leading-snug">{item[locale].title}</h3>
                <p className="text-[13px] text-text2 leading-relaxed">{item[locale].text}</p>
              </div>
              {item.image && (
                <div className="col-start-2 md:col-start-3 w-full rounded-xl overflow-hidden border border-border">
                  <Image
                    src={item.image.src}
                    width={item.image.width}
                    height={item.image.height}
                    alt={item.image.alt[locale]}
                    sizes="(min-width: 768px) 320px, 90vw"
                    className="w-full h-auto"
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-6 border-t border-border pt-10 text-center">
          <p className="text-[13px] text-text2 mb-5 max-w-[420px] mx-auto">{t.ctaText}</p>
          <Link
            href={localizedPath('/contact', locale)}
            className="inline-flex bg-primary text-primary-foreground px-6 py-3 rounded-lg text-[13px] font-medium hover:bg-primary-hover transition-colors"
          >
            {t.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
