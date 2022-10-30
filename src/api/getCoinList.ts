import { CoinListItem } from "../types";
import { apiGetRequest } from "./apiGetRequest";

type PropsType = {
  currency: "USD" | "PLN";
};

export const getCoinList = async ({ currency }: PropsType) => {
  const { data } = await apiGetRequest({
    url: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
    params: {
      convert: currency,
    },
  });

  return data as CoinListItem[];
};
