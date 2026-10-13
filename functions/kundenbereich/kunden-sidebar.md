# Kundenbereich: Dashboard mit Sidebar wie die Verwaltung

Status: Umgesetzt (Preview, nicht live)

## Zweck

Wunsch von Erik am 2026-10-13: „bitte den kundenbereich auch in ein dashboard verwandeln! das muss für den kunden auch mega aussehen! das nicht in zwei separate richtungen entwickeln sondern in die gleiche richtung“.

Der Kundenbereich nach der Anmeldung bekommt deshalb denselben Rahmen wie die Verwaltung (`admin-sidebar.md`): Sidebar links, Inhalt auf voller Breite, dieselben Karten, Kacheln und Seitenköpfe. Sidebar, Seitenkopf und Karten sind dieselben Komponenten wie in der Verwaltung, nicht nachgebaut.

## Nutzer & Ziel

- **Ansprechpartner:** sieht auf der Übersicht in drei Sekunden Stand, nächsten Termin und was von ihm gebraucht wird. Ablauf, Termine und Dokumente haben je eine eigene Seite, die man direkt über die Sidebar erreicht.
- **Erik:** pflegt einen Rahmen für beide Bereiche. Was er in der Verwaltung ändert (Sidebar, Karten), sieht im Kundenbereich gleich aus.

## Verhalten

1. Nach der Anmeldung haben alle Seiten des Kundenbereichs die gemeinsame **Seitenleiste** (`components/kundenbereich/Seitenleiste.tsx`), die auch die Verwaltung nutzt:
   - ab 1024 px links, ein- und ausklappbar, die Wahl gilt für beide Bereiche (Cookie `kb_sidebar`)
   - darunter oben eine Leiste mit dem Logo und unten die Bereiche als feste Leiste
   - unten in der Sidebar „Zur Website“, „Abmelden“ und „Seitenleiste“
2. Bereiche, in der Sprache der Seite:

   | DE                                    | EN                                | Inhalt                                                                                           |
   | ------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------ |
   | Übersicht `/kunden`                   | Overview `/en/clients`            | Kacheln, nächster Termin, nächste Schritte, Ablauf kurz, neueste Dokumente, Links, Logo-Freigabe |
   | Ablauf `/kunden/ablauf`               | Process `/en/clients/process`     | ganzer Ablauf mit Beschreibungen und die nächsten Schritte                                       |
   | Termine `/kunden/termine`             | Meetings `/en/clients/meetings`   | nächster Termin mit Meet-Link und Kalenderdatei, alle weiteren                                   |
   | Dokumente `/kunden/dokumente`         | Documents `/en/clients/documents` | alle Dokumente nach Art gruppiert                                                                |
   | Einstellungen `/kunden/einstellungen` | Settings `/en/clients/settings`   | Konto, Sprache, Darstellung, Abmelden                                                            |

3. Bei mehreren Projekten bleibt die Projektwahl oben auf jeder Seite. Die gewählte Projekt-ID (`?projekt=`) wandert in alle Links der Sidebar mit, damit man im selben Projekt bleibt.
4. Jede Seite hat den Seitenkopf der Verwaltung: links der Name der Seite als `h1` (z. B. „Übersicht“) mit „Hallo, Anna“ darunter, rechts der Status des Projekts. Auf der Übersicht stehen darunter Kunde, Projekttitel (`h2`), Phase und Beschreibung.
5. **Übersicht** ist das Dashboard:
   - vier Kacheln wie in der Verwaltung (Icon, Bezeichnung, große Zahl): Fortschritt mit Balken, Nächster Termin, Du bist dran, Dokumente (`kunden-dashboard.md`)
   - links: Nächster Termin, Nächste Schritte, Links, Logo-Freigabe
   - rechts: Ablauf kurz (Titel und Status je Schritt, der aktuelle hervorgehoben) mit Link „Ganzer Ablauf“ und die drei neuesten aktuellen Dokumente mit Link „Alle Dokumente“
   - die Kacheln verlinken auf die Seiten Termine, Ablauf und Dokumente
6. Admins, die über „So sieht es der Kunde“ kommen (`?projekt=`), sehen dieselben Seiten. Im Seitenkopf steht dann ein Link „Verwaltung“ zurück.
7. Ohne Anmeldung zeigen alle diese Adressen die Anmeldung mit der schmalen Leiste wie bisher (`rahmen.md`). Anmeldung und Bestätigung haben keine Sidebar.
8. Die Verwaltung behält ihre Bereiche; nur der Code der Sidebar ist jetzt gemeinsam.

## Akzeptanzkriterien

- AK-1: Angemeldet hat jede Seite eine Navigation „Kundenbereich“ bzw. „Client area“ mit fünf Links in der Reihenfolge Übersicht, Ablauf, Termine, Dokumente, Einstellungen (EN: Overview, Process, Meetings, Documents, Settings). Der Link der aktuellen Seite hat `aria-current="page"`.
- AK-2: Mit `?projekt=<id>` enthält jeder Link der Navigation dieselbe Projekt-ID.
- AK-3: Sidebar und Navigation der Verwaltung kommen aus derselben Komponente wie im Kundenbereich; die Tests der Verwaltung (`admin-sidebar.md`) bleiben grün.
- AK-4: Die Übersicht zeigt die vier Kacheln mit Icon, den kurzen Ablauf mit Link „Ganzer Ablauf“ und höchstens drei Dokumente mit Link „Alle Dokumente“. Ohne Dokumente steht „Noch keine Dokumente.“.
- AK-5: Ablauf, Termine und Dokumente zeigen auf ihrer Seite den ganzen Inhalt wie bisher (`projektuebersicht.md`, `termine.md`, `dokumente.md`).
- AK-6: Einstellungen zeigen Name und Rolle, einen Link auf dieselbe Seite in der anderen Sprache, die Wahl der Darstellung und „Abmelden“.
- AK-7: „Abmelden“ steht in der Sidebar und meldet ab (Cookies gelöscht, zurück zur Anmeldung).
- AK-8: Ohne Anmeldung zeigt `/kunden/ablauf` die Anmeldung ohne Sidebar.
- AK-9: Ein Admin mit `?projekt` sieht die Seiten mit Link „Verwaltung“; ohne `?projekt` landet er wie bisher in der Verwaltung.
- AK-10: Keine axe-Verstöße und kein horizontales Scrollen bei 360, 768 und 1280 px, hell und dunkel, auf allen fünf Seiten.

## Barrierefreiheit

- Navigation als `nav` mit Namen, Links mit `aria-current`. Unter 1024 px ist die untere Leiste dieselbe Navigation, kein Duplikat.
- Ausklappen per Button mit `aria-expanded`, sichtbarer Name „Seitenleiste“.
- Eingeklappt bleiben die Namen der Links für Screenreader (`sr-only`) und als Tooltip.
- Jede Seite hat genau ein `h1`, Karten haben `h2`.
- „Abmelden“ hat unter 640 px nur ein Icon und behält den zugänglichen Namen.

## Mobile

- Unter 1024 px oben Logo, „Zur Website“ und „Abmelden“, unten fünf Bereiche mit Icon und kurzem Namen.
- Kacheln ab 420 px zu zweit, ab 1024 px zu viert. Karten einspaltig, ab 1024 px zwei Spalten.

## Sprachen (DE/EN)

Alle Texte in `lib/kundenbereich/text.ts`. Die Verwaltung bleibt deutsch.

## SEO / GEO

Alle Seiten `noindex`, nicht in der Sitemap.

## Daten

Keine neuen Daten. Jede Seite lädt Profil und Projekte wie die Übersicht.

## Tests

- `tests/unit/kundenbereich-sidebar.test.tsx`: Navigation, Projekt-ID in Links, Übersicht kurz, Seiten mit ganzem Inhalt, Einstellungen, Admin-Link (AK-1 bis AK-6, AK-9)
- `tests/e2e/kundenbereich-projekte.spec.ts`: Seiten erreichbar, Abmelden in der Sidebar, Anmeldung ohne Sidebar, axe (AK-7, AK-8, AK-10)

## Blinder Kritiker (2026-10-13)

Behoben (mit Test in `tests/unit/kundenbereich-sidebar.test.tsx`):

- 1: Unterseiten nennen sich im Seitentitel, z. B. „Ablauf | Kundenbereich“.
- 3: Auf „Ablauf“ und „Dokumente“ heißen die Karten „Alle Schritte“ und „Alle Dokumente“, nicht noch einmal wie die Seite.
- 4: „Logo auf meiner Website“ ist ein `h2` im Stil der anderen Karten.
- 5/6: Werte der Kacheln in einer Farbe und Größe; Kacheln auch auf dem Handy zu zweit.
- 7: Der Status im Seitenkopf heißt für Screenreader „Projektstatus: In Arbeit“.
- 12: Rolle neutral „Ansprechperson“.
- 13: Termine und Dokumente gleich breit.

Offen:

- 2: Projekttitel und Dokumenttitel gibt es nur auf Deutsch; auf den englischen Seiten bleiben sie deutsch. Braucht englische Felder in den Daten.
- 8: „Von mir“ und „Von dir“ bleiben, der Kundenbereich spricht durchgehend als Erik.
- 10: Der Button heißt weiter „Seitenleiste“ mit `aria-expanded` (admin-sidebar.md AK-14).
- 9, 11, 14 bis 17 (niedrig): Linkziel der Kacheln, Abmelden im Handy-Kopf nur als Icon, Hinweis „veraltet“ bei alten Versionen, Rückfrage beim Widerrufen der Logo-Freigabe, Linie der Sidebar auf langen Seiten, Abstände der Anmeldung.
