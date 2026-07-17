import { useState } from 'react';
import { X, Info } from 'lucide-react';
import { isShopifyConfigured } from '../lib/shopify';

// Dev-only notice shown when running on mock data so it's obvious the store
// isn't connected to a real Shopify backend yet. Renders nothing once
// credentials are set.
export default function ShopifyBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (isShopifyConfigured || dismissed) return null;

  return (
    <div className="bg-amber-50 text-amber-900">
      <div className="container-page flex items-center gap-2 py-2 text-xs sm:text-[13px]">
        <Info size={15} className="shrink-0" />
        <p className="flex-1">
          <span className="font-semibold">Demo mode:</span> showing mock products.
          Add your Shopify domain &amp; Storefront token to{' '}
          <code className="rounded bg-amber-100 px-1">.env</code> to go live.
        </p>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="rounded p-1 hover:bg-amber-100"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
