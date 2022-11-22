import { CoinListItem, CurrencyType, SortingType } from "../types";
import { apiGetRequest } from "./apiGetRequest";
import mocks from "./mockData.json";

type PropsType = {
  currency: CurrencyType;
  sorting: SortingType;
  pageSize: number;
  startFrom: number;
  sortDir: number;
};

export const getCoinList = async ({
  currency,
  sorting,
  pageSize,
  startFrom,
  sortDir,
}: PropsType) => {
  const sortDirection = sortDir === 1 ? "desc" : "asc";

  if (process.env.NODE_ENV === "production") {
    const { data } = await apiGetRequest({
      url: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      params: {
        convert: currency,
        sort: sorting,
        limit: String(pageSize),
        start: String(startFrom),
        sort_dir: sortDirection,
      },
    });
    return data as CoinListItem[];
  }

  return mocks.data
    .sort((a, b) => {
      if (sorting === "market_cap") {
        return (a.cmc_rank - b.cmc_rank) * sortDir;
      }

      if (sorting === "name") {
        return a.name.localeCompare(b.name) * sortDir;
      }

      return (b.quote[currency].price - a.quote[currency].price) * sortDir;
    })
    .slice(startFrom - 1, startFrom + pageSize - 1);
};
