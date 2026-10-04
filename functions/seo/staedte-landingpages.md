# Städte-Landingpages

Status: Entwurf (für später vorbereitet)

## Zweck

Ranking für Suchen wie „Webflow Agentur Augsburg" oder „Barrierefreiheit Beratung Innsbruck".

## Verhalten

Route `/<leistung>/<stadt>` aus Supabase-Tabelle `staedte` × `leistungen`. Nur veröffentlichen, wenn eigener lokaler Inhalt vorhanden ist (Bezug, Referenzen, lokale Fragen), sonst kein Index, um Duplicate Content zu vermeiden.

## Akzeptanzkriterien

- AK-1: Seite wird nur generiert, wenn `veroeffentlicht = true` und Mindestinhalt vorhanden.
- AK-2: JSON-LD `Service` mit `areaServed` = Stadt.
- AK-3: Eigene FAQ je Stadt möglich.
- AK-4: Automatisch in der Sitemap, interne Links von der Leistungsseite.

## Daten

`staedte` (slug, name, region, intro, veroeffentlicht), `stadt_leistung` (stadt_id, leistung_slug, text, faq_ids).
