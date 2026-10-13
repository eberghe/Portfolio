import { Languages } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { bereichPfad } from '@/lib/kundenbereich/bereiche';
import type { Profil } from '@/lib/kundenbereich/supabase';
import { kundenText } from '@/lib/kundenbereich/text';
import { karte, kartenTitel } from './admin/AdminListen';
import AdminShell from './admin/AdminShell';
import Darstellung from './Darstellung';

// Einstellungen des Kundenbereichs: Konto, Sprache, Darstellung; Abmelden steht in der Sidebar
// (functions/kundenbereich/kunden-sidebar.md Verhalten 2, AK-6)

export default function KundenEinstellungen({ locale, profil }: { locale: Locale; profil: Profil }) {
  const t = kundenText[locale];
  const andere: Locale = locale === 'de' ? 'en' : 'de';
  const kopf = `${kartenTitel} mb-3`;
  return (
    <AdminShell title={t.nav.einstellungen}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 items-start max-w-[1100px]">
        <section aria-labelledby="konto-titel" className={karte}>
          <h2 id="konto-titel" className={kopf}>
            {t.account}
          </h2>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-[14px]">
            <dt className="text-text2">{t.name}</dt>
            <dd className="break-words">{profil.name}</dd>
            <dt className="text-text2">{t.role}</dt>
            <dd>{t.roles[profil.art]}</dd>
          </dl>
        </section>
        <section aria-labelledby="sprache-titel" className={karte}>
          <h2 id="sprache-titel" className={kopf}>
            {t.language}
          </h2>
          <Link
            href={bereichPfad('einstellungen', andere)}
            lang={t.languageSwitchLang}
            hrefLang={t.languageSwitchLang}
            className="inline-flex items-center gap-2 min-h-11 text-[15px] font-medium underline underline-offset-4 hover:text-primary-text"
          >
            <Languages size={16} aria-hidden="true" />
            {t.languageSwitch}
          </Link>
        </section>
        <section aria-labelledby="darstellung-titel" className={karte}>
          <h2 id="darstellung-titel" className={kopf}>
            {t.appearance}
          </h2>
          <Darstellung titelId="darstellung-titel" labels={t.modes} />
        </section>
      </div>
    </AdminShell>
  );
}
