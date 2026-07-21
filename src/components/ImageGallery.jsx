import { useState, useMemo } from 'react';
import { ZoomIn, X } from 'lucide-react';

// Shopify often stores the same asset twice (original + media copy with a
// trailing _uuid). Collapse those so the thumb strip stays usable on mobile.
function dedupeImages(images = []) {
  const seen = new Set();
  return images.filter((img) => {
    if (!img?.url) return false;
    const name = img.url.split('?')[0].split('/').pop() || '';
    const key =
      name.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
      )?.[0] || name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function ImageGallery({ images = [], title }) {
  const list = useMemo(() => {
    const unique = dedupeImages(images);
    return unique.length ? unique : [null];
  }, [images]);

  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div className="min-w-0">
      <div className="relative mx-auto aspect-[4/5] w-full max-h-[min(52vh,380px)] overflow-hidden rounded-2xl bg-primary-light/40 md:aspect-square md:max-h-none">
        {current ? (
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="group relative h-full w-full cursor-zoom-in"
            aria-label="Enlarge image"
          >
            <img
              src={current.url}
              alt={current.altText || title}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-accent shadow-card opacity-80 group-hover:opacity-100">
              <ZoomIn size={16} />
            </span>
          </button>
        ) : (
          <div className="flex h-full items-center justify-center text-accent/30">
            No image
          </div>
        )}
      </div>

      {list.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={img?.url || i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition md:h-[4.5rem] md:w-[4.5rem] ${
                i === active
                  ? 'border-primary'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active ? 'true' : undefined}
            >
              {img && (
                <img
                  src={img.url}
                  alt={img.altText || `${title} ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {zoomed && current && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-accent/80 p-4"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed product image"
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            className="absolute right-4 top-4 rounded-full bg-white/95 p-2 text-accent"
            aria-label="Close zoom"
          >
            <X size={20} />
          </button>
          <img
            src={current.url}
            alt={current.altText || title}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
