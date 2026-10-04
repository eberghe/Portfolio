# Meta-Daten & strukturierte Daten

Status: Entwurf

## Zweck
Jede Seite liefert Suchmaschinen und KI-Suchsystemen (ChatGPT, Perplexity, Google AI Overviews) sauber auslesbare Inhalte. Die aktuelle Lovable-Seite rendert Inhalte nur per JavaScript; im HTML stehen nur Meta-Tags. Das ist der größte SEO-/GEO-Hebel des Umbaus.

## Akzeptanzkriterien
- AK-1: Jede Seite hat eindeutigen Title (≤ 60 Zeichen), Description (≤ 155), Canonical, OG- und Twitter-Tags.
- AK-2: Global JSON-LD `Person` + `ProfessionalService` mit `areaServed`.
- AK-3: Breadcrumbs mit `BreadcrumbList`.
- AK-4: Inhalt ist ohne JavaScript vollständig im HTML.
- AK-5: `llms.txt` mit Kurzprofil und Links zu Leistungen.
