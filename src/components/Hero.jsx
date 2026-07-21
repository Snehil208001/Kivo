import { Link } from 'react-router-dom';
import { ArrowRight, Star, BadgeIndianRupee, Truck } from 'lucide-react';

// Faux customer avatars for the social-proof stack (initials on brand tints).
const AVATARS = [
  { i: 'P', bg: '#00A86B' },
  { i: 'R', bg: '#FF5A2C' },
  { i: 'S', bg: '#05402F' },
  { i: 'A', bg: '#FFB020' },
];

export default function Hero({ featured, collection }) {
  const discount = featured?.discountPercent || 0;

  return (
    <section className="relative overflow-hidden bg-mint">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-pop/10 blur-3xl" />

      <div className="container-page relative grid items-center gap-8 py-8 md:gap-10 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        {/* Copy */}
        <div className="animate-fade-up min-w-0 text-center lg:text-left">
          <span className="eyebrow rounded-full bg-white px-3 py-1.5 text-primary-deep shadow-card">
            <span className="h-2 w-2 shrink-0 rounded-full bg-pop" />
            <span className="sm:hidden">Trending · COD</span>
            <span className="hidden sm:inline">Trending finds · Cash on Delivery</span>
          </span>

          <h1 className="mt-4 font-display text-[1.85rem] font-extrabold leading-[1.05] tracking-tightest text-accent xs:text-[2.15rem] sm:mt-5 sm:text-6xl sm:leading-[0.95] lg:text-[4.25rem]">
            Discover what&apos;s
            <br />
            <span className="text-primary">trending now.</span>
          </h1>

          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-accent/70 sm:mt-5 sm:text-lg lg:mx-0">
            Lifestyle, fashion, makeup, home and more — delivered fast with COD
            across India.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:justify-center sm:gap-3 lg:justify-start">
            <Link to="/shop" className="btn-primary btn-lg w-full sm:w-auto">
              Shop Now
              <ArrowRight size={18} />
            </Link>
            <Link to="/shop" className="btn-outline btn-lg w-full sm:w-auto">
              Browse categories
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-6 flex flex-col items-center gap-2.5 sm:mt-8 sm:flex-row sm:justify-center sm:gap-3 lg:justify-start">
            <div className="flex -space-x-2.5">
              {AVATARS.map((a) => (
                <span
                  key={a.i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-mint text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm"
                  style={{ backgroundColor: a.bg }}
                >
                  {a.i}
                </span>
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center justify-center gap-1 text-amber sm:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
                <span className="ml-1 font-bold text-accent">4.8</span>
              </div>
              <p className="text-xs text-accent/60 sm:text-sm">
                Loved by shoppers across India
              </p>
            </div>
          </div>
        </div>

        {/* Product showcase */}
        <div className="animate-fade-up min-w-0 [animation-delay:120ms]">
          <div className="relative mx-auto w-full max-w-[280px] sm:max-w-sm">
            {/* Discount seal — only when product actually has a compare-at deal */}
            {discount > 0 && (
              <div className="absolute left-2 top-2 z-20 sm:-left-5 sm:-top-5">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-pop text-white shadow-pop sm:h-24 sm:w-24">
                  <div className="text-center leading-none">
                    <span className="block font-display text-xl font-extrabold sm:text-3xl">
                      {discount}%
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest sm:text-[10px]">
                      Off
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Card */}
            <div className="relative overflow-hidden rounded-[1.5rem] bg-white p-2.5 shadow-lift sm:rounded-[2rem] sm:p-3">
              <div className="aspect-square overflow-hidden rounded-2xl bg-primary-light sm:rounded-3xl">
                {featured?.featuredImage ? (
                  <img
                    src={featured.featuredImage.url}
                    alt={featured.featuredImage.altText || featured.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-5xl font-extrabold text-primary sm:text-6xl">
                    KIVO
                  </div>
                )}
              </div>

              {featured && (
                <Link
                  to={`/products/${featured.handle}`}
                  className="flex items-center justify-between gap-2 px-2 py-2.5 sm:gap-3 sm:px-3 sm:py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-accent sm:line-clamp-1 sm:truncate">
                      {featured.title}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="font-display text-base font-extrabold text-accent sm:text-lg">
                        {featured.priceFormatted}
                      </span>
                      {featured.compareAtFormatted && (
                        <span className="text-sm text-accent/40 line-through">
                          {featured.compareAtFormatted}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="btn-pop shrink-0 px-3.5 py-2 text-sm sm:px-4 sm:py-2.5">
                    Shop
                    <ArrowRight size={15} />
                  </span>
                </Link>
              )}
            </div>

            {/* Floating trust chips — desktop only */}
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
