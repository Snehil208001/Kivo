import { shopifyFetch, isShopifyConfigured } from './shopify';
import {
  CART_CREATE_MUTATION,
  CART_QUERY,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
} from './queries';
import { normalizeCart, formatMoney } from './normalize';
import { MOCK_PRODUCTS_DEDUPED } from './mockData';

// Sentinel checkout URL used in mock mode so the UI can detect it and explain
// that a real Shopify checkout (with COD + Razorpay) would open here.
export const MOCK_CHECKOUT_URL = '#mock-checkout';

function throwOnUserErrors(userErrors) {
  if (userErrors && userErrors.length) {
    throw new Error(userErrors.map((e) => e.message).join('; '));
  }
}

// ---------------------------------------------------------------------------
// Mock cart engine — a fully client-side cart used when Shopify is unconfigured
// so the entire buy flow is demonstrable without credentials.
// ---------------------------------------------------------------------------

const MOCK_CART_KEY = 'kivo_mock_cart';
let mockCartLines = loadMockLines();

function loadMockLines() {
  try {
    const raw = localStorage.getItem(MOCK_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMockLines() {
  try {
    localStorage.setItem(MOCK_CART_KEY, JSON.stringify(mockCartLines));
  } catch {
    /* ignore quota / private mode */
  }
}

function variantLookup(variantId) {
  for (const p of MOCK_PRODUCTS_DEDUPED) {
    const v = p.variants.nodes.find((x) => x.id === variantId);
    if (v) return { product: p, variant: v };
  }
  return null;
}

function buildMockCart() {
  const nodes = mockCartLines.map((line, i) => {
    const found = variantLookup(line.variantId);
    const v = found?.variant;
    const p = found?.product;
    return {
      id: `mock-line-${i}`,
      quantity: line.quantity,
      merchandise: {
        id: line.variantId,
        title: v?.title || 'Default',
        image: p?.featuredImage || null,
        price: v?.price || { amount: '0', currencyCode: 'INR' },
        product: {
          id: p?.id,
          title: p?.title || 'Product',
          handle: p?.handle,
        },
      },
    };
  });

  const subtotal = mockCartLines.reduce((sum, line) => {
    const found = variantLookup(line.variantId);
    const amt = parseFloat(found?.variant?.price?.amount ?? '0');
    return sum + amt * line.quantity;
  }, 0);

  const totalQuantity = mockCartLines.reduce((s, l) => s + l.quantity, 0);

  return {
    id: 'gid://shopify/Cart/mock-cart',
    checkoutUrl: MOCK_CHECKOUT_URL,
    totalQuantity,
    cost: {
      subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: 'INR' },
      totalAmount: { amount: subtotal.toFixed(2), currencyCode: 'INR' },
    },
    lines: { nodes },
  };
}

function mockAdd(lines) {
  for (const { merchandiseId, quantity } of lines) {
    const existing = mockCartLines.find((l) => l.variantId === merchandiseId);
    if (existing) existing.quantity += quantity;
    else mockCartLines.push({ variantId: merchandiseId, quantity });
  }
  saveMockLines();
  return normalizeCart(buildMockCart());
}

function mockUpdate(lines) {
  for (const { id, quantity } of lines) {
    const index = parseInt(String(id).replace('mock-line-', ''), 10);
    if (!Number.isNaN(index) && mockCartLines[index]) {
      if (quantity <= 0) mockCartLines[index] = null;
      else mockCartLines[index].quantity = quantity;
    }
  }
  mockCartLines = mockCartLines.filter(Boolean);
  saveMockLines();
  return normalizeCart(buildMockCart());
}

function mockRemove(lineIds) {
  const indexes = lineIds
    .map((id) => parseInt(String(id).replace('mock-line-', ''), 10))
    .filter((n) => !Number.isNaN(n));
  mockCartLines = mockCartLines.filter((_, i) => !indexes.includes(i));
  saveMockLines();
  return normalizeCart(buildMockCart());
}

// ---------------------------------------------------------------------------
// Public cart API — routes to Shopify or the mock engine transparently.
// `lines` use the shape { merchandiseId, quantity }.
// ---------------------------------------------------------------------------

export async function createCart(lines = []) {
  if (!isShopifyConfigured) {
    return mockAdd(lines);
  }
  const data = await shopifyFetch(CART_CREATE_MUTATION, { lines });
  throwOnUserErrors(data.cartCreate?.userErrors);
  return normalizeCart(data.cartCreate?.cart);
}

export async function getCart(cartId) {
  if (!isShopifyConfigured) {
    return normalizeCart(buildMockCart());
  }
  const data = await shopifyFetch(CART_QUERY, { id: cartId });
  return normalizeCart(data.cart);
}

export async function addLines(cartId, lines) {
  if (!isShopifyConfigured) {
    return mockAdd(lines);
  }
  const data = await shopifyFetch(CART_LINES_ADD_MUTATION, { cartId, lines });
  throwOnUserErrors(data.cartLinesAdd?.userErrors);
  return normalizeCart(data.cartLinesAdd?.cart);
}

export async function updateLines(cartId, lines) {
  if (!isShopifyConfigured) {
    return mockUpdate(lines);
  }
  const data = await shopifyFetch(CART_LINES_UPDATE_MUTATION, { cartId, lines });
  throwOnUserErrors(data.cartLinesUpdate?.userErrors);
  return normalizeCart(data.cartLinesUpdate?.cart);
}

export async function removeLines(cartId, lineIds) {
  if (!isShopifyConfigured) {
    return mockRemove(lineIds);
  }
  const data = await shopifyFetch(CART_LINES_REMOVE_MUTATION, { cartId, lineIds });
  throwOnUserErrors(data.cartLinesRemove?.userErrors);
  return normalizeCart(data.cartLinesRemove?.cart);
}

/**
 * Express "Buy Now": create a fresh, single-purpose cart for the given lines
 * and return its checkout URL. Kept separate from the persistent shopping cart
 * so buying now never disturbs what the shopper already has in their bag.
 * In mock mode this returns the sentinel MOCK_CHECKOUT_URL.
 */
export async function buyNowUrl(lines) {
  const cart = await createCart(lines);
  return cart?.checkoutUrl || null;
}

export { formatMoney };
