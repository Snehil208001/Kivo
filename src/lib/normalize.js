// Flatten Shopify GraphQL shapes into simple objects the UI consumes.
import { FEATURES_BY_TYPE } from './config';

export function formatMoney(amount, currencyCode = 'INR') {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (value == null || Number.isNaN(value)) return '';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currencyCode} ${value.toFixed(0)}`;
  }
}

// Deterministic pseudo-random from a string, so a product always shows the
// same rating / units-sold / stock across renders and sessions. Shopify's
// Storefront API doesn't return review data, so we synthesize consistent
// social-proof signals from the product id.
function hashString(str = '') {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295; // 0..1
}

function socialProof(id) {
  const r = hashString(id);
  const r2 = hashString(`${id}-sold`);
  const r3 = hashString(`${id}-stock`);
  const rating = Math.min(4.9, 4.5 + r * 0.45).toFixed(1); // 4.5–4.9
  const reviews = 180 + Math.floor(r2 * 3200); // 180–3380
  const sold = 900 + Math.floor(r * 8000); // 900–8900
  const lowStock = r3 < 0.4 ? 3 + Math.floor(r3 * 20) : null; // sometimes "only N left"
  return { rating, reviews, sold, lowStock };
}

export function normalizeProduct(p) {
  if (!p) return null;

  const price = p.priceRange?.minVariantPrice;
  const compareAt = p.compareAtPriceRange?.minVariantPrice;
  const priceValue = parseFloat(price?.amount ?? '0');
  const compareValue = parseFloat(compareAt?.amount ?? '0');
  const hasDiscount = compareValue > priceValue;

  const tags = p.tags || [];
  const codAvailable = tags.some((t) => /cod/i.test(t)) || true; // KIVO offers COD storewide

  const firstVariant = p.variants?.nodes?.[0];
  const proof = socialProof(p.id || p.handle || p.title);

  return {
    id: p.id,
    title: p.title,
    ...proof,
    handle: p.handle,
    description: p.description || '',
    descriptionHtml: p.descriptionHtml || '',
    productType: p.productType || '',
    tags,
    features: p.features?.length ? p.features : FEATURES_BY_TYPE[p.productType] || [],
    codAvailable,
    availableForSale: p.availableForSale ?? true,
    price: price?.amount ?? '0',
    currencyCode: price?.currencyCode ?? 'INR',
    compareAtPrice: hasDiscount ? compareAt.amount : null,
    hasDiscount,
    discountPercent: hasDiscount
      ? Math.round(((compareValue - priceValue) / compareValue) * 100)
      : 0,
    priceFormatted: formatMoney(price?.amount, price?.currencyCode),
    compareAtFormatted: hasDiscount
      ? formatMoney(compareAt.amount, compareAt.currencyCode)
      : null,
    featuredImage: p.featuredImage || p.images?.nodes?.[0] || null,
    images: p.images?.nodes || [],
    variants: p.variants?.nodes || [],
    defaultVariantId: firstVariant?.id || null,
    isBestseller: tags.some((t) => /bestseller/i.test(t)),
  };
}

export function normalizeCollection(c) {
  if (!c) return null;
  return {
    id: c.id,
    title: c.title,
    handle: c.handle,
    description: c.description || '',
    image: c.image || null,
    products: (c.products?.nodes || []).map(normalizeProduct),
  };
}

export function normalizeCart(cart) {
  if (!cart) return null;
  const currencyCode = cart.cost?.subtotalAmount?.currencyCode ?? 'INR';
  const subtotalValue = parseFloat(cart.cost?.subtotalAmount?.amount ?? '0');
  const totalValue = parseFloat(cart.cost?.totalAmount?.amount ?? '0');
  // A discount lowers total below subtotal; surface the saving for the UI.
  const discountValue = Math.max(0, subtotalValue - totalValue);
  const appliedCodes = (cart.discountCodes || [])
    .filter((d) => d.applicable)
    .map((d) => d.code);

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity || 0,
    subtotal: cart.cost?.subtotalAmount?.amount ?? '0',
    subtotalValue,
    subtotalFormatted: formatMoney(
      cart.cost?.subtotalAmount?.amount,
      cart.cost?.subtotalAmount?.currencyCode
    ),
    total: cart.cost?.totalAmount?.amount ?? '0',
    totalFormatted: formatMoney(
      cart.cost?.totalAmount?.amount,
      cart.cost?.totalAmount?.currencyCode
    ),
    discountValue,
    discountFormatted: discountValue > 0 ? formatMoney(discountValue, currencyCode) : null,
    appliedCodes,
    currencyCode,
    lines: (cart.lines?.nodes || []).map((line) => {
      const m = line.merchandise || {};
      return {
        id: line.id,
        quantity: line.quantity,
        variantId: m.id,
        title: m.product?.title || m.title,
        variantTitle: m.title,
        handle: m.product?.handle,
        image: m.image || null,
        price: m.price?.amount ?? '0',
        priceFormatted: formatMoney(m.price?.amount, m.price?.currencyCode),
        lineTotalFormatted: formatMoney(
          parseFloat(m.price?.amount ?? '0') * line.quantity,
          m.price?.currencyCode
        ),
      };
    }),
  };
}
