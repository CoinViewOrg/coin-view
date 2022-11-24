import styles from "./CurrencyToggler.module.css";
import cx from "classnames";
import { CurrencyType } from "@coin-view/types";

type PropsType = {
  currency: CurrencyType;
  toggleCurrency: () => void;
};

export const CurrencyToggler = ({ currency, toggleCurrency }: PropsType) => {
  return (
    <div>
      Currency:
      <span className={styles.currencyToggler} onClick={toggleCurrency}>
        <span className={cx({ [styles.currencySelected]: currency === "PLN" })}>
          PLN
        </span>
        {" "}/{" "}
        <span className={cx({ [styles.currencySelected]: currency === "USD" })}>
          USD
        </span>
      </span>
    </div>
  );
};
