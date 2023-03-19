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

  const userid = session?.user?.id;
  const google_sso = Boolean(session?.user?.google_sso);

  if (!username || !email) {
    res.status(400).json({ error: 1 });
    return;
  }

  let response;

  const findExistingUserSql = `select Ua_Id from UsrAccount where (Ua_login = ? or Ua_Email = ?) and Ua_Id != ?`;
  response = (await querySQL(findExistingUserSql, [
    [username],
    [email],
    [userid],
  ])) as Array<any>;

  if (response.length) {
    res.status(400).json({ error: 2 });
    return;
  }

  const subscribeEmail = `UPDATE UserEmailSubscriptions SET CryptoAlerts = '1', Newsletters = '1', ProductUpdate = '1' WHERE UserId = ?`;
  const unsubscribeEmail = `UPDATE UserEmailSubscriptions SET CryptoAlerts = '0', Newsletters = '0', ProductUpdate = '0' WHERE UserId = ?`;

  if (email_sub) {
    await querySQL(subscribeEmail, [[userid]]);
  } else {
    await querySQL(unsubscribeEmail, [[userid]]);
  }

  if (!google_sso) {
    const updateUserSql = `UPDATE UsrAccount SET Ua_login = ?, Ua_Email = ? WHERE Ua_Id = ?`;

    await querySQL(updateUserSql, [[username], [email], [userid]]);
  }

  res.status(200).json({ error: 0 });
}
