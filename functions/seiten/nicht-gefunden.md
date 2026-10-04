# Seite nicht gefunden (404)

Status: In Arbeit

## Zweck

Wer auf einer falschen oder alten Adresse landet, versteht sofort, was passiert ist, und findet ohne Umweg weiter.

## Nutzer & Ziel

Besucher mit veraltetem Link (z. B. aus der Lovable-Zeit) oder Tippfehler; Suchmaschinen sollen die Seite nicht aufnehmen.

## Verhalten

- Unbekannte Adressen liefern Status 404 und eine Seite im gewohnten Design mit Navigation und Footer.
- Innerhalb der englischen Seite (z. B. `/en/services/xyz`, unbekanntes Projekt) erscheint die Seite auf Englisch, auf der deutschen auf Deutsch.
- Adressen ohne `/en` zeigen Deutsch und darunter einen englischen Absatz mit eigenem `lang="en"`.
- Inhalt: h1 „Seite nicht gefunden", ein Satz, was passiert ist, Links zu Startseite, Leistungen, Projekten und Kontakt.

Technik: Eine globale 404 (`app/global-not-found.tsx`) deckt alle unbekannten Adressen ab, auch unbekannte Leistungen und Projekte (statisch erzeugt, `dynamicParams = false`). Die Sprache liefert `proxy.ts` als Request-Header `x-sprache`, abgeleitet aus dem Pfad. Seiten-eigene `not-found.tsx` in den Sprach-Layouts liefern bei Next 16 nur eine leere Fehler-Hülle ohne `lang` und werden deshalb nicht genutzt.

## Akzeptanzkriterien

- AK-1: Unbekannte Adressen liefern Status 404 mit Title „Seite nicht gefunden | Erik Bergheimer" (EN „Page not found | Erik Bergheimer") und `noindex`.
- AK-2: Genau eine h1; Links zu Startseite, Leistungen, Projekten und Kontakt in der jeweiligen Sprache.
- AK-3: Unbekannte Leistungen und Projekte unter `/en` zeigen die englische Fassung (`lang="en"`).
- AK-4: Adressen ohne Sprachzuordnung enthalten einen englischen Abschnitt mit `lang="en"` und Link zur englischen Startseite.
- AK-5: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel).

## Barrierefreiheit

Kein automatisches Weiterleiten; Linktexte nennen das Ziel.

## Mobile

Einspaltig, Links als Liste mit Zielgröße 44 px.

## Sprachen (DE/EN)

Texte in `lib/content/not-found.ts`.

## SEO / GEO

`noindex`; nicht in der Sitemap.

## Daten

Keine.

## Tests

`tests/unit/nicht-gefunden.test.tsx` (AK-2, AK-4), `tests/e2e/nicht-gefunden.spec.ts` (AK-1, AK-3, AK-5).

## Offene Fragen

- Alte Lovable-Adressen, die es nicht mehr gibt, bekommen Weiterleitungen (`seo/sitemap-und-redirects.md`); die 404 ist nur das Netz darunter.
