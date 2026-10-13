import KundenRahmen from '@/components/kundenbereich/KundenRahmen';

// Kundenseiten mit der Leiste „Zur Website“ (functions/kundenbereich/rahmen.md)

export default function Layout({ children }: { children: React.ReactNode }) {
  return <KundenRahmen locale="de">{children}</KundenRahmen>;
}
