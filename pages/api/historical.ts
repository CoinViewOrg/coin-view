// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const marketMap = {
  USD: "binance-us",
  PLN: "binance",
};

const periods = 3600;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const symbols = req.query.symbols as string;
  const currency = String(req.query.currency).toUpperCase();

  if (currency !== "PLN" && currency !== "USD") {
    res.status(400).json({ error: "Choose currency (PLN or USD)" });
    return;
  }

  const date = new Date();
  date.setDate(date.getDate() - 1);

  const yesterdayTimestamp = Math.floor(date.getTime() / 1000);

  const market = marketMap[currency];

  const promises = symbols.split(",").map(async (symbol) => {
    const response = await fetch(
      `https://api.cryptowat.ch/markets/${market}/${symbol}${currency}/ohlc?periods=${periods}&after=${yesterdayTimestamp}`
    );

    const data = await response.json();
    return [symbol, data.result[periods]];
  });

  const data = await Promise.all(promises);

  res.status(200).json(Object.fromEntries(data));
}
