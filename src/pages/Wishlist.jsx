import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductGrid, { ProductGridSkeleton } from '../components/ProductGrid';
import SectionHeader from '../components/SectionHeader';
import { useProducts } from '../hooks/useCatalog';
import { useWishlistStore } from '../store/wishlistStore';

export default function Wishlist() {
  const handles = useWishlistStore((s) => s.handles);
  const { data: products, loading } = useProducts();

  const saved = (products || []).filter((p) => handles.includes(p.handle));
  // Preserve wishlist order (most recently added last in store → show newest first).
  const ordered = [...saved].sort(
    (a, b) => handles.indexOf(b.handle) - handles.indexOf(a.handle)
  );

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionHeader
        eyebrow="Saved"
        title="Your wishlist"
        subtitle={
          handles.length
            ? `${handles.length} item${handles.length === 1 ? '' : 's'} saved on this device.`
            : 'Tap the heart on any product to save it here.'
        }
      />

      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : ordered.length > 0 ? (
        <ProductGrid products={ordered} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center shadow-card">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
            <Heart size={28} />
          </span>
          <p className="mt-4 text-lg font-bold text-accent">No saved items yet</p>
          <p className="mt-1 max-w-sm text-sm text-accent/60">
            Browse the shop and tap the heart to build your list. Add to cart still
            uses your real Shopify cart.
          </p>
          <Link to="/shop" className="btn-primary btn-lg mt-6">
            Browse products
          </Link>
        </div>
      )}
    </div>
  );
}
