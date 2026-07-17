# KIVO — Storefront

A mobile-first ecommerce storefront for **KIVO** (smart cleaning, personal care & eco essentials) built with **React**, **Vite**, and **Tailwind CSS**. Powered entirely by the **Shopify Storefront API** with a built-in offline demo mode.

[GitHub Repository](https://github.com/Snehil208001/Kivo)


## Stack

- **React 18** + **Vite 6**
- **Tailwind CSS** (custom KIVO theme)
- **React Router** (client-side routing)
- **@shopify/storefront-api-client** (GraphQL Storefront API)
- **Zustand** — used **only** for local cart UI state
- **lucide-react** — icons
- **axios** — available for any auxiliary HTTP needs

### Brand colors

| Token | Hex | Use |
| --- | --- | --- |
| `primary` | `#00A86B` | Buttons, accents, highlights |
| `accent` | `#111827` | Text, dark surfaces |
| `surface` | `#F9FAFB` | Page background |

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

Out of the box it starts in **demo mode** using a built-in mock catalog, so you can develop the UI without any Shopify credentials. A banner indicates when demo mode is active.

## Connecting Shopify

1. In your Shopify admin: **Settings → Apps and sales channels → Develop apps → Create an app**.
2. Enable the **Storefront API** and grant read access to products, collections, and cart (checkout) scopes.
3. Copy the **Storefront API access token**.
4. Fill in `.env` (copy from `.env.example`):

```env
VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token
VITE_SHOPIFY_API_VERSION=2025-01
VITE_WHATSAPP_NUMBER=919999999999
```

Restart the dev server. Once valid credentials are detected, the app fetches live products, collections, and carts from Shopify automatically — no code changes needed.

> `.env` is gitignored. Never commit real credentials.

## How checkout works

- The cart is a real **Shopify Cart** (created and mutated via the Cart API). The cart ID is persisted in `localStorage` so it survives reloads.
- Clicking **Secure Checkout** redirects to the Shopify-hosted `checkoutUrl`.
- **COD and Razorpay are configured in Shopify** and appear on that hosted checkout — the frontend does not implement any payment logic.
- In demo mode, the checkout button explains that it would redirect to Shopify (there's no real store to send you to).

## Routes

| Path | Page |
| --- | --- |
| `/` | Homepage — hero, collections, bestsellers |
| `/shop` | All products with filter + sort |
| `/collections/:handle` | A single collection (`cleaning`, `personal-care`, `eco`, …) |
| `/products/:handle` | Product detail — gallery, price, COD badge, description |
| `/lp/spin-mop` | Ad landing page (no nav, conversion-focused) |
| `/lp/face-roller` | Ad landing page |
| `/lp/eco-bundle` | Ad landing page |

## Project structure

```
src/
├── lib/
│   ├── shopify.js      # Storefront API client + config detection
│   ├── queries.js      # GraphQL queries & cart mutations
│   ├── api.js          # Product/collection fetchers (with mock fallback)
│   ├── cart.js         # Cart API + client-side mock cart engine
│   ├── normalize.js    # Flatten Shopify shapes for the UI
│   ├── mockData.js     # Demo catalog (SVG placeholder images)
│   └── config.js       # Trust points, WhatsApp, etc.
├── store/
│   └── cartStore.js    # Zustand — local cart UI state only
├── hooks/
│   └── useCatalog.js   # useProducts / useCollections / useProduct / useCollection
├── components/         # Navbar, Footer, ProductCard, CartSidebar, LandingPage, …
├── pages/
│   ├── Home / Shop / CollectionPage / Product / NotFound
│   └── lp/             # SpinMop, FaceRoller, EcoBundle
├── App.jsx             # Routes
└── main.jsx            # Entry
```

## Notes

- **Mobile-first**: every layout is designed for small screens first, with trust badges (COD, 7-day returns, ships in 24h, WhatsApp) throughout.
- **Mock images** are generated inline as branded SVG data URIs, so the demo renders with zero network dependency. Live product images come straight from Shopify.
- To change which collections appear on the homepage, edit `FEATURED_COLLECTIONS` in `src/lib/config.js` and ensure matching collection handles exist in Shopify.

## Build

```bash
npm run build     # production build to /dist
npm run preview   # preview the production build
```
