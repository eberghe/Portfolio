import { LogOut } from 'lucide-react';
import { cookies } from 'next/headers';
import { logout } from '@/app/actions/kundenbereich';
import Button from '@/components/ui/Button';
import type { Locale } from '@/lib/i18n';
import { ACCESS } from '@/lib/kundenbereich/session';
import { authApi, type Profil } from '@/lib/kundenbereich/supabase';
import { kundenText } from '@/lib/kundenbereich/text';
import LoginForm from './LoginForm';

// Einstieg in den Kundenbereich: Anmeldung oder Begrüßung (functions/kundenbereich/login.md AK-1, AK-8)

const card =
  'min-w-0 sm:border sm:border-border sm:rounded-2xl bg-background sm:p-6 sm:shadow-[0_8px_30px_-16px_hsl(var(--primary)/0.25)]';

export async function currentProfil(): Promise<Profil | null> {
  const access = (await cookies()).get(ACCESS)?.value;
  if (!access) return null;
  return (
    (await authApi(process.env)
      ?.profil(access)
      .catch(() => null)) ?? null
  );
}

export function KundenShell({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <div className="max-w-page mx-auto px-6 sm:px-8 md:px-12 py-8 md:py-16 grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-10 lg:gap-x-16 gap-y-6 md:items-start">
      <div>
        <h1 className="text-[32px] md:text-[48px] leading-[1.1] font-bold tracking-tight mb-3 md:mb-4 text-balance">
          {title}
        </h1>
        {intro && <p className="text-[15px] md:text-[16px] text-text2 leading-relaxed md:max-w-[420px]">{intro}</p>}
      </div>
      <section aria-labelledby="kunden-karte" className={card}>
        {children}
      </section>
    </div>
  );
}

export const cardHeading = 'text-[11px] font-bold tracking-wider uppercase text-text3 mb-3';

export default async function KundenPage({ locale }: { locale: Locale }) {
  const t = kundenText[locale];
  const profil = await currentProfil();

  if (!profil)
    return (
      <KundenShell title={t.title} intro={t.intro}>
        <h2 id="kunden-karte" className={cardHeading}>
          {t.loginTitle}
        </h2>
        <LoginForm locale={locale} />
      </KundenShell>
    );

  return <Welcome locale={locale} profil={profil} />;
}

/** Begrüßung nach dem Login (AK-8) */
export function Welcome({ locale, profil }: { locale: Locale; profil: Profil }) {
  const t = kundenText[locale];
  return (
    <KundenShell title={t.title}>
      <h2 id="kunden-karte" className="text-[22px] font-bold tracking-tight mb-2">
        {t.hello(profil.name)}
        {profil.art === 'admin' && ' '}
        {profil.art === 'admin' && (
          <span className="ml-1 align-middle inline-block text-[11px] font-medium uppercase tracking-wide border border-primary-border text-primary-text rounded-full px-2 py-0.5">
            {t.admin}
          </span>
        )}
      </h2>
      <p className="text-[14px] text-text2 leading-relaxed mb-6">{t.welcomeText}</p>
      <form action={logout}>
        <input type="hidden" name="sprache" value={locale} />
        <Button type="submit" variant="secondary">
          <LogOut size={15} aria-hidden="true" />
          {t.logout}
        </Button>
      </form>
    </KundenShell>
  );
}
