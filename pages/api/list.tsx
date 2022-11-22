// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getCoinList } from "@coin-view/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { CurrencyType, SortingType } from "@coin-view/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data = await getCoinList({
    currency: req.query.currency as CurrencyType,
    sorting: req.query.sorting as SortingType,
    pageSize: Number(req.query.pageSize),
    startFrom: Number(req.query.startFrom),
    sortDir: Number(req.query.sortDir),
  });
  res.status(200).json(data);
}
