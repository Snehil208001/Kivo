import { Link } from 'react-router-dom';
import {
  BadgeIndianRupee,
  RotateCcw,
  Truck,
  MessageCircle,
} from 'lucide-react';
import Logo from './Logo';
import { whatsappLink, visibleCollections } from '../lib/config';
import { useCollections } from '../hooks/useCatalog';

const GUARANTEES = [
  { icon: BadgeIndianRupee, label: 'Cash on Delivery' },
  { icon: RotateCcw, label: '7-Day Returns' },
  { icon: Truck, label: 'Ships in 24h' },
  { icon: MessageCircle, label: 'WhatsApp Support' },
];

export default function Footer() {
  const { data: collections } = useCollections();

  return (
    <footer className="mt-16 border-t border-accent/5 bg-white">
      {/* Guarantee bar */}
      <div className="border-b border-accent/5">
        <div className="container-page grid grid-cols-2 gap-4 py-8 md:grid-cols-4">
          {GUARANTEES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary-dark">
                <Icon size={20} />
              </span>
              <span className="text-sm font-semibold text-accent">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-accent/60">
            Smart cleaning, personal care & eco essentials — delivered fast, with
            Cash on Delivery across India.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-accent">Shop</h4>
          <ul className="space-y-2 text-sm text-accent/60">
            <li><Link to="/shop" className="hover:text-primary">All Products</Link></li>
            {visibleCollections(collections).slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link to={`/collections/${c.handle}`} className="hover:text-primary">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-accent">Help</h4>
          <ul className="space-y-2 text-sm text-accent/60">
            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
            <li><Link to="/track" className="hover:text-primary">Track Order</Link></li>
            <li><Link to="/pages/shipping-policy" className="hover:text-primary">Shipping Policy</Link></li>
            <li><Link to="/pages/refund-policy" className="hover:text-primary">Returns &amp; Refunds</Link></li>
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
            <Link to="/pages/about" className="hover:text-primary">About</Link>
            <Link to="/pages/privacy-policy" className="hover:text-primary">Privacy</Link>
            <Link to="/pages/terms-of-service" className="hover:text-primary">Terms</Link>
            <Link to="/pages/refund-policy" className="hover:text-primary">Refunds</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
