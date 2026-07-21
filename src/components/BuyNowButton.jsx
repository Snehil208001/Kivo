import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

/**
 * Buy Now: creates a fresh cart for this variant, then goes to /checkout so
 * phone + address are collected and prefilled into Shopify hosted checkout
 * (COD + Razorpay stay on Shopify).
 */
export default function BuyNowButton({
  variantId,
  quantity = 1,
  className = 'btn-pop btn-lg btn-block',
  label = 'Buy Now',
}) {
  const navigate = useNavigate();
  const startBuyNow = useCartStore((s) => s.startBuyNow);
  const [loading, setLoading] = useState(false);
  const disabled = !variantId || loading;

  async function handleClick() {
    if (disabled) return;
    setLoading(true);
    try {
      await startBuyNow(variantId, quantity);
      navigate('/checkout');
    } catch (err) {
      setLoading(false);
      alert(`Sorry, we couldn't start checkout: ${err.message}`);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={className}
      aria-label={label}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Zap size={18} fill="currentColor" />
      )}
      <span>
        {loading ? 'Starting…' : !variantId ? 'Unavailable' : label}
      </span>
    </button>
  );
}
