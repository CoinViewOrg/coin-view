import { querySQL } from "./auth";

export const getFavoriteCryptos = async (userid: number) => {
  const findFavorite = `SELECT Cf_CryptoId FROM CryptoFavorites where Cf_UaID = '${userid}'`;
  const response = (await querySQL(findFavorite)) as Array<any>;
  return response;
};
