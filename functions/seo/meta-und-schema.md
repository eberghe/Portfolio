# Meta-Daten & strukturierte Daten

Status: In Arbeit

## Zweck

Jede Seite liefert Suchmaschinen und KI-Suchsystemen (ChatGPT, Perplexity, Google AI Overviews) sauber auslesbare Inhalte. Die Lovable-Seite rendert Inhalte nur per JavaScript; im HTML stehen nur Meta-Tags. Das ist der größte SEO-/GEO-Hebel des Umbaus.

## Verhalten

- Ein gemeinsamer Helfer `pageMetadata()` (`lib/seo.ts`) erzeugt für jede Seite Title, Description, Canonical, `hreflang`-Alternativen (de, en, x-default → de), Open Graph und Twitter Card. Seiten rufen nur diesen Helfer auf.
- Vorschaubild (`og:image`): Projekte ihr Titelbild, sonst das Porträt von der Startseite.
- Startseite: JSON-LD `Person` und `ProfessionalService` (Augsburg, Deutschland).
- `llms.txt` wird aus denselben Inhalten erzeugt wie die Seiten (Leistungen, Projekte), damit nichts veraltet.

## Akzeptanzkriterien

- AK-1: Jede Seite hat eindeutigen Title (≤ 70 Zeichen), Description (≤ 160), absolutes Canonical auf sich selbst, `hreflang` de/en/x-default, `og:title`, `og:description`, `og:url`, `og:image`, `og:locale` (de_DE/en_US) und `twitter:card`.
- AK-2: Startseite: JSON-LD `Person` und `ProfessionalService` mit `areaServed` (Augsburg, Deutschland).
- AK-3: Breadcrumbs mit `BreadcrumbList` auf Detailseiten (umgesetzt in `seiten/leistungen.md`, `seiten/projekte.md`).
- AK-4: Inhalt ist ohne JavaScript vollständig im HTML.
- AK-6: Eine Form je URL: die Startseite heißt überall `https://erik-bergheimer.de` (ohne Schrägstrich), in Canonical, hreflang, Sitemap und JSON-LD.
- AK-7: Person-JSON-LD hat `@id` (`/#person`), `email`, `alumniOf` (TH Ingolstadt), `knowsLanguage` (de, en), `workLocation` (Augsburg, Deutschland); `Service.provider` und `CreativeWork.author` verweisen auf dieselbe `@id`. `ProfessionalService` hat `email`.
- AK-8: `og:image` im Format 1200 × 630, höchstens 300 KB; Projekte `og:type=article`; englische Seiten `og:locale=en_GB` (britische Schreibweise).
- AK-9: Title der Startseite höchstens 60 Zeichen; Description 120 bis 160 Zeichen mit Ort und „kostenloses Erstgespräch". Beschreibungen der Leistungsseiten nennen Augsburg.
- AK-5: `/llms.txt` mit Kurzprofil und absoluten Links zu allen Leistungen und Projekten (DE und EN), erzeugt aus den Inhaltsdaten; nennt Kontakt (E-Mail, Erstgespräch), Arbeitsweise (vor Ort DE/AT oder remote), Sprachen und BFSG.
- AK-10: Hochschulen im Person-JSON-LD heißen wie auf der Seite („Technische Hochschule Ingolstadt“, „Management Center Innsbruck“ mit `alternateName` THI bzw. MCI) und verweisen per `sameAs` auf https://www.thi.de und https://www.mci.edu (Issue #10).
- AK-11: `/llms.txt` listet unter „## Pages“ auch Über mich (`/about`) und FAQ (`/faqs`); die Kontaktbeschreibung nennt nur, was die Seite bietet (Anfrage-Assistent, keine Direktkontakt-Liste mehr); kein Satzende mit doppelter Zeichensetzung wie „?.“ (Issue #10).

## Sprachen

`og:locale` und `og:locale:alternate` je Sprache; x-default zeigt auf die deutsche Seite.

## Tests

`tests/unit/seo.test.ts` (AK-1, AK-2, AK-5 bis AK-9), `tests/e2e/seo.spec.ts` (AK-1, AK-4, AK-5).

## Befunde Blinder Kritiker (Runde 1)

Behoben (mit Test): Startseite in drei URL-Formen (AK-6), JSON-LD-Entitäten nicht verknüpft, ohne E-Mail (AK-7), quadratisches 1,7-MB-Vorschaubild, en_US trotz britischer Schreibweise, og:type (AK-8), Title/Description der Startseite, Ort fehlt in Leistungs-Descriptions (AK-9), llms.txt ohne Kontakt und Arbeitsweise (AK-5), Sitemap ohne x-default (`sitemap-und-redirects.md` AK-1).

Bewusst so gelassen: `Disallow: /projekt-` schützt künftige geheime Angebotsseiten (`kontakt/angebotsseiten.md`). Keine Postanschrift im JSON-LD, solange Erik keine nennen will.

Offen: Seiten Über mich, Kontakt, FAQ, Impressum, Datenschutz (verlinkt, noch 404); FAQ-Abschnitte je Leistung (`seo/fragen-antworten.md`).

## Favicon (Erik, 2026-10-06)

Erik (mit „EB“-Logo, dunkel auf Weiß): „das bitte als favicon und in den tabs als image anzeigen oben.“

- AK-12: Jede Seite (DE und EN) verweist im `<head>` auf ein Favicon (`rel="icon"`, PNG mit Eriks „EB“-Logo, quadratisch mit weißem Grund, damit es auch in dunklen Tab-Leisten sichtbar ist) und auf ein `apple-touch-icon` (180 × 180). `/favicon.ico` liefert dasselbe Logo (für Browser und Dienste, die direkt danach fragen). Alle drei antworten mit Status 200.
