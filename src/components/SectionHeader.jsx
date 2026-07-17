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
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <span className="eyebrow text-primary">{eyebrow}</span>}
        <h2 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1.5 text-accent/60">{subtitle}</p>}
      </div>
      {to && (
        <Link
          to={to}
          className="group flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-card transition hover:shadow-lift"
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
