// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { querySQL } from "src";

type Data = {
  error: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400).json({ error: 1 });
    return;
  }

  let response;

  const findExistingUserSql = `select Ua_Id from UsrAccount where Ua_login = '${username}' or Ua_Email = '${email}'`;
  response = (await querySQL(findExistingUserSql)) as Array<any>;

  if (response.length) {
    res.status(400).json({ error: 2 });
    return;
  }

  const newUserSql = `INSERT INTO UsrAccount(Ua_login, Ua_email, Ua_emailadittional, Ua_password) VALUES('${username}',
    '${email}', '', '${password}')`;

  await querySQL(newUserSql);

  res.status(200).json({ error: 0 });
}
