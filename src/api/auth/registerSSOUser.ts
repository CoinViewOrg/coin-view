import { v4 as uuidv4 } from "uuid";
import { querySQL } from "./mysql";

type InsertPromise = {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
};

export const registerSSOUser = async (
  providerId: string,
  username: string,
  email: string,
  accessToken: string
) => {
  const newUserSql = `INSERT INTO UsrAccount(Ua_Id, Ua_login, Ua_email, Ua_password, EmailVerified) VALUES( '${providerId}', '${username}',
    '${email}', '${accessToken}', 1)`;

  const insertedUser = (await querySQL(newUserSql)) as InsertPromise;

  const newUserNotificationPreferences = `INSERT INTO UserEmailSubscriptions VALUES('${providerId}', '1', '1', '1')`;

  await querySQL(newUserNotificationPreferences);
};
