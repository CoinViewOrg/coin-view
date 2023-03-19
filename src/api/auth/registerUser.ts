import ses from "node-ses";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { querySQL } from "./mysql";

const sesClient = ses.createClient({
  key: process.env.AWS_SES_ACCESS_KEY_ID || "",
  secret: process.env.AWS_SES_SECRET_ACCESS_KEY || "",
  amazon: `https://email.eu-central-1.amazonaws.com`,
});

export const registerUser = async (
  username: string,
  password: string,
  email: string
) => {
  const requestId = uuidv4();
  const userId = uuidv4();

  bcrypt.hash(password, 10).then(async function (result: string) {
    const newUserSql = `INSERT INTO UsrAccount(Ua_Id, Ua_login, Ua_email, Ua_password, EmailVerified) VALUES(?, 0)`;
    const newUserValues = [userId, username, email, result];

    await querySQL(newUserSql, [newUserValues]);

    const newUserNotificationPreferences = `INSERT INTO UserEmailSubscriptions VALUES(?, 1, 1, 1)`;
    const newUserNotificationValues = [userId];

    await querySQL(newUserNotificationPreferences, [newUserNotificationValues]);
  });

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
};
