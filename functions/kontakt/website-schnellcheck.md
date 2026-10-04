# Website-Schnellcheck

Status: Idee

## Zweck

Besucher geben ihre URL ein und sehen sofort Zahlen zu Performance, Barrierefreiheit und SEO ihrer Seite, dazu, was Erik typischerweise verbessert. Macht „wie krass ich deine Website verbessern kann" konkret und führt in den Anfrage-Assistenten.

## Verhalten

Serverseitige Abfrage der Google PageSpeed Insights API, Ergebnis als Kennzahlenkarten, dazu je Bereich in Worten, was Erik daran typischerweise verbessert. Die Zahlen beziehen sich nur auf die Seite des Besuchers.

## Akzeptanzkriterien

- AK-1: Ergebnis enthält Performance, Accessibility, SEO, Best Practices als Zahl und Text.
- AK-2: Ladezustand wird angesagt (`aria-live`).
- AK-3: Rate-Limit pro IP.
- AK-4: Call-to-Action übernimmt die URL in den Anfrage-Assistenten.
