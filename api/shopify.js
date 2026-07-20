// Same-origin proxy for the Shopify Storefront API.
//
// The browser POSTs { query, variables } here instead of calling
// *.myshopify.com directly, so client-side network/DNS/ad-block filters that
// target Shopify can't break the storefront. This runs on Vercel's network,
// which reaches Shopify fine. Reuses the existing VITE_SHOPIFY_* env vars.

/** Take the first non-empty line — Vercel env values sometimes get pasted with duplicates/newlines. */
function cleanEnv(value, fallback = '') {
  return (
    String(value || '')
      .split(/[\r\n]+/)
      .map((s) => s.trim())
      .find(Boolean) || fallback
  );
}

function shopifyConfig() {
  const domain = cleanEnv(process.env.VITE_SHOPIFY_DOMAIN)
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');
  const version = cleanEnv(process.env.VITE_SHOPIFY_API_VERSION, '2026-07');
  const token = cleanEnv(process.env.VITE_SHOPIFY_STOREFRONT_TOKEN);
  return { domain, version, token };
}

export async function shopifyForward({ query, variables }) {
  const { domain, version, token } = shopifyConfig();

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

async function handlePost(request) {
  const raw = await request.text();
  let payload;
  try {
    payload = raw ? JSON.parse(raw) : {};
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

async function handleGet() {
  const { domain, version, token } = shopifyConfig();
  return Response.json({
    ok: Boolean(domain && token),
    domain: domain || null,
    version,
    hasToken: Boolean(token),
  });
}

export default {
  async fetch(request) {
    if (request.method === 'GET') return handleGet();
    if (request.method === 'POST') return handlePost(request);
    return Response.json({ errors: [{ message: 'POST only' }] }, { status: 405 });
  },
};
