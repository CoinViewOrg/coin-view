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
import { ThresholdSelect } from "@coin-view/client";
import { useCustomTranslation } from "@coin-view/client";

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
  thresholds: Record<number, number>;
  setThreshold: (cryptoId: number, threshold: number) => void;
};
export const CryptoList = ({
  loading,
  setSorting,
  cryptoList,
  getHistoricalData,
  metaList,
  currentHistoricalData,
  loadingHistorical,
  historicalData,
  addToFavorites,
  favorites,
  thresholds,
  setThreshold,
}: PropsType) => {
  const { currency } = React.useContext(AppContext);
  const { t } = useCustomTranslation();
  const sort = React.useCallback(
    (sorType: SortingType) => {
      if (setSorting) {
        setSorting(sorType);
      }
    },
    [setSorting]
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
      {cryptoList.map((item) => (
        <React.Fragment key={item.id}>
          <div
            className={cx(styles.grid, styles.listItem)}
            onClick={() => getHistoricalData(item.symbol)}
            data-testid={`crypto_list_item_${item.symbol}`}
          >
            <div
              className={styles.gridStar}
              onClick={(evt) => addToFavorites(evt, item.id)}
            >
              {favorites?.includes(item.id) ? (
                <Image src={"/star-full.svg"} width={15} height={15} />
              ) : (
                <Image
                  src={"/star-empty.svg"}
                  className="svg-adaptive"
                  width={15}
                  height={15}
                />
              )}
            </div>
            <div className={styles.gridRank}>{item.cmc_rank}</div>
            <div className={styles.gridIcon}>
              <img
                alt={`${item.symbol} logo`}
                className={styles.cryptoIcon}
                src={metaList[item.id]?.logo}
              ></img>
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
          {currentHistoricalData === item.symbol && (
            <div className={styles.cryptoDetails}>
              <ThresholdSelect
                className={styles.thresholdSelect}
                cryptoId={item.id}
                cryptoThresholds={thresholds}
                setCryptothreshold={setThreshold}
              />
              <CryptoChart
                className={styles.chart}
                loading={loadingHistorical}
                historicalData={historicalData[currency][item.symbol]}
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
