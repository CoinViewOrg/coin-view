// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { querySQL } from "src";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const CHARSET = "UTF-8";

AWS.config.update({
  region: "eu-central-1",
  account: {
    credentials: {
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
    },
  },
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
    '${email}', '${password}', '${requestId}', 0)`;

  await querySQL(newUserSql);

  const emailHTML = `
    <html>
      <head></head>
      <body>
        <h1>Verify your email adress here:</h1>
        <p>https://coin-view.krzotki.com/api/verify?request=${requestId}</p>
      </body>
    </html>
  `;

  await new AWS.SES()
    .sendEmail({
      Message: {
        Body: {
          Html: {
            Charset: CHARSET,
            Data: emailHTML,
          },
        },
        Subject: {
          Charset: CHARSET,
          Data: "Coin-View: Verify your email address",
        },
      },
      Destination: { ToAddresses: [email] },
      Source: "aws.krzotki@gmail.com",
    })
    .promise();
    
  res.status(200).json({ error: 0 });
}
