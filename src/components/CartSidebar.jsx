import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { MOCK_CHECKOUT_URL } from '../lib/cart';
import { CodBadge } from './TrustBadges';

export default function CartSidebar() {
  const {
    isOpen,
    closeCart,
    cart,
    loading,
    updateQuantity,
    removeItem,
  } = useCartStore();

  const lines = cart?.lines || [];
  const isEmpty = lines.length === 0;

  // Lock body scroll while the cart is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  function handleCheckout() {
    if (!cart?.checkoutUrl) return;
    // In mock mode there is no real checkout — explain what would happen.
    if (cart.checkoutUrl === MOCK_CHECKOUT_URL) {
      alert(
        'Demo mode: this would redirect to your secure Shopify checkout, where ' +
          'Cash on Delivery and Razorpay are handled by Shopify.\n\nConnect your ' +
          'Shopify store in .env to enable real checkout.'
      );
      return;
    }
    // Real Shopify hosted checkout (COD + Razorpay handled there).
    window.location.href = cart.checkoutUrl;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-accent/40 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-lift transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-accent/10 bg-white px-4 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-accent">
            <ShoppingBag size={20} />
            Your Cart
            {cart?.totalQuantity > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
                {cart.totalQuantity}
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="rounded-lg p-2 hover:bg-accent/5"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light">
              <ShoppingBag size={34} className="text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-accent">Your cart is empty</p>
              <p className="mt-1 text-sm text-accent/60">
                Add something you'll love.
              </p>
            </div>
            <button onClick={closeCart} className="btn-primary btn-lg">
              Start shopping
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-3">
              {lines.map((line) => (
                <li key={line.id} className="card flex gap-3 p-3">
                  <Link
                    to={line.handle ? `/products/${line.handle}` : '#'}
                    onClick={closeCart}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-primary-light/40"
                  >
                    {line.image && (
                      <img
                        src={line.image.url}
                        alt={line.image.altText || line.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-semibold text-accent">
                        {line.title}
                      </p>
                      <button
                        onClick={() => removeItem(line.id)}
                        className="shrink-0 rounded p-1 text-accent/40 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="mt-0.5 text-xs text-accent/50">
                      {line.priceFormatted} each
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg border border-accent/15">
                        <button
                          onClick={() =>
                            updateQuantity(line.id, line.quantity - 1)
                          }
                          className="px-2.5 py-1.5 text-accent/70 hover:text-primary"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-[28px] text-center text-sm font-semibold">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(line.id, line.quantity + 1)
                          }
                          className="px-2.5 py-1.5 text-accent/70 hover:text-primary"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-accent">
                        {line.lineTotalFormatted}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer / checkout */}
        {!isEmpty && (
          <div className="border-t border-accent/10 bg-white px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-accent/60">Subtotal</span>
              <span className="text-xl font-extrabold text-accent">
                {cart.subtotalFormatted}
              </span>
            </div>
            <p className="mb-3 text-center text-xs text-accent/50">
              Shipping &amp; taxes calculated at checkout
            </p>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary btn-lg btn-block"
            >
              <ShieldCheck size={18} />
              Secure Checkout
            </button>

            <div className="mt-3 flex items-center justify-center gap-3">
              <CodBadge />
              <span className="text-xs text-accent/50">7-Day Returns</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
