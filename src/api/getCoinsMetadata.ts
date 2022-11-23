import { CoinMetaType } from "@coin-view/types";
import { apiGetRequest } from "./apiGetRequest";
import mocks from "./mockData.json";

type PropsType = {
  ids: string[] | number[];
};

export const getCoinsMetadata = async ({ ids }: PropsType) => {
  if (process.env.NODE_ENV === "production") {
    const { data } = await apiGetRequest({
      url: "https://pro-api.coinmarketcap.com/v2/cryptocurrency/info",
      params: {
        id: ids.join(","),
      },
    });

    return data as Record<string, CoinMetaType>;
  }

  return mocks.meta;
};
