import type { Locale } from '@/lib/i18n';

// Impressum & Datenschutz, siehe functions/seiten/rechtliches.md.
// Texte aus dem Lovable-Projekt, an den neuen technischen Stand angepasst. Rechtliche Prüfung durch Erik offen.
// Ein Absatz-Teil `{email}` wird als mailto-Link dargestellt.
export interface LegalSection {
  title: string;
  /** Absätze; Zeilenumbrüche bleiben sichtbar */
  paragraphs: string[];
}

export interface LegalText {
  metaTitle: string;
  metaDescription: string;
  title: string;
  sections: LegalSection[];
}

export type LegalKind = 'impressum' | 'datenschutz';

export const legal: Record<LegalKind, Record<Locale, LegalText>> = {
  impressum: {
    de: {
      metaTitle: 'Impressum | Erik Bergheimer',
      metaDescription:
        'Impressum und Anbieterkennzeichnung der Website von Erik Bergheimer, UX/UI-Designer in Augsburg.',
      title: 'Impressum',
      sections: [
        {
          title: 'Angaben gemäß § 5 DDG',
          paragraphs: [
            'Erik Bergheimer\nUX/UI-Designer & Webentwickler\nWeißdornstraße 5\n86343 Königsbrunn\nDeutschland',
          ],
        },
        { title: 'Kontakt', paragraphs: ['E-Mail: {email}\nWebsite: https://erik-bergheimer.de'] },
        {
          title: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
          paragraphs: ['Erik Bergheimer (Anschrift wie oben)'],
        },
        {
          title: 'Haftungsausschluss',
          paragraphs: [
            'Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Für externe Links zu fremden Inhalten ist ausschließlich der jeweilige Anbieter verantwortlich.',
          ],
        },
        {
          title: 'Urheberrecht',
          paragraphs: [
            'Alle auf dieser Website veröffentlichten Inhalte, Bilder und Fotografien unterliegen dem Urheberrecht von Erik Bergheimer. Eine Verwendung ohne ausdrückliche Genehmigung ist nicht gestattet.',
          ],
        },
      ],
    },
    en: {
      metaTitle: 'Imprint | Erik Bergheimer',
      metaDescription:
        'Imprint and provider information for the website of Erik Bergheimer, UX/UI designer in Augsburg.',
      title: 'Imprint',
      sections: [
        {
          title: 'Information pursuant to Section 5 DDG',
          paragraphs: ['Erik Bergheimer\nUX/UI Designer & Web Developer\nWeißdornstraße 5\n86343 Königsbrunn\nGermany'],
        },
        { title: 'Contact', paragraphs: ['Email: {email}\nWebsite: https://erik-bergheimer.de'] },
        { title: 'Responsible for content', paragraphs: ['Erik Bergheimer (address as above)'] },
        {
          title: 'Disclaimer',
          paragraphs: [
            'The contents of this website were created with the greatest possible care. No guarantee can be given for the accuracy, completeness or timeliness of the content. The respective provider is solely responsible for external links to third-party content.',
          ],
        },
        {
          title: 'Copyright',
          paragraphs: [
            'All content, images and photographs published on this website are subject to the copyright of Erik Bergheimer. Use without express permission is not permitted.',
          ],
        },
      ],
    },
  },
  datenschutz: {
    de: {
      metaTitle: 'Datenschutz | Erik Bergheimer',
      metaDescription:
        'Datenschutzerklärung der Website von Erik Bergheimer: Hosting, Logfiles, Browser-Speicher und deine Rechte nach der DSGVO.',
      title: 'Datenschutzerklärung',
      sections: [
        {
          title: 'Allgemeines',
          paragraphs: [
            'Der Schutz deiner personenbezogenen Daten ist mir wichtig. Diese Datenschutzerklärung informiert dich darüber, welche Daten beim Besuch dieser Website verarbeitet werden und welche Rechte dir nach der DSGVO zustehen.',
          ],
        },
        {
          title: 'Verantwortlicher',
          paragraphs: ['Erik Bergheimer\nWeißdornstraße 5\n86343 Königsbrunn\nDeutschland\nE-Mail: {email}'],
        },
        {
          title: 'Hosting & Server-Logfiles',
          paragraphs: [
            'Diese Website wird bei Vercel Inc. (USA) gehostet. Vercel ist unter dem EU-US Data Privacy Framework zertifiziert.',
            'Beim Aufruf der Website werden technisch notwendige Daten (IP-Adresse, Datum, Uhrzeit, Browser, Betriebssystem) temporär in Logfiles gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren Betrieb).',
          ],
        },
        {
          title: 'Cookies & Browser-Speicher',
          paragraphs: [
            'Außerhalb des Kundenbereichs setzt diese Website keine Cookies und nutzt keine Analyse- oder Tracking-Werkzeuge. Zu den Cookies des Kundenbereichs siehe unten. Wenn du den Dunkelmodus umschaltest, wird deine Wahl im localStorage deines Browsers gespeichert, damit sie beim nächsten Besuch erhalten bleibt. Diese Angabe verlässt dein Gerät nicht; du kannst sie jederzeit in deinem Browser löschen.',
          ],
        },
        {
          title: 'Schriften',
          paragraphs: [
            'Die Schrift Mona Sans wird von diesem Server ausgeliefert. Es besteht keine Verbindung zu Google Fonts oder anderen Schriftdiensten.',
          ],
        },
        {
          title: 'Kontakt per E-Mail',
          paragraphs: [
            'Wenn du mir eine E-Mail schreibst, verarbeite ich deine Angaben, um deine Anfrage zu beantworten. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Die Daten werden gelöscht, sobald die Konversation abgeschlossen ist und keine Aufbewahrungspflichten bestehen.',
          ],
        },
        {
          title: 'Anfrageformular',
          paragraphs: [
            'Wenn du das Anfrageformular auf der Kontaktseite nutzt, speichere ich deine Angaben (gewählte Leistungen, Beschreibung, Website, Zeitrahmen, Budget, Name, E-Mail, optional Telefon) sowie den Zeitpunkt deiner Einwilligung, um deine Anfrage zu beantworten. Rechtsgrundlage: Art. 6 Abs. 1 lit. a und b DSGVO. Du kannst deine Einwilligung jederzeit per E-Mail an {email} widerrufen.',
            'Die Daten liegen bei Supabase Inc. auf Servern in der EU (Frankfurt). Zum Schutz vor Missbrauch speichere ich statt deiner IP-Adresse nur einen verschlüsselten Prüfwert, mit dem sich wiederholte Anfragen begrenzen lassen. Über jede neue Anfrage werde ich per E-Mail über den Dienst Resend (Resend Inc., USA, EU-US Data Privacy Framework) benachrichtigt. Über denselben Dienst bekommst du eine kurze Bestätigung an deine E-Mail-Adresse.',
            'Die Angaben werden gelöscht, sobald die Anfrage erledigt ist und keine Aufbewahrungspflichten bestehen.',
          ],
        },
        {
          title: 'Kundenbereich',
          paragraphs: [
            'Für Kundinnen und Kunden gibt es einen geschützten Kundenbereich. Dort sehen die Ansprechpartner, die ich für ein Projekt eintrage, den Stand des Projekts, Termine, Verträge, Rechnungen und Dateien.',
            'Dafür verarbeite ich: Name, E-Mail-Adresse, optional Rolle und Telefonnummer, die bevorzugte Sprache, die Inhalte des Projekts (Schritte, Termine mit Meet-Link, Dokumente) sowie die Anmeldungen. Rechtsgrundlage ist die Durchführung des Vertrags bzw. vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO).',
            'Die Anmeldung läuft ohne Passwort über einen Link per E-Mail. Die E-Mail verschicke ich über Resend (Resend Inc., USA, EU-US Data Privacy Framework). Zum Schutz vor Missbrauch speichere ich bei jeder Anforderung nur verschlüsselte Prüfwerte von E-Mail-Adresse und IP-Adresse; sie werden nach 24 Stunden gelöscht (Art. 6 Abs. 1 lit. f DSGVO).',
            'Nach der Anmeldung setzt die Website zwei technisch notwendige Cookies: kb_zugang (Zugang, 1 Stunde) und kb_erneuern (verlängert die Anmeldung, 30 Tage). Sie sind für den geschützten Bereich unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Beim Abmelden werden beide gelöscht.',
            'Ansprechpartner können im Kundenbereich erlauben, dass ich das Logo ihres Unternehmens auf dieser Website als Referenz zeige. Dafür speichere ich, wer wann zugestimmt oder widerrufen hat. Rechtsgrundlage ist die Einwilligung (Art. 6 Abs. 1 lit. a DSGVO); sie lässt sich jederzeit im Kundenbereich widerrufen.',
            'Alle Daten des Kundenbereichs, auch die Dateien, liegen bei Supabase Inc. auf Servern in der EU (Frankfurt). Ich speichere sie bis zum Ende der Zusammenarbeit; Verträge und Rechnungen bewahre ich so lange auf, wie es die gesetzlichen Aufbewahrungsfristen verlangen (bis zu zehn Jahre).',
          ],
        },
        {
          title: 'Links zu sozialen Netzwerken',
          paragraphs: [
            'Die Links zu Instagram und LinkedIn sind einfache Links. Erst wenn du sie anklickst, wird eine Verbindung zum jeweiligen Anbieter aufgebaut.',
          ],
        },
        {
          title: 'Deine Rechte',
          paragraphs: [
            'Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht auf Beschwerde bei einer Aufsichtsbehörde. Anfragen richte bitte an: {email}.',
            'Zuständige Aufsichtsbehörde: Bayerisches Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach.',
          ],
        },
      ],
    },
    en: {
      metaTitle: 'Privacy policy | Erik Bergheimer',
      metaDescription:
        'Privacy policy for the website of Erik Bergheimer: hosting, log files, browser storage and your rights under the GDPR.',
      title: 'Privacy policy',
      sections: [
        {
          title: 'General',
          paragraphs: [
            'The protection of your personal data is important to me. This privacy policy informs you about which data is processed when you visit this website and what rights you have under the GDPR.',
          ],
        },
        {
          title: 'Controller',
          paragraphs: ['Erik Bergheimer\nWeißdornstraße 5\n86343 Königsbrunn\nGermany\nEmail: {email}'],
        },
        {
          title: 'Hosting & server log files',
          paragraphs: [
            'This website is hosted by Vercel Inc. (USA). Vercel is certified under the EU-US Data Privacy Framework.',
            'When the website is accessed, technically necessary data (IP address, date, time, browser, operating system) is temporarily stored in log files. Legal basis: Art. 6 (1) (f) GDPR (legitimate interest in secure operation).',
          ],
        },
        {
          title: 'Cookies & browser storage',
          paragraphs: [
            'Outside the client area, this website sets no cookies and uses no analytics or tracking tools. For the client area cookies, see below. If you switch dark mode, your choice is stored in your browser’s localStorage so it is kept on your next visit. This setting never leaves your device; you can delete it in your browser at any time.',
          ],
        },
        {
          title: 'Fonts',
          paragraphs: [
            'The Mona Sans typeface is served from this server. There is no connection to Google Fonts or other font services.',
          ],
        },
        {
          title: 'Contact by email',
          paragraphs: [
            'If you email me, I process your details to answer your enquiry. Legal basis: Art. 6 (1) (b) GDPR. The data is deleted once the conversation is completed and no retention obligations apply.',
          ],
        },
        {
          title: 'Enquiry form',
          paragraphs: [
            'If you use the enquiry form on the contact page, I store your details (selected services, description, website, timeframe, budget, name, email, optional phone) and the time of your consent in order to answer your enquiry. Legal basis: Art. 6 (1) (a) and (b) GDPR. You can withdraw your consent at any time by emailing {email}.',
            'The data is stored with Supabase Inc. on servers in the EU (Frankfurt). To prevent abuse, I store only an encrypted check value instead of your IP address, which allows repeated enquiries to be limited. I am notified of each new enquiry by email via the service Resend (Resend Inc., USA, EU-US Data Privacy Framework). Through the same service, you receive a short confirmation at your email address.',
            'The details are deleted once the enquiry is completed and no retention obligations apply.',
          ],
        },
        {
          title: 'Client area',
          paragraphs: [
            'There is a protected client area for clients. The contacts I add to a project see its status, meetings, contracts, invoices and files there.',
            'For this I process: name, email address, optionally role and phone number, preferred language, the project content (steps, meetings with a Meet link, documents) and sign-ins. Legal basis: performance of a contract or pre-contractual measures (Art. 6 (1) (b) GDPR).',
            'Signing in works without a password via a link sent by email. I send these emails via Resend (Resend Inc., USA, EU-US Data Privacy Framework). To prevent abuse, I store only encrypted check values of the email address and IP address for each request; they are deleted after 24 hours (Art. 6 (1) (f) GDPR).',
            'After you sign in, the website sets two strictly necessary cookies: kb_zugang (access, 1 hour) and kb_erneuern (keeps you signed in, 30 days). They are strictly necessary for the protected area (Section 25 (2) no. 2 TDDDG). Signing out deletes both.',
            'Contacts can allow me in the client area to show their company logo on this website as a reference. I store who agreed or revoked and when. Legal basis: consent (Art. 6 (1) (a) GDPR); it can be revoked in the client area at any time.',
            'All client area data, including files, is stored with Supabase Inc. on servers in the EU (Frankfurt). I keep it until our collaboration ends; contracts and invoices are kept for as long as statutory retention periods require (up to ten years).',
          ],
        },
        {
          title: 'Links to social networks',
          paragraphs: [
            'The links to Instagram and LinkedIn are plain links. A connection to the respective provider is only made when you click them.',
          ],
        },
        {
          title: 'Your rights',
          paragraphs: [
            'You have the right at any time to information, correction, deletion, restriction of processing, data portability and objection, as well as the right to lodge a complaint with a supervisory authority. Please send requests to: {email}.',
            'Competent supervisory authority: Bavarian Data Protection Authority (Bayerisches Landesamt für Datenschutzaufsicht, BayLDA), Promenade 18, 91522 Ansbach, Germany.',
          ],
        },
      ],
    },
  },
};
