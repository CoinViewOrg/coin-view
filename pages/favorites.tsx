import type { NextPage } from "next";
import { NextApiRequestQuery } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import React from "react";
import { CoinListItem, CoinMetaType, CurrencyType } from "@coin-view/types";
import {
  getCoinsMetadata,
  getFavoriteCryptos,
  getFilteredCoinList,
} from "@coin-view/api";
import {
  CryptoList,
  ListSwitcher,
  SearchBar,
  useHistoricalData,
  usePrevious,
} from "@coin-view/client";
import { AppContext, defaultCurrency } from "@coin-view/context";
import { getSession } from "next-auth/react";

const Favorites: NextPage<{
  data: CoinListItem[];
  meta: any;
}> = (props) => {
  const { data, meta } = props;
  const { query } = useRouter();

  const {
    getHistoricalData,
    historicalData,
    loadingHistorical,
    currentHistoricalData,
  } = useHistoricalData();

  const { replace } = useRouter();

  const { currency } = React.useContext(AppContext);

  const previousCurrency = usePrevious(currency);

  React.useEffect(() => {
    if (currency !== previousCurrency) {
      replace(`/favorites?currency=${currency}`);
    }
  }, [currency, previousCurrency, replace]);

  return (
    <>
      <SearchBar />
      <ListSwitcher />
      <CryptoList
        cryptoList={data}
        currentHistoricalData={currentHistoricalData}
        getHistoricalData={getHistoricalData}
        historicalData={historicalData}
        loading={false}
        loadingHistorical={loadingHistorical}
        metaList={meta}
      />
    </>
  );
};

export async function getServerSideProps({
  query,
  req,
}: {
  query: NextApiRequestQuery;
  req: any;
}) {
  const session = await getSession({ req });
  // Pass data to the page via props

  let favorites = null;

  if (session) {
    // @ts-ignore
    const userid = session?.user?.id;
    favorites = await getFavoriteCryptos(userid);
    favorites = favorites.map((row: any) => row.Cf_CryptoId);
  }

  if (!favorites) {
    return;
  }

  // Fetch data from external API
  const fullData = await getFilteredCoinList({
    currency: query.currency as CurrencyType,
    ids: favorites,
  });

  // pass only needed data
  const dataKeys: Partial<keyof CoinListItem>[] = [
    "id",
    "name",
    "quote",
    "cmc_rank",
    "circulating_supply",
    "symbol",
  ];

  const data = fullData.map((item) =>
    Object.fromEntries(dataKeys.map((key) => [key, item[key]]))
  ) as CoinListItem[];

  // pass only needed meta data
  const metaKeys: Partial<keyof CoinMetaType>[] = ["logo"];

  const fullMeta = await getCoinsMetadata({
    ids: data.map((coin) => String(coin.id)),
  });

  const meta = Object.fromEntries(
    Object.entries(fullMeta || {}).map(([id, metaItem]) => [
      id,
      Object.fromEntries(metaKeys.map((key) => [key, metaItem[key]])),
    ])
  ) as Record<string, CoinMetaType>;

  return {
    props: {
      data,
      meta,
      session: JSON.parse(JSON.stringify(session)),
      favorites,
    },
  };
}

export default Favorites;
