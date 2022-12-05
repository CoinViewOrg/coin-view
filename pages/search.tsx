import type { NextPage } from "next";
import { NextApiRequestQuery } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import React from "react";
import { CoinListItem, CoinMetaType, CurrencyType } from "@coin-view/types";
import { getCoinsMetadata, getFilteredCoinList } from "@coin-view/api";
import {
  CryptoList,
  SearchBar,
  useHistoricalData,
  usePrevious,
} from "@coin-view/client";

const Search: NextPage<{
  data: CoinListItem[];
  meta: any;
  currency: CurrencyType;
}> = (props) => {
  const { currency, data, meta } = props;
  const { query } = useRouter();
  const phrase = query.phrase as string;

  const {
    getHistoricalData,
    historicalData,
    loadingHistorical,
    currentHistoricalData,
  } = useHistoricalData({ currency });

  const { replace } = useRouter();

  const previousCurrency = usePrevious(currency);

  React.useEffect(() => {
    if (currency !== previousCurrency) {
      replace(`/search?phrase=${phrase}&currency=${currency}`);
    }
  }, [currency, previousCurrency, replace, phrase]);

  return (
    <>
      <SearchBar initialValue={phrase} currency={currency} />
      <CryptoList
        cryptoList={data}
        currency={currency}
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
}: {
  query: NextApiRequestQuery;
}) {
  // Fetch data from external API
  const fullData = await getFilteredCoinList({
    currency: query.currency as CurrencyType,
    phrase: query.phrase as string,
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

  // Pass data to the page via props
  return { props: { data, meta } };
}

export default Search;
