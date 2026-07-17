import ProductCard from './ProductCard';

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-square animate-pulse bg-accent/5" />
          <div className="space-y-2 p-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-accent/5" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-accent/5" />
            <div className="h-9 w-full animate-pulse rounded-xl bg-accent/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductGrid({ products = [] }) {
  if (!products.length) {
    return (
      <p className="py-16 text-center text-accent/50">No products found.</p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
