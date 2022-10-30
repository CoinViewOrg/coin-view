type PropsType = {
  url: string;
  params?: Record<string, string>;
};

export const apiGetRequest = async ({ params = {}, url }: PropsType) => {
  const apiKey = process.env.COIN_VIEW_API_KEY;

  if (apiKey === undefined) {
    throw new Error("Please provide API KEY");
  }

  let response = null;

  const requestUrl = new URL(url);
  Object.entries(params).forEach(([param, value]) => {
    requestUrl.searchParams.set(param, value);
  });

  const data = await new Promise<{ data: any }>(async (resolve, reject) => {
    try {
      response = await fetch(requestUrl, {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
        },
      });
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
  });
 
  return data;
};
