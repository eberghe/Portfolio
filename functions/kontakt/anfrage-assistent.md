# Anfrage-Assistent (statt Mail)

Status: Entwurf

## Zweck
Kundenfreundlich anfragen ohne Mailprogramm: in wenigen Schritten Anliegen, Budget-Rahmen und Wunschtermin angeben.

## Verhalten
1. Leistung wählen (Mehrfachauswahl)
2. Kurz beschreiben, optional aktuelle Website-URL
3. Zeitrahmen und Budget-Spanne
4. Kontakt (Name, E-Mail, optional Telefon) und Einwilligung
5. Bestätigungsseite mit nächstem Schritt, optional direkte Terminbuchung

Speicherung in Supabase-Tabelle `anfragen`, Benachrichtigung an Erik, Bestätigungsmail an Kunden.

## Akzeptanzkriterien
- AK-1: Funktioniert ohne Login; Fortschritt ist sichtbar und wird Screenreadern angesagt.
- AK-2: Fehler werden am Feld und gesammelt angezeigt, Fokus springt zum ersten Fehler.
- AK-3: Spam-Schutz ohne Captcha-Rätsel (Honeypot + Rate-Limit).
- AK-4: Daten nur serverseitig schreibbar; öffentlich nicht lesbar (RLS).
- AK-5: Erik erhält eine Benachrichtigung je Anfrage.

## Offene Fragen
- Terminbuchung über welches Tool (z. B. Cal.com)?
- Benachrichtigung per Mail, Slack oder beides?
