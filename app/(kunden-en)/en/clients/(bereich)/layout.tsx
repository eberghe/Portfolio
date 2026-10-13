import KundenRahmen from '@/components/kundenbereich/KundenRahmen';

// Client pages with the „Back to website“ bar (functions/kundenbereich/rahmen.md)

export default function Layout({ children }: { children: React.ReactNode }) {
  return <KundenRahmen locale="en">{children}</KundenRahmen>;
}
