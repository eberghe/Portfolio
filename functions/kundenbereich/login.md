# Kundenbereich: Login per Magic Link

Status: In Arbeit

## Zweck

Ansprechpartner von Kunden und Erik (Admin) melden sich ohne Passwort im Kundenbereich an: E-Mail eingeben, Link aus der Mail öffnen, bestätigen (Issue #56, Entscheidung Erik 2026-10-08: Magic Link).

## Nutzer & Ziel

- **Ansprechpartner:** kommt über einen Link von Erik auf `/kunden` und will ohne Konto-Anlage an seine Projektinfos.
- **Erik:** meldet sich mit `erb1209@outlook.de` an und landet in derselben Oberfläche mit Admin-Rechten.
- **Fremde:** erfahren nicht, ob eine Adresse bei Erik hinterlegt ist.

## Verhalten

1. `/kunden` (EN `/en/clients`) zeigt ohne Anmeldung das Formular „Im Kundenbereich anmelden“: ein Feld E-Mail (`TextField`, `type="email"`, `autocomplete="email"`) und der Button „Anmeldelink schicken“ (`Button`), dazu ein Satz, wofür der Bereich da ist.
2. Absenden (Server Action):
   - Ungültige Adresse: Fehlermeldung am Feld, Fokus aufs Feld.
   - Gültige Adresse: Ist sie als Ansprechpartner oder Admin hinterlegt, legt der Server bei Bedarf den Supabase-Nutzer an (bestätigt, ohne Passwort), verknüpft ihn mit dem Ansprechpartner (`ansprechpartner.user_id`), erzeugt über die Supabase-Admin-API einen einmaligen Anmeldecode und schickt über Resend eine Mail in der Sprache des Ansprechpartners mit dem Link `<Seite>/kunden/anmelden?code=…` (EN `/en/clients/sign-in?code=…`).
   - In jedem Fall (bekannt, unbekannt, Limit erreicht) dieselbe Antwort: „Wenn die Adresse bei mir hinterlegt ist, ist der Link unterwegs. Er gilt eine Stunde.“ Die Meldung wird per `aria-live` angesagt und bekommt den Fokus.
   - Limit: höchstens 3 Links pro Adresse in 15 Minuten und 10 Anfragen pro Absender (IP-Hash) pro Stunde. Gespeichert werden nur HMAC-Hashes von Adresse und IP (Tabelle `anmeldeversuche`, kein Zugriff für `anon`/`authenticated`).
   - Fehlen Supabase- oder Resend-Zugang auf dem Server: Hinweis „Der Kundenbereich ist gerade nicht erreichbar“ mit Mail-Link an Erik.
3. `/kunden/anmelden?code=…` zeigt „Anmeldung bestätigen“ mit einem Button. Erst der Klick (POST) löst den Code ein, damit Link-Vorschauen von Mailprogrammen ihn nicht verbrauchen. Gültig: Session-Cookies setzen, weiter auf `/kunden`. Ungültig oder abgelaufen: Meldung mit Link zurück zum Formular.
4. Angemeldet zeigt `/kunden` „Hallo, <Name>“ (Admins: „Hallo, Erik“ und der Hinweis „Admin“) und den Button „Abmelden“. Die Projektübersicht folgt in #51.
5. Abmelden beendet die Supabase-Sitzung und löscht die Cookies.

## Sitzung

- Zwei Cookies: `kb_zugang` (Access Token, 1 Stunde) und `kb_erneuern` (Refresh Token, 30 Tage); `httpOnly`, `secure` (außer auf localhost), `sameSite=lax`, `path=/`.
- Jede Seite des Bereichs prüft die Sitzung serverseitig bei Supabase (`/auth/v1/user`), nie nur im Browser.
- Ist der Access Token abgelaufen, erneuert der Proxy (`proxy.ts`) ihn nur auf Pfaden des Kundenbereichs mit dem Refresh Token und setzt beide Cookies neu; schlägt das fehl, werden sie gelöscht.
- Daten liest der Server immer mit dem Access Token des Nutzers, damit die Zugriffsregeln aus `datenmodell.md` greifen; den Service-Role-Schlüssel braucht nur der Anmeldeablauf.

## Sicherheit

- Der Link in der Mail wird aus einer festen Liste erlaubter Adressen gebaut (`erik-bergheimer.de`, Vercel-Previews dieses Projekts, `localhost`), nie blind aus dem `Host`-Header.
- Selbstregistrierung gibt es nicht: Codes nur für hinterlegte Adressen. Wichtig: Die Supabase-Admin-API (`generate_link`) legt für unbekannte Adressen still einen Nutzer an, auch mit `disable_signup` (geprüft 2026-10-08). Deshalb prüft der Server zuerst `kundenbereich_konto()` und ruft `generate_link` nur für hinterlegte Adressen auf (AK-3, Test).
- Supabase-Auth-Einstellung `disable_signup` ist an (2026-10-08).
- Seiten des Bereichs: `noindex, nofollow`, nicht in Sitemap und `llms.txt`, `Cache-Control: no-store` (dynamisch, `cookies()`).

## Akzeptanzkriterien

- AK-1: `/kunden` und `/en/clients` zeigen ohne Anmeldung eine h1, das E-Mail-Feld mit Label und den Button; `noindex`, nicht in der Sitemap.
- AK-2: Ungültige Adresse liefert eine Feld-Fehlermeldung (`aria-invalid`, `aria-describedby`); es wird nichts verschickt.
- AK-3: Für eine hinterlegte Adresse wird genau eine Mail mit einem Link auf die erlaubte Seite und den Bestätigungspfad der richtigen Sprache verschickt; für eine unbekannte keine. Die Antwort an den Browser ist in beiden Fällen gleich.
- AK-4: Fehlt für einen Ansprechpartner der Supabase-Nutzer, wird er angelegt und `ansprechpartner.user_id` gesetzt.
- AK-5: Nach 3 Links an dieselbe Adresse in 15 Minuten oder 10 Anfragen vom selben Absender in einer Stunde wird nichts mehr verschickt; die Antwort bleibt gleich.
- AK-6: Ein nicht erlaubter Host im Request führt zu einem Link auf `https://erik-bergheimer.de`.
- AK-7: `/kunden/anmelden` löst den Code erst per POST ein; gültig setzt die beiden Cookies (`httpOnly`, `sameSite=lax`) und leitet auf den Bereich der Sprache weiter, ungültig zeigt eine Meldung mit Link zum Formular.
- AK-8: Angemeldet zeigt `/kunden` den Namen und „Abmelden“; Abmelden löscht die Cookies.
- AK-9: Ein abgelaufener Access Token wird im Proxy mit dem Refresh Token erneuert; ein ungültiger Refresh Token löscht beide Cookies.
- AK-10: Fehlt der Supabase- oder Resend-Zugang, erscheint der Hinweis „gerade nicht erreichbar“ statt der Bestätigung.
- AK-11: Keine axe-Verstöße, kein horizontales Scrollen bei 360/768/1280, hell und dunkel.

## Barrierefreiheit

Ein Feld, sichtbares Label, Fehler und Bestätigung als Text mit `aria-live`, Fokus springt auf die Meldung; Buttons 44 px.

## Mobile

Formular einspaltig, volle Breite bis 480 px.

## Sprachen (DE/EN)

Alle Texte und die Mail in DE und EN. Pfade: `/kunden` ↔ `/en/clients`, `/kunden/anmelden` ↔ `/en/clients/sign-in`.

## SEO / GEO

Keine Indexierung (siehe Sicherheit).

## Daten

Neue Tabelle `anmeldeversuche` und die Funktionen `kundenbereich_konto(email)` (nur Service-Role) und `kundenbereich_profil()` (angemeldeter Nutzer), Migration `20261008100000_anmeldeversuche.sql`, am 2026-10-08 ausgeführt. Erik ist als Supabase-Nutzer `erb1209@outlook.de` angelegt und in `admins` eingetragen. Mails gehen über Resend mit `ANFRAGE_ABSENDER` (in Vercel für Production und Preview gesetzt).

## Tests

- `tests/unit/kundenbereich-login.test.ts`: Anmeldeablauf mit nachgebildetem Supabase und Resend (AK-2 bis AK-10), Datenbankfunktionen in PGlite
- `tests/unit/kundenbereich-seiten.test.tsx`: Meta-Daten, Bestätigungsseite, Begrüßung (AK-1, AK-7, AK-8)
- `tests/e2e/kundenbereich.spec.ts`: Seiten, axe, Mobile (AK-1, AK-2, AK-7 ungültiger Code, AK-11)

## Offene Fragen

- Link zum Kundenbereich im Footer? Annahme: erst, wenn Erik den Bereich freigibt.

## Befunde Blinder Kritiker (2026-10-08)

Geprüft: `/kunden`, `/en/clients`, Bestätigungs- und Abgelaufen-Seite bei 360/1280 px, hell und dunkel. axe 0 Verstöße in 20 Kombinationen, `noindex`, `lang` korrekt, Formular, Fehler, Live-Meldung und Tastatur in Ordnung, Optik wie `/contact`.

Behoben (mit Test): Titel der Bestätigungsseiten wurde doppelt angesagt (h1 und verstecktes h2); nach „Jetzt anmelden“ mit ungültigem Code lag der Fokus auf `body`, jetzt auf der neuen h1.

Bewusst offen (niedrig):
- Die Meldung nach dem Absenden bekommt den Fokus ohne sichtbaren Rahmen; sie ist nicht bedienbar, der Rahmen würde nur irritieren.
- Eingabefeld 42 px und Kopfzeilen-Buttons 36 px hoch: WCAG 2.2 AA verlangt 24 px, erfüllt. Gilt seitenweit, betrifft das Designsystem und wird nicht nur hier geändert.
