import type { RueckfrageText } from './Rueckfrage';

// Texte der Rückfrage beim Löschen (functions/kundenbereich/admin-bearbeiten.md Verhalten 2 und 3, AK-4)

const anzahl = (n: number, eins: string, viele: string) => `${n} ${n === 1 ? eins : viele}`;

export const kundeLoeschenText = (name: string, projekte: number, ansprechpartner: number): RueckfrageText => ({
  titel: 'Kunde löschen?',
  text: `„${name}“ wird mit ${anzahl(projekte, 'Projekt', 'Projekten')} und ${anzahl(
    ansprechpartner,
    'Ansprechpartner',
    'Ansprechpartnern',
  )} gelöscht, samt Abläufen, Terminen, Dokumenten und Logo. Die Ansprechpartner verlieren den Zugang zum Kundenbereich. Das lässt sich nicht rückgängig machen.`,
  knopf: 'Kunde löschen',
});

export const projektLoeschenText = (titel: string): RueckfrageText => ({
  titel: 'Projekt löschen?',
  text: `„${titel}“ wird mit Ablauf, Terminen, Dokumenten und Umsatz gelöscht. Der Kunde sieht es danach nicht mehr. Das lässt sich nicht rückgängig machen.`,
  knopf: 'Projekt löschen',
});

export const anfrageLoeschenText = (name: string): RueckfrageText => ({
  titel: 'Anfrage löschen?',
  text: `Die Anfrage von „${name}“ wird mit allen Angaben gelöscht. Das lässt sich nicht rückgängig machen.`,
  knopf: 'Anfrage löschen',
});
