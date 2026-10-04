# Blinder Kritiker

Status: Entwurf

## Zweck
Unabhängige Prüfung nach jeder Änderung durch einen Reviewer-Agenten, der die Implementierung **nicht** kennt („blind") und die Seite so erlebt, wie ein blinder Nutzer sie erlebt: nur über den Accessibility-Tree und die Tastatur.

## Ablauf
1. Wird nach grünen Tests gestartet, bekommt nur Preview-URL und diese Checkliste.
2. Liest die Seite per Playwright-Accessibility-Snapshot (kein Screenshot) und bedient sie nur per Tastatur.
3. Zweiter Durchgang mit Screenshot (360/1280 px) für Mobile und Design-Konsistenz.
4. Gibt Befunde als Liste aus: Thema, Schwere (hoch/mittel/niedrig), Fundstelle, Vorschlag.

## Checkliste
- **Screenreader:** Ergibt die Seite nur als Text Sinn? Überschriften-Gliederung, Linktexte ohne „hier klicken", Alt-Texte, Formular-Labels, Live-Ansagen
- **Tastatur:** alles erreichbar, sichtbarer Fokus, keine Fallen
- **Mobile:** Lesbarkeit, Zielgrößen, kein Overflow
- **SEO:** Title, Description, h1, interne Links, strukturierte Daten
- **GEO:** Beantwortet die Seite die naheliegenden Fragen direkt und zitierfähig?
- **Inhalt:** Versteht ein Kunde in 10 Sekunden, was Erik anbietet und was der nächste Schritt ist?
- **Behauptungen:** Steht nirgends eine unbelegte Zahl oder ein Versprechen?
- **Sprachen:** Sind DE und EN inhaltlich gleich, `lang` und `hreflang` korrekt?
- **Design:** Weicht etwas vom bestehenden Design ab?

## Akzeptanzkriterien
- AK-1: Läuft als Skript bzw. Agent-Prompt reproduzierbar gegen jede Preview-URL.
- AK-2: Befunde „hoch" blockieren den Merge.
