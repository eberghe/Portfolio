import KundenRahmen from '@/components/kundenbereich/KundenRahmen';
import NotFound from '@/components/NotFound';

// 404 im Kundenbereich, z. B. für Nicht-Admins unter /kunden/admin (admin.md AK-1), mit dem Rahmen der Kundenseiten

export default function KundenNichtGefunden() {
  return (
    <KundenRahmen locale="de">
      <NotFound locale="de" />
    </KundenRahmen>
  );
}
