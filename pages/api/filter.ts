// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getCoinList, getFilteredCoinList } from "@coin-view/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { CurrencyType, SortingType } from "@coin-view/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data = await getFilteredCoinList({
    currency: req.query.currency as CurrencyType,
    phrase: req.query.phrase as string,
  });
  res.status(200).json(data);
}
