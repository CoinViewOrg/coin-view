import type { NextPage } from "next";
import { NextApiRequestQuery } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import React from "react";
import { CoinListItem, CoinMetaType, CurrencyType } from "@coin-view/types";
import {
  getCoinsMetadata,
  getCryptothresholds,
  getFavoriteCryptos,
  getFilteredCoinList,
} from "@coin-view/api";
import {
  CryptoList,
  ListSwitcher,
  SearchBar,
  useAlertThresholds,
  useFavorites,
  useHistoricalData,
  usePrevious,
} from "@coin-view/client";
import { AppContext, defaultCurrency } from "@coin-view/context";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Favorites: NextPage<{
  data: CoinListItem[];
  meta: any;
}> = (props) => {
  const { data, meta } = props;

  const {
    getHistoricalData,
    historicalData,
    loadingHistorical,
  } = useHistoricalData();

  const { replace } = useRouter();

  const { currency } = React.useContext(AppContext);

  const previousCurrency = usePrevious(currency);

  React.useEffect(() => {
    if (currency !== previousCurrency) {
      replace(`/favorites?currency=${currency}`);
    }
  }, [currency, previousCurrency, replace]);

  const { addToFavorites, favorites } = useFavorites();

  const { setThreshold, thresholds } = useAlertThresholds();

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
        setThreshold={setThreshold}
        thresholds={thresholds}
      />
    </>
  );
};

export async function getServerSideProps({
  query,
  req,
  locale,
}: {
  query: NextApiRequestQuery;
  req: any;
  locale: string;
}) {
  const session = await getSession({ req });
  // Pass data to the page via props

  let favorites = null,
    thresholds = null;

  if (session) {
    // @ts-ignore
    const userid = session?.user?.id;
    favorites = await getFavoriteCryptos(userid);
    favorites = favorites.map((row: any) => row.Cf_CryptoId);
    thresholds = Object.fromEntries(
      (await getCryptothresholds(userid)).map((row: any) => [
        row.Cn_CryptoId,
        row.Cn_Treshold,
      ])
    );
  }

  const traslations = await serverSideTranslations(locale, ["common"]);

  if (!favorites) {
    return {
      props: {
        data: [],
        meta: {},
        session: null,
        favorites: [],
        thresholds: {},
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
      thresholds,
      ...traslations,
    },
  };
}

export default Favorites;
