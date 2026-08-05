import { Values } from './helpers';

export const AssetTypeEnum = {
  Cash: 'CASH',
  Gold: 'GOLD',
  BearerBond: 'BEARER_BOND',
  Crypto: 'CRYPTO',
  Goods: 'GOODS',
} as const;

export type AssetType = Values<typeof AssetTypeEnum>;

export type Currency = 'EUR' | 'USD';

/**
 * Notes and coin. The only takings that arrive already denominated in money,
 * and even then not always in the same money.
 */
export type CashTakings = {
  id: string;
  assetType: 'CASH';
  amount: string; // "12450.00"
  currency: Currency;
};

/**
 * Bullion. Weight, plus whatever the market said per gram at the moment
 * somebody wrote it down.
 */
export type GoldTakings = {
  id: string;
  assetType: 'GOLD';
  grams: string; // "1840.500"
  purity: string; // "0.999"
  spotPricePerGram: string; // "71.42"
  spotPriceCurrency: Currency;
  spotPriceAt: string; // ISO, i.e. "2024-04-02T09:15:00.000Z"
};

/**
 * Paper worth whatever is printed on it, to whoever is holding it.
 * `faceValue` is what it says. `buyerQuote` is what the fence will actually pay.
 */
export type BearerBondTakings = {
  id: string;
  assetType: 'BEARER_BOND';
  serial: string; // "BB-4471-K"
  faceValue: string; // "250000.00"
  faceValueCurrency: Currency;
  buyerQuote: string; // "100000.00" — the fence pays 40% of face
  buyerQuoteCurrency: Currency;
  quotedAt: string; // ISO
};

/**
 * Keys, seed phrases, a laptop that was logged in. `quotedRate` is a rate
 * somebody pulled off an exchange at `quotedAt`, when they bothered.
 */
export type CryptoTakings = {
  id: string;
  assetType: 'CRYPTO';
  symbol: 'BTC' | 'ETH' | 'XMR';
  units: string; // "0.84210000"
  quotedRate: string | null; // rate per unit, null when nobody looked it up
  quoteCurrency: Currency | null;
  quotedAt: string | null; // ISO
};

/**
 * Watches, paintings, a forklift. `appraisal` is one person's opinion.
 * Nobody has offered to buy it.
 */
export type GoodsTakings = {
  id: string;
  assetType: 'GOODS';
  description: string; // "14x wristwatch, assorted"
  appraisal: string; // "38000.00"
  appraisalCurrency: Currency;
  appraisedBy: string; // "Barliman, insured value, not an offer"
};

export type TakingsEntry =
  | CashTakings
  | GoldTakings
  | BearerBondTakings
  | CryptoTakings
  | GoodsTakings;
