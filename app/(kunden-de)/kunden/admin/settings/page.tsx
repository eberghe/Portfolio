import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import AdminSettings from '@/components/kundenbereich/admin/AdminSettings';
import { adminKontext } from '@/components/kundenbereich/admin/kontext';
import { ACCESS } from '@/lib/kundenbereich/session';

// functions/kundenbereich/admin-sidebar.md Verhalten 10
export const metadata: Metadata = { title: 'Settings | Verwaltung', robots: { index: false, follow: false } };

/** E-Mail aus dem bereits geprüften Zugangstoken, nur zur Anzeige */
function emailAusToken(token: string | undefined) {
  try {
    const daten = JSON.parse(Buffer.from(token?.split('.')[1] ?? '', 'base64url').toString());
    return typeof daten.email === 'string' ? daten.email : null;
  } catch {
    return null;
  }
}

export default async function Page() {
  await adminKontext();
  return <AdminSettings email={emailAusToken((await cookies()).get(ACCESS)?.value)} />;
}
