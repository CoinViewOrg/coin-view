// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getExistingUser, registerUser } from "@coin-view/api";

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

  let response = await getExistingUser(username, email);

  if (response.length) {
    res.status(400).json({ error: 2 });
    return;
  }

  await registerUser(username, password, email);

  res.status(200).json({ error: 0 });
}
