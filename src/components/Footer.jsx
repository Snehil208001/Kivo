import { Link } from 'react-router-dom';
import {
  BadgeIndianRupee,
  RotateCcw,
  Truck,
  MessageCircle,
  Package,
  ShieldCheck,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react';
import Logo from './Logo';
import {
  whatsappLink,
  visibleCollections,
  TRUST_POINTS,
  SOCIAL_LINKS,
} from '../lib/config';
import { useCollections } from '../hooks/useCatalog';

const TRUST_ICONS = {
  shipping: Package,
  secure: ShieldCheck,
  returns: RotateCcw,
  cod: BadgeIndianRupee,
  ships: Truck,
};

const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

export default function Footer() {
  const { data: collections } = useCollections();
  const socials = SOCIAL_LINKS;

  return (
    <footer className="mt-16 border-t border-accent/5 bg-white">
      <div className="border-b border-accent/5">
        <div className="container-page grid grid-cols-2 gap-4 py-8 sm:grid-cols-3 lg:grid-cols-5">
          {TRUST_POINTS.map(({ key, label }) => {
            const Icon = TRUST_ICONS[key] || ShieldCheck;
            return (
              <div
                key={key}
                className="flex flex-col items-center gap-2 text-center"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary-dark">
                  <Icon size={20} />
                </span>
                <span className="text-sm font-semibold text-accent">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-accent/60">
            Trending products across lifestyle, fashion, makeup, home and more —
            delivered fast with Cash on Delivery across India.
          </p>
          {socials.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              {socials.map(({ key, label, url }) => {
                const Icon = SOCIAL_ICONS[key] || MessageCircle;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary-deep transition hover:bg-primary hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-accent">Shop</h4>
          <ul className="space-y-2 text-sm text-accent/60">
            <li>
              <Link to="/shop" className="hover:text-primary">
                All Products
              </Link>
            </li>
            {visibleCollections(collections)
              .slice(0, 5)
              .map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/collections/${c.handle}`}
                    className="hover:text-primary"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-accent">Help</h4>
          <ul className="space-y-2 text-sm text-accent/60">
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-primary">
                Track Order
              </Link>
            </li>
            <li>
              <Link to="/pages/shipping-policy" className="hover:text-primary">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link to="/pages/refund-policy" className="hover:text-primary">
                Returns &amp; Refunds
              </Link>
            </li>
            <li>
              <a
                href={whatsappLink('Hi KIVO! I need help.')}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                WhatsApp Support
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-accent">Get updates</h4>
          <p className="mb-3 text-sm text-accent/60">
            Deals &amp; new drops on WhatsApp — no spam.
          </p>
          <a
            href={whatsappLink(
              'Hi KIVO! Please add me to your deals & new-drop updates.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-4 py-2.5 text-sm"
          >
            <MessageCircle size={16} />
            Get deals on WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-accent/5">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-accent/50 sm:flex-row">
          <p>© {new Date().getFullYear()} KIVO. All rights reserved.</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link to="/pages/about" className="hover:text-primary">
              About
            </Link>
            <Link to="/pages/privacy-policy" className="hover:text-primary">
              Privacy
            </Link>
            <Link to="/pages/terms-of-service" className="hover:text-primary">
              Terms
            </Link>
            <Link to="/pages/refund-policy" className="hover:text-primary">
              Refunds
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
