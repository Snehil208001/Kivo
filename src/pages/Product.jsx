import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Flame,
  Minus,
  Plus,
  BadgeIndianRupee,
} from 'lucide-react';
import ImageGallery from '../components/ImageGallery';
import AddToCartButton from '../components/AddToCartButton';
import BuyNowButton from '../components/BuyNowButton';
import BundleOffer from '../components/BundleOffer';
import { TrustStrip } from '../components/TrustBadges';
import ProductGrid from '../components/ProductGrid';
import SectionHeader from '../components/SectionHeader';
import { useProduct, useProducts } from '../hooks/useCatalog';

function ProductSkeleton() {
  return (
    <div className="container-page grid gap-8 py-8 md:grid-cols-2">
      <div className="aspect-square animate-pulse rounded-2xl bg-accent/5" />
      <div className="space-y-4">
        <div className="h-8 w-3/4 animate-pulse rounded bg-accent/5" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-accent/5" />
        <div className="h-24 w-full animate-pulse rounded bg-accent/5" />
        <div className="h-14 w-full animate-pulse rounded-xl bg-accent/5" />
      </div>
    </div>
  );
}

// COD Available · Free Shipping · 7-Day Return
function ProductBadges() {
  const badges = [
    { icon: BadgeIndianRupee, label: 'COD Available' },
    { icon: Truck, label: 'Free Shipping' },
    { icon: RotateCcw, label: '7-Day Return' },
  ];
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {badges.map(({ icon: Icon, label }) => (
        <span key={label} className="badge bg-primary-light text-primary-deep">
          <Icon size={13} />
          {label}
        </span>
      ))}
    </div>
  );
}

export default function Product() {
  const { handle } = useParams();
  const { data: product, loading, error } = useProduct(handle);
  const { data: allProducts } = useProducts();
  const [qty, setQty] = useState(1);

  if (loading) return <ProductSkeleton />;

  if (error || !product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-accent">
          Product not found
        </h1>
        <p className="mt-2 text-accent/60">
          {error || "This product doesn't exist or is no longer available."}
        </p>
        <Link to="/shop" className="btn-primary btn-lg mt-6">
          Browse all products
        </Link>
      </div>
    );
  }

  // Out of stock => no buyable variant, so the buy buttons disable themselves.
  const buyable = product.availableForSale ? product.defaultVariantId : null;

  // Same-collection suggestions (fall back to any other products).
  const sameType = (allProducts || []).filter(
    (p) => p.id !== product.id && p.productType === product.productType
  );
  const others = (allProducts || []).filter((p) => p.id !== product.id);
  const pool = sameType.length >= 2 ? sameType : others;
  const bundleSuggestions = pool.filter((p) => p.availableForSale).slice(0, 2);
  const related = pool.slice(0, 4);

  return (
    <div className="pb-28 md:pb-8">
      {/* Breadcrumb */}
      <nav className="container-page flex items-center gap-1 py-4 text-xs text-accent/50">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={14} />
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight size={14} />
        <span className="truncate font-medium text-accent/70">{product.title}</span>
      </nav>

      <div className="container-page grid gap-8 md:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div className="md:sticky md:top-28 md:self-start">
          <ImageGallery images={product.images} title={product.title} />
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.isBestseller && (
              <span className="badge bg-accent text-white">
                <Flame size={12} className="text-pop" fill="currentColor" /> Bestseller
              </span>
            )}
            {product.sold != null && (
              <span className="badge bg-primary-light text-primary-deep">
                {product.sold.toLocaleString('en-IN')}+ sold
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-accent sm:text-4xl">
            {product.title}
          </h1>

          {/* Rating — only when real review data exists */}
          {product.rating && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex text-amber">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm font-semibold text-accent">{product.rating}</span>
              {product.reviews != null && (
                <span className="text-sm text-accent/50">
                  · {product.reviews.toLocaleString('en-IN')} reviews
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-extrabold text-accent">
              {product.priceFormatted}
            </span>
            {product.compareAtFormatted && (
              <>
                <span className="text-xl text-accent/40 line-through">
                  {product.compareAtFormatted}
                </span>
                <span className="sticker text-sm">Save {product.discountPercent}%</span>
              </>
            )}
          </div>
          <p className="mt-1 text-sm text-accent/50">
            Inclusive of all taxes · Free shipping over ₹499
          </p>

          {/* Low stock urgency */}
          {product.lowStock && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-pop-light px-3 py-2.5 text-sm font-semibold text-pop-dark">
              <Flame size={16} fill="currentColor" />
              Selling fast — only {product.lowStock} left in stock!
            </div>
          )}

          {/* Trust badges: COD · Free Shipping · 7-Day Return */}
          <ProductBadges />

          {/* Description */}
          {/* Description — rich HTML from Shopify when present, else plain text.
              Rendered once (previously both showed, duplicating the copy). */}
          {product.descriptionHtml ? (
            <div
              className="rte mt-5"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : product.description ? (
            <p className="mt-5 text-[15px] leading-relaxed text-accent/70">
              {product.description}
            </p>
          ) : null}

          {/* Features */}
          {product.features?.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-bold text-accent">
                Key features
              </h2>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-accent/80">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary-deep">
                      <Check size={12} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA: Quantity + Add to Cart + Buy Now */}
          <div className="mt-6 space-y-3">
            {buyable && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-accent">Quantity</span>
                <div className="flex items-center rounded-xl border border-accent/15">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2.5 text-accent/70 hover:text-primary"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="min-w-[36px] text-center text-sm font-bold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="px-3.5 py-2.5 text-accent/70 hover:text-primary"
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <AddToCartButton
                variantId={buyable}
                quantity={qty}
                className="btn-outline btn-lg btn-block"
                label="Add to Cart"
              />
              <BuyNowButton
                variantId={buyable}
                quantity={qty}
                className="btn-pop btn-lg btn-block"
                label="Buy Now"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium text-accent/60">
              <div className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 shadow-card">
                <Truck size={18} className="text-primary" />
                Ships in 24h
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 shadow-card">
                <RotateCcw size={18} className="text-primary" />
                7-Day Returns
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 shadow-card">
                <ShieldCheck size={18} className="text-primary" />
                Secure Pay
              </div>
            </div>
          </div>

          {/* Bundle: Buy 2, Get 10% Off */}
          {buyable && (
            <BundleOffer product={product} suggestions={bundleSuggestions} />
          )}
        </div>
      </div>

      {/* Trust strip */}
      <div className="container-page mt-14">
        <TrustStrip />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="container-page mt-16">
          <SectionHeader eyebrow="Pairs well with" title="You might also like" />
          <ProductGrid products={related} />
        </div>
      )}

      {/* Sticky mobile bar: Add to Cart + Buy Now → checkout */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-accent/10 bg-white/95 p-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <div className="shrink-0 leading-tight">
            <div className="font-display text-lg font-extrabold text-accent">
              {product.priceFormatted}
            </div>
            {product.compareAtFormatted && (
              <span className="text-[11px] text-accent/40 line-through">
                {product.compareAtFormatted}
              </span>
            )}
          </div>
          <AddToCartButton
            variantId={buyable}
            quantity={qty}
            className="btn-outline flex-1 py-3 text-sm"
            label="Add"
          />
          <BuyNowButton
            variantId={buyable}
            quantity={qty}
            className="btn-pop flex-1 py-3 text-sm"
            label="Buy Now"
          />
        </div>
      </div>
    </div>
  );
}
