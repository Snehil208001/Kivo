import { useState } from 'react';
import { MessageCircle, Mail, BadgeIndianRupee, RotateCcw, Truck } from 'lucide-react';
import { WHATSAPP_NUMBER, SUPPORT_EMAIL, whatsappLink } from '../lib/config';

// Contact page — no backend. The form composes a prefilled WhatsApp message
// (our primary support channel), so it works instantly with no email server.
export default function Contact() {
  const [name, setName] = useState('');
  const [order, setOrder] = useState('');
  const [message, setMessage] = useState('');

  function sendWhatsApp(e) {
    e.preventDefault();
    const text =
      `Hi KIVO! I'm ${name || 'a customer'}.` +
      (order ? ` Order: ${order}.` : '') +
      (message ? `\n\n${message}` : '');
    window.open(whatsappLink(text), '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="container-page max-w-3xl py-10">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
        Contact us
      </h1>
      <p className="mt-2 text-accent/60">
        We usually reply within a few hours. WhatsApp is fastest.
      </p>

      {/* Quick channels */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={whatsappLink('Hi KIVO! I have a question.')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card transition hover:shadow-lift"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#128C4B]">
            <MessageCircle size={22} />
          </span>
          <div>
            <p className="font-semibold text-accent">WhatsApp</p>
            <p className="text-sm text-accent/60">+{WHATSAPP_NUMBER}</p>
          </div>
        </a>

        {SUPPORT_EMAIL && (
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card transition hover:shadow-lift"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary-deep">
              <Mail size={22} />
            </span>
            <div>
              <p className="font-semibold text-accent">Email</p>
              <p className="text-sm text-accent/60">{SUPPORT_EMAIL}</p>
            </div>
          </a>
        )}
      </div>

      {/* Message form → opens WhatsApp prefilled */}
      <form onSubmit={sendWhatsApp} className="mt-6 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="font-display text-lg font-bold text-accent">Send us a message</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="rounded-lg border border-accent/10 px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <input
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="Order number (optional)"
            className="rounded-lg border border-accent/10 px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          placeholder="How can we help?"
          className="mt-3 w-full rounded-lg border border-accent/10 px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button type="submit" className="btn-primary btn-lg mt-4">
          <MessageCircle size={18} />
          Send on WhatsApp
        </button>
      </form>

      {/* Trust reminders */}
      <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs font-medium text-accent/60">
        <div className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 shadow-card">
          <BadgeIndianRupee size={18} className="text-primary" /> Cash on Delivery
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 shadow-card">
          <RotateCcw size={18} className="text-primary" /> 7-Day Returns
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 shadow-card">
          <Truck size={18} className="text-primary" /> Fast Dispatch
        </div>
      </div>
    </div>
  );
}
