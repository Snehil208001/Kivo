import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductGrid, { ProductGridSkeleton } from '../components/ProductGrid';
import { TrustStrip } from '../components/TrustBadges';
import { useCollection } from '../hooks/useCatalog';
import { collectionBlurb } from '../lib/config';

export default function CollectionPage() {
  const { handle } = useParams();
  const { data: collection, loading, error } = useCollection(handle);
  const blurb = collection ? collectionBlurb(collection) : '';

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-xs text-accent/50">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={14} />
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight size={14} />
        <span className="font-medium text-accent/70">
          {collection?.title || handle}
        </span>
      </nav>

      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
          {loading ? 'Loading…' : collection?.title || 'Collection'}
        </h1>
        {blurb && (
          <p className="mt-2 max-w-2xl text-accent/60">
            {blurb}
          </p>
        )}
      </div>

      <TrustStrip className="mb-6" />

      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          Couldn't load this collection: {error}
        </p>
      )}

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : !collection ? (
        <div className="py-16 text-center">
          <p className="text-accent/60">This collection couldn't be found.</p>
          <Link to="/shop" className="btn-primary btn-lg mt-4">
            Browse all products
          </Link>
        </div>
      ) : (
        <ProductGrid products={collection.products} />
      )}
    </div>
  );
}
