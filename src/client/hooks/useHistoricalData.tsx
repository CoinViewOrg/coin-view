import { CurrencyType } from "@coin-view/types";
import React from "react";

type PropsType = {
  currency: CurrencyType;
};

export const useHistoricalData = ({ currency }: PropsType) => {
  const [dataMap, setDataMap] = React.useState<
    Record<string, Array<Array<number>>>
  >({});

  const [loading, setLoading] = React.useState(false);

  const [current, setCurrent] = React.useState<string>();

  const getHistoricalData = React.useCallback(
    async (symbols: string[]) => {
      setLoading(true);
      setCurrent(symbols[0]);
      const result = await fetch(
        `/api/historical?symbols=${symbols.join(",")}&currency=${currency}`
      );

      const data = await result.json();

      setDataMap((map) => ({ ...map, ...data }));
      setLoading(false);
    },
    [currency]
  );

  return {
    getHistoricalData,
    loadingHistorical: loading,
    historicalData: dataMap,
    currentHistoricalData: current,
  };
};
