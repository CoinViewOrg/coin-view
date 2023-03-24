// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { querySQL } from "@coin-view/api";
import { unstable_getServerSession } from "next-auth";
import { createOptions } from "./auth/[...nextauth]";

type Data = {
  error: number;
  newthreshold?: number;
};

const ALLOWED_THRESHOLDS = [5, 8, 10];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id: cryptoid } = req.query;

  const threshold = Number(req.query.threshold || 0);

  const session = await unstable_getServerSession(req, res, createOptions(req));

  const userid = session?.user?.id;
  if (!userid || !cryptoid || !ALLOWED_THRESHOLDS.includes(threshold)) {
    res.status(400).json({ error: 1 });
    return;
  }

  const sqlParameters = [];

  let response;

  const getConfirmedEmail = `SELECT EmailVerified FROM UsrAccount WHERE Ua_Id = ?`;
  response = (await querySQL(getConfirmedEmail, [[userid]])) as Array<any>;

  if (response[0].EmailVerified === 0) {
    res.status(200).json({ error: 2 });
    return;
  }

  const findThreshold = `SELECT Cn_UaId, Cn_CryptoId, Cn_Treshold FROM CryptoNotification WHERE Cn_UaId = ? AND Cn_CryptoId = ?`;

  response = (await querySQL(findThreshold, [
    [userid],
    [cryptoid],
  ])) as Array<any>;

  if (response.length) {
    const currentThreshold = response[0].Cn_Treshold;

    if (currentThreshold === threshold) {
      const deleteQuery = `DELETE FROM CryptoNotification WHERE Cn_UaId = ? AND Cn_CryptoId = ?`;
      await querySQL(deleteQuery, [[userid], [cryptoid]]);

      res.status(200).json({ error: 0, newthreshold: undefined });
      return;
    }

    const updateQuery = `UPDATE CryptoNotification SET Cn_Treshold = ?  WHERE Cn_UaId = ? AND Cn_CryptoId = ?`;
    await querySQL(updateQuery, [[threshold], [userid], [cryptoid]]);

    res.status(200).json({ error: 0, newthreshold: threshold });
    return;
  }

  const addQuery = `INSERT INTO CryptoNotification VALUES (?, ?, ?)`;
  await querySQL(addQuery, [[userid], [cryptoid], [threshold]]);

  res.status(200).json({ error: 0, newthreshold: threshold });
}
