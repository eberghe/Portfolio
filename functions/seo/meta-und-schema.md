# Meta-Daten & strukturierte Daten

Status: In Arbeit

## Zweck

Jede Seite liefert Suchmaschinen und KI-Suchsystemen (ChatGPT, Perplexity, Google AI Overviews) sauber auslesbare Inhalte. Die Lovable-Seite rendert Inhalte nur per JavaScript; im HTML stehen nur Meta-Tags. Das ist der größte SEO-/GEO-Hebel des Umbaus.

## Verhalten

- Ein gemeinsamer Helfer `pageMetadata()` (`lib/seo.ts`) erzeugt für jede Seite Title, Description, Canonical, `hreflang`-Alternativen (de, en, x-default → de), Open Graph und Twitter Card. Seiten rufen nur diesen Helfer auf.
- Vorschaubild (`og:image`): Projekte ihr Titelbild, sonst das Porträt von der Startseite.
- Startseite: JSON-LD `Person` und `ProfessionalService` (Augsburg, Innsbruck, DE/AT).
- `llms.txt` wird aus denselben Inhalten erzeugt wie die Seiten (Leistungen, Projekte), damit nichts veraltet.

## Akzeptanzkriterien

- AK-1: Jede Seite hat eindeutigen Title (≤ 70 Zeichen), Description (≤ 160), absolutes Canonical auf sich selbst, `hreflang` de/en/x-default, `og:title`, `og:description`, `og:url`, `og:image`, `og:locale` (de_DE/en_US) und `twitter:card`.
- AK-2: Startseite: JSON-LD `Person` und `ProfessionalService` mit `areaServed` (Augsburg, Innsbruck, Deutschland, Österreich).
- AK-3: Breadcrumbs mit `BreadcrumbList` auf Detailseiten (umgesetzt in `seiten/leistungen.md`, `seiten/projekte.md`).
- AK-4: Inhalt ist ohne JavaScript vollständig im HTML.
- AK-5: `/llms.txt` mit Kurzprofil und absoluten Links zu allen Leistungen und Projekten (DE und EN), erzeugt aus den Inhaltsdaten.

## Sprachen

`og:locale` und `og:locale:alternate` je Sprache; x-default zeigt auf die deutsche Seite.

## Tests

`tests/unit/seo.test.ts` (AK-1, AK-2, AK-5), `tests/e2e/seo.spec.ts` (AK-1, AK-4, AK-5).
