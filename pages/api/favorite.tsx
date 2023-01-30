// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { querySQL } from "@coin-view/api";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

type Data = {
  error: number;
  isFavorite?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id: cryptoid } = req.query;

  const session = await unstable_getServerSession(req, res, authOptions);

  // @ts-ignore
  const userid = session?.user?.id;
  if (!userid || !cryptoid) {
    res.status(400).json({ error: 1 });
    return;
  }

  let response;

  const findFavorite = `SELECT * FROM CryptoFavorites where Cf_UaID = '${userid}' and Cf_CryptoId = '${cryptoid}'`;
  response = (await querySQL(findFavorite)) as Array<any>;

  if (response.length) {
    const deleteQuery = `DELETE FROM CryptoFavorites where Cf_UaID = '${userid}' and Cf_CryptoId = '${cryptoid}'`;
    await querySQL(deleteQuery);

    res.status(200).json({ error: 0, isFavorite: false });
    return;
  }

  const addQuery = `INSERT INTO CryptoFavorites values (${userid}, ${cryptoid})`;
  await querySQL(addQuery);

  res.status(200).json({ error: 0, isFavorite: true });
}
