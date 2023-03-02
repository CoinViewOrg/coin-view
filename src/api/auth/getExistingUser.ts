import { querySQL } from "./mysql";

export const getExistingUser = async (username: string, email: string) => {
  const findExistingUserSql = `select Ua_Id from UsrAccount where Ua_login = '${username}' or Ua_Email = '${email}'`;
  return (await querySQL(findExistingUserSql)) as Promise<Array<any>>;
};

export const getExistingSSOUser = async (email: string) => {
  const findExistingUserSql = `select Ua_Id from UsrAccount where  Ua_Email = '${email}'`;
  return (await querySQL(findExistingUserSql)) as Promise<Array<any>>;
};
