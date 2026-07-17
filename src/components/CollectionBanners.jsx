import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

// Tiles are built from whatever collections exist in Shopify. A collection's
// own image is used when set; otherwise it falls back to a brand gradient
// cycled by position, so any new category looks intentional with no code change.
const PALETTES = [
  { grad: 'from-primary/90 to-primary-deep', text: 'text-white', sub: 'text-white/75', chip: 'bg-white/25' },
  { grad: 'from-pink-100 to-pink-50', text: 'text-accent', sub: 'text-accent/60', chip: 'bg-white/70' },
  { grad: 'from-lime-100 to-lime-50', text: 'text-accent', sub: 'text-accent/60', chip: 'bg-white/70' },
  { grad: 'from-amber-100 to-amber-50', text: 'text-accent', sub: 'text-accent/60', chip: 'bg-white/70' },
  { grad: 'from-sky-100 to-sky-50', text: 'text-accent', sub: 'text-accent/60', chip: 'bg-white/70' },
  { grad: 'from-violet-100 to-violet-50', text: 'text-accent', sub: 'text-accent/60', chip: 'bg-white/70' },
];

function Tile({ collection, palette, big = false, className = '' }) {
  const { handle, title, description, image, products = [] } = collection;
  const count = products.length;

  return (
    <Link
      to={`/collections/${handle}`}
      className={`group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${palette.grad} p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${className}`}
    >
      {image && (
        <img
          src={image.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-500 group-hover:scale-105"
        />
      )}

      <div className="relative flex items-start justify-end">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-accent transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
          <ArrowUpRight size={20} />
        </span>
      </div>

      <div className="relative mt-8">
        {count > 0 && (
          <span className={`badge mb-2 ${palette.chip} ${palette.text} backdrop-blur`}>
            {count} {count === 1 ? 'product' : 'products'}
          </span>
        )}
        <h3
          className={`font-display font-extrabold tracking-tight ${palette.text} ${
            big ? 'text-3xl sm:text-4xl' : 'text-2xl'
          }`}
        >
          {title}
        </h3>
        {description && (
          <p className={`mt-1 line-clamp-2 max-w-xs text-sm ${palette.sub}`}>
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function CollectionBanners({ collections = [] }) {
  const tiles = collections;
  if (!tiles.length) return null;

  // Every category is shown. The asymmetric bento only fits exactly 3 tiles;
  // any other count falls back to an even grid so nothing gets hidden.
  const bento = tiles.length === 3;

  return (
    <div
      className={
        bento
          ? 'grid gap-4 md:grid-cols-2 md:grid-rows-2'
          : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
      }
    >
      {tiles.map((c, i) => (
        <Tile
          key={c.id}
          collection={c}
          palette={PALETTES[i % PALETTES.length]}
          big={bento && i === 0}
          className={bento && i === 0 ? 'md:row-span-2 md:min-h-[360px]' : ''}
        />
      ))}
    </div>
  );
}
