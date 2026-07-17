// App-wide config and small helpers.

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';

export function whatsappLink(message = "Hi KIVO! I have a question about my order.") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const TRUST_POINTS = [
  { key: 'cod', label: 'Cash on Delivery', sub: 'Pay when it arrives' },
  { key: 'returns', label: '7-Day Returns', sub: 'No-questions-asked' },
  { key: 'ships', label: 'Ships in 24h', sub: 'Fast dispatch' },
  { key: 'support', label: 'WhatsApp Support', sub: 'Real humans, fast' },
];

// The three merchandising collections shown on the homepage, in order.
export const FEATURED_COLLECTIONS = ['cleaning', 'personal-care', 'eco'];
