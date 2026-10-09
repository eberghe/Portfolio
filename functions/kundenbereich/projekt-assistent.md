# Kundenbereich: Projekt anlegen in Schritten

Status: Umgesetzt (Preview, nicht live)

## Zweck

Erik legt ein neues Projekt in einem geführten Ablauf an statt auf mehreren Seiten: Kunde, Projekt, Ansprechpartner, Ablauf, erster Termin, Prüfen (Issue #63, Wunsch Erik 2026-10-08). Das bisherige Formular „Projekt anlegen“ auf der Kundenseite wird durch einen Link auf den Assistenten ersetzt.

## Nutzer & Ziel

- **Erik:** hat nach dem Erstgespräch in ein paar Minuten ein vollständiges Projekt, das der Kunde sofort sehen kann, gern direkt aus einer Anfrage.

## Verhalten

1. `/kunden/admin/projekte/neu`, h1 „Neues Projekt“, Pfad Kundenbereich / Verwaltung / Neues Projekt. Optionale Parameter:
   - `?kunde=<id>` wählt einen bestehenden Kunden vor.
   - `?anfrage=<id>` füllt aus einer Anfrage vor: neuer Kunde mit der Website der Anfrage, Projekttitel aus den Leistungen, Beschreibung aus der Anfrage, neuer Ansprechpartner mit Name, E-Mail, Telefon und Sprache.
2. Fortschritt oben als Liste der sechs Schritte. Der aktuelle Schritt trägt `aria-current="step"`, erledigte Schritte haben einen Zusatz für Screenreader. Jeder Schritt hat die Überschrift „Schritt X von 6: <Name>“, die beim Wechsel den Fokus bekommt.
3. Die Schritte:
   1. **Kunde:** Auswahl „Bestehender Kunde“ (Liste) oder „Neuer Kunde“ (Name Pflicht, Website optional).
   2. **Projekt:**
      - Titel (Pflicht) und Status (Standard „Angebot“).
      - Phase sowie Beschreibung Deutsch und Englisch.
      - Website und Staging.
      - Auftragswert netto, Wahrscheinlichkeit (Standard 50) und voraussichtliche Abrechnung (`admin-dashboard.md`).
   3. **Ansprechpartner:**
      - Bei einem bestehenden Kunden dessen Ansprechpartner als Kontrollkästchen.
      - Dazu „Ansprechpartner hinzufügen“ mit Name, E-Mail, Rolle, Telefon und Sprache. Hinzugefügte stehen in einer Liste, jeweils mit „Entfernen: <Name>“.
      - Das Kontrollkästchen „Anmeldelink an neue Ansprechpartner schicken“ ist zunächst aus.
      - Mindestens ein Ansprechpartner ist Pflicht, damit der Kunde das Projekt sehen kann.
   4. **Ablauf:**
      - Vorbelegt mit Eriks Standard-Ablauf: Kennenlernen, Analyse & Angebot, Konzept, Design, Umsetzung, Test & Launch.
      - Je Schritt gibt es Titel Deutsch (Pflicht), Titel Englisch, Verantwortlich (Erik oder Kunde), „Nach oben: <Titel>“, „Nach unten: <Titel>“ und „Entfernen: <Titel>“.
      - Mit „Schritt hinzufügen“ kommt ein weiterer dazu.
      - Der erste Schritt startet als „aktiv“, alle anderen als „offen“. Ein leerer Ablauf ist erlaubt.
   5. **Termin:** das Kontrollkästchen „Ersten Termin eintragen“. Ist es an, gibt es die Felder Datum, Beginn, Ende (deutsche Zeit), Thema Deutsch und Englisch und Meet-Link.
   6. **Prüfen:** eine Zusammenfassung je Abschnitt mit „Bearbeiten: <Abschnitt>“, das zum jeweiligen Schritt springt. Darunter der Button „Projekt anlegen“.
4. „Weiter“ prüft den aktuellen Schritt mit denselben Regeln wie der Server. Fehler stehen am Feld, eine Fehlerliste steht über dem Schritt, und der Fokus springt auf die Liste. „Zurück“ prüft nicht. Eingaben bleiben beim Blättern erhalten: Der Assistent hält alle Eingaben im Zustand und zeigt nur den aktuellen Schritt.
5. „Projekt anlegen“ schickt alle Daten in einem Aufruf an den Server:
   - Der Server prüft erneut. Bei Fehlern springt der Assistent zum ersten Schritt mit Fehler.
   - Dann legt der Server alles in einer Datenbank-Transaktion an, über die Funktion `projekt_anlegen`: Kunde (falls neu), Projekt, Umsatz, neue Ansprechpartner, Zuordnung, Schritte und Termin. Schlägt ein Teil fehl, wird nichts angelegt.
   - Ist eine E-Mail schon vergeben, springt der Assistent zu Schritt 3 mit Fehler am Feld.
6. Danach schickt der Server, falls gewählt, die Anmeldelinks an die neuen Ansprechpartner und leitet zur Projektseite weiter. Die Meldung dort nennt das Ergebnis.

## Prüfungen (serverseitig)

- Wie in `admin.md` und `admin-dashboard.md`: `kundeDaten`, `projektDaten`, Umsatz, `ansprechpartnerDaten`, `terminDaten`.
- Schritte: Titel 1 bis 200 Zeichen, höchstens 30 Schritte.
- Gewählte bestehende Ansprechpartner müssen zum gewählten Kunden gehören; das prüft die Datenbankfunktion.
- E-Mails neuer Ansprechpartner dürfen sich innerhalb des Assistenten nicht wiederholen.

## Akzeptanzkriterien

- AK-1: Nur Admins (404 sonst, wie `admin.md` AK-1). Die Datenbankfunktion läuft mit Eriks Token, die Regeln gelten (`security invoker`).
- AK-2: Fortschritt und Überschriften wie in Verhalten 2; Fokus auf der neuen Überschrift.
- AK-3: „Weiter“ blockiert bei Fehlern. Die Fehler stehen am Feld und in der Liste, der Fokus springt auf die Liste. „Zurück“ verliert nichts.
- AK-4: Vorbelegung aus `?kunde` und `?anfrage`.
- AK-5: Der Standard-Ablauf ist vorbelegt. Schritte lassen sich hinzufügen, entfernen und verschieben, jeweils mit eindeutigen Button-Namen.
- AK-6: `assistentDaten` prüft alle Schritte und nennt für jeden Fehler den Schritt.
- AK-7: `projekt_anlegen` legt alles atomar an. Fehler (doppelte E-Mail, fremder Ansprechpartner) hinterlassen keine Daten.
- AK-8: Nach dem Anlegen gehen die Einladungen raus, falls gewählt, und es folgt die Weiterleitung zum Projekt.
- AK-9: Keine axe-Verstöße und kein horizontales Scrollen bei 360, 768 und 1280 px, hell und dunkel.

## Barrierefreiheit

- Das Muster ist wie beim Anfrage-Assistenten (`functions/kontakt/anfrage-assistent.md`): Fieldsets je Schritt, sichtbare Labels, Fehlerliste mit Links zu den Feldern.
- Die Buttons nennen das Ziel.
- Hinzufügen und Entfernen von Einträgen wird über `aria-live` angesagt.

## Mobile

- Einspaltig.
- „Zurück“ und „Weiter“ stehen nebeneinander in voller Breite.
- Die Schritt-Leiste zeigt bei 360 px nur Balken und den Namen des aktuellen Schritts.

## Sprachen (DE/EN)

Nur Deutsch. Inhalte, die Kunden sehen, haben Felder für Deutsch und Englisch.

## SEO / GEO

`noindex`.

## Daten

Migration `20261008200000_dashboard.sql`: Funktion `public.projekt_anlegen(daten jsonb) returns uuid`, `security invoker`, aufrufbar für `authenticated`. Sie gibt die Projekt-ID zurück.

## Tests

- `tests/unit/kundenbereich-assistent.test.tsx`: Prüfung, Vorbelegung, Ablauf-Liste, Aktion, Ansicht (AK-2 bis AK-6, AK-8)
- `tests/unit/kundenbereich-datenmodell.test.ts`: `projekt_anlegen` (AK-1, AK-7)
- `tests/e2e/kundenbereich-admin.spec.ts`: Assistent im Browser, axe (AK-9)

## Blinder Kritiker (2026-10-08)

Behoben (mit Test):

- 5: Nach „Bearbeiten: …“ führt „Zurück zur Prüfung“ direkt zu Schritt 6, nach Prüfung des Schritts.
- 7: Einträge im Ablauf heißen „Ablaufschritt“, Button „Ablaufschritt hinzufügen“.
- 8: Prüfen zeigt beschriftete Werte (Titel, Status, Auftragswert, Wahrscheinlichkeit, Abrechnung) und je Ablaufschritt „(Erik)“ oder „(Kunde)“.
- 9/20: Entfernen eines Ablaufschritts leert alte Fehler; der Fokus geht auf das nächste, beim letzten auf das vorige Titelfeld.
- 12: Gibt es Kunden, startet der Assistent mit „Bestehender Kunde“.
- 13: Pflichtfelder beim Hinzufügen heißen „(Pflicht beim Hinzufügen)“; das Kontrollkästchen „Anmeldelink …“ erklärt, dass nur neue Ansprechpartner den Link bekommen.
- 14: Der Fehler „mindestens ein Ansprechpartner“ führt zum ersten Kontrollkästchen; die Gruppe verweist per `aria-describedby` auf den Fehler.

Offen: #67 (leeres Datum, Zeitzonen-Hinweis, Seitentitel je Schritt, https ergänzen).
