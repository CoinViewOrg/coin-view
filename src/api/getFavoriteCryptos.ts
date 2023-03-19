import { querySQL } from "./auth";

export const getFavoriteCryptos = async (userid: string) => {
  const findFavorite = `SELECT Cf_CryptoId FROM CryptoFavorites where Cf_UaID = ?`;
  const response = (await querySQL(findFavorite, [[userid]])) as Array<any>;
  return response;
};
