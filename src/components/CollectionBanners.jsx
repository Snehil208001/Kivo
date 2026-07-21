import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { collectionBlurb } from '../lib/config';

// Local lifestyle photos (public/categories). Prefer Shopify collection /
// product images when present so tiles stay in sync with the catalog.
const FALLBACK_PHOTOS = {
  cleaning: '/categories/cleaning.jpg',
  'personal-care': '/categories/personal-care.jpg',
  eco: '/categories/eco.jpg',
  'scented-candles': '/categories/scented-candles.jpg',
  makeup: '/categories/personal-care.jpg',
  fashion: '/categories/cleaning.jpg',
  trending: '/categories/cleaning.jpg',
  lifestyle: '/categories/eco.jpg',
  kitchen: '/categories/cleaning.jpg',
  gadgets: '/categories/cleaning.jpg',
  jewelry: '/categories/scented-candles.jpg',
  fitness: '/categories/eco.jpg',
};

const BY_HANDLE = {
  cleaning: { tint: 'bg-primary-deep', accent: 'bg-primary' },
  eco: { tint: 'bg-emerald-800', accent: 'bg-lime-400' },
  'personal-care': { tint: 'bg-rose-900', accent: 'bg-rose-300' },
  'scented-candles': { tint: 'bg-amber-900', accent: 'bg-amber-300' },
  makeup: { tint: 'bg-fuchsia-950', accent: 'bg-fuchsia-300' },
  fashion: { tint: 'bg-slate-800', accent: 'bg-slate-200' },
  trending: { tint: 'bg-orange-900', accent: 'bg-pop' },
  lifestyle: { tint: 'bg-sky-900', accent: 'bg-sky-300' },
  kitchen: { tint: 'bg-stone-800', accent: 'bg-orange-200' },
  gadgets: { tint: 'bg-indigo-950', accent: 'bg-indigo-300' },
  jewelry: { tint: 'bg-yellow-950', accent: 'bg-amber-200' },
  fitness: { tint: 'bg-teal-950', accent: 'bg-teal-300' },
};

const FALLBACK_TINT = { tint: 'bg-accent', accent: 'bg-primary' };

function resolveImage(collection) {
  if (collection.image?.url) {
    return { url: collection.image.url, alt: collection.image.altText || collection.title };
  }
  const fromProduct = (collection.products || []).find((p) => p.featuredImage?.url);
  if (fromProduct?.featuredImage) {
    return {
      url: fromProduct.featuredImage.url,
      alt: fromProduct.featuredImage.altText || collection.title,
    };
  }
  return {
    url: FALLBACK_PHOTOS[collection.handle] || '/categories/cleaning.jpg',
    alt: collection.title,
  };
}

function Tile({ collection, theme, big = false, className = '' }) {
  const { handle, title, products = [] } = collection;
  const count = products.length;
  const blurb = collectionBlurb(collection);
  const photo = resolveImage(collection);

  return (
    <Link
      to={`/collections/${handle}`}
      className={`group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-3xl ${theme.tint} p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:min-h-[220px] sm:p-6 ${className}`}
    >
      <img
        src={photo.url}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
      <div className={`absolute inset-x-0 top-0 h-1.5 ${theme.accent} opacity-90`} />

      <div className="relative flex items-start justify-between gap-2">
        {handle === 'cleaning' && (
          <span className="badge bg-white/20 text-white backdrop-blur">Start here</span>
        )}
        <span className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-accent shadow-card transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
          <ArrowUpRight size={20} />
        </span>
      </div>

      <div className="relative mt-10">
        {count > 0 && (
          <span className="badge mb-2 bg-white/20 text-white backdrop-blur">
            {count} {count === 1 ? 'product' : 'products'}
          </span>
        )}
        <h3
          className={`font-display font-extrabold tracking-tight text-white drop-shadow-sm ${
            big ? 'text-3xl sm:text-4xl' : 'text-2xl'
          }`}
        >
          {title}
        </h3>
        {blurb && (
          <p className="mt-1.5 line-clamp-2 max-w-sm text-sm leading-relaxed text-white/85">
            {blurb}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function CollectionBanners({ collections = [] }) {
  if (!collections.length) return null;

  const cleaningIdx = collections.findIndex((c) => c.handle === 'cleaning');
  const featured = cleaningIdx >= 0 || collections.length === 3;

  return (
    <div
      className={
        featured && collections.length >= 2
          ? 'grid gap-4 md:grid-cols-2 md:grid-rows-2'
          : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
      }
    >
      {collections.map((c, i) => {
        const isCleaning = c.handle === 'cleaning';
        const big =
          featured &&
          (isCleaning || (cleaningIdx < 0 && i === 0 && collections.length === 3));

        return (
          <Tile
            key={c.id}
            collection={c}
            theme={BY_HANDLE[c.handle] || FALLBACK_TINT}
            big={big}
            className={
              big && featured && collections.length >= 2
                ? 'md:row-span-2 md:min-h-[420px]'
                : ''
            }
          />
        );
      })}
    </div>
  );
}
