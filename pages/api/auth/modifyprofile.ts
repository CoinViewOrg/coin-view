// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { querySQL } from "@coin-view/api";
import { getSession } from "next-auth/react";

type Data = {
  error: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getSession({ req });
  const { username, email, email_sub } = req.body;

  // @ts-ignore
  const userid = session?.user?.id;

  if (!username || !email) {
    res.status(400).json({ error: 1 });
    return;
  }

  let response;

  const findExistingUserSql = `select Ua_Id from UsrAccount where (Ua_login = '${username}' or Ua_Email = '${email}') and Ua_Id != '${userid}'`;
  response = (await querySQL(findExistingUserSql)) as Array<any>;

  if (response.length) {
    res.status(400).json({ error: 2 });
    return;
  }

  const subscribeEmail = `UPDATE UserEmailSubscriptions SET CryptoAlerts = '1', Newsletters = '1', ProductUpdate = '1' WHERE UserId = '${userid}'`;
  const unsubscribeEmail = `UPDATE UserEmailSubscriptions SET CryptoAlerts = '0', Newsletters = '0', ProductUpdate = '0' WHERE UserId = '${userid}'`;

  email_sub ? await querySQL(subscribeEmail) : await querySQL(unsubscribeEmail);

  const updateUserSql = `UPDATE UsrAccount SET Ua_login = '${username}', Ua_Email = '${email}' WHERE Ua_Id = '${userid}'`;

  await querySQL(updateUserSql);

  res.status(200).json({ error: 0 });
}
