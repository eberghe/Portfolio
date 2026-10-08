import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

// Gemeinsames Textfeld mit Label, Hinweis und Fehler, siehe functions/infrastruktur/ui-bausteine.md

export const labelClass = 'text-[11px] font-medium tracking-wide uppercase text-text3 mb-1.5 block';
const controlClass =
  'w-full bg-bg2 border rounded-lg px-3 py-2.5 text-[13px] text-foreground placeholder:text-text2 focus:border-primary transition-colors font-sans';

type Own = {
  id: string;
  label: ReactNode;
  /** Zusatz im Label, z. B. „Pflichtfeld“ oder „optional“ */
  marker?: string;
  hint?: ReactNode;
  error?: ReactNode;
  /** Zwischen Eingabe und Fehler, z. B. ein Zeichenzähler */
  after?: ReactNode;
  className?: string;
  inputClassName?: string;
};
type InputProps = Own & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'> & { multiline?: false };
type AreaProps = Own & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className'> & { multiline: true };

export default function TextField(props: InputProps | AreaProps) {
  const { id, label, marker, hint, error, after, className, inputClassName, multiline, ...rest } = props;
  const hintId = `${id}-hinweis`;
  const errorId = `${id}-fehler`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
  const control = {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    className: [controlClass, inputClassName, error ? 'border-error' : 'border-border'].filter(Boolean).join(' '),
  };

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {marker && (
          <>
            {' '}
            <span className="normal-case tracking-normal font-normal">{marker}</span>
          </>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-[12px] text-text2 mb-2">
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} {...control} />
      ) : (
        <input {...(rest as InputHTMLAttributes<HTMLInputElement>)} {...control} />
      )}
      {after}
      {error && (
        <p id={errorId} className="text-[12px] text-error mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}
