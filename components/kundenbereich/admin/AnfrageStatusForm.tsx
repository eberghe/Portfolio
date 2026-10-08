'use client';

import { startTransition, useActionState, type FormEvent } from 'react';
import { anfrageStatus } from '@/app/actions/kundenbereich-admin';
import Button from '@/components/ui/Button';
import SelectField from '@/components/ui/SelectField';
import type { AdminState } from '@/lib/kundenbereich/admin/aktionen';
import type { AnfrageStatus } from '@/lib/kundenbereich/admin/dashboard';

// Status einer Anfrage ändern (functions/kundenbereich/admin-dashboard.md Verhalten 7)

export const ANFRAGE_STATUS_OPTIONEN = [
  { value: 'neu', label: 'Neu' },
  { value: 'beantwortet', label: 'Beantwortet' },
  { value: 'erledigt', label: 'Erledigt' },
];

export default function AnfrageStatusForm({ id, name, status }: { id: string; name: string; status: AnfrageStatus }) {
  const [state, dispatch, pending] = useActionState<AdminState, FormData>(anfrageStatus, { status: 'idle' });
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
  return (
    <form onSubmit={submit} noValidate className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="id" value={id} />
      <SelectField
        id={`anfrage-${id}-status`}
        name="status"
        label="Status"
        options={ANFRAGE_STATUS_OPTIONEN}
        defaultValue={status}
        className="w-40"
      />
      <Button
        type="submit"
        variant="secondary"
        aria-label={`Status speichern: ${name}`}
        aria-disabled={pending || undefined}
      >
        Status speichern
      </Button>
      <p aria-live="polite" className="basis-full text-[13px] text-text2 empty:hidden">
        {state.status !== 'idle' ? state.message : ''}
      </p>
    </form>
  );
}
