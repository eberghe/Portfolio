# Standort Deutschland

Status: Fertig

## Zweck

Erik arbeitet von Deutschland aus (Königsbrunn bei Augsburg). Die Seite nennt deshalb überall Augsburg bzw. Deutschland als Standort, und das Impressum trägt die ladungsfähige Anschrift nach § 5 DDG.

## Nutzer & Ziel

Interessenten sehen sofort, wo Erik vor Ort arbeitet. Suchmaschinen und KI-Antworten ordnen ihn Augsburg und Deutschland zu. Das Impressum erfüllt die deutsche Anbieterkennzeichnung.

## Verhalten

- Standortangaben in Texten, Meta-Descriptions, JSON-LD und `llms.txt`: Augsburg, Deutschland, vor Ort oder remote. Innsbruck und Österreich werden nicht mehr als Standort oder Einsatzgebiet genannt.
- Lebenslauf und Projekte bleiben wahr: Studium am MCI Innsbruck, Umzug nach Innsbruck 2024 und das Innsbruck-Projekt SIGHT'KICK bleiben stehen.
- Footer-Satz: „made with 🤍 in augsburg".
- Impressum: Überschrift „Angaben gemäß § 5 DDG", Anschrift Erik Bergheimer, Weißdornstraße 5, 86343 Königsbrunn, Deutschland; „Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV".
- Datenschutz: Verantwortlicher mit derselben Anschrift; zuständige Aufsichtsbehörde ist das Bayerische Landesamt für Datenschutzaufsicht (BayLDA).

## Akzeptanzkriterien

- AK-1: Impressum (DE und EN) nennt „Weißdornstraße 5" und „86343 Königsbrunn" sowie Deutschland bzw. Germany; DE nennt § 5 DDG.
- AK-2: Datenschutz (DE und EN) nennt die Anschrift beim Verantwortlichen und das BayLDA.
- AK-3: Kein Text auf Impressum und Datenschutz nennt Innsbruck oder Österreich/Austria.
- AK-4: JSON-LD (`areaServed`, `workLocation`) nennt Augsburg und Deutschland/Germany, aber weder Innsbruck noch Österreich/Austria.
- AK-5: Meta-Descriptions von Startseite, Leistungen, Kontakt, FAQ und Über mich sowie `llms.txt` nennen Augsburg und kein Innsbruck als Standort.
- AK-6: Footer-Satz lautet „made with 🤍 in augsburg".

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

`tests/unit/standort.test.tsx` (AK-1 bis AK-6); bestehende Orts-Tests in `seo.test.ts`, `services.test.tsx`, `statische-seiten.test.tsx` auf Augsburg/Deutschland umgestellt.

## Offene Fragen

- Rechtliche Prüfung von Impressum und Datenschutz (Generator oder Anwalt) bleibt offen.
- FAQ nennt beim Thema Barrierefreiheit weiterhin das österreichische BaFG als Fachwissen, nicht als Standort.
