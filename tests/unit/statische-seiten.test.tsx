import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FaqPage from '@/components/faq/FaqPage';
import LegalPage from '@/components/legal/LegalPage';
import { faqs } from '@/lib/content/faq';
import { sitePaths } from '@/lib/routes';
import { legalMetadata } from '@/lib/pages/static';
import { faqJsonLd } from '@/lib/structured-data';

// functions/seiten/rechtliches.md, functions/seiten/faq.md
const locales = ['de', 'en'] as const;

describe('rechtliches AK-1/AK-2: Impressum', () => {
  it.each(locales)('Aufbau und Pflichtangaben (%s)', (locale) => {
    render(<LegalPage kind="impressum" locale={locale} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThanOrEqual(3);
    const main = document.body;
    expect(main).toHaveTextContent('Erik Bergheimer');
    expect(main).toHaveTextContent('Königsbrunn');
    expect(screen.getByRole('link', { name: 'erb1209@outlook.de' })).toHaveAttribute(
      'href',
      'mailto:erb1209@outlook.de',
    );
    expect(main).not.toHaveTextContent('TMG');
  });
});

describe('rechtliches AK-3: Datenschutz', () => {
  it.each(locales)('nennt nur genutzte Dienste (%s)', (locale) => {
    render(<LegalPage kind="datenschutz" locale={locale} />);
    const text = document.body.textContent!;
    expect(text).toContain('Vercel');
    expect(text).toMatch(locale === 'de' ? /Logfiles/ : /log files/);
    expect(text).toContain('localStorage');
    expect(text).not.toContain('Web3Forms');
    // Anfrage-Assistent (functions/kontakt/anfrage-assistent.md)
    expect(text).toContain('Supabase');
    expect(text).toContain('Resend');
    expect(text).toMatch(locale === 'de' ? /Anfrageformular/ : /enquiry form/);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});

describe('rechtliches AK-4: noindex, nicht in der Sitemap', () => {
  it('Meta und Sitemap', () => {
    for (const kind of ['impressum', 'datenschutz'] as const) {
      expect(legalMetadata(kind, 'de').robots).toMatchObject({ index: false });
      expect(sitePaths()).not.toContain(`/${kind}`);
    }
  });
});

describe('faq AK-1/AK-2: Aufbau', () => {
  it.each(locales)('details/summary mit Antwort im HTML (%s)', (locale) => {
    const { container } = render(<FaqPage locale={locale} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const details = container.querySelectorAll('details');
    expect(details).toHaveLength(faqs.length);
    faqs.forEach((f, i) => {
      expect(
        within(details[i] as HTMLElement)
          .getByText(f[locale].q)
          .closest('summary'),
      ).not.toBeNull();
      expect(details[i]).toHaveTextContent(f[locale].a.slice(0, 30));
    });
    expect(sitePaths()).toContain('/faqs');
  });
});

describe('faq AK-3: FAQPage', () => {
  it('alle Fragen der Sprache', () => {
    const data = faqJsonLd('en');
    expect(data['@type']).toBe('FAQPage');
    expect(data.mainEntity).toHaveLength(faqs.length);
    expect(data.mainEntity[0]).toMatchObject({
      '@type': 'Question',
      name: faqs[0]!.en.q,
      acceptedAnswer: { '@type': 'Answer', text: faqs[0]!.en.a },
    });
  });
});

describe('faq AK-4: aktuelle Inhalte', () => {
  it.each(locales)('%s', (locale) => {
    const all = faqs.map((f) => f[locale].a).join(' ');
    expect(all).not.toMatch(/Framer|Business Development/);
    expect(all).toContain('Augsburg');
  });
});

describe('faq AK-7: Frage zum Standort (Issue #3)', () => {
  it.each(locales)('%s', (locale) => {
    const f = faqs[1]!;
    expect(f.id).toBe('standort');
    expect(f[locale].q).toBe(locale === 'de' ? 'Wo bist du ansässig?' : 'Where are you based?');
    expect(f[locale].a).toMatch(/Königsbrunn/);
    expect(f[locale].a).toMatch(/Augsburg/);
    expect(f[locale].a).toMatch(/remote/);
    expect(faqJsonLd(locale).mainEntity[1]!.name).toBe(f[locale].q);
  });
});

describe('design-tokens AK-8: Datenschutz nennt die Schrift', () => {
  it.each(locales)('%s', (locale) => {
    render(<LegalPage kind="datenschutz" locale={locale} />);
    expect(document.body.textContent).toContain('Mona Sans');
    expect(document.body.textContent).not.toMatch(/\bInter\b/);
  });
});
