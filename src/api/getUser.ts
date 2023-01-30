import { querySQL } from "./auth";

type UserType = {
  Ua_Id: number;
  Ua_login: string;
  Ua_Email: string;
};

export const getUserById = async (id: number) => {
  const findUser = `SELECT Ua_Id, Ua_login, Ua_Email FROM UsrAccount where Ua_Id = '${id}'`;
  const response = (await querySQL(findUser)) as Array<any>;
  return response[0] as UserType;
};
