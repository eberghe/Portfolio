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
            'Erik Bergheimer\nUX/UI-Designer & Webflow-Entwickler\nWeißdornstraße 5\n86343 Königsbrunn\nDeutschland',
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
          title: 'Provider',
          paragraphs: [
            'Erik Bergheimer\nUX/UI Designer & Webflow Developer\nWeißdornstraße 5\n86343 Königsbrunn\nGermany',
          ],
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
            'Diese Website setzt keine Cookies und nutzt keine Analyse- oder Tracking-Werkzeuge. Wenn du den Dunkelmodus umschaltest, wird deine Wahl im localStorage deines Browsers gespeichert, damit sie beim nächsten Besuch erhalten bleibt. Diese Angabe verlässt dein Gerät nicht; du kannst sie jederzeit in deinem Browser löschen.',
          ],
        },
        {
          title: 'Schriften',
          paragraphs: [
            'Die Schrift Inter wird von diesem Server ausgeliefert. Es besteht keine Verbindung zu Google Fonts oder anderen Schriftdiensten.',
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
            'Die Daten liegen bei Supabase Inc. auf Servern in der EU (Frankfurt). Zum Schutz vor Missbrauch speichere ich statt deiner IP-Adresse nur einen verschlüsselten Prüfwert, mit dem sich wiederholte Anfragen begrenzen lassen. Über jede neue Anfrage werde ich per E-Mail über den Dienst Resend (Resend Inc., USA, EU-US Data Privacy Framework) benachrichtigt.',
            'Die Angaben werden gelöscht, sobald die Anfrage erledigt ist und keine Aufbewahrungspflichten bestehen.',
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
            'This website sets no cookies and uses no analytics or tracking tools. If you switch dark mode, your choice is stored in your browser’s localStorage so it is kept on your next visit. This setting never leaves your device; you can delete it in your browser at any time.',
          ],
        },
        {
          title: 'Fonts',
          paragraphs: [
            'The Inter typeface is served from this server. There is no connection to Google Fonts or other font services.',
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
            'The data is stored with Supabase Inc. on servers in the EU (Frankfurt). To prevent abuse, I store only an encrypted check value instead of your IP address, which allows repeated enquiries to be limited. I am notified of each new enquiry by email via the service Resend (Resend Inc., USA, EU-US Data Privacy Framework).',
            'The details are deleted once the enquiry is completed and no retention obligations apply.',
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
