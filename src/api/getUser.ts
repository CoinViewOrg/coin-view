import { querySQL } from "./auth";

type UserType = {
  Ua_Id: number;
  Ua_login: string;
  Ua_Email: string;
  GoogleSSO: number;
  CryptoAlerts: number;
  Newsletters: number;
  ProductUpdate: number;
  EmailVerified: boolean;
};

export const getUserDataById = async (id: string) => {
  const findUser = `SELECT Ua.Ua_Id, Ua.Ua_login, Ua.Ua_Email, Ua.GoogleSSO, Ua.EmailVerified, Ues.CryptoAlerts, Ues.CryptoAlerts, Ues.Newsletters, 
  Ues.ProductUpdate FROM UsrAccount Ua INNER JOIN UserEmailSubscriptions Ues ON Ua.Ua_Id = Ues.UserId WHERE Ua.Ua_Id = ?`;
  const response = (await querySQL(findUser, [[id]])) as Array<any>;
  return response[0] as UserType | undefined;
};
