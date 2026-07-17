import { useMemo, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import ProductGrid, { ProductGridSkeleton } from '../components/ProductGrid';
import { TrustStrip } from '../components/TrustBadges';
import { useProducts } from '../hooks/useCatalog';

const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
];

export default function Shop() {
  const { data: products, loading, error } = useProducts();
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('featured');

  const types = useMemo(() => {
    const set = new Set((products || []).map((p) => p.productType).filter(Boolean));
    return ['all', ...set];
  }, [products]);

  const visible = useMemo(() => {
    let list = [...(products || [])];
    if (type !== 'all') list = list.filter((p) => p.productType === type);
    if (sort === 'price-asc')
      list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (sort === 'price-desc')
      list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    return list;
  }, [products, type, sort]);

  return (
    <div className="container-page py-8">
      <SectionHeader
        title="Shop All"
        subtitle="Every KIVO essential, in one place."
      />

      <TrustStrip className="mb-6" />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
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
          onChange={(e) => setSort(e.target.value)}
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
      ) : (
        <ProductGrid products={visible} />
      )}
    </div>
  );
}
