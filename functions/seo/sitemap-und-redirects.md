# Sitemap, Robots, Weiterleitungen

Status: In Arbeit

## Verhalten

- Ein Seitenverzeichnis (`lib/routes.ts`) listet alle fertigen Seiten (statische Pfade plus alle Leistungen und Projekte). Daraus entstehen `sitemap.xml` und die Tests; neue Seiten werden dort eingetragen.
- `robots.txt` erlaubt allen Crawlern alles außer den geheimen Angebotsseiten (`/projekt-…`) und verweist auf die Sitemap. KI-Crawler sind wie bisher erlaubt (Bestand), bis Erik anders entscheidet.

## Akzeptanzkriterien

- AK-1: `sitemap.xml` enthält jede fertige Seite in DE und EN genau einmal, mit `hreflang`-Alternativen; jede URL darin liefert Status 200.
- AK-2: `robots.txt` erlaubt Crawling, sperrt `/projekt-` und verweist auf die Sitemap.
- AK-3: Alle 19 bisherigen URLs liefern 200 oder 301 auf die neue URL, kein 404 (offen, bis Über mich, Kontakt, FAQ, Impressum, Datenschutz gebaut sind).
- AK-4: `llms.txt` wird aus den Inhaltsdaten erzeugt (siehe `seo/meta-und-schema.md` AK-5).

## Tests

`tests/unit/seo.test.ts` (AK-1, AK-2), `tests/e2e/seo.spec.ts` (AK-1, AK-2), `tests/e2e/leistungen.spec.ts` (Weiterleitungen).
