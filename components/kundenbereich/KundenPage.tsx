import { cookies } from 'next/headers';
import type { Locale } from '@/lib/i18n';
import { ACCESS } from '@/lib/kundenbereich/session';
import { authApi } from '@/lib/kundenbereich/supabase';
import { kundenText } from '@/lib/kundenbereich/text';
import FocusTitle from './FocusTitle';
import LoginForm from './LoginForm';
import Projektuebersicht from './Projektuebersicht';

// Einstieg in den Kundenbereich: Anmeldung oder Projektübersicht (functions/kundenbereich/login.md AK-1, AK-8)

const card =
  'min-w-0 sm:border sm:border-border sm:rounded-2xl bg-background sm:p-6 sm:shadow-[0_8px_30px_-16px_hsl(var(--primary)/0.25)]';

export function KundenShell({
  title,
  intro,
  focusTitle = false,
  children,
}: {
  title: string;
  intro?: string;
  /** Titel benennt die Karte und bekommt den Fokus (Bestätigungsseiten) */
  focusTitle?: boolean;
  children: React.ReactNode;
}) {
  const titleClass = 'text-[32px] md:text-[48px] leading-[1.1] font-bold tracking-tight mb-3 md:mb-4 text-balance';
  return (
    <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12 py-8 md:py-16 grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-10 lg:gap-x-16 gap-y-6 md:items-start">
      <div>
        {focusTitle ? (
          <span id="kunden-karte" className="contents">
            <FocusTitle key={title} className={titleClass}>
              {title}
            </FocusTitle>
          </span>
        ) : (
          <h1 className={titleClass}>{title}</h1>
        )}
        {intro && <p className="text-[15px] md:text-[16px] text-text2 leading-relaxed md:max-w-[420px]">{intro}</p>}
      </div>
      <section aria-labelledby="kunden-karte" className={card}>
        {children}
      </section>
    </div>
  );
}

export const cardHeading = 'text-[11px] font-bold tracking-wider uppercase text-text3 mb-3';

export default async function KundenPage({ locale, auswahl }: { locale: Locale; auswahl?: string }) {
  const t = kundenText[locale];
  const access = (await cookies()).get(ACCESS)?.value;
  const api = authApi(process.env);
  const profil = access && api ? await api.profil(access).catch(() => null) : null;

  if (!profil || !access || !api)
    return (
      <KundenShell title={t.title} intro={t.intro}>
        <h2 id="kunden-karte" className={cardHeading}>
          {t.loginTitle}
        </h2>
        <LoginForm locale={locale} />
      </KundenShell>
    );

  // Projektübersicht nach dem Login (functions/kundenbereich/projektuebersicht.md)
  const [projekte, logo] = await Promise.all([
    api.projekte(access),
    profil.art === 'kunde' ? api.meinKunde(access) : null,
  ]);
  return <Projektuebersicht locale={locale} profil={profil} projekte={projekte} auswahl={auswahl} logo={logo} />;
}
