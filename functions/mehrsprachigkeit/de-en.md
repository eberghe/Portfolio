# Deutsch & Englisch

Status: Entwurf

## Verhalten
- Deutsch ist Standard ohne Präfix (`/leistungen/...`), Englisch unter `/en/...` mit englischen Slugs (`/en/services/...`).
- Sprachumschalter führt auf die entsprechende Seite der anderen Sprache, nicht auf die Startseite.
- Alle Texte liegen in Übersetzungsdateien bzw. Supabase mit Sprachfeld, nicht im Komponentencode.

## Akzeptanzkriterien
- AK-1: `<html lang>` korrekt je Sprache.
- AK-2: `hreflang`-Links (de, en, x-default) auf jeder Seite, beide Sprachen in der Sitemap.
- AK-3: Jede Seite existiert in beiden Sprachen, oder der Umschalter wird für diese Seite ausgeblendet.
- AK-4: Sprachumschalter ist ein beschrifteter Link (z. B. „English"), mit `lang="en"` am Linktext.
- AK-5: Keine automatische Weiterleitung nach Browsersprache (schadet SEO), höchstens ein Hinweis.
