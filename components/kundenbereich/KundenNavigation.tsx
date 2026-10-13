'use client';

import { CalendarDays, FileText, LayoutDashboard, ListChecks, LogOut, Settings } from 'lucide-react';
import { logout } from '@/app/actions/kundenbereich';
import { localizedPath, type Locale } from '@/lib/i18n';
import { bereichPfad } from '@/lib/kundenbereich/bereiche';
import { kundenText } from '@/lib/kundenbereich/text';
import Seitenleiste from './Seitenleiste';

// Sidebar des Kundenbereichs, dieselbe Komponente wie in der Verwaltung (functions/kundenbereich/kunden-sidebar.md
// Verhalten 1 bis 3, AK-1 bis AK-3, AK-7)

export default function KundenNavigation({
  locale,
  projekt,
  eingeklappt,
}: {
  locale: Locale;
  /** gewählte Projekt-ID, wandert in alle Links mit */
  projekt?: string;
  eingeklappt: boolean;
}) {
  const t = kundenText[locale];
  const pfad = (b: Parameters<typeof bereichPfad>[0]) => bereichPfad(b, locale, projekt);
  return (
    <Seitenleiste
      start={localizedPath('/kunden', locale)}
      bereiche={[
        { href: pfad('uebersicht'), label: t.nav.uebersicht, icon: LayoutDashboard },
        { href: pfad('ablauf'), label: t.nav.ablauf, icon: ListChecks },
        { href: pfad('termine'), label: t.nav.termine, icon: CalendarDays },
        { href: pfad('dokumente'), label: t.nav.dokumente, icon: FileText },
        { href: pfad('einstellungen'), label: t.nav.einstellungen, icon: Settings },
      ]}
      navLabel={t.nav.label}
      logoLabel={t.nav.logo}
      website={{ href: localizedPath('/', locale), label: t.backToWebsite }}
      texte={{ seitenleiste: t.sidebar, ausklappen: t.sidebarOpen, einklappen: t.sidebarClose, neu: String }}
      eingeklappt={eingeklappt}
      unten={(zu) => (
        <form action={logout} className="contents">
          <input type="hidden" name="sprache" value={locale} />
          <button
            type="submit"
            title={zu ? t.logout : undefined}
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-[14px] font-medium text-text2 hover:text-foreground lg:gap-3 lg:px-3 lg:hover:bg-bg2 ${
              zu ? 'lg:justify-center lg:px-0' : ''
            }`}
          >
            <LogOut size={16} aria-hidden="true" />
            {/* kunden-sidebar.md Mobile: unter 640 px nur das Icon, der Name bleibt */}
            <span className={`max-sm:sr-only ${zu ? 'lg:sr-only' : ''}`}>{t.logout}</span>
          </button>
        </form>
      )}
    />
  );
}
