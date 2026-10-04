'use client';

import { Pause, Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { tools } from '@/lib/content/about';

// Laufband der Werkzeuge: rein dekorativ, mit Pause-Knopf (WCAG 2.2.2). Siehe functions/seiten/ueber-mich.md AK-3, AK-4
export default function ToolsMarquee({ pauseLabel }: { pauseLabel: string }) {
  const [paused, setPaused] = useState(false);
  const repeated = [...tools, ...tools, ...tools];
  return (
    <div className="relative">
      <div data-marquee aria-hidden="true" className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
        <div
          className="flex w-max motion-safe:animate-scroll-logos"
          style={{ animationPlayState: paused ? 'paused' : 'running' }}
        >
          {repeated.map((tool, i) => (
            <span
              key={`${tool.name}-${i}`}
              className="flex items-center justify-center min-w-[120px] sm:min-w-[160px] px-8 sm:px-12 grayscale opacity-50"
            >
              <Image src={tool.src} width={tool.width} height={tool.height} alt="" className="h-9 sm:h-10 w-auto" />
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={pauseLabel}
        className="motion-reduce:hidden absolute right-4 -top-12 w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text2 hover:bg-bg2 hover:text-foreground transition-colors"
      >
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      </button>
    </div>
  );
}
