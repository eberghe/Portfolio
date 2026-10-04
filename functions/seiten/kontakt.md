# Kontaktseite

Status: In Arbeit

## Zweck

Eine Seite, auf der man Erik ohne Mailprogramm erreicht: Anfrage-Assistent (`kontakt/anfrage-assistent.md`) und direkte Kanäle.

## Bestand (Lovable `ContactPage.tsx`)

Grüner Kopfbereich („Lass uns reden", „Projekt? Idee? Oder einfach Hallo sagen?"), links Direktkontakt (E-Mail, Instagram, LinkedIn, Standort) als nicht klickbare Zeilen, rechts das Formular.

## Verhalten

- `/contact` (EN `/en/contact`), serverseitig gerendert, Design wie im Bestand.
- Kopfbereich mit Überline, h1 und Einleitung wie im Bestand; Einleitung nennt, was nach der Anfrage passiert.
- Kein grünes Kopfband mehr (AK-6): links Kopf und Direktkontakt, rechts der Assistent in einer Karte.
- Links „Direktkontakt": E-Mail (`mailto:`), LinkedIn, Instagram als echte Links; Standort „Augsburg" als Text. Darunter ein Satz zum Ablauf: Antwort per Mail, kostenloses Erstgespräch.
- Rechts der Anfrage-Assistent.

## Akzeptanzkriterien

- AK-1: `/contact` und `/en/contact` sind erreichbar, haben eigenen Title (endet auf „| Erik Bergheimer"), Description (höchstens 160 Zeichen), canonical und hreflang und stehen in der Sitemap.
- AK-2: Genau eine h1; Direktkontakt ist eine Liste echter Links (E-Mail, LinkedIn, Instagram); externe Links nennen ihr Ziel.
- AK-3: JSON-LD `ContactPage` mit Name, Verweis auf die Person (`@id`) und eingebetteter Person mit E-Mail und `ContactPoint`.
- AK-5 (ersetzt durch AK-6): früher Sprunglink „Zum Anfrageformular"; entfällt, weil das Formular jetzt direkt nach der Überschrift steht.
- AK-6 (Erik, 2026-10-04): Der Assistent steht im ersten Bildschirm. Bei 360×780, 768×1024 und 1280×800 sind im ersten Schritt alle Leistungen und „Weiter" sichtbar, ohne zu scrollen; ab 768 px gilt das für jeden Schritt. Dafür: kompakter Kopf (Überline, h1, ein Satz) links neben dem Formular, Leistungen als zweispaltiges Raster, Direktkontakt unter dem Kopf (Desktop) bzw. unter dem Formular (Handy).
- AK-7 (Blinder Kritiker): Die auf dem Handy unten klebenden Schritt-Buttons verdecken nie ein fokussiertes Feld (WCAG 2.4.11): erhält ein Feld unter der Leiste den Fokus, scrollt die Seite es darüber.
- AK-8 (Blinder Kritiker): Die Einleitung („Erzähl mir in vier kurzen Schritten …“) wird auch auf dem Handy vor dem Assistenten vorgelesen; sichtbar steht sie dort unter dem Direktkontakt.
- AK-4: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel), auch mit sichtbaren Fehlermeldungen.

## Barrierefreiheit

Icons dekorativ; Linktexte nennen Kanal und Wert („E-Mail: erb1209@outlook.de").

## Mobile

Unter 768 px untereinander: kurzer Kopf, Assistent, dann Direktkontakt (AK-6).

## Sprachen (DE/EN)

Texte in `lib/content/contact.ts`.

## SEO / GEO

Title „Kontakt & Projektanfrage | Erik Bergheimer", Description mit Augsburg und Erstgespräch.

## Daten

Keine eigenen; Anfragen siehe Anfrage-Assistent.

## Tests

`tests/unit/anfrage.test.tsx` (AK-2, AK-3), `tests/e2e/kontakt.spec.ts` (AK-1, AK-4), `tests/unit/seo.test.ts` (Sitemap).

## Offene Fragen

- Telefonnummer anzeigen? Derzeit nicht.
