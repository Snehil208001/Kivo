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
  { value: '50k+', label: 'Happy homes' },
  { value: '4.8★', label: 'Avg. rating' },
  { value: '24h', label: 'Dispatch time' },
  { value: '100%', label: 'COD available' },
];

export function StatsBand() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-accent/10 md:grid-cols-4">
      {STATS.map((s) => (
        <div key={s.label} className="bg-white px-4 py-6 text-center">
          <p className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
            {s.value}
          </p>
          <p className="mt-1 text-sm font-medium text-accent/60">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// --- Value props (dark band) ---------------------------------------------
const VALUES = [
  {
    icon: Sparkles,
    title: 'Actually works',
    copy: 'Tools we use ourselves. If it doesn\'t earn its place, we don\'t sell it.',
  },
  {
    icon: Truck,
    title: 'Fast & tracked',
    copy: 'Dispatched within 24 hours, delivered in 2–4 days, tracked all the way.',
  },
  {
    icon: BadgeIndianRupee,
    title: 'Pay your way',
    copy: 'Cash on Delivery or Razorpay. Zero risk — pay when it arrives.',
  },
  {
    icon: Leaf,
    title: 'Kinder choices',
    copy: 'A growing eco range and plastic-free packaging wherever we can.',
  },
];

export function ValueProps() {
  return (
    <section className="bg-primary-deep py-16 text-white">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow text-primary-light">Why KIVO</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Built to be the easiest yes in your cart.
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
    text: 'The spin mop changed my Sunday routine. Floors done in 10 minutes, no backache. COD made it a no-brainer.',
    product: 'Spin Mop',
  },
  {
    name: 'Rahul M.',
    city: 'Bengaluru',
    text: 'Ordered at night, arrived in two days, tracked the whole way. Quality is well above the price.',
    product: 'Spin Scrubber',
  },
  {
    name: 'Sneha K.',
    city: 'Delhi',
    text: 'The ice roller is my new morning ritual. Depuffs instantly — genuinely wish I\'d bought it sooner.',
    product: 'Face Roller',
  },
  {
    name: 'Aditya R.',
    city: 'Pune',
    text: 'Replaced almost all our kitchen plastic with the eco bundle. Beautiful, and the packaging really is plastic-free.',
    product: 'Eco Bundle',
  },
];

export function Reviews() {
  return (
    <section className="container-page py-16">
      <div className="flex flex-col items-center text-center">
        <span className="eyebrow text-primary">Real reviews</span>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
          50,000 homes can't be wrong.
        </h2>
        <div className="mt-3 flex items-center gap-2 text-amber">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={18} fill="currentColor" />
          ))}
          <span className="ml-1 text-sm font-semibold text-accent">
            4.8 average from 12,000+ verified reviews
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
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light font-bold text-primary-deep">
                {r.name[0]}
              </span>
              <div className="text-sm leading-tight">
                <p className="font-semibold text-accent">{r.name}</p>
                <p className="text-accent/50">{r.city}</p>
              </div>
              <span className="badge ml-auto bg-primary-light text-primary-deep">
                <ShieldCheck size={11} /> Verified
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
