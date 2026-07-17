import { BadgeIndianRupee, RotateCcw, Truck, MessageCircle } from 'lucide-react';

const ICONS = {
  cod: BadgeIndianRupee,
  returns: RotateCcw,
  ships: Truck,
  support: MessageCircle,
};

const POINTS = [
  { key: 'cod', label: 'Cash on Delivery', sub: 'Pay when it arrives' },
  { key: 'returns', label: '7-Day Returns', sub: 'No questions asked' },
  { key: 'ships', label: 'Ships in 24h', sub: 'Fast dispatch' },
  { key: 'support', label: 'WhatsApp Support', sub: 'Real humans, fast' },
];

// Compact trust bar — used on landing pages and product pages.
export function TrustStrip({ className = '' }) {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${className}`}>
      {POINTS.map(({ key, label, sub }) => {
        const Icon = ICONS[key];
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

// Single inline chip, e.g. "COD Available".
export function CodBadge({ className = '', label = 'COD Available' }) {
  return (
    <span className={`badge-cod ${className}`}>
      <BadgeIndianRupee size={13} />
      {label}
    </span>
  );
}

export default TrustStrip;
