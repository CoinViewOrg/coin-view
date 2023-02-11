import { NumberReference } from "aws-sdk/clients/connect";
import { querySQL } from "./auth";

type UserType = {
  Ua_Id: number;
  Ua_login: string;
  Ua_Email: string;
  CryptoAlerts: number;
  Newsletters: number;
  ProductUpdate: number;
};

export const getUserById = async (id: number) => {
  const findUser = `SELECT Ua.Ua_Id, Ua.Ua_login, Ua.Ua_Email, Ues.CryptoAlerts, Ues.Newsletters, 
  Ues.ProductUpdate FROM UsrAccount Ua INNER JOIN UserEmailSubscriptions Ues ON Ua.Ua_Id = Ues.UserId where Ua.Ua_Id = '${id}'`;
  const response = (await querySQL(findUser)) as Array<any>;
  return response[0] as UserType;
};
