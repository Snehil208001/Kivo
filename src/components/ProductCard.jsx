import { Link } from 'react-router-dom';
import { Star, Flame, Heart } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import { useWishlistStore } from '../store/wishlistStore';

export default function ProductCard({ product }) {
  if (!product) return null;
  const {
    handle,
    title,
    priceFormatted,
    compareAtFormatted,
    discountPercent,
    featuredImage,
    isBestseller,
    defaultVariantId,
    availableForSale,
    rating,
    reviews,
    sold,
    lowStock,
  } = product;

  const buyable = availableForSale ? defaultVariantId : null;
  const wished = useWishlistStore((s) => s.handles.includes(handle));
  const toggleWish = useWishlistStore((s) => s.toggle);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link
        to={`/products/${handle}`}
        className="relative block aspect-square overflow-hidden bg-primary-light"
      >
        {featuredImage ? (
          <img
            src={featuredImage.url}
            alt={featuredImage.altText || title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-accent/30">
            No image
          </div>
        )}

        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {discountPercent > 0 && (
            <span className="sticker">-{discountPercent}%</span>
          )}
          {isBestseller && (
            <span className="badge bg-accent/90 text-white backdrop-blur">
              <Flame size={11} className="text-pop" fill="currentColor" /> Bestseller
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWish(handle);
          }}
          className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-accent shadow-card backdrop-blur transition hover:text-pop"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
        >
          <Heart
            size={16}
            className={wished ? 'text-pop' : ''}
            fill={wished ? 'currentColor' : 'none'}
          />
        </button>

        {lowStock && (
          <span className="absolute bottom-2.5 left-2.5 badge bg-white/95 text-pop-dark shadow-card backdrop-blur">
            Only {lowStock} left
          </span>
        )}

        <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 hidden translate-y-3 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 md:block">
          <AddToCartButton
            variantId={buyable}
            className="btn-primary btn-block py-2.5 text-sm"
            label="Quick Add"
            openCartOnAdd
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        {rating && (
          <div className="flex items-center gap-1 text-xs">
            <Star size={13} className="text-amber" fill="currentColor" />
            <span className="font-bold text-accent">{rating}</span>
            {reviews != null && (
              <span className="text-accent/40">({reviews.toLocaleString('en-IN')})</span>
            )}
            {sold != null && (
              <span className="ml-auto text-accent/40">{sold.toLocaleString('en-IN')}+ sold</span>
            )}
          </div>
        )}

        <Link to={`/products/${handle}`} className="mt-1.5 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-accent">
            {title}
          </h3>
        </Link>

        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg font-extrabold text-accent">
              {priceFormatted}
            </span>
            {compareAtFormatted && (
              <span className="text-xs text-accent/40 line-through">
                {compareAtFormatted}
              </span>
            )}
          </div>
          <span className="badge-cod hidden sm:inline-flex">COD</span>
        </div>

        <AddToCartButton
          variantId={buyable}
          className="btn-primary btn-block mt-3 py-2.5 text-sm md:hidden"
          label="Add"
        />
      </div>
    </div>
  );
}
