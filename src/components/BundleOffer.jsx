import { useMemo, useState } from 'react';
import { Plus, Check, Tag, ShoppingBag, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatMoney } from '../lib/normalize';

const BUNDLE_DISCOUNT = 0.1; // "Buy 2, get 10% off"

// "Frequently bought together" bundle. The current product is always included;
// up to two same-collection suggestions can be toggled. Buying 2+ items unlocks
// 10% off the combined total.
export default function BundleOffer({ product, suggestions = [] }) {
  const addItems = useCartStore((s) => s.addItems);
  const loading = useCartStore((s) => s.loading);

  const items = useMemo(
    () => [product, ...suggestions].filter(Boolean),
    [product, suggestions]
  );

  // Selection: current product locked on; suggestions default on.
  const [selected, setSelected] = useState(() =>
    Object.fromEntries(items.map((p) => [p.id, true]))
  );

  if (items.length < 2) return null; // nothing to bundle

  const currency = product.currencyCode || 'INR';
  const chosen = items.filter((p) => selected[p.id]);
  const subtotal = chosen.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);
  const qualifies = chosen.length >= 2;
  const discount = qualifies ? subtotal * BUNDLE_DISCOUNT : 0;
  const total = subtotal - discount;

  function toggle(id) {
    if (id === product.id) return; // current product stays in the bundle
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function addBundle() {
    addItems(chosen.map((p) => ({ merchandiseId: p.defaultVariantId, quantity: 1 })));
  }

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border-2 border-primary/20 bg-white">
      <div className="flex items-center gap-2 bg-primary-light px-5 py-3">
        <Tag size={18} className="text-primary-deep" />
        <p className="font-display text-lg font-extrabold text-primary-deep">
          Buy 2, Get 10% Off
        </p>
        <span className="badge ml-auto bg-pop text-white">Bundle & save</span>
      </div>

      <div className="p-5">
        {/* Product row */}
        <div className="flex flex-wrap items-stretch gap-3">
          {items.map((p, i) => {
            const isCurrent = p.id === product.id;
            const on = selected[p.id];
            return (
              <div key={p.id} className="flex items-center gap-3">
                <label
                  className={`relative flex w-32 cursor-pointer flex-col rounded-2xl border-2 p-2 transition ${
                    on ? 'border-primary bg-primary-light/40' : 'border-accent/10 bg-white opacity-70'
                  } ${isCurrent ? 'cursor-default' : ''}`}
                >
                  <span
                    className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border ${
                      on ? 'border-primary bg-primary text-white' : 'border-accent/20 bg-white'
                    }`}
                  >
                    {on && <Check size={13} />}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    disabled={isCurrent}
                    onChange={() => toggle(p.id)}
                  />
                  <div className="aspect-square overflow-hidden rounded-xl bg-primary-light">
                    {p.featuredImage && (
                      <img
                        src={p.featuredImage.url}
                        alt={p.featuredImage.altText || p.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs font-semibold text-accent">
                    {isCurrent ? 'This item' : p.title}
                  </p>
                  <p className="text-xs font-bold text-accent">{p.priceFormatted}</p>
                </label>

                {i < items.length - 1 && (
                  <Plus size={18} className="shrink-0 text-accent/30" />
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-5 flex flex-col gap-3 border-t border-accent/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-extrabold text-accent">
                {formatMoney(total, currency)}
              </span>
              {qualifies && (
                <>
                  <span className="text-sm text-accent/40 line-through">
                    {formatMoney(subtotal, currency)}
                  </span>
                  <span className="badge bg-primary-light text-primary-deep">
                    Save {formatMoney(discount, currency)}
                  </span>
                </>
              )}
            </div>
            <p className="mt-0.5 text-xs text-accent/50">
              {qualifies
                ? `${chosen.length} items · 10% bundle discount applied at checkout`
                : 'Add one more item to unlock 10% off'}
            </p>
          </div>

          <button
            onClick={addBundle}
            disabled={loading || chosen.length === 0}
            className="btn-primary btn-lg shrink-0"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ShoppingBag size={18} />
            )}
            Add {chosen.length} to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
