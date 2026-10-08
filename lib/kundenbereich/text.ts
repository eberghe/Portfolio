import type { Locale } from '@/lib/i18n';

// Texte des Kundenbereichs, siehe functions/kundenbereich/login.md

const de = {
  metaTitle: 'Kundenbereich | Erik Bergheimer',
  metaDescription: 'Geschützter Bereich für Kundinnen und Kunden von Erik Bergheimer.',
  title: 'Kundenbereich',
  intro:
    'Hier findest du alles zu deinem Projekt an einem Ort: Stand, nächste Schritte, Termine, Verträge und Dateien. Melde dich mit der E-Mail-Adresse an, die du mir gegeben hast.',
  loginTitle: 'Anmelden',
  email: 'E-Mail-Adresse',
  emailHint: 'Du bekommst einen Link per Mail, ein Passwort brauchst du nicht.',
  emailInvalid: 'Bitte gib eine gültige E-Mail-Adresse ein, z. B. name@firma.de.',
  submit: 'Anmeldelink schicken',
  sending: 'Wird gesendet …',
  sentTitle: 'Schau in dein Postfach',
  sentText:
    'Wenn die Adresse bei mir hinterlegt ist, ist der Link unterwegs. Er gilt eine Stunde und funktioniert einmal.',
  unavailableTitle: 'Der Kundenbereich ist gerade nicht erreichbar',
  unavailableText: 'Bitte versuch es später noch einmal oder schreib mir direkt:',
  confirmTitle: 'Anmeldung bestätigen',
  confirmText: 'Ein Klick noch, dann bist du im Kundenbereich.',
  confirmButton: 'Jetzt anmelden',
  invalidTitle: 'Dieser Link funktioniert nicht mehr',
  invalidText: 'Links aus der Mail gelten eine Stunde und nur einmal. Fordere einfach einen neuen an.',
  backToLogin: 'Neuen Link anfordern',
  hello: (name: string) => `Hallo, ${name}`,
  admin: 'Admin',
  welcomeText: 'Hier erscheinen bald deine Projekte mit Stand, nächsten Schritten, Terminen und Dateien.',
  logout: 'Abmelden',
  mailSubject: 'Dein Link zum Kundenbereich',
  mailText: (name: string | null, link: string) =>
    `${name ? `Hallo ${name},` : 'Hallo,'}\n\nhier ist dein Link zum Kundenbereich von Erik Bergheimer:\n\n${link}\n\nEr gilt eine Stunde und funktioniert einmal. Wenn du ihn nicht angefordert hast, kannst du diese Mail ignorieren.\n\nViele Grüße\nErik`,
};

const en: typeof de = {
  metaTitle: 'Client area | Erik Bergheimer',
  metaDescription: 'Protected area for clients of Erik Bergheimer.',
  title: 'Client area',
  intro:
    'Everything about your project in one place: status, next steps, meetings, contracts and files. Sign in with the email address you gave me.',
  loginTitle: 'Sign in',
  email: 'Email address',
  emailHint: 'You will get a link by email, no password needed.',
  emailInvalid: 'Please enter a valid email address, e.g. name@company.com.',
  submit: 'Send sign-in link',
  sending: 'Sending …',
  sentTitle: 'Check your inbox',
  sentText: 'If this address is on file, the link is on its way. It is valid for one hour and works once.',
  unavailableTitle: 'The client area is not available right now',
  unavailableText: 'Please try again later or email me directly:',
  confirmTitle: 'Confirm sign-in',
  confirmText: 'One more click and you are in the client area.',
  confirmButton: 'Sign in now',
  invalidTitle: 'This link no longer works',
  invalidText: 'Links from the email are valid for one hour and work once. Just request a new one.',
  backToLogin: 'Request a new link',
  hello: (name: string) => `Hello, ${name}`,
  admin: 'Admin',
  welcomeText: 'Your projects with status, next steps, meetings and files will appear here soon.',
  logout: 'Sign out',
  mailSubject: 'Your link to the client area',
  mailText: (name: string | null, link: string) =>
    `${name ? `Hello ${name},` : 'Hello,'}\n\nhere is your link to Erik Bergheimer's client area:\n\n${link}\n\nIt is valid for one hour and works once. If you did not request it, you can ignore this email.\n\nBest regards\nErik`,
};

export const kundenText = { de, en } satisfies Record<Locale, typeof de>;
