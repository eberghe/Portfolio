# Kontaktseite

Status: In Arbeit

## Zweck

Eine Seite, auf der man Erik ohne Mailprogramm erreicht: Anfrage-Assistent (`kontakt/anfrage-assistent.md`) und direkte Kanäle.

## Bestand (Lovable `ContactPage.tsx`)

Grüner Kopfbereich („Lass uns reden", „Projekt? Idee? Oder einfach Hallo sagen?"), links Direktkontakt (E-Mail, Instagram, LinkedIn, Standort) als nicht klickbare Zeilen, rechts das Formular.

## Verhalten

- `/contact` (EN `/en/contact`), serverseitig gerendert, Design wie im Bestand.
- Kopfbereich mit Überline, h1 und Einleitung wie im Bestand; Einleitung nennt, was nach der Anfrage passiert.
- Links „Direktkontakt": E-Mail (`mailto:`), LinkedIn, Instagram als echte Links; Standort „Augsburg & Innsbruck" als Text. Darunter ein Satz zum Ablauf: Antwort per Mail, kostenloses Erstgespräch.
- Rechts der Anfrage-Assistent.

## Akzeptanzkriterien

- AK-1: `/contact` und `/en/contact` sind erreichbar, haben eigenen Title (endet auf „| Erik Bergheimer"), Description (höchstens 160 Zeichen), canonical und hreflang und stehen in der Sitemap.
- AK-2: Genau eine h1; Direktkontakt ist eine Liste echter Links (E-Mail, LinkedIn, Instagram); externe Links nennen ihr Ziel.
- AK-3: JSON-LD `ContactPage` mit Name, Verweis auf die Person (`@id`) und eingebetteter Person mit E-Mail und `ContactPoint`.
- AK-5: Auf kleinen Bildschirmen führt ein Sprunglink „Zum Anfrageformular" im Kopfbereich direkt zum Formular, weil der Direktkontakt davor steht.
- AK-4: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel), auch mit sichtbaren Fehlermeldungen.

## Barrierefreiheit

Icons dekorativ; Linktexte nennen Kanal und Wert („E-Mail: erb1209@outlook.de").

## Mobile

Unter 768 px untereinander in der Reihenfolge des Bestands: erst Direktkontakt (kurz), direkt darunter der Assistent.

## Sprachen (DE/EN)

Texte in `lib/content/contact.ts`.

## SEO / GEO

Title „Kontakt & Projektanfrage | Erik Bergheimer", Description mit Augsburg & Innsbruck und Erstgespräch.

## Daten

Keine eigenen; Anfragen siehe Anfrage-Assistent.

## Tests

`tests/unit/anfrage.test.tsx` (AK-2, AK-3), `tests/e2e/kontakt.spec.ts` (AK-1, AK-4), `tests/unit/seo.test.ts` (Sitemap).

## Offene Fragen

- Telefonnummer anzeigen? Derzeit nicht.
