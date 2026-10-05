import type { Locale } from '@/lib/i18n';

// Texte der Kontaktseite und des Anfrage-Assistenten,
// siehe functions/seiten/kontakt.md und functions/kontakt/anfrage-assistent.md

/** Auswahl „Noch unklar / etwas anderes" neben den Leistungen */
export const OTHER_SERVICE = 'sonstiges';

export const timeframes = ['bald', '1-3-monate', 'spaeter', 'offen'] as const;
export const budgets = ['unter-2000', '2000-5000', '5000-10000', 'ueber-10000', 'offen'] as const;

export type ErrorCode = 'required' | 'tooShort' | 'tooLong' | 'invalid';

const de = {
  metaTitle: 'Kontakt & Projektanfrage | Erik Bergheimer',
  metaDescription:
    'Projekt in vier kurzen Schritten anfragen oder direkt schreiben. Antwort per E-Mail, meist mit Termin fürs kostenlose Erstgespräch. Aus Augsburg.',
  title: 'Projekt? Idee? Oder einfach Hallo sagen?',
  intro:
    'Erzähl mir in vier kurzen Schritten, worum es geht. Ich antworte per E-Mail, meist mit einem Terminvorschlag für ein kostenloses Erstgespräch.',
  email: 'E-Mail',
  newTab: '(öffnet in neuem Tab)',

  formTitle: 'Projekt anfragen',
  progress: 'Fortschritt',
  stepOf: (i: number, n: number, title: string) => `Schritt ${i} von ${n}: ${title}`,
  steps: ['Leistung', 'Projekt', 'Rahmen', 'Kontakt'],
  required: '(Pflicht)',
  optional: '(optional)',
  next: 'Weiter',
  back: 'Zurück',
  submit: 'Anfrage senden',
  sending: 'Wird gesendet …',

  servicesLegend: 'Wobei kann ich helfen? Mehrfachauswahl möglich.',
  other: 'Noch unklar oder etwas anderes',
  description: 'Beschreibung',
  descriptionHint: 'Was hast du vor, und was soll am Ende besser sein? Ein paar Sätze reichen (mindestens 20 Zeichen).',
  website: 'Aktuelle Website',
  websiteHint: 'Falls vorhanden, z. B. beispiel.de',
  timeframe: 'Wann soll es losgehen?',
  timeframes: {
    bald: 'So bald wie möglich',
    '1-3-monate': 'In 1 bis 3 Monaten',
    spaeter: 'Später',
    offen: 'Noch offen',
  } satisfies Record<(typeof timeframes)[number], string>,
  budget: 'Budget-Rahmen',
  budgets: {
    'unter-2000': 'Unter 2.000 €',
    '2000-5000': '2.000 bis 5.000 €',
    '5000-10000': '5.000 bis 10.000 €',
    'ueber-10000': 'Über 10.000 €',
    offen: 'Noch offen',
  } satisfies Record<(typeof budgets)[number], string>,
  name: 'Name',
  emailField: 'E-Mail',
  phone: 'Telefon',
  consentLink: 'Datenschutzerklärung',
  honeypot: 'Bitte leer lassen',
  consent: 'Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert werden.',
  consentMore: 'Mehr dazu in der',
  done: '(erledigt)',
  counter: (n: number) => `${n} von 3000 Zeichen`,
  copy: 'Angaben kopieren',
  copied: 'Kopiert.',
  copyFailed: 'Kopieren nicht möglich. Bitte markiere den Text selbst.',
  retry: 'Erneut senden',
  truncated: '[gekürzt, vollständiger Text über „Angaben kopieren“]',

  errorsTitle: (n: number) => (n === 1 ? 'Bitte prüfe 1 Angabe:' : `Bitte prüfe ${n} Angaben:`),
  errors: {
    leistungen: { required: 'Wähle mindestens eine Leistung.', invalid: 'Wähle eine Leistung aus der Liste.' },
    beschreibung: {
      required: 'Beschreibe kurz dein Vorhaben.',
      tooShort: 'Die Beschreibung braucht mindestens 20 Zeichen.',
      tooLong: 'Die Beschreibung darf höchstens 3000 Zeichen haben.',
    },
    website: { invalid: 'Gib die Website als Adresse an, z. B. beispiel.de.' },
    zeitrahmen: { invalid: 'Wähle einen Zeitrahmen aus der Liste.' },
    budget: { invalid: 'Wähle einen Budget-Rahmen aus der Liste.' },
    name: {
      required: 'Gib deinen Namen an.',
      tooShort: 'Der Name braucht mindestens 2 Zeichen.',
      tooLong: 'Der Name darf höchstens 100 Zeichen haben.',
    },
    email: {
      required: 'Gib deine E-Mail-Adresse an.',
      invalid: 'Gib eine gültige E-Mail-Adresse an, z. B. name@beispiel.de.',
    },
    telefon: { invalid: 'Die Telefonnummer darf nur Ziffern, Leerzeichen und + / ( ) - enthalten.' },
    einwilligung: { required: 'Bitte stimme der Speicherung zu, damit ich antworten kann.' },
  } as Record<string, Partial<Record<ErrorCode, string>>>,

  thanks: (name: string) => `Danke, ${name}.`,
  thanksText:
    'Deine Anfrage ist angekommen. Ich melde mich per E-Mail, meist mit einem Terminvorschlag für ein kostenloses Erstgespräch.',
  summary: 'Deine Angaben',
  fallbackUnavailable: 'Das Formular lässt sich gerade nicht absenden.',
  fallbackFailed: 'Beim Senden ist etwas schiefgegangen.',
  fallbackText:
    'Deine Angaben sind nicht verloren: Der Link öffnet eine fertige E-Mail mit allem, was du eingegeben hast.',
  fallbackLink: 'Anfrage per E-Mail senden',
  limited:
    'Du hast in der letzten Stunde schon mehrere Anfragen geschickt. Bitte versuch es später noch einmal oder schreib mir direkt eine E-Mail.',

  mailSubject: (name: string) => `Projektanfrage von ${name}`,
};

export type ContactText = typeof de;

const en: ContactText = {
  metaTitle: 'Contact & project enquiry | Erik Bergheimer',
  metaDescription:
    'Send a project enquiry in four short steps or write directly. Reply by email, usually with a date for a free intro call. Based in Augsburg.',
  title: 'Project? Idea? Just say hi.',
  intro:
    'Tell me what it is about in four short steps. I will reply by email, usually suggesting a date for a free intro call.',
  email: 'Email',
  newTab: '(opens in a new tab)',

  formTitle: 'Project enquiry',
  progress: 'Progress',
  stepOf: (i, n, title) => `Step ${i} of ${n}: ${title}`,
  steps: ['Service', 'Project', 'Scope', 'Contact'],
  required: '(required)',
  optional: '(optional)',
  next: 'Next',
  back: 'Back',
  submit: 'Send enquiry',
  sending: 'Sending …',

  servicesLegend: 'How can I help? Choose as many as you like.',
  other: 'Not sure yet or something else',
  description: 'Description',
  descriptionHint:
    'What are you planning, and what should be better afterwards? A few sentences are enough (at least 20 characters).',
  website: 'Current website',
  websiteHint: 'If you have one, e.g. example.com',
  timeframe: 'When should it start?',
  timeframes: {
    bald: 'As soon as possible',
    '1-3-monate': 'In 1 to 3 months',
    spaeter: 'Later',
    offen: 'Not decided yet',
  },
  budget: 'Budget range',
  budgets: {
    'unter-2000': 'Under €2,000',
    '2000-5000': '€2,000 to €5,000',
    '5000-10000': '€5,000 to €10,000',
    'ueber-10000': 'Over €10,000',
    offen: 'Not decided yet',
  },
  name: 'Name',
  emailField: 'Email',
  phone: 'Phone',
  consentLink: 'privacy policy',
  honeypot: 'Please leave empty',
  consent: 'I agree that my details are stored to handle this enquiry.',
  consentMore: 'More in the',
  done: '(done)',
  counter: (n) => `${n} of 3000 characters`,
  copy: 'Copy details',
  copied: 'Copied.',
  copyFailed: 'Copying is not possible. Please select the text yourself.',
  retry: 'Send again',
  truncated: '[shortened, full text via “Copy details”]',

  errorsTitle: (n) => (n === 1 ? 'Please check 1 entry:' : `Please check ${n} entries:`),
  errors: {
    leistungen: { required: 'Choose at least one service.', invalid: 'Choose a service from the list.' },
    beschreibung: {
      required: 'Briefly describe your project.',
      tooShort: 'The description needs at least 20 characters.',
      tooLong: 'The description can have at most 3000 characters.',
    },
    website: { invalid: 'Enter the website as an address, e.g. example.com.' },
    zeitrahmen: { invalid: 'Choose a timeframe from the list.' },
    budget: { invalid: 'Choose a budget range from the list.' },
    name: {
      required: 'Enter your name.',
      tooShort: 'The name needs at least 2 characters.',
      tooLong: 'The name can have at most 100 characters.',
    },
    email: { required: 'Enter your email address.', invalid: 'Enter a valid email address, e.g. name@example.com.' },
    telefon: { invalid: 'The phone number may only contain digits, spaces and + / ( ) -.' },
    einwilligung: { required: 'Please agree to me storing your details so I can reply.' },
  },

  thanks: (name) => `Thank you, ${name}.`,
  thanksText: 'Your enquiry has arrived. I will reply by email, usually suggesting a date for a free intro call.',
  summary: 'Your details',
  fallbackUnavailable: "The form can't be sent right now.",
  fallbackFailed: 'Something went wrong while sending.',
  fallbackText: 'Your details are not lost: the link opens a ready-made email with everything you entered.',
  fallbackLink: 'Send enquiry by email',
  limited: 'You have already sent several enquiries in the last hour. Please try again later or email me directly.',

  mailSubject: (name) => `Project enquiry from ${name}`,
};

export const contactText: Record<Locale, ContactText> = { de, en };
