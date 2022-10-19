import { CoinListItem } from "../types";

export const getCoinList = async () => {
  const apiKey = process.env.COIN_VIEW_API_KEY;

  if (apiKey === undefined) {
    throw new Error("Please provide API KEY");
  }

  let response = null;

  const data = await new Promise<{ data: CoinListItem[] }>(
    async (resolve, reject) => {
      try {
        response = await fetch(
          "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
          {
            headers: {
              "X-CMC_PRO_API_KEY": apiKey,
            },
          }
        );
      } catch (ex) {
        response = null;
        // error
        console.log(ex);
        reject(ex);
      }
      if (response) {
        // success
        const json = response.json();
        resolve(json);
      }
    }
  );

  return data;
};
