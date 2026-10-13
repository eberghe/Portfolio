// Entwurf der Allgemeinen Geschäftsbedingungen (functions/kundenbereich/angebot-pdf.md Verhalten 11).
// Nicht rechtlich geprüft. Erst nach Prüfung AGB_FREIGEGEBEN auf true setzen; bis dahin hängen
// Angebote keine AGB an.

export const AGB_FREIGEGEBEN = false;

export const AGB = {
  titel: 'Allgemeine Geschäftsbedingungen',
  stand: 'Stand: Oktober 2026',
  abschnitte: [
    {
      titel: '1. Geltungsbereich',
      absaetze: [
        'Diese Bedingungen gelten für alle Leistungen von Erik Bergheimer, Weißdornstraße 5, 86343 Königsbrunn („Auftragnehmer“), insbesondere UX/UI-Design, Webdesign und Webentwicklung, Design Systeme, Markenauftritt, Beratung zu Barrierefreiheit und KI sowie Website- und Prozessoptimierung, gegenüber seinen Kunden („Auftraggeber“).',
        'Abweichende Bedingungen des Auftraggebers gelten nur, wenn der Auftragnehmer ihnen ausdrücklich in Textform zustimmt.',
      ],
    },
    {
      titel: '2. Angebot und Vertragsschluss',
      absaetze: [
        'Angebote des Auftragnehmers gelten bis zu dem im Angebot genannten Datum. Der Vertrag kommt zustande, wenn der Auftraggeber das Angebot innerhalb dieser Frist annimmt, etwa durch Unterschrift und Hochladen im Kundenbereich oder durch Bestätigung in Textform (zum Beispiel per E-Mail).',
        'Maßgeblich für den Leistungsumfang ist das angenommene Angebot. Änderungen und Ergänzungen bedürfen der Textform.',
      ],
    },
    {
      titel: '3. Leistungen und Änderungswünsche',
      absaetze: [
        'Der Auftragnehmer erbringt die im Angebot beschriebenen Leistungen nach dem anerkannten Stand der Technik. Soweit vereinbart, setzt er Websites barrierefrei nach WCAG 2.2 Stufe AA um. Die Verantwortung für die rechtliche Einordnung und die Erfüllung eigener Pflichten des Auftraggebers, etwa nach dem Barrierefreiheitsstärkungsgesetz, bleibt beim Auftraggeber.',
        'Im Angebot ist die Anzahl der Korrekturschleifen festgelegt; fehlt eine Angabe, sind zwei Korrekturschleifen je Leistungsphase enthalten. Weitere Änderungswünsche und Leistungen, die über das Angebot hinausgehen, vergütet der Auftraggeber nach Aufwand zum vereinbarten Stundensatz. Der Auftragnehmer weist vorher darauf hin.',
        'Der Auftragnehmer darf geeignete Werkzeuge und Dienste einsetzen, auch KI-gestützte, sofern keine vertraulichen Daten des Auftraggebers ohne dessen Zustimmung an Dritte gelangen.',
      ],
    },
    {
      titel: '4. Mitwirkung des Auftraggebers',
      absaetze: [
        'Der Auftraggeber stellt Inhalte wie Texte, Bilder, Logos und Zugänge rechtzeitig und in geeigneter Form bereit und gibt Rückmeldungen innerhalb der im Ablauf vereinbarten Fristen.',
        'Der Auftraggeber versichert, dass er an allen gelieferten Inhalten die nötigen Rechte hat, und stellt den Auftragnehmer von Ansprüchen Dritter frei, die auf diesen Inhalten beruhen.',
        'Verzögert sich die Mitwirkung, verschieben sich vereinbarte Termine angemessen. Mehraufwand durch die Verzögerung kann der Auftragnehmer nach Aufwand berechnen.',
      ],
    },
    {
      titel: '5. Abnahme',
      absaetze: [
        'Nach Fertigstellung eines Werks oder einer vereinbarten Phase prüft der Auftraggeber die Leistung und erklärt innerhalb von 14 Tagen die Abnahme. Unwesentliche Mängel berechtigen nicht zur Verweigerung der Abnahme.',
        'Die Leistung gilt als abgenommen, wenn der Auftraggeber sie nicht innerhalb von 14 Tagen nach Fertigstellung unter Angabe wesentlicher Mängel ablehnt oder sie produktiv nutzt, etwa die Website veröffentlicht. Der Auftragnehmer weist bei der Fertigstellung auf diese Folge hin.',
      ],
    },
    {
      titel: '6. Vergütung und Zahlung',
      absaetze: [
        'Es gelten die Preise des Angebots. Alle Preise sind Nettopreise; die Umsatzsteuer kommt in der jeweils gesetzlichen Höhe hinzu, sofern sie anfällt.',
        'Bei Aufträgen ab 2.000 Euro netto stellt der Auftragnehmer 50 Prozent bei Auftragserteilung und den Rest nach Abnahme in Rechnung. Rechnungen sind innerhalb von 14 Tagen ohne Abzug zu zahlen.',
        'Kosten für Dienste Dritter, etwa Webflow, Hosting, Domains, Schriften oder Bildlizenzen, trägt der Auftraggeber, auch wenn der Auftragnehmer sie in dessen Namen abschließt. Reisekosten außerhalb von Augsburg und Umgebung werden nach Absprache erstattet.',
      ],
    },
    {
      titel: '7. Nutzungsrechte',
      absaetze: [
        'Mit vollständiger Zahlung erhält der Auftraggeber an den für ihn erstellten Arbeitsergebnissen die im Angebot genannten Nutzungsrechte; fehlt eine Angabe, ein einfaches, zeitlich und räumlich unbeschränktes Nutzungsrecht für den vereinbarten Zweck. Bis dahin ist die Nutzung nur zur Prüfung erlaubt.',
        'Entwürfe, Vorstufen und offene Arbeitsdateien bleiben beim Auftragnehmer, sofern nichts anderes vereinbart ist.',
        'Der Auftragnehmer darf das Projekt nach Veröffentlichung als Referenz zeigen. Name und Logo des Auftraggebers nutzt er nur mit dessen Freigabe, die der Auftraggeber im Kundenbereich jederzeit erteilen und widerrufen kann.',
      ],
    },
    {
      titel: '8. Gewährleistung',
      absaetze: [
        'Es gelten die gesetzlichen Regeln. Der Auftragnehmer hat zunächst das Recht, Mängel innerhalb angemessener Frist zu beseitigen.',
        'Keine Mängel sind Abweichungen, die auf Änderungen des Auftraggebers oder Dritter, auf Updates von Diensten Dritter oder auf nicht unterstützte Browser zurückgehen.',
      ],
    },
    {
      titel: '9. Haftung',
      absaetze: [
        'Der Auftragnehmer haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung von Leben, Körper und Gesundheit sowie nach dem Produkthaftungsgesetz.',
        'Bei leichter Fahrlässigkeit haftet er nur für die Verletzung wesentlicher Vertragspflichten und begrenzt auf den vertragstypischen, vorhersehbaren Schaden. Für den Verlust von Daten haftet er nur in dem Umfang, der bei regelmäßiger Datensicherung durch den Auftraggeber entstanden wäre.',
      ],
    },
    {
      titel: '10. Vertraulichkeit und Datenschutz',
      absaetze: [
        'Beide Seiten behandeln vertrauliche Informationen der anderen Seite vertraulich, auch nach Ende des Vertrags.',
        'Verarbeitet der Auftragnehmer im Auftrag personenbezogene Daten, schließen die Parteien vorher einen Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO.',
      ],
    },
    {
      titel: '11. Laufzeit und Kündigung',
      absaetze: [
        'Laufende Leistungen wie Pflege und Betreuung können beide Seiten mit einer Frist von einem Monat zum Monatsende kündigen, soweit im Angebot nichts anderes steht. Das Recht zur Kündigung aus wichtigem Grund bleibt unberührt.',
        'Kündigt der Auftraggeber einen Werkvertrag vor Fertigstellung, vergütet er die bis dahin erbrachten Leistungen und den nachweisbaren Aufwand; im Übrigen gilt § 648 BGB.',
      ],
    },
    {
      titel: '12. Schlussbestimmungen',
      absaetze: [
        'Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Ist der Auftraggeber Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand Augsburg.',
        'Sollte eine Bestimmung unwirksam sein, bleibt der Vertrag im Übrigen wirksam. An die Stelle der unwirksamen Bestimmung tritt die gesetzliche Regelung.',
      ],
    },
  ],
};
