'use client';

import { startTransition, useActionState, type FormEvent } from 'react';
import Button from '@/components/ui/Button';
import type { AdminState } from '@/lib/kundenbereich/admin/aktionen';
import { Meldung, type AdminAction } from './AdminForm';

// Einzelne Aktion als Button, z. B. „Entfernen“ oder „Anmeldelink schicken“ (functions/kundenbereich/admin.md)

export default function ActionButton({
  action,
  hidden,
  label,
  name,
  confirm,
  variant = 'secondary',
}: {
  action: AdminAction;
  hidden: Record<string, string>;
  /** Sichtbarer Text */
  label: string;
  /** Zugänglicher Name, nennt das Ziel, z. B. „Anna entfernen“; beginnt mit dem sichtbaren Text */
  name?: string;
  /** Rückfrage vor dem Ausführen */
  confirm?: string;
  variant?: 'primary' | 'secondary';
}) {
  const [state, dispatch, pending] = useActionState<AdminState, FormData>(action, { status: 'idle' });
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (confirm && !window.confirm(confirm)) return;
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
  return (
    <form onSubmit={submit} className="contents">
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <Button type="submit" variant={variant} aria-label={name} aria-disabled={pending || undefined}>
        {label}
      </Button>
      <div className="basis-full">
        <Meldung state={state} />
      </div>
    </form>
  );
}
