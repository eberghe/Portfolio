import type { Locale } from '@/lib/i18n';

// Projekte, siehe functions/seiten/projekte.md.
// Texte aus dem Lovable-Projekt (src/lib/data.ts) übernommen; Typ, Rolle, deutsche Meta-Daten und Alt-Texte neu.
export interface ProjectSubsection {
  id: string;
  title: string;
  content: string;
}

export interface ProjectSection {
  id: string;
  title: string;
  content: string;
  subsections?: ProjectSubsection[];
}

export interface ProjectText {
  title: string;
  tagline: string;
  body: string;
  type: string;
  role: string;
  metaTitle: string;
  metaDescription: string;
  sections: ProjectSection[];
}

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
}

/** Kennzahl, nur mit Quelle (AK-2) */
export interface ProjectMetric {
  /** Wert, bei Bedarf je Sprache (Dezimalkomma) */
  value: string | Record<Locale, string>;
  label: Record<Locale, string>;
  /** Quelle, bei Bedarf je Sprache */
  source: string | Record<Locale, string>;
}

export interface Project extends Record<Locale, ProjectText> {
  slug: string;
  year: string;
  timeline?: string;
  tools: string;
  team?: string;
  thumbnail: { src: string; width: number; height: number; alt: Record<Locale, string> };
  /** Slug der passenden Leistung (AK-17) */
  service: string;
  gallery: ProjectImage[];
  /** Bilder unter einem Unterabschnitt, Schlüssel = id des Unterabschnitts */
  inlineImages: Record<string, ProjectImage[]>;
  download?: { url: string; label: Record<Locale, string> };
  metrics?: ProjectMetric[];
}

export const projects: Project[] = [
  {
    // Inhalte aus Eriks Masterarbeit (MCI Innsbruck, 2026), siehe functions/seiten/projekte.md AK-25 bis AK-28
    slug: 'prematch',
    year: '2026',
    timeline: '2026',
    tools: 'Figma · Flutter · Firebase · API-Sports',
    thumbnail: {
      src: '/images/project-prematch.jpg',
      width: 1920,
      height: 1080,
      alt: {
        de: 'Designsystem von PreMatch: Logo, Buttons, Farben mit kräftigem Primärblau, Icons in drei Zuständen, Abzeichen und die Schrift Inter',
        en: 'PreMatch design system: logo, buttons, colours with a strong primary blue, icons in three states, badges and the Inter typeface',
      },
    },
    service: 'ux-ui-design',
    gallery: [],
    inlineImages: {
      sketches: [
        {
          src: '/images/projects/prematch-sketch-home.jpg',
          width: 1232,
          height: 2000,
          alt: {
            de: 'Handskizze des Home-Screens: Karten oben, ein Spiel mit Ergebnis 1:0 und Tipp, darunter eine Tabelle und die Navigation',
            en: 'Hand sketch of the Home screen: cards at the top, a match with a 1:0 score and prediction, a table below and the navigation',
          },
        },
        {
          src: '/images/projects/prematch-sketch-tips.jpg',
          width: 1083,
          height: 2000,
          alt: {
            de: 'Handskizze des Screens „My Tips“: Reiter für Spieltage und eine Liste von Spielen mit Feldern für den Tipp',
            en: 'Hand sketch of the My Tips screen: matchday tabs and a list of matches with fields for the prediction',
          },
        },
      ],
      friction: [
        {
          src: '/images/projects/prematch-screen-details.png',
          width: 1143,
          height: 2343,
          alt: {
            de: 'Screen „Match Details“: Tipp 2:1 für Paris Saint-Germain gegen Arsenal, Siegwahrscheinlichkeit, Form und der Button „Hold to Save your Prediction“',
            en: 'Match Details screen: a 2:1 prediction for Paris Saint-Germain against Arsenal, victory probability, form and the “Hold to Save your Prediction” button',
          },
        },
        {
          src: '/images/projects/prematch-screen-why.png',
          width: 1143,
          height: 2343,
          alt: {
            de: 'Abfrage „Why this pick?“ nach dem Halten: Gründe wie Heimvorteil, starke Form oder Bauchgefühl zum Antippen, dazu „Save & Next Game“',
            en: '“Why this pick?” prompt after holding: tappable reasons such as home advantage, strong form or gut feeling, plus “Save & Next Game”',
          },
        },
      ],
    },
    metrics: [
      {
        value: { de: '90,0', en: '90.0' },
        label: { de: 'Usability (SUS, von 100)', en: 'Usability (SUS, out of 100)' },
        source: { de: 'Nutzerstudie der Masterarbeit, N = 10, 2026', en: 'User study of the thesis, N = 10, 2026' },
      },
      {
        value: '70',
        label: { de: 'Weiterempfehlung (NPS), keine Kritiker', en: 'Recommendation (NPS), no detractors' },
        source: { de: 'Nutzerstudie der Masterarbeit, N = 10, 2026', en: 'User study of the thesis, N = 10, 2026' },
      },
      {
        value: { de: '2,03', en: '2.03' },
        label: { de: 'Identität (AttrakDiff HQ-I, −3 bis 3)', en: 'Identity (AttrakDiff HQ-I, −3 to 3)' },
        source: { de: 'Nutzerstudie der Masterarbeit, N = 10, 2026', en: 'User study of the thesis, N = 10, 2026' },
      },
    ],
    de: {
      title: 'PreMatch',
      tagline: 'Eine Tipp-App für Fußball, die zum Nachdenken einlädt',
      body: 'Für meine Masterarbeit am MCI Innsbruck habe ich PreMatch entworfen und gebaut: eine App, in der Freunde in privaten Ligen Fußballergebnisse tippen. Der Markt hat zwei Extreme. Kicktipp hält seine Nutzer vor allem, weil die Freunde schon dort sind. Wett-Apps wie Tipico nutzen oft Muster, die schnelles Tippen fördern.\n\nPreMatch liegt dazwischen. Die App nimmt Motivation ernst, ohne sie auszunutzen. Kern ist „Positive Friction“: Ein Tipp wird gespeichert, indem man den Button gedrückt hält, danach fragt die App kurz nach dem Grund.',
      type: 'UX/UI · App-Design · Masterarbeit',
      role: 'Forschung, UX/UI-Design und Entwicklung',
      metaTitle: 'PreMatch: Fußball-Tipp-App, Masterarbeit UX | Erik Bergheimer',
      metaDescription:
        'Masterarbeit: eine Tipp-App für Fußball mit Positive Friction. Benchmarking von vier Apps, Design in Figma, App in Flutter und Nutzerstudie mit SUS 90.',
      sections: [
        {
          id: 'problem',
          title: 'Ausgangslage',
          content:
            'Tipp-Apps für Fußball sind eine vernachlässigte Nische der Sporttechnologie. Kicktipp führt im deutschsprachigen Raum vor allem dank Netzwerkeffekten. Kommerzielle Wett-Apps investieren viel in Gestaltung, aber oft mit „Dark Nudges“, die Nachdenken unterdrücken und impulsives Verhalten ausnutzen.\n\nDie Frage der Arbeit: Wie lassen sich Prinzipien der Self-Determination Theory (Autonomie, Kompetenz, Verbundenheit) und Positive Friction in eine Tipp-App einbauen, damit das Erlebnis besser wird als der heutige Marktstandard? Methode war Design Science Research in drei Phasen.',
        },
        {
          id: 'benchmarking',
          title: 'Phase I: Benchmarking',
          content:
            'Ich habe vier Apps verglichen: Kicktipp, Tackle, Teamtip und Tipico. Grundlage waren die Gameful Design Heuristics mit 28 Motivationsdimensionen, bewertet auf einer Skala von 1 bis 5 und von einer zweiten Person gegengeprüft.\n\nAm schwächsten schnitt der ganze Markt bei „Social & Community“ (Mittelwert 2,10) und „Immersion & Narrative“ (2,25) ab. Das ist keine Kritik an einer App, sondern eine Beschreibung dessen, was der Markt noch nicht gebaut hat. Genau diese Lücken wurden zur Prioritätenliste für das Design.',
        },
        {
          id: 'design',
          title: 'Phase II: Design und Umsetzung',
          content:
            'Die zentralen Designentscheidungen lassen sich auf eine Lücke aus dem Benchmarking zurückführen. Der Weg führte von Skizzen auf Papier über einen Prototyp in Figma zu einer funktionierenden App in Flutter.',
          subsections: [
            {
              id: 'sketches',
              title: 'Skizzen',
              content:
                'Die ersten Entwürfe entstanden bewusst auf Papier, damit es nur um Struktur und Reihenfolge der Inhalte ging, nicht um Farben. Der Home-Screen zeigt den eigenen Stand, das laufende Spiel mit dem eigenen Tipp und die Tabelle der Liga. „My Tips“ ist die Liste der Spiele eines Spieltags, in der man tippt.',
            },
            {
              id: 'design-system',
              title: 'Designsystem',
              content:
                'Das Designsystem baut auf einem kräftigen Blau (#304FFF), der Schrift Inter und Farben mit klarer Bedeutung auf: Grün für richtig, Rot für falsch. Icons gibt es in drei Zuständen. Abzeichen wie „Tactician“ für eine perfekte Aufstellung oder „The Oracle“ für zehn exakte Ergebnisse belohnen Können statt bloßes Einloggen. Vereinswappen und Tabellen sollen das Gefühl eines echten Spieltags tragen.',
            },
            {
              id: 'friction',
              title: 'Positive Friction',
              content:
                'Die wichtigste Entscheidung: Ein Tipp wird nicht mit einem Tippen gespeichert, sondern durch Gedrückthalten. Danach erscheint „Why this pick?“ mit Gründen wie Heimvorteil, Form oder Bauchgefühl. Die Angabe ist freiwillig und zeigt der Liga, wie man denkt. So entsteht ein kurzer Moment zum Nachdenken, statt dass man impulsiv tippt.\n\nTechnisch ist die App in Flutter gebaut. Spieldaten kommen von API-Sports, Anmeldung, Ligen, Tipps, Chat und Abzeichen laufen über Firebase. Rangliste und Chat aktualisieren sich live.',
            },
          ],
        },
        {
          id: 'study',
          title: 'Phase III: Nutzerstudie',
          content:
            'Zehn Personen haben die App zwischen dem 16. Mai und dem 7. Juni 2026 getestet, mit Fragebögen (SUS, AttrakDiff, INTUI, NPS) und einem Gespräch danach.\n\nDie Usability lag mit einem SUS von 90,0 im Bereich „exzellent“. AttrakDiff zeigte ein Profil, das vor allem über Freude und Identität wirkt (HQ-I 2,03). Das deutet darauf hin, dass sich die Teilnehmenden mit der App identifizieren konnten. Alle vier Skalen von INTUI lagen über der Mitte, das Bauchgefühl am höchsten (5,30 auf einer Skala von 1 bis 7). Der NPS lag bei 70 ohne Kritiker. Zusammen stützen die Ergebnisse vorsichtig die Annahme, dass Positive Friction das Erlebnis aufwerten kann, ohne Usability und Intuition zu schaden.',
        },
        {
          id: 'limits',
          title: 'Grenzen und Ausblick',
          content:
            'Mit zehn Personen sind die Ergebnisse Hinweise, keine Beweise. Es gab keine Vergleichsversion ohne Friction, und die Studie zeigt nur den ersten Eindruck. Ob das Gedrückthalten über eine ganze Saison seinen Effekt behält, bleibt offen. Vereinswappen bräuchten für eine echte Veröffentlichung Lizenzen.\n\nDie größte praktische Frage: Wechselt eine ganze Freundesgruppe mit ihrer Liga-Geschichte zu einer neuen App? Als Nächstes wären eine Feldstudie über eine Saison und eine Friction, die sich dem Tipp-Verhalten anpasst, spannend. Das Muster aus Gedrückthalten und kurzer Begründung lässt sich auch auf andere Bereiche übertragen, in denen impulsives Verhalten echte Kosten hat.',
        },
      ],
    },
    en: {
      title: 'PreMatch',
      tagline: 'A football prediction app that invites reflection',
      body: "For my master's thesis at MCI Innsbruck, I designed and built PreMatch: an app where friends predict football results in private leagues. The market has two extremes. Kicktipp keeps its users mainly because their friends are already there. Betting apps like Tipico often use patterns that encourage fast betting.\n\nPreMatch sits in between. It takes motivation seriously without exploiting it. At its core is “Positive Friction”: you save a prediction by holding the button, then the app briefly asks for your reason.",
      type: "UX/UI · App design · Master's thesis",
      role: 'Research, UX/UI design and development',
      metaTitle: "PreMatch: football prediction app, master's thesis | Erik Bergheimer",
      metaDescription:
        "Master's thesis: a football prediction app with Positive Friction. Benchmark of four apps, Figma design, Flutter app and a user study with SUS 90.",
      sections: [
        {
          id: 'problem',
          title: 'Starting point',
          content:
            'Social football prediction apps are a neglected corner of sports technology. Kicktipp leads the German-speaking market mainly thanks to network effects. Commercial betting apps invest heavily in design, but often with dark nudges that suppress reflection and exploit impulsive behaviour.\n\nThe research question: how can principles of Self-Determination Theory (autonomy, competence, relatedness) and Positive Friction be built into a prediction app so that the experience exceeds the current market standard? The method was Design Science Research in three phases.',
        },
        {
          id: 'benchmarking',
          title: 'Phase I: Benchmarking',
          content:
            'I compared four apps: Kicktipp, Tackle, Teamtip and Tipico. The basis was the Gameful Design Heuristics with 28 motivational dimensions, rated on a scale from 1 to 5 and cross-checked by a second coder.\n\nThe whole market scored lowest on Social & Community (mean 2.10) and Immersion & Narrative (2.25). That is not a critique of one app but a description of what the market has not built yet. Exactly these gaps became the priority list for the design.',
        },
        {
          id: 'design',
          title: 'Phase II: Design and build',
          content:
            'The key design decisions trace back to a gap from the benchmark. The path led from paper sketches to a Figma prototype to a working Flutter app.',
          subsections: [
            {
              id: 'sketches',
              title: 'Sketches',
              content:
                'The first drafts were deliberately made on paper, so the focus stayed on structure and order of content, not colour. The Home screen shows your standing, the live match with your prediction and the league table. My Tips is the list of a matchday’s fixtures where you enter your predictions.',
            },
            {
              id: 'design-system',
              title: 'Design system',
              content:
                'The design system is built on a strong blue (#304FFF), the Inter typeface and colours with clear meaning: green for right, red for wrong. Icons come in three states. Badges such as Tactician for a perfect line-up or The Oracle for ten exact scores reward skill rather than just logging in. Club crests and tables aim to carry the feel of a real matchday.',
            },
            {
              id: 'friction',
              title: 'Positive Friction',
              content:
                'The key decision: a prediction is not saved with a tap but by holding the button. Then “Why this pick?” appears with reasons such as home advantage, form or gut feeling. It is optional and shows your league how you think. This creates a short moment of reflection instead of an impulsive prediction.\n\nTechnically, the app is built in Flutter. Match data comes from API-Sports; sign-in, leagues, predictions, chat and badges run on Firebase. Leaderboard and chat update live.',
            },
          ],
        },
        {
          id: 'study',
          title: 'Phase III: User study',
          content:
            'Ten people tested the app between 16 May and 7 June 2026, with questionnaires (SUS, AttrakDiff, INTUI, NPS) and a debrief interview.\n\nUsability reached a SUS of 90.0, in the excellent range. AttrakDiff showed a profile driven mainly by joy and identity (HQ-I 2.03), which suggests participants identified with the app. All four INTUI scales were above the midpoint, with gut feeling highest (5.30 on a scale of 1 to 7). The NPS was 70 with no detractors. Together, the results tentatively support the idea that Positive Friction can lift the experience without hurting usability or intuitiveness.',
        },
        {
          id: 'limits',
          title: 'Limits and outlook',
          content:
            'With ten participants, the results are indications, not proof. There was no comparison version without friction, and the study only captures first use. Whether holding to save keeps its effect over a whole season remains open. Club crests would need licences for a public release.\n\nThe biggest practical question: will a whole friend group move to a new app along with its league history? Next steps could be a field study across a full season and friction that adapts to how someone tips. The pattern of holding and a short reason also transfers to other areas where impulsive behaviour has real costs.',
        },
      ],
    },
  },
  {
    slug: 'cpr',
    year: '2020–2021',
    timeline: '10/2020 – 01/2021',
    tools: 'Photoshop, Illustrator, AfterEffects, PremierePro, XD',
    team: 'Dominik Dumberger, Martin Ferstl',
    thumbnail: {
      src: '/images/project-cpr.jpg',
      width: 1920,
      height: 977,
      alt: {
        de: 'Smartphones mit Screens der CPR-Trainings-App: Login, Training und Statistik',
        en: 'Smartphones showing screens of the CPR training app: login, training and statistics',
      },
    },
    service: 'ux-ui-design',
    gallery: [],
    inlineImages: {
      personae: [
        {
          src: '/images/projects/cpr-amy.jpg',
          width: 1222,
          height: 816,
          alt: {
            de: 'Persona Amy Average: 13-jährige Schülerin, kontaktfreudig, wenig motiviert',
            en: 'Persona Amy Average: 13-year-old pupil, outgoing, not very motivated',
          },
        },
        {
          src: '/images/projects/cpr-arthur.jpg',
          width: 1278,
          height: 856,
          alt: {
            de: 'Persona Arthur Ambitious: junger, technikbegeisterter Lehrer mit wenig CPR-Erfahrung',
            en: 'Persona Arthur Ambitious: young, tech-savvy teacher with little CPR experience',
          },
        },
        {
          src: '/images/projects/cpr-cooper.jpg',
          width: 1280,
          height: 858,
          alt: {
            de: 'Persona Cooper Curious: sehr motivierter, introvertierter Schüler',
            en: 'Persona Cooper Curious: highly motivated, introverted pupil',
          },
        },
        {
          src: '/images/projects/cpr-holly.jpg',
          width: 1278,
          height: 856,
          alt: {
            de: 'Persona Holly Helpful: Ärztin mit viel CPR-Erfahrung, wenig technikaffin',
            en: 'Persona Holly Helpful: doctor with strong CPR skills, not very tech-savvy',
          },
        },
      ],
    },
    de: {
      title: 'CPR Training AR App',
      tagline: 'Mit Augmented Reality Kinder zu Lebensrettern ausbilden',
      body: 'CPR steht für Cardiopulmonary Resuscitation (kardiopulmonale Reanimation), eine lebensrettende Notfallmaßnahme. Wir wollten Kindern beibringen, diese Technik zu erlernen und zu potentiellen Lebensrettern zu werden.',
      type: 'UX/UI · App-Design',
      role: 'UX-Designer, Interface-Designer',
      metaTitle: 'CPR Training AR App: Erste Hilfe für Kinder mit AR | Erik Bergheimer',
      metaDescription:
        'UX/UI-Uniprojekt: eine AR-App, mit der Kinder Wiederbelebung lernen. Meine Rolle: Konzept, Wireframes und UI für die Lehrer-App und die AR-Oberfläche.',
      sections: [
        {
          id: 'overview',
          title: 'Übersicht',
          content: '',
          subsections: [
            {
              id: 'problem',
              title: 'Problem',
              content:
                'Zahllose Beispiele belegen, dass Kinder durch CPR Leben retten können. 2009 berichtete ABC News, dass Kinder ab 9 Jahren die Grundlagen der CPR erlernen können. Das bedeutet, dass junge Kinder CPR erlernen und durchführen können, aber aufgrund fehlender Lehrmethoden mussten wir eine digitale Lösung entwickeln.',
            },
            {
              id: 'solution',
              title: 'Lösung',
              content:
                'Wir haben uns entschieden, zwei verschiedene Apps zu designen: eine Oberfläche für den CPR-Lehrer, der ein Smartphone nutzt, und eine Oberfläche für die Kinder. In unserem Fall kamen wir auf die Idee, AR-Brillen für die Kinder zu verwenden. Die Oberfläche für die Kinder sollte also eine AR-Oberfläche sein.',
            },
            {
              id: 'process',
              title: 'Unser Prozess',
              content:
                'Vorbereitungsphase: Brainstorming, Personae, Paperprototyping, Moodboard\nDesignphase: Wireframes, Digitale Prototypen\nFinalisierung: Storyboard, Film, Fazit',
            },
          ],
        },
        {
          id: 'preparing',
          title: 'Vorbereitungsphase',
          content: '',
          subsections: [
            {
              id: 'brainstorming',
              title: 'Brainstorming',
              content:
                'Der allererste Schritt, als wir uns im Oktober 2020 trafen, war ein Brainstorming über das Thema und intensive Recherche zur CPR. Zu Beginn hatten wir viele Ideen, z.B. mehrere iPads für die Kinder, aber dann kam die Idee einer AR-Erfahrung auf. Mit solchen AR-Brillen wäre es möglich, das Training für die CPR-Technik durchzuführen, während die AR-Oberfläche dem Kind nützliche Informationen über sein Training geben könnte. Es war uns sehr wichtig, nur die wichtigsten Informationen auf dieser Oberfläche anzuzeigen. Für die Lehrer-Oberfläche mussten wir recherchieren, wie viele Drücke man in einem Zyklus machen sollte (30 Drücke), wie oft man eine Mund-zu-Mund-Beatmung durchführen sollte (2 Mal) und weitere Fakten zur CPR-Technik.',
            },
            {
              id: 'personae',
              title: 'Personae',
              content:
                'Der nächste Schritt war die Definition unserer Zielgruppe durch die Erstellung von Personae. Eine Persona symbolisiert einen Prototyp für eine Gruppe von Nutzern und hat persönliche Gewohnheiten, Eigenschaften und Nutzungsverhalten.\n\nAuf der einen Seite gibt es Amy Average, ein typisches 13-jähriges Mädchen, extrovertiert, liebt die Schule wegen ihrer Freunde, aber nicht besonders motiviert. Sie repräsentiert eine unmotivierte Zielgruppe der Kinder. Dann gibt es Cooper Curious, einen supermotivierten Jungen, der lernen und besser werden möchte, aber introvertiert ist.\n\nAuf der anderen Seite gibt es Holly Helpful, eine Ärztin mittleren Alters, sehr gut in CPR-Techniken, aber nicht besonders technikaffin. Und Arthur Ambitious, einen sehr jungen Lehrer, der ein Tech-Nerd ist, aber nicht so gut in CPR-Techniken.',
            },
            {
              id: 'paperprototyping',
              title: 'Paperprototyping',
              content:
                'Der nächste Schritt in unserem UX-Prozess war die Erstellung erster Interface-Ideen und ein Gefühl dafür zu bekommen, wie Konzept und Layout unserer App aussehen könnten. Das Zeichnen dieser rohen Skizzen auf Papier ist eine sehr effektive und schnelle Methode, um Ideen zu entwickeln, bevor man zu früh in einem Prototyping-Tool mit dem Design beginnt.\n\nWir begannen mit dem Skizzieren und der Entwicklung einiger Ideen. Im ersten Bild sehen Sie unsere ersten Ideen, also rohe Skizzen und einige Layout-Ideen. Das zweite Bild zeigt unsere finalen Paperprototypes für die AR-App und das dritte unsere finale Idee für die Lehrer-App.',
            },
            {
              id: 'moodboard',
              title: 'Moodboard',
              content:
                'Der letzte Schritt in der Vorbereitungsphase war die Erstellung eines Moodboards. Ein Moodboard ist ein sehr wichtiges Werkzeug in Designprozessen. Es hilft, einen Eindruck davon zu bekommen, wie das finale Projekt aussehen wird.\n\nIn unserem Fall mussten wir drei verschiedene Moodboards erstellen: eines nur mit Adjektiven, eines mit allgemeinen Bildern wie Natur, Architektur etc. und eines nur mit User Interfaces. Mit Tools wie Dribbble und designinspiration.com fanden wir einige großartige Beispielbilder.',
            },
          ],
        },
        {
          id: 'designing',
          title: 'Designphase',
          content: '',
          subsections: [
            {
              id: 'wireframes',
              title: 'Wireframes',
              content:
                'Der erste Schritt in der Designphase war die Erstellung von Wireframes! Wireframes sind ebenfalls Skizzen, aber viel präziser als rohe Paperprototypes. Nach dem Erstellen unserer Paperprototypes erhielten wir Feedback und änderten einige Details.\n\nEin wichtiger Teil war das Nachdenken über Interaktionen zwischen den verschiedenen Skizzen: "Welcher Button muss gedrückt werden, um zu diesem Screen zu kommen?". Wir verbanden die Screens miteinander und verwendeten orangefarbene Sticker für Links zu anderen Screens und grüne Sticker für Animationen auf demselben Screen.',
            },
            {
              id: 'digital-prototypes',
              title: 'Digitale Prototypen',
              content:
                'Nachdem Inhalt und Interaktionen zwischen den Screens fertig waren, konnten wir digital werden! Digitale Prototypen sind eine sehr wichtige Form des Prototypings und realistisch genug, um die meisten Interface-Elemente zu testen.\n\nUnter all den verschiedenen Prototyping-Tools wie Figma, Framer oder InVision wählten wir Adobe XD, weil die Zusammenarbeit mit Adobe Illustrator und Adobe Photoshop viel besser ist als mit anderen Tools.',
            },
          ],
        },
        {
          id: 'finalization',
          title: 'Finalisierung',
          content: '',
          subsections: [
            {
              id: 'storyboard',
              title: 'Storyboard',
              content:
                'Nachdem unsere digitalen und klickbaren Prototypen fertig waren, konnten wir mit den letzten Schritten weitermachen. Um die verschiedenen Anwendungsfälle unserer App zu erklären, mussten wir einen Film erstellen. Es ist immer sinnvoll, die Geschichte zu planen, bevor man filmt, also begannen wir mit einem Storyboard.\n\nEin Storyboard bietet einen schematischen Überblick über die Grundstruktur des Projekts. Die wichtigsten Fragen: Wann und wo spielt die Geschichte? In welcher Reihenfolge passieren die Ereignisse? Welche Screens wollen wir zeigen?',
            },
            {
              id: 'movie',
              title: 'Finaler Film',
              content:
                'Der allerletzte Schritt war das Filmen und Schneiden des finalen Films über unser Projekt. Der Film dauert nur zwei Minuten, also mussten wir sicherstellen, dass die Informationen schnell präsentiert werden. Wir erstellten unseren Film in Adobe Premiere Pro und die Animationen in Adobe After Effects.\n\nBesonderer Dank an Jonas Fischer fürs Schauspielern, an Anja Happernagl fürs Ausleihen der Puppe und an die Evangelische Gemeinschaft Königsbrunn für die Räumlichkeiten!',
            },
            {
              id: 'conclusion',
              title: 'Fazit',
              content:
                'Wir haben während dieses Projekts viel gelernt! Wir begannen mit Brainstorming und danach waren wir wirklich begeistert. Das Zeichnen von Skizzen war ein wichtiger Teil des UX-Prozesses, bei dem wir anfangs etwas kämpften.\n\nAufgrund der Covid-19-Pandemie war dieses Projekt besonders. Zunächst begannen wir mit Präsenzunterricht, aber sobald der Shutdown Realität war, wechselten wir zu Online-Vorlesungen. Trotzdem war das Ergebnis sehr gut und interessant!',
            },
          ],
        },
      ],
    },
    en: {
      title: 'CPR Training AR App',
      tagline: 'Teaching kids lifesaving skills through Augmented Reality',
      body: 'CPR stands for Cardiopulmonary Resuscitation, a life-saving emergency procedure. We wanted to help kids learn this technique to become potential lifesavers.',
      type: 'UX/UI · App design',
      role: 'UX designer, interface designer',
      metaTitle: 'CPR Training AR App: teaching kids CPR with AR | Erik Bergheimer',
      metaDescription:
        "University UX/UI project: an AR app that teaches children CPR. My role: concept, wireframes and UI for the teacher app and the kids' AR interface.",
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          content: '',
          subsections: [
            {
              id: 'problem',
              title: 'Problem',
              content:
                'Countless examples demonstrate that children can save lives by performing CPR. In 2009, ABC News reported that children as young as 9 years old can learn the basics of CPR. That means that young kids can learn and perform CPR but due to the lack of ways to teach them this technique, we had to come up with a digital solution.',
            },
            {
              id: 'solution',
              title: 'Solution',
              content:
                "We decided to design two different apps, one interface for the CPR teacher, who's gonna use a smartphone and one interface for the kids. In our case we came up with the idea of using AR goggles for the kids, so the interface for the kids should be an AR interface.",
            },
            {
              id: 'process',
              title: 'Our Process',
              content:
                'Preparing Phase: Brainstorming, Personae, Paperprototyping, Moodboard\nDesigning Phase: Wireframes, Digital prototypes\nFinalizations: Storyboard, Movie, Conclusion',
            },
          ],
        },
        {
          id: 'preparing',
          title: 'Preparing Phase',
          content: '',
          subsections: [
            {
              id: 'brainstorming',
              title: 'Brainstorming',
              content:
                'The very first step, when we first met in October 2020 was to brainstorm about this topic and doing a lot of research on CPR. At the very beginning we came up with a lot of ideas e.g. using multiple iPads for the kids but then the idea of an AR experience for the kids came up. With these type of AR goggles on, it would be possible to perform the training for the CPR technique, while the AR interface could give the kid useful informations about his or her training. It was very important for us, that we only display the most important informations on this interface.',
            },
            {
              id: 'personae',
              title: 'Personae',
              content:
                "The next step in our project was to define our target group with creating Personae. A persona symbolizes a prototype for a group of users and has personal habits, characteristics and usage behaviours.\n\nOn the one hand there's Amy Average, a typical 13-year-old girl, very extrovert, loves school because she can talk to her friends. She represents an unmotivated target group. Then there's Cooper Curious, a super motivated boy who wants to learn and help people, but introverted.\n\nOn the other hand there's Holly Helpful, a middle-aged medic, very good at CPR but not tech-savvy. And Arthur Ambitious, a very young teacher, a tech nerd but not great at CPR techniques.",
            },
            {
              id: 'paperprototyping',
              title: 'Paperprototyping',
              content:
                "The next step in our UX process was to create first ideas of an interface. Drawing raw sketches on paper is a very effective and fast method to create ideas before starting to design too early in a prototyping tool.\n\nWe started sketching and creating some ideas of how our app could look like. The first picture shows our first raw ideas and layout concepts. The second picture shows our final paper prototypes for the AR app and the third our final idea for the teacher's app.",
            },
            {
              id: 'moodboard',
              title: 'Moodboard',
              content:
                'The last step in the preparing phase was to create a moodboard. A moodboard is a very important tool in design processes. It helps to get a hint of how the final project will look like.\n\nIn our case, we had to design three different moodboards: one with only adjectives, one with general images like nature, architecture etc. and one with user interfaces only. With awesome tools like Dribbble and designinspiration.com we found some great example pictures.',
            },
          ],
        },
        {
          id: 'designing',
          title: 'Designing Phase',
          content: '',
          subsections: [
            {
              id: 'wireframes',
              title: 'Wireframes',
              content:
                'The first step in the designing phase is creating wireframes! Wireframes are sketches that are a lot more precise and exact than raw paper prototypes. After creating our paper prototypes, we got feedback and changed some details.\n\nAn important part was thinking about interactions between the different screens: "Which button has to be pressed to get to this screen?". We connected the screens and used orange stickers for links to other screens and green stickers for animations on the same screen.',
            },
            {
              id: 'digital-prototypes',
              title: 'Digital Prototypes',
              content:
                'Now that the content and the interactions between the screens were done, we could proceed with going digital! Digital prototypes are realistic enough to test most of the interface elements.\n\nUnder all the different prototyping tools like Figma, Framer or InVision we picked Adobe XD, because the collaboration with Adobe Illustrator and Adobe Photoshop is a lot better than with other common tools.',
            },
          ],
        },
        {
          id: 'finalization',
          title: 'Finalizations',
          content: '',
          subsections: [
            {
              id: 'storyboard',
              title: 'Storyboard',
              content:
                "Now that our digital and clickable prototypes were done, we could proceed with the last steps. To explain the different use cases of our app, we had to create a movie. It's always useful to plan your story before you film it, so we started creating a storyboard.\n\nA storyboard provides a schematic overview of the basic structure of the project. The most important questions: When and where does the story take place? In which order do events happen? What are the screens we want to show?",
            },
            {
              id: 'movie',
              title: 'Final Movie',
              content:
                'The very last step was to film and cut the final movie about our project. The duration was only two minutes so we had to make sure the information was presented quickly. We created our movie in Adobe Premiere Pro and the animations in Adobe After Effects.\n\nSpecial thanks to Jonas Fischer for acting, to Anja Happernagl for lending us the mannequin and to the Evangelische Gemeinschaft Königsbrunn for the rooms!',
            },
            {
              id: 'conclusion',
              title: 'Conclusion',
              content:
                'We think we learned a lot during this project! We started with brainstorming and were really excited. Drawing sketches, a very important part of UX processes, was something we struggled with at first.\n\nDue to the Covid-19 pandemic, this project was very special. At first we started with presence classes, but as soon as the shutdown was reality, we moved to online lessons. Despite this, the outcome was very good and interesting!',
            },
          ],
        },
      ],
    },
  },
  {
    slug: 'sightkick',
    year: '2024',
    timeline: '10/2024 – 12/2024',
    tools: 'Figma, Google Docs, Google Meet',
    team: 'Tobias Brzezowsky, Johannes Erath, Atte Tuliara, Jonas Rümmele, Sami Agha Ali Nouri, Michael Grameiser',
    thumbnail: {
      src: '/images/project-sightkick.jpg',
      width: 1920,
      height: 977,
      alt: {
        de: "Moodboard zu SIGHT'KICK: Innsbrucker Altstadt, Seilbahn, Bergsee, Logo, Schrift und App-Screen",
        en: "SIGHT'KICK moodboard: Innsbruck old town, cable car, mountain lake, logo, typeface and app screen",
      },
    },
    service: 'ux-ui-design',
    gallery: [],
    inlineImages: {},
    de: {
      title: "SIGHT'KICK",
      tagline: 'Gamifizierte Stadterkundung für Innsbruck',
      body: 'Dieses Masterprojekt im Kurs "Marketing & Sales" konzentrierte sich auf die Konzeption und Gestaltung einer mobilen App, die das touristische Erlebnis in Innsbruck revolutionieren soll. Meine Rolle war vielseitig: UX/UI Designer, Konzeptentwickler und Designer der finalen Präsentation.',
      type: 'UX/UI · Gamification · Masterprojekt',
      role: 'UX/UI-Designer',
      metaTitle: "SIGHT'KICK: Stadterkundung als Spiel in Innsbruck | Erik Bergheimer",
      metaDescription:
        "SIGHT'KICK ist ein App-Konzept, das Reisenden Innsbruck spielerisch zeigt. Als UX/UI-Designer und Konzeptentwickler habe ich das Erlebnis gestaltet.",
      sections: [
        {
          id: 'challenge',
          title: 'Die Herausforderung',
          content:
            'Traditionelles Sightseeing wird oft durch typische Probleme erschwert: begrenzte Zeit, Informationsüberflutung und Schwierigkeiten, sich in neuen Städten zurechtzufinden. Meine Aufgabe war es, ein Erlebnis zu schaffen, das mühsame Planung durch spontane, aber geführte Entdeckung ersetzt. Das Ziel: „Lerne Innsbruck kennen wie niemand sonst!“',
        },
        {
          id: 'solution',
          title: 'Meine Lösung',
          content:
            "Die Kernlösung SIGHT'KICK ist eine kostenlose mobile App, die Stadterkundung in ein interaktives Abenteuer für alle Reisetypen verwandelt. Das Design basiert auf fünf Wertesäulen:",
          subsections: [
            {
              id: 'personalized',
              title: 'Personalisierte Erkundung',
              content:
                'Nutzer können ihre Abenteuer nach Interessen anpassen (z.B. Geschichte, Essen, Berge, Familie). So entdeckt die App versteckte Juwelen und Erlebnisse abseits der Touristenpfade.',
            },
            {
              id: 'map',
              title: 'Interaktive Karte',
              content:
                'Die App enthält eine Karte, die ein Gefühl des Abenteuers fördert, indem neue Bereiche enthüllt werden, während der Nutzer erkundet, weit über Standard-Navigation hinaus.',
            },
            {
              id: 'gamification',
              title: 'Gamifiziertes Erlebnis',
              content:
                "Erkundung wird zu einer fortlaufenden Quest: Nutzer sammeln Punkte, Badges (wie den 'Explorer's Compass Award') und Belohnungen für abgeschlossene Challenges.",
            },
            {
              id: 'offers',
              title: 'Exklusive Angebote',
              content:
                'Nutzer erhalten Zugang zu exklusiven Rabatten und Angeboten lokaler Unternehmen und Attraktionen.',
            },
            {
              id: 'social',
              title: 'Teilen in sozialen Medien',
              content:
                'Integrierte Funktionen ermöglichen es, Abenteuer mit Freunden und Familie in sozialen Medien zu teilen.',
            },
          ],
        },
        {
          id: 'contribution',
          title: 'Mein Beitrag: UX/UI und Design',
          content: '',
          subsections: [
            {
              id: 'concept-design',
              title: 'Konzeptionelles Design',
              content:
                'Ich war verantwortlich für das gesamte Feature-Set, den User Flow und die Informationsarchitektur, um sicherzustellen, dass die App die identifizierten UX-Probleme effektiv löst.',
            },
            {
              id: 'visual-design',
              title: 'Visuelles Design',
              content:
                'Als UI Designer entwickelte ich das Interface (inkl. interaktive Karte und Schnellnavigation), bewusst angepasst an das Innsbruck Design System (Farben und Typografie). Das gewährleistet lokale Authentizität und starke Markenkohäsion.',
            },
            {
              id: 'slide-design',
              title: 'Präsentationsdesign',
              content:
                'Ich gestaltete die finale Präsentation mit Fokus auf visuelle Klarheit, starken Kontrast und effektive Informationshierarchie.',
            },
          ],
        },
        {
          id: 'reflection',
          title: 'Reflexion & Erkenntnisse',
          content:
            'Dieses Projekt lieferte entscheidende Erfahrung in der Integration komplexer strategischer Anforderungen in ein einfaches, nutzerzentriertes mobiles Design.',
          subsections: [
            {
              id: 'ux-efficiency',
              title: 'Effizienz in UX/UI',
              content:
                'Der Einsatz von Tools wie Figma war essenziell für die extrem schnelle Erstellung von Low-Fidelity-Prototypen und gab dem Team kreative Freiheit zum frühen Erkunden von Designlösungen.',
            },
            {
              id: 'concept-integration',
              title: 'Konzeptintegration',
              content:
                'Eine wichtige Erkenntnis war, wie man Business-Strategie (z.B. Wettbewerbsanalyse mit dem GAMP5-Framework) direkt in Designentscheidungen übersetzt, die die USP unterstützen.',
            },
            {
              id: 'future-vision',
              title: 'Zukunftsvision',
              content:
                'Das Design ist auf die Mission ausgerichtet, Nutzern zu helfen, „langanhaltende Erinnerungen aufzubauen." Das Produkt ist für zukünftiges Wachstum strukturiert, mit einem klaren Expansionspfad zu anderen Standorten wie München oder Salzburg.',
            },
          ],
        },
      ],
    },
    en: {
      title: "SIGHT'KICK",
      tagline: 'Gamified city discovery app for Innsbruck',
      body: 'This Master\'s project from the course "Marketing & Sales" focused on conceptualizing and designing a mobile application to revolutionize how tourists experience Innsbruck. My role was multifaceted: UX/UI Designer, Concept Developer, and Designer of the final presentation slides.',
      type: "UX/UI · Gamification · Master's project",
      role: 'UX/UI designer',
      metaTitle: "SIGHT'KICK: gamified city discovery for Innsbruck | Erik Bergheimer",
      metaDescription:
        "SIGHT'KICK is an app concept that turns exploring Innsbruck into a game. As UX/UI designer and concept developer I shaped the experience.",
      sections: [
        {
          id: 'challenge',
          title: 'The Challenge',
          content:
            'Traditional sightseeing is often hampered by travelers\' pain points: limited time, information overload, and difficulty navigating new cities. My challenge was to create an experience that replaces laborious planning with spontaneous, yet guided, discovery. The goal was to let users "Get to know Innsbruck like no one else!".',
        },
        {
          id: 'solution',
          title: 'My Solution',
          content:
            "The core solution, SIGHT'KICK, is a free mobile app that turns city touring into an interactive adventure for all traveler types. The design focuses on five core pillars of value:",
          subsections: [
            {
              id: 'personalized',
              title: 'Personalized Exploration',
              content:
                'Users can tailor their adventures based on interests (e.g., History, Food, Mountains, Family). This allows the app to discover hidden gems and off-the-beaten-path experiences specifically relevant to them.',
            },
            {
              id: 'map',
              title: 'Interactive Map',
              content:
                'The app features a map designed to encourage a sense of adventure by revealing new areas as the user explores, a novel mechanic beyond standard navigation.',
            },
            {
              id: 'gamification',
              title: 'Gamified Experience',
              content:
                "Exploration is transformed into a continuous quest where users earn points, badges (like the 'Explorer's Compass Award'), and rewards for completing challenges and exploring new places.",
            },
            {
              id: 'offers',
              title: 'Exclusive Offers',
              content:
                'Users gain access to exclusive discounts and deals from local businesses and attractions, providing tangible, instant value.',
            },
            {
              id: 'social',
              title: 'Social Sharing',
              content:
                'Built-in features allow users to share their adventures with friends and family on social media, fostering community and advocacy.',
            },
          ],
        },
        {
          id: 'contribution',
          title: 'My Contribution: UX/UI and Design',
          content: '',
          subsections: [
            {
              id: 'concept-design',
              title: 'Conceptual Design',
              content:
                'I was responsible for the entire feature set, user flow, and information architecture, ensuring the app effectively solved the identified UX problems.',
            },
            {
              id: 'visual-design',
              title: 'Visual Design',
              content:
                'As the UI Designer, I developed the interface (including the interactive map and quick navigation categories), deliberately adapting the aesthetic to align with the Innsbruck Design System (colors and typography). This ensures local authenticity and strong brand cohesion.',
            },
            {
              id: 'slide-design',
              title: 'Slide Design',
              content:
                "I designed the final presentation, focusing on visual clarity, strong contrast, and effective information hierarchy to showcase the project's strategy and vision.",
            },
          ],
        },
        {
          id: 'reflection',
          title: 'Reflection & Key Takeaways',
          content:
            'This project provided crucial experience in integrating complex strategic requirements into a simple, user-centric mobile design.',
          subsections: [
            {
              id: 'ux-efficiency',
              title: 'UX/UI Efficiency',
              content:
                'Leveraging tools like Figma was essential, allowing for extremely fast creation of low-fidelity prototypes and giving the team creative freedom for exploring design solutions early in the concept phase.',
            },
            {
              id: 'concept-integration',
              title: 'Concept Integration',
              content:
                'A key learning was how to translate business strategy (like the competitor analysis using the GAMP5 framework) directly into design choices that support the Unique Selling Proposition (USP).',
            },
            {
              id: 'future-vision',
              title: 'Future Vision',
              content:
                'The design was anchored in the mission to help users "build long-lasting memories." The product is structured for future growth and scalability, with a clear path to expansion to other locations (like Munich or Salzburg) using the same core, local-focused design principles.',
            },
          ],
        },
      ],
    },
  },
  {
    slug: 'indonesia',
    year: '2024',
    tools: 'Sony Alpha · Adobe Lightroom',
    thumbnail: {
      src: '/images/project-indonesia.jpg',
      width: 1824,
      height: 1368,
      alt: {
        de: 'Hochland in Indonesien mit Nebel im Tal bei Sonnenaufgang',
        en: 'Highland in Indonesia with mist in the valley at sunrise',
      },
    },
    service: 'photography',
    gallery: [
      {
        src: '/images/projects/indonesia-1.jpg',
        width: 1200,
        height: 1600,
        alt: {
          de: 'Betonweg zwischen grünen Reisfeldern auf Bali, gesäumt von Palmen',
          en: 'Concrete path between green rice fields in Bali, lined with palm trees',
        },
      },
      {
        src: '/images/projects/indonesia-2.jpg',
        width: 1200,
        height: 1600,
        alt: {
          de: 'Reisterrassen im Dschungel mit Kokospalmen unter Wolkenhimmel',
          en: 'Rice terraces in the jungle with coconut palms under a cloudy sky',
        },
      },
      {
        src: '/images/projects/indonesia-3.jpg',
        width: 1200,
        height: 1600,
        alt: {
          de: 'Geflutetes Reisfeld, in dem sich Palmen spiegeln',
          en: 'Flooded rice field reflecting palm trees',
        },
      },
      {
        src: '/images/projects/indonesia-4.jpg',
        width: 1200,
        height: 1600,
        alt: {
          de: 'Dorfstraße im Gegenlicht der untergehenden Sonne, ein Auto und ein Roller',
          en: 'Village street backlit by the setting sun, with a car and a scooter',
        },
      },
      {
        src: '/images/projects/indonesia-5.jpg',
        width: 1200,
        height: 1600,
        alt: {
          de: 'Palmen-Silhouetten vor orangem Sonnenuntergang',
          en: 'Palm tree silhouettes against an orange sunset',
        },
      },
      {
        src: '/images/projects/indonesia-6.jpg',
        width: 1200,
        height: 1600,
        alt: {
          de: 'Bewachsener Berggipfel über einem Wolkenmeer am Morgen',
          en: 'Green mountain peak above a sea of clouds in the morning',
        },
      },
      {
        src: '/images/projects/indonesia-7.jpg',
        width: 1600,
        height: 1200,
        alt: {
          de: 'Blick über ein Hochland mit Nebel im Tal bei Sonnenaufgang',
          en: 'View across a highland with mist in the valley at sunrise',
        },
      },
    ],
    inlineImages: {},
    de: {
      title: 'Indonesien',
      tagline: 'Kultur & Landschaft durch mein Objektiv',
      body: 'Eine visuelle Reise durch die lebendige Kultur und die beeindruckenden Landschaften Indonesiens. Entstanden während meiner Workation in Bali.\n\nDie Serie zeigt den Alltag der Menschen, sakrale Orte, Natur und Architektur, mit Blick für das Besondere im Gewöhnlichen.',
      type: 'Fotografie · Reise',
      role: 'Fotograf',
      metaTitle: 'Indonesien: Reisefotografie aus Bali | Erik Bergheimer',
      metaDescription:
        'Reisfelder, Vulkane und Dorfleben: eine Fotoserie aus Indonesien, entstanden während meiner Workation auf Bali.',
      sections: [],
    },
    en: {
      title: 'Indonesia',
      tagline: 'Culture & landscape through my lens',
      body: 'A visual journey through the vibrant culture and stunning landscapes of Indonesia. Created during my workation in Bali.\n\nThe series captures everyday life, sacred places, nature and architecture, finding the extraordinary in the ordinary.',
      type: 'Photography · Travel',
      role: 'Photographer',
      metaTitle: 'Indonesia: travel photography from Bali | Erik Bergheimer',
      metaDescription:
        'Rice fields, volcanoes and village life: a photo series from Indonesia, created during my workation in Bali.',
      sections: [],
    },
  },
  {
    slug: 'webflow',
    year: '2023',
    tools: 'Webflow · Shopify · Figma',
    thumbnail: {
      src: '/images/project-webflow.jpg',
      width: 1728,
      height: 1117,
      alt: {
        de: 'Markenauftritt von BlueBird: Logo, Kappen mit Vogel-Logo, Farbpalette und Schriften',
        en: 'BlueBird brand identity: logo, caps with the bird logo, colour palette and typefaces',
      },
    },
    service: 'webflow-development',
    gallery: [],
    inlineImages: {},
    download: {
      url: '/Bachelorarbeit_Bergheimer.pdf',
      label: {
        de: 'Bachelorarbeit (PDF, 1,2 MB)',
        en: 'Bachelor thesis (PDF, 1.2 MB)',
      },
    },
    de: {
      title: 'Webflow vs. Shopify',
      tagline: 'Können No-Code-Tools professionelle Shops liefern?',
      body: 'Für meine Bachelorarbeit im Studiengang User Experience Design habe ich untersucht, wie weit Low-/No-Code Tools gehen können, wenn man sie auf einen komplexen Anwendungsfall wie E-Commerce anwendet. Plattformen wie Webflow und Shopify versprechen, digitale Gestaltung zu demokratisieren. Aber können sie wirklich professionelle, skalierbare und benutzerfreundliche Online-Shops liefern, ganz ohne Code?\n\nDafür habe ich eine fiktive Modemarke namens BlueBird entworfen und den gesamten Shop auf beiden Plattformen umgesetzt. Das Ergebnis: ein detaillierter, praxisnaher Vergleich zweier sehr unterschiedlicher Entwicklungsansätze.',
      type: 'Web · No-Code · Bachelorarbeit',
      role: 'Forschung & Entwicklung',
      metaTitle: 'Webflow vs. Shopify: Bachelorarbeit No-Code-Shops | Erik Bergheimer',
      metaDescription:
        'Können Low-/No-Code-Tools wie Webflow und Shopify professionelle Online-Shops liefern? Eine praxisnahe Bachelorarbeit, die beide Plattformen vergleicht.',
      sections: [
        {
          id: 'research',
          title: 'Recherche & Fragestellung',
          content:
            'Meine Forschung drehte sich um zwei zentrale Fragen: Erstens, welche Einschränkungen und Herausforderungen haben Designer, wenn sie Low-/No-Code Tools wie Webflow und Shopify für den Aufbau eines E-Commerce nutzen? Und zweitens, welche praktischen Empfehlungen lassen sich daraus für andere ableiten?\n\nStatt mich nur auf Theorie oder Vergleiche aus zweiter Hand zu stützen, habe ich einen identischen Shop in beiden Plattformen gebaut. So konnte ich den Design- und Entwicklungsprozess von beiden Seiten erleben und herausfinden, wo jedes Tool glänzt und wo es an seine Grenzen stößt.',
        },
        {
          id: 'concept',
          title: 'Konzept & Markendesign',
          content:
            'Um eine realistische Testumgebung zu schaffen, habe ich ein vollständig gebrandetes E-Commerce-Erlebnis für ein nachhaltiges Modelabel namens BlueBird entwickelt. Die Marke wurde für Max entworfen, eine fiktive Persona: ein junger, internetaffiner Student, der Wert auf Qualität, Transparenz und einfaches Online-Shopping legt. Max wurde zur Linse, durch die ich Usability und Flow auf beiden Plattformen bewertet habe.\n\nVon Typografie und Farbpalette bis zu Logo und Tonalität wurde jedes Element der Marke auf die Zielgruppe abgestimmt. Die visuelle Identität nutzt Neue Haas Grotesk Display für Klarheit und digitale Lesbarkeit, während PlaceIt-Mockups jedem Produkt (T-Shirt, Hoodie, Cap, Tote Bag) einen konsistenten, hochwertigen Look gaben.',
        },
        {
          id: 'ux-process',
          title: 'UX-Prozess',
          content:
            'Den UX-Prozess startete ich in Figma, wo ich jeden Screen des BlueBird Online-Shops von Grund auf designte. Die Homepage enthielt einen auffälligen Hero-Bereich, Produkt-Slider, Newsletter-Anmeldung und Blog-Vorschau. Dazu kamen eine Produktübersicht mit Filter- und Sortieroptionen, eine detaillierte Produktseite mit Varianten-Auswahl und FAQs sowie ein mehrstufiger Checkout-Flow mit Fokus auf Klarheit.\n\nNach Fertigstellung des High-Fidelity-Prototyps führte ich ein Expert Review mit einem Senior UX Designer von TEAM23 in Augsburg durch. Das Feedback half mir, mehrere zentrale Aspekte zu verbessern: stärkere Kontraste für bessere Zugänglichkeit, vereinfachte Navigation im Checkout und klarere Formulare mit Breadcrumb-System.',
        },
        {
          id: 'development',
          title: 'Umsetzung',
          content: '',
          subsections: [
            {
              id: 'dev-webflow',
              title: 'Webflow',
              content:
                'In Webflow nutzte ich die Designer-Umgebung und die Relume Webflow Library, um den BlueBird Shop umzusetzen. Die Design-Treue war beeindruckend: Ich konnte meine Figma-Layouts nahezu pixelgenau nachbauen. Der WYSIWYG-Editor machte Layout-Anpassungen schnell und visuell, und die Plattform erlaubte Custom Code ohne Probleme. Die Code-Export-Funktion war ein weiterer Pluspunkt und bot einen Ausweg aus dem Webflow-Ökosystem.\n\nAllerdings hatte Webflow auch Einschränkungen: Kein eingebauter Testmodus für Checkout-Flows, Limits bei E-Commerce- und CMS-Einträgen, und minimale native Marketing-Unterstützung ohne Drittanbieter-Tools.',
            },
            {
              id: 'dev-shopify',
              title: 'Shopify',
              content:
                'Den gleichen Shop in Shopify zu bauen, war eine ganz andere Erfahrung. Ich nutzte das Dawn-Theme als Basis und passte es über den Theme-Editor und Liquid-Code an. Während die visuelle Flexibilität eingeschränkter war, überzeugte die Plattform bei Shop-Management und Skalierbarkeit: breitere Zahlungsmethoden, eingebauter Testmodus für den Checkout und eine native Mobile App für die Bestellverwaltung.\n\nDie Anpassung hatte aber ihren Preis. Die starre Theme-Struktur machte es schwierig, das exakte Design zu replizieren, und viele visuelle Details erforderten CSS-Änderungen. Für Designer ohne Coding-Erfahrung können selbst einfache Änderungen zur Herausforderung werden.',
            },
          ],
        },
        {
          id: 'comparison',
          title: 'Feature-Vergleich',
          content:
            'Im Vergleich bot Webflow klar mehr Freiheit in visuellem und strukturellem Design, während Shopify bei der E-Commerce-Funktionalität überlegen war. Shopify unterstützt Testmodi, umfangreiche Zahlungsoptionen und eingebaute Marketing-Tools, allerdings auf Kosten der visuellen Kontrolle. Webflow gab mir Raum für ein maßgeschneidertes Erlebnis, hatte aber Defizite bei tieferen E-Commerce- und Skalierungsfunktionen.',
        },
        {
          id: 'conclusion',
          title: 'Fazit & Empfehlungen',
          content:
            'Dieses Projekt bestätigte: Es gibt kein einzelnes bestes Tool, nur das am besten passende für ein bestimmtes Ziel. Webflow ist ideal für Designer, die volle kreative Kontrolle wollen und dafür bereit sind, etwas Funktionalität zu opfern. Shopify eignet sich besser für Unternehmen mit Fokus auf soliden Commerce, Skalierung und Marketing von Anfang an.\n\nBeide Tools zeigen das Potenzial von Low-/No-Code Ansätzen. Aber sie zeigen auch die Grenzen, besonders wenn Projekte mehr Flexibilität, Integration oder Anpassung erfordern.',
        },
        {
          id: 'learnings',
          title: 'Was ich gelernt habe',
          content:
            'Das war eines der praktischsten und aufschlussreichsten Projekte, an denen ich gearbeitet habe. Der reale Anwendungsfall deckte Herausforderungen auf, die Theorie niemals vorhersagen könnte. Ich erkannte auch, dass Einschränkungen in Low-/No-Code Tools nicht nur technisch sind, sie beeinflussen direkt die Designergebnisse und erfordern Workarounds oder Kompromisse.\n\nDie Arbeit über Plattformen hinweg machte mich zu einem anpassungsfähigeren Produktdenker, und die Zusammenarbeit mit einem Expert Reviewer half mir, meinen Designprozess nachhaltig zu verfeinern.',
        },
      ],
    },
    en: {
      title: 'Webflow vs. Shopify',
      tagline: 'Can no-code tools deliver professional shops?',
      body: "For my bachelor's thesis in User Experience Design, I explored how far Low-/No-Code tools can go when applied to a complex use case like e-commerce. Platforms like Webflow and Shopify claim to democratize digital creation, but I wanted to test whether they could truly deliver professional, scalable, and usable online shops without requiring a line of code.\n\nTo do this, I designed and developed a fictional fashion brand called BlueBird. I then implemented the entire store experience on both Webflow and Shopify, documenting every part of the journey to create a detailed, side-by-side comparison.",
      type: 'Web · No-code · Bachelor thesis',
      role: 'Researcher & developer',
      metaTitle: 'Webflow vs. Shopify: no-code e-commerce thesis | Erik Bergheimer',
      metaDescription:
        'Can no-code tools like Webflow and Shopify deliver professional online shops? A hands-on bachelor thesis comparing both platforms.',
      sections: [
        {
          id: 'research',
          title: 'Research & Problem',
          content:
            'My research centered around two core questions: First, what limitations and challenges do designers face when using Low-/No-Code tools like Webflow and Shopify to build an e-commerce site? And second, what practical advice can be drawn from these experiences for others considering these platforms?\n\nInstead of relying solely on theory or secondhand comparisons, I created an identical shop in both platforms. This allowed me to experience the design and development process from both sides and identify where each tool shines and where it falls short.',
        },
        {
          id: 'concept',
          title: 'Concept & Brand Design',
          content:
            'To ensure a realistic testing ground, I built a fully branded e-commerce experience for a sustainable fashion label named BlueBird. The brand was created for Max, a fictional persona representing a young, internet-savvy student who values quality, transparency, and ease of use when shopping online. Max became the lens through which I evaluated usability and flow across both platforms.\n\nFrom typography and color palette to logo and tone of voice, every element of the brand was designed to reflect its audience. The visual identity used Neue Haas Grotesk Display for clarity and digital legibility, while PlaceIt mockups gave each product (a t-shirt, hoodie, cap, and tote bag) a consistent, high-quality look across both shops.',
        },
        {
          id: 'ux-process',
          title: 'UX Process',
          content:
            'I began the UX process in Figma, where I designed every screen of the BlueBird online shop from scratch. The homepage included a bold hero section, product slider, newsletter signup, and blog preview to drive engagement. I then designed a product overview with filtering and sorting options, a detailed product page with variant selectors and FAQs, and a multi-step checkout flow that focused on clarity and reassurance.\n\nOnce the high-fidelity prototype was complete, I conducted an expert review with a senior UX designer from the agency TEAM23 in Augsburg. Their feedback helped me refine several key aspects of the experience: improving accessibility through stronger contrast, simplifying navigation in the checkout, and enhancing clarity with a breadcrumb system and clearer form structure.',
        },
        {
          id: 'development',
          title: 'Development & Implementation',
          content: '',
          subsections: [
            {
              id: 'dev-webflow',
              title: 'Webflow',
              content:
                "In Webflow, I used the Designer environment and the Relume Webflow Library to bring the BlueBird shop to life. I found the design fidelity to be incredibly high. I was able to match my Figma layouts almost pixel for pixel. The WYSIWYG editor made layout adjustments quick and visual, and the platform allowed me to insert custom code where needed without friction. The code export feature was another bonus, offering a way out of the Webflow ecosystem without vendor lock-in.\n\nHowever, Webflow wasn't without its limitations. There's no built-in test mode for checkout flows, which made realistic testing difficult. It also imposes caps on e-commerce and CMS items, and its native support for marketing (email, social media) is minimal without third-party tools.",
            },
            {
              id: 'dev-shopify',
              title: 'Shopify',
              content:
                "Building the same shop in Shopify offered a very different experience. I used the Dawn theme as my foundation and customized it using Shopify's theme editor and Liquid code. While visual flexibility was more limited, the platform excelled in shop management and scalability. It supported a wider range of payment methods, offered a built-in test mode for the checkout process, and included a native mobile app for managing orders.\n\nCustomization, however, came at a cost. The rigidity of the theme structure made it difficult to replicate the exact design, and many visual details required CSS changes. For designers without coding experience, even simple changes can become a challenge.",
            },
          ],
        },
        {
          id: 'comparison',
          title: 'Feature Comparison',
          content:
            'When comparing the two tools, Webflow clearly offered more freedom in visual and structural design, while Shopify delivered superior e-commerce functionality. Shopify supports test modes, extensive payment options, and built-in marketing tools, but at the expense of visual control. Webflow, meanwhile, gave me room to create a bespoke experience but lacked deeper e-commerce and scalability features.',
        },
        {
          id: 'conclusion',
          title: 'Conclusion & Recommendations',
          content:
            "This project confirmed that there's no single best tool, only the best fit for a given goal. Webflow is ideal for designers who want full creative control and are willing to trade off some functionality for visual precision. Shopify is better suited for businesses focused on robust commerce, scaling, and marketing from day one, especially if they're comfortable with working within a template system.\n\nBoth tools show the promise of Low-/No-Code approaches. But they also reveal the boundaries, especially when projects demand more flexibility, integration, or customization.",
        },
        {
          id: 'learnings',
          title: 'What I Learned',
          content:
            "This was one of the most hands-on, insightful projects I've worked on. Designing for a real use case allowed me to uncover challenges that theory could never predict. I also realized that limitations in Low-/No-Code tools aren't just technical. They directly shape design outcomes and require workarounds or compromises.\n\nWorking across platforms made me a more adaptable product thinker, and collaborating with an expert reviewer helped me refine my design process in meaningful ways. It reinforced the value of user-centered design, even when the user is hypothetical, and reminded me that great UX comes from iteration, feedback, and real-world constraints.",
        },
      ],
    },
  },
  {
    slug: 'morocco',
    year: '2023',
    tools: 'Sony Alpha · Lightroom · Capture One',
    thumbnail: {
      src: '/images/project-morocco.jpg',
      width: 768,
      height: 1024,
      alt: {
        de: 'Marokkanische Flagge an einem Mast vor sonnigem Himmel',
        en: 'Moroccan flag on a pole against a sunny sky',
      },
    },
    service: 'photography',
    gallery: [
      {
        src: '/images/projects/morocco-1.jpg',
        width: 1200,
        height: 1600,
        alt: {
          de: 'Serpentinenstraße durch kahles Atlasgebirge unter blauem Himmel',
          en: 'Winding road through the bare Atlas mountains under a blue sky',
        },
      },
      {
        src: '/images/projects/morocco-2.jpg',
        width: 1200,
        height: 1600,
        alt: {
          de: 'Sonnenaufgang über Sanddünen mit Fußspuren in der Wüste',
          en: 'Sunrise over sand dunes with footprints in the desert',
        },
      },
      {
        src: '/images/projects/morocco-3.jpg',
        width: 1199,
        height: 1600,
        alt: {
          de: 'Reihe beiger Zelte eines Wüstencamps im Sand',
          en: 'Row of beige tents at a desert camp in the sand',
        },
      },
      {
        src: '/images/projects/morocco-4.jpg',
        width: 1200,
        height: 1600,
        alt: {
          de: 'Zwei schlafende Welpen aneinandergekuschelt im Gras',
          en: 'Two sleeping puppies curled up together on the grass',
        },
      },
      {
        src: '/images/projects/morocco-5.jpg',
        width: 1600,
        height: 1200,
        alt: {
          de: 'Menschen auf einem Gipfel schauen auf den Sonnenaufgang über den Wolken',
          en: 'People on a summit watching the sunrise above the clouds',
        },
      },
      {
        src: '/images/projects/morocco-6.jpg',
        width: 1200,
        height: 1600,
        alt: {
          de: 'Weißes Gebäude mit Balkonen vor tiefblauem Himmel',
          en: 'White building with balconies against a deep blue sky',
        },
      },
    ],
    inlineImages: {},
    de: {
      title: 'Marokko',
      tagline: 'Alltag und Schönheit in Marokko',
      body: 'In Texturen und Traditionen Marokkos eingetaucht: Alltag und atemberaubende Szenerie in einer Serie eindrucksvoller Bilder.\n\nVon belebten Souks in Marrakesch bis zu stillen Wüstenlandschaften, eine Geschichte voller Kontraste, Farben und Geschichte.',
      type: 'Fotografie · Dokumentarisch',
      role: 'Fotograf',
      metaTitle: 'Marokko: Dokumentarfotografie | Erik Bergheimer',
      metaDescription: 'Atlasgebirge, Wüste und Alltag: eine dokumentarische Fotoserie aus Marokko.',
      sections: [],
    },
    en: {
      title: 'Morocco',
      tagline: 'Everyday life and beauty in Morocco',
      body: 'Immersed in the textures and traditions of Morocco: everyday life and breathtaking scenery captured in a series of evocative images.\n\nFrom the busy souks of Marrakech to quiet desert landscapes, a story full of contrasts, colors and history.',
      type: 'Photography · Documentary',
      role: 'Photographer',
      metaTitle: 'Morocco: documentary photography | Erik Bergheimer',
      metaDescription: 'Atlas mountains, desert and everyday life: a documentary photo series from Morocco.',
      sections: [],
    },
  },
];

/** „Kommt bald"-Kacheln ohne Detailseite */
export const comingSoon = [
  {
    slug: 'rose',
    type: { de: 'UX/UI · Digital-Business-Projekt', en: 'UX/UI · Digital business project' },
    de: { title: 'ROSE Bikes App', tagline: 'Masterprojekt in Digital Business' },
    en: { title: 'ROSE Bikes App', tagline: "Master's project in digital business" },
    color: '#e0d0d8',
  },
  {
    slug: 'axium',
    type: { de: 'Logo · Branding', en: 'Logo · Branding' },
    de: { title: 'Axium', tagline: 'Logo- & Branding-Design' },
    en: { title: 'Axium', tagline: 'Logo & branding design' },
    color: '#d8e0d0',
  },
] as const;
