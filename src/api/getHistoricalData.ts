import { CurrencyType } from "@coin-view/types";
import mockData from "./mockHistoricalData.json";

type PropsType = {
  currency: CurrencyType;
  symbols: string[];
};

const marketMap = {
  USD: "binance-us",
  PLN: "zonda",
};

const periods = 3600;

export const getHistoricalData = async ({ currency, symbols }: PropsType) => {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  const yesterdayTimestamp = Math.floor(date.getTime() / 1000);

  const market = marketMap[currency];

  if (process.env.NODE_ENV === "production") {
    const promises = symbols.map(async (symbol) => {
      try {
        const query = `https://api.cryptowat.ch/markets/${market}/${symbol}${currency.toLowerCase()}/ohlc?periods=${periods}&after=${yesterdayTimestamp}`;
        const response = await fetch(query);

        const data = await response.json();
        return [symbol, data.result[periods]];
      } catch {
        console.log(`No historical data for ${symbol}`);
        return [symbol, null];
      }
    });

    const data = await Promise.all(promises);
    return Object.fromEntries(data);
  }

  return Object.fromEntries(
    symbols.map((symbol) => [symbol, mockData[periods]])
  );
};
