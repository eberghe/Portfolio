// Status eines Angebots (functions/kundenbereich/angebote.md Verhalten 4)

export type AngebotStatus = 'entwurf' | 'freigegeben' | 'unterschrieben';

export const ANGEBOT_STATUS_LABEL: Record<AngebotStatus, string> = {
  entwurf: 'Entwurf',
  freigegeben: 'Beim Kunden',
  unterschrieben: 'Unterschrieben',
};
