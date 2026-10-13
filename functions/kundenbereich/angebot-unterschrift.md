# Kundenbereich: Angebot ansehen und unterschrieben hochladen

Status: In Arbeit

## Zweck

Freigegebene Angebote (`angebote.md`) erscheinen im Kundenbereich. Der Kunde lädt dort das unterschriebene Angebot hoch, statt es per Mail zu schicken.

## Nutzer & Ziel

- **Ansprechpartner:** sieht sofort, dass ein Angebot auf seine Unterschrift wartet, lädt es herunter und die unterschriebene Fassung wieder hoch.
- **Erik:** sieht in der Verwaltung, dass es unterschrieben ist, und hat die Datei im Projekt.

## Verhalten

1. Unter Dokumente gibt es die Gruppe „Angebote“ (EN „Quotes“) als erste Gruppe. Unterschriebene Fassungen stehen in derselben Gruppe mit dem Titel „Angebot 2026-002, unterschrieben“.
2. Hat ein aktuelles Angebot noch keine unterschriebene Fassung, steht darunter der Button „Unterschriebenes Angebot hochladen“. Er klappt direkt darunter ein kleines Formular auf (kein Dialog, `aria-expanded`) mit Dateiauswahl „Datei“ (PDF, JPG oder PNG, höchstens 10 MB), „Hochladen“ und „Abbrechen“.
3. Hochladen läuft wie in der Verwaltung in drei Schritten: Der Server prüft Sitzung und Datei und holt mit dem Token des Kunden einen signierten Upload-Link für genau einen Pfad `<kunde>/<projekt>/unterschrift-<zufall>.<endung>`; der Browser lädt direkt in Supabase Storage; der Server trägt die Datei über die Datenbankfunktion `unterschrift_eintragen` ein.
4. `unterschrift_eintragen` prüft, dass das Angebot zum Kunden gehört, freigegeben ist und noch keine Unterschrift hat, dass die Datei unter dem Pfad des Projekts liegt und Typ und Größe passen. Sie legt den Dokument-Eintrag an (Art `unterschrift`) und setzt das Angebot auf `unterschrieben`.
5. Direkt danach ersetzt die Bestätigung „Danke! Das unterschriebene Angebot ist da.“ den Button und bekommt den Fokus. Die Seite lädt dafür nicht neu, sonst verschwände die Bestätigung samt Fokus mit der Karte. Beim nächsten Aufruf steht beim Angebot „Unterschrieben hochgeladen am 14. Okt. 2026“, und die Karte auf der Übersicht ist weg.
6. Auf der **Übersicht** steht eine Karte „Angebot wartet auf dich“ mit dem Titel, einem Link zum PDF und dem Button zum Hochladen, solange ein Angebot offen ist. In den Kacheln zählt es bei „Du bist dran“ mit.
7. Fehler: falscher Typ oder zu groß → Meldung am Feld; schon unterschrieben → „Für dieses Angebot gibt es schon eine Unterschrift.“; sonst „Das hat nicht geklappt. Bitte versuch es noch einmal.“
8. Admins in der Kundensicht (`?projekt=`) sehen den Button nicht.

## Akzeptanzkriterien

- AK-1: `dokumentGruppen` sortiert `angebot` und `unterschrift` in die erste Gruppe „Angebote“; eine Unterschrift gilt nie als neuere Version des Angebots.
- AK-2: Der Button erscheint nur bei aktuellen Angeboten ohne Unterschrift und nur für Kunden. Darüber steht „Wartet auf deine Unterschrift“ (EN „Waiting for your signature“), damit die Seite Dokumente auch ohne Übersicht erklärt, was zu tun ist.
- AK-3: Die Aktion zum Vorbereiten lehnt ohne Sitzung, mit anderem Typ als PDF/JPG/PNG oder über 10 MB ab und gibt sonst einen Upload-Link für den Pfad im Projekt zurück.
- AK-4: Die Datenbank erlaubt dem Kunden Uploads nur unter `<kunde>/<projekt>/unterschrift-*` seiner eigenen Projekte; `unterschrift_eintragen` lehnt fremde Angebote, Entwürfe, doppelte Unterschriften und fehlende Dateien ab.
- AK-5: Nach dem Eintragen hat das Angebot den Status `unterschrieben`, `unterschrieben_am` ist gesetzt und der Kunde sieht die Datei unter Dokumente.
- AK-6: Die Übersicht zeigt die Karte „Angebot wartet auf dich“ (EN „A quote is waiting for you“), solange ein Angebot offen ist; „Du bist dran“ zählt es mit.
- AK-7: Englisch: „Quotes“, „Upload signed quote“, „Signed, uploaded on …“.
- AK-8: Keine axe-Verstöße bei 360, 768 und 1280 px, hell und dunkel.

## Barrierefreiheit

- Der Button nennt das Angebot („Unterschriebenes Angebot hochladen: Angebot 2026-002“ als zugänglicher Name).
- Meldungen nach dem Hochladen in einer `role="status"`-Region, Fehler am Feld mit `aria-describedby`.

## Mobile

Button auf volle Breite unter 640 px.

## Sprachen (DE/EN)

Texte in `lib/kundenbereich/text.ts`.

## SEO / GEO

Nicht betroffen (`noindex`).

## Daten

Migration `20261013200000_angebote.sql`: Storage-Regel `kundenbereich_unterschrift_hochladen` (insert, Bucket `kundendokumente`, Pfad im eigenen Projekt mit `unterschrift-`), Funktion `unterschrift_eintragen(p_angebot_dokument uuid, p_pfad text, p_dateiname text)` als `security definer`.

## Tests

- `tests/unit/kundenbereich-angebot-unterschrift.test.tsx`: Gruppen, Button, Aktion, Übersicht, Englisch (AK-1 bis AK-3, AK-6, AK-7)
- `tests/unit/kundenbereich-angebote-db.test.ts`: Storage-Regel und Funktion (AK-4, AK-5)
- `tests/e2e/kundenbereich-projekte.spec.ts`: Upload im Browser, axe (AK-5, AK-8)

## Offene Fragen

- Digitale Unterschrift direkt im Browser statt Upload: später.
