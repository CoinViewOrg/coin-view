import { querySQL } from "./auth";

export const getCryptothresholds = async (userid: string) => {
  const thresholds = `SELECT Cn_Treshold FROM UsrAccount where Ua_Id = ?`;
  const response = (await querySQL(thresholds, [[userid]])) as Array<any>;
  return response[0].Cn_Treshold;
};
