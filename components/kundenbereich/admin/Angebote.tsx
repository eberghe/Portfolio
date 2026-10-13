import { Plus } from 'lucide-react';
import { angebotFreigeben, angebotLoeschen, angebotSpeichern } from '@/app/actions/kundenbereich-angebote';
import { ANGEBOT_STATUS_LABEL } from '@/lib/kundenbereich/admin/angebote-text';
import type { AngebotZeile } from '@/lib/kundenbereich/admin/laden';
import { euro } from '@/lib/kundenbereich/angebot/rechnen';
import type { AngebotVorlage } from '@/lib/kundenbereich/angebot/vorlage';
import { datum } from '@/lib/kundenbereich/projekte';
import AdminDialog from './AdminDialog';
import { badge, karte, kartenTitel } from './AdminListen';
import AktionenMenue, { type MenueEintrag } from './AktionenMenue';
import AngebotForm from './AngebotForm';

// Karte „Angebote“ im Projekt der Verwaltung (functions/kundenbereich/angebote.md Verhalten 1 und 4, AK-7)

function status(a: AngebotZeile) {
  if (a.status === 'unterschrieben' && a.unterschrieben_am)
    return `Unterschrieben am ${datum(a.unterschrieben_am.slice(0, 10), 'de')}`;
  return ANGEBOT_STATUS_LABEL[a.status];
}

export default function Angebote({
  projektId,
  angebote,
  vorlage,
}: {
  projektId: string;
  angebote: AngebotZeile[];
  vorlage: AngebotVorlage;
}) {
  return (
    <section aria-labelledby="angebote-titel" className={karte}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 id="angebote-titel" className={kartenTitel}>
          Angebote
        </h2>
        <AdminDialog label="Angebot erstellen" icon={<Plus size={18} aria-hidden="true" />} nurIcon>
          <AngebotForm action={angebotSpeichern} projektId={projektId} start={vorlage} />
        </AdminDialog>
      </div>
      {angebote.length === 0 ? (
        <p className="text-[15px] text-text2">Noch keine Angebote.</p>
      ) : (
        <ul role="list" className="flex flex-col">
          {angebote.map((a) => {
            const name = `Angebot ${a.nummer}`;
            const eintraege: MenueEintrag[] = [
              { art: 'link', label: 'PDF ansehen', href: `/kunden/admin/angebote/${a.id}/pdf`, extern: true },
            ];
            if (a.status === 'entwurf')
              eintraege.push(
                {
                  art: 'dialog',
                  label: 'Bearbeiten',
                  titel: `${name} bearbeiten`,
                  inhalt: <AngebotForm action={angebotSpeichern} projektId={projektId} angebotId={a.id} start={a} />,
                },
                {
                  art: 'aktion',
                  label: 'An Kunden freigeben',
                  aktion: angebotFreigeben,
                  hidden: { id: a.id },
                  bestaetigen: {
                    titel: `${name} freigeben?`,
                    text: 'Der Kunde sieht das Angebot danach unter Dokumente und kann es unterschrieben hochladen. Ändern geht dann nicht mehr, nur ein neues Angebot.',
                    knopf: 'Freigeben',
                    gefahr: false,
                  },
                },
              );
            if (a.unterschrift_id)
              eintraege.push({
                art: 'link',
                label: 'Unterschriebenes ansehen',
                href: `/kunden/dokumente/${a.unterschrift_id}`,
                extern: true,
              });
            eintraege.push({
              art: 'aktion',
              label: 'Löschen',
              aktion: angebotLoeschen,
              hidden: { id: a.id },
              bestaetigen: {
                titel: `${name} löschen?`,
                text:
                  a.status === 'entwurf'
                    ? 'Der Entwurf wird mit dem PDF gelöscht.'
                    : 'Das Angebot verschwindet mit dem PDF und einer hochgeladenen Unterschrift, auch beim Kunden.',
                knopf: 'Angebot löschen',
              },
              gefahr: true,
            });
            return (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 py-3 border-t border-border first:border-0 first:pt-0"
              >
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold break-words">{name}</h3>
                  <p className="text-[13px] text-text2 break-words">
                    {a.titel} · <span className="font-semibold text-foreground">{euro(a.gesamt_cent, 'de')}</span>
                  </p>
                  <p className="mt-1">
                    <span className={badge}>{status(a)}</span>
                  </p>
                </div>
                <AktionenMenue name={name} eintraege={eintraege} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
