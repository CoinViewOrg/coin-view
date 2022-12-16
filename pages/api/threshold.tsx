// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { querySQL } from "src";

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

  const session = await getSession({ req });

  // @ts-ignore
  const userid = session?.user?.id;
  if (!userid || !cryptoid || !ALLOWED_THRESHOLDS.includes(threshold)) {
    res.status(400).json({ error: 1 });
    return;
  }

  let response;
  const findThreshold = `SELECT Cn_UaId, Cn_CryptoId, Cn_Treshold FROM CryptoNotification where Cn_UaId = '${userid}' and  Cn_CryptoId = '${cryptoid}'`;

  response = (await querySQL(findThreshold)) as Array<any>;

  if (response.length) {
    const currentThreshold = response[0].Cn_Treshold;

    if (currentThreshold === threshold) {
      const deleteQuery = `DELETE FROM CryptoNotification where Cn_UaId = '${userid}' and Cn_CryptoId = '${cryptoid}'`;
      await querySQL(deleteQuery);

      res.status(200).json({ error: 0, newthreshold: undefined });
      return;
    }

    const updateQuery = `UPDATE CryptoNotification set Cn_Treshold = '${threshold}'  where Cn_UaId = '${userid}' and Cn_CryptoId = '${cryptoid}'`;
    await querySQL(updateQuery);

    res.status(200).json({ error: 0, newthreshold: threshold });
    return;
  }

  const addQuery = `INSERT INTO CryptoNotification values (${userid}, ${cryptoid}, "", ${threshold})`;
  await querySQL(addQuery);

  res.status(200).json({ error: 0, newthreshold: threshold });
}
