import { Fragment } from 'react';
import { legal, type LegalKind } from '@/lib/content/legal';
import type { Locale } from '@/lib/i18n';
import { EMAIL } from '@/lib/site';

// Impressum und Datenschutz, übernommen aus Lovable. Siehe functions/seiten/rechtliches.md
function Paragraph({ text }: { text: string }) {
  const parts = text.split('{email}');
  return (
    <p className="text-sm text-text2 leading-relaxed whitespace-pre-line mb-3 last:mb-0">
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <a href={`mailto:${EMAIL}`} className="text-primary-text underline underline-offset-2">
              {EMAIL}
            </a>
          )}
        </Fragment>
      ))}
    </p>
  );
}

export default function LegalPage({ kind, locale }: { kind: LegalKind; locale: Locale }) {
  const t = legal[kind][locale];
  return (
    <div className="max-w-[700px] mx-auto px-6 sm:px-7 md:px-12 py-20">
      <h1 className="text-[30px] font-medium tracking-tight mb-6">{t.title}</h1>
      {t.sections.map((s) => (
        <section key={s.title} className="mb-8 last:mb-0">
          <h2 className="text-base font-medium text-foreground mb-2">{s.title}</h2>
          {s.paragraphs.map((p) => (
            <Paragraph key={p} text={p} />
          ))}
        </section>
      ))}
    </div>
  );
}
