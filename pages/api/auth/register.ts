// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getExistingUserByNameOrEmail, registerUser } from "@coin-view/api";

type Data = {
  error: number;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username, password, email } = req.body;

  if (
    !username ||
    !password ||
    !email ||
    !/[A-Za-z0-9._\S]{3,30}\w$/.test(username) ||
    password.length > 40 ||
    !/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)
  ) {
    res.status(400).json({ error: 1 });
    return;
  }

  let response = await getExistingUserByNameOrEmail(username, email);

  if (response.length) {
    res.status(400).json({ error: 2 });
    return;
  }

  await registerUser(username, password, email);

  res.status(200).json({ error: 0 });
}
