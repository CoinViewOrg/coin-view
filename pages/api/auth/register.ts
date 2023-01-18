// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { encryptWithAES, querySQL } from "@coin-view/api";
import ses from "node-ses";
import { v4 as uuidv4 } from "uuid";

const sesClient = ses.createClient({
  key: process.env.AWS_SES_ACCESS_KEY_ID || "",
  secret: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  amazon: `https://email.eu-central-1.amazonaws.com`,
});

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

  const requestId = uuidv4();

  const newUserSql = `INSERT INTO UsrAccount(Ua_login, Ua_email, Ua_password, VerificationId, EmailVerified) VALUES('${username}',
    '${email}', '${encryptWithAES(password)}', '${requestId}', 0)`;

  await querySQL(newUserSql);

  const href = `https://coin-view.krzotki.com/verifyemail?requestid=${requestId}`;

  const emailHTML = `
    <html>
      <head></head>
      <body>
        <h1>Verify your email adress here:</h1>
        <p><a href='${href}'>${href}</a></p>
      </body>
    </html>
  `;

  await sesClient.sendEmail(
    {
      to: email,
      message: emailHTML,
      subject: "Coin-View: Verify your email address",
      from: "aws.krzotki@gmail.com",
    },
    function (err, data, res) {
      if (err) {
        console.log(err, data, res);
      }
    }
  );

  res.status(200).json({ error: 0 });
}
