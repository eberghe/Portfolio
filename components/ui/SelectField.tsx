import type { ReactNode, Ref, SelectHTMLAttributes } from 'react';
import { labelClass } from './TextField';

// Auswahlfeld mit Label, Hinweis und Fehler wie TextField, siehe functions/infrastruktur/ui-bausteine.md AK-8

const controlClass =
  'w-full bg-bg2 border rounded-lg px-3 py-2.5 min-h-11 text-[13px] text-foreground focus:border-primary transition-colors font-sans';

type Props = {
  id: string;
  label: ReactNode;
  marker?: string;
  hint?: ReactNode;
  error?: ReactNode;
  options: { value: string; label: string }[];
  className?: string;
  ref?: Ref<HTMLSelectElement>;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'className' | 'children'>;

export default function SelectField({ id, label, marker, hint, error, options, className, ...rest }: Props) {
  const hintId = `${id}-hinweis`;
  const errorId = `${id}-fehler`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
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
      <select
        {...rest}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={[controlClass, error ? 'border-error' : 'border-border'].join(' ')}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="text-[12px] text-error mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}
