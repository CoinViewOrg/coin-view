import { querySQL } from "./mysql";

export const getExistingUserByNameOrEmail = async (
  username: string,
  email: string
) => {
  const findExistingUserSql = `select Ua_Id from UsrAccount where Ua_login = '${username}' or Ua_Email = '${email}'`;
  return (await querySQL(findExistingUserSql)) as Promise<Array<any>>;
};

export const getExistingUserByID = async (id: string) => {
  const findExistingUserSql = `select Ua_Id from UsrAccount where Ua_Id = '${id}'`;
  return (await querySQL(findExistingUserSql)) as Promise<Array<any>>;
};

export const getExistingUserByEmail = async (email: string) => {
  const findExistingUserSql = `select Ua_Id from UsrAccount where Ua_Email = '${email}'`;
  return (await querySQL(findExistingUserSql)) as Promise<Array<any>>;
};
