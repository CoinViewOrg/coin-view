import styles from "./CurrencyToggler.module.css";
import cx from "classnames";
import { CurrencyType } from "@coin-view/types";
import { AppContext } from "@coin-view/context";
import React from "react";
import Image from "next/future/image";

type PropsType = {
  toggleCurrency: () => void;
  className: string;
};

export const CurrencyToggler = ({ toggleCurrency, className }: PropsType) => {
  const { currency } = React.useContext(AppContext);

  return (
    <div className={className} onClick={toggleCurrency}>
      <Image
        className={cx("svg-adaptive", styles.icon)}
        src="/exchange.svg"
        width={30}
        height={30}
        alt="change currency"
      />
      <span className={styles.currencyToggler}>
        <span className={cx({ [styles.currencySelected]: currency === "PLN" })}>
          PLN
        </span>{" "}
        /{" "}
        <span className={cx({ [styles.currencySelected]: currency === "USD" })}>
          USD
        </span>
      </span>
    </div>
  );
};
