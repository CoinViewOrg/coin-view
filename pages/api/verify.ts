import { querySQL } from "@coin-view/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestId = req.query.request;
  let response;

  const verifySql = `UPDATE UsrAccount SET EmailVerified = 1 WHERE VerificationId='${requestId}'`;
  response = (await querySQL(verifySql)) as any;
  if (response.changedRows > 0) {
    res.redirect(`/info?message=Successfully verified!`);
    return;
  }

  if (response.affectedRows > 0) {
    res.redirect(`/info?message=Email already verified!`);
    return;
  }

  res.redirect(`/info?message=Invalid request id!`);
}
