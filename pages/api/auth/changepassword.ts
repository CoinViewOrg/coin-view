// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { encryptWithAES, decryptWithAES, querySQL } from "@coin-view/api";
import { getSession } from "next-auth/react";

type Data = {
  error: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getSession({ req });
  const { oldPassword, newPassword, repeatNewPassword } = req.body;

  // @ts-ignore
  const userid = session?.user?.id;

  if (!oldPassword || !newPassword || !repeatNewPassword) {
    res.status(400).json({ error: 1 });
    return;
  }

  let response;

  const findUserSql = `select Ua_Password from UsrAccount where Ua_Id = '${userid}'`;
  response = (await querySQL(findUserSql)) as Array<any>;

  if (oldPassword !== decryptWithAES(response[0].Ua_Password)) {
    res.status(400).json({ error: 2 });
    return;
  }

  const updateUserSql = `UPDATE UsrAccount SET Ua_Password = '${encryptWithAES(
    newPassword
  )}' WHERE Ua_Id = '${userid}'`;

  await querySQL(updateUserSql);

  res.status(200).json({ error: 0 });
}
