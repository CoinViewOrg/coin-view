import { CurrencyType, Quote } from "@coin-view/types";
import styles from "./PercentChange.module.css";

type PropsType = {
  quote: Quote;
  currency: CurrencyType;
};

export const PercentChange = ({ currency, quote }: PropsType) => {
  const availableCurrency: CurrencyType = quote[currency]
    ? currency
    : currency === "PLN"
    ? "USD"
    : "PLN";

  const change = quote[availableCurrency]?.percent_change_24h || 0;
  const formatted = Math.abs(change).toFixed(3);

  const up = change > 0;

  return (
    <div className={styles.container}>
      {up ? (
        <span className={styles.up}>&#8599;</span>
      ) : (
        <span className={styles.down}>&#8600;</span>
      )} {" "}
      {formatted} %
    </div>
  );
};
