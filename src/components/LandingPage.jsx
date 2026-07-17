import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Star,
  ShieldCheck,
  BadgeIndianRupee,
  Truck,
  RotateCcw,
  ChevronDown,
  Play,
} from 'lucide-react';
import Logo from './Logo';
import BuyNowButton from './BuyNowButton';
import { fetchProductByHandle } from '../lib/api';
import { whatsappLink } from '../lib/config';

/**
 * Single-product landing page template — no navbar, no footer, one goal: order.
 * Fetches its product by handle; price always comes from Shopify (never hardcoded).
 *
 * `content`: { handle, eyebrow, headline, sub, theme, video?, benefits[], features[], reviews[], faqs[] }
 */

// Hero video. Renders the real thing when `video` is a URL, otherwise a
// placeholder with a play affordance until the creative exists.
function HeroVideo({ video, poster, title }) {
  if (video) {
    return (
      <video
        className="aspect-video w-full rounded-2xl bg-accent object-cover shadow-lift"
        src={video}
        poster={poster}
        controls
        playsInline
      />
    );
  }
  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-primary-deep shadow-lift">
      {poster && (
        <img src={poster} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      )}
      <div className="relative flex flex-col items-center gap-3 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-primary shadow-lift">
          <Play size={32} fill="currentColor" className="ml-1" />
        </span>
        <p className="font-display text-lg font-bold text-white">{title}</p>
      </div>
      <span className="absolute bottom-3 left-3 badge bg-black/45 text-white backdrop-blur">
        Video coming soon
      </span>
    </div>
  );
}

export default function LandingPage({ content }) {
  const {
    handle,
    eyebrow,
    headline,
    sub,
    theme = 'primary',
    video,
    benefits = [],
    features = [],
    reviews = [],
    faqs = [],
  } = content;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchProductByHandle(handle)
      .then((p) => active && setProduct(p))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [handle]);

  // Out of stock => no buyable variant => the order button disables itself.
  const buyable = product?.availableForSale ? product.defaultVariantId : null;

  const accentBg =
    theme === 'pink' ? 'from-pink-100' : theme === 'lime' ? 'from-lime-100' : 'from-primary-light';

  return (
    <div className="min-h-screen bg-surface">
      {/* Logo only — no nav, nothing to click away to. */}
      <header className="border-b border-accent/5 bg-white">
        <div className="container-page flex h-14 items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-primary-deep">
            <BadgeIndianRupee size={15} /> Cash on Delivery
          </span>
        </div>
      </header>

      <div className="bg-accent py-2 text-center text-[13px] font-semibold text-white">
        🔥 Limited-time offer · Free shipping · Ships in 24h
      </div>

      {/* Hero */}
      <section className={`bg-gradient-to-b ${accentBg} to-surface`}>
        <div className="container-page grid gap-8 py-8 md:grid-cols-2 md:py-12">
          <div className="order-2 md:order-1">
            <span className="badge bg-white text-primary-deep shadow-card">{eyebrow}</span>
            <h1 className="mt-3 font-display text-[2rem] font-extrabold leading-[1.02] tracking-tightest text-accent xs:text-4xl md:text-5xl">
              {headline}
            </h1>
            <p className="mt-3 text-base text-accent/70 md:text-lg">{sub}</p>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex text-amber">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm font-medium text-accent/60">
                4.8/5 from 2,400+ happy customers
              </span>
            </div>

            {/* Price + order */}
            <div className="mt-6 rounded-2xl bg-white p-4 shadow-card">
              {loading ? (
                <div className="h-8 w-32 animate-pulse rounded bg-accent/5" />
              ) : product ? (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-3xl font-extrabold text-accent">
                      {product.priceFormatted}
                    </span>
                    {product.compareAtFormatted && (
                      <>
                        <span className="text-lg text-accent/40 line-through">
                          {product.compareAtFormatted}
                        </span>
                        <span className="sticker text-sm">Save {product.discountPercent}%</span>
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-accent/50">
                    Inclusive of all taxes · Pay cash when it arrives
                  </p>
                  <BuyNowButton
                    variantId={buyable}
                    className="btn-pop btn-lg btn-block mt-4"
                    label="Order on COD"
                  />
                </>
              ) : (
                <p className="text-accent/60">Product unavailable right now.</p>
              )}

              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-accent/60">
                <span className="flex items-center gap-1">
                  <Truck size={14} className="text-primary" /> Ships 24h
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw size={14} className="text-primary" /> 7-Day Returns
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-primary" /> Secure
                </span>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            {loading ? (
              <div className="aspect-video w-full animate-pulse rounded-2xl bg-accent/5" />
            ) : (
              <HeroVideo
                video={video}
                poster={product?.featuredImage?.url}
                title={product?.title || headline}
              />
            )}
          </div>
        </div>
      </section>

      {/* 3 benefits */}
      {benefits.length > 0 && (
        <section className="container-page py-12">
          <h2 className="text-center font-display text-2xl font-extrabold text-accent sm:text-3xl">
            Why you'll love it
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="card p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-2xl">
                  {b.emoji}
                </div>
                <h3 className="font-bold text-accent">{b.title}</h3>
                <p className="mt-1 text-sm text-accent/60">{b.copy}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* What you get */}
      {features.length > 0 && (
        <section className="bg-white py-12">
          <div className="container-page grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-accent sm:text-3xl">
                Everything you get
              </h2>
              <ul className="mt-5 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                      <Check size={14} />
                    </span>
                    <span className="text-[15px] text-accent/80">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-primary-light/50 p-8 text-center">
              <p className="font-display text-5xl font-extrabold text-primary">50k+</p>
              <p className="mt-1 font-semibold text-accent">Units sold</p>
              <p className="mt-4 text-sm text-accent/60">
                Join thousands of happy KIVO customers across India.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="container-page py-12">
          <h2 className="text-center font-display text-2xl font-extrabold text-accent sm:text-3xl">
            What customers say
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.name} className="card p-5">
                <div className="flex text-amber">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm text-accent/80">"{r.text}"</blockquote>
                <figcaption className="mt-3 flex items-center gap-2 text-sm font-semibold text-accent">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-primary-deep">
                    {r.name[0]}
                  </span>
                  {r.name}
                  <span className="badge bg-primary-light text-primary-deep">
                    <Check size={11} /> Verified
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-white py-12">
          <div className="container-page max-w-2xl">
            <h2 className="text-center font-display text-2xl font-extrabold text-accent sm:text-3xl">
              Questions? Answered.
            </h2>
            <div className="mt-6 divide-y divide-accent/10">
              {faqs.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-accent py-14 text-center text-white">
        <div className="container-page">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Ready to try it risk-free?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-white/70">
            Cash on Delivery, 7-day returns, and WhatsApp support if you need us.
          </p>
          {product && (
            <BuyNowButton
              variantId={buyable}
              className="btn-pop btn-lg mx-auto mt-6"
              label={`Order on COD — ${product.priceFormatted}`}
            />
          )}
          <div className="mt-4">
            <a
              href={whatsappLink(`Hi KIVO! I have a question about the ${headline}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white/80 underline hover:text-white"
            >
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Sticky order bar */}
      {product && (
        <div className="sticky bottom-0 z-20 border-t border-accent/10 bg-white/95 p-3 backdrop-blur">
          <div className="container-page flex items-center gap-3">
            <div className="leading-tight">
              <p className="font-display text-lg font-extrabold text-accent">
                {product.priceFormatted}
              </p>
              {product.compareAtFormatted && (
                <p className="text-xs text-accent/40 line-through">
                  {product.compareAtFormatted}
                </p>
              )}
            </div>
            <BuyNowButton
              variantId={buyable}
              className="btn-pop flex-1 py-3.5 text-sm sm:max-w-xs sm:flex-none sm:ml-auto sm:px-8"
              label="Order on COD"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="font-semibold text-accent">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-accent/50 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <p className="mt-2 text-sm text-accent/60">{a}</p>}
    </div>
  );
}
