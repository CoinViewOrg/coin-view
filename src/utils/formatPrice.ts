import { CurrencyType, Quote } from "@coin-view/types";

export const formatPrice = (quote: Quote, currency: CurrencyType) => {
  /** When we switch currency there is a moment where the price for requested currency is being fetched thus not available */
  const availableCurrency: CurrencyType = quote[currency]
    ? currency
    : currency === "PLN"
    ? "USD"
    : "PLN";

  const price = quote[availableCurrency]?.price || 0;
  const formatted = price > 1 ? price.toFixed(2) : price.toPrecision(3);

  return `${formatted} ${availableCurrency}`;
};
