// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { querySQL } from "@coin-view/api";
import bcrypt from "bcrypt";

type Data = {
  error: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { token, newPassword, repeatNewPassword } = req.body;
  if (
    !newPassword ||
    !repeatNewPassword ||
    newPassword.length > 40 ||
    repeatNewPassword.length > 40 ||
    newPassword != repeatNewPassword
  ) {
    res.status(400).json({ error: 1 });
    return;
  }

  const findUserId = `SELECT Ua_Id, TokenExpiration FROM PasswordResetTokens WHERE ResetToken = ?`;
  let response = (await querySQL(findUserId, [[token.token]])) as Array<any>;
  if (!response.length) {
    res.status(400).json({ error: 2 });
    return;
  }

  const tokenExpiresOn = new Date(response[0].TokenExpiration);
  const dateToday = new Date();
  if (dateToday > tokenExpiresOn) {
    res.status(400).json({ error: 3 });
  }

  bcrypt.hash(newPassword, 10).then(async function (result: string) {
    const updateUserSql = `UPDATE UsrAccount SET Ua_Password = ? WHERE Ua_Id = ?`;
    await querySQL(updateUserSql, [[result], [response[0].Ua_Id]]);
  });

  const useToken = `UPDATE PasswordResetTokens SET Used = 1 WHERE Ua_Id = ? AND ResetToken = ?`;
  await querySQL(useToken, [[response[0].Ua_Id], [token.token]]);

  res.status(200).json({ error: 0 });
}
