import type { Metadata } from 'next';
import AdminDashboard from '@/components/kundenbereich/admin/AdminDashboard';
import { adminKontext } from '@/components/kundenbereich/admin/kontext';
import { dashboardDaten } from '@/lib/kundenbereich/admin/laden';

// functions/kundenbereich/admin-dashboard.md
export const metadata: Metadata = { title: 'Home | Verwaltung', robots: { index: false, follow: false } };

export default async function Page() {
  const api = await adminKontext();
  const now = new Date();
  return <AdminDashboard daten={await dashboardDaten(api, now)} now={now} />;
}
