import { querySQL } from "./auth";

export const getCryptothresholds = async (userid: number) => {
  const thresholds = `SELECT Cn_UaId, Cn_CryptoId, Cn_Treshold FROM CryptoNotification where Cn_UaId = '${userid}'`;
  const response = (await querySQL(thresholds)) as Array<any>;
  return response;
};
