import { CurrencyType } from "@coin-view/types";
import React from "react";

export const defaultCurrency = "PLN";

type AppContextType = {
  currency: CurrencyType;
  favorites: number[];
  thresholds: Record<number, number>;
  notificationsMenuOpen: boolean;
  hamburgerMenuOpen: boolean;
};

export const AppContext = React.createContext<AppContextType>({
  currency: defaultCurrency,
  favorites: [],
  thresholds: {},
  notificationsMenuOpen: false,
  hamburgerMenuOpen: false,
});
