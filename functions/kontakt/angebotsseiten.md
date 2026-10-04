# Angebotsseiten für Kunden

Status: Entwurf

## Bestand

Die Lovable-Seite hat eine Angebotsseite (`/projekt-2026-001`) mit konfigurierbaren Zusatzoptionen und Preisen. Das Passwort steht im ausgelieferten JavaScript und ist damit für jeden lesbar, ebenso Kundenname und Preise.

## Zweck

Individuelle Angebote als Webseite: Kunde sieht Leistungsumfang, wählt Optionen, sieht den Preis live und kann direkt annehmen. Kundenfreundlicher als PDF per Mail.

## Verhalten

- Angebote liegen in Supabase (`angebote`, `angebot_optionen`), nicht im Code.
- Zugriff über einen geheimen, nicht erratbaren Link (Token) oder Magic Link per E-Mail; geprüft wird serverseitig.
- Kunde kann Optionen wählen und „Angebot annehmen" klicken; Erik wird benachrichtigt.
- Seiten sind `noindex` und nicht in der Sitemap.

## Akzeptanzkriterien

- AK-1: Ohne gültigen Zugang liefert der Server keine Angebotsdaten aus (Test prüft HTML und API-Antwort).
- AK-2: Kein Passwort und keine Angebotsdaten im Client-Bundle.
- AK-3: Preisberechnung mit Optionen ist getestet und wird serverseitig nachgerechnet.
- AK-4: `noindex`, nicht in Sitemap.
- AK-5: Optionen als beschriftete Checkboxen, Gesamtpreis wird bei Änderung per `aria-live` angesagt.

## Daten

`angebote` (id, token_hash, kunde, basis_preis, gueltig_bis, status), `angebot_optionen` (angebot_id, name, beschreibung, stunden, preis, gewaehlt).
