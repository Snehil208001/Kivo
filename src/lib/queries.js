// GraphQL fragments and queries for the Shopify Storefront API.

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductCard on Product {
    id
    title
    handle
    description
    descriptionHtml
    tags
    availableForSale
    productType
    createdAt
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 8) {
      nodes {
        url
        altText
        width
        height
      }
    }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        image {
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Products($first: Int = 50) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductCard
    }
  }
`;

export const COLLECTIONS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Collections($first: Int = 10, $productsPerCollection: Int = 12) {
    collections(first: $first, sortKey: TITLE) {
      nodes {
        id
        title
        handle
        description
        image {
          url
          altText
        }
        products(first: $productsPerCollection) {
          nodes {
            ...ProductCard
          }
        }
      }
    }
  }
`;

export const COLLECTION_BY_HANDLE_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query CollectionByHandle($handle: String!, $first: Int = 24) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: $first) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
`;

// --- Content pages (Shipping/Refund/Privacy/Terms/About) ---

export const PAGE_BY_HANDLE_QUERY = /* GraphQL */ `
  query PageByHandle($handle: String!) {
    page(handle: $handle) {
      id
      title
      handle
      body
    }
  }
`;

// --- Cart mutations ---

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    discountCodes {
      code
      applicable
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              url
              altText
            }
            price {
              amount
              currencyCode
            }
            product {
              id
              title
              handle
            }
          }
        }
      }
    }
  }
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_QUERY = /* GraphQL */ `
  ${CART_FRAGMENT}
  query Cart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
`;

export const CART_DISCOUNT_CODES_UPDATE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_BUYER_IDENTITY_UPDATE_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartBuyerIdentityUpdate(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
  ) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_DELIVERY_ADDRESSES_ADD_MUTATION = /* GraphQL */ `
  ${CART_FRAGMENT}
  mutation CartDeliveryAddressesAdd(
    $cartId: ID!
    $addresses: [CartSelectableAddressInput!]!
  ) {
    cartDeliveryAddressesAdd(cartId: $cartId, addresses: $addresses) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;
