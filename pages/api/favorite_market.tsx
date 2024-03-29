// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { querySQL } from "@coin-view/api";
import { unstable_getServerSession } from "next-auth";
import { createOptions } from "./auth/[...nextauth]";

type Data = {
  error: number;
  favoriteMarketName?: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const market = req.query.market as string;

  const session = await unstable_getServerSession(req, res, createOptions(req));

  // @ts-ignore
  const userid = session?.user?.id;
  if (!userid || !market) {
    res.status(400).json({ error: 1 });
    return;
  }

  let response;

  try {
    const userQuery = `SELECT Ua_FavoriteMarket, (select Ml_Id from MarketList where Ml_name = ?) as DesiredMarketId FROM UsrAccount where Ua_Id = ?`;
    [response] = (await querySQL(userQuery, [
      [market],
      [userid],
    ])) as Array<any>;
    const currentMarketId = response.Ua_FavoriteMarket as number;
    const desiredMarketId = response.DesiredMarketId as number;

    if (!desiredMarketId) {
      res.status(400).json({ error: 1 });
      return;
    }

    const newMarketId =
      currentMarketId === desiredMarketId ? null : desiredMarketId;

    const updateQuery = `UPDATE UsrAccount set Ua_FavoriteMarket= ? where Ua_Id = ?`;
    await querySQL(updateQuery, [[newMarketId], [userid]]);

    let favoriteMarketName = newMarketId !== null ? market : null;
    res.status(200).json({ error: 0, favoriteMarketName });
  } catch {
    res.status(400).json({ error: 1 });
  }
}
