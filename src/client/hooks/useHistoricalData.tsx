import { AppContext } from "@coin-view/context";
import { CurrencyType } from "@coin-view/types";
import React from "react";

export type HistoricalDataType = Record<string, Array<Array<number>>>;

export const useHistoricalData = () => {
  const { currency } = React.useContext(AppContext);

  const [dataMap, setDataMap] = React.useState<
    Record<CurrencyType, HistoricalDataType>
  >({ PLN: {}, USD: {} });

  const [loading, setLoading] = React.useState(false);

  const [current, setCurrent] = React.useState<string>();

  const getHistoricalData = React.useCallback(
    async (symbol: string) => {
      setCurrent(symbol);

      // dont refetch if already exists, unless we want to (e.g. in case of currency change),
      // also don't refetch if null because it means there was already a fetch but with no data returned
      if (
        loading ||
        dataMap[currency][symbol] ||
        dataMap[currency][symbol] === null
      ) {
        return;
      }

      setLoading(true);
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
    [currency, dataMap, loading]
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
