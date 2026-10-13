'use server';

import * as A from '@/lib/kundenbereich/admin/aktionen';
import { go } from '@/lib/kundenbereich/admin/ausfuehren';

// Server Actions der Verwaltung (functions/kundenbereich/admin.md)

type S = A.AdminState;
export async function kundeAnlegen(_: S, fd: FormData) {
  return go(A.kundeAnlegen, fd);
}
export async function kundeSpeichern(_: S, fd: FormData) {
  return go(A.kundeSpeichern, fd);
}
export async function logoVorbereiten(_: S, fd: FormData) {
  return go(A.logoVorbereiten, fd);
}
export async function logoUebernehmen(_: S, fd: FormData) {
  return go(A.logoUebernehmen, fd);
}
export async function ansprechpartnerHinzufuegen(_: S, fd: FormData) {
  return go(A.ansprechpartnerHinzufuegen, fd);
}
export async function ansprechpartnerEntfernen(_: S, fd: FormData) {
  return go(A.ansprechpartnerEntfernen, fd);
}
export async function ansprechpartnerEinladen(_: S, fd: FormData) {
  return go(A.ansprechpartnerEinladen, fd);
}
export async function projektAnlegen(_: S, fd: FormData) {
  return go(A.projektAnlegen, fd);
}
export async function projektSpeichern(_: S, fd: FormData) {
  return go(A.projektSpeichern, fd);
}
export async function projektStatus(_: S, fd: FormData) {
  return go(A.projektStatus, fd);
}
export async function kundeStatus(_: S, fd: FormData) {
  return go(A.kundeStatus, fd);
}
export async function projektAnsprechpartner(_: S, fd: FormData) {
  return go(A.projektAnsprechpartner, fd);
}
export async function schrittHinzufuegen(_: S, fd: FormData) {
  return go(A.schrittHinzufuegen, fd);
}
export async function schrittSpeichern(_: S, fd: FormData) {
  return go(A.schrittSpeichern, fd);
}
export async function schrittEntfernen(_: S, fd: FormData) {
  return go(A.schrittEntfernen, fd);
}
export async function terminHinzufuegen(_: S, fd: FormData) {
  return go(A.terminHinzufuegen, fd);
}
export async function terminEntfernen(_: S, fd: FormData) {
  return go(A.terminEntfernen, fd);
}
export async function dokumentVorbereiten(_: S, fd: FormData) {
  return go(A.dokumentVorbereiten, fd);
}
export async function dokumentUebernehmen(_: S, fd: FormData) {
  return go(A.dokumentUebernehmen, fd);
}
export async function dokumentEntfernen(_: S, fd: FormData) {
  return go(A.dokumentEntfernen, fd);
}
export async function umsatzSpeichern(_: S, fd: FormData) {
  return go(A.umsatzSpeichern, fd);
}
export async function anfrageStatus(_: S, fd: FormData) {
  return go(A.anfrageStatus, fd);
}
export async function projektMitAssistent(_: S, fd: FormData) {
  return go(A.projektMitAssistent, fd);
}

// functions/kundenbereich/admin-bearbeiten.md
export async function schrittStatus(_: S, fd: FormData) {
  return go(A.schrittStatus, fd);
}
export async function schritteSortieren(_: S, fd: FormData) {
  return go(A.schritteSortieren, fd);
}
export async function projektLoeschen(_: S, fd: FormData) {
  return go(A.projektLoeschen, fd);
}
export async function kundeLoeschen(_: S, fd: FormData) {
  return go(A.kundeLoeschen, fd);
}
export async function anfrageLoeschen(_: S, fd: FormData) {
  return go(A.anfrageLoeschen, fd);
}
