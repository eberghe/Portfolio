# Navigation & Footer

Status: In Arbeit

## Zweck

Globale Navigation und Footer wie auf der Lovable-Seite (`Navbar.tsx`, `Footer.tsx`, `Logo.tsx`), aber barrierefrei und zweisprachig über echte URLs.

## Bestand und Befunde (Lovable)

- Sprachumschalter ist ein Button mit Flagge, ändert nur den Browser-Zustand, keine URL.
- Mobiles Menü ist nur per `opacity` versteckt: Links bleiben per Tab erreichbar, obwohl unsichtbar. Burger-Button ohne `aria-expanded`.
- Dunkelmodus-Button ohne Zustand (`aria-pressed`), Wahl wird nicht gespeichert.
- Social-Icons im Footer sind Buttons ohne Funktion.
- Footer-Texte `white/40` und `white/35` auf `#0b1219` haben 3,8:1 bzw. 3,2:1 Kontrast.
- `aria-label="Main navigation"` auf Englisch auch auf deutschen Seiten.

## Verhalten

- Desktop: Logo, Links (Projekte, Services, Über mich, FAQs), Sprachlink, Dunkelmodus, Kontakt-Button. Aktiver Link markiert mit `aria-current="page"`.
- Mobil: Burger öffnet Vollbild-Menü. Geschlossen ist es per `hidden`/`inert` aus dem Tab-Fluss entfernt. Escape schließt und setzt den Fokus auf den Burger zurück.
- Navigation blendet sich beim Runterscrollen aus und beim Hochscrollen ein (wie bisher); bei `prefers-reduced-motion` ohne Animation.
- Sprachlink führt auf dieselbe Seite in der anderen Sprache (`/about` ↔ `/en/about`), Text „English" bzw. „Deutsch" mit passendem `lang`.
- Dunkelmodus: speichert die Wahl, beim ersten Besuch gilt `prefers-color-scheme`, kein Aufblitzen beim Laden.
- Footer: Links wie bisher, Social-Links als echte Links (Instagram, LinkedIn, E-Mail), „Nach oben"-Link zu `#inhalt`. Footer-Texte mindestens `white/60`.

## Akzeptanzkriterien

- AK-1: Navigation ist ein `nav` mit sprachrichtigem Namen („Hauptnavigation" / „Main navigation").
- AK-2: Der Link zur aktuellen Seite hat `aria-current="page"`.
- AK-3: Sprachlink zeigt auf das Gegenstück der aktuellen Seite; Text „English" (`lang="en"`) bzw. „Deutsch" (`lang="de"`).
- AK-4: Burger-Button hat `aria-expanded` und `aria-controls`; geschlossenes Menü ist nicht fokussierbar; Escape schließt das Menü und fokussiert den Burger.
- AK-5: Dunkelmodus-Button hat `aria-pressed`, setzt die Klasse `dark` am `html` und speichert die Wahl.
- AK-6: Footer-Social-Links sind Links mit Ziel (Instagram, `mailto:`), keine Buttons ohne Funktion.
- AK-7: Alle Texte in Navigation und Footer erreichen mindestens 4,5:1 (axe in hell und dunkel).
- AK-8: Alle Texte gibt es auf Deutsch und Englisch.
- AK-15: Im Dunkelmodus trennt eine dezente Linie (`white/10`) den Footer vom Inhalt.
- AK-17: Die Kopfzeile ist auf keiner Seite breiter als das Fenster (768 und 1280 px, DE und EN), auch mit hervorgehobenem aktivem Menüpunkt. Mona Sans läuft breiter als Inter, deshalb haben die Menülinks zwischen 768 und 1023 px weniger Innenabstand (`md:px-2.5 lg:px-3.5`). (AK-16, kein Umbruch der Menüpunkte, steht in `startseite.md`.)
- AK-18 (Issue #13): Ein Seitenwechsel über Logo oder Menü öffnet die neue Seite ganz oben (`scrollY` 0), auch von /about und /services aus. Ursache war `scroll-behavior: smooth` auf `<html>`: Next 16 schaltet das sanfte Scrollen beim Seitenwechsel nur mit `data-scroll-behavior="smooth"` am `<html>` ab; sonst überlagern sich die Scroll-Sprünge und die Startseite landet unter dem Hero.

## Sprachen (DE/EN)

Deutsch unter den bisherigen Pfaden, Englisch unter `/en/...` mit denselben Slugs. Texte in `lib/i18n.ts`.

## Tests

`tests/unit/i18n.test.ts` (AK-3 Pfadzuordnung, AK-8), `tests/unit/navigation.test.tsx` (AK-1 bis AK-6), `tests/e2e/navigation.spec.ts` (AK-4, AK-5, AK-7 im Browser).

## Offene Fragen

- (erledigt) LinkedIn ergänzt.

## Befunde Blinder Kritiker (2026-10-04) und Umsetzung

Behoben, jeweils mit Test:

- AK-9: Offenes Menü füllt den Bildschirm (vorher durch `backdrop-filter` am Header auf 32 px Höhe beschnitten); Menü liegt jetzt außerhalb des Headers.
- AK-10: Fokus bleibt im offenen Menü (Hintergrund `inert`, Tab läuft im Kreis).
- AK-11: Wechsel auf Desktop-Breite schließt das Menü und hebt die Scroll-Sperre auf.
- AK-12: Kein horizontales Scrollen bei 320 und 360 px in beiden Sprachen (Logo mobil kleiner, Sprachlink zeigt mobil „EN"/„DE", Screenreader hören den vollen Namen).
- AK-13: Icon-Links im Footer mobil mindestens 44×44 px, Textlinks mit mehr Klickfläche.
- AK-14: „Nach oben" führt ganz nach oben, Navigation wird sichtbar.
- `aria-current` auch im Footer, Footer-Links mobil ebenfalls in einer `nav`, „made with …" mit `lang="en"`, `color-scheme` folgt dem Dunkelmodus.

Offen, bewusst später:

- canonical, hreflang, robots.txt, sitemap.xml → `seo/meta-und-schema.md`, `seo/sitemap-und-redirects.md`
- Eigene zweisprachige 404-Seite mit Navigation → kommt mit den Unterseiten
- (erledigt, AK-15) Footer im Dunkelmodus mit dezenter Trennlinie, von Erik freigegeben
- Gleicher Seitentitel DE/EN → mit SEO-Funktion entscheiden

## Nachtrag

- Das Herz im Footer-Satz „made with 🤍 in augsburg" ist für Screenreader ausgeblendet und wird als „love" vorgelesen (der Satz ist als Englisch ausgezeichnet).
