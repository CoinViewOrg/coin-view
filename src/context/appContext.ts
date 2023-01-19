import { MarketType } from "@coin-view/markets";
import { CurrencyType } from "@coin-view/types";
import React from "react";

export const defaultCurrency = "PLN";

type AppContextType = {
  currency: CurrencyType;
  favorites: number[];
  thresholds: Record<number, number>;
  favoriteMarketName: MarketType | null;
};

export const AppContext = React.createContext<AppContextType>({
  currency: defaultCurrency,
  favorites: [],
  thresholds: {},
  favoriteMarketName: null,
});
