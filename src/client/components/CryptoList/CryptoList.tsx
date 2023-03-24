import React from "react";
import styles from "./CryptoList.module.css";
import cx from "classnames";
import { CoinListItem, CurrencyType, SortingType } from "@coin-view/types";
import { formatPrice, formatVolume } from "@coin-view/utils";
import { PercentChange } from "../PercentChange";
import { CryptoChart } from "../CryptoChart";
import { HistoricalDataType } from "../../hooks";
import { LoadingSpinner } from "../LoadingSpinner";
import { AppContext } from "@coin-view/context";
import Image from "next/image";
import { MarketButton } from "@coin-view/client";
import { useCustomTranslation } from "@coin-view/client";
import { getMarketUrlByType } from "@coin-view/markets";

type PropsType = {
  loading: boolean;
  setSorting?: (sort: SortingType) => void;
  cryptoList: CoinListItem[];
  getHistoricalData: (symbol: string) => void;
  metaList: any;
  currentHistoricalData?: string;
  loadingHistorical: boolean;
  historicalData: Record<CurrencyType, HistoricalDataType>;
  addToFavorites: (evt: any, cryptoId: number) => void;
  favorites: number[];
};
export const CryptoList = ({
  loading,
  setSorting,
  cryptoList,
  getHistoricalData,
  metaList,
  loadingHistorical,
  historicalData,
  addToFavorites,
  favorites,
}: PropsType) => {
  const { currency, favoriteMarketName } = React.useContext(AppContext);
  const { t, language } = useCustomTranslation();
  const [selectedSymbol, setSelectedSymbol] = React.useState<string>();

  const sort = React.useCallback(
    (sorType: SortingType) => {
      if (setSorting) {
        setSorting(sorType);
      }
    },
    [setSorting]
  );

  const selectRow = React.useCallback(
    (symbol: string) => {
      if (symbol === selectedSymbol) {
        setSelectedSymbol(undefined);
        return;
      }
      getHistoricalData(symbol);
      setSelectedSymbol(symbol);
    },
    [getHistoricalData, selectedSymbol]
  );

  const market = React.useMemo(
    () => favoriteMarketName || "COINBASE",
    [favoriteMarketName]
  );

  const listWithLinksToMarkets = React.useMemo(
    () =>
      cryptoList.map((item) => ({
        ...item,
        marketUrl: getMarketUrlByType(market, {
          cryptoSlug: item.slug,
          cryptoSymbol: item.symbol,
          currency,
          locale: language,
        }),
      })),
    [cryptoList, language, currency, market]
  );

  const openInNewTab = React.useCallback(
    (href: string) => window.open(href, "_blank"),
    []
  );

  return (
    <div
      className={cx(styles.listContainer, {
        [styles.loadingBlur]: loading,
        [styles.sortersClickable]: !!setSorting,
      })}
      data-testid="crypto_list"
    >
      <div className={cx(styles.gridHeader, styles.grid)}>
        <div className={cx(styles.gridStar)}></div>
        <div
          className={cx(styles.gridRank, styles.sorter)}
          onClick={() => sort("market_cap")}
        >
          {t("rank")}
        </div>
        <div className={styles.gridIcon}>{""}</div>
        <div
          className={cx(styles.gridName, styles.sorter)}
          onClick={() => sort("name")}
        >
          {t("name")}
        </div>

        <div
          className={cx(styles.gridPrice, styles.sorter)}
          onClick={() => sort("price")}
        >
          {t("price")}
        </div>
        <div
          className={cx(styles.gridPercentChange, styles.sorter)}
          onClick={() => sort("percent_change_24h")}
        >
          24h %
        </div>
        <div
          className={cx(styles.gridVolume, styles.sorter)}
          onClick={() => sort("volume_24h")}
        >
          {t("volume24h")}
        </div>
      </div>
      {listWithLinksToMarkets.map((item) => (
        <React.Fragment key={item.id}>
          <div
            className={cx(styles.grid, styles.listItem)}
            onClick={() => selectRow(item.symbol)}
            data-testid={`crypto_list_item_${item.symbol}`}
          >
            <div
              className={styles.gridStar}
              onClick={(evt) => addToFavorites(evt, item.id)}
            >
              {favorites?.includes(item.id) ? (
                <Image
                  src={"/star-full.svg"}
                  width={15}
                  height={15}
                  alt="star"
                />
              ) : (
                <Image
                  src={"/star-empty.svg"}
                  className="svg-adaptive"
                  width={15}
                  height={15}
                  alt="empty star"
                />
              )}
            </div>
            <div className={styles.gridRank}>{item.cmc_rank}</div>
            <div className={styles.gridIcon}>
              <Image
                alt={`${item.symbol} logo`}
                className={styles.cryptoIcon}
                src={metaList[item.id]?.logo}
                width={22}
                height={22}
              ></Image>
            </div>
            <div className={styles.gridName}>{item.name} </div>
            <div className={styles.gridPrice}>
              {formatPrice(item.quote, currency)}
            </div>
            <div className={styles.gridPercentChange}>
              <PercentChange currency={currency} quote={item.quote} />
            </div>
            <div className={styles.gridVolume}>
              {formatVolume(item.quote, currency)}{" "}
            </div>
          </div>
          {selectedSymbol === item.symbol && (
            <div className={styles.cryptoDetails}>
              <CryptoChart
                className={styles.chart}
                loading={loadingHistorical}
                historicalData={historicalData[currency][item.symbol]}
              />
              <MarketButton
                className={styles.marketButton}
                caption={t("buy_on")}
                marketName={market}
                onClick={() => openInNewTab(item.marketUrl)}
              />
            </div>
          )}
        </React.Fragment>
      ))}
      {loading && (
        <div className={styles.spinner}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};
