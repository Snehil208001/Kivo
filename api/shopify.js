// Same-origin proxy for the Shopify Storefront API.
//
// The browser POSTs { query, variables } here instead of calling
// *.myshopify.com directly, so client-side network/DNS/ad-block filters that
// target Shopify can't break the storefront. This runs on Vercel's network,
// which reaches Shopify fine. Reuses the existing VITE_SHOPIFY_* env vars
// (Vercel exposes all env vars to functions regardless of the VITE_ prefix).

export async function shopifyForward({ query, variables }) {
  const domain = (process.env.VITE_SHOPIFY_DOMAIN || '')
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');
  const version = process.env.VITE_SHOPIFY_API_VERSION || '2026-07';
  const token = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

  if (!domain || !token) {
    throw new Error(
      'Missing VITE_SHOPIFY_DOMAIN or VITE_SHOPIFY_STOREFRONT_TOKEN'
    );
  }

  const r = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  return { status: r.status, body: await r.text() };
}

// Web-standard handler (Vercel Functions). Avoids Node req/res body helpers,
// which were throwing "Invalid JSON" on this Vite project.
export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { errors: [{ message: 'Request body must be JSON' }] },
      { status: 400 }
    );
  }

  try {
    const { status, body } = await shopifyForward(payload || {});
    return new Response(body, {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return Response.json(
      { errors: [{ message: `Shopify proxy failed: ${e.message}` }] },
      { status: 502 }
    );
  }
}
