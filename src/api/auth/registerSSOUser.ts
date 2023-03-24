import { querySQL } from "./mysql";

export const registerSSOUser = async (
  providerId: string,
  username: string,
  email: string,
  accessToken: string
) => {
  const newUserSql = `INSERT INTO UsrAccount(Ua_Id, Ua_login, Ua_email, Ua_password, EmailVerified, GoogleSSO, Cn_Treshold) VALUES(?, 1, 1, null)`;
  const newUserValues = [providerId, username, email, accessToken];

  await querySQL(newUserSql, [newUserValues]);

  const newUserNotificationPreferences = `INSERT INTO UserEmailSubscriptions VALUES(?, 1, 1, 1)`;
  const newUserNotificationValues = [providerId];

  await querySQL(newUserNotificationPreferences, [newUserNotificationValues]);
};
