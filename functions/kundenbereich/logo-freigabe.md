# Kundenbereich: Logo-Freigabe und Datenschutz

Status: Umgesetzt (nur Preview)

## Zweck

Ansprechpartner geben im Kundenbereich ihr Go, dass Erik das Logo ihres Unternehmens auf seiner Website als Referenz zeigen darf, und können es jederzeit widerrufen (Issue #59, Wunsch Erik 2026-10-08). Die Datenschutzerklärung beschreibt den Kundenbereich.

## Nutzer & Ziel

- **Ansprechpartner:** entscheidet mit einem Klick und sieht den aktuellen Stand.
- **Erik:** sieht in der Verwaltung, ob und wann freigegeben oder widerrufen wurde und von wem (`admin.md` AK-10).

## Verhalten

1. Angemeldete Ansprechpartner sehen in der Projektübersicht in der rechten Spalte unter den Links den Abschnitt „Logo auf meiner Website“ (EN „Logo on my website“). Admins sehen ihn nicht (sie haben keinen Kunden).
2. Text: „Darf ich das Logo von <Kunde> auf erik-bergheimer.de als Referenz zeigen? Du kannst das jederzeit hier widerrufen.“ Darunter der Stand: „Noch nicht freigegeben“, „Freigegeben am <Datum> von <Name>“ oder „Widerrufen am <Datum> von <Name>“.
3. Button je nach Stand: „Ja, Logo freigeben“ (offen oder widerrufen) bzw. „Freigabe widerrufen“ (erteilt). Nach dem Klick zeigt eine Meldung mit `aria-live` den neuen Stand.
4. Der Server liest den Ansprechpartner zum angemeldeten Nutzer (`ansprechpartner.user_id`) mit dessen Token und trägt die Entscheidung mit dessen Token in `logo_freigaben` ein. Die Zugriffsregel `kunde_gibt_frei` erlaubt das nur für den eigenen Kunden im eigenen Namen; den Zeitpunkt setzt die Datenbank, `kunden.logo_freigabe` folgt automatisch (`datenmodell.md` AK-4).
5. Die Anzeige von Logos auf der öffentlichen Website ist ein eigener Schritt (eigenes Issue): Sie darf nur Kunden mit `logo_freigabe = 'erteilt'` zeigen.

## Datenschutzerklärung

Neuer Abschnitt „Kundenbereich“ (DE/EN) in `lib/content/legal.ts`, und der Abschnitt „Cookies & Browser-Speicher“ nennt die beiden Anmelde-Cookies:

- Wer: Ansprechpartner von Kundinnen und Kunden, die Erik für ein Projekt einträgt.
- Daten: Name, E-Mail, optional Rolle und Telefon, Sprache; Projektinhalte, Termine, Verträge, Rechnungen und Dateien; Anmeldungen (Supabase Auth); Logo-Freigaben mit Name und Zeitpunkt; bei Anmeldelinks nur verschlüsselte Prüfwerte von E-Mail und IP, gelöscht nach 24 Stunden.
- Zweck und Rechtsgrundlage: Vertrag und vorvertragliche Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO), Schutz vor Missbrauch (lit. f), Logo-Freigabe als Einwilligung (lit. a), jederzeit im Kundenbereich widerrufbar.
- Speicherort Supabase (EU, Frankfurt), Mails mit dem Anmeldelink über Resend.
- Cookies: `kb_zugang` (1 Stunde) und `kb_erneuern` (30 Tage), nur nach der Anmeldung, technisch notwendig (§ 25 Abs. 2 Nr. 2 TDDDG); Abmelden löscht sie.
- Speicherdauer: bis zum Ende der Zusammenarbeit, Verträge und Rechnungen nach den gesetzlichen Aufbewahrungsfristen.

Die Texte sind ein Entwurf; eine juristische Prüfung ersetzen sie nicht.

## Akzeptanzkriterien

- AK-1: Ansprechpartner sehen den Abschnitt mit Kundennamen, Stand und passendem Button; Admins nicht.
- AK-2: „Ja, Logo freigeben“ trägt `erteilt`, „Freigabe widerrufen“ trägt `widerrufen` ein, jeweils mit `kunde_id` und `ansprechpartner_id` des angemeldeten Nutzers und dessen Token (nie Service-Role); andere Werte werden abgelehnt.
- AK-3: Ohne Sitzung oder ohne Ansprechpartner zum Nutzer wird nichts eingetragen, die Meldung nennt den Fehler.
- AK-4: Englisch: alle Texte und Datum englisch.
- AK-5: Die Datenschutzerklärung (DE/EN) enthält den Abschnitt „Kundenbereich“ mit den Punkten oben und nennt die beiden Cookies; der Satz „setzt keine Cookies“ gilt nur noch außerhalb des Kundenbereichs.
- AK-6: Anmeldeversuche älter als 24 Stunden werden beim nächsten Eintrag gelöscht.
- AK-7: Keine axe-Verstöße, kein horizontales Scrollen bei 360/768/1280, hell und dunkel.

## Barrierefreiheit

Stand als Text, Button mit eindeutigem Namen, Meldung mit `aria-live`.

## Sprachen (DE/EN)

Texte in `lib/kundenbereich/text.ts` und `lib/content/legal.ts`.

## Daten

`logo_freigaben` und `kunden.logo_freigabe` aus `datenmodell.md`, keine neue Migration.

## Tests

- `tests/unit/kundenbereich-freigabe.test.tsx`: Aktion, Ansicht, Datenschutz, Aufräumen (AK-1 bis AK-6)
- `tests/e2e/kundenbereich-projekte.spec.ts`: Abschnitt in der angemeldeten Ansicht, axe (AK-1, AK-7)
