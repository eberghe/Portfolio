import { LogIn } from 'lucide-react';
import { confirmLogin } from '@/app/actions/kundenbereich';
import Button from '@/components/ui/Button';
import { localizedPath, type Locale } from '@/lib/i18n';
import { kundenText } from '@/lib/kundenbereich/text';
import { KundenShell } from './KundenPage';

// Bestätigungsseite für den Link aus der Mail; der Code wird erst per POST eingelöst (login.md AK-7)

export default function ConfirmPage({ locale, code, invalid }: { locale: Locale; code: string; invalid: boolean }) {
  const t = kundenText[locale];
  if (invalid || !code)
    return (
      <KundenShell title={t.invalidTitle} focusTitle>
        <p className="text-[14px] text-text2 leading-relaxed mb-6">{t.invalidText}</p>
        <Button href={localizedPath('/kunden', locale)}>{t.backToLogin}</Button>
      </KundenShell>
    );

  return (
    <KundenShell title={t.confirmTitle} focusTitle>
      <p className="text-[14px] text-text2 leading-relaxed mb-6">{t.confirmText}</p>
      <form action={confirmLogin}>
        <input type="hidden" name="sprache" value={locale} />
        <input type="hidden" name="code" value={code} />
        <Button type="submit" className="w-full sm:w-auto">
          <LogIn size={15} aria-hidden="true" />
          {t.confirmButton}
        </Button>
      </form>
    </KundenShell>
  );
}
