import { getCoinList, getCoinsMetadata } from "@coin-view/api";
import {
  CoinListItem,
  CoinMetaType,
  CurrencyType,
  SortingType,
} from "@coin-view/types";
import type { NextPage } from "next";
import React, { useContext } from "react";
import styles from "../styles/Home.module.css";
import {
  CryptoList,
  ListNavigation,
  SearchBar,
  useAutoRefresh,
  useHistoricalData,
  usePaging,
} from "@coin-view/client";
import { AppContext, defaultCurrency } from "@coin-view/context";

const defaultSort: SortingType = "market_cap";
const pageSize = 20;

const fetchList = async (query: string) => {
  const res = await fetch(`/api/list?${query}`);
  const newData = await res.json();
  return newData;
};

const fetchMeta = async (ids: number[]) => {
  const res = await fetch(`/api/meta?ids=${ids.join(",")}`);
  const newData = await res.json();
  return newData;
};

const getListQuery = ({
  pageSize,
  sorting,
  startFrom,
  currency,
  sortDirection,
}: {
  sorting: string;
  startFrom: string | number;
  pageSize: string | number;
  currency: CurrencyType;
  sortDirection: number;
}) => {
  return `sorting=${sorting}&startFrom=${startFrom}&pageSize=${pageSize}&currency=${currency}&sortDir=${sortDirection}`;
};

const getInitialQuery = (currency: CurrencyType) =>
  getListQuery({
    pageSize,
    sorting: defaultSort,
    startFrom: 1,
    currency,
    sortDirection: 1,
  });

const useListLogic = ({ initialMeta }: { initialMeta: any }) => {
  const { currency } = useContext(AppContext);

  const [sorting, setSortingValue] = React.useState<SortingType>(defaultSort);

  const [sortDirection, setSortDirection] = React.useState(1);

  const setSorting = React.useCallback(
    (sort: SortingType) => {
      if (sort === sorting) {
        setSortDirection((dir) => -dir);
      } else {
        setSortDirection(1);
        setSortingValue(sort);
      }
    },
    [sorting]
  );

  const { nextPage, page, prevPage } = usePaging();

  const startFrom = React.useMemo(() => 1 + pageSize * page, [page]);

  const [data, setData] = React.useState<CoinListItem[]>();
  const [meta, setMeta] = React.useState<any>(initialMeta);

  const [loading, setLoading] = React.useState(false);

  const [lastQuery, setLastQuery] = React.useState<string>(
    getInitialQuery(defaultCurrency)
  );

  const sendListQuery = React.useCallback(async (query: string) => {
    setLastQuery(query);
    const newData = await fetchList(query);
    return newData;
  }, []);

  const refreshList = React.useCallback(
    async (showLoading: boolean) => {
      console.log("refetch");
      if (showLoading) {
        setLoading(true);
      }
      const query = getListQuery({
        pageSize,
        sorting,
        startFrom,
        currency,
        sortDirection,
      });
      const newData = await sendListQuery(query);
      setData(newData);
      setLoading(false);
    },
    [sorting, startFrom, sendListQuery, currency, sortDirection]
  );

  React.useEffect(() => {
    const query = getListQuery({
      pageSize,
      sorting,
      startFrom,
      currency,
      sortDirection,
    });

    const criteriaHaveChanged = query !== lastQuery;

    if (criteriaHaveChanged && !loading) {
      console.log("refetch effect", { query, lastQuery, criteriaHaveChanged });
      setLoading(true);
      sendListQuery(query).then(async (data: CoinListItem[]) => {
        const existingMeta = Object.keys(meta || {});
        const newKeys = data
          .map((coin) => coin.id)
          .filter((key) => !existingMeta.includes(String(key)));

        // use cached meta instead of refetching
        if (newKeys.length) {
          const newMeta = await fetchMeta(newKeys);
          setMeta((currentMeta: any) => ({ ...currentMeta, ...newMeta }));
        }

        setData(data);
        setLoading(false);
      });
    }
  }, [
    lastQuery,
    sendListQuery,
    sorting,
    startFrom,
    currency,
    sortDirection,
    meta,
    loading,
  ]);

  useAutoRefresh(refreshList);

  const {
    getHistoricalData,
    historicalData,
    loadingHistorical,
    currentHistoricalData,
  } = useHistoricalData();

  return {
    sorting,
    setSorting,
    page,
    prevPage,
    nextPage,
    data,
    refreshList,
    loading,
    meta,
    currency,
    getHistoricalData,
    historicalData,
    loadingHistorical,
    currentHistoricalData,
  };
};

const Home: NextPage<{
  data: CoinListItem[];
  meta: any;
}> = (props) => {
  const {
    data,
    nextPage,
    page,
    prevPage,
    refreshList,
    setSorting,
    sorting,
    loading,
    meta,
    getHistoricalData,
    historicalData,
    loadingHistorical,
    currentHistoricalData,
  } = useListLogic({ initialMeta: props.meta });

  const cryptoList = React.useMemo(
    () => data || props.data,
    [data, props.data]
  );
  const metaList = React.useMemo(() => meta || props.meta, [meta, props.meta]);

  return (
    <>
      <SearchBar />
      <CryptoList
        cryptoList={cryptoList}
        currentHistoricalData={currentHistoricalData}
        getHistoricalData={getHistoricalData}
        historicalData={historicalData}
        loading={loading}
        loadingHistorical={loadingHistorical}
        metaList={metaList}
        setSorting={setSorting}
      />

      <ListNavigation nextPage={nextPage} page={page} prevPage={prevPage} />
    </>
  );
};

export async function getServerSideProps() {
  // Fetch data from external API
  const fullData = await getCoinList({
    currency: defaultCurrency,
    sorting: defaultSort,
    pageSize: pageSize,
    startFrom: 1,
    sortDir: 1,
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
    Object.entries(fullMeta).map(([id, metaItem]) => [
      id,
      Object.fromEntries(metaKeys.map((key) => [key, metaItem[key]])),
    ])
  ) as Record<string, CoinMetaType>;

  // Pass data to the page via props
  return { props: { data, meta } };
}

export default Home;
