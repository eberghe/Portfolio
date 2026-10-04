import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFoundText } from '@/lib/content/not-found';
import { localizedPath, type Locale } from '@/lib/i18n';

// 404-Seite, siehe functions/seiten/nicht-gefunden.md
export default function NotFound({ locale }: { locale: Locale }) {
  const t = notFoundText[locale];
  const other: Locale = locale === 'de' ? 'en' : 'de';
  const o = notFoundText[other];
  return (
    <div className="max-w-[900px] mx-auto px-6 sm:px-7 py-16">
      <p className="text-[11px] font-medium tracking-widest uppercase text-text3 mb-3">404</p>
      <h1 className="text-[30px] font-bold tracking-tight mb-3">{t.title}</h1>
      <p className="text-sm text-text2 leading-relaxed mb-6 max-w-[520px]">{t.text}</p>
      <ul className="grid gap-2 max-w-[360px]">
        {t.links.map(([path, label]) => (
          <li key={path}>
            <Link
              href={localizedPath(path, locale)}
              className="flex items-center justify-between min-h-11 px-4 py-2.5 rounded-lg border border-border text-[13px] font-medium text-foreground hover:border-primary hover:text-primary-text transition-colors"
            >
              {label}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      <section lang={other} aria-labelledby="not-found-other" className="mt-12 pt-8 border-t border-border">
        <h2 id="not-found-other" className="text-[17px] font-bold mb-2">
          {o.title}
        </h2>
        <p className="text-sm text-text2 leading-relaxed mb-4">{o.short}</p>
        <Link
          href={localizedPath('/', other)}
          className="inline-flex items-center gap-2 min-h-11 text-[13px] font-medium text-primary-text underline underline-offset-2"
        >
          {o.homeLink}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
