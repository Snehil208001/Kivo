import { useState } from 'react';
import { ShoppingBag, Check, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

// Reusable add-to-cart control with brief success feedback.
export default function AddToCartButton({
  variantId,
  quantity = 1,
  className = 'btn-primary btn-lg btn-block',
  label = 'Add to Cart',
  openCartOnAdd = true,
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [status, setStatus] = useState('idle'); // idle | adding | added

  const disabled = !variantId || status === 'adding';

  async function handleClick() {
    if (disabled) return;
    setStatus('adding');
    await addItem(variantId, quantity, { open: openCartOnAdd });
    setStatus('added');
    setTimeout(() => setStatus('idle'), 1400);
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={className}
      aria-label={label}
    >
      {status === 'adding' && <Loader2 size={18} className="animate-spin" />}
      {status === 'added' && <Check size={18} />}
      {status === 'idle' && <ShoppingBag size={18} />}
      <span>
        {status === 'added' ? 'Added!' : !variantId ? 'Unavailable' : label}
      </span>
    </button>
  );
}
