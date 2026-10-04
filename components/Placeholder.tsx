import { type Locale } from '@/lib/i18n';

const copy = {
  de: 'Die neue Website entsteht gerade. Digitale Erlebnisse, die Sinn ergeben, gut aussehen und funktionieren.',
  en: 'The new website is being built. Digital experiences that make sense, look great and work.',
};

// Platzhalter bis zur Übernahme der Startseite (functions/seiten/startseite.md)
export default function Placeholder({ locale }: { locale: Locale }) {
  return (
    <section className="container flex min-h-[calc(100vh-64px)] flex-col justify-center py-16">
      <p className="text-sm font-medium text-primary-text">UX/UI Designer & Webflow Expert</p>
      <h1 className="mt-4 text-4xl font-light tracking-tight md:text-6xl">Erik Bergheimer</h1>
      <p className="mt-6 max-w-xl text-text2">{copy[locale]}</p>
    </section>
  );
}
