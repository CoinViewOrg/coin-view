import { querySQL } from "./auth";

export const checkResetToken = async (token: any) => {
  const sql = `SELECT * FROM PasswordResetTokens WHERE ResetToken = ? AND Used = 0`;
  const response = (await querySQL(sql, [[token]])) as Array<any>;
  if (!response.length) {
    return false;
  }

  const tokenExpiresOn = new Date(response[0].TokenExpiration);
  const dateToday = new Date();
  if (dateToday > tokenExpiresOn) {
    return false;
  }

  return true;
};
