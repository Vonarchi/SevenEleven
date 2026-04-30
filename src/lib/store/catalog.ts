export type CheckoutItemKind = "coin_pack" | "vip";

export type CheckoutCatalogItem = {
  key: string;
  kind: CheckoutItemKind;
  name: string;
  priceLabel: string;
  coinAmount?: number;
  envPriceKey: string;
  mode: "payment" | "subscription";
};

export const checkoutCatalog: readonly CheckoutCatalogItem[] = [
  {
    key: "starter",
    kind: "coin_pack",
    name: "Starter pack",
    priceLabel: "$4.99",
    coinAmount: 500,
    envPriceKey: "STRIPE_PRICE_STARTER_PACK",
    mode: "payment",
  },
  {
    key: "popular",
    kind: "coin_pack",
    name: "Popular pack",
    priceLabel: "$9.99",
    coinAmount: 1500,
    envPriceKey: "STRIPE_PRICE_POPULAR_PACK",
    mode: "payment",
  },
  {
    key: "high-roller",
    kind: "coin_pack",
    name: "High roller pack",
    priceLabel: "$19.99",
    coinAmount: 4000,
    envPriceKey: "STRIPE_PRICE_HIGH_ROLLER_PACK",
    mode: "payment",
  },
  {
    key: "vip-monthly",
    kind: "vip",
    name: "VIP membership",
    priceLabel: "Monthly",
    envPriceKey: "STRIPE_PRICE_VIP_MONTHLY",
    mode: "subscription",
  },
];

export function getCheckoutItem(key: string) {
  return checkoutCatalog.find((item) => item.key === key) ?? null;
}

export function getStripePriceId(item: CheckoutCatalogItem) {
  return process.env[item.envPriceKey] ?? null;
}
