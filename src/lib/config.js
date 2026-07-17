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

// Nav, homepage tiles and homepage rows are driven by whatever collections
// exist in Shopify — add a collection there and it shows up here. Only these
// handles are hidden (Shopify's auto-created default).
export const HIDDEN_COLLECTIONS = ['frontpage'];

// Note: `collections` is null while the fetch is in flight, so coalesce rather
// than relying on a default parameter (which only covers undefined).
export const visibleCollections = (collections) =>
  (collections || []).filter((c) => !HIDDEN_COLLECTIONS.includes(c.handle));

// Feature bullets by product type. Shopify's Storefront API has no "features"
// field, so the PDP derives them from productType. Swap for a product metafield
// if per-product copy is needed.
export const FEATURES_BY_TYPE = {
  Cleaning: [
    'Cuts everyday cleaning time in half',
    'Durable build made to last for years',
    'Easy to rinse, dry and store away',
    'Safe on common household surfaces',
  ],
  'Personal Care': [
    'Salon-quality results at home',
    'Gentle enough for daily use',
    'Ergonomic, no-slip grip',
    'Lightweight and travel-friendly',
  ],
  Eco: [
    'Plastic-free and fully reusable',
    'Replaces hundreds of single-use items',
    'Made from natural, durable materials',
    'Ships in compostable packaging',
  ],
};
