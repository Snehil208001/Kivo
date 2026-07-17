// Mock catalog used as a fallback when Shopify credentials are not configured.
// Shapes mirror the normalized objects produced in lib/normalize.js so the UI
// behaves identically with or without a live Storefront connection.

// Branded inline-SVG placeholder — no network dependency, always renders.
function placeholder(label, bg = '#e6f7f0', fg = '#00A86B') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <rect width="800" height="800" fill="${bg}"/>
    <circle cx="400" cy="330" r="150" fill="${fg}" opacity="0.14"/>
    <text x="50%" y="52%" font-family="Inter, sans-serif" font-size="46" font-weight="700"
      fill="${fg}" text-anchor="middle" dominant-baseline="middle">${label}</text>
    <text x="50%" y="60%" font-family="Inter, sans-serif" font-size="24" font-weight="600"
      fill="${fg}" opacity="0.6" text-anchor="middle" dominant-baseline="middle">KIVO</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function img(label, bg, fg) {
  const url = placeholder(label, bg, fg);
  return { url, altText: label, width: 800, height: 800 };
}

function money(amount) {
  return { amount: amount.toFixed(2), currencyCode: 'INR' };
}

// Feature bullets by product type — used when a product has no explicit list.
const DEFAULT_FEATURES = {
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

let idc = 1;
function makeProduct({
  title,
  handle,
  price,
  compareAt,
  type,
  tags = [],
  description,
  images,
  features,
}) {
  const gid = `gid://shopify/Product/mock-${idc}`;
  const variantId = `gid://shopify/ProductVariant/mock-${idc}`;
  idc += 1;
  return {
    id: gid,
    title,
    handle,
    description,
    descriptionHtml: `<p>${description}</p>`,
    tags,
    features: features || DEFAULT_FEATURES[type] || DEFAULT_FEATURES.Cleaning,
    availableForSale: true,
    productType: type,
    priceRange: { minVariantPrice: money(price) },
    compareAtPriceRange: {
      minVariantPrice: compareAt ? money(compareAt) : money(price),
    },
    featuredImage: images[0],
    images: { nodes: images },
    variants: {
      nodes: [
        {
          id: variantId,
          title: 'Default',
          availableForSale: true,
          price: money(price),
          compareAtPrice: compareAt ? money(compareAt) : null,
          selectedOptions: [{ name: 'Title', value: 'Default Title' }],
        },
      ],
    },
  };
}

// --- Cleaning ---
const spinMop = makeProduct({
  title: 'KIVO 360° Spin Mop & Bucket',
  handle: 'spin-mop',
  price: 1499,
  compareAt: 2499,
  type: 'Cleaning',
  tags: ['Bestseller', 'COD Available'],
  description:
    'Hands-free 360° spin mop with a self-wringing bucket. Microfiber heads pick up 99% of dust and grime. Wring dry or wet with a single pedal push — no bending, no mess.',
  images: [
    img('Spin Mop', '#e6f7f0', '#00A86B'),
    img('Bucket', '#dff3ea', '#008f5a'),
    img('Refill Heads', '#eafaf3', '#00A86B'),
  ],
});

const glassCleaner = makeProduct({
  title: 'Streak-Free Glass Cleaner (500ml)',
  handle: 'glass-cleaner',
  price: 249,
  compareAt: 349,
  type: 'Cleaning',
  tags: ['COD Available'],
  description:
    'Ammonia-free formula that leaves mirrors and windows crystal clear with zero streaks. Fresh citrus scent.',
  images: [img('Glass Cleaner', '#e6f7f0', '#00A86B')],
});

const scrubBrush = makeProduct({
  title: 'Electric Spin Scrubber',
  handle: 'spin-scrubber',
  price: 1899,
  compareAt: 2999,
  type: 'Cleaning',
  tags: ['Bestseller', 'COD Available'],
  description:
    'Cordless power scrubber with 3 interchangeable brush heads for tiles, grout, and bathroom fittings. USB rechargeable, IPX7 waterproof.',
  images: [img('Spin Scrubber', '#e6f7f0', '#00A86B'), img('Brush Heads', '#dff3ea', '#008f5a')],
});

// --- Personal Care ---
const faceRoller = makeProduct({
  title: 'Ice Roller & Jade Face Roller Set',
  handle: 'face-roller',
  price: 799,
  compareAt: 1499,
  type: 'Personal Care',
  tags: ['Bestseller', 'COD Available'],
  description:
    'De-puff, tighten, and cool tired skin. Includes a stainless ice roller and a natural jade roller for daily facial massage. Boosts circulation and glow.',
  images: [
    img('Face Roller', '#fdeef4', '#c0397a'),
    img('Jade Roller', '#fbe6f0', '#a82e68'),
    img('Ice Roller', '#fdf0f6', '#c0397a'),
  ],
});

const hairDryer = makeProduct({
  title: 'Ionic Foldable Hair Dryer',
  handle: 'ionic-hair-dryer',
  price: 1299,
  compareAt: 1999,
  type: 'Personal Care',
  tags: ['COD Available'],
  description:
    'Lightweight 1600W ionic dryer with cool-shot and foldable handle. Reduces frizz for smooth, shiny hair. Travel-ready.',
  images: [img('Hair Dryer', '#fdeef4', '#c0397a')],
});

const guaSha = makeProduct({
  title: 'Rose Quartz Gua Sha Tool',
  handle: 'gua-sha',
  price: 449,
  compareAt: 699,
  type: 'Personal Care',
  tags: ['COD Available'],
  description:
    'Authentic rose quartz gua sha for lymphatic drainage and facial sculpting. Comes with a velvet pouch and technique card.',
  images: [img('Gua Sha', '#fdeef4', '#c0397a')],
});

// --- Eco ---
const ecoBundle = makeProduct({
  title: 'Zero-Waste Kitchen Starter Bundle',
  handle: 'eco-bundle',
  price: 999,
  compareAt: 1799,
  type: 'Eco',
  tags: ['Bestseller', 'COD Available', 'Plastic-Free'],
  description:
    'Everything to cut single-use plastic from your kitchen: bamboo utensils, reusable produce bags, beeswax wraps, and a stainless straw set. Plastic-free packaging.',
  images: [
    img('Eco Bundle', '#eef6e6', '#4a7c2f'),
    img('Bamboo Set', '#e7f2dc', '#3d6626'),
    img('Beeswax Wraps', '#f2f8ea', '#4a7c2f'),
  ],
});

const bambooBrush = makeProduct({
  title: 'Bamboo Toothbrush (Pack of 4)',
  handle: 'bamboo-toothbrush',
  price: 299,
  compareAt: 499,
  type: 'Eco',
  tags: ['COD Available', 'Plastic-Free'],
  description:
    'Biodegradable bamboo handles with soft charcoal-infused bristles. Compostable packaging, family 4-pack.',
  images: [img('Bamboo Brush', '#eef6e6', '#4a7c2f')],
});

const reusableBottle = makeProduct({
  title: 'Insulated Steel Water Bottle 750ml',
  handle: 'steel-bottle',
  price: 699,
  compareAt: 1099,
  type: 'Eco',
  tags: ['COD Available', 'Plastic-Free'],
  description:
    'Double-wall vacuum insulation keeps drinks cold 24h / hot 12h. Leak-proof, BPA-free, built to replace hundreds of plastic bottles.',
  images: [img('Steel Bottle', '#eef6e6', '#4a7c2f')],
});

export const MOCK_PRODUCTS = [
  spinMop,
  scrubBrush,
  faceRoller,
  ecoBundle,
  glassCleaner,
  hairDryer,
  guaSha,
  bambooBrush,
  hairDryer,
  reusableBottle,
];

// De-duplicate (hairDryer referenced twice above for bestseller weighting).
const seen = new Set();
const dedupedProducts = MOCK_PRODUCTS.filter((p) => {
  if (seen.has(p.id)) return false;
  seen.add(p.id);
  return true;
});

export const MOCK_COLLECTIONS = [
  {
    id: 'gid://shopify/Collection/mock-cleaning',
    title: 'Cleaning',
    handle: 'cleaning',
    description: 'Effortless tools that make chores disappear.',
    image: img('Cleaning', '#e6f7f0', '#00A86B'),
    products: { nodes: [spinMop, scrubBrush, glassCleaner] },
  },
  {
    id: 'gid://shopify/Collection/mock-personal-care',
    title: 'Personal Care',
    handle: 'personal-care',
    description: 'Everyday self-care that actually feels good.',
    image: img('Personal Care', '#fdeef4', '#c0397a'),
    products: { nodes: [faceRoller, hairDryer, guaSha] },
  },
  {
    id: 'gid://shopify/Collection/mock-eco',
    title: 'Eco',
    handle: 'eco',
    description: 'Swap single-use for things that last.',
    image: img('Eco', '#eef6e6', '#4a7c2f'),
    products: { nodes: [ecoBundle, bambooBrush, reusableBottle] },
  },
];

export const MOCK_PRODUCTS_DEDUPED = dedupedProducts;
