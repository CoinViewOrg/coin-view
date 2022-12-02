import { CoinListItem, CurrencyType, SortingType } from "../types";
import { apiGetRequest } from "./apiGetRequest";
import mocks from "./mockData.json";

type PropsType = {
  currency: CurrencyType;
  phrase: string;
};

export const getFilteredCoinList = async ({ currency, phrase }: PropsType) => {
  if (process.env.NODE_ENV === "production") {
    const { data } = await apiGetRequest({
      url: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
      params: {
        convert: currency,
        slug: phrase,
      },
    });
    return Object.values(data || {}) as CoinListItem[];
  }

  return mocks.data.filter((item) => item.slug.includes(phrase));
};
