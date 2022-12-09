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
  last_updated: string;
}

export interface Quote {
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
  max_supply: number | null;
  last_updated: string;
  date_added: string;
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

export interface UrlsType {
  website: string[];
  twitter: any[];
  message_board: string[];
  chat: any[];
  facebook: any[];
  explorer: string[];
  reddit: string[];
  technical_doc: string[];
  source_code: string[];
  announcement: any[];
}

export interface CoinMetaType {
  id: number;
  name: string;
  symbol: string;
  category: string;
  description: string;
  slug: string;
  logo: string;
  subreddit: string;
  notice: string;
  tags: string[];
  "tag-names": string[];
  "tag-groups": string[];
  urls: UrlsType;
  platform?: any;
  date_added: Date;
  twitter_username: string;
  is_hidden: number;
  date_launched?: any;
  contract_address: any[];
  self_reported_circulating_supply?: any;
  self_reported_tags?: any;
  self_reported_market_cap?: any;
}
