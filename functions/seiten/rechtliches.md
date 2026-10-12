# Impressum & Datenschutz

Status: In Arbeit

## Zweck

Pflichtangaben und Datenschutzinformation, erreichbar aus dem Footer jeder Seite.

## Bestand (Lovable `ImpressumPage.tsx`, `DatenschutzPage.tsx`)

- Impressum: Name, „UX/UI Designer & Webflow Expert", „Innsbruck, Österreich", E-Mail, Website, Verantwortlich für den Inhalt, Haftungsausschluss, Urheberrecht. Überschrift „Angaben gemäß § 5 TMG" (das TMG gilt seit Mai 2024 nicht mehr; Erik sitzt in Österreich).
- Datenschutz: Allgemeines, Verantwortlicher, Hosting & Logfiles, Kontaktformular (Web3Forms), Cookies, Rechte.

## Verhalten

- `/impressum` und `/datenschutz` (EN `/en/impressum`, `/en/datenschutz`), Pfade bleiben wie im Bestand.
- Texte aus dem Bestand; angepasst an den neuen Stand: Hosting bei Vercel, keine Tracking-Cookies, Farbschema im Browser-Speicher (localStorage), Schriften lokal ausgeliefert, kein Kontaktformular (der Anfrage-Assistent ergänzt den Abschnitt, sobald er existiert, siehe `kontakt/anfrage-assistent.md`).
- Überschrift „Angaben gemäß § 5 DDG" mit vollständiger Anschrift in Königsbrunn (siehe `standort.md`). Rechtliche Prüfung liefert Erik.
- E-Mail-Adresse als `mailto:`-Link.
- Beide Seiten `robots: noindex`, aber in der Sitemap nicht enthalten.

## Akzeptanzkriterien

- AK-1: Beide Seiten existieren in DE und EN, je genau eine h1, Abschnitte als h2, mit eigenem Title und Description.
- AK-2: Impressum nennt Name, Ort, E-Mail (als Link) und Verantwortlichen.
- AK-3: Datenschutz nennt Verantwortlichen, den Kundenbereich (`kundenbereich/logo-freigabe.md`), Hosting bei Vercel, Logfiles, Cookies/Browser-Speicher, das Anfrageformular (Supabase in der EU, Benachrichtigung über Resend, IP nur als Hash) und die Betroffenenrechte; erwähnt keinen Dienst, den die Seite nicht nutzt (Web3Forms, Google Analytics als genutzt).
- AK-4: Beide Seiten `noindex` und nicht in der Sitemap.
- AK-5: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel).
- AK-8: Englische Fassungen liegen unter `/en/imprint` und `/en/privacy`; `/en/impressum` und `/en/datenschutz` leiten dauerhaft weiter. Footer, Sprachumschalter und hreflang verweisen auf die passende Adresse der jeweils anderen Sprache.

## Sprachen

DE und EN; EN übersetzt die deutschen Texte, ohne Rechtswirkung zu versprechen.

## Daten

Keine.

## Tests

`tests/unit/statische-seiten.test.tsx` (AK-1 bis AK-4), `tests/e2e/statische-seiten.spec.ts` (AK-1, AK-5).

## Offene Fragen

- Rechtliche Prüfung beider Texte (Generator oder Anwalt).

## Befunde Blinder Kritiker (Runde 1)

Erledigt: vollständige Anschrift und zuständige Aufsichtsbehörde (BayLDA), siehe `standort.md`. Offen, Entscheidung bei Erik: ggf. USt-ID, Speicherdauer der Logfiles. Erledigt: englische Pfade `/en/imprint` und `/en/privacy` (AK-8). Blinder Kritiker dazu: ohne Befund außer einer zweistufigen Weiterleitung bei `/en/impressum/` (Slash am Ende, Next entfernt ihn zuerst); bewusst so gelassen, da kosmetisch.
