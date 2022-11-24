import { CurrencyType } from "@coin-view/types";
import React from "react";

export const useCurrencyToggle = (defaultCurrency: CurrencyType) => {
  const [currency, setCurrency] = React.useState<CurrencyType>(defaultCurrency);

  const toggleCurrency = React.useCallback(() => {
    setCurrency((c) => (c === "PLN" ? "USD" : "PLN"));
  }, []);

  return {
    currency,
    toggleCurrency,
  };
};
