# Verwaltung übersichtlich: Bereiche, Dialoge, Hilfe

Status: Umgesetzt (Preview, nicht live)

## Zweck

Erik am 2026-10-09: Die Verwaltung ist unübersichtlich. Alles sieht gleich aus, es gibt viel zu scrollen, und überall stehen Formulare wie „Kunde anlegen“. Das Dashboard soll nur die wichtigsten Informationen zeigen. Formulare liegen hinter Buttons in Dialogen, Erklärungen hinter Fragezeichen-Icons in den Ecken der Karten, der Umsatz als Diagramm. Anfragen bekommen eine eigene Seite.

## Nutzer & Ziel

- **Erik:** sieht auf einen Blick, was heute wichtig ist, und öffnet Details nur bei Bedarf.

## Verhalten

1. **Bereiche:** Unter dem Pfad steht auf jeder Verwaltungsseite eine Leiste mit den Bereichen Übersicht (`/kunden/admin`), Projekte (`/kunden/admin/projekte`), Kunden (`/kunden/admin/kunden`) und Anfragen (`/kunden/admin/anfragen`). Der aktuelle Bereich ist markiert.
2. **Übersicht (Dashboard)** zeigt nur das Wichtigste:
   - Vier Kennzahlen: aktive Projekte, Termine in 7 Tagen, neue Anfragen und Umsatz im laufenden Jahr. Jede Kennzahl hat oben rechts ein Fragezeichen mit einer Erklärung.
   - Die Umsatzprognose als Säulendiagramm mit Fragezeichen. Die Tabelle mit denselben Werten ist eingeklappt („Als Tabelle“).
   - Ein zweites Diagramm „Auftragswert nach Status“ mit waagerechten Balken für Angebot, In Arbeit, Abstimmung, Pausiert und Abgeschlossen, jeweils mit Betrag und Anzahl.
   - Die nächsten 3 Termine.
   - Die neuesten 3 offenen Anfragen mit Name, Datum und Status, verlinkt auf die Anfrage, dazu „Alle Anfragen“.
   - Bis zu 5 laufende Projekte mit Titel, Kunde und Status, dazu „Alle Projekte“.
   - Oben rechts stehen die Buttons „Kunde anlegen“ (Dialog) und „Neues Projekt“ (Assistent).
3. **Projekte** (`/kunden/admin/projekte`): alle Projekte nach Status mit Kunde, Auftragswert und nächstem Schritt. Abgeschlossene sind eingeklappt.
4. **Kunden** (`/kunden/admin/kunden`): alle Kunden mit Zahl der Projekte und Ansprechpartner sowie dem Stand der Logo-Freigabe. „Kunde anlegen“ öffnet einen Dialog.
5. **Anfragen** (`/kunden/admin/anfragen`): offene Anfragen als Liste mit Name, Datum, Status und Leistungen; erledigte sind eingeklappt. Jede Anfrage führt auf ihre Seite `/kunden/admin/anfragen/<id>`. Dort stehen alle Angaben beschriftet, das Status-Formular und „Projekt anlegen“.
6. **Kunde und Projekt:** Die Daten stehen als Übersicht, die Formulare hinter Buttons in Dialogen:
   - Kunde: „Stammdaten bearbeiten“, „Logo hochladen“, „Ansprechpartner hinzufügen“.
   - Projekt: „Projekt bearbeiten“, „Umsatz bearbeiten“, „Zuordnung ändern“ (Ansprechpartner), „Ablaufschritt hinzufügen“, „Bearbeiten: <Schritt>“, „Termin hinzufügen“, „Dokument hochladen“.
   - Ab 1024 px stehen Stammdaten, Umsatz und Ansprechpartner rechts in einer schmalen Spalte, Ablauf, Termine und Dokumente links.
7. **Dialoge:** Ein Button öffnet einen modalen Dialog mit Überschrift, Formular und „Schließen“. Escape oder der Klick daneben schließt ihn. Nach erfolgreichem Speichern schließt er sich, die Seite zeigt die neuen Daten, und neben dem Button steht kurz „Gespeichert.“. Bei Fehlern bleibt er offen, die Fehler stehen am Feld.
8. **Hilfe:** Das Fragezeichen ist ein Button „Erklärung: <Titel>“. Ein Klick zeigt die Erklärung in einer kleinen Blase, ein zweiter Klick, Escape oder ein Klick daneben schließt sie.

## Akzeptanzkriterien

- AK-1: Die Bereichsleiste ist ein `nav` „Bereiche der Verwaltung“. Der aktuelle Bereich hat `aria-current="page"`.
- AK-2: Das Dashboard zeigt höchstens 3 Termine, 3 Anfragen und 5 Projekte und kein Formular. „Kunde anlegen“ ist ein Button, der einen Dialog öffnet.
- AK-3: Kennzahlen und Umsatzprognose haben je einen Hilfe-Button mit eindeutigem Namen und `aria-expanded`. Die Erklärung erscheint und wird angesagt.
- AK-4: „Auftragswert nach Status“ zeigt je Status Betrag und Anzahl als Text, die Balken sind Dekoration.
- AK-5: Die Anfragen-Seite listet alle Anfragen, die Detailseite zeigt alle Angaben beschriftet, das Status-Formular und „Projekt anlegen“. Unbekannte IDs ergeben 404.
- AK-6: Projekte- und Kunden-Seite listen alle Einträge. Die Kunden-Seite hat „Kunde anlegen“ als Dialog.
- AK-7: Auf Kunden- und Projektseite gibt es kein offenes Formular. Jedes Formular öffnet sich über einen Button mit eindeutigem Namen in einem Dialog.
- AK-8: Ein Dialog hat `aria-modal`, eine Überschrift als Namen und „Schließen“. Nach Erfolg schließt er sich, der Fokus geht zurück auf den Button, und „Gespeichert.“ wird angesagt.
- AK-9: Keine axe-Verstöße und kein horizontales Scrollen bei 360, 768 und 1280 px, hell und dunkel, auch mit offenem Dialog.

## Barrierefreiheit

- Native `<dialog>` mit `showModal()`, Fokus auf dem ersten Feld, Rückgabe an den Auslöser.
- Hilfe als Toggletip: Der Button nennt den Titel, die Erklärung steht in einem `role="status"`.
- Diagramme sind `aria-hidden`; die Werte stehen als Text oder in der Tabelle.

## Mobile

- Bereichsleiste waagerecht scrollbar, 44 px hohe Ziele.
- Dialoge bis 360 px voll nutzbar, mit Scrollbereich im Dialog.

## Sprachen (DE/EN)

Nur Deutsch.

## SEO / GEO

`noindex`.

## Daten

Keine neuen Tabellen. Anfragen lädt `anfrage(api, id)`, Projekte und Kunden die bestehenden Listen.

## Tests

- `tests/unit/kundenbereich-admin-aufbau.test.tsx`: Bereiche, Dashboard, Hilfe, Dialoge, neue Seiten (AK-1 bis AK-8)
- `tests/e2e/kundenbereich-admin.spec.ts`: Dialoge im Browser, axe (AK-8, AK-9)
