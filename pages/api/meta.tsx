// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getCoinsMetadata } from "@coin-view/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const ids = req.query.ids as string;
  const data = await getCoinsMetadata({
    ids: ids.split(","),
  });
  res.status(200).json(data);
}
