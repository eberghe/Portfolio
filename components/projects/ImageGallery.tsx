'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/i18n';

// Bildraster mit Lightbox (natives <dialog>), siehe functions/seiten/projekte.md AK-3, AK-5
export interface GalleryImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

const text = {
  de: {
    position: (i: number, n: number) => `Bild ${i} von ${n}`,
    enlarge: (i: number, n: number, alt: string) => `Bild ${i} von ${n} vergrößern: ${alt}`,
    close: 'Schließen',
    prev: 'Vorheriges Bild',
    next: 'Nächstes Bild',
  },
  en: {
    position: (i: number, n: number) => `Image ${i} of ${n}`,
    enlarge: (i: number, n: number, alt: string) => `Enlarge image ${i} of ${n}: ${alt}`,
    close: 'Close',
    prev: 'Previous image',
    next: 'Next image',
  },
};

const controlClass =
  'w-11 h-11 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors';

export default function ImageGallery({
  images,
  locale,
  variant,
}: {
  images: GalleryImage[];
  locale: Locale;
  variant: 'grid' | 'inline' | 'wide';
}) {
  const t = text[locale];
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const opener = useRef<number>(0);
  const n = images.length;

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else if (index === null && dialog.open) {
      dialog.close();
    }
  }, [index]);

  const onClosed = () => {
    document.body.style.overflow = '';
    setIndex(null);
    triggers.current[opener.current]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Tab') {
      // Fokus bleibt im Dialog, auch wenn der Browser sonst in seine Bedienleiste springen würde
      const focusable = [...e.currentTarget.querySelectorAll<HTMLElement>('button')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  };

  const current = index === null ? null : images[index];

  return (
    <>
      <ul
        className={
          variant === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 gap-3'
            : variant === 'wide'
              ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 items-start'
              : 'grid grid-cols-2 gap-3 mt-5'
        }
      >
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              aria-label={t.enlarge(i + 1, n, img.alt)}
              ref={(el) => {
                triggers.current[i] = el;
              }}
              onClick={() => {
                opener.current = i;
                setIndex(i);
              }}
              className={`block w-full rounded-xl overflow-hidden group ${variant === 'grid' ? 'aspect-[4/3]' : ''}`}
            >
              <Image
                src={img.src}
                quality={90}
                width={img.width}
                height={img.height}
                alt={img.alt}
                sizes={
                  variant === 'wide'
                    ? '(min-width: 1100px) 360px, (min-width: 640px) 50vw, 100vw'
                    : '(min-width: 640px) 33vw, 50vw'
                }
                className={`w-full motion-safe:group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-300 ${
                  variant === 'grid' ? 'h-full object-cover' : 'h-auto'
                }`}
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={index === null ? undefined : t.position(index + 1, n)}
        onClose={onClosed}
        onKeyDown={onKeyDown}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-black/90 p-0 backdrop:bg-black/60"
      >
        {current && index !== null && (
          <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-16">
            <Image
              src={current.src}
              quality={90}
              width={current.width}
              height={current.height}
              alt={current.alt}
              sizes="90vw"
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={close}
              aria-label={t.close}
              className={`absolute top-4 right-4 ${controlClass}`}
            >
              <X size={24} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t.prev}
              className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 ${controlClass}`}
            >
              <ChevronLeft size={28} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t.next}
              className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 ${controlClass}`}
            >
              <ChevronRight size={28} aria-hidden="true" />
            </button>
            <p aria-live="polite" className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-sm">
              {index + 1} / {n}
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
