# Sitemap, Robots, Weiterleitungen

Status: Entwurf

## Akzeptanzkriterien

- AK-1: `sitemap.xml` wird automatisch aus allen Seiten inkl. Städte-Landingpages erzeugt.
- AK-2: `robots.txt` erlaubt Crawling (inkl. KI-Crawler, sofern Erik zustimmt) und verweist auf die Sitemap.
- AK-3: Alle 19 bisherigen URLs liefern 200 oder 301 auf die neue URL, kein 404 (Pfade bleiben weitgehend gleich, siehe `seiten/leistungen.md`).
- AK-4: Vorhandene `llms.txt` wird übernommen und automatisch um neue Seiten ergänzt.
