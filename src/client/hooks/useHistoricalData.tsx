import { CurrencyType } from "@coin-view/types";
import React from "react";

type PropsType = {
  currency: CurrencyType;
};

type HistoricalDataType = Record<string, Array<Array<number>>>;

export const useHistoricalData = ({ currency }: PropsType) => {
  const [dataMap, setDataMap] = React.useState<
    Record<CurrencyType, HistoricalDataType>
  >({ PLN: {}, USD: {} });

  const [loading, setLoading] = React.useState(false);

  const [current, setCurrent] = React.useState<string>();

  const getHistoricalData = React.useCallback(
    async (symbol: string) => {
      setCurrent(symbol);

      // dont refetch if already exists, unless we want to (e.g. in case of currency change)
      if (dataMap[currency][symbol]) {
        return;
      }

      setLoading(true);
      setCurrent(symbol);
      const result = await fetch(
        `/api/historical?symbols=${symbol}&currency=${currency}`
      );

      const data = (await result.json()) as HistoricalDataType;

      setDataMap((map) => ({
        ...map,
        [currency]: {
          ...map[currency],
          ...data,
        },
      }));
      setLoading(false);
    },
    [currency, dataMap]
  );

  React.useEffect(() => {
    if (current) {
      getHistoricalData(current);
    }
  }, [current, getHistoricalData]);

  return {
    getHistoricalData,
    loadingHistorical: loading,
    historicalData: dataMap,
    currentHistoricalData: current,
  };
};
