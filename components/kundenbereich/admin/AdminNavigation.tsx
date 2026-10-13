'use client';

import {
  ArrowLeft,
  Building2,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Logo from '@/components/Logo';

// Sidebar der Verwaltung; unter 1024 px oben Logo, unten die Bereiche
// (functions/kundenbereich/admin-sidebar.md Verhalten 1 bis 4, AK-1 bis AK-5)

const START = '/kunden/admin';
const BEREICHE: { href: string; label: string; icon: LucideIcon }[] = [
  { href: START, label: 'Übersicht', icon: LayoutDashboard },
  { href: `${START}/projekte`, label: 'Projekte', icon: FolderKanban },
  { href: `${START}/kunden`, label: 'Kunden', icon: Building2 },
  { href: `${START}/anfragen`, label: 'Anfragen', icon: Inbox },
  { href: `${START}/einstellungen`, label: 'Einstellungen', icon: Settings },
];

/** aria-current: „page“ auf der Seite selbst, „true“ auf Unterseiten; Home nur auf der Übersicht */
function aktuell(pfad: string, href: string): 'page' | 'true' | undefined {
  if (pfad === href) return 'page';
  if (href !== START && pfad.startsWith(`${href}/`)) return 'true';
  return undefined;
}

export default function AdminNavigation({
  neueAnfragen,
  eingeklappt: anfangs,
}: {
  neueAnfragen: number;
  eingeklappt: boolean;
}) {
  const pfad = usePathname() ?? START;
  const [zu, setZu] = useState(anfangs);
  const umschalten = () => {
    const neu = !zu;
    setZu(neu);
    // Verhalten 2: Wahl für den nächsten Besuch merken
    document.cookie = `kb_sidebar=${neu ? 'zu' : 'auf'}; path=/; max-age=31536000; samesite=lax`;
  };
  const label = zu ? 'lg:sr-only' : '';
  const zahlKlasse =
    'min-w-5 rounded-full bg-primary px-1.5 text-center text-[11px] font-semibold leading-5 text-primary-foreground';

  return (
    <header
      data-sidebar={zu ? 'zu' : 'auf'}
      className={`sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 sm:px-6 lg:h-svh lg:flex-col lg:items-stretch lg:justify-start lg:gap-0 lg:border-b-0 lg:border-r lg:px-3 lg:py-5 ${
        zu ? 'lg:w-[72px]' : 'lg:w-60'
      }`}
    >
      <Link
        href={START}
        aria-label="Erik Bergheimer, Verwaltung"
        className={`inline-flex min-h-11 items-center text-foreground lg:px-3 ${zu ? 'lg:justify-center lg:px-0' : ''}`}
      >
        {zu ? (
          <span aria-hidden="true" className="hidden lg:inline text-[15px] font-bold tracking-tight">
            EB
          </span>
        ) : null}
        <Logo className={`h-3 w-auto ${zu ? 'lg:hidden' : ''}`} />
      </Link>

      {/* AK-15: im Code vor der Navigation, damit „Zur Website“ unter 1024 px vor der unteren Leiste kommt */}
      <div className="flex items-center gap-1 lg:order-last lg:flex-col lg:items-stretch lg:border-t lg:border-border lg:pt-3">
        <Link
          href="/"
          title={zu ? 'Zur Website' : undefined}
          className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-[14px] font-medium text-text2 hover:text-foreground lg:gap-3 lg:px-3 lg:hover:bg-bg2 ${
            zu ? 'lg:justify-center lg:px-0' : ''
          }`}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span className={label}>Zur Website</span>
        </Link>
        {/* AK-14: fester sichtbarer Name, Zustand über aria-expanded, Aktion im Tooltip */}
        <button
          type="button"
          onClick={umschalten}
          aria-expanded={!zu}
          title={zu ? 'Seitenleiste ausklappen' : 'Seitenleiste einklappen'}
          className={`hidden min-h-11 items-center gap-3 rounded-lg px-3 text-[14px] font-medium text-text2 hover:bg-bg2 hover:text-foreground lg:inline-flex ${
            zu ? 'lg:justify-center lg:px-0' : ''
          }`}
        >
          {zu ? <PanelLeftOpen size={16} aria-hidden="true" /> : <PanelLeftClose size={16} aria-hidden="true" />}
          <span className={label}>Seitenleiste</span>
        </button>
      </div>

      {/* Verhalten 4: dieselbe Navigation, unter 1024 px als feste Leiste unten */}
      <nav
        aria-label="Verwaltung"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:static lg:mt-8 lg:flex-1 lg:border-0 lg:bg-transparent lg:pb-0"
      >
        <ul role="list" className="grid grid-cols-5 lg:flex lg:flex-col lg:gap-1">
          {BEREICHE.map(({ href, label: text, icon: Icon }) => {
            const stand = aktuell(pfad, href);
            const zahl = href.endsWith('/anfragen') ? neueAnfragen : 0;
            return (
              <li key={href} className="min-w-0">
                <Link
                  href={href}
                  aria-current={stand}
                  aria-label={zahl > 0 ? `${text}, ${zahl} neu` : undefined}
                  title={zu ? text : undefined}
                  className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-[11px] font-medium transition-colors lg:min-h-10 lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-[14px] ${
                    zu ? 'lg:justify-center lg:px-0' : ''
                  } ${stand ? 'text-foreground lg:bg-bg2' : 'text-text2 hover:text-foreground lg:hover:bg-bg2'}`}
                >
                  <span className="relative">
                    <Icon size={18} aria-hidden="true" className={stand ? 'text-primary-text' : undefined} />
                    {/* AK-14/AK-15: Zahl am Icon, unten und in der eingeklappten Sidebar */}
                    {zahl > 0 && (
                      <span
                        aria-hidden="true"
                        className={`${zahlKlasse} absolute -right-3 -top-2 ${zu ? '' : 'lg:hidden'}`}
                      >
                        {zahl}
                      </span>
                    )}
                  </span>
                  <span className={`truncate ${label}`}>{text}</span>
                  {zahl > 0 && !zu && (
                    <span aria-hidden="true" className={`${zahlKlasse} ml-auto hidden lg:inline-block`}>
                      {zahl}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
