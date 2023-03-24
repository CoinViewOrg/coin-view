// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { querySQL, setCryptothreshold } from "@coin-view/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const ALLOWED_THRESHOLDS = [null, 5, 8, 10];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { option } = req.body;
  const session = await unstable_getServerSession(req, res, authOptions);

  const userid = session?.user?.id;

  if (!userid || !ALLOWED_THRESHOLDS.includes(option)) {
    res.status(400).json({ error: 1 });
    return;
  }

  let response;

  const getConfirmedEmail = `SELECT EmailVerified FROM UsrAccount WHERE Ua_Id = ?`;
  response = (await querySQL(getConfirmedEmail, [[userid]])) as Array<any>;

  if (response[0].EmailVerified === 0) {
    res.status(200).json({ error: 2 });
    return;
  }

  await setCryptothreshold(option, userid);
  res.status(200).json({ error: 0 });
}
