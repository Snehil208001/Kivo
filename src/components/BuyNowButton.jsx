import { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';
import { buyNowUrl, MOCK_CHECKOUT_URL } from '../lib/cart';

/**
 * Express checkout: creates a fresh cart for `variantId` and sends the browser
 * straight to Shopify's hosted checkout (where COD + Razorpay are configured).
 * Does not touch the shopper's persistent cart.
 */
export default function BuyNowButton({
  variantId,
  quantity = 1,
  className = 'btn-pop btn-lg btn-block',
  label = 'Buy Now',
}) {
  const [loading, setLoading] = useState(false);
  const disabled = !variantId || loading;

  async function handleClick() {
    if (disabled) return;
    setLoading(true);
    try {
      const url = await buyNowUrl([{ merchandiseId: variantId, quantity }]);
      if (!url) throw new Error('No checkout URL returned');
      if (url === MOCK_CHECKOUT_URL) {
        setLoading(false);
        alert(
          'Demo mode: this would take you straight to Shopify checkout, where ' +
            'Cash on Delivery and Razorpay are handled by Shopify.\n\nConnect a ' +
            'store with published products in .env to enable real checkout.'
        );
        return;
      }
      window.location.href = url; // hand off to Shopify checkout
    } catch (err) {
      setLoading(false);
      alert(`Sorry, we couldn't start checkout: ${err.message}`);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={className}
      aria-label={label}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} fill="currentColor" />}
      <span>{loading ? 'Starting…' : !variantId ? 'Unavailable' : label}</span>
    </button>
  );
}
