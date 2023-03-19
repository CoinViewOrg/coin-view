import { querySQL } from "./mysql";

export const getExistingUserByNameOrEmail = async (
  username: string,
  email: string
) => {
  const findExistingUserSql = `SELECT Ua_Id FROM UsrAccount WHERE Ua_login = ? or Ua_Email = ?`;

  return (await querySQL(findExistingUserSql, [
    [username],
    [email],
  ])) as Promise<Array<any>>;
};

export const getExistingUserByID = async (id: string) => {
  const findExistingUserSql = `SELECT Ua_Id FROM UsrAccount WHERE Ua_Id = ?`;

  return (await querySQL(findExistingUserSql, [[id]])) as Promise<Array<any>>;
};

export const getExistingUserByEmail = async (email: string) => {
  const findExistingUserSql = `SELECT Ua_Id FROM UsrAccount WHERE Ua_Email = ?`;

  return (await querySQL(findExistingUserSql, [[email]])) as Promise<
    Array<any>
  >;
};
