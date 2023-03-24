// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { querySQL } from "@coin-view/api";
import { unstable_getServerSession } from "next-auth";
import { createOptions } from "./auth/[...nextauth]";

type Data = {
  error: number;
  favorites?: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id: cryptoid } = req.query;

  const session = await unstable_getServerSession(req, res, createOptions(req));

  // @ts-ignore
  const userid = session?.user?.id;
  if (!userid || !cryptoid) {
    res.status(400).json({ error: 1 });
    return;
  }

  let response;

  const findFavorite = `SELECT * FROM CryptoFavorites where Cf_UaID = ? and Cf_CryptoId = ?`;
  response = (await querySQL(findFavorite, [
    [userid],
    [cryptoid],
  ])) as Array<any>;

  res.status(200).json({ error: 0, favorites: response });
}
