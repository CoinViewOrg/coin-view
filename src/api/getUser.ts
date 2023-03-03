import { querySQL } from "./auth";

type UserType = {
  Ua_Id: number;
  Ua_login: string;
  Ua_Email: string;
  GoogleSSO: number;
  CryptoAlerts: number;
  Newsletters: number;
  ProductUpdate: number;
};

export const getUserDataById = async (id: string) => {
  const findUser = `SELECT Ua.Ua_Id, Ua.Ua_login, Ua.Ua_Email, Ua.GoogleSSO, Ues.CryptoAlerts, Ues.Newsletters, 
  Ues.ProductUpdate FROM UsrAccount Ua INNER JOIN UserEmailSubscriptions Ues ON Ua.Ua_Id = Ues.UserId where Ua.Ua_Id = '${id}'`;
  const response = (await querySQL(findUser)) as Array<any>;
  return response[0] as UserType | undefined;
};
