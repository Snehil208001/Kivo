import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import CollectionBanners from '../components/CollectionBanners';
import SectionHeader from '../components/SectionHeader';
import ProductGrid, { ProductGridSkeleton } from '../components/ProductGrid';
import { StatsBand, ValueProps, Reviews } from '../components/HomeSections';
import { useProducts, useCollections } from '../hooks/useCatalog';

export default function Home() {
  const { data: products, loading: productsLoading } = useProducts();
  const { data: collections, loading: collectionsLoading } = useCollections();

  const bestsellers = (products || []).filter((p) => p.isBestseller);
  const bestsellerList = (bestsellers.length ? bestsellers : products || []).slice(
    0,
    8
  );
  const featured = bestsellerList[0] || null;

  return (
    <>
      <Hero featured={featured} />

      {/* Signature offer marquee */}
      <Marquee variant="dark" />

      {/* Stats band */}
      <section className="container-page -mt-8 md:-mt-10">
        <StatsBand />
      </section>

      {/* Categories — bento */}
      <section className="container-page mt-16">
        <SectionHeader
          eyebrow="Shop by need"
          title="Find your fix, fast."
          subtitle="Three edits, zero guesswork."
        />
        <CollectionBanners />
      </section>

      {/* Bestsellers */}
      <section className="container-page mt-16">
        <SectionHeader
          eyebrow="🔥 Selling fast"
          title="This week's bestsellers"
          subtitle="What 50,000+ homes are buying right now."
          to="/shop"
        />
        {productsLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <ProductGrid products={bestsellerList} />
        )}
      </section>

      {/* Why KIVO */}
      <div className="mt-16">
        <ValueProps />
      </div>

      {/* Per-collection previews */}
      {(collectionsLoading ? [] : collections || []).map((collection) => (
        <section key={collection.id} className="container-page mt-16">
          <SectionHeader
            title={collection.title}
            subtitle={collection.description}
            to={`/collections/${collection.handle}`}
          />
          <ProductGrid products={collection.products.slice(0, 4)} />
        </section>
      ))}

      {/* Reviews */}
      <Reviews />

      {/* Final CTA */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-accent px-6 py-16 text-center text-white sm:px-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-pop/20 blur-3xl" />
          <span className="eyebrow relative text-primary-light">
            <Sparkles size={13} /> Risk-free
          </span>
          <h2 className="relative mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Try it. Love it. Or send it back.
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-white/70">
            Cash on Delivery, 7-day returns, and real humans on WhatsApp. There's
            nothing to lose but the mess.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/shop" className="btn-primary btn-lg">
              Shop all products
              <ArrowRight size={18} />
            </Link>
            <Link to="/collections/cleaning" className="btn-outline btn-lg border-white/20 bg-white/10 text-white hover:border-white hover:text-white">
              Start with Cleaning
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
