// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getCoinList } from "@coin-view/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data = await getCoinList();
  res.status(200).json(data);
}
