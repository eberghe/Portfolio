import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';

// functions/infrastruktur/ui-bausteine.md

describe('TextField', () => {
  it('AK-1: Label ist mit der Eingabe verknüpft, Zusatz steht im Label', () => {
    render(<TextField id="feld-name" name="name" label="Name" marker="Pflichtfeld" />);
    const input = screen.getByLabelText(/Name\s+Pflichtfeld/);
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('name', 'name');
  });

  it('AK-2: Hinweis und Fehler hängen per aria-describedby an, Hinweis zuerst', () => {
    const { rerender } = render(
      <TextField id="feld-mail" name="email" label="E-Mail" hint="Für die Antwort" error="Bitte prüfen" />,
    );
    const input = screen.getByLabelText('E-Mail');
    expect(input).toHaveAttribute('aria-describedby', 'feld-mail-hinweis feld-mail-fehler');
    expect(screen.getByText('Für die Antwort')).toHaveAttribute('id', 'feld-mail-hinweis');
    expect(screen.getByText('Bitte prüfen')).toHaveAttribute('id', 'feld-mail-fehler');
    rerender(<TextField id="feld-mail" name="email" label="E-Mail" />);
    expect(screen.getByLabelText('E-Mail')).not.toHaveAttribute('aria-describedby');
  });

  it('AK-3: Fehler setzt aria-invalid und roten Rahmen', () => {
    const { rerender } = render(<TextField id="f" name="f" label="Feld" error="Falsch" />);
    expect(screen.getByLabelText('Feld')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Feld')).toHaveClass('border-error');
    rerender(<TextField id="f" name="f" label="Feld" />);
    expect(screen.getByLabelText('Feld')).not.toHaveAttribute('aria-invalid');
    expect(screen.getByLabelText('Feld')).toHaveClass('border-border');
  });

  it('AK-4: multiline rendert textarea, Attribute werden durchgereicht', () => {
    const { rerender } = render(<TextField id="t" name="t" label="Text" multiline rows={4} defaultValue="Hallo" />);
    expect(screen.getByLabelText('Text').tagName).toBe('TEXTAREA');
    expect(screen.getByLabelText('Text')).toHaveValue('Hallo');
    rerender(<TextField id="t" name="t" label="Text" type="email" autoComplete="email" />);
    expect(screen.getByLabelText('Text')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('Text')).toHaveAttribute('autocomplete', 'email');
  });
});

describe('Button', () => {
  it('AK-5: ohne href ein button (type=button, überschreibbar), mit href ein Link, beide min. 44 px', () => {
    render(
      <>
        <Button>Weiter</Button>
        <Button type="submit">Senden</Button>
        <Button href="/contact">Kontakt</Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Weiter' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: 'Senden' })).toHaveAttribute('type', 'submit');
    const link = screen.getByRole('link', { name: 'Kontakt' });
    expect(link).toHaveAttribute('href', '/contact');
    for (const el of [screen.getByRole('button', { name: 'Weiter' }), link]) expect(el).toHaveClass('min-h-11');
  });

  it('AK-6: Varianten und aria-disabled', () => {
    render(
      <>
        <Button>Primär</Button>
        <Button variant="secondary" className="max-sm:flex-1">
          Zurück
        </Button>
      </>,
    );
    const primary = screen.getByRole('button', { name: 'Primär' });
    expect(primary).toHaveClass(
      'bg-primary',
      'text-primary-foreground',
      'hover:bg-primary-hover',
      'aria-disabled:opacity-60',
    );
    const secondary = screen.getByRole('button', { name: 'Zurück' });
    expect(secondary).toHaveClass('border', 'border-border', 'max-sm:flex-1');
    expect(secondary).not.toHaveClass('bg-primary');
  });

  it('AK-7: Anfrage-Assistent nutzt die Bausteine statt eigener Klassen', () => {
    const src = readFileSync('components/contact/InquiryWizard.tsx', 'utf8');
    expect(src).toMatch(/from '@\/components\/ui\/Button'/);
    expect(src).toMatch(/from '@\/components\/ui\/TextField'/);
    expect(src).not.toMatch(/const (inputClass|buttonClass)\b/);
    expect(src).not.toMatch(/<(button|textarea)\b/);
  });
});

describe('SelectField', () => {
  it('AK-8: Label, Hinweis, Fehler und Optionen wie beim Textfeld', async () => {
    const { default: SelectField } = await import('@/components/ui/SelectField');
    const options = [
      { value: 'de', label: 'Deutsch' },
      { value: 'en', label: 'Englisch' },
    ];
    const { rerender } = render(
      <SelectField
        id="sprache"
        name="sprache"
        label="Sprache"
        hint="Für Mails"
        error="Bitte wählen"
        options={options}
        defaultValue="en"
      />,
    );
    const select = screen.getByLabelText('Sprache');
    expect(select.tagName).toBe('SELECT');
    expect(select).toHaveValue('en');
    expect(select).toHaveAttribute('aria-describedby', 'sprache-hinweis sprache-fehler');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select.className).toMatch(/min-h-11/);
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Deutsch', 'Englisch']);
    rerender(<SelectField id="sprache" name="sprache" label="Sprache" options={options} />);
    expect(screen.getByLabelText('Sprache')).not.toHaveAttribute('aria-describedby');
    expect(screen.getByLabelText('Sprache')).not.toHaveAttribute('aria-invalid');
  });
});
