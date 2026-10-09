import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { localizedPath, type Locale } from '@/lib/i18n';

// Schmale Leiste statt Navigation im Kundenbereich (functions/kundenbereich/rahmen.md AK-2)

const TEXT = {
  de: { back: 'Zur Website', logo: 'Erik Bergheimer, zur Website' },
  en: { back: 'Back to website', logo: 'Erik Bergheimer, back to website' },
} as const;

export default function KundenLeiste({ locale }: { locale: Locale }) {
  const t = TEXT[locale];
  const home = localizedPath('/', locale);
  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12 h-16 flex items-center justify-between gap-4">
        <Link href={home} aria-label={t.logo} className="inline-flex items-center min-h-11 text-foreground">
          <Logo className="h-3 sm:h-3.5 w-auto" />
        </Link>
        <Link
          href={home}
          className="inline-flex items-center gap-2 min-h-11 text-[14px] font-medium text-text2 hover:text-foreground underline-offset-4 hover:underline"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          {t.back}
        </Link>
      </div>
    </header>
  );
}
