import { Link } from 'react-router-dom';
import {
  BadgeIndianRupee,
  RotateCcw,
  Truck,
  MessageCircle,
} from 'lucide-react';
import Logo from './Logo';
import { whatsappLink } from '../lib/config';

const GUARANTEES = [
  { icon: BadgeIndianRupee, label: 'Cash on Delivery' },
  { icon: RotateCcw, label: '7-Day Returns' },
  { icon: Truck, label: 'Ships in 24h' },
  { icon: MessageCircle, label: 'WhatsApp Support' },
];

export default function Footer() {
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
            <li><Link to="/collections/cleaning" className="hover:text-primary">Cleaning</Link></li>
            <li><Link to="/collections/personal-care" className="hover:text-primary">Personal Care</Link></li>
            <li><Link to="/collections/eco" className="hover:text-primary">Eco</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-accent">Help</h4>
          <ul className="space-y-2 text-sm text-accent/60">
            <li><span className="cursor-default">Cash on Delivery</span></li>
            <li><span className="cursor-default">7-Day Returns</span></li>
            <li><span className="cursor-default">Shipping &amp; Tracking</span></li>
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
            Deals &amp; new drops, no spam.
          </p>
          <form
            className="flex gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-lg border border-accent/10 px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button type="submit" className="btn-primary px-4 py-2 text-sm">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-accent/5">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-accent/50 sm:flex-row">
          <p>© {new Date().getFullYear()} KIVO. All rights reserved.</p>
          <p>Secure checkout powered by Shopify · COD &amp; Razorpay</p>
        </div>
      </div>
    </footer>
  );
}
