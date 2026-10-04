'use client';

import { useState, type ReactNode } from 'react';

// Filter der Projektübersicht, siehe functions/seiten/projekte.md AK-19.
// Ohne JavaScript ist der Filter ausgeblendet ([.js_&]) und alle Projekte bleiben sichtbar.
export default function ProjectFilter({
  label,
  filters,
  count,
  items,
}: {
  label: string;
  filters: { key: string; label: string }[];
  count: { one: string; other: string };
  items: { key: string; category: string; node: ReactNode }[];
}) {
  const [active, setActive] = useState(filters[0]!.key);
  const visible = (category: string) => active === filters[0]!.key || active === category;
  const shown = items.filter((i) => visible(i.category)).length;

  return (
    <>
      <div role="group" aria-label={label} className="hidden [.js_&]:flex flex-wrap items-center gap-2 mb-10 md:mb-14">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={active === f.key}
            onClick={() => setActive(f.key)}
            className="min-h-11 px-4 sm:px-5 rounded-full border text-[14px] font-medium motion-safe:transition-colors border-border text-foreground hover:border-primary aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:border-foreground"
          >
            {f.label}
          </button>
        ))}
        <p role="status" className="w-full sm:w-auto sm:ml-auto mt-1 sm:mt-0 text-[14px] text-text2">
          {shown === 1 ? count.one : count.other.replace('{n}', String(shown))}
        </p>
      </div>
      <ul className="flex flex-col gap-16 md:gap-24">
        {items.map((i) => (
          <li key={i.key} data-reveal hidden={!visible(i.category)}>
            {i.node}
          </li>
        ))}
      </ul>
    </>
  );
}
