# Kundenbereich: Angebote erstellen und freigeben

Status: In Arbeit

## Zweck

Wunsch von Erik am 2026-10-13: „ich möchte das du angebot als pdf automatisch erstellst, dafür muss ein prozess für mich als admin hinterlegt werden und auch dann das dokument bei den jeweiligen kunden auftauchen! auch unterschriebenes dokument dann hochladen für kunden muss möglich sein.“

Erik schreibt ein Angebot in der Verwaltung. Daraus entsteht ein PDF in seinem Design (`angebot-pdf.md`). Er prüft es als Entwurf und gibt es dann frei. Ab dann steht es im Kundenbereich, wo der Kunde die unterschriebene Fassung hochlädt (`angebot-unterschrift.md`).

## Nutzer & Ziel

- **Erik:** schreibt ein Angebot in wenigen Minuten, ohne Word oder Vorlage, und sieht auf einen Blick, welches Angebot offen ist und welches unterschrieben zurückkam.
- **Ansprechpartner:** bekommt das Angebot dort, wo auch Ablauf und Dokumente liegen.

## Verhalten

1. Im Projekt der Verwaltung gibt es die Karte **Angebote** mit dem Button „Angebot erstellen“ (Plus-Icon) im Kopf.
2. Der Dialog „Angebot erstellen“ fragt:
   - Nummer (vorbelegt mit der nächsten freien Nummer im Jahr, z. B. `2026-002`)
   - Titel (vorbelegt mit dem Projekttitel)
   - Sprache des PDFs (Deutsch/Englisch, vorbelegt mit der Sprache des ersten Ansprechpartners)
   - Datum (heute) und Gültig bis (heute + 30 Tage)
   - Empfänger (mehrzeilig, vorbelegt mit Kunde und Ansprechpartnern)
   - Einleitung (mehrzeilig, optional)
   - Positionen: je Bezeichnung, Beschreibung (optional), Menge, Einheit (z. B. „Std.“, „pauschal“), Einzelpreis netto in Euro. Positionen lassen sich hinzufügen und entfernen, mindestens eine.
   - Umsatzsteuer: „19 % ausweisen“ oder „Keine (Kleinunternehmer, § 19 UStG)“
   - Darunter laufend Netto, Umsatzsteuer und Gesamt.
3. „Entwurf speichern“ prüft alle Felder, erzeugt das PDF, legt es privat ab und speichert das Angebot als **Entwurf**. Der Kunde sieht Entwürfe nicht.
4. Die Karte listet die Angebote, neuestes zuerst: Nummer und Titel, Gesamtbetrag und Status (`Entwurf`, `Beim Kunden`, `Unterschrieben`). Jedes Angebot hat ein ⋯-Menü:
   - „PDF ansehen“ öffnet das PDF in einem neuen Tab
   - nur Entwurf: „Bearbeiten“ (gleicher Dialog, erzeugt das PDF neu) und „An Kunden freigeben“ (mit Rückfrage)
   - nur unterschrieben: „Unterschriebenes ansehen“
   - „Löschen“ (mit Rückfrage; löscht auch das PDF und eine hochgeladene Unterschrift)
5. „An Kunden freigeben“ trägt das PDF als Dokument der Art `angebot` mit dem Titel „Angebot 2026-002“ ins Projekt ein. Ab dann sieht es der Kunde unter Dokumente und auf der Übersicht. Freigegebene Angebote lassen sich nicht mehr bearbeiten; für Änderungen erstellt Erik ein neues.
6. Hat der Kunde das unterschriebene Angebot hochgeladen, steht es als „Unterschrieben am …“ in der Karte. Die Übersicht der Verwaltung zählt Angebote beim Kunden nicht extra; das Projekt bleibt im Status, den Erik setzt.

## Akzeptanzkriterien

- AK-1: Die Prüfung verlangt Nummer im Format `JJJJ-NNN`, Titel, Datum, Gültig bis nicht vor dem Datum und mindestens eine Position mit Bezeichnung, Menge > 0 und Einzelpreis ≥ 0; Fehler stehen am Feld (Positionen als `pos.<i>.<feld>`).
- AK-2: Beträge werden in Cent gerechnet: Positionsbetrag = gerundet(Menge × Einzelpreis), Netto = Summe, Umsatzsteuer = gerundet(Netto × 19 %) oder 0, Gesamt = Netto + Umsatzsteuer.
- AK-3: Die nächste Nummer ist `<Jahr>-<höchste laufende Nummer des Jahres + 1>`, dreistellig; eine vergebene Nummer meldet „Diese Nummer ist schon vergeben.“
- AK-4: „Entwurf speichern“ legt das PDF unter `<kunde>/<projekt>/angebot-<nummer>-<zufall>.pdf` im Bucket `kundendokumente` ab und speichert das Angebot mit Status `entwurf`; es entsteht kein Eintrag in `dokumente`.
- AK-5: Bearbeiten ersetzt PDF und Daten eines Entwurfs und entfernt das alte PDF; bei freigegebenen Angeboten lehnt der Server ab.
- AK-6: „An Kunden freigeben“ legt einen Eintrag in `dokumente` an (Art `angebot`, Titel „Angebot <Nummer>“, Dateiname `Angebot-<Nummer>.pdf`) und setzt den Status `freigegeben`.
- AK-7: Die Karte zeigt Nummer, Titel, Betrag (deutsch, mit €) und Status; das ⋯-Menü bietet die Aktionen je nach Status wie in Verhalten 4.
- AK-8: Löschen entfernt Angebot, Dokument-Einträge und Dateien.
- AK-9: Nur Admins lesen und schreiben `angebote` (RLS); Kunden sehen nur, was als Dokument freigegeben ist.
- AK-10: „PDF ansehen“ führt über `/kunden/admin/angebote/<id>/pdf` und leitet auf einen 60 Sekunden gültigen Link um, nur für Admins.
- AK-11: Keine axe-Verstöße im Dialog und in der Karte bei 360, 768 und 1280 px.

## Barrierefreiheit

- Positionen als Gruppe je Position (`fieldset` mit `legend` „Position 1“), „Position entfernen“ benennt die Position.
- Nach „Position hinzufügen“ liegt der Fokus auf der Bezeichnung der neuen Position.
- Die Summen stehen in einem `output` und werden nicht bei jeder Eingabe angesagt.
- Status als Text, nicht nur als Farbe.

## Mobile

Im Dialog stehen die Felder einer Position untereinander, ab 640 px Menge, Einheit und Preis nebeneinander.

## Sprachen (DE/EN)

Die Verwaltung bleibt deutsch. Das PDF gibt es auf Deutsch und Englisch (`angebot-pdf.md`).

## SEO / GEO

Nicht betroffen, Verwaltung ist `noindex`.

## Daten

Migration `20261013200000_angebote.sql`:

- Tabelle `angebote`: `projekt_id` (cascade), `nummer` (eindeutig, `JJJJ-NNN`), `titel`, `sprache` (`de`/`en`), `datum`, `gueltig_bis`, `empfaenger`, `einleitung`, `positionen` (jsonb: Bezeichnung, Beschreibung, Menge, Einheit, Einzelpreis in Cent), `ust_satz` (0 oder 19), `pdf_pfad`, `status` (`entwurf`, `freigegeben`, `unterschrieben`), `dokument_id` und `unterschrift_id` (beide auf `dokumente`, `on delete set null`), `unterschrieben_am`.
- RLS: nur `admin_alles`.
- `dokumente.art` erlaubt zusätzlich `angebot` und `unterschrift`.

## Tests

- `tests/unit/kundenbereich-angebote.test.ts(x)`: Prüfung, Beträge, Nummer, Aktionen, Karte, Dialog (AK-1 bis AK-8, AK-10)
- `tests/unit/kundenbereich-angebote-db.test.ts`: Regeln mit echter Datenbank (AK-9)
- `tests/e2e/kundenbereich-admin.spec.ts`: Dialog ausfüllen, Entwurf, Freigeben, axe (AK-11)

## Offene Fragen

- Umsatzsteuer: Erik hat am 13.10.2026 entschieden, vorerst 19 % auszuweisen. Die Auswahl 0 % bleibt für die Kleinunternehmerregelung.
- Bankverbindung und Steuernummer reicht Erik später nach (13.10.2026); bis dahin stehen sie nicht im PDF.
- Mail an den Kunden bei Freigabe und an Erik bei Unterschrift: später.
