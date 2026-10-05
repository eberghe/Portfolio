# Standort Deutschland

Status: Fertig

## Zweck

Erik arbeitet von Deutschland aus (Königsbrunn bei Augsburg). Die Seite nennt deshalb überall Augsburg bzw. Deutschland als Standort, und das Impressum trägt die ladungsfähige Anschrift nach § 5 DDG.

## Nutzer & Ziel

Interessenten sehen sofort, wo Erik vor Ort arbeitet. Suchmaschinen und KI-Antworten ordnen ihn Augsburg und Deutschland zu. Das Impressum erfüllt die deutsche Anbieterkennzeichnung.

## Verhalten

- Standortangaben in Texten, Meta-Descriptions, JSON-LD und `llms.txt`: Augsburg, Deutschland, vor Ort oder remote. Innsbruck und Österreich werden nicht mehr als Standort oder Einsatzgebiet genannt.
- Ausnahme (Erik, 2026-10-05): die Landingpage `/webdesign-innsbruck` nennt Innsbruck und Österreich als Einsatzgebiet (remote), siehe functions/seo/staedte-landingpages.md. Standort bleibt Deutschland.
- Lebenslauf und Projekte bleiben wahr: Studium am MCI Innsbruck, Umzug nach Innsbruck 2024 und das Innsbruck-Projekt SIGHT'KICK bleiben stehen.
- Footer-Satz: „made with 🤍 in augsburg".
- Impressum: Überschrift „Angaben gemäß § 5 DDG", Anschrift Erik Bergheimer, Weißdornstraße 5, 86343 Königsbrunn, Deutschland; „Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV".
- Datenschutz: Verantwortlicher mit derselben Anschrift; zuständige Aufsichtsbehörde ist das Bayerische Landesamt für Datenschutzaufsicht (BayLDA).

## Akzeptanzkriterien

- AK-1: Impressum (DE und EN) nennt „Weißdornstraße 5" und „86343 Königsbrunn" sowie Deutschland bzw. Germany; DE nennt § 5 DDG.
- AK-2: Datenschutz (DE und EN) nennt die Anschrift beim Verantwortlichen und das BayLDA.
- AK-3: Kein Text auf Impressum und Datenschutz nennt Innsbruck oder Österreich/Austria.
- AK-4: Ortsfelder im JSON-LD (`areaServed`, `workLocation`, `address`) nennen Augsburg und Deutschland/Germany, aber weder Innsbruck noch Österreich/Austria. `alumniOf` darf das MCI Innsbruck nennen.
- AK-5: Meta-Descriptions von Startseite, Leistungen, Kontakt, FAQ und Über mich sowie `llms.txt` nennen Augsburg und kein Innsbruck als Standort.
- AK-6: Footer-Satz lautet „made with 🤍 in augsburg".
- AK-7: Startseiten-JSON-LD: Augsburg ist `City`, Deutschland/Germany ist `Country`.
- AK-8: `Person` im JSON-LD hat `address` (`PostalAddress`: Weißdornstraße 5, 86343 Königsbrunn, DE).
- AK-9: Die Anschrift wird mit echten Zeilenumbrüchen (`<br>`) ausgegeben, nicht nur per CSS, damit Screenreader und Kopieren die Zeilen erhalten. EN-Impressum: Überschrift „Information pursuant to Section 5 DDG".
- AK-10: Die FAQ nennt Barrierefreiheit-Regeln ohne Österreich-Bezug, in DE und EN gleich (WCAG, BFSG, European Accessibility Act).

## Barrierefreiheit

Keine Änderung; Anschrift mit sichtbaren Zeilenumbrüchen.

## Mobile

Keine Änderung.

## Sprachen (DE/EN)

Beide Sprachen; EN nennt „Germany".

## SEO / GEO

`areaServed`: Augsburg, Deutschland. Descriptions nennen Augsburg.

## Daten

Keine.

## Tests

`tests/unit/standort.test.tsx` (AK-1 bis AK-10); bestehende Orts-Tests in `seo.test.ts`, `services.test.tsx`, `statische-seiten.test.tsx` auf Augsburg/Deutschland umgestellt.

## Offene Fragen

- Rechtliche Prüfung von Impressum und Datenschutz (Generator oder Anwalt) bleibt offen.

## Befunde Blinder Kritiker (Runde 1)

Behoben (mit Test): FAQ-BaFG (AK-10), City/Country im JSON-LD (AK-7), `address` im JSON-LD (AK-8), Zeilenumbrüche der Anschrift und EN-Überschrift (AK-9).
Entschieden von Erik (2026-10-04): kein Umzugs-Eintrag, dafür Masterabschluss in der Zeitleiste (siehe `ueber-mich.md` AK-11); keine Telefonnummer und keine USt-ID im Impressum.
Als Issue angelegt (größer oder unabhängig): FAQ-Frage zum Standort, „uX/UI" in EN-Überschrift, Leerzeichen vor Komma in der h1, „5 Projekte" bei 4 sichtbaren, FAQ-Fragen ohne Überschriften.
