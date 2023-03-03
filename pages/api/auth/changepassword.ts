// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { querySQL } from "@coin-view/api";
import { getSession } from "next-auth/react";
import bcrypt from "bcrypt";

type Data = {
  error: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getSession({ req });
  const google_sso = Boolean(session?.user?.google_sso);

  if (google_sso) {
    res.status(403).json({ error: 3 });
    return;
  }

  const { oldPassword, newPassword, repeatNewPassword } = req.body;

  const userid = session?.user?.id;

  if (!oldPassword || !newPassword || !repeatNewPassword) {
    res.status(400).json({ error: 1 });
    return;
  }

  let response;

  const findUserSql = `select Ua_Password from UsrAccount where Ua_Id = '${userid}'`;
  response = (await querySQL(findUserSql)) as Array<any>;

  const match = await bcrypt.compare(oldPassword, response[0].Ua_Password);

  if (!match) {
    res.status(400).json({ error: 2 });
    return;
  }

  bcrypt.hash(newPassword, 10).then(async function (result: string) {
    const updateUserSql = `UPDATE UsrAccount SET Ua_Password = '${result}' WHERE Ua_Id = '${userid}'`;

    await querySQL(updateUserSql);
  });

  res.status(200).json({ error: 0 });
}
