'use client';

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Plus, Trash2 } from 'lucide-react';
import {
  Fragment,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { projektMitAssistent } from '@/app/actions/kundenbereich-admin';
import Button from '@/components/ui/Button';
import SelectField from '@/components/ui/SelectField';
import TextField, { labelClass } from '@/components/ui/TextField';
import type { AdminState } from '@/lib/kundenbereich/admin/aktionen';
import {
  assistentDaten,
  leererAnsprechpartner,
  leererTermin,
  MAX_SCHRITTE,
  SCHRITTE,
  schrittFehler,
  type AssistentDaten,
  type AssistentKunde,
  type NeuerAnsprechpartner,
} from '@/lib/kundenbereich/admin/assistent';
import { euro } from '@/lib/kundenbereich/admin/dashboard';
import { ansprechpartnerDaten, betrag } from '@/lib/kundenbereich/admin/pruefen';
import {
  optionLabel,
  PROJEKT_STATUS_OPTIONEN,
  SPRACH_OPTIONEN,
  VERANTWORTLICH_OPTIONEN,
} from '@/lib/kundenbereich/admin/texte';
import AdminShell from './AdminShell';

// Projekt anlegen in sechs Schritten (functions/kundenbereich/projekt-assistent.md).
// Alle Eingaben liegen im Zustand; angezeigt wird nur der aktuelle Schritt.

const LETZTER = SCHRITTE.length - 1;
const feldId = (key: string) => `pa-${key.replace(/\./g, '-')}`;
const card = 'border border-border rounded-2xl p-4 sm:p-5';
const choice =
  'flex items-center gap-3 min-h-11 px-3 py-2 rounded-lg border border-border bg-bg2 text-[14px] cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-light';
const box = 'w-6 h-6 accent-[hsl(var(--primary))] shrink-0';

type Fokus = { ziel: 'schritt' | 'fehler' | 'feld'; feld?: string; n: number };

export default function ProjektAssistent({ kunden, start }: { kunden: AssistentKunde[]; start: AssistentDaten }) {
  const [d, setD] = useState(start);
  const [schritt, setSchritt] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [allgemein, setAllgemein] = useState<string | null>(null);
  const [fokus, setFokus] = useState<Fokus | null>(null);
  const [entwurf, setEntwurf] = useState<NeuerAnsprechpartner>(leererAnsprechpartner());
  const [entwurfFehler, setEntwurfFehler] = useState<Record<string, string>>({});
  const [ansage, setAnsage] = useState('');
  // Kritiker Assistent 5: aus „Prüfen“ zum Bearbeiten gekommen
  const [vonPruefung, setVonPruefung] = useState(false);
  const [state, dispatch, pending] = useActionState<AdminState, FormData>(projektMitAssistent, { status: 'idle' });
  const [gesehen, setGesehen] = useState(state);
  const titel = useRef<HTMLHeadingElement>(null);
  const fehlerBox = useRef<HTMLDivElement>(null);

  const fokussiere = (ziel: Fokus['ziel'], feld?: string) => setFokus((f) => ({ ziel, feld, n: (f?.n ?? 0) + 1 }));

  // Antwort des Servers: zum Schritt mit dem Fehler (AK-3)
  if (state !== gesehen) {
    setGesehen(state);
    if (state.status === 'error') {
      if (state.schritt !== undefined) setSchritt(state.schritt);
      setErrors(state.errors ?? {});
      setAllgemein(state.errors && Object.keys(state.errors).length ? null : (state.message ?? null));
      fokussiere('fehler');
    }
  }

  useEffect(() => {
    if (!fokus) return;
    if (fokus.ziel === 'schritt') titel.current?.focus();
    else if (fokus.ziel === 'fehler') fehlerBox.current?.focus();
    else if (fokus.feld) document.getElementById(fokus.feld)?.focus();
  }, [fokus]);

  const kunde = kunden.find((k) => k.id === d.kunde.id);
  const bestehende = d.kunde.modus === 'bestehend' ? (kunde?.ansprechpartner ?? []) : [];

  const set = <K extends keyof AssistentDaten>(key: K, value: AssistentDaten[K]) =>
    setD((x) => ({ ...x, [key]: value }));
  const setProjekt = (key: keyof AssistentDaten['projekt'], value: string) =>
    setD((x) => ({ ...x, projekt: { ...x.projekt, [key]: value } }));

  const gehe = (ziel: number) => {
    if (ziel === LETZTER) setVonPruefung(false);
    setErrors({});
    setAllgemein(null);
    setSchritt(ziel);
    fokussiere('schritt');
  };

  const bearbeiten = (ziel: number) => {
    gehe(ziel);
    setVonPruefung(true);
  };

  /** Aktuellen Schritt prüfen; bei Fehlern Liste zeigen und false */
  const pruefeSchritt = () => {
    const f = schrittFehler(schritt, d);
    if (!Object.keys(f).length) return true;
    setErrors(f);
    setAllgemein(null);
    fokussiere('fehler');
    return false;
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    if (schritt < LETZTER) {
      if (pruefeSchritt()) gehe(schritt + 1);
      return;
    }
    const r = assistentDaten(d);
    if (!r.ok) {
      setSchritt(r.schritt);
      setErrors(r.errors);
      fokussiere('fehler');
      return;
    }
    const fd = new FormData();
    fd.set('daten', JSON.stringify(d));
    startTransition(() => dispatch(fd));
  };

  const err = (key: string) => errors[key];
  const fehlerListe = Object.entries(errors);

  // Ansprechpartner hinzufügen (Schritt 3)
  const hinzufuegen = () => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(entwurf)) fd.set(k, v);
    const r = ansprechpartnerDaten(fd);
    const f: Record<string, string> = r.ok ? {} : { ...r.errors };
    const mail = entwurf.email.trim().toLowerCase();
    if (!f.email && (d.ansprechpartner.neu.some((a) => a.email === mail) || bestehende.some((a) => a.email === mail)))
      f.email = 'Diese E-Mail steht schon in der Liste.';
    setEntwurfFehler(f);
    if (Object.keys(f).length) {
      fokussiere('feld', feldId(`entwurf.${Object.keys(f)[0]}`));
      return;
    }
    set('ansprechpartner', {
      ...d.ansprechpartner,
      neu: [...d.ansprechpartner.neu, { ...entwurf, name: entwurf.name.trim(), email: mail }],
    });
    setAnsage(`${entwurf.name.trim()} hinzugefügt.`);
    setEntwurf(leererAnsprechpartner());
    fokussiere('feld', feldId('entwurf.name'));
  };

  // Ablauf (Schritt 4)
  const schrittName = (i: number) => d.schritte[i]?.titel_de.trim() || `Ablaufschritt ${i + 1}`;
  const setSchritte = (s: AssistentDaten['schritte']) => set('schritte', s);
  const verschieben = (i: number, um: -1 | 1) => {
    const s = [...d.schritte];
    const [x] = s.splice(i, 1);
    s.splice(i + um, 0, x!);
    setSchritte(s);
    setAnsage(
      `${schrittName(i)} ${um < 0 ? 'nach oben' : 'nach unten'} verschoben, jetzt Ablaufschritt ${i + um + 1}.`,
    );
    fokussiere('feld', feldId(`schritte.${i + um}.${um < 0 ? 'hoch' : 'runter'}`));
  };

  const fortschritt = (
    <ol aria-label="Fortschritt" className="grid grid-cols-6 gap-1.5 sm:gap-2 mb-6">
      {SCHRITTE.map((s, i) => (
        <li key={s} aria-current={i === schritt ? 'step' : undefined} className="min-w-0">
          <span
            aria-hidden="true"
            className={`block h-1 rounded-full mb-1.5 ${i <= schritt ? 'bg-primary' : 'bg-bg3'}`}
          />
          <span
            className={`text-[11px] truncate ${i === schritt ? 'block text-foreground font-medium' : 'hidden sm:block text-text3'}`}
          >
            {s}
            {i < schritt && <span className="sr-only"> erledigt</span>}
          </span>
        </li>
      ))}
    </ol>
  );

  const kopf = (
    <legend className="mb-5">
      <h2 ref={titel} tabIndex={-1} className="text-[20px] font-bold">
        Schritt {schritt + 1} von {SCHRITTE.length}: {SCHRITTE[schritt]}
      </h2>
    </legend>
  );

  const wert = betrag(d.projekt.auftragswert_netto);

  return (
    <AdminShell title="Neues Projekt" pfad={[{ href: '/kunden/admin', label: 'Verwaltung' }]}>
      <form onSubmit={submit} noValidate aria-label="Neues Projekt" className="max-w-[720px]">
        {fortschritt}

        {(fehlerListe.length > 0 || allgemein) && (
          <div
            ref={fehlerBox}
            role="alert"
            tabIndex={-1}
            className="border border-error rounded-lg px-4 py-3 mb-6 text-[13px] text-error"
          >
            <p className="font-bold mb-1">{allgemein ?? 'Bitte prüf die markierten Felder.'}</p>
            {fehlerListe.length > 0 && (
              <ul role="list" className="flex flex-col gap-1">
                {fehlerListe.map(([k, v]) => (
                  <li key={k}>
                    <a href={`#${feldId(k)}`} className="underline underline-offset-2">
                      {v}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <p aria-live="polite" className="sr-only">
          {ansage}
        </p>

        <fieldset className="min-w-0 mb-8">
          {kopf}

          {schritt === 0 && (
            <div className="flex flex-col gap-5">
              <fieldset>
                <legend className={labelClass}>Kunde</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(['bestehend', 'neu'] as const).map((m) => (
                    <label key={m} className={choice}>
                      <input
                        type="radio"
                        name="kunde-modus"
                        value={m}
                        checked={d.kunde.modus === m}
                        disabled={m === 'bestehend' && kunden.length === 0}
                        onChange={() => set('kunde', { ...d.kunde, modus: m })}
                        className="w-4 h-4 accent-primary"
                      />
                      {m === 'bestehend' ? 'Bestehender Kunde' : 'Neuer Kunde'}
                    </label>
                  ))}
                </div>
              </fieldset>
              {d.kunde.modus === 'bestehend' ? (
                <SelectField
                  id={feldId('kunde.id')}
                  label="Kunde auswählen"
                  marker="(Pflicht)"
                  error={err('kunde.id')}
                  options={[
                    { value: '', label: 'Bitte wählen' },
                    ...kunden.map((k) => ({ value: k.id, label: k.name })),
                  ]}
                  value={d.kunde.id}
                  onChange={(e) => set('kunde', { ...d.kunde, id: e.target.value })}
                />
              ) : (
                <>
                  <TextField
                    id={feldId('kunde.name')}
                    label="Name des Kunden"
                    marker="(Pflicht)"
                    hint="Firma oder Person"
                    autoComplete="off"
                    error={err('kunde.name')}
                    value={d.kunde.name}
                    onChange={(e) => set('kunde', { ...d.kunde, name: e.target.value })}
                  />
                  <TextField
                    id={feldId('kunde.website_url')}
                    label="Website des Kunden"
                    type="url"
                    hint="Mit https://, z. B. https://firma.de"
                    error={err('kunde.website_url')}
                    value={d.kunde.website_url}
                    onChange={(e) => set('kunde', { ...d.kunde, website_url: e.target.value })}
                  />
                </>
              )}
            </div>
          )}

          {schritt === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                id={feldId('projekt.titel')}
                label="Titel"
                marker="(Pflicht)"
                className="sm:col-span-2"
                error={err('projekt.titel')}
                value={d.projekt.titel}
                onChange={(e) => setProjekt('titel', e.target.value)}
              />
              <SelectField
                id={feldId('projekt.status')}
                label="Status"
                options={PROJEKT_STATUS_OPTIONEN}
                error={err('projekt.status')}
                value={d.projekt.status}
                onChange={(e) => setProjekt('status', e.target.value)}
              />
              <TextField
                id={feldId('projekt.phase')}
                label="Aktuelle Phase"
                error={err('projekt.phase')}
                value={d.projekt.phase}
                onChange={(e) => setProjekt('phase', e.target.value)}
              />
              {(['beschreibung_de', 'beschreibung_en'] as const).map((k) => (
                <TextField
                  key={k}
                  id={feldId(`projekt.${k}`)}
                  label={k === 'beschreibung_de' ? 'Beschreibung Deutsch' : 'Beschreibung Englisch'}
                  multiline
                  rows={3}
                  className="sm:col-span-2"
                  error={err(`projekt.${k}`)}
                  value={d.projekt[k]}
                  onChange={(e) => setProjekt(k, e.target.value)}
                />
              ))}
              {(['website_url', 'staging_url'] as const).map((k) => (
                <TextField
                  key={k}
                  id={feldId(`projekt.${k}`)}
                  label={k === 'website_url' ? 'Website' : 'Testversion (Staging)'}
                  type="url"
                  hint="Mit https://"
                  error={err(`projekt.${k}`)}
                  value={d.projekt[k]}
                  onChange={(e) => setProjekt(k, e.target.value)}
                />
              ))}
              <h3 className="sm:col-span-2 text-[15px] font-bold mt-2">Umsatz (nur für dich sichtbar)</h3>
              <TextField
                id={feldId('projekt.auftragswert_netto')}
                label="Auftragswert netto in Euro"
                hint="Z. B. 12.500 oder 12.500,50"
                inputMode="decimal"
                error={err('projekt.auftragswert_netto')}
                value={d.projekt.auftragswert_netto}
                onChange={(e) => setProjekt('auftragswert_netto', e.target.value)}
              />
              <TextField
                id={feldId('projekt.wahrscheinlichkeit')}
                label="Wahrscheinlichkeit in Prozent"
                hint="Zählt nur bei Angeboten"
                type="number"
                min={0}
                max={100}
                error={err('projekt.wahrscheinlichkeit')}
                value={d.projekt.wahrscheinlichkeit}
                onChange={(e) => setProjekt('wahrscheinlichkeit', e.target.value)}
              />
              <TextField
                id={feldId('projekt.abrechnung_am')}
                label="Voraussichtliche Abrechnung"
                type="date"
                error={err('projekt.abrechnung_am')}
                value={d.projekt.abrechnung_am}
                onChange={(e) => setProjekt('abrechnung_am', e.target.value)}
              />
            </div>
          )}

          {schritt === 2 && (
            <div className="flex flex-col gap-6">
              {/* Kritiker Assistent 14: Link der Fehlerliste führt zum ersten Kontrollkästchen */}
              {err('ansprechpartner') && (
                <p
                  id={bestehende.length > 0 ? feldId('ansprechpartner.fehler') : feldId('ansprechpartner')}
                  tabIndex={-1}
                  className="text-[13px] text-error"
                >
                  {err('ansprechpartner')}
                </p>
              )}
              {bestehende.length > 0 && (
                <fieldset aria-describedby={err('ansprechpartner') ? feldId('ansprechpartner.fehler') : undefined}>
                  <legend className={labelClass}>Ansprechpartner von {kunde?.name}</legend>
                  <div className="flex flex-col gap-1">
                    {bestehende.map((a, i) => (
                      <label key={a.id} className="flex items-center gap-3 min-h-11 text-[14px] cursor-pointer">
                        <input
                          id={i === 0 ? feldId('ansprechpartner') : undefined}
                          aria-invalid={err('ansprechpartner') ? true : undefined}
                          type="checkbox"
                          className={box}
                          checked={d.ansprechpartner.ids.includes(a.id)}
                          onChange={(e) =>
                            set('ansprechpartner', {
                              ...d.ansprechpartner,
                              ids: e.target.checked
                                ? [...d.ansprechpartner.ids, a.id]
                                : d.ansprechpartner.ids.filter((x) => x !== a.id),
                            })
                          }
                        />
                        {a.name} ({a.email})
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {d.ansprechpartner.neu.length > 0 && (
                <div>
                  <h3 className={labelClass}>Neue Ansprechpartner</h3>
                  <ul role="list" className="flex flex-col divide-y divide-border border-y border-border">
                    {d.ansprechpartner.neu.map((a, i) => {
                      const fehler = Object.entries(errors).filter(([k]) => k.startsWith(`ap.${i}.`));
                      return (
                        <li
                          key={a.email}
                          id={feldId(`ap.${i}.email`)}
                          tabIndex={-1}
                          className="flex flex-wrap items-center justify-between gap-3 py-3"
                        >
                          <span className="min-w-0 text-[14px]">
                            <span className="font-medium">{a.name}</span>{' '}
                            <span className="text-text2 break-all">({a.email})</span>
                            {fehler.map(([k, v]) => (
                              <span key={k} className="block text-[12px] text-error mt-1">
                                {v}
                              </span>
                            ))}
                          </span>
                          <Button
                            variant="secondary"
                            aria-label={`Entfernen: ${a.name}`}
                            onClick={() => {
                              set('ansprechpartner', {
                                ...d.ansprechpartner,
                                neu: d.ansprechpartner.neu.filter((_, j) => j !== i),
                              });
                              setAnsage(`${a.name} entfernt.`);
                              fokussiere('feld', feldId('entwurf.name'));
                            }}
                          >
                            <Trash2 size={15} aria-hidden="true" />
                            Entfernen
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <fieldset className={card}>
                <legend className="text-[15px] font-bold px-1">Ansprechpartner hinzufügen</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 mb-4">
                  {(
                    [
                      ['name', 'Name', 'text', true],
                      ['email', 'E-Mail', 'email', true],
                      ['rolle', 'Rolle', 'text', false],
                      ['telefon', 'Telefon', 'tel', false],
                    ] as const
                  ).map(([k, label, type, pflicht]) => (
                    <TextField
                      key={k}
                      id={feldId(`entwurf.${k}`)}
                      label={label}
                      // Kritiker Assistent 13: Pflicht nur, wenn jemand hinzugefügt wird
                      marker={pflicht ? '(Pflicht beim Hinzufügen)' : undefined}
                      type={type}
                      autoComplete="off"
                      error={entwurfFehler[k]}
                      value={entwurf[k]}
                      onChange={(e) => setEntwurf((x) => ({ ...x, [k]: e.target.value }))}
                    />
                  ))}
                  <SelectField
                    id={feldId('entwurf.sprache')}
                    label="Sprache"
                    options={SPRACH_OPTIONEN}
                    value={entwurf.sprache}
                    onChange={(e) => setEntwurf((x) => ({ ...x, sprache: e.target.value as 'de' | 'en' }))}
                  />
                </div>
                <Button variant="secondary" onClick={hinzufuegen}>
                  <Plus size={15} aria-hidden="true" />
                  Hinzufügen
                </Button>
              </fieldset>

              <div>
                <label className="flex items-center gap-3 min-h-11 text-[14px] cursor-pointer">
                  <input
                    type="checkbox"
                    className={box}
                    aria-describedby={feldId('einladen.hinweis')}
                    checked={d.einladen}
                    onChange={(e) => set('einladen', e.target.checked)}
                  />
                  Anmeldelink an neue Ansprechpartner schicken
                </label>
                <p id={feldId('einladen.hinweis')} className="text-[12px] text-text2 ml-9">
                  Nur neu hinzugefügte Ansprechpartner bekommen den Link. Bestehende lädst du auf der Kundenseite ein.
                </p>
              </div>
            </div>
          )}

          {schritt === 3 && (
            <div className="flex flex-col gap-4">
              {err('schritte') && <p className="text-[13px] text-error">{err('schritte')}</p>}
              {d.schritte.length === 0 && <p className="text-[14px] text-text2">Noch keine Schritte im Ablauf.</p>}
              <ol role="list" className="flex flex-col gap-3">
                {d.schritte.map((s, i) => (
                  <li key={i} className={card}>
                    {/* Kritiker Assistent 7: „Ablaufschritt“, nicht zu verwechseln mit den Schritten des Assistenten */}
                    <p className="text-[13px] font-bold text-text2 mb-3">Ablaufschritt {i + 1}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <TextField
                        id={feldId(`schritte.${i}.titel_de`)}
                        label={
                          <>
                            Titel Deutsch<span className="sr-only">, Ablaufschritt {i + 1}</span>
                          </>
                        }
                        marker="(Pflicht)"
                        error={err(`schritte.${i}.titel_de`)}
                        value={s.titel_de}
                        onChange={(e) =>
                          setSchritte(d.schritte.map((x, j) => (j === i ? { ...x, titel_de: e.target.value } : x)))
                        }
                      />
                      <TextField
                        id={feldId(`schritte.${i}.titel_en`)}
                        label={
                          <>
                            Titel Englisch<span className="sr-only">, Ablaufschritt {i + 1}</span>
                          </>
                        }
                        error={err(`schritte.${i}.titel_en`)}
                        value={s.titel_en}
                        onChange={(e) =>
                          setSchritte(d.schritte.map((x, j) => (j === i ? { ...x, titel_en: e.target.value } : x)))
                        }
                      />
                      <SelectField
                        id={feldId(`schritte.${i}.verantwortlich`)}
                        label={
                          <>
                            Verantwortlich<span className="sr-only">, Ablaufschritt {i + 1}</span>
                          </>
                        }
                        options={VERANTWORTLICH_OPTIONEN}
                        value={s.verantwortlich}
                        onChange={(e) =>
                          setSchritte(
                            d.schritte.map((x, j) =>
                              j === i ? { ...x, verantwortlich: e.target.value as 'erik' | 'kunde' } : x,
                            ),
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {i > 0 && (
                        <Button
                          id={feldId(`schritte.${i}.hoch`)}
                          variant="secondary"
                          aria-label={`Nach oben: ${schrittName(i)}`}
                          onClick={() => verschieben(i, -1)}
                        >
                          <ArrowUp size={15} aria-hidden="true" />
                          Nach oben
                        </Button>
                      )}
                      {i < d.schritte.length - 1 && (
                        <Button
                          id={feldId(`schritte.${i}.runter`)}
                          variant="secondary"
                          aria-label={`Nach unten: ${schrittName(i)}`}
                          onClick={() => verschieben(i, 1)}
                        >
                          <ArrowDown size={15} aria-hidden="true" />
                          Nach unten
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        aria-label={`Entfernen: ${schrittName(i)}`}
                        onClick={() => {
                          setAnsage(`${schrittName(i)} entfernt.`);
                          setSchritte(d.schritte.filter((_, j) => j !== i));
                          // Kritiker Assistent 9/20: alte Fehler weg, Fokus auf das nächste oder vorige Titelfeld
                          setErrors({});
                          setAllgemein(null);
                          const rest = d.schritte.length - 1;
                          fokussiere(
                            'feld',
                            rest === 0 ? feldId('schritt-neu') : feldId(`schritte.${Math.min(i, rest - 1)}.titel_de`),
                          );
                        }}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                        Entfernen
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
              {d.schritte.length < MAX_SCHRITTE && (
                <div>
                  <Button
                    id={feldId('schritt-neu')}
                    variant="secondary"
                    onClick={() => {
                      setSchritte([...d.schritte, { titel_de: '', titel_en: '', verantwortlich: 'erik' }]);
                      setAnsage(`Ablaufschritt ${d.schritte.length + 1} hinzugefügt.`);
                      fokussiere('feld', feldId(`schritte.${d.schritte.length}.titel_de`));
                    }}
                  >
                    <Plus size={15} aria-hidden="true" />
                    Ablaufschritt hinzufügen
                  </Button>
                </div>
              )}
            </div>
          )}

          {schritt === 4 && (
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 min-h-11 text-[14px] cursor-pointer">
                <input
                  type="checkbox"
                  className={box}
                  checked={d.termin !== null}
                  onChange={(e) => set('termin', e.target.checked ? leererTermin() : null)}
                />
                Ersten Termin eintragen
              </label>
              {d.termin && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(
                    [
                      ['datum', 'Datum', 'date', true],
                      ['beginn', 'Beginn', 'time', true],
                      ['ende', 'Ende', 'time', true],
                    ] as const
                  ).map(([k, label, type, pflicht]) => (
                    <TextField
                      key={k}
                      id={feldId(`termin.${k}`)}
                      label={label}
                      marker={pflicht ? '(Pflicht)' : undefined}
                      hint={k === 'beginn' ? 'Deutsche Zeit' : undefined}
                      type={type}
                      error={err(`termin.${k}`)}
                      value={d.termin![k]}
                      onChange={(e) => set('termin', { ...d.termin!, [k]: e.target.value })}
                    />
                  ))}
                  {(
                    [
                      ['titel_de', 'Thema Deutsch', 'text'],
                      ['titel_en', 'Thema Englisch', 'text'],
                      ['meet_url', 'Meet-Link', 'url'],
                    ] as const
                  ).map(([k, label, type]) => (
                    <TextField
                      key={k}
                      id={feldId(`termin.${k}`)}
                      label={label}
                      type={type}
                      hint={k === 'meet_url' ? 'Mit https://' : undefined}
                      className={k === 'meet_url' ? 'sm:col-span-3' : 'sm:col-span-3 md:col-span-1'}
                      error={err(`termin.${k}`)}
                      value={d.termin![k]}
                      onChange={(e) => set('termin', { ...d.termin!, [k]: e.target.value })}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {schritt === 5 && (
            <div className="flex flex-col gap-4">
              <Zusammenfassung titel="Kunde" schritt={0} gehe={bearbeiten}>
                {d.kunde.modus === 'bestehend' ? (kunde?.name ?? '') : `${d.kunde.name} (neu)`}
                {d.kunde.modus === 'neu' && d.kunde.website_url && <span className="block">{d.kunde.website_url}</span>}
              </Zusammenfassung>
              <Zusammenfassung titel="Projekt" schritt={1} gehe={bearbeiten}>
                {/* Kritiker Assistent 8: Werte mit Beschriftung */}
                <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1">
                  {(
                    [
                      ['Titel', d.projekt.titel],
                      ['Status', optionLabel(PROJEKT_STATUS_OPTIONEN, d.projekt.status)],
                      ['Auftragswert', wert === null || Number.isNaN(wert) ? 'Keiner' : euro(wert)],
                      ['Wahrscheinlichkeit', `${d.projekt.wahrscheinlichkeit} %`],
                      ['Abrechnung', d.projekt.abrechnung_am || 'Offen'],
                    ] as const
                  ).map(([k, v]) => (
                    <Fragment key={k}>
                      <dt className="text-text3">{k}</dt>
                      <dd className="text-foreground">{v}</dd>
                    </Fragment>
                  ))}
                </dl>
              </Zusammenfassung>
              <Zusammenfassung titel="Ansprechpartner" schritt={2} gehe={bearbeiten}>
                <ul role="list">
                  {bestehende
                    .filter((a) => d.ansprechpartner.ids.includes(a.id))
                    .map((a) => (
                      <li key={a.id}>{a.name}</li>
                    ))}
                  {d.ansprechpartner.neu.map((a) => (
                    <li key={a.email}>{a.name} (neu)</li>
                  ))}
                </ul>
                {d.einladen && d.ansprechpartner.neu.length > 0 && (
                  <span className="block mt-1">Anmeldelink wird verschickt.</span>
                )}
              </Zusammenfassung>
              <Zusammenfassung titel="Ablauf" schritt={3} gehe={bearbeiten}>
                {d.schritte.length === 0 ? (
                  'Kein Ablauf'
                ) : (
                  <ol role="list" className="list-decimal pl-5">
                    {d.schritte.map((s, i) => (
                      <li key={i}>
                        {s.titel_de} {s.verantwortlich === 'kunde' ? '(Kunde)' : '(Erik)'}
                      </li>
                    ))}
                  </ol>
                )}
              </Zusammenfassung>
              <Zusammenfassung titel="Termin" schritt={4} gehe={bearbeiten}>
                {d.termin
                  ? `${d.termin.datum}, ${d.termin.beginn}–${d.termin.ende} Uhr${d.termin.titel_de ? `, ${d.termin.titel_de}` : ''}`
                  : 'Kein Termin'}
              </Zusammenfassung>
            </div>
          )}
        </fieldset>

        <div className="grid grid-cols-2 sm:flex sm:justify-between gap-3">
          {schritt > 0 ? (
            <Button variant="secondary" onClick={() => gehe(schritt - 1)}>
              <ArrowLeft size={15} aria-hidden="true" />
              Zurück
            </Button>
          ) : (
            <span />
          )}
          {vonPruefung && schritt < LETZTER && (
            <Button
              variant="secondary"
              className="col-span-2 sm:col-span-1 sm:ml-auto"
              onClick={() => pruefeSchritt() && gehe(LETZTER)}
            >
              Zurück zur Prüfung
            </Button>
          )}
          <Button type="submit" aria-disabled={pending || undefined}>
            {schritt < LETZTER ? (
              <>
                Weiter
                <ArrowRight size={15} aria-hidden="true" />
              </>
            ) : pending ? (
              'Wird angelegt …'
            ) : (
              'Projekt anlegen'
            )}
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}

function Zusammenfassung({
  titel,
  schritt,
  gehe,
  children,
}: {
  titel: string;
  schritt: number;
  gehe: (n: number) => void;
  children: ReactNode;
}) {
  return (
    <section aria-label={titel} className={`${card} flex flex-wrap items-start justify-between gap-3`}>
      <div className="min-w-0">
        <h3 className="text-[14px] font-bold mb-1">{titel}</h3>
        <div className="text-[14px] text-text2 break-words">{children}</div>
      </div>
      <Button variant="secondary" aria-label={`Bearbeiten: ${titel}`} onClick={() => gehe(schritt)}>
        Bearbeiten
      </Button>
    </section>
  );
}
