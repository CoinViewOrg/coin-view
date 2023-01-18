// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { querySQL } from "@coin-view/api";

type Data = {
  error: number;
  notifications?: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const session = await getSession({ req });

  // @ts-ignore
  const userid = session?.user?.id;
  if (!userid) {
    res.status(400).json({ error: 1 });
    return;
  }

  let response;

  const findNotification = `SELECT * FROM UserNotifications where Ua_Id = '${userid}'`;
  response = (await querySQL(findNotification)) as Array<any>;

  res.status(200).json({ error: 0, notifications: response });
}
