import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  to,
  linkLabel = 'View all',
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div className="min-w-0">
        {eyebrow && <span className="eyebrow text-primary">{eyebrow}</span>}
        <h2 className="mt-1.5 font-display text-[1.65rem] font-extrabold leading-tight tracking-tight text-accent sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-sm text-accent/60 sm:text-base">{subtitle}</p>
        )}
      </div>
      {to && (
        <Link
          to={to}
          className="group inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-card transition hover:shadow-lift"
        >
          {linkLabel}
          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
