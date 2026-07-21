import {
  Star,
  Truck,
  BadgeIndianRupee,
  RotateCcw,
  Sparkles,
  Leaf,
  ShieldCheck,
} from 'lucide-react';

// --- Stats band -----------------------------------------------------------
const STATS = [
  { value: 'COD', label: 'Pay on delivery' },
  { value: '24h', label: 'Fast dispatch' },
  { value: '7d', label: 'Easy returns' },
  { value: 'PAN', label: 'India shipping' },
];

export function StatsBand() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-accent/10 md:grid-cols-4">
      {STATS.map((s) => (
        <div key={s.label} className="bg-white px-3 py-5 text-center sm:px-4 sm:py-6">
          <p className="font-display text-2xl font-extrabold text-primary sm:text-4xl">
            {s.value}
          </p>
          <p className="mt-1 text-xs font-medium text-accent/60 sm:text-sm">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// --- Value props (dark band) ---------------------------------------------
const VALUES = [
  {
    icon: Sparkles,
    title: 'Always something new',
    copy: 'Trending drops across lifestyle, fashion, beauty, home and more.',
  },
  {
    icon: Truck,
    title: 'Fast & tracked',
    copy: 'Orders leave within 24 hours and reach most cities in 2–4 days.',
  },
  {
    icon: BadgeIndianRupee,
    title: 'Pay your way',
    copy: 'Cash on Delivery or online pay. You only pay when it arrives.',
  },
  {
    icon: Leaf,
    title: 'Shop every category',
    copy: 'One cart for makeup, fashion, lifestyle, eco and everyday essentials.',
  },
];

export function ValueProps() {
  return (
    <section className="bg-primary-deep py-16 text-white">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow text-primary-light">Why KIVO</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your next favourite find, in one place.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, copy }) => (
            <div key={title}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-primary-light ring-1 ring-white/10">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Reviews --------------------------------------------------------------
const REVIEWS = [
  {
    name: 'Priya S.',
    city: 'Mumbai',
    text: 'Ordered from two different categories in one go. Everything arrived together — COD was super convenient.',
    product: 'Mixed cart',
  },
  {
    name: 'Rahul M.',
    city: 'Bengaluru',
    text: 'Quality matched the photos. Delivery was quick and packing was neat.',
    product: 'Delivery',
  },
  {
    name: 'Sneha K.',
    city: 'Delhi',
    text: 'Love browsing trending and lifestyle picks here. Easy to find something new every week.',
    product: 'Trending',
  },
  {
    name: 'Aditya R.',
    city: 'Pune',
    text: 'WhatsApp support helped me pick the right size before I ordered. Smooth experience.',
    product: 'Support',
  },
];

export function Reviews() {
  return (
    <section className="container-page py-16">
      <div className="flex flex-col items-center text-center">
        <span className="eyebrow text-primary">From our customers</span>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
          Happy shoppers across India.
        </h2>
        <div className="mt-3 flex flex-col items-center gap-1.5 text-amber sm:flex-row sm:gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
          </div>
          <span className="text-center text-sm font-semibold text-accent">
            Real stories from people who shop with COD
          </span>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {REVIEWS.map((r) => (
          <figure
            key={r.name}
            className="flex flex-col rounded-2xl bg-white p-5 shadow-card"
          >
            <div className="flex text-amber">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-accent/80">
              "{r.text}"
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3 border-t border-accent/5 pt-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light font-bold text-primary-deep">
                {r.name[0]}
              </span>
              <div className="min-w-0 flex-1 text-sm leading-tight">
                <p className="font-semibold text-accent">{r.name}</p>
                <p className="text-accent/50">{r.city}</p>
              </div>
              <span className="badge shrink-0 bg-primary-light text-primary-deep">
                <ShieldCheck size={11} /> Verified
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
