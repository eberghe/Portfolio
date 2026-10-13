'use server';

import type { AdminState } from '@/lib/kundenbereich/admin/aktionen';
import * as A from '@/lib/kundenbereich/admin/angebote';
import { go } from '@/lib/kundenbereich/admin/ausfuehren';

// Server Actions für Angebote in der Verwaltung (functions/kundenbereich/angebote.md)

export async function angebotSpeichern(_: AdminState, fd: FormData) {
  return go(A.angebotSpeichern, fd);
}
export async function angebotFreigeben(_: AdminState, fd: FormData) {
  return go(A.angebotFreigeben, fd);
}
export async function angebotLoeschen(_: AdminState, fd: FormData) {
  return go(A.angebotLoeschen, fd);
}
