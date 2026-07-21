import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ProductGrid, { ProductGridSkeleton } from '../components/ProductGrid';
import { TrustStrip } from '../components/TrustBadges';
import { useProducts } from '../hooks/useCatalog';

const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
];

// ponytail: search filters the loaded catalog in the browser (instant, no extra
// request). Ceiling: fetchAllProducts pulls the first 50 products — past that,
// move to the Storefront `products(query:)` filter.
function matches(product, q) {
  if (!q) return true;
  const hay = [
    product.title,
    product.productType,
    product.description,
    ...(product.tags || []),
  ]
    .join(' ')
    .toLowerCase();
  // every word must appear somewhere, so "soy candle" still finds it
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
}

export default function Shop() {
  const { data: products, loading, error } = useProducts();

  // URL is the source of truth so /shop?q=candle is linkable and shareable.
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const type = params.get('type') || 'all';
  const sort = params.get('sort') || 'featured';

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all' || value === 'featured') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const types = useMemo(() => {
    const set = new Set((products || []).map((p) => p.productType).filter(Boolean));
    return ['all', ...set];
  }, [products]);

  const visible = useMemo(() => {
    let list = (products || []).filter((p) => matches(p, q));
    if (type !== 'all') list = list.filter((p) => p.productType === type);
    if (sort === 'price-asc')
      list = [...list].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (sort === 'price-desc')
      list = [...list].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    return list;
  }, [products, q, type, sort]);

  return (
    <div className="container-page py-8">
      <SectionHeader
        title={q ? `Results for "${q}"` : 'Shop All'}
        subtitle={
          q
            ? `${visible.length} ${visible.length === 1 ? 'product' : 'products'} found`
            : 'Trending, lifestyle, fashion, beauty & more — all in one place.'
        }
      />

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-accent/40"
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setParam('q', e.target.value)}
          placeholder="Search products, e.g. candle"
          aria-label="Search products"
          className="w-full rounded-full border border-accent/10 bg-white py-3.5 pl-11 pr-11 text-[15px] outline-none transition focus:border-primary"
        />
        {q && (
          <button
            onClick={() => setParam('q', '')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-accent/40 hover:bg-accent/5 hover:text-accent"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <TrustStrip className="mb-6" />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setParam('type', t)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                type === t
                  ? 'bg-primary text-white'
                  : 'bg-white text-accent/70 shadow-card hover:text-primary'
              }`}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setParam('sort', e.target.value)}
          aria-label="Sort products"
          className="rounded-lg border border-accent/10 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-primary"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          Couldn't load products: {error}
        </p>
      )}

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : visible.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-xl font-bold text-accent">
            No products match {q ? `"${q}"` : 'that filter'}
          </p>
          <p className="mt-1 text-accent/60">Try a different word, or browse everything.</p>
          <button
            onClick={() => setParams(new URLSearchParams(), { replace: true })}
            className="btn-primary btn-lg mt-5"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ProductGrid products={visible} />
      )}
    </div>
  );
}
