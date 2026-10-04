# Deutsch & Englisch

Status: Entwurf

## Bestand

Die Lovable-Seite schaltet die Sprache nur im Browser um (`src/lib/i18n.tsx`, `t(de, en)`). Es gibt keine englischen URLs, Google sieht nur Deutsch.

## Verhalten

- Deutsch ist Standard unter den bisherigen Pfaden (`/services/...`, `/projects/...`, `/about`), damit keine bestehende URL bricht.
- Englisch unter `/en/...` mit denselben Slugs.
- Sprachumschalter führt auf die entsprechende Seite der anderen Sprache, nicht auf die Startseite.
- Alle Texte liegen in Übersetzungsdateien bzw. Supabase mit Sprachfeld, nicht im Komponentencode. Die vorhandenen DE/EN-Texte aus dem Lovable-Repo werden übernommen.

## Akzeptanzkriterien

- AK-1: `<html lang>` korrekt je Sprache.
- AK-2: `hreflang`-Links (de, en, x-default) auf jeder Seite, beide Sprachen in der Sitemap.
- AK-3: Jede Seite existiert in beiden Sprachen, oder der Umschalter wird für diese Seite ausgeblendet.
- AK-4: Sprachumschalter ist ein beschrifteter Link mit Text (z. B. „English"), nicht nur eine Flagge, mit `lang="en"` am Linktext.
- AK-5: Keine automatische Weiterleitung nach Browsersprache (schadet SEO), höchstens ein Hinweis.
