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
};

export function CryptoChart({ historicalData, loading }: PropsType) {
  console.log({ historicalData });
  const data = React.useMemo(
    () =>
      historicalData && {
        labels: historicalData.map(([timestamp]) =>
          new Date(timestamp * 1000).getHours().toFixed(2)
        ),
        datasets: [
          {
            label: "High Price",
            data: historicalData.map((hour) => hour[2]),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "Low Price",
            data: historicalData.map((hour) => hour[3]),
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      },
    [historicalData]
  );

  console.log({data})

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.spinner}>
          <LoadingSpinner />
        </div>
      ) : data ? (
        <Line className={styles.chart} options={options} data={data} />
      ) : (
        "No historical data for given cryptocurrency :("
      )}
    </div>
  );
}
