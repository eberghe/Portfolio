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
- AK-4: Antworten nennen nur aktuelle Leistungen (kein „Framer", kein „Business Development") und Augsburg.
- AK-6: Fragen (`summary`) zeigen beim Fokus denselben 2-px-Rahmen wie Links und Buttons.
- AK-5: Keine axe-Verstöße, kein horizontales Scrollen (360/768/1280, hell und dunkel); Fragen per Tastatur auf- und zuklappbar.

## Tests

`tests/unit/statische-seiten.test.tsx` (AK-1 bis AK-4), `tests/e2e/statische-seiten.spec.ts` (AK-2, AK-5).

## Befunde Blinder Kritiker (Runde 1)

Behoben: Werkzeug-Antwort an Über mich angeglichen; Barrierefreiheit nennt auch das österreichische BaFG; Fokusrahmen der Fragen (AK-6).

Offen, Entscheidung bei Erik: weitere Kundenfragen (Preise, Angebot, Nutzungsrechte, Wartung nach Launch, Kapazität, Projekte auf Englisch); Formulierung „Ja!" bei Verfügbarkeit und „24 Stunden".
