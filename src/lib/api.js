import {
  isShopifyConfigured,
  shopifyFetch,
  getAllProducts,
  getProductByHandle,
  getCollections,
} from './shopify';
import { COLLECTION_BY_HANDLE_QUERY } from './queries';
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

export async function fetchCollections() {
  if (!isShopifyConfigured) {
    await mockDelay();
    return MOCK_COLLECTIONS.map(normalizeCollection);
  }
  return getCollections();
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
