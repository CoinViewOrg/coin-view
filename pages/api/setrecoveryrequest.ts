import type { NextApiRequest, NextApiResponse } from "next";
import { querySQL } from "@coin-view/api";
import { v4 as uuidv4 } from "uuid";
import ses from "node-ses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { usernameOrEmail } = req.body;

  if (!usernameOrEmail) {
    res.status(400).json({ error: 1 });
    return;
  }

  let response;

  const findUser = `SELECT Ua_Id, Ua_Email FROM UsrAccount WHERE Ua_login = ? OR Ua_Email = ?`;
  response = (await querySQL(findUser, [
    [usernameOrEmail],
    [usernameOrEmail],
  ])) as Array<any>;

  if (!response.length) {
    res.status(400).json({ error: 2 });
    return;
  }

  const resetToken = uuidv4() + "-" + uuidv4();
  const dateTime = new Date();
  dateTime.setDate(dateTime.getDate() + 1);

  const setRecoveryRequest = `INSERT INTO PasswordResetTokens(Ua_Id, ResetToken, TokenExpiration, Used) VALUES(?, 0)`;
  await querySQL(setRecoveryRequest, [
    [response[0].Ua_Id, resetToken, dateTime],
  ]);
  res.status(200).json({ error: 0 });

  const sesClient = ses.createClient({
    key: process.env.AWS_SES_ACCESS_KEY_ID || "",
    secret: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
    amazon: `https://email.eu-central-1.amazonaws.com`,
  });

  const href = `127.0.0.1:3000/reset/${resetToken}`;

  const emailHTML = `
    <html>
      <head></head>
      <body>
        <h1>You can reset your password here:</h1>
        <p><a href='${href}'>${href}</a></p>
      </body>
    </html>
    `;

  await sesClient.sendEmail(
    {
      to: response[0].Ua_Email,
      message: emailHTML,
      subject: "Coin-View: Reset your password",
      from: "aws.krzotki@gmail.com",
    },
    function (err, data, res) {
      if (err) {
        console.log(err, data, res);
      }
    }
  );
}
