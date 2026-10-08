# FAQ

Status: In Arbeit

## Zweck

Häufige Fragen von Interessenten beantworten; zugleich GEO-Quelle für KI-Suchen (siehe `seo/fragen-antworten.md`).

## Bestand (Lovable `FaqsPage.tsx`, `faqData`)

Sechs Fragen (Leistungen, remote, Projektablauf, Tools, Dauer, Verfügbarkeit) als Akkordeon; FAQPage-JSON-LD nur per JavaScript.

## Verhalten

- `/faqs` (EN `/en/faqs`).
- Fragen aus dem Bestand; Antworten an den neuen Stand angepasst: aktuelle Leistungen mit Links, vor Ort in und um Augsburg, Projektablauf in ganzen Sätzen mit Link auf den Beispielablauf der Startseite.
- Akkordeon aus nativen `<details>`/`<summary>`: funktioniert ohne JavaScript, Antworten stehen im HTML.
- JSON-LD `FAQPage` serverseitig.
- Abschluss: Link zur Kontaktseite.
- Daten später aus Supabase (`seo/fragen-antworten.md`); bis dahin in `lib/content/faq.ts`.

## Akzeptanzkriterien

- AK-1: Seite in DE und EN, genau eine h1, eigene Title/Description.
- AK-2: Jede Frage ist ein `summary` in einem `details`; die Antwort steht im HTML (ohne JavaScript).
- AK-3: JSON-LD `FAQPage` enthält alle Fragen und Antworten der Seitensprache.
- AK-4: Antworten nennen nur aktuelle Leistungen (kein „Business Development") und Augsburg. Framer ist seit 2026-10-07 wieder ein Werkzeug der Leistung Webdesign & Webentwicklung (leistungen.md AK-40).
- AK-6: Fragen (`summary`) zeigen beim Fokus denselben 2-px-Rahmen wie Links und Buttons.
- AK-7 (Issue #3): Eine Frage „Wo bist du ansässig?“ / „Where are you based?“ steht an zweiter Stelle und beantwortet direkt: Königsbrunn bei Augsburg, vor Ort in Augsburg und Umgebung, sonst remote in ganz Deutschland. Sie ist Teil des FAQPage-JSON-LD.
- AK-5: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel); Fragen per Tastatur auf- und zuklappbar.

## Tests

`tests/unit/statische-seiten.test.tsx` (AK-1 bis AK-4), `tests/e2e/statische-seiten.spec.ts` (AK-2, AK-5).

## Befunde Blinder Kritiker (Runde 1)

Behoben: Werkzeug-Antwort an Über mich angeglichen; Barrierefreiheit nennt auch das österreichische BaFG; Fokusrahmen der Fragen (AK-6).

Offen, Entscheidung bei Erik: weitere Kundenfragen (Preise, Angebot, Nutzungsrechte, Wartung nach Launch, Kapazität, Projekte auf Englisch); Formulierung „Ja!" bei Verfügbarkeit und „24 Stunden".

## Befunde Blinder Kritiker (Issue #3)

Behoben: „Ich sitze“ → „Ich wohne und arbeite“, EN „runs remote“ → „happens remotely“, doppelter Vor-Ort-Satz aus der Remote-Antwort entfernt. Bewusst gelassen: Startseite nennt „Augsburg“ als Standort (Suchbegriff), die FAQ präzisiert Königsbrunn bei Augsburg.

## Umbau nach Vorlage designme.agency (Issue #19, Erik 2026-10-04; löst Issue #7)

- AK-8: Jede Frage ist eine Überschrift (h2) im `summary`; das Akkordeon ist die gemeinsame Komponente `FaqList` (auch auf Leistungs- und Stadtseiten). Auf- und Zuklappen ist weich animiert, wo der Browser es kann, und ohne Animation bei reduzierter Bewegung.
- AK-9: Zweispaltig ab 1024 px: links bleibt eine Spalte mit Eriks Foto, „Deine Frage ist nicht dabei?“, Button zum Erstgespräch und E-Mail-Adresse stehen; rechts die Fragen. Auf dem Handy steht dieser Kasten unter den Fragen.
- AK-10: Kopf mit Überline, h1 und einem Satz; Fragen blenden beim Scrollen ein.
