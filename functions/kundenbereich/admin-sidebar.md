# Verwaltung als Dashboard mit Sidebar

Status: In Arbeit (PR #69, nicht live)

## Zweck

Erik am 2026-10-13: „Bau daraus eher eine Art Dashboard mit einer Sidebar links. Nutze den ganzen Platz, nutze auch Three-Dot-Menüs, um z. B. Projekt- oder Kundenstatus zu ändern und Buttons zu verstecken. In der Sidebar Home, Projekte, Kunden, Anfragen, Settings.“ Die Verwaltung soll sich wie ein Werkzeug anfühlen, nicht wie eine Website mit Formularen.

Löst die Bereichsleiste aus `admin-aufbau.md` (Verhalten 1 und 10, AK-1, AK-12, AK-13) ab. Dialoge, Hilfe und Dashboard-Inhalte bleiben wie dort beschrieben.

## Nutzer & Ziel

- **Erik:** wechselt mit einem Klick zwischen den Bereichen, sieht Listen als Tabellen auf voller Breite und ändert einen Status, ohne eine Seite zu öffnen.

## Verhalten

1. **Rahmen:** Alle Seiten unter `/kunden/admin` haben statt der Kopfleiste „Zur Website“ eine Sidebar links. Oben das Logo, darunter die Navigation „Verwaltung“ mit Home (`/kunden/admin`), Projekte, Kunden, Anfragen und Settings (`/kunden/admin/settings`), jeweils mit Icon. Unten „Zur Website“ und der Button „Seitenleiste“ zum Einklappen.
2. **Einklappen:** Die Sidebar lässt sich auf Icons einklappen. Die Wahl bleibt beim nächsten Besuch erhalten (Cookie `kb_sidebar`).
3. **Anfragen-Zähler:** Neben „Anfragen“ steht die Zahl der Anfragen mit Status „Neu“, wenn es welche gibt.
4. **Handy und Tablet (unter 1024 px):** Keine Sidebar. Oben eine schmale Leiste mit Logo, unten fest eine Leiste mit den fünf Bereichen (Icon und Text).
5. **Ganze Breite:** Der Inhalt nutzt die ganze Breite neben der Sidebar, ohne feste Höchstbreite.
6. **Listen als Tabellen:** Projekte, Kunden und Anfragen stehen ab 768 px in Tabellen mit Spaltenköpfen, darunter als Karten. Jede Zeile endet mit einem ⋯-Menü.
7. **⋯-Menüs:** Ein Button „Aktionen: <Name>“ öffnet ein Menü. Statuswerte stehen dort als Auswahl mit Haken. Ein Klick speichert sofort, die Liste zeigt den neuen Status und ein Hinweis mit Name und neuem Status wird angesagt (AK-13). Weitere Einträge: Öffnen, Bearbeiten, Entfernen (rot), Herunterladen.
8. **Kundenstatus:** Kunden haben einen Status: Interessent, Aktiv, Pausiert oder Ehemalig. Neue Kunden sind „Aktiv“. Er steht in der Kundentabelle und auf der Kundenseite und lässt sich im ⋯-Menü ändern.
9. **Detailseiten:** Im Kopf von Kunde und Projekt steht neben dem Status nur ein ⋯-Menü mit allen Bearbeiten-Aktionen (Status, Bearbeiten, Umsatz, Zuordnung). In den Karten fügt ein „+“-Icon-Button hinzu, jede Zeile hat ein ⋯-Menü statt einzelner Buttons.
10. **Settings:** Konto (angemeldet als E-Mail), Darstellung (Hell, Dunkel, wie das System) und Abmelden.

## Akzeptanzkriterien

- AK-1: Die Navigation „Verwaltung“ hat fünf Links in dieser Reihenfolge: Home, Projekte, Kunden, Anfragen, Settings. Der aktuelle Bereich hat `aria-current="page"`, auf Unterseiten `aria-current="true"`.
- AK-2: Ab 1024 px steht die Sidebar links über die volle Höhe, der Inhalt rechts daneben. Auf Verwaltungsseiten gibt es keine Kopfleiste „Zur Website“ mehr, der Link steht in der Sidebar.
- AK-3: „Seitenleiste“ ist ein Button mit `aria-expanded`. Eingeklappt ist die Sidebar höchstens 80 px breit, die Links behalten ihre Namen. Nach dem Neuladen bleibt sie eingeklappt.
- AK-4: Unter 1024 px ist die untere Leiste mit fünf Links sichtbar, jeder mindestens 44 px hoch, ohne waagerechtes Scrollen bei 360 px. Der Inhalt wird von ihr nicht verdeckt.
- AK-5: Gibt es neue Anfragen, heißt der Link „Anfragen, 1 neu“ und zeigt die Zahl.
- AK-6: Projekte, Kunden und Anfragen sind ab 768 px Tabellen mit Spaltenköpfen. Jede Zeile hat einen Button „Aktionen: <Name>“.
- AK-7: Der ⋯-Button hat `aria-haspopup="menu"` und `aria-expanded`. Das Menü hat `role="menu"`, Pfeiltasten bewegen den Fokus, Escape schließt und gibt den Fokus zurück. Status-Einträge sind `menuitemradio` mit `aria-checked`. Eine Auswahl speichert und sagt das Ergebnis an (Wortlaut AK-13).
- AK-8: Kunden haben einen der vier Status, Standard „Aktiv“. Die Kundentabelle zeigt ihn, das ⋯-Menü ändert ihn.
- AK-9: Auf Kunden- und Projektseite steht im Kopf außer dem Status nur das ⋯-Menü „Aktionen: <Name>“. Es öffnet die Dialoge aus `admin-aufbau.md`; nach dem Schließen geht der Fokus zurück auf den ⋯-Button.
- AK-10: Die Settings-Seite zeigt die E-Mail des Kontos, eine Auswahl Hell/Dunkel/System und „Abmelden“.
- AK-11: Keine axe-Verstöße und kein waagerechtes Scrollen bei 360, 768 und 1280 px, hell und dunkel, auf allen Verwaltungsseiten.

### Befunde Blinder Kritiker (2026-10-13)

- AK-12: Ein Status-Menü öffnet mit dem Fokus auf dem gewählten Status. Die Status von Projekten stehen in derselben Reihenfolge wie im Dashboard (Angebot, In Arbeit, In Abstimmung, Pausiert, Abgeschlossen).
- AK-13: Nach einer Statusänderung nennt der Hinweis Name und neuen Status, z. B. „Relaunch: Status ist jetzt „Pausiert“.“ Klappt es nicht, steht in einer eigenen Meldung mit `role="alert"` „Status konnte nicht geändert werden.“ und der Grund.
- AK-14: Der Einklapp-Button heißt „Seitenleiste“ und zeigt den Zustand nur über `aria-expanded` (Tooltip „Seitenleiste einklappen“ bzw. „Seitenleiste ausklappen“). Eingeklappt bleibt die Zahl neuer Anfragen am Icon sichtbar.
- AK-15: Unter 1024 px kommt „Zur Website“ in der Tab-Reihenfolge direkt nach dem Logo, vor der unteren Leiste. Die Zahl neuer Anfragen sitzt am Icon.
- AK-16: Eine unbekannte Kunden-, Projekt- oder Anfrage-ID zeigt im Rahmen der Verwaltung „Nicht gefunden“ mit Link zur Übersicht, nicht die 404-Seite der Website.
- AK-17: Die Website einer Anfrage ist ein Link (neuer Tab). Im Projekt-Assistenten haben alle Schritte im Fortschritt einen Namen für Screenreader, auch auf dem Handy.

## Barrierefreiheit

- Sidebar und untere Leiste sind dieselbe `nav` „Verwaltung“ in zwei Darstellungen; es ist immer nur eine sichtbar.
- Menü nach dem WAI-ARIA-Muster „Menu Button“: Fokus auf den ersten Eintrag beim Öffnen, Pfeiltasten, Pos1/Ende, Escape, Tab schließt.
- Eingeklappte Sidebar: Text bleibt für Screenreader im Link, sichtbar als Tooltip.
- Statusänderungen werden über die Live-Region der Verwaltung angesagt.

## Mobile

- Untere Leiste mit fünf gleich breiten Zielen, Platz für die sichere Zone unten.
- Tabellen werden unter 768 px zu Karten mit denselben Angaben und demselben ⋯-Menü.

## Sprachen (DE/EN)

Nur Deutsch.

## SEO / GEO

`noindex`.

## Daten

- Neue Spalte `kunden.status` (`interessent`, `aktiv`, `pausiert`, `ehemalig`, Standard `aktiv`). Migration `20261013000000_kundenstatus.sql`, rein ergänzend.
- Neue Aktionen `projektStatus` und `kundeStatus` (nur der Status, mit Prüfung des Werts).

## Tests

- `tests/unit/kundenbereich-admin-sidebar.test.tsx`: Navigation, Zähler, Menüs, Tabellen, Settings (AK-1, AK-3, AK-5 bis AK-10)
- `tests/e2e/kundenbereich-admin.spec.ts`: Sidebar, untere Leiste, Einklappen, axe (AK-2 bis AK-4, AK-11)

## Offene Fragen

- Erik am 2026-10-13 gefragt: Kundenstatus-Werte, Inhalt der Settings, untere Leiste oder Burger-Menü, Tabellen, einklappbare Sidebar, Kopfleiste, sofortiges Speichern im ⋯-Menü. Bis zur Antwort gelten die oben beschriebenen Vorschläge.
- Standard-Ablaufschritte in den Settings bearbeitbar: vorgeschlagen, kommt nach Eriks Antwort.
- Kritiker 2026-10-13, nicht behoben, mit Grund:
  - „Home“ und „Settings“ sind englisch: so von Erik benannt, Frage dazu offen.
  - Unbekannte IDs liefern HTTP 200, weil die Seite nach dem Ladezustand gestreamt wird; sichtbar ist „Nicht gefunden“ (AK-16).
  - Widersprüche bei Projektzahlen, Umsatz und gespeichertem Projektstatus kamen aus dem nachgebildeten Supabase der Tests (Projekt ohne gültige ID, kein Speichern des Projektstatus), nicht aus der echten Datenbank. Die Nachbildung speichert den Projektstatus jetzt.
  - Eigene Rückfrage statt `window.confirm`, Termine und Ansprechpartner bearbeiten, sprechende Seitentitel der Detailseiten, Darstellung der Aufklapper und Toggletip auf 360 px: als Issues angelegt.
