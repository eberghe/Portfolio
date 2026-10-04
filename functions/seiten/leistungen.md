# Leistungen

Status: Entwurf

## Zweck
Je Leistung eine eigene, rankingfähige Unterseite plus Übersicht.

## Leistungen
Neu:
1. Webflow-Entwicklung (inkl. bisher „Webflow & Framer")
2. Barrierefreiheit-Beratung (bisher „Accessibility")
3. KI-Beratung
4. Website- & Prozessentwicklung und -optimierung (inkl. bisher „Business Development")
5. Brand-Design & Logo-Design

Bestehend, bleiben erhalten:
6. UX/UI-Design
7. Design-Systeme
8. Fotografie

## Verhalten
Jede Unterseite: Nutzenversprechen, Beispiel-Projektablauf (siehe `seiten/projektablauf.md`), passende Case Studies, FAQ (siehe `seo/fragen-antworten.md`), Call-to-Action.

## Akzeptanzkriterien
- AK-1: Jede Leistung hat eine Seite unter `/leistungen/<slug>` (EN: `/en/services/<slug>`) mit eigenem Title und Description.
- AK-2: JSON-LD `Service` mit `provider` = Erik (Person/ProfessionalService).
- AK-3: FAQ-Block mit `FAQPage`-Schema, Fragen aus Supabase.
- AK-4: Alte URLs (`/services/...`) leiten per 301 weiter.
