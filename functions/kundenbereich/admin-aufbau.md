# Verwaltung übersichtlich: Bereiche, Dialoge, Hilfe

Status: Live seit 2026-10-12; Überarbeitung Dialoge und Bereichsleiste (2026-10-13) in Arbeit

## Zweck

Erik am 2026-10-09: Die Verwaltung ist unübersichtlich. Alles sieht gleich aus, es gibt viel zu scrollen, und überall stehen Formulare wie „Kunde anlegen“. Das Dashboard soll nur die wichtigsten Informationen zeigen. Formulare liegen hinter Buttons in Dialogen, Erklärungen hinter Fragezeichen-Icons in den Ecken der Karten, der Umsatz als Diagramm. Anfragen bekommen eine eigene Seite.

## Nutzer & Ziel

- **Erik:** sieht auf einen Blick, was heute wichtig ist, und öffnet Details nur bei Bedarf.

## Verhalten

1. **Bereiche** (seit 2026-10-13 durch die Sidebar ersetzt, siehe `admin-sidebar.md`): Unter dem Pfad steht auf jeder Verwaltungsseite eine Leiste mit den Bereichen Übersicht (`/kunden/admin`), Projekte (`/kunden/admin/projekte`), Kunden (`/kunden/admin/kunden`) und Anfragen (`/kunden/admin/anfragen`). Der aktuelle Bereich ist markiert.
2. **Übersicht (Dashboard)** zeigt nur das Wichtigste:
   - Vier Kennzahlen: aktive Projekte, Termine in 7 Tagen, neue Anfragen und Umsatz im laufenden Jahr. Jede Kennzahl hat oben rechts ein Fragezeichen mit einer Erklärung.
   - Die Umsatzprognose als Säulendiagramm mit Fragezeichen. Die Tabelle mit denselben Werten ist eingeklappt („Als Tabelle“).
   - Ein zweites Diagramm „Auftragswert nach Status“ mit waagerechten Balken für Angebot, In Arbeit, Abstimmung, Pausiert und Abgeschlossen, jeweils mit Betrag und Anzahl.
   - Die nächsten 3 Termine.
   - Die neuesten 3 neuen Anfragen (Status „Neu“, wie die Kennzahl) mit Name, Datum und Status, verlinkt auf die Anfrage, dazu „Alle Anfragen“.
   - Bis zu 5 laufende Projekte mit Titel, Kunde und Status, dazu „Alle Projekte“.
   - Oben rechts stehen die Buttons „Kunde anlegen“ (Dialog) und „Neues Projekt“ (Assistent).
3. **Projekte** (`/kunden/admin/projekte`): alle Projekte nach Status mit Kunde, Auftragswert und nächstem Schritt, abgeschlossene zuletzt. Seit `admin-sidebar.md` als Tabelle statt eingeklappter Gruppen.
4. **Kunden** (`/kunden/admin/kunden`): alle Kunden mit Zahl der Projekte und Ansprechpartner sowie dem Stand der Logo-Freigabe. „Kunde anlegen“ öffnet einen Dialog.
5. **Anfragen** (`/kunden/admin/anfragen`): alle Anfragen als Tabelle mit Name, Datum, Leistungen und Status, neueste zuerst (seit `admin-sidebar.md`, vorher erledigte eingeklappt). Jede Anfrage führt auf ihre Seite `/kunden/admin/anfragen/<id>`. Dort stehen alle Angaben beschriftet, der Status im ⋯-Menü und „Projekt anlegen“.
6. **Kunde und Projekt:** Die Daten stehen als Übersicht, die Formulare hinter Buttons in Dialogen:
   - Kunde: „Stammdaten bearbeiten“, „Logo hochladen“, „Ansprechpartner hinzufügen“.
   - Projekt: „Projekt bearbeiten“, „Umsatz bearbeiten“, „Zuordnung ändern“ (Ansprechpartner), „Ablaufschritt hinzufügen“, „Bearbeiten: <Schritt>“, „Termin hinzufügen“, „Dokument hochladen“.
   - Ab 1024 px stehen Stammdaten, Umsatz und Ansprechpartner rechts in einer schmalen Spalte, Ablauf, Termine und Dokumente links.
7. **Dialoge:** Ein Button öffnet einen modalen Dialog mit Überschrift, Formular, „Schließen“ oben und dem Fuß aus Verhalten 9. Escape, „Abbrechen“ oder das X schließen ihn; ein Klick daneben nicht mehr, damit Eingaben nicht verloren gehen (Kritiker Dialoge 4). Nach erfolgreichem Speichern schließt er sich, die Seite zeigt die neuen Daten, und neben dem Button steht kurz „Gespeichert.“. Bei Fehlern bleibt er offen, die Fehler stehen am Feld.
8. **Hilfe:** Das Fragezeichen ist ein Button „Erklärung: <Titel>“. Ein Klick zeigt die Erklärung in einer kleinen Blase, ein zweiter Klick, Escape oder ein Klick daneben schließt sie.

9. **Dialog-Fuß (Erik, 2026-10-13):** Jeder Dialog mit Formular hat unten eine feste Leiste. Rechts außen steht die Hauptaktion (z. B. „Projekt speichern“), direkt links daneben „Abbrechen“. Die Leiste bleibt sichtbar, nur der Inhalt darüber scrollt. „Abbrechen“ schließt ohne zu speichern. Eine zerstörende Aktion wie „Entfernen“ steht links außen in derselben Leiste.
10. **Bereichsleiste ruhig:** Die vier Bereiche passen ab 320 px ohne Scrollen in eine Zeile (auf dem Handy gleich breit). Ein Klick markiert den Bereich sofort und zeigt einen Ladezustand, statt bis zum fertigen Laden der neuen Seite stehen zu bleiben.
11. **Weniger Knöpfe in Listen:** Aktionen je Zeile (Schritt bearbeiten, Termin entfernen, Dokument herunterladen oder entfernen) sind kleine Icon-Buttons mit Tooltip statt umrandeter Text-Buttons.
12. **Kopf auf dem Handy:** Die Buttons neben dem Seitentitel haben unter 640 px weniger Innenabstand, damit zwei Buttons ab 360 px in eine Zeile passen.

## Akzeptanzkriterien

- AK-1: Die Bereichsleiste ist ein `nav` „Bereiche der Verwaltung“. Der aktuelle Bereich hat `aria-current="page"`.
- AK-2: Das Dashboard zeigt höchstens 3 Termine, 3 Anfragen und 5 Projekte und kein Formular. „Kunde anlegen“ ist ein Button, der einen Dialog öffnet.
- AK-3: Kennzahlen und Umsatzprognose haben je einen Hilfe-Button mit eindeutigem Namen und `aria-expanded`. Die Erklärung erscheint und wird angesagt.
- AK-4: „Auftragswert nach Status“ zeigt je Status Betrag und Anzahl als Text, die Balken sind Dekoration.
- AK-5: Die Anfragen-Seite listet alle Anfragen, die Detailseite zeigt alle Angaben beschriftet, den Status im ⋯-Menü und „Projekt anlegen“. Unbekannte IDs ergeben 404.
- AK-6: Projekte- und Kunden-Seite listen alle Einträge. Die Kunden-Seite hat „Kunde anlegen“ als Dialog.
- AK-7: Auf Kunden- und Projektseite gibt es kein offenes Formular. Jedes Formular öffnet sich über einen Button mit eindeutigem Namen in einem Dialog.
- AK-8: Ein Dialog hat `aria-modal`, eine Überschrift als Namen und „Schließen“. Nach Erfolg schließt er sich, der Fokus geht zurück auf den Button, und „Gespeichert.“ wird angesagt.
- AK-9: Keine axe-Verstöße und kein horizontales Scrollen bei 360, 768 und 1280 px, hell und dunkel, auch mit offenem Dialog.
- AK-10: Jeder Dialog mit Formular hat einen Fuß (`[data-dialog-fuss]`) außerhalb des Scrollbereichs. Sein letzter Button ist die Hauptaktion (Typ `submit`, gehört zum Formular), direkt davor steht „Abbrechen“. „Abbrechen“ schließt den Dialog ohne Speichern, der Fokus geht zurück auf den Auslöser.
- AK-11: ~~Im Dialog „Ablaufschritt bearbeiten“ steht „Entfernen“ im Fuß links außen.~~ Ersetzt durch admin-bearbeiten.md AK-8: Der Dialog hat nur „Abbrechen“ und „Schritt speichern“, „Entfernen“ steht im ⋯-Menü des Schritts.
- AK-12: Bei 360 px sind alle vier Bereiche vollständig sichtbar; die Bereichsleiste scrollt nicht.
- AK-13: Unter `/kunden/admin` gibt es einen Ladezustand (`loading.tsx`) mit Bereichsleiste; der Bereich ergibt sich dort aus der Adresse. Die Admin-Prüfung läuft vorher im Layout, Nicht-Admins bekommen weiter Status 404.
- AK-14: Zeilenaktionen bei Ablauf, Terminen und Dokumenten sind Icon-Buttons mit eindeutigem Namen und gleichlautendem Tooltip (`title`), mindestens 44 × 44 px.
- AK-15: Bei 360 px stehen die Kopf-Buttons des Dashboards („Kunde anlegen“, „Neues Projekt“) in einer Zeile.
- AK-16: Scheitert das Speichern, weil der Server nicht erreichbar ist, bleibt der Dialog offen, die Eingaben bleiben stehen, und im Dialog steht „Das hat nicht geklappt. Bitte prüf die Verbindung und versuch es noch einmal.“. Die Seite stürzt nicht ab. Gilt auch für „Entfernen“.
- AK-17: „Dokument hochladen“ markiert einen leeren Titel und eine fehlende Datei gemeinsam, jeweils mit Text am Feld.
- AK-18: Ein Klick neben den Dialog schließt ihn nicht.
- AK-19: „Entfernen“ ist als zerstörende Aktion erkennbar (Fehlerfarbe), im ⋯-Menü und in der Rückfrage (admin-bearbeiten.md AK-2), nicht wie „Abbrechen“.
- AK-20: Bei 360 px stehen die Icon-Buttons von Ablauf und Terminen rechts neben dem Titel, nicht darunter.

## Barrierefreiheit

- Native `<dialog>` mit `showModal()`, Fokus auf dem ersten Feld, Rückgabe an den Auslöser.
- Hilfe als Toggletip: Der Button nennt den Titel, die Erklärung steht in einem `role="status"`.
- Diagramme sind `aria-hidden`; die Werte stehen als Text oder in der Tabelle.

## Mobile

- Bereichsleiste ohne Scrollen, vier gleich breite Ziele, 44 px hoch.
- Dialog-Fuß mit Buttons, die sich die Breite teilen.
- Dialoge bis 360 px voll nutzbar, mit Scrollbereich im Dialog.

## Sprachen (DE/EN)

Nur Deutsch.

## SEO / GEO

`noindex`.

## Daten

Keine neuen Tabellen. Anfragen lädt `anfrage(api, id)`, Projekte und Kunden die bestehenden Listen.

## Tests

- `tests/unit/kundenbereich-admin-aufbau.test.tsx`: Bereiche, Dashboard, Hilfe, Dialoge, neue Seiten (AK-1 bis AK-8, AK-10, AK-11, AK-13, AK-14)
- `tests/e2e/kundenbereich-admin.spec.ts`: Dialoge im Browser, axe (AK-8, AK-9, AK-10, AK-12, AK-15)

## Befunde Blinder Kritiker (2026-10-09)

1. Hilfe-Blase war am Button ausgerichtet und wurde bei 320 px links abgeschnitten. Jetzt an der Karte ausgerichtet.
2. Formulare ließen sich während des Sendens erneut absenden. Jetzt gesperrt, solange gesendet wird.
3. Nach „Entfernen“ verschwand der Auslöser mit Fokus und Meldung. Jetzt Fokus auf die Kartenüberschrift, Meldung in einer Live-Region der Seite.
4. Live-Regionen mit `empty:hidden` wurden unzuverlässig angesagt. Jetzt bleiben sie im Baum.
5. Dialoginhalt wurde bei umbrechendem Titel unten abgeschnitten. Jetzt Kopf fest, Inhalt scrollt.
6. Dialog war im Dunkelmodus kaum abgesetzt. Jetzt abgedunkelter Hintergrund und eigene Fläche.
7. Bereichsleiste schnitt den Fokusrahmen ab. Jetzt Innenabstand und Rahmen nach innen.
8. Offene Hilfe-Blase blieb beim Weitertabben stehen. Jetzt schließt sie, wenn der Fokus geht, und auf Escape überall.
9. Kennzahlen waren bei 320–360 px zu schmal. Jetzt eine Spalte unter 420 px.
10. „Neue Anfragen“ bedeutete in Kachel und Karte Verschiedenes. Jetzt beide nur Status „Neu“.
11. Pfad war uneinheitlich und führte über „Kundenbereich“ im Kreis. Jetzt beginnt er immer mit „Verwaltung“, auf der Übersicht gibt es keinen Pfad.
12. Klick neben den Dialog schloss ihn auch beim Markieren von Text. Jetzt nur, wenn Drücken und Loslassen auf der Fläche liegen.

## Befunde Blinder Kritiker Dialoge (2026-10-13)

1. Schritt speichern meldete nur „Dieser Eintrag ist ungültig.“. Ursache: die Testdaten hatten keine UUIDs als Schritt-IDs; in echten Daten tritt das nicht auf. Testdaten haben jetzt UUIDs.
2. Ein Netzfehler beim Speichern ersetzte die Seite durch die Fehlerseite. Jetzt Meldung im Dialog (AK-16).
3. „Dokument hochladen“ markierte den leeren Titel nicht. Jetzt beide Felder (AK-17).
4. Klick neben den Dialog verwarf Eingaben. Jetzt schließt nur noch X, „Abbrechen“ oder Escape (AK-18). Offen: Rückfrage bei geänderten Feldern vor „Abbrechen“/Escape.
5. „Entfernen“ fragt mit dem Browser-Dialog nach und sah aus wie „Abbrechen“. Jetzt in Fehlerfarbe (AK-19). Erledigt mit admin-bearbeiten.md: eigene Rückfrage statt Browser-Dialog.
6. Nach dem Bereichswechsel liegt der Fokus auf der Seite, Next sagt den Titel an. Titel der Übersicht jetzt einheitlich „Übersicht | Verwaltung“. Offen: Fokus auf die Überschrift.
7. Der Fokusrahmen überdeckte den roten Rand eines fehlerhaften Felds. Jetzt ist der Fokusrahmen dort rot.
8. Lange Button-Texte brechen im Fuß bei 360 px in zwei Zeilen um. Offen: kürzere Texte auf dem Handy.
9. Icon-Buttons rutschten bei 360 px unter jeden Eintrag. Jetzt rechts daneben (AK-20).
