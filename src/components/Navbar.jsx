import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Heart, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useCollections } from '../hooks/useCatalog';
import { visibleCollections } from '../lib/config';
import Logo from './Logo';

export default function Navbar() {
  const openCart = useCartStore((s) => s.openCart);
  const count = useCartStore((s) => s.cart?.totalQuantity || 0);
  const wishCount = useWishlistStore((s) => s.handles.length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState('');
  const accountRef = useRef(null);
  const { data: collections } = useCollections();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accountOpen) return;
    function onDoc(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') setAccountOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [accountOpen]);

  function submitSearch(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
    setMobileOpen(false);
  }

  const NAV_LINKS = [
    { to: '/shop', label: 'Shop All' },
    ...visibleCollections(collections).slice(0, 4).map((c) => ({
      to: `/collections/${c.handle}`,
      label: c.title,
    })),
  ];

  const accountLinks = [
    { to: '/track', label: 'Track order' },
    { to: '/contact', label: 'Contact us' },
    { to: '/wishlist', label: 'Wishlist' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-accent/5 bg-white/85 backdrop-blur-md">
      <div className="bg-primary-deep text-center text-[11px] font-semibold tracking-wide text-white sm:text-[12.5px]">
        <p className="px-3 py-2">
          <span className="sm:hidden">Free shipping over ₹499 · COD · Ships in 24h</span>
          <span className="hidden sm:inline">
            Free shipping over ₹499 · Cash on Delivery · Ships in 24h
          </span>
        </p>
      </div>

      <nav className="container-page flex h-16 items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <button
            className="-ml-2 rounded-lg p-2 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Link to="/" className="flex items-center" aria-label="KIVO home">
            <Logo />
          </Link>
        </div>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition hover:text-primary ${
                  isActive ? 'text-primary' : 'text-accent/70'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-xs flex-1 md:block">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-accent/40"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="w-full rounded-full border border-accent/10 bg-surface py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:bg-white"
            />
          </div>
        </form>

        <div className="flex items-center gap-0.5">
          <Link
            to="/wishlist"
            className="relative rounded-lg p-2 transition hover:bg-primary-light"
            aria-label="Wishlist"
          >
            <Heart size={22} className="text-accent" />
            {wishCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-pop px-1 text-[11px] font-bold text-white shadow-pop">
                {wishCount}
              </span>
            )}
          </Link>

          <div className="relative" ref={accountRef}>
            <button
              type="button"
              onClick={() => setAccountOpen((o) => !o)}
              className="rounded-lg p-2 transition hover:bg-primary-light"
              aria-label="Account menu"
              aria-expanded={accountOpen}
            >
              <User size={22} className="text-accent" />
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-accent/10 bg-white py-1 shadow-lift">
                {accountLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setAccountOpen(false)}
                    className="block px-3.5 py-2.5 text-sm font-semibold text-accent/80 hover:bg-primary-light hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={openCart}
            className="relative rounded-lg p-2 transition hover:bg-primary-light"
            aria-label="Open cart"
          >
            <ShoppingBag size={22} className="text-accent" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-pop px-1 text-[11px] font-bold text-white shadow-pop">
                {count}
              </span>
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-accent/5 bg-white md:hidden">
          <div className="container-page flex flex-col py-2">
            <form onSubmit={submitSearch} className="relative mb-2 mt-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-accent/40"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="w-full rounded-full border border-accent/10 bg-surface py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary focus:bg-white"
              />
            </form>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-2 py-3 text-sm font-semibold ${
                    isActive ? 'text-primary' : 'text-accent/80'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {accountLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-semibold text-accent/80"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
