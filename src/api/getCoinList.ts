import { CoinListItem, CurrencyType, SortingType } from "../types";
import { apiGetRequest } from "./apiGetRequest";
import mocks from "./mockData.json";

type PropsType = {
  currency: CurrencyType;
  sorting: SortingType;
  pageSize: number;
  startFrom: number;
};

export const getCoinList = async ({
  currency,
  sorting,
  pageSize,
  startFrom,
}: PropsType) => {
  if (process.env.NODE_ENV === "production") {
    const { data } = await apiGetRequest({
      url: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      params: {
        convert: currency,
        sort: sorting,
        limit: String(pageSize),
        start: String(startFrom),
      },
    });
    return data as CoinListItem[];
  }

  return mocks.data
    .sort((a, b) => {
      if (sorting === "market_cap") {
        return a.cmc_rank - b.cmc_rank;
      }

      if (sorting === "name") {
        return a.name.localeCompare(b.name);
      }
      
      return b.quote[currency].price - a.quote[currency].price;
    })
    .slice(startFrom - 1, startFrom + pageSize - 1);
};
