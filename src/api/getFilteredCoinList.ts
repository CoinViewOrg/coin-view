import { CoinListItem, CurrencyType, SortingType } from "../types";
import { apiGetRequest } from "./apiGetRequest";
import mocks from "./mockData.json";

type PropsType = {
  currency: CurrencyType;
  phrase?: string;
  ids?: number[];
};

export const getFilteredCoinList = async ({
  currency,
  phrase,
  ids,
}: PropsType) => {
  if (!phrase && !ids) {
    return [];
  }

  const id = ids?.join(",");

  if (process.env.NODE_ENV === "production") {
    const { data } = await apiGetRequest({
      url: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
      params: {
        convert: currency,
        slug: phrase,
        id: id,
      },
    });
    return Object.values(data || {}) as CoinListItem[];
  }

  if (phrase) {
    return mocks.data.filter((item) => item.slug.includes(phrase));
  }

  return mocks.data.filter((item) => ids?.includes(item.id));
};
