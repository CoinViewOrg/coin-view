import { CurrencyType } from "@coin-view/types";

type BaseProps = {
  currency: CurrencyType;
  locale: string;
  cryptoSymbol: string;
  cryptoSlug: string;
};

const MARKET_URLS = {
  BINANCE: ({ locale, cryptoSymbol, currency }: BaseProps) =>
    `https://www.binance.com/${locale}/trade/${cryptoSymbol.toUpperCase()}_BUSD`,

  COINBASE: ({ currency, cryptoSymbol }: BaseProps) =>
    `https://exchange.coinbase.com/trade/${cryptoSymbol.toUpperCase()}-USD`,

  KRAKEN: ({ currency, cryptoSlug }: BaseProps) =>
    `https://www.kraken.com/prices/${cryptoSlug.toLowerCase()}?quote=${currency.toLowerCase()}`,

  KUCOIN: ({ cryptoSymbol, locale }: BaseProps) =>
    `https://www.kucoin.com/${locale.toLowerCase()}/price/${cryptoSymbol.toUpperCase()}`,

  BITSTAMP: ({ currency, cryptoSymbol }: BaseProps) =>
    `https://www.bitstamp.net/markets/${cryptoSymbol.toLowerCase()}/usd/`,
};

export const MARKET_NAMES = Object.keys(MARKET_URLS) as MarketType[];

export type MarketType = keyof typeof MARKET_URLS;

export const getMarketId = (market: MarketType) =>
  Object.keys(MARKET_URLS).findIndex((val) => val === market) + 1;

export const getMarketUrlByType = (market: MarketType, props: BaseProps) =>
  MARKET_URLS[market](props);

export const getMarketImageSrc = (market: MarketType) =>
  `/market_${market.toLowerCase()}.png`;
