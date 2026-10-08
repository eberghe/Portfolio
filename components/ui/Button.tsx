import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';

// Gemeinsamer Button, siehe functions/infrastruktur/ui-bausteine.md

export type ButtonVariant = 'primary' | 'secondary';

const base =
  'inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-lg text-[13px] font-medium transition-opacity aria-disabled:opacity-60';
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary: 'border border-border text-text2 hover:text-foreground',
};

export function buttonClass(variant: ButtonVariant = 'primary', className?: string) {
  return [base, variants[variant], className].filter(Boolean).join(' ');
}

type Common = { variant?: ButtonVariant; className?: string };
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common & Omit<ComponentProps<typeof Link>, 'className'> & { href: ComponentProps<typeof Link>['href'] };

export default function Button(props: AsButton | AsLink) {
  if (props.href !== undefined) {
    const { variant, className, ...rest } = props as AsLink;
    return <Link {...rest} className={buttonClass(variant, className)} />;
  }
  const { variant, className, type = 'button', ...rest } = props as AsButton;
  return <button {...rest} type={type} className={buttonClass(variant, className)} />;
}
