import type { NextPage } from "next";
import { NextApiRequestQuery } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import React from "react";
import { CoinListItem, CoinMetaType, CurrencyType } from "@coin-view/types";
import {
  getCoinsMetadata,
  getFavoriteCryptos,
  getFavoriteMarket,
  getFilteredCoinList,
} from "@coin-view/api";
import {
  CryptoList,
  ListSwitcher,
  SearchBar,
  useFavorites,
  useHistoricalData,
  usePrevious,
} from "@coin-view/client";
import { AppContext } from "@coin-view/context";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

const Favorites: NextPage<{
  data: CoinListItem[];
  meta: any;
}> = (props) => {
  const { data, meta } = props;

  const { getHistoricalData, historicalData, loadingHistorical } =
    useHistoricalData();

  const { replace } = useRouter();

  const { currency } = React.useContext(AppContext);

  const previousCurrency = usePrevious(currency);

  React.useEffect(() => {
    if (currency !== previousCurrency) {
      replace(`/favorites?currency=${currency}`);
    }
  }, [currency, previousCurrency, replace]);

  const { addToFavorites, favorites } = useFavorites();

  return (
    <>
      <SearchBar />
      <ListSwitcher />
      <CryptoList
        cryptoList={data}
        getHistoricalData={getHistoricalData}
        historicalData={historicalData}
        loading={false}
        loadingHistorical={loadingHistorical}
        metaList={meta}
        addToFavorites={addToFavorites}
        favorites={favorites}
      />
    </>
  );
};

export async function getServerSideProps({
  query,
  req,
  res,
  locale,
}: {
  query: NextApiRequestQuery;
  req: any;
  res: any;
  locale: string;
}) {
  const session = await unstable_getServerSession(req, res, authOptions);
  // Pass data to the page via props

  let favorites = null,
    favoriteMarket = null;

  const userid = session?.user?.id;
  if (userid) {
    favorites = await getFavoriteCryptos(userid);
    favorites = favorites.map((row: any) => row.Cf_CryptoId);
    favoriteMarket = await getFavoriteMarket(userid);
  }

  const traslations = await serverSideTranslations(locale, ["common"]);

  if (!favorites) {
    return {
      props: {
        data: [],
        meta: {},
        session: null,
        favorites: [],
        favoriteMarketName: null,
        ...traslations,
      },
    };
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
    "slug",
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
      favoriteMarketName: favoriteMarket,
      ...traslations,
    },
  };
}

export default Favorites;
