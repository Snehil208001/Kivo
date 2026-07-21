import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import CollectionBanners from '../components/CollectionBanners';
import SectionHeader from '../components/SectionHeader';
import ProductGrid, { ProductGridSkeleton } from '../components/ProductGrid';
import { StatsBand, ValueProps, Reviews } from '../components/HomeSections';
import { useProducts, useCollections } from '../hooks/useCatalog';
import {
  visibleCollections,
  collectionBlurb,
  sortForExplore,
  HOMEPAGE_ROW_HANDLES,
} from '../lib/config';

function productsFromCollection(collections, handle) {
  const col = (collections || []).find((c) => c.handle === handle);
  const list = col?.products?.filter(Boolean) || [];
  return list.length ? list : null;
}

export default function Home() {
  const { data: products, loading: productsLoading } = useProducts();
  const { data: collections, loading: collectionsLoading } = useCollections();

  const all = products || [];
  const shopCollections = sortForExplore(visibleCollections(collections));
  const cleaning = shopCollections.find((c) => c.handle === 'cleaning');

  // Best Sellers: Shopify collection first, else tag / catalog fallback.
  const fromBestsellers = productsFromCollection(
    collections,
    HOMEPAGE_ROW_HANDLES.bestsellers
  );
  const taggedBestsellers = all.filter((p) => p.isBestseller);
  const bestsellerList = (
    fromBestsellers ||
    (taggedBestsellers.length ? taggedBestsellers : all)
  ).slice(0, 8);
  const featuredHero = bestsellerList[0] || null;

  // New Arrivals: collection, else newest by createdAt when catalog has enough.
  const fromNew = productsFromCollection(
    collections,
    HOMEPAGE_ROW_HANDLES.newArrivals
  );
  const newest = [...all]
    .filter((p) => p.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const newArrivals =
    fromNew || (newest.length >= 2 ? newest.slice(0, 8) : null);

  // Trending / Featured: Shopify collection only — hide if empty.
  const trending = productsFromCollection(
    collections,
    HOMEPAGE_ROW_HANDLES.trending
  );
  const featuredCol = (collections || []).find(
    (c) => c.handle === HOMEPAGE_ROW_HANDLES.featured
  );
  const featuredProducts = featuredCol?.products?.filter(Boolean) || [];
  const showFeatured = featuredProducts.length > 0;

  return (
    <>
      <Hero featured={featuredHero} collection={cleaning || shopCollections[0]} />

      <Marquee variant="dark" />

      <section className="container-page mt-10">
        <StatsBand />
      </section>

      <section className="container-page mt-16">
        <SectionHeader
          eyebrow="Explore"
          title="Browse by category"
          subtitle="Start with Cleaning, or jump into care, eco, lifestyle and whatever’s next."
        />
        <CollectionBanners collections={shopCollections} />
      </section>

      <section className="container-page mt-16">
        <SectionHeader
          eyebrow="Popular now"
          title="This week's bestsellers"
          subtitle="What shoppers are adding to cart right now."
          to="/shop"
        />
        {productsLoading || collectionsLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <ProductGrid products={bestsellerList} />
        )}
      </section>

      {newArrivals && (
        <section className="container-page mt-16">
          <SectionHeader
            eyebrow="Just in"
            title="New arrivals"
            subtitle="Fresh drops from the catalog."
            to={
              fromNew
                ? `/collections/${HOMEPAGE_ROW_HANDLES.newArrivals}`
                : '/shop'
            }
          />
          <ProductGrid products={newArrivals.slice(0, 8)} />
        </section>
      )}

      {trending && (
        <section className="container-page mt-16">
          <SectionHeader
            eyebrow="Trending"
            title="Trending products"
            subtitle="What everyone’s looking at."
            to={`/collections/${HOMEPAGE_ROW_HANDLES.trending}`}
          />
          <ProductGrid products={trending.slice(0, 8)} />
        </section>
      )}

      {showFeatured && (
        <section className="container-page mt-16">
          <SectionHeader
            eyebrow="Featured"
            title={featuredCol.title}
            subtitle={collectionBlurb(featuredCol)}
            to={`/collections/${featuredCol.handle}`}
          />
          <ProductGrid products={featuredProducts.slice(0, 8)} />
        </section>
      )}

      <div className="mt-16">
        <ValueProps />
      </div>

      {(collectionsLoading ? [] : shopCollections).map((collection) => (
        <section key={collection.id} className="container-page mt-16">
          <SectionHeader
            title={collection.title}
            subtitle={collectionBlurb(collection)}
            to={`/collections/${collection.handle}`}
          />
          <ProductGrid products={collection.products.slice(0, 4)} />
        </section>
      ))}

      <Reviews />

      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-accent px-5 py-12 text-center text-white sm:rounded-[2.5rem] sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-pop/20 blur-3xl" />
          <span className="eyebrow relative text-primary-light">
            <Sparkles size={13} /> Risk-free shopping
          </span>
          <h2 className="relative mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Try it. Love it. Or send it back.
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-white/70">
            Cash on Delivery, 7-day returns, and WhatsApp support whenever you
            need us.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/shop" className="btn-primary btn-lg">
              Shop all products
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/shop"
              className="btn-outline btn-lg border-white/20 bg-white/10 text-white hover:border-white hover:text-white"
            >
              Browse categories
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
