import { querySQL } from "./auth";

export const setCryptothreshold = async (
  threshold: number | null,
  userid: string
) => {
  const sql = `UPDATE UsrAccount SET Cn_Treshold = ? where Ua_Id = ?`;
  const response = (await querySQL(sql, [[threshold], [userid]])) as Array<any>;
  return response;
};
