'use client';

import { ArrowLeft, ArrowRight, Copy, Mail } from 'lucide-react';
import Link from 'next/link';
import { startTransition, useActionState, useEffect, useRef, useState, type ReactNode } from 'react';
import { submitInquiry } from '@/app/actions/inquiry';
import { budgets, contactText, OTHER_SERVICE, timeframes } from '@/lib/content/contact';
import { services } from '@/lib/content/services';
import { inquiryLines } from '@/lib/contact/mailto';
import type { InquiryState } from '@/lib/contact/state';
import { fields, serviceValues, steps, validateInquiry, type Field, type FieldErrors } from '@/lib/contact/validate';
import { localizedPath, type Locale } from '@/lib/i18n';

// Anfrage-Assistent in vier Schritten, siehe functions/kontakt/anfrage-assistent.md.
// Alle Felder bleiben im DOM (ausgeblendete Schritte mit `hidden`), damit Eingaben beim Blättern erhalten bleiben
// und das Formular ohne JavaScript als Ganzes abgeschickt werden kann (AK-10).

const LAST = steps.length - 1;
const id = (field: Field) => `anfrage-${field}`;
const errorId = (field: Field) => `anfrage-${field}-fehler`;
const stepOf = (field: Field) => steps.findIndex((s) => s.includes(field));
const firstError = (errors: FieldErrors) => fields.find((f) => errors[f]);

// Ohne JavaScript: alle Schritte zeigen, Blättern ausblenden
const noScriptCss = '[data-schritt][hidden]{display:block!important}[data-nur-js]{display:none!important}';

const inputClass =
  'w-full bg-bg2 border rounded-lg px-3 py-2.5 text-[13px] text-foreground placeholder:text-text2 focus:border-primary transition-colors font-sans';
const labelClass = 'text-[11px] font-medium tracking-wide uppercase text-text3 mb-1.5 block';
const summaryHeadingClass = labelClass.replace('font-medium', 'font-bold');
const choiceClass =
  'flex items-center gap-2 sm:gap-3 min-h-11 px-2.5 sm:px-3 py-2 rounded-lg border border-border bg-bg2 text-[13px] leading-tight hyphens-auto text-foreground cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-light motion-safe:transition-colors hover:border-primary/50';
const buttonClass =
  'inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-lg text-[13px] font-medium transition-opacity max-sm:flex-1';

type Focus = { target: 'step' | 'summary' | 'notice' | 'thanks'; n: number };

export default function InquiryWizard({ locale }: { locale: Locale }) {
  const t = contactText[locale];
  const [state, dispatch, pending] = useActionState<InquiryState, FormData>(submitInquiry, { status: 'idle' });
  const initialErrors = state.status === 'invalid' ? state.errors : {};
  const [errors, setErrors] = useState<FieldErrors>(initialErrors);
  const [step, setStep] = useState(() => {
    const f = firstError(initialErrors);
    return f ? stepOf(f) : 0;
  });
  const [focus, setFocus] = useState<Focus | null>(null);
  const requestFocus = (target: Focus['target']) => setFocus((f) => ({ target, n: (f?.n ?? 0) + 1 }));
  const [seen, setSeen] = useState(state);
  const [length, setLength] = useState(() =>
    state.status === 'invalid' ? String(state.values.beschreibung ?? '').length : 0,
  );
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');

  const form = useRef<HTMLFormElement>(null);
  const headings = useRef<(HTMLHeadingElement | null)[]>([]);
  const summary = useRef<HTMLDivElement>(null);
  const notice = useRef<HTMLDivElement>(null);
  const thanks = useRef<HTMLHeadingElement>(null);
  const actions = useRef<HTMLDivElement>(null);

  // Neue Antwort des Servers übernehmen (AK-2, AK-7, AK-8)
  if (state !== seen) {
    setSeen(state);
    if (state.status === 'invalid') {
      setErrors(state.errors);
      const f = firstError(state.errors);
      if (f) setStep(stepOf(f));
      requestFocus('summary');
    } else if (state.status === 'sent') {
      requestFocus('thanks');
    } else if (state.status !== 'idle') {
      setErrors({});
      requestFocus('notice');
    }
  }

  useEffect(() => {
    if (!focus) return;
    const el = {
      step: headings.current[step],
      summary: summary.current,
      notice: notice.current,
      thanks: thanks.current,
    }[focus.target];
    el?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nur bei neuer Fokus-Anforderung
  }, [focus]);

  // Vorauswahl über ?leistung=<slug> (AK-9)
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('leistung');
    if (!slug || !serviceValues.includes(slug)) return;
    const box = form.current?.querySelector<HTMLInputElement>(`input[name="leistungen"][value="${slug}"]`);
    if (box) box.checked = true;
  }, []);

  const showErrors = (found: FieldErrors) => {
    setErrors(found);
    if (Object.keys(found).length > 0) requestFocus('summary');
    return Object.keys(found).length === 0;
  };

  const goTo = (target: number) => {
    setErrors({});
    setStep(target);
    requestFocus('step');
  };

  // Auf dem Handy kleben die Schritt-Buttons unten; ein fokussiertes Feld darunter wird hochgescrollt (kontakt.md AK-7)
  const onFocusField = (e: React.FocusEvent<HTMLFormElement>) => {
    const bar = actions.current;
    if (!bar || bar.contains(e.target) || getComputedStyle(bar).position !== 'sticky') return;
    const field = (e.target.closest('label') ?? e.target).getBoundingClientRect();
    const overlap = field.bottom - bar.getBoundingClientRect().top + 8;
    if (overlap > 0) window.scrollBy({ top: overlap, behavior: 'instant' });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const data = new FormData(e.currentTarget);
    if (step < LAST) {
      if (showErrors(validateInquiry(data, steps[step]).errors)) goTo(step + 1);
      return;
    }
    const { errors: found } = validateInquiry(data);
    const f = firstError(found);
    if (f) {
      setStep(stepOf(f));
      showErrors(found);
      return;
    }
    setErrors({});
    startTransition(() => dispatch(data));
  };

  if (state.status === 'sent') {
    return (
      <section aria-labelledby="anfrage-danke">
        <h2 id="anfrage-danke" ref={thanks} tabIndex={-1} className="text-[22px] font-bold tracking-tight mb-2">
          {t.thanks(state.summary.name)}
        </h2>
        <p className="text-sm text-text2 leading-relaxed mb-6">{t.thanksText}</p>
        <h3 className={summaryHeadingClass}>{t.summary}</h3>
        <dl className="border border-border rounded-xl divide-y divide-border">
          {inquiryLines(state.summary).map(([label, value]) => (
            <div key={label} className="px-4 py-3">
              <dt className="text-[11px] uppercase tracking-wider text-text3 font-medium mb-0.5">{label}</dt>
              <dd className="text-[13px] text-foreground whitespace-pre-line break-words">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  const values = state.status === 'invalid' ? state.values : {};
  const text = (f: Field) => (typeof values[f] === 'string' ? (values[f] as string) : undefined);
  const chosen = (f: Field, v: string) => [values[f] ?? []].flat().includes(v);
  const errorList = fields.filter((f) => errors[f]);
  const message = (f: Field) => t.errors[f]?.[errors[f]!] ?? '';

  /** aria-Attribute und Fehlermeldung eines Feldes */
  const describe = (f: Field, hint?: string) => ({
    'aria-invalid': errors[f] ? true : undefined,
    'aria-describedby': [hint, errors[f] ? errorId(f) : null].filter(Boolean).join(' ') || undefined,
  });
  const fieldError = (f: Field) =>
    errors[f] ? (
      <p id={errorId(f)} className="text-[12px] text-error mt-1.5">
        {message(f)}
      </p>
    ) : null;

  const label = (text: string, required: boolean) => (
    <>
      {text} <span className="normal-case tracking-normal font-normal">{required ? t.required : t.optional}</span>
    </>
  );

  const stepFieldset = (i: number, children: ReactNode, description?: string) => {
    const groupErrors = steps[i]!.filter((f) => f === 'leistungen' && errors[f]);
    return (
      <fieldset
        data-schritt
        hidden={i !== step}
        aria-describedby={[description, ...groupErrors.map(errorId)].filter(Boolean).join(' ') || undefined}
        className="mb-4 min-w-0"
      >
        <legend className="mb-3">
          <h3
            ref={(el) => {
              headings.current[i] = el;
            }}
            tabIndex={-1}
            className="text-[17px] font-bold text-foreground"
          >
            {t.stepOf(i + 1, steps.length, t.steps[i]!)}
          </h3>
        </legend>
        {children}
      </fieldset>
    );
  };

  const radios = (
    name: 'zeitrahmen' | 'budget',
    legend: string,
    options: readonly string[],
    labels: Record<string, string>,
  ) => (
    <fieldset className="mb-5 min-w-0" {...describe(name)}>
      <legend className={labelClass}>{label(legend, false)}</legend>
      <div className="grid gap-1.5 sm:gap-2 grid-cols-2">
        {options.map((o, i) => (
          <label key={o} className={choiceClass}>
            <input
              type="radio"
              id={i === 0 ? id(name) : undefined}
              name={name}
              value={o}
              defaultChecked={text(name) ? text(name) === o : o === 'offen'}
              className="w-4 h-4 accent-primary shrink-0"
            />
            {labels[o]}
          </label>
        ))}
      </div>
      {fieldError(name)}
    </fieldset>
  );

  return (
    <form ref={form} action={dispatch} onSubmit={onSubmit} onFocus={onFocusField} noValidate className="relative">
      <noscript>
        <style>{noScriptCss}</style>
      </noscript>
      <input type="hidden" name="sprache" value={locale} />

      <ol aria-label={t.progress} data-nur-js className="grid grid-cols-4 gap-2 mb-4">
        {t.steps.map((s, i) => (
          <li key={s} aria-current={i === step ? 'step' : undefined} className="min-w-0">
            <span
              aria-hidden="true"
              className={`block h-1 rounded-full mb-1.5 ${i <= step ? 'bg-primary' : 'bg-bg3'}`}
            />
            <span className={`block text-[11px] truncate ${i === step ? 'text-foreground font-medium' : 'text-text3'}`}>
              {s}
              {i < step && <span className="sr-only"> {t.done}</span>}
            </span>
          </li>
        ))}
      </ol>

      {(state.status === 'fallback' || state.status === 'limited') && (
        <div
          ref={notice}
          tabIndex={-1}
          role="group"
          aria-labelledby="anfrage-hinweis"
          className="border border-border bg-bg2 rounded-xl p-4 mb-6"
        >
          <h3 id="anfrage-hinweis" className="text-[13px] font-bold text-foreground mb-1">
            {state.status === 'limited'
              ? t.limited
              : state.reason === 'unavailable'
                ? t.fallbackUnavailable
                : t.fallbackFailed}
          </h3>
          {state.status === 'fallback' && (
            <>
              <p className="text-[13px] text-text2 mb-3">{t.fallbackText}</p>
              <a
                href={state.mailto}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-[13px] font-medium hover:bg-primary-hover transition-colors"
              >
                <Mail size={15} aria-hidden="true" />
                {t.fallbackLink}
              </a>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(state.text);
                    setCopied('ok');
                  } catch {
                    setCopied('fail');
                  }
                }}
                className="inline-flex items-center gap-2 min-h-11 ml-0 mt-2 sm:mt-0 sm:ml-2 border border-border text-foreground px-4 py-2.5 rounded-lg text-[13px] font-medium hover:border-primary transition-colors"
              >
                <Copy size={15} aria-hidden="true" />
                {t.copy}
              </button>
              <p aria-live="polite" className="text-[12px] text-text2 mt-2">
                {copied === 'ok' ? t.copied : copied === 'fail' ? t.copyFailed : ''}
              </p>
              {copied === 'fail' && (
                <pre className="mt-2 text-[12px] text-foreground whitespace-pre-wrap break-words bg-background border border-border rounded-lg p-3 select-all">
                  {state.text}
                </pre>
              )}
            </>
          )}
        </div>
      )}

      {errorList.length > 0 && (
        <div
          ref={summary}
          tabIndex={-1}
          role="group"
          aria-labelledby="anfrage-fehler-titel"
          className="border border-error rounded-xl p-4 mb-4"
        >
          <h3 id="anfrage-fehler-titel" className="text-[13px] font-bold text-foreground mb-2">
            {t.errorsTitle(errorList.length)}
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {errorList.map((f) => (
              <li key={f} className="text-[13px] text-error">
                <a
                  href={`#${id(f)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(id(f))?.focus();
                  }}
                  className="underline underline-offset-2"
                >
                  {message(f)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stepFieldset(
        0,
        <>
          <p id="anfrage-leistungen-hinweis" className="text-[13px] text-text2 mb-3">
            {t.servicesLegend}
          </p>
          {/* Zweispaltig, damit alle Leistungen und „Weiter" ohne Scrollen sichtbar sind (kontakt.md AK-6) */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 sm:grid sm:grid-cols-2">
            {[...services.map((s) => [s.slug, s[locale].title] as const), [OTHER_SERVICE, t.other] as const].map(
              ([value, title], i) => (
                <label key={value} className={choiceClass}>
                  <input
                    type="checkbox"
                    id={i === 0 ? id('leistungen') : undefined}
                    name="leistungen"
                    value={value}
                    defaultChecked={chosen('leistungen', value)}
                    className="w-4 h-4 accent-primary shrink-0"
                  />
                  {title}
                </label>
              ),
            )}
          </div>
          {fieldError('leistungen')}
        </>,
        'anfrage-leistungen-hinweis',
      )}

      {stepFieldset(
        1,
        <>
          <label htmlFor={id('beschreibung')} className={labelClass}>
            {label(t.description, true)}
          </label>
          <p id="anfrage-beschreibung-hinweis" className="text-[12px] text-text2 mb-2">
            {t.descriptionHint}
          </p>
          <textarea
            id={id('beschreibung')}
            name="beschreibung"
            rows={6}
            maxLength={3000}
            defaultValue={text('beschreibung')}
            onChange={(e) => setLength(e.currentTarget.value.length)}
            className={`${inputClass} resize-y min-h-[140px] ${errors.beschreibung ? 'border-error' : 'border-border'}`}
            {...describe('beschreibung', 'anfrage-beschreibung-hinweis')}
          />
          <p aria-live="polite" className="text-[12px] text-text2 mt-1.5 empty:hidden">
            {length >= 2500 ? t.counter(length) : ''}
          </p>
          {fieldError('beschreibung')}
          <label htmlFor={id('website')} className={`${labelClass} mt-5`}>
            {label(t.website, false)}
          </label>
          <p id="anfrage-website-hinweis" className="text-[12px] text-text2 mb-2">
            {t.websiteHint}
          </p>
          <input
            id={id('website')}
            name="website"
            type="url"
            inputMode="url"
            autoComplete="url"
            defaultValue={text('website')}
            className={`${inputClass} ${errors.website ? 'border-error' : 'border-border'}`}
            {...describe('website', 'anfrage-website-hinweis')}
          />
          {fieldError('website')}
        </>,
      )}

      {stepFieldset(
        2,
        <>
          {radios('zeitrahmen', t.timeframe, timeframes, t.timeframes)}
          {radios('budget', t.budget, budgets, t.budgets)}
        </>,
      )}

      {stepFieldset(
        3,
        <>
          {(
            [
              ['name', t.name, 'text', 'name', true],
              ['email', t.emailField, 'email', 'email', true],
              ['telefon', t.phone, 'tel', 'tel', false],
            ] as const
          ).map(([f, title, type, auto, required]) => (
            <div key={f} className="mb-4">
              <label htmlFor={id(f)} className={labelClass}>
                {label(title, required)}
              </label>
              <input
                id={id(f)}
                name={f}
                type={type}
                autoComplete={auto}
                defaultValue={text(f)}
                className={`${inputClass} ${errors[f] ? 'border-error' : 'border-border'}`}
                {...describe(f)}
              />
              {fieldError(f)}
            </div>
          ))}
          <div className="mt-5">
            <label className="flex items-start gap-3 text-[13px] text-text2 leading-relaxed cursor-pointer">
              <input
                type="checkbox"
                id={id('einwilligung')}
                name="einwilligung"
                value="ja"
                defaultChecked={chosen('einwilligung', 'ja')}
                className="w-4 h-4 mt-1 accent-primary shrink-0"
                {...describe('einwilligung', 'anfrage-einwilligung-hinweis')}
              />
              <span>
                {t.consent} <span className="text-foreground">{t.required}</span>
              </span>
            </label>
            <p id="anfrage-einwilligung-hinweis" className="text-[13px] text-text2 pl-7 mt-1">
              {t.consentMore}{' '}
              <Link
                href={localizedPath('/datenschutz', locale)}
                target="_blank"
                className="text-primary-text underline underline-offset-2"
              >
                {t.consentLink}
                <span className="sr-only"> {t.newTab}</span>
              </Link>
              .
            </p>
            {fieldError('einwilligung')}
          </div>
        </>,
      )}

      <div aria-hidden="true" className="absolute -left-[10000px] top-0 w-px h-px overflow-hidden">
        <label htmlFor="anfrage-fax">{t.honeypot}</label>
        <input id="anfrage-fax" name="fax" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Auf dem Handy bleiben die Schritt-Buttons unten im Bild (functions/seiten/kontakt.md AK-6) */}
      <div
        ref={actions}
        className="flex gap-2.5 max-sm:sticky max-sm:bottom-0 max-sm:z-10 max-sm:-mx-6 max-sm:px-6 max-sm:py-3 max-sm:bg-background/95 max-sm:backdrop-blur-md max-sm:border-t max-sm:border-border"
      >
        {step > 0 && (
          <button
            type="button"
            data-nur-js
            onClick={() => goTo(step - 1)}
            className={`${buttonClass} border border-border text-text2 hover:text-foreground`}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {t.back}
          </button>
        )}
        {step < LAST && (
          <button
            type="submit"
            data-nur-js
            className={`${buttonClass} bg-primary text-primary-foreground hover:bg-primary-hover`}
          >
            {t.next}
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        )}
        <button
          type="submit"
          data-schritt
          hidden={step !== LAST}
          aria-disabled={pending || undefined}
          className={`${buttonClass} aria-disabled:opacity-60 ${
            state.status === 'fallback'
              ? 'border border-border text-text2 hover:text-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary-hover'
          }`}
        >
          {pending ? t.sending : state.status === 'fallback' ? t.retry : t.submit}
        </button>
      </div>
    </form>
  );
}
