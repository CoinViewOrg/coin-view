// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getHistoricalData } from "@coin-view/api";
import type { NextApiRequest, NextApiResponse } from "next";

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

  const data = await getHistoricalData({
    currency,
    symbols: symbols.split(","),
  });

  res.status(200).json(data);
}
