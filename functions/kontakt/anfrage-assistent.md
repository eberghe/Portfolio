# Anfrage-Assistent (statt Mail)

Status: In Arbeit

## Bestand

Die Lovable-Seite nutzt ein einfaches Formular (Name, E-Mail, Nachricht) über Web3Forms; der Zugangsschlüssel steht im ausgelieferten JavaScript. Erfolg und Fehler erscheinen nur als kurzer Text unter dem Button.

## Zweck

Kundenfreundlich anfragen ohne Mailprogramm: in vier kurzen Schritten Anliegen, Rahmen und Kontakt angeben. Erik bekommt eine strukturierte Anfrage statt einer losen Mail.

## Nutzer & Ziel

Interessierte (oft ohne Fachbegriffe) wollen schnell sagen, was sie brauchen, und wissen, wie es danach weitergeht.

## Verhalten

Ein Formular in vier Schritten auf der Kontaktseite (`seiten/kontakt.md`):

1. **Leistung**: Mehrfachauswahl aller Leistungen plus „Noch unklar / etwas anderes". Mindestens eine Auswahl.
2. **Projekt**: Beschreibung (Pflicht, 20 bis 3000 Zeichen), aktuelle Website (optional, `beispiel.de` reicht, `https://` wird ergänzt).
3. **Rahmen**: Zeitrahmen (So bald wie möglich, In 1 bis 3 Monaten, Später, Noch offen) und Budget (Unter 2.000 €, 2.000 bis 5.000 €, 5.000 bis 10.000 €, Über 10.000 €, Noch offen). Beides optional, vorbelegt mit „Noch offen".
4. **Kontakt**: Name, E-Mail, Telefon (optional), Einwilligung zur Verarbeitung (Pflicht, Link zur Datenschutzerklärung).

Danach eine Bestätigung im selben Bereich: „Danke, <Name>. Ich melde mich per E-Mail, meist mit einem Terminvorschlag für ein kostenloses Erstgespräch." plus Zusammenfassung der Angaben.

- „Weiter" prüft nur den aktuellen Schritt; „Zurück" behält alle Eingaben.
- Kommt man über „Interesse an <Leistung>?" (`/contact?leistung=<slug>`), ist diese Leistung vorausgewählt.
- Ohne JavaScript sind alle Schritte untereinander sichtbar und das Formular wird normal abgeschickt (Server Action).
- Der Server prüft alles erneut (gleiche Prüfregeln wie im Browser, `lib/contact/validate.ts`).
- Spam: verstecktes Feld (Honeypot). Ist es gefüllt, meldet der Server Erfolg, speichert aber nichts. Höchstens 3 Anfragen pro Stunde je Absender (Hash der IP, keine Klar-IP gespeichert).
- Speichern in Supabase-Tabelle `anfragen`, danach Benachrichtigung an Erik per Mail (Resend). Schlägt die Benachrichtigung fehl, gilt die Anfrage trotzdem als angekommen.
- **Ausweichweg:** Ist Supabase nicht eingerichtet oder schlägt das Speichern fehl, verliert niemand seinen Text: Die Seite sagt das offen und bietet einen E-Mail-Link an, der Betreff und alle Angaben schon enthält.

## Akzeptanzkriterien

- AK-1: Funktioniert ohne Login. Der Fortschritt ist sichtbar („Schritt 2 von 4: Projekt"); beim Schrittwechsel springt der Fokus auf die Überschrift des neuen Schritts, die den Fortschritt nennt.
- AK-2: Fehler stehen am Feld (`aria-invalid`, `aria-describedby`) und gesammelt in einer Fehlerliste mit Links zu den Feldern; der Fokus springt auf die Fehlerliste. Server-Fehler öffnen den Schritt des ersten Fehlers.
- AK-3: Spam-Schutz ohne Rätsel: gefüllter Honeypot speichert nichts und meldet Erfolg; ab der 4. Anfrage pro Stunde vom selben Absender kommt eine freundliche Meldung.
- AK-4: Daten nur serverseitig schreibbar, öffentlich weder les- noch schreibbar (RLS aktiv, keine Policies für `anon`/`authenticated`). Kein Schlüssel im ausgelieferten JavaScript.
- AK-5: Erik erhält je gespeicherter Anfrage eine Mail mit allen Angaben (sofern `RESEND_API_KEY` gesetzt ist).
- AK-6: Prüfregeln: mindestens eine Leistung; Beschreibung 20 bis 3000 Zeichen; Website optional, nur http(s); Name 2 bis 100 Zeichen; gültige E-Mail; Telefon optional, nur Ziffern, Leerzeichen, `+ / ( ) -`; Einwilligung Pflicht; unbekannte Werte für Leistung, Zeitrahmen und Budget werden abgelehnt.
- AK-7: Ohne Supabase-Zugang oder bei Speicherfehler erscheint eine klare Meldung mit vorausgefülltem E-Mail-Link (`mailto:` mit Betreff und allen Angaben).
- AK-8: Nach dem Absenden: Bestätigung mit Namen und Zusammenfassung; der Fokus liegt auf der Bestätigung.
- AK-9: `?leistung=<slug>` wählt die Leistung vor; unbekannte Slugs werden ignoriert.
- AK-10: Ohne JavaScript sind alle Schritte sichtbar und absendbar.
- AK-11: Die Einwilligung heißt nur „Ich bin einverstanden, … gespeichert werden. (Pflicht)"; der Link zur Datenschutzerklärung steht darunter und ist als Beschreibung verknüpft.
- AK-12: Der Hinweis zur Beschreibung nennt die Mindestlänge; ab 2500 Zeichen erscheint ein Zähler („2600 von 3000 Zeichen") in einer Live-Region.
- AK-13: Im Fortschritt sind erledigte Schritte für Screenreader als „(erledigt)" markiert.
- AK-14: Der E-Mail-Link des Ausweichwegs bleibt unter 2000 Zeichen (lange Beschreibungen werden mit Hinweis gekürzt); daneben kopiert „Angaben kopieren" den vollen Text. Der Absende-Button tritt dann als „Erneut senden" zurück.
- AK-15: „Anfrage senden" ist erst im letzten Schritt sichtbar; Fehlerliste und Schritt-Überschrift zeigen beim Fokus einen sichtbaren Rahmen.

## Barrierefreiheit

Jeder Schritt ist ein `fieldset` mit `legend`; Auswahlgruppen sind echte Checkboxen und Radios. Pflichtfelder sind im Label als „(Pflicht)" ausgeschrieben, nicht nur mit Stern. Fortschrittsleiste als `ol` mit `aria-current="step"`. Autocomplete-Attribute (`name`, `email`, `tel`, `url`). Zielgrößen mindestens 44 × 44 px für Auswahlen und Buttons.

## Mobile

Einspaltig; Buttons „Zurück"/„Weiter" nebeneinander, volle Breite unter 640 px.

## Sprachen (DE/EN)

Alle Texte, Optionen und Fehlermeldungen in `lib/content/contact.ts`. Die gespeicherte Anfrage enthält die Sprache.

## Daten

Tabelle `anfragen` (Migration `supabase/migrations/20261004000000_anfragen.sql`): `id`, `created_at`, `sprache`, `leistungen text[]`, `beschreibung`, `website`, `zeitrahmen`, `budget`, `name`, `email`, `telefon`, `einwilligung_am`, `ip_hash`, `status` (`neu`). RLS aktiv, keine Policies; Zugriff nur mit dem Service-Role-Schlüssel im Server.

Umgebungsvariablen (nur in Vercel, nie im Code): `SUPABASE_URL` (oder `NEXT_PUBLIC_SUPABASE_URL`), `SUPABASE_SERVICE_ROLE_KEY`, optional `RESEND_API_KEY` und `ANFRAGE_ABSENDER` (Absender der Benachrichtigung, Standard `onboarding@resend.dev`). Supabase-Projekt in der Region EU (Frankfurt) anlegen.

## Tests

`tests/unit/anfrage.test.tsx` (AK-1 bis AK-9, AK-11 bis AK-14, AK-16 bis AK-20), `tests/e2e/kontakt.spec.ts` (AK-1, AK-2, AK-7, AK-10, AK-15, axe).

## Befunde Blinder Kritiker (Runde 1)

Behoben (mit Test): „Anfrage senden" in allen Schritten sichtbar, weil `inline-flex` das `hidden`-Attribut überschrieb (jetzt global `[hidden]{display:none!important}`, AK-15); Mindestlänge erst im Fehler genannt, kein Zähler (AK-12); mailto zu lang für manche Mailprogramme, Absende-Button konkurriert mit dem E-Mail-Weg (AK-14); Fokus auf Fehlerliste und Überschrift unsichtbar (AK-15); erledigte Schritte nicht angesagt (AK-13); Linktext mitten im Namen der Einwilligung (AK-11).
Behoben (Text): „Das Formular lässt sich gerade nicht absenden."; englische Formulierungen.
Verschoben: englische Slugs für Impressum und Datenschutz (`/en/datenschutz`).

## Offene Fragen

- Antwortzeit nennen (z. B. „innerhalb von zwei Werktagen")? Nur, wenn Erik das zusagen will.

- Terminbuchung direkt nach der Anfrage (z. B. Cal.com)? Bis dahin schlägt Erik Termine per Mail vor.
- Bestätigungsmail an Kunden: von Erik gewünscht (2026-10-06), siehe AK-18.
- Budget-Spannen sind ein Vorschlag; Erik prüft, ob sie zu seinen Preisen passen.

## Benachrichtigung kommt nicht an (Erik 2026-10-05)

Anfragen werden gespeichert (Supabase), aber die Mail an Erik fehlt. Ursache (gefolgert): Ohne eigene, bei Resend bestätigte Domain sendet Resend von `onboarding@resend.dev` nur an die E-Mail-Adresse des Resend-Kontos, nicht an `erb1209@outlook.de`.

- AK-16: Empfänger der Benachrichtigung ist `ANFRAGE_EMPFAENGER`, sonst die E-Mail der Seite. Damit kann Erik ohne Code-Änderung auf die Adresse seines Resend-Kontos umstellen, bis die Domain bei Resend bestätigt ist (dann `ANFRAGE_ABSENDER`, z. B. `anfrage@erik-bergheimer.de`).
- AK-17: Schlägt die Benachrichtigung fehl, steht der Statuscode und die Antwort von Resend im Server-Log, damit die Ursache sichtbar ist.

## Bestätigung an den Absender (Erik 2026-10-06)

Erik möchte, dass auch der Absender eine Mail bekommt.

- AK-18: Ist `ANFRAGE_ABSENDER` gesetzt (eigene, bei Resend bestätigte Domain, am besten als `Erik Bergheimer <anfrage@erik-bergheimer.de>`), bekommt der Absender nach dem Speichern eine kurze Bestätigung in seiner Sprache (Betreff „Deine Anfrage bei Erik Bergheimer" / „Your enquiry to Erik Bergheimer", Antwort-an: Eriks Adresse). Ohne eigene Domain wird keine Bestätigung verschickt, weil Resend dann ohnehin nur an das eigene Konto zustellt. Die Bestätigung geht erst nach Eriks Benachrichtigung raus.
- AK-19: Die Bestätigung enthält nur festen Text und die gewählten Leistungen (feste Bezeichnungen), weder Name noch Beschreibung. So lässt sich das Formular nicht missbrauchen, um fremden Leuten beliebigen Text zu schicken; dazu kommen Honeypot und das Limit von drei Anfragen pro Stunde (AK-3).
- AK-20: Schlägt die Bestätigung fehl, kommt Eriks Benachrichtigung trotzdem an, und der Fehler steht im Server-Log.
- AK-21: Bestätigungen werden auch in der Menge begrenzt: keine Bestätigung ohne IP-Prüfwert, und höchstens zwei Bestätigungen pro E-Mail-Adresse in 24 Stunden. So lässt sich niemandes Postfach fluten, auch nicht mit wechselnden IP-Adressen.
- AK-22: Die Datenschutzerklärung (DE und EN) nennt, dass der Absender über Resend eine Bestätigung an seine E-Mail-Adresse bekommt.

### Blinder Kritiker (2026-10-06)

Behoben (mit Test): Menge der Bestätigungen nur pro IP begrenzt (AK-21); Datenschutzerklärung erwähnte die Bestätigung nicht (AK-22); englischer Text holprig; Absenderformat mit Namen empfohlen (AK-18). Bewusst so gelassen: beide Mails laufen nacheinander vor der Antwort, das kostet etwa eine Sekunde.
