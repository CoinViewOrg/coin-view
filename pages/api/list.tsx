// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getCoinList } from "@coin-view/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { SortingType } from "@coin-view/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data = await getCoinList({
    currency: "PLN",
    sorting: req.query.sorting as SortingType,
    pageSize: req.query.pageSize as string,
    startFrom: req.query.startFrom as string
  });
  res.status(200).json(data);
}
