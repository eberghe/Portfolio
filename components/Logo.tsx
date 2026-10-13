import { LOGO_PFADE } from './logoPfade';

// Übernommen aus dem Lovable-Projekt. Dekorativ: der umgebende Link trägt den Namen.
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="205"
      height="16"
      viewBox="0 0 205 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {LOGO_PFADE.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}
