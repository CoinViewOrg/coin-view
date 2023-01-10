import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./CryptoChart.module.css";
import { LoadingSpinner } from "../LoadingSpinner";
import cx from "classnames";
import { useCustomTranslation } from "@coin-view/client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    // title: {
    //   display: true,
    //   text: "Chart.js Line Chart",
    // },
  },
};

/**
historicalData: [
  0 CloseTime,
  1 OpenPrice,
  2 HighPrice,
  3 LowPrice,
  4 ClosePrice,
  5 Volume,
  6 QuoteVolume
]
 */
type PropsType = {
  historicalData: number[][] | null;
  loading: boolean;
  className?: string;
};

export function CryptoChart({ historicalData, loading, className }: PropsType) {
  const { t } = useCustomTranslation();
  const data = React.useMemo(
    () =>
      historicalData && {
        labels: historicalData.map(([timestamp]) =>
          new Date(timestamp * 1000).getHours().toFixed(2)
        ),
        datasets: [
          {
            label: t("High_price"),
            data: historicalData.map((hour) => hour[2]),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: t("Low_price"),
            data: historicalData.map((hour) => hour[3]),
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      },
    [historicalData]
  );

  return (
    <div className={cx(styles.container, className)}>
      {loading ? (
        <div className={styles.spinner}>
          <LoadingSpinner />
        </div>
      ) : data ? (
        <Line className={styles.chart} options={options} data={data} />
      ) : (
        t("chart_no_hist_data")
      )}
    </div>
  );
}
