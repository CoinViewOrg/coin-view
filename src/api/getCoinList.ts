import { CoinListItem, SortingType } from "../types";
import { apiGetRequest } from "./apiGetRequest";

type PropsType = {
  currency: "USD" | "PLN";
  sorting: SortingType;
  pageSize: string;
  startFrom: string;
};

export const getCoinList = async ({
  currency,
  sorting,
  pageSize,
  startFrom,
}: PropsType) => {
  console.log({currency, sorting, pageSize, startFrom})
  const { data } = await apiGetRequest({
    url: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
    params: {
      convert: currency,
      sort: sorting,
      limit: pageSize,
      start: startFrom,
    },
  });

  return data as CoinListItem[];
};
