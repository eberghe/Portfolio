# Fragen & Antworten (GEO)

Status: Entwurf

## Zweck
Echte Nutzerfragen direkt und zitierfähig beantworten, damit Google und KI-Antwortmaschinen Erik als Quelle nennen.

## Verhalten
Fragen liegen in Supabase (`fragen`: frage, antwort, leistung, stadt optional, quelle). Neue Fragen kommen auch aus dem Anfrage-Assistenten (anonymisiert, erst nach Eriks Freigabe veröffentlicht).

## Akzeptanzkriterien
- AK-1: Antwort beginnt mit einem direkten Satz (≤ 40 Wörter), danach Details.
- AK-2: `FAQPage`-Schema auf jeder Seite mit Fragen.
- AK-3: Unveröffentlichte Fragen sind öffentlich nicht lesbar (RLS).
- AK-4: Akkordeon per Tastatur bedienbar, `aria-expanded` korrekt.
