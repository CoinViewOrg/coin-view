// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { querySQL } from "@coin-view/api";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

type Data = {
  error: number;
  notifications?: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const param = req.query.param as string;
  const session = await unstable_getServerSession(req, res, authOptions);

  // @ts-ignore
  const userid = session?.user?.id;
  if (!userid) {
    res.status(400).json({ error: 1 });
    return;
  }

  let response;

  if (param === "count") {
    const countNotifications = `SELECT COUNT(*) as count FROM UserNotifications where Ua_Id = ? and Seen = 0`;
    response = (await querySQL(countNotifications, [[userid]])) as Array<any>;
  } else if (param === "fetch") {
    const findNotification = `SELECT * FROM UserNotifications where Ua_Id = ? and DATEDIFF(LOCALTIME(), Date) <= 3 ORDER BY Date DESC`;
    const updateNotifications = `UPDATE UserNotifications SET Seen = 1 where Ua_Id = ?`;

    response = (await querySQL(findNotification, [[userid]])) as Array<any>;
    await querySQL(updateNotifications, [[userid]]);
  }

  res.status(200).json({ error: 0, notifications: response });
}
