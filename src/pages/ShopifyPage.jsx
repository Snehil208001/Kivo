import { useParams } from 'react-router-dom';
import { usePage } from '../hooks/useCatalog';
import { whatsappLink } from '../lib/config';

// Renders a Shopify content page (shipping-policy, refund-policy, privacy-policy,
// terms-of-service, about) by handle. Copy is edited in Shopify admin.
export default function ShopifyPage() {
  const { handle } = useParams();
  const { data: page, loading } = usePage(handle);

  return (
    <div className="container-page max-w-3xl py-10">
      {loading ? (
        <div className="space-y-3">
          <div className="h-9 w-1/2 animate-pulse rounded bg-accent/5" />
          <div className="h-64 w-full animate-pulse rounded bg-accent/5" />
        </div>
      ) : !page ? (
        <div className="py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-accent">
            Page not found
          </h1>
          <p className="mt-2 text-accent/60">
            This page isn't available yet. Need help? We're on WhatsApp.
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-lg mt-5"
          >
            Chat on WhatsApp
          </a>
        </div>
      ) : (
        <article>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
            {page.title}
          </h1>
          <div
            className="rte mt-6"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        </article>
      )}
    </div>
  );
}
