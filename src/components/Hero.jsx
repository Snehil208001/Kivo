import { Link } from 'react-router-dom';
import { ArrowRight, Star, BadgeIndianRupee, Truck, ShieldCheck } from 'lucide-react';

// Faux customer avatars for the social-proof stack (initials on brand tints).
const AVATARS = [
  { i: 'P', bg: '#00A86B' },
  { i: 'R', bg: '#FF5A2C' },
  { i: 'S', bg: '#05402F' },
  { i: 'A', bg: '#FFB020' },
];

export default function Hero({ featured }) {
  return (
    <section className="relative overflow-hidden bg-mint">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-pop/10 blur-3xl" />

      <div className="container-page relative grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        {/* Copy */}
        <div className="animate-fade-up text-center lg:text-left">
          <span className="eyebrow rounded-full bg-white px-3 py-1.5 text-primary-deep shadow-card">
            <span className="h-2 w-2 rounded-full bg-pop" /> New drop · Up to 50% off
          </span>

          <h1 className="mt-5 font-display text-[2rem] font-extrabold leading-[0.98] tracking-tightest text-accent xs:text-[2.4rem] sm:text-6xl sm:leading-[0.95] lg:text-[4.25rem]">
            A cleaner home,
            <br />
            <span className="text-primary">a calmer you.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-lg text-accent/70 lg:mx-0">
            Cleaning tools, personal care & eco essentials that actually work —
            delivered in 24 hours, with Cash on Delivery across India.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link to="/shop" className="btn-primary btn-lg">
              Shop Bestsellers
              <ArrowRight size={18} />
            </Link>
            <Link to="/collections/eco" className="btn-outline btn-lg">
              Explore Eco Range
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <div className="flex -space-x-2.5">
              {AVATARS.map((a) => (
                <span
                  key={a.i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-mint text-sm font-bold text-white"
                  style={{ backgroundColor: a.bg }}
                >
                  {a.i}
                </span>
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center justify-center gap-1 text-amber sm:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
                <span className="ml-1 font-bold text-accent">4.8</span>
              </div>
              <p className="text-accent/60">Loved by 50,000+ homes</p>
            </div>
          </div>
        </div>

        {/* Product showcase */}
        <div className="animate-fade-up [animation-delay:120ms]">
          <div className="relative mx-auto max-w-sm">
            {/* Rotating discount seal */}
            <div className="absolute -left-3 -top-3 z-20 sm:-left-5 sm:-top-5">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-pop text-white shadow-pop sm:h-24 sm:w-24">
                <div className="text-center leading-none">
                  <span className="block font-display text-2xl font-extrabold sm:text-3xl">
                    50%
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Off
                  </span>
                </div>
              </div>
            </div>

            {/* Card */}
            <div className="relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-lift">
              <div className="aspect-square overflow-hidden rounded-3xl bg-primary-light">
                {featured?.featuredImage ? (
                  <img
                    src={featured.featuredImage.url}
                    alt={featured.featuredImage.altText || featured.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-6xl font-extrabold text-primary">
                    KIVO
                  </div>
                )}
              </div>

              {featured && (
                <Link
                  to={`/products/${featured.handle}`}
                  className="flex items-center justify-between gap-3 px-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-accent">
                      {featured.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="font-display text-lg font-extrabold text-accent">
                        {featured.priceFormatted}
                      </span>
                      {featured.compareAtFormatted && (
                        <span className="text-sm text-accent/40 line-through">
                          {featured.compareAtFormatted}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="btn-pop shrink-0 px-4 py-2.5 text-sm">
                    Shop
                    <ArrowRight size={15} />
                  </span>
                </Link>
              )}
            </div>

            {/* Floating trust chips */}
            <div className="absolute -right-2 top-1/3 z-10 hidden animate-float rounded-2xl bg-white px-3 py-2 shadow-lift sm:flex sm:items-center sm:gap-2">
              <BadgeIndianRupee size={18} className="text-primary" />
              <span className="text-xs font-bold text-accent">COD Available</span>
            </div>
            <div className="absolute -left-4 bottom-28 z-10 hidden animate-float [animation-delay:1.2s] rounded-2xl bg-white px-3 py-2 shadow-lift sm:flex sm:items-center sm:gap-2">
              <Truck size={18} className="text-primary" />
              <span className="text-xs font-bold text-accent">Ships in 24h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
