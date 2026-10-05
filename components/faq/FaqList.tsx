import { Plus } from 'lucide-react';

// Akkordeon für Fragen und Antworten (natives details/summary, Frage als Überschrift).
// Gemeinsam für FAQ-, Leistungs- und Stadtseiten, siehe functions/seiten/faq.md und leistungen.md AK-22
export default function FaqList({
  items,
  level = 3,
  idPrefix,
}: {
  items: { q: string; a: string; id?: string }[];
  level?: 2 | 3;
  idPrefix?: string;
}) {
  const Heading = `h${level}` as 'h2' | 'h3';
  return (
    <div className="faq-list border-t border-border">
      {items.map((f, i) => (
        <details
          key={f.q}
          id={f.id ?? (idPrefix ? `${idPrefix}-${i + 1}` : undefined)}
          data-reveal
          className="group border-b border-border"
        >
          <summary className="flex items-center justify-between gap-6 py-5 md:py-6 px-1 -mx-1 rounded-md focus-visible:outline-offset-2 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:text-primary-text motion-safe:transition-colors">
            <Heading className="text-[15px] md:text-[17px] font-bold leading-snug">{f.q}</Heading>
            <span
              aria-hidden="true"
              className="w-8 h-8 border border-border rounded-full flex items-center justify-center shrink-0 motion-safe:transition-colors group-open:bg-primary group-open:border-primary"
            >
              <Plus
                size={14}
                className="text-text2 motion-safe:transition-transform motion-safe:duration-300 group-open:rotate-45 group-open:text-primary-foreground"
              />
            </span>
          </summary>
          <p className="text-[14px] md:text-[15px] text-text2 leading-relaxed pb-6 sm:pr-14 max-w-[680px]">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
