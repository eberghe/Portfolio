'use client';

import { List, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Inhaltsverzeichnis einer Case Study, siehe functions/seiten/projekte.md AK-7
interface Item {
  id: string;
  title: string;
}

function Links({ items, active, onPick }: { items: Item[]; active: string; onPick?: () => void }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={onPick}
            aria-current={active === item.id ? 'location' : undefined}
            className={`block text-[13px] py-1.5 font-medium transition-colors duration-150 ${
              active === item.id ? 'text-primary-text' : 'text-text2 hover:text-foreground'
            }`}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function TableOfContents({ items, label }: { items: Item[]; label: string }) {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const heading = (
    <p aria-hidden="true" className="text-[10px] font-medium tracking-widest uppercase text-text3 mb-3">
      {label}
    </p>
  );

  return (
    <>
      <aside className="hidden lg:block w-[220px] shrink-0">
        <nav aria-label={label} className="sticky top-24">
          {heading}
          <Links items={items} active={active} />
        </nav>
      </aside>

      <div className="lg:hidden">
        <button
          ref={button}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="inhaltsverzeichnis-mobil"
          aria-label={label}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          {open ? <X size={20} aria-hidden="true" /> : <List size={20} aria-hidden="true" />}
        </button>
        <nav
          id="inhaltsverzeichnis-mobil"
          aria-label={label}
          hidden={!open}
          className="fixed bottom-20 right-6 z-50 bg-card border border-border rounded-2xl shadow-xl p-5 w-[260px] max-w-[calc(100vw-3rem)] max-h-[60vh] overflow-y-auto"
        >
          {heading}
          <Links items={items} active={active} onPick={() => setOpen(false)} />
        </nav>
      </div>
    </>
  );
}
