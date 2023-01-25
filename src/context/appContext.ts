import { MarketType } from "@coin-view/markets";
import { CurrencyType } from "@coin-view/types";
import React from "react";

export const defaultCurrency = "PLN";

export type ColorTheme = "dark" | "light";

type AppContextType = {
  currency: CurrencyType;
  favorites: number[];
  thresholds: Record<number, number>;
  notificationsMenuOpen: boolean;
  hamburgerMenuOpen: boolean;
  favoriteMarketName: MarketType | null;
  colorTheme: ColorTheme;
};

export const AppContext = React.createContext<AppContextType>({
  currency: defaultCurrency,
  favorites: [],
  thresholds: {},
  notificationsMenuOpen: false,
  hamburgerMenuOpen: false,
  favoriteMarketName: null,
  colorTheme: "light",
});
