import {
  isShopifyConfigured,
  shopifyFetch,
  getAllProducts,
  getProductByHandle,
  getCollections,
} from './shopify';
import { COLLECTION_BY_HANDLE_QUERY, PAGE_BY_HANDLE_QUERY } from './queries';
import { MOCK_PRODUCTS_DEDUPED, MOCK_COLLECTIONS } from './mockData';
import { normalizeProduct, normalizeCollection } from './normalize';

// This module is the UI's data layer: it delegates to the canonical Shopify
// functions in ./shopify when credentials are configured, and transparently
// falls back to the mock catalog otherwise so the storefront runs with no
// backend. The hooks in hooks/useCatalog consume these wrappers.

// Simulate a little latency for mock mode so loading states are visible.
const mockDelay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export async function fetchAllProducts() {
  if (!isShopifyConfigured) {
    await mockDelay();
    return MOCK_PRODUCTS_DEDUPED.map(normalizeProduct);
  }
  return getAllProducts();
}

export async function fetchProductByHandle(handle) {
  if (!isShopifyConfigured) {
    await mockDelay();
    const match = MOCK_PRODUCTS_DEDUPED.find((p) => p.handle === handle);
    return match ? normalizeProduct(match) : null;
  }
  return getProductByHandle(handle);
}

// Navbar, Footer and Home all want the collection list; cache the in-flight
// promise so one page load makes one request.
let collectionsCache;

export async function fetchCollections() {
  if (!collectionsCache) {
    collectionsCache = (async () => {
      if (!isShopifyConfigured) {
        await mockDelay();
        return MOCK_COLLECTIONS.map(normalizeCollection);
      }
      return getCollections();
    })().catch((err) => {
      collectionsCache = undefined; // let a later render retry
      throw err;
    });
  }
  return collectionsCache;
}

export async function fetchCollectionByHandle(handle) {
  if (!isShopifyConfigured) {
    await mockDelay();
    const match = MOCK_COLLECTIONS.find((c) => c.handle === handle);
    return match ? normalizeCollection(match) : null;
  }
  const data = await shopifyFetch(COLLECTION_BY_HANDLE_QUERY, {
    handle,
    first: 24,
  });
  return normalizeCollection(data.collection);
}

// Content pages (policies, About) live in Shopify Pages so copy is editable
// without a redeploy. No mock equivalent — demo mode returns null.
export async function fetchPage(handle) {
  if (!isShopifyConfigured) return null;
  const data = await shopifyFetch(PAGE_BY_HANDLE_QUERY, { handle });
  return data.page || null;
}
