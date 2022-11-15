export interface CurrencyPriceData {
  price: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  market_cap_dominance: number;
  fully_diluted_market_cap: number;
  last_updated: Date;
}

interface Quote {
  USD?: CurrencyPriceData;
  PLN?: CurrencyPriceData;
}

export type CurrencyType = keyof Quote;

export interface CoinListItem {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  num_market_pairs: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  last_updated: Date;
  date_added: Date;
  tags: string[];
  platform?: any;
  self_reported_circulating_supply?: any;
  self_reported_market_cap?: any;
  quote: Quote;
}

export type SortingType =
  | "name"
  | "symbol"
  | "date_added"
  | "market_cap"
  | "market_cap_strict"
  | "price"
  | "circulating_supply"
  | "total_supply"
  | "max_supply"
  | "num_market_pairs"
  | "volume_24h"
  | "percent_change_1h"
  | "percent_change_24h"
  | "percent_change_7d"
  | "market_cap_by_total_supply_strict"
  | "volume_7d"
  | "volume_30";
