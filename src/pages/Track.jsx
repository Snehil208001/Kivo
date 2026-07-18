import { useState } from 'react';
import { MessageCircle, Truck } from 'lucide-react';
import { whatsappLink } from '../lib/config';

// Order tracking. Shopify emails/SMSes a tracking link when an order ships;
// this page lets a customer send their order number to us on WhatsApp to get
// the latest status (no customer accounts required for COD orders).
export default function Track() {
  const [order, setOrder] = useState('');

  function track(e) {
    e.preventDefault();
    const msg = `Hi KIVO! Please share the tracking status for my order ${
      order.trim() || '(order number)'
    }.`;
    window.open(whatsappLink(msg), '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="container-page max-w-xl py-10">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary-deep">
        <Truck size={24} />
      </span>
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
        Track your order
      </h1>
      <p className="mt-2 text-accent/60">
        When your order ships, we send a tracking link to your email and phone.
        Enter your order number below and we'll pull up the latest status for you
        on WhatsApp.
      </p>

      <form onSubmit={track} className="mt-6 rounded-2xl bg-white p-5 shadow-card">
        <label className="text-sm font-semibold text-accent" htmlFor="order-no">
          Order number
        </label>
        <input
          id="order-no"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          placeholder="e.g. #1001"
          className="mt-2 w-full rounded-lg border border-accent/10 px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button type="submit" className="btn-primary btn-lg btn-block mt-4">
          <MessageCircle size={18} />
          Check status on WhatsApp
        </button>
      </form>
    </div>
  );
}
