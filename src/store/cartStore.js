import { create } from 'zustand';
import {
  createCart,
  getCart,
  addLines,
  updateLines,
  removeLines,
  updateDiscountCodes,
  prepareCartForCheckout,
} from '../lib/cart';
import { isShopifyConfigured } from '../lib/shopify';

// Zustand is used ONLY for local cart UI state (sidebar open/close, optimistic
// loading flags) and to mirror the Shopify cart. Checkout itself is delegated
// to Shopify's hosted checkout via `cart.checkoutUrl` — no checkout logic here.

const CART_ID_KEY = 'kivo_cart_id';

function readCartId() {
  try {
    return localStorage.getItem(CART_ID_KEY) || null;
  } catch {
    return null;
  }
}

function persistCartId(id) {
  try {
    if (id) localStorage.setItem(CART_ID_KEY, id);
    else localStorage.removeItem(CART_ID_KEY);
  } catch {
    /* ignore */
  }
}

export const useCartStore = create((set, get) => ({
  cart: null,
  cartId: readCartId(),
  isOpen: false,
  loading: false,
  error: null,
  hydrated: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  // Load an existing cart on app start (or reset a stale/expired one).
  hydrate: async () => {
    const id = get().cartId;
    if (!id && isShopifyConfigured) {
      set({ hydrated: true });
      return;
    }
    try {
      const cart = await getCart(id);
      if (cart) {
        set({ cart, cartId: cart.id, hydrated: true });
        persistCartId(cart.id);
      } else {
        // Cart expired on Shopify's side — clear it.
        persistCartId(null);
        set({ cart: null, cartId: null, hydrated: true });
      }
    } catch {
      persistCartId(null);
      set({ cart: null, cartId: null, hydrated: true });
    }
  },

  addItem: async (variantId, quantity = 1, { open = true } = {}) => {
    if (!variantId) return;
    set({ loading: true, error: null });
    try {
      const { cartId } = get();
      let cart;
      if (cartId) {
        cart = await addLines(cartId, [{ merchandiseId: variantId, quantity }]);
      } else {
        cart = await createCart([{ merchandiseId: variantId, quantity }]);
      }
      persistCartId(cart?.id);
      set({ cart, cartId: cart?.id, loading: false, isOpen: open });
    } catch (err) {
      set({ loading: false, error: err.message || 'Could not add to cart' });
    }
  },

  // Add several variants in one go (used by the bundle offer). `lines` are
  // { merchandiseId, quantity } objects.
  addItems: async (lines, { open = true } = {}) => {
    const clean = (lines || []).filter((l) => l.merchandiseId);
    if (!clean.length) return;
    set({ loading: true, error: null });
    try {
      const { cartId } = get();
      const cart = cartId
        ? await addLines(cartId, clean)
        : await createCart(clean);
      persistCartId(cart?.id);
      set({ cart, cartId: cart?.id, loading: false, isOpen: open });
    } catch (err) {
      set({ loading: false, error: err.message || 'Could not add bundle' });
    }
  },

  updateQuantity: async (lineId, quantity) => {
    const { cartId } = get();
    if (!cartId) return;
    set({ loading: true, error: null });
    try {
      const cart =
        quantity <= 0
          ? await removeLines(cartId, [lineId])
          : await updateLines(cartId, [{ id: lineId, quantity }]);
      set({ cart, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message || 'Could not update cart' });
    }
  },

  removeItem: async (lineId) => {
    const { cartId } = get();
    if (!cartId) return;
    set({ loading: true, error: null });
    try {
      const cart = await removeLines(cartId, [lineId]);
      set({ cart, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message || 'Could not remove item' });
    }
  },

  // Apply a discount code. Returns true if Shopify accepted it (i.e. the code
  // is now in the cart's applicable codes), false otherwise.
  applyDiscount: async (code) => {
    const { cartId } = get();
    if (!cartId || !code) return false;
    set({ loading: true });
    try {
      const cart = await updateDiscountCodes(cartId, [code]);
      set({ cart, loading: false });
      return (cart?.appliedCodes || []).length > 0;
    } catch {
      set({ loading: false });
      return false;
    }
  },

  removeDiscount: async () => {
    const { cartId } = get();
    if (!cartId) return;
    set({ loading: true });
    try {
      const cart = await updateDiscountCodes(cartId, []);
      set({ cart, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  /**
   * Prefill Shopify cart with contact + shipping address, then return the
   * hosted checkout URL. Throws on validation/API errors.
   */
  prepareCheckout: async (details) => {
    const { cartId, cart } = get();
    if (!cartId || !cart?.totalQuantity) {
      throw new Error('Your cart is empty');
    }
    set({ loading: true, error: null });
    try {
      const updated = await prepareCartForCheckout(cartId, details);
      set({ cart: updated, loading: false });
      return updated?.checkoutUrl || cart.checkoutUrl;
    } catch (err) {
      set({
        loading: false,
        error: err.message || 'Could not prepare checkout',
      });
      throw err;
    }
  },

  /**
   * Buy Now: create a fresh cart for this variant only, then the UI navigates
   * to /checkout (same address → Shopify prefill flow as Secure Checkout).
   */
  startBuyNow: async (variantId, quantity = 1) => {
    if (!variantId) throw new Error('This product is unavailable');
    set({ loading: true, error: null, isOpen: false });
    try {
      const cart = await createCart([
        { merchandiseId: variantId, quantity: Math.max(1, quantity) },
      ]);
      persistCartId(cart?.id);
      set({ cart, cartId: cart?.id, loading: false });
      return cart;
    } catch (err) {
      set({
        loading: false,
        error: err.message || 'Could not start Buy Now',
      });
      throw err;
    }
  },

  itemCount: () => get().cart?.totalQuantity || 0,
}));
