import { adminKontext } from '@/components/kundenbereich/admin/kontext';

// Admin-Prüfung vor dem Ladezustand (loading.tsx): sonst ginge der Status 200 raus, bevor die Seite 404 meldet
// (functions/kundenbereich/admin-aufbau.md AK-13, admin.md AK-1)

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await adminKontext();
  return children;
}
