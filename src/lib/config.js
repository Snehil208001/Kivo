// App-wide config and small helpers.

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';

// Optional public support email (shown on the Contact page if set).
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || '';

// Free-shipping threshold (₹). Must match your Shopify shipping rule.
export const FREE_SHIPPING_THRESHOLD = 499;

// Delivery window shown on PDP / cart (dispatch ~24h + transit).
export const DELIVERY_MIN_DAYS = 3;
export const DELIVERY_MAX_DAYS = 5;

export function whatsappLink(message = "Hi KIVO! I have a question about my order.") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Human-readable estimated delivery range from today. */
export function estimatedDeliveryLabel(from = new Date()) {
  const min = new Date(from);
  min.setDate(min.getDate() + DELIVERY_MIN_DAYS);
  const max = new Date(from);
  max.setDate(max.getDate() + DELIVERY_MAX_DAYS);
  const fmt = (d) =>
    d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  return `Est. delivery ${fmt(min)} – ${fmt(max)}`;
}

export const TRUST_POINTS = [
  { key: 'shipping', label: 'Free Shipping', sub: 'On orders over ₹499' },
  { key: 'secure', label: 'Secure Payments', sub: 'Razorpay & COD' },
  { key: 'returns', label: 'Easy Returns', sub: '7-day no questions' },
  { key: 'cod', label: 'Cash on Delivery', sub: 'Pay when it arrives' },
  { key: 'ships', label: 'Fast Delivery', sub: 'Ships within 24h' },
];

// Optional social profiles — leave blank to hide icons in the footer.
export const SOCIAL_LINKS = [
  {
    key: 'instagram',
    label: 'Instagram',
    url: import.meta.env.VITE_INSTAGRAM_URL || '',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    url: import.meta.env.VITE_FACEBOOK_URL || '',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    url: import.meta.env.VITE_YOUTUBE_URL || '',
  },
].filter((s) => s.url);

// Homepage special rows — create matching collections in Shopify Admin.
// Missing / empty collections are hidden (no fake fillers).
export const HOMEPAGE_ROW_HANDLES = {
  bestsellers: 'bestsellers',
  newArrivals: 'new-arrivals',
  trending: 'trending',
  featured: 'featured',
};

// Nav, homepage tiles and homepage rows are driven by whatever collections
// exist in Shopify — add a collection there and it shows up here. Only these
// handles are hidden (Shopify's auto-created default + dedicated homepage rows).
export const HIDDEN_COLLECTIONS = [
  'frontpage',
  HOMEPAGE_ROW_HANDLES.bestsellers,
  HOMEPAGE_ROW_HANDLES.newArrivals,
  HOMEPAGE_ROW_HANDLES.trending,
  HOMEPAGE_ROW_HANDLES.featured,
];

// Short blurbs per category handle. Used when Shopify has no description yet.
// Create a matching collection in Shopify Admin (same handle) → it appears
// on the site automatically.
export const CATEGORY_COPY = {
  cleaning:
    'Mops, brushes, dusters & kitchen helpers — wipe, scrub and tidy without the struggle.',
  'personal-care':
    'Skincare, grooming and self-care picks for your morning-to-night routine.',
  eco: 'Greener everyday swaps — less plastic, same convenience.',
  'scented-candles':
    'Mood-setting scents for evenings in, gifting and quiet corners.',
  trending: 'Viral finds and fresh drops — what everyone’s adding to cart.',
  makeup: 'Everyday glam to night-out looks — beauty essentials that deliver.',
  lifestyle: 'Small upgrades that make living, working and unwinding easier.',
  fashion: 'Wearable style for real life — looks good, feels easy on the budget.',
  kitchen: 'Smart kitchen gadgets and organizers that save time every day.',
  gadgets: 'Phone stands, lights, chargers & desk extras — useful tech for daily life.',
  jewelry: 'Earrings, chains, clips & accents — finishing touches that pop.',
  fitness: 'Mats, bands and workout basics for home fitness that sticks.',
};

/** Prefer Shopify description; fall back to our blurb by handle. */
export function collectionBlurb(collection) {
  if (!collection) return '';
  const fromShopify = (collection.description || '').trim();
  if (fromShopify) return fromShopify;
  return CATEGORY_COPY[collection.handle] || 'Explore this collection.';
}

// Preferred order on the homepage explore grid (Cleaning featured first).
const EXPLORE_ORDER = [
  'cleaning',
  'trending',
  'fashion',
  'makeup',
  'lifestyle',
  'personal-care',
  'eco',
  'scented-candles',
  'kitchen',
  'gadgets',
];

export function sortForExplore(collections) {
  const list = [...(collections || [])];
  return list.sort((a, b) => {
    const ai = EXPLORE_ORDER.indexOf(a.handle);
    const bi = EXPLORE_ORDER.indexOf(b.handle);
    const aRank = ai === -1 ? 99 : ai;
    const bRank = bi === -1 ? 99 : bi;
    return aRank - bRank;
  });
}

// Note: `collections` is null while the fetch is in flight, so coalesce rather
// than relying on a default parameter (which only covers undefined).
export const visibleCollections = (collections) =>
  (collections || []).filter((c) => !HIDDEN_COLLECTIONS.includes(c.handle));
