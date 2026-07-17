import { useState } from 'react';

export default function ImageGallery({ images = [], title }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [null];
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div>
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-primary-light/40">
        {current ? (
          <img
            src={current.url}
            alt={current.altText || title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-accent/30">
            No image
          </div>
        )}
      </div>

      {list.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === active ? 'border-primary' : 'border-transparent opacity-70'
              }`}
              aria-label={`View image ${i + 1}`}
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
    </div>
  );
}
