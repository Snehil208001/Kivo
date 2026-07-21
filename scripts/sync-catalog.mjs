#!/usr/bin/env node
/**
 * Dropdash often pushes garbage product types ("Handbags, Bags & Wallets",
 * "T-Shirts", "Fitness & Wellness"). Our smart collections key off TYPE, so
 * wrong types land products in the wrong category — or nowhere.
 *
 * This script:
 *  1. Infers the correct KIVO type from the product title
 *  2. Updates productType (+ a clean category tag) when wrong
 *  3. Publishes anything missing from the Kivo Headless channel
 *
 * Usage (requires prior auth):
 *   npx shopify store auth --store wwxuka-jc.myshopify.com --scopes write_products,write_publications
 *   npm run sync:catalog
 */

import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const STORE = process.env.SHOPIFY_STORE || 'wwxuka-jc.myshopify.com';
const HEADLESS_PUBLICATION = 'gid://shopify/Publication/195550249113';
const IS_WIN = process.platform === 'win32';

// Canonical types that match our smart-collection rules in Shopify Admin.
const CANONICAL = new Set([
  'Cleaning',
  'Personal Care',
  'Eco',
  'Scented Candles',
  'Makeup',
  'Fashion',
  'Lifestyle',
  'Kitchen',
  'Gadgets',
  'Jewelry',
  'Fitness',
]);

// First match wins. Keep Cleaning / Personal Care near the top — Dropdash
// often mislabels those as fashion/bags/fitness.
const RULES = [
  {
    type: 'Cleaning',
    words: [
      'mop',
      'broom',
      'duster',
      'dustpan',
      'scrub',
      'sponge',
      'wiper',
      'cleaner',
      'cleaning',
      'brush with long',
      'dishwasher',
      'laundry',
      'detergent',
      'disinfectant',
      'vacuum',
      'squeegee',
      'toilet brush',
      'kitchen wipe',
    ],
  },
  {
    type: 'Scented Candles',
    words: ['candle', 'tealight', 'wax melt', 'diffuser oil', 'reed diffuser'],
  },
  {
    type: 'Makeup',
    words: [
      'lipstick',
      'mascara',
      'foundation',
      'concealer',
      'eyeliner',
      'eyeshadow',
      'blush',
      'makeup',
      'kajal',
      'compact powder',
    ],
  },
  {
    type: 'Personal Care',
    words: [
      'face mask',
      'facial',
      'serum',
      'moisturizer',
      'moisturiser',
      'skincare',
      'skin care',
      'shampoo',
      'conditioner',
      'soap',
      'toothpaste',
      'razor',
      'sunscreen',
      'lotion',
      'cream for',
      'acne',
      'pore',
      'toner',
      'cleanser',
      'body wash',
      'deodorant',
    ],
  },
  {
    type: 'Eco',
    words: ['bamboo', 'reusable', 'eco', 'biodegradable', 'compostable', 'plastic-free'],
  },
  {
    type: 'Kitchen',
    words: [
      'kitchen',
      'cutting board',
      'chopper',
      'peeler',
      'spatula',
      'utensil',
      'lunch box',
      'tiffin',
      'bottle organizer',
    ],
  },
  {
    type: 'Gadgets',
    words: [
      'charger',
      'phone stand',
      'led light',
      'earbuds',
      'power bank',
      'usb',
      'wireless mouse',
      'keyboard',
    ],
  },
  {
    type: 'Jewelry',
    words: ['earring', 'necklace', 'bracelet', 'pendant', 'ring ', ' anklet', 'jewellery', 'jewelry'],
  },
  {
    type: 'Fitness',
    words: ['yoga mat', 'resistance band', 'dumbbell', 'workout', 'fitness'],
  },
  {
    type: 'Fashion',
    words: ['t-shirt', 'tshirt', 'hoodie', 'jeans', 'dress', 'kurti', 'saree', 'socks'],
  },
];

function inferType(title = '', currentType = '') {
  const hay = `${title} ${currentType}`.toLowerCase();
  for (const rule of RULES) {
    if (rule.words.some((w) => hay.includes(w))) return rule.type;
  }
  // Keep an already-canonical type if we can't infer better.
  if (CANONICAL.has(currentType)) return currentType;
  return 'Lifestyle';
}

function shopifyExecute(query, variables, { mutate = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'kivo-sync-'));
  const qFile = join(dir, 'query.graphql');
  const vFile = join(dir, 'vars.json');
  writeFileSync(qFile, query);
  writeFileSync(vFile, JSON.stringify(variables ?? {}));

  const flags = [
    'shopify',
    'store',
    'execute',
    '--store',
    STORE,
    '--json',
    '--query-file',
    `"${qFile}"`,
    '--variable-file',
    `"${vFile}"`,
  ];
  if (mutate) flags.push('--allow-mutations');

  const cmd = `npx ${flags.join(' ')}`;

  try {
    const out = execSync(cmd, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: IS_WIN,
      env: {
        ...process.env,
        SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:1|p:cursor',
        SHOPIFY_CLI_AGENT_IDS: 's:kivo|r:sync-catalog|i:1',
      },
    });
    // CLI prints progress lines before the JSON object.
    const start = out.indexOf('{');
    if (start === -1) throw new Error(`No JSON in CLI output:\n${out}`);
    return JSON.parse(out.slice(start));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const LIST_QUERY = `
{
  products(first: 100) {
    nodes {
      id
      title
      handle
      productType
      tags
      resourcePublicationsV2(first: 10) {
        nodes {
          isPublished
          publication { id name }
        }
      }
    }
  }
}
`;

const UPDATE_MUTATION = `
mutation UpdateProduct($input: ProductInput!) {
  productUpdate(input: $input) {
    userErrors { field message }
    product { id title handle productType }
  }
}
`;

const PUBLISH_MUTATION = `
mutation PublishToHeadless($id: ID!, $publicationId: ID!) {
  publishablePublish(id: $id, input: [{ publicationId: $publicationId }]) {
    userErrors { field message }
    publishable {
      ... on Product { id title handle }
    }
  }
}
`;

function isOnHeadless(product) {
  return (product.resourcePublicationsV2?.nodes || []).some(
    (n) => n.isPublished && n.publication?.id === HEADLESS_PUBLICATION
  );
}

function cleanTags(tags = [], type) {
  const typeSlugs = [...CANONICAL].map((c) =>
    c.toLowerCase().replace(/\s+/g, '-')
  );
  const kept = (tags || []).filter(
    (t) =>
      t &&
      !/^DropDash\./i.test(t) &&
      t.toLowerCase() !== 'dropdash' &&
      !typeSlugs.includes(t.toLowerCase())
  );
  const typeTag = type.toLowerCase().replace(/\s+/g, '-');
  return [...new Set([...kept, typeTag, 'dropdash'])].join(', ');
}

async function main() {
  console.log(`Syncing catalog on ${STORE}…`);
  const data = shopifyExecute(LIST_QUERY);
  const products = data.products?.nodes || [];
  console.log(`Found ${products.length} product(s).\n`);

  let typeFixes = 0;
  let publishes = 0;

  for (const p of products) {
    const inferred = inferType(p.title, p.productType);
    const needsType = p.productType !== inferred;
    const hasGarbageTag = (p.tags || []).some((t) => /^DropDash\./i.test(t));
    const needsTags = hasGarbageTag;
    const needsPublish = !isOnHeadless(p);

    if (!needsType && !needsTags && !needsPublish) {
      console.log(`✓  ${p.handle}  [${p.productType}]`);
      continue;
    }

    if (needsType || needsTags) {
      const result = shopifyExecute(
        UPDATE_MUTATION,
        {
          input: {
            id: p.id,
            productType: inferred,
            tags: cleanTags(p.tags, inferred),
          },
        },
        { mutate: true }
      );
      const errs = result.productUpdate?.userErrors || [];
      if (errs.length) {
        console.error(`✗  update failed for ${p.handle}:`, errs);
      } else {
        if (needsType) {
          typeFixes += 1;
          console.log(`→  ${p.handle}: "${p.productType}" → "${inferred}"`);
        } else {
          console.log(`↛  ${p.handle}: cleaned Dropdash tags`);
        }
      }
    }

    if (needsPublish) {
      const result = shopifyExecute(
        PUBLISH_MUTATION,
        { id: p.id, publicationId: HEADLESS_PUBLICATION },
        { mutate: true }
      );
      const errs = result.publishablePublish?.userErrors || [];
      if (errs.length) {
        console.error(`✗  publish failed for ${p.handle}:`, errs);
      } else {
        publishes += 1;
        console.log(`↑  ${p.handle} published to Kivo Headless`);
      }
    }
  }

  console.log(`\nDone. Type fixes: ${typeFixes}. Headless publishes: ${publishes}.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
