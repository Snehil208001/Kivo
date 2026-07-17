import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  COLLECTIONS_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_QUERY,
} from './queries';
import { normalizeProduct, normalizeCollection, normalizeCart } from './normalize';

// ---------------------------------------------------------------------------
// 1. Client initialisation — domain + token come from Vite env (.env)
// ---------------------------------------------------------------------------

const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2026-07';

// Placeholder values shipped in .env.example — treat these as "not configured".
const PLACEHOLDER_DOMAINS = ['your-store.myshopify.com', ''];
const PLACEHOLDER_TOKENS = ['your_token', 'your_storefront_access_token', ''];

export const isShopifyConfigured =
  !!DOMAIN &&
  !!TOKEN &&
  !PLACEHOLDER_DOMAINS.includes(DOMAIN) &&
  !PLACEHOLDER_TOKENS.includes(TOKEN);

let client = null;

if (isShopifyConfigured) {
  client = createStorefrontApiClient({
    storeDomain: DOMAIN.startsWith('http') ? DOMAIN : `https://${DOMAIN}`,
    apiVersion: API_VERSION,
    publicAccessToken: TOKEN,
  });
}

/**
 * Low-level GraphQL request against the Storefront API.
 * Throws a descriptive Error on transport or GraphQL errors so callers can
 * surface a message or fall back to mock data.
 */
export async function shopifyFetch(query, variables = {}) {
  if (!client) {
    throw new Error('SHOPIFY_NOT_CONFIGURED');
  }

  const { data, errors } = await client.request(query, { variables });

  if (errors) {
    const message =
      errors.message ||
      errors.graphQLErrors?.map((e) => e.message).join('; ') ||
      'Shopify Storefront API error';
    throw new Error(message);
  }

  return data;
}

// Surface cartCreate/cartLinesAdd userErrors as thrown errors.
function assertNoUserErrors(userErrors, context) {
  if (userErrors && userErrors.length) {
    throw new Error(
      `${context}: ${userErrors.map((e) => e.message).join('; ')}`
    );
  }
}

// ---------------------------------------------------------------------------
// 2. Public API — products, collections, and cart
//    Each function uses a GraphQL query/mutation, normalises the result, and
//    wraps failures with context so the caller gets an actionable message.
// ---------------------------------------------------------------------------

/** Fetch the storefront catalog (best-selling first). Returns Product[]. */
export async function getAllProducts(first = 50) {
  try {
    const data = await shopifyFetch(PRODUCTS_QUERY, { first });
    return (data.products?.nodes || []).map(normalizeProduct);
  } catch (err) {
    console.error('[shopify] getAllProducts failed:', err.message);
    throw new Error(`Failed to load products: ${err.message}`);
  }
}

/** Fetch a single product by its handle. Returns Product | null. */
export async function getProductByHandle(handle) {
  if (!handle) throw new Error('getProductByHandle: handle is required');
  try {
    const data = await shopifyFetch(PRODUCT_BY_HANDLE_QUERY, { handle });
    return data.product ? normalizeProduct(data.product) : null;
  } catch (err) {
    console.error(`[shopify] getProductByHandle(${handle}) failed:`, err.message);
    throw new Error(`Failed to load product "${handle}": ${err.message}`);
  }
}

/** Fetch collections with a preview of their products. Returns Collection[]. */
export async function getCollections(first = 10, productsPerCollection = 12) {
  try {
    const data = await shopifyFetch(COLLECTIONS_QUERY, {
      first,
      productsPerCollection,
    });
    return (data.collections?.nodes || []).map(normalizeCollection);
  } catch (err) {
    console.error('[shopify] getCollections failed:', err.message);
    throw new Error(`Failed to load collections: ${err.message}`);
  }
}

/**
 * Create a new cart, optionally seeded with lines.
 * `lines` use Shopify's shape: [{ merchandiseId, quantity }].
 * Returns the normalised cart (includes `id` and `checkoutUrl`).
 */
export async function createCart(lines = []) {
  try {
    const data = await shopifyFetch(CART_CREATE_MUTATION, { lines });
    assertNoUserErrors(data.cartCreate?.userErrors, 'createCart');
    return normalizeCart(data.cartCreate?.cart);
  } catch (err) {
    console.error('[shopify] createCart failed:', err.message);
    throw new Error(`Failed to create cart: ${err.message}`);
  }
}

/**
 * Add a product variant to an existing cart.
 * Returns the updated normalised cart.
 */
export async function addToCart(cartId, variantId, quantity = 1) {
  if (!cartId) throw new Error('addToCart: cartId is required');
  if (!variantId) throw new Error('addToCart: variantId is required');
  try {
    const data = await shopifyFetch(CART_LINES_ADD_MUTATION, {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    });
    assertNoUserErrors(data.cartLinesAdd?.userErrors, 'addToCart');
    return normalizeCart(data.cartLinesAdd?.cart);
  } catch (err) {
    console.error('[shopify] addToCart failed:', err.message);
    throw new Error(`Failed to add item to cart: ${err.message}`);
  }
}

/**
 * Resolve the Shopify-hosted checkout URL for a cart.
 * Redirecting the browser here hands off to Shopify's checkout, where COD and
 * Razorpay are configured. Returns a URL string.
 */
export async function getCheckoutUrl(cartId) {
  if (!cartId) throw new Error('getCheckoutUrl: cartId is required');
  try {
    const data = await shopifyFetch(CART_QUERY, { id: cartId });
    if (!data.cart) {
      throw new Error('cart not found (it may have expired)');
    }
    return data.cart.checkoutUrl;
  } catch (err) {
    console.error('[shopify] getCheckoutUrl failed:', err.message);
    throw new Error(`Failed to get checkout URL: ${err.message}`);
  }
}

export { DOMAIN as SHOPIFY_DOMAIN };
