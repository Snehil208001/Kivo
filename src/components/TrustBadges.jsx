import {
  BadgeIndianRupee,
  RotateCcw,
  Truck,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { TRUST_POINTS } from '../lib/config';

const ICONS = {
  shipping: Package,
  secure: ShieldCheck,
  returns: RotateCcw,
  cod: BadgeIndianRupee,
  ships: Truck,
  support: ShieldCheck,
};

// Compact trust bar — used on landing pages and product pages.
export function TrustStrip({ className = '' }) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 ${className}`}
    >
      {TRUST_POINTS.map(({ key, label, sub }) => {
        const Icon = ICONS[key] || ShieldCheck;
        return (
          <div
            key={key}
            className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-card"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary-deep">
              <Icon size={19} />
            </span>
            <div className="leading-tight">
              <p className="text-[13px] font-bold text-accent">{label}</p>
              <p className="text-[11px] text-accent/60">{sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CodBadge({ className = '', label = 'COD Available' }) {
  return (
    <span className={`badge-cod ${className}`}>
      <BadgeIndianRupee size={13} />
      {label}
    </span>
  );
}

export default TrustStrip;
