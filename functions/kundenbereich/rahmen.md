# Kundenbereich: eigener schlanker Rahmen

Status: Umgesetzt (Preview, nicht live)

## Zweck

Der Kundenbereich und die Verwaltung sind ein Arbeitsbereich und keine Marketingseite. Wunsch von Erik am 2026-10-09: Navigation und Footer der Website fallen dort komplett weg, ebenso das weiche Scrollen. Es bleibt nur ein Link zurück zur Website.

## Nutzer & Ziel

- **Kunden:** sehen ohne Ablenkung ihr Projekt und finden mit einem Klick zurück zur Website.
- **Erik:** arbeitet in der Verwaltung wie in einem Werkzeug. Das Scrollen verhält sich normal.

## Verhalten

1. Alle Seiten unter `/kunden` und `/en/clients` haben einen eigenen Rahmen. Das gilt für Anmeldung, Bestätigung, Projektübersicht und Verwaltung.
   - Oben steht eine schmale Leiste mit dem Logo und dem Link „Zur Website“ bzw. „Back to website“. Beide führen zur Startseite der jeweiligen Sprache.
   - Die Hauptnavigation, der Footer, die Ladeanimation und das weiche Scrollen (Lenis und CSS `scroll-behavior: smooth`) gibt es dort nicht.
2. Der Link „Zum Inhalt springen“ bleibt erhalten.
3. Der Dunkelmodus folgt der gespeicherten Wahl der Website, sonst der Systemeinstellung, ohne Aufblitzen.
4. Admins ohne `?projekt=` landen beim Aufruf von `/kunden` oder `/en/clients` direkt auf der Verwaltung (`/kunden/admin`). Mit `?projekt=<id>` sehen sie weiter die Ansicht des Kunden („So sieht es der Kunde“).

## Akzeptanzkriterien

- AK-1: Auf `/kunden`, `/en/clients`, `/kunden/anmelden` und `/kunden/admin` gibt es keine Hauptnavigation, keinen Footer und keine Ladeanimation.
- AK-2: Die Leiste hat einen Link „Zur Website“ zu `/` bzw. „Back to website“ zu `/en`.
- AK-3: `<html>` hat dort weder die Klasse `smooth` noch `scroll-behavior: smooth`, und Lenis startet nicht.
- AK-4: Ein Admin ohne `?projekt` wird von `/kunden` und `/en/clients` auf `/kunden/admin` weitergeleitet, ein Kunde nicht.
- AK-5: Keine axe-Verstöße und kein horizontales Scrollen bei 360, 768 und 1280 px, hell und dunkel (bestehende Tests des Kundenbereichs).

## Barrierefreiheit

- Die Leiste ist ein `header` (Landmark „banner“). Der Inhalt bleibt `main#inhalt`.
- Der Link nennt das Ziel. Das Logo hat den zugänglichen Namen „Erik Bergheimer, zur Website“.

## Mobile

Die Leiste ist einzeilig und 64 px hoch. Logo links, Link rechts.

## Sprachen (DE/EN)

„Zur Website“ / „Back to website“. Die Verwaltung bleibt deutsch.

## SEO / GEO

Unverändert `noindex`.

## Tests

- `tests/unit/kundenbereich-rahmen.test.tsx`: Leiste, Weiterleitung für Admins (AK-2, AK-4)
- `tests/e2e/kundenbereich-rahmen.spec.ts`: ohne Navigation, Footer und weiches Scrollen (AK-1, AK-3)
