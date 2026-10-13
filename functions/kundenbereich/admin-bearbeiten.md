# Verwaltung: Löschen, Ablauf sortieren, Aktionen in den Karten

Status: In Arbeit

## Zweck

Erik am 2026-10-13 nach dem Umbau auf die Sidebar (`admin-sidebar.md`): „Würde gerne Projekte und Kunden und Anfragen auch löschen können. Außerdem die Steps noch sehr blöd zu bearbeiten. Da fände ich es besser, wenn ich mit Drag and Drop die Reihenfolge ändern könnte und per Three-Dot-Menü die Aktionen ändern kann. Außerdem müssen z. B. im Kunde bearbeiten die Aktionen im Three-Dot-Menü der Card sein, z. B. Stammdaten bearbeiten in der Card und nicht im übergreifenden Kunden. Settings und Home bitte auf Deutsch.“

Löst die frühere Festlegung „Löschen von Kunden und Projekten bleibt in Supabase Studio“ ab. Ersetzt `window.confirm` durch einen eigenen Dialog (Issue #70).

## Nutzer & Ziel

- **Erik:** räumt Testeinträge und alte Anfragen selbst auf, ordnet den Ablauf eines Projekts per Ziehen und findet jede Aktion dort, wo die Daten stehen.

## Verhalten

1. **Löschen:** Projekte, Kunden und Anfragen haben im ⋯-Menü ihrer Tabellenzeile und im Kopf ihrer Detailseite den Eintrag „Löschen“ (rot, zuletzt).
2. **Rückfrage:** Jedes Löschen und Entfernen fragt in einem eigenen Dialog nach: Titel „<Art> löschen?“, ein Satz, was dabei verloren geht, im Fuß „Abbrechen“ und rechts außen der rote Button „<Art> löschen“. Der Fokus startet auf „Abbrechen“.
3. **Kunde löschen** löscht auch seine Projekte mit Ablauf, Terminen und Dokumenten, seine Ansprechpartner (deren Zugang endet) und das Logo, samt Dateien. Der Dialog nennt die Zahl der Projekte und Ansprechpartner.
4. **Nach dem Löschen** auf einer Detailseite geht es zur Liste, in einer Liste bleibt man dort. Ein Hinweis sagt „<Name> gelöscht.“.
5. **Ablauf sortieren:** Jeder Schritt hat links einen Griff. Mit Maus oder Finger zieht Erik den Schritt an eine neue Stelle; die Liste zeigt die neue Reihenfolge sofort, die Nummern zählen neu, gespeichert wird beim Loslassen. Hinweis „Reihenfolge gespeichert.“.
6. **Ohne Ziehen:** Im ⋯-Menü eines Schritts stehen „Nach oben“ und „Nach unten“ (am Rand nur der passende). So geht es per Tastatur und Screenreader.
7. **⋯-Menü eines Schritts:** Status (Offen, Läuft gerade, Erledigt) als Auswahl mit Haken, dann „Bearbeiten“, „Nach oben“, „Nach unten“, „Entfernen“ (rot).
8. **Aktionen in den Karten:** Eine Karte, deren Inhalt sich bearbeiten lässt, hat rechts oben ein eigenes ⋯-Menü. Kunde: Stammdaten („Stammdaten bearbeiten“), Logo („Logo hochladen“). Projekt: Projekt („Projekt bearbeiten“), Umsatz („Umsatz bearbeiten“), Ansprechpartner („Zuordnung ändern“). Im Kopf der Seite bleiben Status, Links („Neues Projekt“, „So sieht es der Kunde“) und „Löschen“.
9. **Deutsch:** Die Bereiche heißen Übersicht, Projekte, Kunden, Anfragen und Einstellungen. Die Einstellungen liegen unter `/kunden/admin/einstellungen`.

## Akzeptanzkriterien

- AK-1: Die ⋯-Menüs der Zeilen in Projekte, Kunden und Anfragen und der Kopf von Projekt-, Kunden- und Anfrageseite enden mit „Löschen“ in Fehlerfarbe.
- AK-2: „Löschen“ öffnet einen Dialog „Projekt löschen?“ (bzw. Kunde, Anfrage) mit Erklärung; im Fuß „Abbrechen“ vor dem roten „Projekt löschen“, Fokus auf „Abbrechen“. Abbrechen löscht nichts und gibt den Fokus an den ⋯-Button zurück.
- AK-3: Bestätigen ruft die Löschaktion mit der ID auf. Auf der Detailseite folgt die Weiterleitung zur Liste, der Hinweis nennt den Namen.
- AK-4: Der Dialog zum Kunden nennt die Zahl seiner Projekte und Ansprechpartner.
- AK-5: `projektLoeschen`, `kundeLoeschen` und `anfrageLoeschen` löschen nur mit gültiger ID und Admin-Rechten. Projekt und Kunde entfernen auch ihre Dateien (Dokumente, Logo) aus dem Speicher.
- AK-6: Entfernen von Schritt, Termin, Dokument und Ansprechpartner nutzt denselben Dialog; `window.confirm` wird nicht mehr aufgerufen.
- AK-7: Jeder Ablaufschritt hat einen Griff „Ziehen zum Sortieren: <Titel>“. Ziehen per Zeiger ordnet die Liste neu und ruft beim Loslassen `schritteSortieren` mit allen IDs in neuer Reihenfolge auf.
- AK-8: Das ⋯-Menü eines Schritts hat Status als `menuitemradio`, „Bearbeiten“, „Nach oben“ (nicht beim ersten), „Nach unten“ (nicht beim letzten) und „Entfernen“. „Nach oben/unten“ speichert die neue Reihenfolge, die Statuswahl ruft `schrittStatus` auf.
- AK-9: `schritteSortieren` nimmt nur IDs, die genau die Schritte des Projekts sind, und setzt die Reihenfolge 1 bis n. `schrittStatus` prüft den Wert.
- AK-10: Kunde: Karten „Stammdaten“ und „Logo“ haben ein ⋯-Menü mit ihrer Aktion; das Kopf-Menü enthält diese Aktionen nicht mehr. Projekt: dasselbe für „Projekt“, „Umsatz“ und „Ansprechpartner“.
- AK-11: Die Navigation zeigt Übersicht, Projekte, Kunden, Anfragen, Einstellungen; die Einstellungen-Seite hat die h1 „Einstellungen“, die Übersicht die h1 „Übersicht“.
- AK-12: Keine axe-Verstöße und kein waagerechtes Scrollen auf allen Verwaltungsseiten bei 360, 768 und 1280 px, hell und dunkel; Ziehen und Löschen funktionieren im Browser.

## Barrierefreiheit

- Der Griff ist ein Button mit Namen; Ziehen ist eine Abkürzung, „Nach oben/unten“ im Menü die gleichwertige Alternative (WCAG 2.5.7).
- Rückfrage-Dialog: `alertdialog`-Verhalten über den modalen Dialog, Fokus auf der sicheren Wahl.

## Mobile

- Ziehen per Finger über Pointer Events; der Griff ist 44 px groß und sperrt das Scrollen nur während des Ziehens (`touch-action: none` am Griff).

## Sprachen (DE/EN)

Nur Deutsch.

## SEO / GEO

`noindex`.

## Daten

- Migration `20261013100000_anfragen_loeschen.sql`: Admins dürfen Anfragen löschen (bisher nur lesen und Status ändern).
- Kunden und Projekte löschen über die vorhandenen `on delete cascade`; die Dateien entfernt die Aktion vorher aus Storage. Konten von Ansprechpartnern in Supabase Auth bleiben bestehen, verlieren aber jede Zuordnung.

## Tests

- `tests/unit/kundenbereich-admin-bearbeiten.test.tsx`: AK-1 bis AK-11
- `tests/e2e/kundenbereich-admin.spec.ts`: Ziehen, Löschen im Browser, axe (AK-12)

## Offene Fragen

- Keine.

## Blinder Kritiker (2026-10-13)

Behoben (mit Test in `tests/unit/kundenbereich-admin-bearbeiten.test.tsx`):

- 5: Nach dem Löschen geht der Fokus auf die Überschrift der neuen Seite bzw. der Karte, nicht ins Leere.
- 6: Die Rückfrage ist über `aria-describedby` mit ihrem Text verbunden, er wird beim Öffnen mit angesagt.
- 7: Rückfragen sind linksbündig, auch aus Tabellenzeilen; alle Namen stehen in „…“.
- 8: Verschieben sagt die neue Position an, z. B. „Launch jetzt an Position 2 von 3.“
- 9: „Nach oben“ und „Nach unten“ im Menü geben den Fokus ans ⋯-Menü des Schritts zurück.

Kein Fehler der Seite: 1 bis 4 und 10 kommen vom nachgebildeten Supabase der Tests, das Status, Reihenfolge, Projekt- und Anfragelöschen nicht speichert und für „Neues Logo“ keine UUID hat.

Offen, bewusst so gelassen:

- 11: Die Karten-Menüs haben oft nur einen Eintrag. Erik wollte die Aktionen ausdrücklich im ⋯-Menü der Karte.
- 12 bis 18 (niedrig): Tippen eines Buchstabens im Menü, „webflow“ klein geschrieben in Anfragen, Seitentitel ohne Namen, zwei Tabstopps je Schritt, „Einstellungen“ knapp am Rand der unteren Leiste bei 360 px. Sammeln für eine spätere Runde.

## Fehler 2026-10-13: Anfragen ließen sich nicht löschen

Erik meldete, dass „Löschen“ bei Anfragen nicht klappt. Ursache: Die Tabelle `anfragen` vergibt Rechte einzeln (nur `select` und `update (status)`), die Migration hatte nur die Policy angelegt, nicht das Recht `delete`. Behoben mit `grant delete` in `20261013100000_anfragen_loeschen.sql` (auf Supabase ausgeführt), Test mit echter Datenbank in `tests/unit/kundenbereich-dashboard-db.test.ts`.
