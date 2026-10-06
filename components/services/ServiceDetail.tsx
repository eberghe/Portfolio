import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import FaqList from '@/components/faq/FaqList';
import JsonLd from '@/components/JsonLd';
import { projects } from '@/lib/content/projects';
import { serviceDetails } from '@/lib/content/service-details';
import { services, type Service } from '@/lib/content/services';
import { localizedPath, type Locale } from '@/lib/i18n';
import { localPageForService } from '@/lib/content/local';
import { breadcrumbJsonLd, faqListJsonLd, serviceJsonLd } from '@/lib/structured-data';
import { overviewText } from './ServicesOverview';

// Detailseite einer Leistung, übernommen aus Lovable (ServiceDetailPage.tsx) und umgebaut nach Vorlage
// designme.agency/services (Issue #16). Siehe functions/seiten/leistungen.md

/** Leistungsname klein im Satz, außer Akronyme (UX/UI, AI) und Marken (AK-17) */
const brands = ['Webflow'];
const lowerFirst = (title: string) =>
  title
    .split(' ')
    .map((word) =>
      (word.length > 1 && word[1] === word[1]!.toUpperCase()) || brands.includes(word)
        ? word
        : word.charAt(0).toLowerCase() + word.slice(1),
    )
    .join(' ');
const text = {
  de: {
    back: 'Alle Leistungen',
    included: 'Das ist enthalten',
    related: 'Passende Leistungen',
    place:
      'Ich arbeite von Königsbrunn bei Augsburg aus: vor Ort in Augsburg und Umgebung, sonst remote in ganz Deutschland.',
    interested: (title: string) => `Interesse an ${title}?`,
    talk: 'Im kostenlosen Erstgespräch klären wir unverbindlich, was du brauchst und wie ich dir helfen kann.',
    cta: 'Kostenloses Erstgespräch',
    work: 'Ausgewähltes Projekt',
    readCase: 'Fallstudie lesen',
    tags: 'Schlagworte',
    step: 'Schritt',
    outputs: 'Typische Ergebnisse',
    packages: 'Pakete',
    packagesIntro: 'Zwei typische Wege. Umfang und Preis klären wir im Erstgespräch, passend zu deinem Projekt.',
    enquire: (name: string) => `Paket „${name}“ anfragen`,
    tools: 'Werkzeuge',
    why: 'Warum mit mir',
    whyCards: [
      {
        title: 'Ein Ansprechpartner',
        text: 'Du sprichst von der ersten Idee bis zum Livegang mit mir, ohne Weiterreichen und ohne Stille Post.',
      },
      {
        title: 'Ehrliche Einschätzung',
        text: 'Ich sage dir offen, was sich lohnt und was nicht, auch wenn das kleinere Aufträge bedeutet.',
      },
      {
        title: 'Vor Ort und remote',
        text: 'In und um Augsburg treffen wir uns gern persönlich, sonst arbeiten wir unkompliziert per Video in ganz Deutschland.',
      },
    ],
    faq: 'Häufige Fragen',
    allFaqs: 'Alle FAQs',
  },
  en: {
    back: 'All services',
    included: "What's included",
    related: 'Related services',
    place: 'I work from Königsbrunn near Augsburg: on site in and around Augsburg, otherwise remotely across Germany.',
    interested: (title: string) => `Interested in ${lowerFirst(title)}?`,
    talk: 'In a free, no-obligation intro call we work out what you need and how I can help.',
    cta: 'Free intro call',
    work: 'Selected work',
    readCase: 'Read case study',
    tags: 'Tags',
    step: 'Step',
    outputs: 'Typical outputs',
    packages: 'Packages',
    packagesIntro: 'Two typical routes. We agree scope and price in the intro call, tailored to your project.',
    enquire: (name: string) => `Enquire about the “${name}” package`,
    tools: 'Tools',
    why: 'Why work with me',
    whyCards: [
      {
        title: 'One point of contact',
        text: 'You talk to me from the first idea to launch, with no hand-offs and nothing lost in translation.',
      },
      {
        title: 'Honest advice',
        text: 'I tell you openly what is worth doing and what is not, even if that means a smaller job for me.',
      },
      {
        title: 'On site and remote',
        text: 'In and around Augsburg we can meet in person; elsewhere in Germany we work easily over video.',
      },
    ],
    faq: 'Frequently asked questions',
    allFaqs: 'All FAQs',
  },
};

const eyebrow = 'text-[11px] font-bold tracking-widest uppercase text-text3';
const sectionClass = 'py-16 md:py-20 border-b border-border';
const stagger = (i: number) => ({ '--reveal-i': i }) as CSSProperties;

export default function ServiceDetail({ service, locale }: { service: Service; locale: Locale }) {
  const t = text[locale];
  const content = service[locale];
  const detail = serviceDetails.find((d) => d.slug === service.slug)!;
  const d = detail[locale];
  const Icon = service.icon;
  const related = service.related.flatMap((slug) => services.filter((s) => s.slug === slug));
  const project = projects.find((p) => p.slug === detail.project);
  const contactHref = localizedPath(`/contact?leistung=${service.slug}`, locale);
  const local = localPageForService(service.slug);

  return (
    <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12">
      <JsonLd data={serviceJsonLd(service, locale)} />
      <JsonLd data={breadcrumbJsonLd(service, locale)} />
      <JsonLd data={faqListJsonLd(d.faqs, locale)} />
      <div className="pt-8 pb-4">
        <Link
          href={localizedPath('/services', locale)}
          className="inline-flex items-center gap-1.5 py-1 text-[13px] text-text2 hover:text-primary-text transition-colors"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {t.back}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 md:gap-14 pt-8 pb-16 md:pb-20 border-b border-border">
        <div className="motion-safe:animate-fade-in">
          <p className="text-[11px] font-medium tracking-widest uppercase text-primary-text mb-4">{d.eyebrow}</p>
          <h1 className="text-[34px] md:text-[48px] font-bold leading-[1.08] tracking-[-0.03em] mb-5 text-balance">
            {d.headline}
          </h1>
          <p className="text-[18px] md:text-[20px] text-foreground leading-snug mb-4 text-balance">{d.lead}</p>
          <p className="text-[13px] text-text2 leading-relaxed mb-8">
            {t.place}
            {local && (
              <>
                {' '}
                <Link
                  href={localizedPath(local.path, locale)}
                  className="text-primary-text underline underline-offset-4 hover:no-underline"
                >
                  {local[locale].serviceLink}
                </Link>
              </>
            )}
          </p>
          <Link
            href={contactHref}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-[14px] font-medium hover:bg-primary-hover transition-colors mb-8"
          >
            {t.cta}
          </Link>
          <ul aria-label={overviewText[locale].keywords} className="flex flex-wrap gap-2">
            {content.tags.map((tag) => (
              <li
                key={tag}
                className="bg-primary-light text-primary-text border border-primary-border px-3 py-1.5 rounded-full text-[11px] font-medium"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <section aria-labelledby="enthalten" className="flex items-start">
          <div className="w-full bg-bg3 rounded-2xl border border-border p-8">
            <span
              aria-hidden="true"
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-primary-light"
            >
              <Icon size={22} className="text-primary-text" />
            </span>
            <h2 id="enthalten" className="text-sm font-bold text-foreground mb-2">
              {t.included}
            </h2>
            <p className="text-[13px] text-text2 leading-relaxed mb-5">{content.description}</p>
            <ul className="space-y-3.5">
              {content.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-[13px] text-text2">
                  <Check size={15} aria-hidden="true" className="text-primary-text shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {project && (
        <section aria-labelledby="projekt" className={sectionClass}>
          <h2 id="projekt" className={`${eyebrow} mb-6`} data-reveal>
            {t.work}
          </h2>
          <Link
            href={localizedPath(`/projects/${project.slug}`, locale)}
            aria-labelledby="projekt-titel"
            aria-describedby="projekt-text"
            data-reveal
            className="group grid md:grid-cols-2 rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 motion-safe:transition"
          >
            <span className="relative block aspect-[16/10] md:aspect-auto md:min-h-[300px] overflow-hidden bg-bg2">
              <Image
                src={project.thumbnail.src}
                alt=""
                fill
                sizes="(min-width: 768px) 520px, 100vw"
                className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
              />
            </span>
            <span className="p-6 md:p-10 flex flex-col justify-center">
              <ul aria-label={t.tags} className="flex flex-wrap gap-1.5 mb-4">
                {project[locale].type.split(' · ').map((tag) => (
                  <li
                    key={tag}
                    className="text-[10px] font-medium tracking-wider uppercase text-primary-text bg-primary-light rounded-full px-2.5 py-1"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <h3 id="projekt-titel" className="text-[22px] md:text-[26px] font-bold tracking-tight mb-2">
                {project[locale].title}
              </h3>
              <span id="projekt-text" className="text-[14px] text-text2 leading-relaxed mb-5">
                {project[locale].tagline}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary-text">
                {t.readCase}
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
                />
              </span>
            </span>
          </Link>
        </section>
      )}

      <section aria-labelledby="ablauf" className={sectionClass}>
        <h2
          id="ablauf"
          data-reveal
          className="text-[26px] md:text-[34px] font-bold leading-tight tracking-tight mb-10 md:mb-14 max-w-[720px] text-balance"
        >
          {d.processTitle}
        </h2>
        <ol className="relative grid gap-4 md:gap-5">
          {d.steps.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              style={stagger(i)}
              className="grid md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] gap-4 md:gap-8 rounded-2xl border border-border bg-card p-6 md:p-8"
            >
              <div>
                <span aria-hidden="true" className="block text-[40px] font-bold leading-none text-primary-text mb-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="inline-block text-[11px] font-medium uppercase tracking-wider text-primary-text bg-primary-light rounded-full px-2.5 py-1">
                  {step.duration}
                </span>
              </div>
              <div>
                <h3 className="text-[18px] font-bold mb-2">
                  <span className="sr-only">
                    {t.step} {i + 1}:{' '}
                  </span>
                  {step.title}
                </h3>
                <p className="text-[14px] text-text2 leading-relaxed">{step.text}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-text3 mb-2">{t.outputs}</p>
                <ul className="space-y-1.5">
                  {step.outputs.map((o) => (
                    <li key={o} className="flex gap-2 text-[13px] text-foreground">
                      <Check size={14} aria-hidden="true" className="text-primary-text shrink-0 mt-0.5" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="umfang" className={sectionClass}>
        <h2
          id="umfang"
          data-reveal
          className="text-[26px] md:text-[34px] font-bold leading-tight tracking-tight mb-10 max-w-[720px] text-balance"
        >
          {d.includedTitle}
        </h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {d.included.map((card, i) => (
            <li
              key={card.title}
              data-reveal
              style={stagger(i % 3)}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <span aria-hidden="true" className="block text-[13px] font-bold text-primary-text mb-4">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-[16px] font-bold mb-2">{card.title}</h3>
              <p className="text-[14px] text-text2 leading-relaxed">{card.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="pakete" className={sectionClass}>
        <div data-reveal className="mb-10 max-w-[620px]">
          <h2 id="pakete" className={`${eyebrow} mb-3`}>
            {t.packages}
          </h2>
          <p className="text-[18px] md:text-[20px] text-foreground leading-snug">{t.packagesIntro}</p>
        </div>
        <ul className="grid md:grid-cols-2 gap-4 md:gap-6">
          {d.packages.map((p, i) => {
            const accent = i === 1;
            return (
              <li
                key={p.name}
                data-reveal
                style={stagger(i)}
                className={`flex flex-col rounded-2xl border p-6 md:p-8 ${
                  accent ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'
                }`}
              >
                <h3 className="text-[22px] font-bold mb-2">{p.name}</h3>
                <p className={`text-[14px] leading-relaxed mb-6 ${accent ? '' : 'text-text2'}`}>{p.for}</p>
                <ul className="space-y-2.5 mb-8">
                  {p.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[14px]">
                      <Check
                        size={16}
                        aria-hidden="true"
                        className={`shrink-0 mt-0.5 ${accent ? '' : 'text-primary-text'}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={contactHref}
                  className={`mt-auto inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-[14px] font-medium transition-colors ${
                    accent
                      ? 'bg-background text-foreground'
                      : 'border border-border text-foreground hover:border-primary'
                  }`}
                >
                  {t.enquire(p.name)}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Warum mit mir: Wertekarten im Sticky-Stapel (AK-27) */}
      <section aria-labelledby="warum" className={sectionClass}>
        <h2
          id="warum"
          data-reveal
          className="text-[26px] md:text-[34px] font-bold leading-tight tracking-tight mb-10 max-w-[720px] text-balance"
        >
          {t.why}
        </h2>
        <ol className="sticky-stack grid gap-4" style={{ '--stack-n': t.whyCards.length + 1 } as CSSProperties}>
          {[d.whyFocus, ...t.whyCards].map((card, i) => (
            <li
              key={card.title}
              data-reveal
              style={{ '--stack-i': i } as CSSProperties}
              className={`rounded-2xl border p-6 md:p-8 shadow-[0_-8px_30px_-20px_hsl(var(--foreground)/0.25)] grid md:grid-cols-[4.5rem_minmax(0,1fr)] gap-x-8 gap-y-3 items-baseline ${
                i % 2 ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'
              }`}
            >
              <span
                aria-hidden="true"
                className={`text-[40px] md:text-[48px] font-bold leading-none tracking-tight ${
                  i % 2 ? 'text-primary-foreground' : 'text-primary-text'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-[18px] md:text-[20px] font-bold mb-2">{card.title}</h3>
                <p
                  className={`text-[14px] md:text-[15px] leading-relaxed ${i % 2 ? 'text-primary-foreground' : 'text-text2'}`}
                >
                  {card.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="werkzeuge" className="py-12 border-b border-border">
        <h2 id="werkzeuge" className={`${eyebrow} mb-5`} data-reveal>
          {t.tools}
        </h2>
        <ul aria-labelledby="werkzeuge" className="flex flex-wrap gap-2" data-reveal>
          {detail.tools.map((tool) => (
            <li key={tool} className="rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium">
              {tool}
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="fragen"
        className={`${sectionClass} grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8 md:gap-12`}
      >
        <div data-reveal className="md:sticky md:top-24 md:self-start">
          <h2 id="fragen" className="text-[26px] md:text-[34px] font-bold leading-tight tracking-tight mb-4">
            {t.faq}
          </h2>
          <Link
            href={localizedPath('/faqs', locale)}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary-text"
          >
            {t.allFaqs}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <FaqList items={d.faqs} />
      </section>

      <section aria-labelledby="passend" className="py-12 border-b border-border">
        <h2 id="passend" className="text-sm font-bold text-foreground mb-5" data-reveal>
          {t.related}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {related.map((r, i) => (
            <li key={r.slug} data-reveal style={stagger(i)}>
              <Link
                href={localizedPath(`/services/${r.slug}`, locale)}
                className="group flex items-center gap-3 h-full rounded-xl border border-border bg-card p-4 text-[13px] font-medium text-foreground hover:border-primary/30 motion-safe:transition"
              >
                <r.icon size={18} aria-hidden="true" className="text-primary-text shrink-0" />
                {r[locale].title}
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  className="ml-auto text-text3 motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="interesse" className="py-16 md:py-20">
        <div
          data-reveal
          className="rounded-3xl bg-primary text-primary-foreground px-6 py-12 md:px-14 md:py-16 text-center"
        >
          <h2 id="interesse" className="text-[26px] md:text-[36px] font-bold tracking-tight mb-3 text-balance">
            {t.interested(content.title)}
          </h2>
          <p className="text-[15px] mb-8 max-w-[460px] mx-auto">{t.talk}</p>
          <Link
            href={contactHref}
            className="inline-flex bg-background text-foreground px-6 py-3 rounded-lg text-[14px] font-medium"
          >
            {t.cta}
          </Link>
        </div>
      </section>
    </div>
  );
}
