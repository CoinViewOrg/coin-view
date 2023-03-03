import { MarketType } from "@coin-view/markets";
import { querySQL } from "./auth";

export const getFavoriteMarket = async (userid: string) => {
  const findFavorite = `SELECT Ua_FavoriteMarket, (select Ml_name from MarketList where Ml_Id = Ua_FavoriteMarket) as MarketName FROM UsrAccount where Ua_Id = '${userid}'`;
  const response = (await querySQL(findFavorite)) as Array<any>;
  return response[0].MarketName as MarketType;
};
