import { apiGetRequest } from "./apiGetRequest";

type PropsType = {
  ids: string[] | number[];
};

export const getCoinsMetadata = async ({ ids }: PropsType) => {
  const { data } = await apiGetRequest({
    url: "https://pro-api.coinmarketcap.com/v2/cryptocurrency/info",
    params: {
      id: ids.join(","),
    },
  });

  return data;
};
