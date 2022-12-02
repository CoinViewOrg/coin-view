import { CurrencyType } from "@coin-view/types";
import React from "react";
import { usePrevious } from "./usePrevious";

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
    async (symbol: string, force: boolean) => {
      setCurrent(symbol);

      if (dataMap[symbol] && !force) {
        return;
      }

      setLoading(true);
      setCurrent(symbol);
      const result = await fetch(
        `/api/historical?symbols=${symbol}&currency=${currency}`
      );

      const data = await result.json();

      setDataMap((map) => ({ ...map, ...data }));
      setLoading(false);
    },
    [currency, dataMap]
  );

  const previousCurrency = usePrevious(currency);

  React.useEffect(() => {
    console.log('EFFECT')
    if (current && previousCurrency !== currency) {
      getHistoricalData(current, true);
    }
  }, [currency, current, previousCurrency, getHistoricalData]);

  return {
    getHistoricalData,
    loadingHistorical: loading,
    historicalData: dataMap,
    currentHistoricalData: current,
  };
};
