import { querySQL } from "./auth";

export const getCryptothresholds = async (userid: string) => {
  const thresholds = `SELECT Cn_UaId, Cn_CryptoId, Cn_Treshold FROM CryptoNotification where Cn_UaId = ?`;
  const response = (await querySQL(thresholds, [[userid]])) as Array<any>;
  return response;
};
